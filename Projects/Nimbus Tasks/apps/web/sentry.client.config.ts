import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment and release information
  environment: process.env.NODE_ENV,
  release: process.env.npm_package_version || '1.0.0',

  // Performance monitoring (lower rate for client-side)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,

  // Replay sessions for debugging
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
  replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Error filtering for client-side
  beforeSend(event, hint) {
    // Filter out known client-side errors
    const error = hint.originalException

    if (error instanceof Error) {
      // Filter out network errors
      if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        return null
      }

      // Filter out extension-related errors
      if (error.stack?.includes('extension://') || error.stack?.includes('moz-extension://')) {
        return null
      }

      // Filter out ResizeObserver errors (common and not actionable)
      if (error.message.includes('ResizeObserver')) {
        return null
      }
    }

    return event
  },

  // Integration configuration
  integrations: [
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Tag all events with service information
  initialScope: {
    tags: {
      service: 'nimbus-tasks',
      component: 'web-client',
    },
  },
})