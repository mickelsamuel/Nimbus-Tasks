import { NextRequest, NextResponse } from 'next/server'
import Redis from 'ioredis'

interface RateLimitConfig {
  requests: number
  window: string // e.g., '15m', '1h', '1d'
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (request: NextRequest) => string
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  totalRequests: number
}

// Convert time string to seconds
function parseTimeWindow(window: string): number {
  const match = window.match(/^(\d+)([smhd])$/)
  if (!match) throw new Error(`Invalid time window format: ${window}`)

  const [, value, unit] = match
  const multipliers = { s: 1, m: 60, h: 3600, d: 86400 }

  return parseInt(value) * multipliers[unit as keyof typeof multipliers]
}

// Get client IP address with proxy support
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')

  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwardedFor) return forwardedFor.split(',')[0].trim()

  // Fallback to request IP
  return request.ip || 'unknown'
}

// Default key generator based on IP
function defaultKeyGenerator(request: NextRequest): string {
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'

  // Create a more specific key for better rate limiting
  return `rate_limit:${ip}:${request.nextUrl.pathname}`
}

// In-memory fallback when Redis is not available
class MemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      for (const [key, value] of this.store.entries()) {
        if (value.resetTime < now) {
          this.store.delete(key)
        }
      }
    }, 5 * 60 * 1000)
  }

  async increment(key: string, windowSeconds: number): Promise<{ count: number; resetTime: number }> {
    const now = Date.now()
    const resetTime = now + (windowSeconds * 1000)

    const existing = this.store.get(key)

    if (!existing || existing.resetTime < now) {
      // Create new or reset expired entry
      const entry = { count: 1, resetTime }
      this.store.set(key, entry)
      return entry
    }

    // Increment existing entry
    existing.count++
    return existing
  }

  destroy() {
    clearInterval(this.cleanupInterval)
    this.store.clear()
  }
}

let memoryStore: MemoryStore | null = null
let redisClient: Redis | null = null

// Initialize Redis client if available
function getRedisClient(): Redis | null {
  if (redisClient) return redisClient

  if (process.env.REDIS_URL) {
    try {
      redisClient = new Redis(process.env.REDIS_URL, {
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true
      })
      return redisClient
    } catch (error) {
      console.warn('Failed to connect to Redis for rate limiting:', error)
    }
  }

  return null
}

// Get memory store fallback
function getMemoryStore(): MemoryStore {
  if (!memoryStore) {
    memoryStore = new MemoryStore()
  }
  return memoryStore
}

// Redis-based rate limiting
async function rateLimitWithRedis(
  redis: Redis,
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const windowSeconds = parseTimeWindow(config.window)
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - windowSeconds

  try {
    // Use Redis sorted set for sliding window rate limiting
    const multi = redis.multi()

    // Remove expired entries
    multi.zremrangebyscore(key, 0, windowStart)

    // Count current requests in window
    multi.zcard(key)

    // Add current request
    multi.zadd(key, now, `${now}-${Math.random()}`)

    // Set expiry on the key
    multi.expire(key, windowSeconds)

    const results = await multi.exec()

    if (!results || results.some(result => result[0] !== null)) {
      throw new Error('Redis rate limit operation failed')
    }

    const totalRequests = results[1][1] as number + 1 // +1 for the current request
    const remaining = Math.max(0, config.requests - totalRequests)
    const resetTime = (now + windowSeconds) * 1000 // Convert to milliseconds

    return {
      success: totalRequests <= config.requests,
      limit: config.requests,
      remaining,
      resetTime,
      totalRequests
    }
  } catch (error) {
    console.error('Redis rate limiting error:', error)
    // Fallback to memory store
    return rateLimitWithMemory(key, config)
  }
}

// Memory-based rate limiting fallback
async function rateLimitWithMemory(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const windowSeconds = parseTimeWindow(config.window)
  const store = getMemoryStore()

  const result = await store.increment(key, windowSeconds)
  const remaining = Math.max(0, config.requests - result.count)

  return {
    success: result.count <= config.requests,
    limit: config.requests,
    remaining,
    resetTime: result.resetTime,
    totalRequests: result.count
  }
}

// Main rate limiting function
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const keyGenerator = config.keyGenerator || defaultKeyGenerator
  const key = keyGenerator(request)

  const redis = getRedisClient()

  if (redis && redis.status === 'ready') {
    return rateLimitWithRedis(redis, key, config)
  } else {
    return rateLimitWithMemory(key, config)
  }
}

// Rate limiting middleware factory
export function createRateLimitMiddleware(configs: Record<string, RateLimitConfig>) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const pathname = request.nextUrl.pathname

    // Find matching configuration
    let config = configs[pathname]
    if (!config) {
      // Check for wildcard patterns
      for (const [pattern, patternConfig] of Object.entries(configs)) {
        if (pattern.includes('*') && pathname.startsWith(pattern.replace('*', ''))) {
          config = patternConfig
          break
        }
      }
    }

    // Use default config if no specific config found
    if (!config) {
      config = configs.default || { requests: 60, window: '1h' }
    }

    try {
      const result = await rateLimit(request, config)

      // Always add rate limit headers
      const response = result.success
        ? NextResponse.next()
        : NextResponse.json(
            {
              error: 'Too Many Requests',
              message: `Rate limit exceeded. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`,
              retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
            },
            { status: 429 }
          )

      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', result.limit.toString())
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
      response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString())
      response.headers.set('X-RateLimit-Policy', `${config.requests};w=${config.window}`)

      if (!result.success) {
        response.headers.set('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000).toString())
      }

      return response
    } catch (error) {
      console.error('Rate limiting error:', error)
      // Allow request to proceed if rate limiting fails
      return NextResponse.next()
    }
  }
}

// Rate limit configurations for different endpoints
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Authentication endpoints - stricter limits
  '/api/auth/signin': {
    requests: 5,
    window: '15m',
    keyGenerator: (req) => `auth:signin:${getClientIP(req)}`
  },
  '/api/auth/signup': {
    requests: 3,
    window: '15m',
    keyGenerator: (req) => `auth:signup:${getClientIP(req)}`
  },
  '/api/auth/reset-password': {
    requests: 3,
    window: '15m',
    keyGenerator: (req) => `auth:reset:${getClientIP(req)}`
  },

  // File upload endpoints
  '/api/upload': {
    requests: 10,
    window: '1h',
    keyGenerator: (req) => `upload:${getClientIP(req)}`
  },

  // API endpoints - generous but not unlimited
  '/api/*': {
    requests: 100,
    window: '1h',
    keyGenerator: (req) => `api:${getClientIP(req)}`
  },

  // Admin endpoints - higher limits for authenticated users
  '/api/admin/*': {
    requests: 200,
    window: '1h',
    keyGenerator: (req) => `admin:${getClientIP(req)}`
  },

  // Contact/support endpoints
  '/api/contact': {
    requests: 3,
    window: '1h',
    keyGenerator: (req) => `contact:${getClientIP(req)}`
  },

  // Health checks - very permissive
  '/api/health': {
    requests: 1000,
    window: '1h',
    keyGenerator: (req) => `health:${getClientIP(req)}`
  },

  // Default rate limit for all other endpoints
  default: {
    requests: 60,
    window: '1h',
    keyGenerator: defaultKeyGenerator
  }
}

// Cleanup function for graceful shutdown
export function cleanup() {
  if (memoryStore) {
    memoryStore.destroy()
    memoryStore = null
  }

  if (redisClient) {
    redisClient.disconnect()
    redisClient = null
  }
}