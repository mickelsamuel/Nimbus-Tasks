import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@nimbus/db'

export async function GET(request: NextRequest) {
  try {
    const start = Date.now()

    // Collect application metrics
    const metrics = []

    // Process metrics
    const memoryUsage = process.memoryUsage()
    metrics.push(`# HELP nodejs_memory_heap_used_bytes Process heap memory used`)
    metrics.push(`# TYPE nodejs_memory_heap_used_bytes gauge`)
    metrics.push(`nodejs_memory_heap_used_bytes ${memoryUsage.heapUsed}`)

    metrics.push(`# HELP nodejs_memory_heap_total_bytes Process heap memory total`)
    metrics.push(`# TYPE nodejs_memory_heap_total_bytes gauge`)
    metrics.push(`nodejs_memory_heap_total_bytes ${memoryUsage.heapTotal}`)

    metrics.push(`# HELP nodejs_memory_external_bytes Process external memory`)
    metrics.push(`# TYPE nodejs_memory_external_bytes gauge`)
    metrics.push(`nodejs_memory_external_bytes ${memoryUsage.external}`)

    metrics.push(`# HELP nodejs_memory_rss_bytes Process resident set size`)
    metrics.push(`# TYPE nodejs_memory_rss_bytes gauge`)
    metrics.push(`nodejs_memory_rss_bytes ${memoryUsage.rss}`)

    // Process uptime
    metrics.push(`# HELP nodejs_process_uptime_seconds Process uptime in seconds`)
    metrics.push(`# TYPE nodejs_process_uptime_seconds gauge`)
    metrics.push(`nodejs_process_uptime_seconds ${process.uptime()}`)

    // Application-specific metrics
    try {
      // Count database entities
      const [userCount, projectCount, taskCount] = await Promise.all([
        prisma.user.count(),
        prisma.project.count(),
        prisma.task.count()
      ])

      metrics.push(`# HELP nimbus_users_total Total number of users`)
      metrics.push(`# TYPE nimbus_users_total gauge`)
      metrics.push(`nimbus_users_total ${userCount}`)

      metrics.push(`# HELP nimbus_projects_total Total number of projects`)
      metrics.push(`# TYPE nimbus_projects_total gauge`)
      metrics.push(`nimbus_projects_total ${projectCount}`)

      metrics.push(`# HELP nimbus_tasks_total Total number of tasks`)
      metrics.push(`# TYPE nimbus_tasks_total gauge`)
      metrics.push(`nimbus_tasks_total ${taskCount}`)

      // Task status distribution
      const taskStatusCounts = await prisma.task.groupBy({
        by: ['status'],
        _count: true
      })

      for (const statusCount of taskStatusCounts) {
        metrics.push(`# HELP nimbus_tasks_by_status_total Number of tasks by status`)
        metrics.push(`# TYPE nimbus_tasks_by_status_total gauge`)
        metrics.push(`nimbus_tasks_by_status_total{status="${statusCount.status.toLowerCase()}"} ${statusCount._count}`)
      }

      // Recent activity metrics (last 24 hours)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const recentTasksCreated = await prisma.task.count({
        where: {
          createdAt: {
            gte: yesterday
          }
        }
      })

      const recentTasksCompleted = await prisma.task.count({
        where: {
          status: 'COMPLETED',
          updatedAt: {
            gte: yesterday
          }
        }
      })

      metrics.push(`# HELP nimbus_tasks_created_24h_total Tasks created in last 24 hours`)
      metrics.push(`# TYPE nimbus_tasks_created_24h_total gauge`)
      metrics.push(`nimbus_tasks_created_24h_total ${recentTasksCreated}`)

      metrics.push(`# HELP nimbus_tasks_completed_24h_total Tasks completed in last 24 hours`)
      metrics.push(`# TYPE nimbus_tasks_completed_24h_total gauge`)
      metrics.push(`nimbus_tasks_completed_24h_total ${recentTasksCompleted}`)

    } catch (dbError) {
      // If database is unavailable, still provide process metrics
      metrics.push(`# HELP nimbus_database_available Database availability`)
      metrics.push(`# TYPE nimbus_database_available gauge`)
      metrics.push(`nimbus_database_available 0`)
    }

    // HTTP request duration for this metrics endpoint
    const duration = Date.now() - start
    metrics.push(`# HELP nimbus_metrics_request_duration_ms Time to generate metrics`)
    metrics.push(`# TYPE nimbus_metrics_request_duration_ms gauge`)
    metrics.push(`nimbus_metrics_request_duration_ms ${duration}`)

    // Environment info
    metrics.push(`# HELP nimbus_info Application information`)
    metrics.push(`# TYPE nimbus_info gauge`)
    metrics.push(`nimbus_info{version="${process.env.npm_package_version || '1.0.0'}",environment="${process.env.NODE_ENV || 'development'}",node_version="${process.version}"} 1`)

    return new Response(metrics.join('\n') + '\n', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Metrics collection failed:', error)

    // Return minimal metrics even on error
    const errorMetrics = [
      `# HELP nimbus_metrics_error Metrics collection error`,
      `# TYPE nimbus_metrics_error gauge`,
      `nimbus_metrics_error 1`,
      `# HELP nodejs_process_uptime_seconds Process uptime in seconds`,
      `# TYPE nodejs_process_uptime_seconds gauge`,
      `nodejs_process_uptime_seconds ${process.uptime()}`
    ]

    return new Response(errorMetrics.join('\n') + '\n', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}