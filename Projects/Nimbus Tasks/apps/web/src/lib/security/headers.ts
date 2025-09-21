import { NextRequest, NextResponse } from 'next/server'

export interface SecurityHeaders {
  'Content-Security-Policy'?: string
  'X-Content-Type-Options': string
  'X-Frame-Options': string
  'X-XSS-Protection': string
  'Referrer-Policy': string
  'Permissions-Policy': string
  'Strict-Transport-Security'?: string
  'X-DNS-Prefetch-Control': string
}

export function getSecurityHeaders(isDevelopment = false): SecurityHeaders {
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:",
    "img-src 'self' data: blob: https: *.amazonaws.com *.cloudfront.net",
    "media-src 'self' blob: *.amazonaws.com *.cloudfront.net",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    // Allow connections to our APIs and external services
    "connect-src 'self' https://*.amazonaws.com https://*.honeycomb.io https://*.sentry.io https://*.cloudfront.net https://api.github.com wss: ws:",
    // Worker sources for web workers if needed
    "worker-src 'self' blob:",
    // Manifest for PWA
    "manifest-src 'self'",
    // Child sources for iframes (none allowed)
    "child-src 'none'",
    // Frame sources for iframes (none allowed)
    "frame-src 'none'"
  ]

  // Loosen CSP in development
  if (isDevelopment) {
    cspDirectives[1] = "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live"
    cspDirectives[11] = "connect-src 'self' ws: wss: http: https:"
  }

  const headers: SecurityHeaders = {
    // Content Security Policy
    'Content-Security-Policy': cspDirectives.join('; '),

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // XSS Protection (legacy but still good to have)
    'X-XSS-Protection': '1; mode=block',

    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Control browser features
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'bluetooth=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', '),

    // Disable DNS prefetching
    'X-DNS-Prefetch-Control': 'off',
  }

  // Only add HSTS in production with HTTPS
  if (!isDevelopment) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
  }

  return headers
}

export function applySecurityHeaders(response: NextResponse, isDevelopment = false): NextResponse {
  const headers = getSecurityHeaders(isDevelopment)

  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value)
    }
  })

  return response
}

// Middleware function for applying security headers
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()
  const isDevelopment = process.env.NODE_ENV === 'development'

  return applySecurityHeaders(response, isDevelopment)
}

// Rate limiting configuration by endpoint
export const RATE_LIMIT_CONFIG = {
  '/api/auth/signin': { requests: 5, window: '15m' },
  '/api/auth/signup': { requests: 3, window: '15m' },
  '/api/auth/reset-password': { requests: 3, window: '15m' },
  '/api/contact': { requests: 3, window: '1h' },
  '/api/upload': { requests: 10, window: '1h' },
  '/api/admin': { requests: 100, window: '1h' },
  default: { requests: 60, window: '1h' },
} as const

// Input validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  organizationSlug: /^[a-z0-9-]{3,30}$/,
  filename: /^[a-zA-Z0-9._-]+$/,
} as const

// File upload restrictions
export const FILE_UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
  prohibitedTypes: [
    'application/x-msdownload',
    'application/x-msdos-program',
    'application/x-executable',
    'application/octet-stream',
    'application/x-shockwave-flash',
    'application/javascript',
    'text/javascript',
  ],
} as const

// Pagination defaults and limits
export const PAGINATION_CONFIG = {
  defaultLimit: 20,
  maxLimit: 100,
  defaultOffset: 0,
} as const