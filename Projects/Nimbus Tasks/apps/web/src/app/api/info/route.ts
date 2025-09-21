import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get build information from environment variables
    const buildInfo = {
      version: process.env.npm_package_version || '1.0.0',
      buildDate: process.env.BUILD_DATE || new Date().toISOString(),
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || 'unknown',
      branch: process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || 'unknown',
      environment: process.env.NODE_ENV || 'development',
      region: process.env.AWS_REGION || process.env.VERCEL_REGION || 'unknown'
    }

    // Get runtime information
    const runtime = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: Math.floor(process.uptime()),
      startTime: new Date(Date.now() - process.uptime() * 1000).toISOString()
    }

    // Get deployment information (if available)
    const deployment = {
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID || process.env.DEPLOYMENT_ID || 'unknown',
      deploymentUrl: process.env.VERCEL_URL || process.env.DEPLOYMENT_URL || 'unknown',
      isProduction: process.env.NODE_ENV === 'production'
    }

    // Feature flags or configuration
    const features = {
      tracing: !!process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      redis: !!process.env.REDIS_URL,
      s3: !!process.env.S3_BUCKET_NAME,
      analytics: !!process.env.ANALYTICS_ENABLED,
      maintenance: process.env.MAINTENANCE_MODE === 'true'
    }

    return NextResponse.json(
      {
        service: 'nimbus-tasks',
        timestamp: new Date().toISOString(),
        build: buildInfo,
        runtime: runtime,
        deployment: deployment,
        features: features,
        health: {
          healthEndpoint: '/api/health',
          readinessEndpoint: '/api/ready',
          metricsEndpoint: '/api/metrics'
        }
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
        }
      }
    )
  } catch (error) {
    console.error('Info endpoint failed:', error)

    return NextResponse.json(
      {
        service: 'nimbus-tasks',
        timestamp: new Date().toISOString(),
        error: 'Failed to gather service information',
        build: {
          version: process.env.npm_package_version || '1.0.0',
          environment: process.env.NODE_ENV || 'development'
        }
      },
      { status: 500 }
    )
  }
}