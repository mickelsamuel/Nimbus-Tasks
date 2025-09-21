#!/usr/bin/env node

const http = require('http')
const net = require('net')

const SERVICES = [
  { name: 'PostgreSQL', host: 'localhost', port: 5432, type: 'tcp' },
  { name: 'Redis', host: 'localhost', port: 6379, type: 'tcp' },
  { name: 'LocalStack', host: 'localhost', port: 4566, type: 'http', path: '/_localstack/health' }
]

const MAX_RETRIES = 30
const RETRY_DELAY = 2000

function checkTcpService(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket()

    socket.setTimeout(1000)

    socket.on('connect', () => {
      socket.destroy()
      resolve(true)
    })

    socket.on('timeout', () => {
      socket.destroy()
      resolve(false)
    })

    socket.on('error', () => {
      resolve(false)
    })

    socket.connect(port, host)
  })
}

function checkHttpService(host, port, path = '/') {
  return new Promise((resolve) => {
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'GET',
      timeout: 1000
    }

    const req = http.request(options, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400)
    })

    req.on('error', () => {
      resolve(false)
    })

    req.on('timeout', () => {
      req.destroy()
      resolve(false)
    })

    req.end()
  })
}

async function checkService(service) {
  try {
    if (service.type === 'tcp') {
      return await checkTcpService(service.host, service.port)
    } else if (service.type === 'http') {
      return await checkHttpService(service.host, service.port, service.path)
    }
    return false
  } catch (error) {
    return false
  }
}

async function waitForServices() {
  console.log('🔄 Waiting for services to be ready...\n')

  const serviceStatus = {}

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`📊 Attempt ${attempt}/${MAX_RETRIES}`)

    let allReady = true

    for (const service of SERVICES) {
      const isReady = await checkService(service)
      serviceStatus[service.name] = isReady

      const status = isReady ? '✅' : '❌'
      console.log(`  ${status} ${service.name} (${service.host}:${service.port})`)

      if (!isReady) {
        allReady = false
      }
    }

    if (allReady) {
      console.log('\n🎉 All services are ready!')
      console.log('🚀 Starting development server...\n')
      return
    }

    if (attempt < MAX_RETRIES) {
      console.log(`\n⏳ Waiting ${RETRY_DELAY/1000}s before next check...\n`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
    }
  }

  console.log('\n❌ Some services are still not ready after maximum retries')
  console.log('💡 Check that Docker is running and services are properly configured')
  console.log('🔧 Run "npm run docker:logs" to see service logs')
  console.log('📊 Run "npm run docker:status" to check service status')

  process.exit(1)
}

if (require.main === module) {
  waitForServices().catch(error => {
    console.error('❌ Error waiting for services:', error)
    process.exit(1)
  })
}

module.exports = { waitForServices }