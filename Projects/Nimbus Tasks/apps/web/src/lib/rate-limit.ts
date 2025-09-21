import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "~/env";

// In-memory fallback for development
class InMemoryRatelimit {
  private cache = new Map<string, { count: number; resetTime: number }>();
  private limit: number;
  private windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  async limit(identifier: string): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: Date;
  }> {
    const now = Date.now();
    const key = identifier;
    const current = this.cache.get(key);

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      for (const [k, v] of this.cache.entries()) {
        if (v.resetTime <= now) {
          this.cache.delete(k);
        }
      }
    }

    if (!current || current.resetTime <= now) {
      // First request or window expired
      const resetTime = now + this.windowMs;
      this.cache.set(key, { count: 1, resetTime });

      return {
        success: true,
        limit: this.limit,
        remaining: this.limit - 1,
        reset: new Date(resetTime),
      };
    }

    if (current.count >= this.limit) {
      return {
        success: false,
        limit: this.limit,
        remaining: 0,
        reset: new Date(current.resetTime),
      };
    }

    // Increment count
    current.count += 1;
    this.cache.set(key, current);

    return {
      success: true,
      limit: this.limit,
      remaining: this.limit - current.count,
      reset: new Date(current.resetTime),
    };
  }
}

// Create Redis client for production or fallback for development
let redis: Redis | null = null;

if (env.NODE_ENV === "production" && process.env.UPSTASH_REDIS_REST_URL) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

// Rate limiters by type
export const rateLimiters = {
  // API rate limiting (per user)
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "1h"),
        analytics: true,
      })
    : new InMemoryRatelimit(100, 60 * 60 * 1000), // 100 requests per hour

  // Authentication rate limiting (per IP)
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "15m"),
        analytics: true,
      })
    : new InMemoryRatelimit(10, 15 * 60 * 1000), // 10 attempts per 15 minutes

  // File upload rate limiting (per user)
  upload: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, "1h"),
        analytics: true,
      })
    : new InMemoryRatelimit(20, 60 * 60 * 1000), // 20 uploads per hour

  // Comment/task creation (per user)
  creation: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(50, "1h"),
        analytics: true,
      })
    : new InMemoryRatelimit(50, 60 * 60 * 1000), // 50 creations per hour
};

export type RateLimitType = keyof typeof rateLimiters;

/**
 * Apply rate limiting to a request
 */
export async function checkRateLimit(
  type: RateLimitType,
  identifier: string
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}> {
  const limiter = rateLimiters[type];
  return await limiter.limit(identifier);
}

/**
 * Get rate limit identifier for different contexts
 */
export function getRateLimitIdentifier(
  type: "user" | "ip",
  value: string,
  prefix?: string
): string {
  const base = `${type}:${value}`;
  return prefix ? `${prefix}:${base}` : base;
}

/**
 * Middleware helper for rate limiting
 */
export function createRateLimitMiddleware(
  type: RateLimitType,
  getIdentifier: (context: any) => string
) {
  return async (context: any) => {
    const identifier = getIdentifier(context);
    const result = await checkRateLimit(type, identifier);

    if (!result.success) {
      const error = new Error("Rate limit exceeded");
      (error as any).code = "TOO_MANY_REQUESTS";
      (error as any).rateLimitInfo = result;
      throw error;
    }

    return result;
  };
}