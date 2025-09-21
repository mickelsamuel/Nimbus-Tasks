import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@nimbus/db'
import Redis from 'ioredis'

interface HealthCheck {
  name: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  responseTime?: number
  details?: any
  error?: string
}

export async function GET(request: NextRequest) {
  const start = Date.now()
  const checks: HealthCheck[] = []
  let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'

  // Database check
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const dbResponseTime = Date.now() - dbStart

    checks.push({
      name: 'database',
      status: dbResponseTime > 1000 ? 'degraded' : 'healthy',
      responseTime: dbResponseTime,
      details: {
        type: 'postgresql',
        responseTime: `${dbResponseTime}ms`
      }
    })
  } catch (error) {
    checks.push({
      name: 'database',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Database connection failed'
    })
    overallStatus = 'unhealthy'
  }

  // Redis check
  if (process.env.REDIS_URL) {
    try {
      const redisStart = Date.now()
      const redis = new Redis(process.env.REDIS_URL, {
        connectTimeout: 5000,
        commandTimeout: 5000,
        maxRetriesPerRequest: 1
      })

      await redis.ping()
      const redisResponseTime = Date.now() - redisStart
      await redis.disconnect()

      checks.push({
        name: 'redis',
        status: redisResponseTime > 500 ? 'degraded' : 'healthy',
        responseTime: redisResponseTime,
        details: {
          type: 'redis',
          responseTime: `${redisResponseTime}ms`
        }
      })

      if (redisResponseTime > 500 && overallStatus === 'healthy') {
        overallStatus = 'degraded'
      }
    } catch (error) {
      checks.push({
        name: 'redis',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Redis connection failed'
      })
      if (overallStatus === 'healthy') {
        overallStatus = 'degraded' // Redis is not critical, so degrade instead of fail
      }
    }
  }

  // Memory check
  const memoryUsage = process.memoryUsage()
  const memoryUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100

  checks.push({
    name: 'memory',
    status: memoryUsedPercent > 90 ? 'unhealthy' : memoryUsedPercent > 75 ? 'degraded' : 'healthy',
    details: {
      used: memoryUsage.heapUsed,
      total: memoryUsage.heapTotal,
      usedPercent: `${memoryUsedPercent.toFixed(2)}%`,
      external: memoryUsage.external,
      rss: memoryUsage.rss
    }
  })

  if (memoryUsedPercent > 90) {
    overallStatus = 'unhealthy'
  } else if (memoryUsedPercent > 75 && overallStatus === 'healthy') {
    overallStatus = 'degraded'
  }

  // Disk space check (if running in container)
  try {
    const fs = await import('fs/promises')
    const stats = await fs.statfs('/')
    const freeSpace = stats.free
    const totalSpace = stats.size
    const usedPercent = ((totalSpace - freeSpace) / totalSpace) * 100

    checks.push({
      name: 'disk',
      status: usedPercent > 90 ? 'unhealthy' : usedPercent > 80 ? 'degraded' : 'healthy',
      details: {
        free: freeSpace,
        total: totalSpace,
        usedPercent: `${usedPercent.toFixed(2)}%`
      }
    })

    if (usedPercent > 90) {
      overallStatus = 'unhealthy'
    } else if (usedPercent > 80 && overallStatus === 'healthy') {
      overallStatus = 'degraded'
    }
  } catch (error) {
    // Disk check is optional, don't fail if not available
  }

  const totalResponseTime = Date.now() - start
  const httpStatus = overallStatus === 'unhealthy' ? 503 :
                     overallStatus === 'degraded' ? 200 : 200

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.floor(process.uptime()),
      responseTime: `${totalResponseTime}ms`,
      checks: checks.reduce((acc, check) => {
        acc[check.name] = {
          status: check.status,
          ...(check.responseTime && { responseTime: check.responseTime }),
          ...(check.details && { details: check.details }),
          ...(check.error && { error: check.error })
        }
        return acc
      }, {} as Record<string, any>),
      summary: {
        total: checks.length,
        healthy: checks.filter(c => c.status === 'healthy').length,
        degraded: checks.filter(c => c.status === 'degraded').length,
        unhealthy: checks.filter(c => c.status === 'unhealthy').length
      }
    },
    { status: httpStatus }
  )
}