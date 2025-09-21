import { NodeSDK } from '@opentelemetry/sdk-node'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'
import { PrismaInstrumentation } from '@prisma/instrumentation'

// Service information
const serviceName = 'nimbus-tasks'
const serviceVersion = process.env.npm_package_version || '1.0.0'
const environment = process.env.NODE_ENV || 'development'

// Initialize OpenTelemetry SDK
export function initializeTelemetry() {
  const isProduction = environment === 'production'
  const isTracingEnabled = process.env.OTEL_ENABLED !== 'false'

  if (!isTracingEnabled) {
    console.log('🔍 OpenTelemetry disabled via OTEL_ENABLED=false')
    return null
  }

  try {
    const traceExporter = createTraceExporter()
    const metricExporter = createMetricExporter()

    if (!traceExporter && isProduction) {
      console.warn('🔍 No trace exporter configured for production environment')
      return null
    }

    const resource = new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
      [SemanticResourceAttributes.SERVICE_NAMESPACE]: 'nimbus',
      [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: process.env.HOSTNAME || process.env.VERCEL_DEPLOYMENT_ID || 'unknown',
      [SemanticResourceAttributes.CONTAINER_ID]: process.env.HOSTNAME || 'unknown',
      // Add custom attributes
      'service.region': process.env.AWS_REGION || process.env.VERCEL_REGION || 'unknown',
      'service.commit': process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || 'unknown',
      'service.branch': process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || 'unknown'
    })

    const instrumentations = [
      getNodeAutoInstrumentations({
        // Disable noisy instrumentations
        '@opentelemetry/instrumentation-fs': { enabled: false },
        '@opentelemetry/instrumentation-net': { enabled: false },
        '@opentelemetry/instrumentation-dns': { enabled: false },

        // Configure HTTP instrumentation
        '@opentelemetry/instrumentation-http': {
          enabled: true,
          ignoreIncomingRequestHook: (req) => {
            const url = req.url || ''
            return (
              url.includes('/api/health') ||
              url.includes('/api/ready') ||
              url.includes('/api/metrics') ||
              url.includes('/_next/') ||
              url.includes('/favicon.ico') ||
              url.includes('/_vercel/')
            )
          },
          requestHook: (span, request) => {
            span.setAttributes({
              'http.request.header.user-agent': request.headers['user-agent'] || 'unknown',
              'http.request.header.x-forwarded-for': request.headers['x-forwarded-for'] || 'unknown'
            })
          }
        },

        // Configure Express/Next.js instrumentation
        '@opentelemetry/instrumentation-express': { enabled: true },

        // Enable database instrumentations
        '@opentelemetry/instrumentation-pg': { enabled: true },
        '@opentelemetry/instrumentation-redis-4': { enabled: true }
      }),

      // Add Prisma instrumentation separately
      new PrismaInstrumentation({
        middleware: true
      })
    ]

    const sdk = new NodeSDK({
      resource,
      traceExporter,
      metricReader: metricExporter ? new PeriodicExportingMetricReader({
        exporter: metricExporter,
        exportIntervalMillis: 30000,
        exportTimeoutMillis: 5000
      }) : undefined,
      instrumentations
    })

    sdk.start()
    console.log(`🔍 OpenTelemetry initialized for ${serviceName} v${serviceVersion} in ${environment}`)

    // Graceful shutdown
    const shutdown = async () => {
      try {
        await sdk.shutdown()
        console.log('🔍 OpenTelemetry shutdown complete')
      } catch (error) {
        console.error('🔍 Error shutting down OpenTelemetry:', error)
      }
    }

    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)

    return sdk
  } catch (error) {
    console.error('🔍 Failed to initialize OpenTelemetry:', error)
    return null
  }
}

function createTraceExporter() {
  // Check for generic OTLP endpoint first
  if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    console.log('🔍 Using generic OTLP exporter')
    const headers: Record<string, string> = {}

    // Parse headers if provided
    if (process.env.OTEL_EXPORTER_OTLP_HEADERS) {
      const headerPairs = process.env.OTEL_EXPORTER_OTLP_HEADERS.split(',')
      for (const pair of headerPairs) {
        const [key, value] = pair.split('=')
        if (key && value) {
          headers[key.trim()] = value.trim()
        }
      }
    }

    return new OTLPTraceExporter({
      url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
      headers
    })
  }

  // Use AWS X-Ray if in AWS environment
  if (process.env.AWS_REGION && (process.env._X_AMZN_TRACE_ID || process.env.AWS_XRAY_ENABLED === 'true')) {
    console.log('🔍 Using AWS X-Ray exporter')
    return new OTLPTraceExporter({
      url: process.env.AWS_XRAY_COLLECTOR_ENDPOINT || 'http://localhost:2000/v1/traces'
    })
  }

  // Use Honeycomb if API key is available
  if (process.env.HONEYCOMB_API_KEY) {
    console.log('🔍 Using Honeycomb exporter')
    return new OTLPTraceExporter({
      url: process.env.HONEYCOMB_API_ENDPOINT || 'https://api.honeycomb.io/v1/traces',
      headers: {
        'x-honeycomb-team': process.env.HONEYCOMB_API_KEY,
        'x-honeycomb-dataset': process.env.HONEYCOMB_DATASET || serviceName
      }
    })
  }

  // Use Jaeger if endpoint is available
  if (process.env.JAEGER_ENDPOINT) {
    console.log('🔍 Using Jaeger exporter')
    return new OTLPTraceExporter({
      url: `${process.env.JAEGER_ENDPOINT}/v1/traces`
    })
  }

  // Use console exporter in development
  if (environment === 'development') {
    console.log('🔍 Using console exporter for development')
    return new ConsoleSpanExporter()
  }

  // No exporter configured
  console.log('🔍 No trace exporter configured')
  return null
}

