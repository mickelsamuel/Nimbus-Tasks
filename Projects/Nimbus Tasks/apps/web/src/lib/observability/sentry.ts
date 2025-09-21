import * as Sentry from '@sentry/nextjs'
import { env } from '~/env'

export function initializeSentry() {
  if (process.env.NODE_ENV !== 'production' || !process.env.SENTRY_DSN) {
    console.log('🐛 Skipping Sentry initialization (development or no DSN)')
    return
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Environment and release information
    environment: env.NODE_ENV,
    release: process.env.npm_package_version || '1.0.0',

    // Performance monitoring
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Error filtering
    beforeSend(event, hint) {
      // Filter out known non-critical errors
      const error = hint.originalException

      if (error instanceof Error) {
        // Filter out connection errors that are likely client-side
        if (error.message.includes('fetch')) {
          return null
        }

        // Filter out cancelled requests
        if (error.message.includes('AbortError')) {
          return null
        }
      }

      return event
    },

    // Integration configuration
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app: undefined }),
    ],

    // Tag all events with service information
    initialScope: {
      tags: {
        service: 'nimbus-tasks',
        component: 'web-app',
      },
    },
  })

  console.log('🐛 Sentry initialized successfully')
}

// Helper functions for manual error reporting
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional_info', context)
    }
    Sentry.captureException(error)
  })
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional_info', context)
    }
    Sentry.captureMessage(message, level)
  })
}

// User context helpers
export function setUserContext(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  })
}

export function clearUserContext() {
  Sentry.setUser(null)
}

// Transaction helpers for performance monitoring
export function startTransaction(name: string, op?: string) {
  return Sentry.startTransaction({
    name,
    op: op || 'http.server',
  })
}

// Breadcrumb helpers
export function addBreadcrumb(message: string, category?: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category: category || 'custom',
    data,
    timestamp: Date.now() / 1000,
  })
}

// Export Sentry for advanced usage
export { Sentry }