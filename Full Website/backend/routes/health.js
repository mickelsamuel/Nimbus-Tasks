const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: await checkDatabase(),
        memory: checkMemory(),
        disk: await checkDisk(),
        cpu: checkCPU()
      }
    };

    // Determine overall status
    const allHealthy = Object.values(health.checks).every(check => check.status === 'healthy');
    if (!allHealthy) {
      health.status = 'degraded';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Readiness check
router.get('/ready', async (req, res) => {
  try {
    // Check if all critical services are ready
    const dbCheck = await checkDatabase();
    
    if (dbCheck.status !== 'healthy') {
      return res.status(503).json({
        status: 'not ready',
        reason: 'Database not ready',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness check
router.get('/live', (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Detailed metrics endpoint
router.get('/metrics', async (req, res) => {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      system: {
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        uptime: os.uptime(),
        loadavg: os.loadavg(),
        totalmem: os.totalmem(),
        freemem: os.freemem(),
        cpus: os.cpus().length
      },
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        versions: process.versions,
        env: process.env.NODE_ENV
      },
      database: await getDatabaseMetrics()
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Helper functions
async function checkDatabase() {
  try {
    const start = Date.now();
    
    // Check connection state
    if (mongoose.connection.readyState !== 1) {
      return {
        status: 'unhealthy',
        message: 'Database connection not ready',
        readyState: mongoose.connection.readyState
      };
    }

    // Perform a simple query to test connectivity
    await mongoose.connection.db.admin().ping();
    
    const responseTime = Date.now() - start;
    
    return {
      status: responseTime < 1000 ? 'healthy' : 'degraded',
      responseTime: `${responseTime}ms`,
      connection: 'active',
      readyState: mongoose.connection.readyState
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      readyState: mongoose.connection.readyState
    };
  }
}

function checkMemory() {
  const memUsage = process.memoryUsage();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercentage = (usedMem / totalMem) * 100;
  
  return {
    status: memPercentage < 85 ? 'healthy' : 'degraded',
    usage: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
    },
    system: {
      total: `${Math.round(totalMem / 1024 / 1024)}MB`,
      free: `${Math.round(freeMem / 1024 / 1024)}MB`,
      used: `${Math.round(usedMem / 1024 / 1024)}MB`,
      percentage: `${Math.round(memPercentage)}%`
    }
  };
}

async function checkDisk() {
  try {
    const stats = await fs.stat(process.cwd());
    
    return {
      status: 'healthy',
      accessible: true,
      path: process.cwd()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      accessible: false,
      error: error.message
    };
  }
}

function checkCPU() {
  const cpus = os.cpus();
  const loadAvg = os.loadavg();
  const load1min = loadAvg[0];
  const cpuCount = cpus.length;
  const loadPercentage = (load1min / cpuCount) * 100;
  
  return {
    status: loadPercentage < 80 ? 'healthy' : 'degraded',
    cores: cpuCount,
    model: cpus[0]?.model || 'Unknown',
    load: {
      '1min': load1min.toFixed(2),
      '5min': loadAvg[1].toFixed(2),
      '15min': loadAvg[2].toFixed(2)
    },
    percentage: `${Math.round(loadPercentage)}%`
  };
}

async function getDatabaseMetrics() {
  try {
    if (mongoose.connection.readyState !== 1) {
      return { status: 'disconnected' };
    }

    const db = mongoose.connection.db;
    const admin = db.admin();
    
    // Get database stats
    const dbStats = await db.stats();
    const serverStatus = await admin.serverStatus();
    
    return {
      status: 'connected',
      name: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      collections: dbStats.collections,
      dataSize: `${Math.round(dbStats.dataSize / 1024 / 1024)}MB`,
      storageSize: `${Math.round(dbStats.storageSize / 1024 / 1024)}MB`,
      indexes: dbStats.indexes,
      indexSize: `${Math.round(dbStats.indexSize / 1024 / 1024)}MB`,
      connections: {
        current: serverStatus.connections?.current || 0,
        available: serverStatus.connections?.available || 0,
        totalCreated: serverStatus.connections?.totalCreated || 0
      },
      version: serverStatus.version,
      uptime: serverStatus.uptime
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}

module.exports = router;