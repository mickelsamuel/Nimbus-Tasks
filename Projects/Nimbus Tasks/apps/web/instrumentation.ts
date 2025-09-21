// Next.js instrumentation file
// This file is automatically loaded by Next.js when the application starts
export async function register() {
  // Initialize observability first
  if (process.env.NODE_ENV === 'production') {
    // Initialize OpenTelemetry (must be first)
    const { initializeTelemetry } = await import('~/lib/observability/telemetry')
    initializeTelemetry()

    // Initialize Sentry
    const { initializeSentry } = await import('~/lib/observability/sentry')
    initializeSentry()
  }
}