function createMetricExporter() {
  // Check for generic OTLP endpoint
  if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    const headers: Record<string, string> = {}

    if (process.env.OTEL_EXPORTER_OTLP_HEADERS) {
      const headerPairs = process.env.OTEL_EXPORTER_OTLP_HEADERS.split(',')
      for (const pair of headerPairs) {
        const [key, value] = pair.split('=')
        if (key && value) {
          headers[key.trim()] = value.trim()
        }
      }
    }

    return new OTLPMetricExporter({
      url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`,
      headers
    })
  }

  // Use Honeycomb for metrics
  if (process.env.HONEYCOMB_API_KEY) {
    return new OTLPMetricExporter({
      url: process.env.HONEYCOMB_API_ENDPOINT?.replace('/traces', '/metrics') || 'https://api.honeycomb.io/v1/metrics',
      headers: {
        'x-honeycomb-team': process.env.HONEYCOMB_API_KEY,
        'x-honeycomb-dataset': process.env.HONEYCOMB_DATASET || serviceName
      }
    })
  }

  return null
}

// Manual tracing utilities
export { trace, context, SpanStatusCode, SpanKind } from '@opentelemetry/api'

// Get tracer instance
export const tracer = trace.getTracer(serviceName, serviceVersion)

// Helper function to create a span
export function createSpan<T>(name: string, fn: (span: any) => Promise<T> | T, options?: any): Promise<T> {
  return tracer.startActiveSpan(name, options || {}, async (span) => {
    try {
      const result = await fn(span)
      span.setStatus({ code: SpanStatusCode.OK })
      return result
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : 'Unknown error',
      })
      span.recordException(error as Error)
      throw error
    } finally {
      span.end()
    }
  })
}

// Helper function to add attributes to current span
export function addSpanAttributes(attributes: Record<string, string | number | boolean>) {
  const span = trace.getActiveSpan()
  if (span) {
    span.setAttributes(attributes)
  }
}

// Helper function to add events to current span
export function addSpanEvent(name: string, attributes?: Record<string, any>) {
  const span = trace.getActiveSpan()
  if (span) {
    span.addEvent(name, attributes)
  }
}

// Trace database operations
export function traceDatabase<T>(operation: string, fn: () => Promise<T>, metadata?: any): Promise<T> {
  return createSpan(`database.${operation}`, async (span) => {
    span.setAttributes({
      'db.system': 'postgresql',
      'db.operation': operation,
      ...(metadata && { 'db.statement': metadata.statement }),
      ...(metadata && { 'db.table': metadata.table })
    })
    return await fn()
  }, { kind: SpanKind.CLIENT })
}

// Trace API calls
export function traceApiCall<T>(method: string, endpoint: string, fn: () => Promise<T>): Promise<T> {
  return createSpan(`http.${method.toLowerCase()}`, async (span) => {
    span.setAttributes({
      'http.method': method,
      'http.route': endpoint,
      'http.url': endpoint
    })
    return await fn()
  }, { kind: SpanKind.CLIENT })
}

// Trace Redis operations
export function traceRedis<T>(operation: string, key: string, fn: () => Promise<T>): Promise<T> {
  return createSpan(`redis.${operation}`, async (span) => {
    span.setAttributes({
      'db.system': 'redis',
      'db.operation': operation,
      'db.redis.key': key
    })
    return await fn()
  }, { kind: SpanKind.CLIENT })
}

// Trace external service calls
export function traceExternalService<T>(serviceName: string, operation: string, fn: () => Promise<T>): Promise<T> {
  return createSpan(`external.${serviceName}.${operation}`, async (span) => {
    span.setAttributes({
      'service.name': serviceName,
      'service.operation': operation
    })
    return await fn()
  }, { kind: SpanKind.CLIENT })
}

// Trace business logic operations
export function traceBusiness<T>(operation: string, fn: () => Promise<T>, metadata?: any): Promise<T> {
  return createSpan(`business.${operation}`, async (span) => {
    if (metadata) {
      span.setAttributes(metadata)
    }
    return await fn()
  }, { kind: SpanKind.INTERNAL })
}

// Initialize telemetry and export SDK instance
export const sdk = initializeTelemetry()