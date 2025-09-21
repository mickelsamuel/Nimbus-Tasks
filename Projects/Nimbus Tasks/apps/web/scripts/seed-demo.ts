#!/usr/bin/env ts-node

/**
 * Demo Data Seeding Script for Portfolio Mode
 * Run with: npm run seed:demo
 */

import { PrismaClient } from '@nimbus/db'
import { seedDemoData, cleanupDemoData } from '../src/lib/portfolio/seed-demo'

const prisma = new PrismaClient()

async function main() {
  const command = process.argv[2]

  try {
    switch (command) {
      case 'seed':
        console.log('🌱 Starting demo data seeding...')
        await seedDemoData()
        console.log('✅ Demo data seeding completed!')
        break

      case 'clean':
        console.log('🧹 Starting demo data cleanup...')
        await cleanupDemoData()
        console.log('✅ Demo data cleanup completed!')
        break

      case 'reset':
        console.log('🔄 Resetting demo data...')
        await cleanupDemoData()
        await seedDemoData()
        console.log('✅ Demo data reset completed!')
        break

      default:
        console.log(`
Usage: npm run seed:demo [command]

Commands:
  seed   - Seed demo data for portfolio mode
  clean  - Remove all demo data
  reset  - Clean and re-seed demo data

Examples:
  npm run seed:demo seed
  npm run seed:demo reset
`)
        process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()