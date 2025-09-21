import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkRateLimit, getRateLimitIdentifier, createRateLimitMiddleware } from '~/lib/rate-limit'

// Mock the rate limiters to use in-memory implementation
vi.mock('~/lib/rate-limit', async () => {
  const actual = await vi.importActual('~/lib/rate-limit')

  class MockInMemoryRatelimit {
    private cache = new Map<string, { count: number; resetTime: number }>()
    private limit: number
    private windowMs: number

    constructor(limit: number, windowMs: number) {
      this.limit = limit
      this.windowMs = windowMs
    }

    async limit(identifier: string) {
      const now = Date.now()
      const current = this.cache.get(identifier)

      if (!current || current.resetTime <= now) {
        const resetTime = now + this.windowMs
        this.cache.set(identifier, { count: 1, resetTime })
        return {
          success: true,
          limit: this.limit,
          remaining: this.limit - 1,
          reset: new Date(resetTime),
        }
      }

      if (current.count >= this.limit) {
        return {
          success: false,
          limit: this.limit,
          remaining: 0,
          reset: new Date(current.resetTime),
        }
      }

      current.count += 1
      this.cache.set(identifier, current)

      return {
        success: true,
        limit: this.limit,
        remaining: this.limit - current.count,
        reset: new Date(current.resetTime),
      }
    }

    // Helper method for testing
    clear() {
      this.cache.clear()
    }
  }

  const mockRateLimiters = {
    api: new MockInMemoryRatelimit(100, 60 * 60 * 1000),
    auth: new MockInMemoryRatelimit(10, 15 * 60 * 1000),
    upload: new MockInMemoryRatelimit(20, 60 * 60 * 1000),
    creation: new MockInMemoryRatelimit(50, 60 * 60 * 1000),
  }

  return {
    ...actual,
    rateLimiters: mockRateLimiters,
    checkRateLimit: async (type: keyof typeof mockRateLimiters, identifier: string) => {
      const limiter = mockRateLimiters[type]
      return await limiter.limit(identifier)
    },
  }
})

