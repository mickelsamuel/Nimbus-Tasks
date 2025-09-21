import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Environment and release information
  environment: process.env.NODE_ENV,
  release: process.env.npm_package_version || '1.0.0',

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Error filtering for server-side
  beforeSend(event, hint) {
    const error = hint.originalException

    if (error instanceof Error) {
      // Filter out database connection errors during startup
      if (error.message.includes('ECONNREFUSED') && error.message.includes('5432')) {
        return null
      }

      // Filter out known temporary errors
      if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
        return null
      }
    }

    return event
  },

  // Integration configuration
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express(),
    new Sentry.Integrations.Prisma(),
  ],

  // Tag all events with service information
  initialScope: {
    tags: {
      service: 'nimbus-tasks',
      component: 'web-server',
    },
  },
})