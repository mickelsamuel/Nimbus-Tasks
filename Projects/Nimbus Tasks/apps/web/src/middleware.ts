import { NextRequest, NextResponse } from 'next/server'
import { securityMiddleware } from '~/lib/security/headers'
import { createRateLimitMiddleware, RATE_LIMIT_CONFIGS } from '~/lib/security/rate-limit'

// Create rate limiting middleware
const rateLimitMiddleware = createRateLimitMiddleware(RATE_LIMIT_CONFIGS)

export async function middleware(request: NextRequest) {
  const start = Date.now()

  // Add request ID for tracing
  const requestId = crypto.randomUUID()

  // Skip rate limiting for static assets and health checks
  const pathname = request.nextUrl.pathname
  const skipRateLimit = pathname.startsWith('/_next/') ||
                       pathname.startsWith('/favicon') ||
                       pathname === '/api/health' ||
                       pathname === '/api/ready'

  let response: NextResponse

  // Apply rate limiting first (if not skipped)
  if (!skipRateLimit) {
    const rateLimitResponse = await rateLimitMiddleware(request)
    if (rateLimitResponse && rateLimitResponse.status === 429) {
      // Rate limit exceeded, return early with security headers
      response = securityMiddleware(request)

      // Copy rate limit headers
      for (const [key, value] of rateLimitResponse.headers.entries()) {
        response.headers.set(key, value)
      }

      // Set response body for rate limit
      return new NextResponse(await rateLimitResponse.text(), {
        status: 429,
        headers: response.headers
      })
    }
  }

  // Apply security headers to all responses
  response = securityMiddleware(request)

  // Add request tracing headers
  response.headers.set('x-request-id', requestId)
  response.headers.set('x-response-time', `${Date.now() - start}ms`)

  // Add security context headers
  response.headers.set('x-content-type-options', 'nosniff')
  response.headers.set('x-frame-options', 'DENY')
  response.headers.set('x-xss-protection', '1; mode=block')

  // Add cache control for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('cache-control', 'no-store, no-cache, must-revalidate, private')
  }

  // Add environment info in development
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('x-environment', 'development')
  }

  return response
}

export const config = {
  // Apply middleware to all routes except static files
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}