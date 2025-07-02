const os = require('os');

// Performance monitoring middleware
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        active: 0,
        byMethod: {},
        byRoute: {},
        byStatus: {},
        errors: 0
      },
      responseTime: {
        samples: [],
        p50: 0,
        p95: 0,
        p99: 0,
        avg: 0
      },
      system: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime()
      },
      database: {
        queries: 0,
        slowQueries: 0,
        errors: 0,
        connections: 0
      }
    };
    
    // Update system metrics every 30 seconds
    this.systemMetricsInterval = setInterval(() => {
      this.updateSystemMetrics();
    }, 30000);
  }

  // Request tracking middleware
  middleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      const startCPU = process.cpuUsage();
      
      // Track request start
      this.metrics.requests.total++;
      this.metrics.requests.active++;
      
      // Track by method
      this.metrics.requests.byMethod[req.method] = 
        (this.metrics.requests.byMethod[req.method] || 0) + 1;
      
      // Track by route (simplified)
      const route = this.getRoutePattern(req.path);
      this.metrics.requests.byRoute[route] = 
        (this.metrics.requests.byRoute[route] || 0) + 1;
      
      // Override res.end to capture response metrics
      const originalEnd = res.end;
      res.end = (...args) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const endCPU = process.cpuUsage(startCPU);
        
        // Track response time
        this.addResponseTime(responseTime);
        
        // Track by status code
        this.metrics.requests.byStatus[res.statusCode] = 
          (this.metrics.requests.byStatus[res.statusCode] || 0) + 1;
        
        // Track errors
        if (res.statusCode >= 400) {
          this.metrics.requests.errors++;
        }
        
        // Decrease active requests
        this.metrics.requests.active--;
        
        // Add request metadata
        req.metrics = {
          responseTime,
          cpuUsage: {
            user: endCPU.user / 1000, // Convert to milliseconds
            system: endCPU.system / 1000
          },
          statusCode: res.statusCode
        };
        
        // Call original end
        originalEnd.apply(res, args);
      };
      
      next();
    };
  }

  // Add response time sample and calculate percentiles
  addResponseTime(responseTime) {
    this.metrics.responseTime.samples.push(responseTime);
    
    // Keep only last 1000 samples
    if (this.metrics.responseTime.samples.length > 1000) {
      this.metrics.responseTime.samples = this.metrics.responseTime.samples.slice(-1000);
    }
    
    // Calculate percentiles
    this.calculatePercentiles();
  }

  calculatePercentiles() {
    const samples = [...this.metrics.responseTime.samples].sort((a, b) => a - b);
    const length = samples.length;
    
    if (length === 0) return;
    
    this.metrics.responseTime.p50 = samples[Math.floor(length * 0.5)];
    this.metrics.responseTime.p95 = samples[Math.floor(length * 0.95)];
    this.metrics.responseTime.p99 = samples[Math.floor(length * 0.99)];
    this.metrics.responseTime.avg = samples.reduce((a, b) => a + b, 0) / length;
  }

  updateSystemMetrics() {
    this.metrics.system = {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      uptime: process.uptime(),
      loadAvg: os.loadavg(),
      freeMemory: os.freemem(),
      totalMemory: os.totalmem()
    };
  }

  getRoutePattern(path) {
    // Simplify route for grouping (remove IDs, etc.)
    return path
      .replace(/\/\d+/g, '/:id')
      .replace(/\/[a-f0-9]{24}/g, '/:id') // MongoDB ObjectIds
      .replace(/\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g, '/:uuid')
      .split('?')[0]; // Remove query params
  }

  // Database query tracking
  trackDatabaseQuery(duration, isSlowQuery = false, hasError = false) {
    this.metrics.database.queries++;
    
    if (isSlowQuery) {
      this.metrics.database.slowQueries++;
    }
    
    if (hasError) {
      this.metrics.database.errors++;
    }
  }

  // Get current metrics
  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  // Get metrics summary
  getMetricsSummary() {
    const now = Date.now();
    return {
      timestamp: new Date().toISOString(),
      requests: {
        total: this.metrics.requests.total,
        active: this.metrics.requests.active,
        errorRate: this.metrics.requests.total > 0 
          ? (this.metrics.requests.errors / this.metrics.requests.total * 100).toFixed(2) + '%'
          : '0%',
        topMethods: this.getTopEntries(this.metrics.requests.byMethod),
        topRoutes: this.getTopEntries(this.metrics.requests.byRoute),
        statusCodes: this.metrics.requests.byStatus
      },
      performance: {
        avgResponseTime: Math.round(this.metrics.responseTime.avg) + 'ms',
        p50ResponseTime: Math.round(this.metrics.responseTime.p50) + 'ms',
        p95ResponseTime: Math.round(this.metrics.responseTime.p95) + 'ms',
        p99ResponseTime: Math.round(this.metrics.responseTime.p99) + 'ms'
      },
      system: {
        uptime: Math.round(this.metrics.system.uptime) + 's',
        memory: {
          used: Math.round(this.metrics.system.memory.heapUsed / 1024 / 1024) + 'MB',
          total: Math.round(this.metrics.system.memory.heapTotal / 1024 / 1024) + 'MB',
          rss: Math.round(this.metrics.system.memory.rss / 1024 / 1024) + 'MB'
        },
        cpu: {
          user: Math.round(this.metrics.system.cpu.user / 1000) + 'ms',
          system: Math.round(this.metrics.system.cpu.system / 1000) + 'ms'
        },
        load: this.metrics.system.loadAvg?.map(l => l.toFixed(2)).join(', ') || 'N/A'
      },
      database: {
        totalQueries: this.metrics.database.queries,
        slowQueries: this.metrics.database.slowQueries,
        errors: this.metrics.database.errors,
        slowQueryRate: this.metrics.database.queries > 0
          ? (this.metrics.database.slowQueries / this.metrics.database.queries * 100).toFixed(2) + '%'
          : '0%'
      }
    };
  }

  getTopEntries(obj, limit = 5) {
    return Object.entries(obj)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }

  // Reset metrics
  reset() {
    this.metrics = {
      requests: {
        total: 0,
        active: 0,
        byMethod: {},
        byRoute: {},
        byStatus: {},
        errors: 0
      },
      responseTime: {
        samples: [],
        p50: 0,
        p95: 0,
        p99: 0,
        avg: 0
      },
      database: {
        queries: 0,
        slowQueries: 0,
        errors: 0,
        connections: 0
      }
    };
    this.updateSystemMetrics();
  }

  // Cleanup
  destroy() {
    if (this.systemMetricsInterval) {
      clearInterval(this.systemMetricsInterval);
    }
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

// Graceful shutdown
process.on('SIGTERM', () => {
  performanceMonitor.destroy();
});

process.on('SIGINT', () => {
  performanceMonitor.destroy();
});

module.exports = performanceMonitor;