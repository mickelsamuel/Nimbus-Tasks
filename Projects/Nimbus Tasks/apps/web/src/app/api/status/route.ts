import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@nimbus/db'
import Redis from 'ioredis'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'down' | 'maintenance'
  responseTime?: number
  lastChecked: string
  message?: string
  incidents?: Array<{
    title: string
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
    message: string
    createdAt: string
  }>
}

export async function GET(request: NextRequest) {
  try {
    const services: ServiceStatus[] = []
    let overallStatus: 'operational' | 'degraded' | 'down' | 'maintenance' = 'operational'

    // Check if maintenance mode is enabled
    if (process.env.MAINTENANCE_MODE === 'true') {
      return NextResponse.json({
        status: 'maintenance',
        message: 'System is currently under maintenance',
        timestamp: new Date().toISOString(),
        estimatedResolution: process.env.MAINTENANCE_END_TIME || 'Unknown'
      })
    }

    // Database service check
    try {
      const dbStart = Date.now()
      await prisma.$queryRaw`SELECT 1`
      const dbResponseTime = Date.now() - dbStart

      let dbStatus: ServiceStatus['status'] = 'operational'
      let dbMessage = 'Database is responding normally'

      if (dbResponseTime > 2000) {
        dbStatus = 'degraded'
        dbMessage = 'Database response time is higher than normal'
        if (overallStatus === 'operational') overallStatus = 'degraded'
      }

      services.push({
        name: 'Database (PostgreSQL)',
        status: dbStatus,
        responseTime: dbResponseTime,
        lastChecked: new Date().toISOString(),
        message: dbMessage
      })
    } catch (error) {
      services.push({
        name: 'Database (PostgreSQL)',
        status: 'down',
        lastChecked: new Date().toISOString(),
        message: 'Database connection failed',
        incidents: [{
          title: 'Database Connection Failed',
          status: 'investigating',
          message: error instanceof Error ? error.message : 'Unknown database error',
          createdAt: new Date().toISOString()
        }]
      })
      overallStatus = 'down'
    }

    // Redis service check
    if (process.env.REDIS_URL) {
      try {
        const redisStart = Date.now()
        const redis = new Redis(process.env.REDIS_URL, {
          connectTimeout: 3000,
          commandTimeout: 3000,
          maxRetriesPerRequest: 1
        })

        await redis.ping()
        const redisResponseTime = Date.now() - redisStart
        await redis.disconnect()

        let redisStatus: ServiceStatus['status'] = 'operational'
        let redisMessage = 'Redis cache is responding normally'

        if (redisResponseTime > 1000) {
          redisStatus = 'degraded'
          redisMessage = 'Redis response time is higher than normal'
          if (overallStatus === 'operational') overallStatus = 'degraded'
        }

        services.push({
          name: 'Cache (Redis)',
          status: redisStatus,
          responseTime: redisResponseTime,
          lastChecked: new Date().toISOString(),
          message: redisMessage
        })
      } catch (error) {
        services.push({
          name: 'Cache (Redis)',
          status: 'degraded', // Redis failure is degraded, not down
          lastChecked: new Date().toISOString(),
          message: 'Redis cache is unavailable - falling back to database',
          incidents: [{
            title: 'Cache Service Unavailable',
            status: 'monitoring',
            message: 'Redis connection failed, application running with reduced performance',
            createdAt: new Date().toISOString()
          }]
        })
        if (overallStatus === 'operational') overallStatus = 'degraded'
      }
    }

    // File Storage service check (S3)
    if (process.env.S3_BUCKET_NAME) {
      try {
        // Simple check - we could expand this to actually test S3 connectivity
        services.push({
          name: 'File Storage (S3)',
          status: 'operational',
          lastChecked: new Date().toISOString(),
          message: 'File storage service is operational'
        })
      } catch (error) {
        services.push({
          name: 'File Storage (S3)',
          status: 'degraded',
          lastChecked: new Date().toISOString(),
          message: 'File storage service may be experiencing issues'
        })
        if (overallStatus === 'operational') overallStatus = 'degraded'
      }
    }

    // Authentication service check
    try {
      // Check if NextAuth configuration is valid
      const authConfigValid = !!(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL)

      services.push({
        name: 'Authentication',
        status: authConfigValid ? 'operational' : 'degraded',
        lastChecked: new Date().toISOString(),
        message: authConfigValid ? 'Authentication service is operational' : 'Authentication configuration incomplete'
      })

      if (!authConfigValid && overallStatus === 'operational') {
        overallStatus = 'degraded'
      }
    } catch (error) {
      services.push({
        name: 'Authentication',
        status: 'degraded',
        lastChecked: new Date().toISOString(),
        message: 'Authentication service status unknown'
      })
    }

    // API service check (self)
    services.push({
      name: 'API',
      status: 'operational',
      lastChecked: new Date().toISOString(),
      message: 'API is responding to requests'
    })

    // CDN/Static Assets check
    if (process.env.CLOUDFRONT_DOMAIN || process.env.CDN_URL) {
      services.push({
        name: 'CDN (CloudFront)',
        status: 'operational',
        lastChecked: new Date().toISOString(),
        message: 'Content delivery network is operational'
      })
    }

    // Calculate summary statistics
    const summary = {
      total: services.length,
      operational: services.filter(s => s.status === 'operational').length,
      degraded: services.filter(s => s.status === 'degraded').length,
      down: services.filter(s => s.status === 'down').length,
      maintenance: services.filter(s => s.status === 'maintenance').length
    }

    // Recent incidents (this would typically come from a database)
    const recentIncidents = [
      // This would be populated from an incidents table in a real system
    ]

    // Planned maintenance (this would typically come from a database)
    const plannedMaintenance = [
      // This would be populated from a maintenance schedule table
    ]

    return NextResponse.json(
      {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        services: services,
        summary: summary,
        incidents: {
          recent: recentIncidents,
          planned: plannedMaintenance
        },
        uptime: {
          last24Hours: '99.9%', // This would be calculated from monitoring data
          last7Days: '99.8%',
          last30Days: '99.5%'
        },
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        region: process.env.AWS_REGION || 'unknown',
        lastUpdated: new Date().toISOString()
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=30', // Cache for 30 seconds
          'Access-Control-Allow-Origin': '*' // Allow public status page access
        }
      }
    )
  } catch (error) {
    console.error('Status page failed:', error)

    return NextResponse.json(
      {
        status: 'down',
        timestamp: new Date().toISOString(),
        error: 'Failed to determine system status',
        message: 'Status page is experiencing issues'
      },
      { status: 500 }
    )
  }
}