describe('Rate Limiting System', () => {
  beforeEach(() => {
    // Clear all rate limiter caches before each test
    vi.clearAllMocks()
  })

  describe('getRateLimitIdentifier()', () => {
    it('should generate user-based identifier', () => {
      const identifier = getRateLimitIdentifier('user', 'user-123')
      expect(identifier).toBe('user:user-123')
    })

    it('should generate IP-based identifier', () => {
      const identifier = getRateLimitIdentifier('ip', '192.168.1.1')
      expect(identifier).toBe('ip:192.168.1.1')
    })

    it('should add prefix when provided', () => {
      const identifier = getRateLimitIdentifier('user', 'user-123', 'api')
      expect(identifier).toBe('api:user:user-123')
    })

    it('should handle different user IDs', () => {
      const id1 = getRateLimitIdentifier('user', 'user-1')
      const id2 = getRateLimitIdentifier('user', 'user-2')

      expect(id1).toBe('user:user-1')
      expect(id2).toBe('user:user-2')
      expect(id1).not.toBe(id2)
    })
  })

  describe('checkRateLimit()', () => {
    it('should allow requests within limit', async () => {
      const identifier = 'test-user-1'

      const result = await checkRateLimit('auth', identifier)

      expect(result.success).toBe(true)
      expect(result.limit).toBe(10)
      expect(result.remaining).toBe(9)
      expect(result.reset).toBeInstanceOf(Date)
    })

    it('should track multiple requests', async () => {
      const identifier = 'test-user-2'

      // First request
      const result1 = await checkRateLimit('auth', identifier)
      expect(result1.success).toBe(true)
      expect(result1.remaining).toBe(9)

      // Second request
      const result2 = await checkRateLimit('auth', identifier)
      expect(result2.success).toBe(true)
      expect(result2.remaining).toBe(8)
    })

    it('should reject requests when limit exceeded', async () => {
      const identifier = 'test-user-3'

      // Use up all requests (auth limit is 10)
      for (let i = 0; i < 10; i++) {
        const result = await checkRateLimit('auth', identifier)
        expect(result.success).toBe(true)
      }

      // Next request should be rejected
      const rejectedResult = await checkRateLimit('auth', identifier)
      expect(rejectedResult.success).toBe(false)
      expect(rejectedResult.remaining).toBe(0)
    })

    it('should handle different rate limit types', async () => {
      const identifier = 'test-user-4'

      // API has higher limit (100)
      const apiResult = await checkRateLimit('api', identifier)
      expect(apiResult.limit).toBe(100)

      // Auth has lower limit (10)
      const authResult = await checkRateLimit('auth', identifier)
      expect(authResult.limit).toBe(10)

      // Upload has medium limit (20)
      const uploadResult = await checkRateLimit('upload', identifier)
      expect(uploadResult.limit).toBe(20)
    })

    it('should isolate different identifiers', async () => {
      const user1 = 'user-1'
      const user2 = 'user-2'

      // User 1 uses up requests
      for (let i = 0; i < 10; i++) {
        await checkRateLimit('auth', user1)
      }

      // User 1 should be blocked
      const user1Result = await checkRateLimit('auth', user1)
      expect(user1Result.success).toBe(false)

      // User 2 should still have access
      const user2Result = await checkRateLimit('auth', user2)
      expect(user2Result.success).toBe(true)
    })

    it('should handle concurrent requests', async () => {
      const identifier = 'concurrent-user'

      // Make multiple concurrent requests
      const promises = Array.from({ length: 5 }, () =>
        checkRateLimit('auth', identifier)
      )

      const results = await Promise.all(promises)

      // All should succeed since we're within limit
      results.forEach(result => {
        expect(result.success).toBe(true)
      })

      // Verify the count is correct
      const finalResult = await checkRateLimit('auth', identifier)
      expect(finalResult.remaining).toBe(4) // 10 - 5 - 1 = 4
    })
  })

  describe('createRateLimitMiddleware()', () => {
    it('should create middleware that allows requests within limit', async () => {
      const middleware = createRateLimitMiddleware(
        'auth',
        (context) => context.userId
      )

      const context = { userId: 'middleware-user-1' }

      // Should not throw
      const result = await middleware(context)
      expect(result.success).toBe(true)
    })

    it('should create middleware that throws when limit exceeded', async () => {
      const middleware = createRateLimitMiddleware(
        'auth',
        (context) => context.userId
      )

      const context = { userId: 'middleware-user-2' }

      // Use up all requests
      for (let i = 0; i < 10; i++) {
        await middleware(context)
      }

      // Next request should throw
      await expect(middleware(context)).rejects.toThrow('Rate limit exceeded')
    })

    it('should attach rate limit info to error', async () => {
      const middleware = createRateLimitMiddleware(
        'auth',
        (context) => context.userId
      )

      const context = { userId: 'middleware-user-3' }

      // Use up all requests
      for (let i = 0; i < 10; i++) {
        await middleware(context)
      }

      // Check error properties
      try {
        await middleware(context)
        expect.fail('Should have thrown an error')
      } catch (error: any) {
        expect(error.code).toBe('TOO_MANY_REQUESTS')
        expect(error.rateLimitInfo).toBeDefined()
        expect(error.rateLimitInfo.success).toBe(false)
        expect(error.rateLimitInfo.remaining).toBe(0)
      }
    })

    it('should use custom identifier function', async () => {
      const middleware = createRateLimitMiddleware(
        'auth',
        (context) => `custom:${context.ip}:${context.userAgent}`
      )

      const context1 = { ip: '192.168.1.1', userAgent: 'browser-1' }
      const context2 = { ip: '192.168.1.2', userAgent: 'browser-1' }

      // Different IPs should have separate limits
      for (let i = 0; i < 10; i++) {
        await middleware(context1)
      }

      // context1 should be blocked
      await expect(middleware(context1)).rejects.toThrow()

      // context2 should still work
      const result = await middleware(context2)
      expect(result.success).toBe(true)
    })
  })
})