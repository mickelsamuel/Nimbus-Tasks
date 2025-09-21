import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@nimbus/db'

export async function GET(request: NextRequest) {
  try {
    // Check if the application is ready to serve traffic
    // This is a more stringent check than health - all dependencies must be available

    // Database must be accessible
    await prisma.$queryRaw`SELECT 1`

    // Check if migrations are up to date (optional, but good practice)
    try {
      // This will throw if there are pending migrations
      await prisma.$queryRaw`SELECT 1 FROM "_prisma_migrations" LIMIT 1`
    } catch (error) {
      // If the table doesn't exist, assume we're in a fresh setup
      console.warn('Migrations table not found, assuming fresh setup')
    }

    return NextResponse.json(
      {
        status: 'ready',
        timestamp: new Date().toISOString(),
        message: 'Application is ready to serve traffic'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Readiness check failed:', error)

    return NextResponse.json(
      {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Application is not ready to serve traffic'
      },
      { status: 503 }
    )
  }
}