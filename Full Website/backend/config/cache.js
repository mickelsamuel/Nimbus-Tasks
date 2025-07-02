// Simple in-memory cache implementation (no external dependencies)
class SimpleCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.timers = new Map();
    this.options = {
      stdTTL: options.stdTTL || 600, // 10 minutes default
      checkperiod: options.checkperiod || 120, // 2 minutes
      useClones: options.useClones !== false,
      deleteOnExpire: options.deleteOnExpire !== false
    };
    
    this.stats = {
      hits: 0,
      misses: 0,
      keys: 0,
      ksize: 0,
      vsize: 0
    };
    
    // Cleanup interval
    if (this.options.checkperiod > 0) {
      this.checkInterval = setInterval(() => {
        this.checkExpired();
      }, this.options.checkperiod * 1000);
    }
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      this.stats.misses++;
      return undefined;
    }
    
    if (item.expiry && Date.now() > item.expiry) {
      this.del(key);
      this.stats.misses++;
      return undefined;
    }
    
    this.stats.hits++;
    return this.options.useClones ? JSON.parse(JSON.stringify(item.value)) : item.value;
  }
  
  set(key, value, ttl) {
    const expiry = ttl ? Date.now() + (ttl * 1000) : 
                  this.options.stdTTL ? Date.now() + (this.options.stdTTL * 1000) : null;
    
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    
    const item = {
      value: this.options.useClones ? JSON.parse(JSON.stringify(value)) : value,
      expiry
    };
    
    const existed = this.cache.has(key);
    this.cache.set(key, item);
    
    if (!existed) {
      this.stats.keys++;
    }
    
    // Set expiry timer
    if (expiry) {
      const timer = setTimeout(() => {
        this.del(key);
      }, expiry - Date.now());
      this.timers.set(key, timer);
    }
    
    return true;
  }
  
  del(key) {
    const existed = this.cache.has(key);
    if (existed) {
      this.cache.delete(key);
      this.stats.keys--;
      
      // Clear timer
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key));
        this.timers.delete(key);
      }
      
      return 1;
    }
    return 0;
  }
  
  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (item.expiry && Date.now() > item.expiry) {
      this.del(key);
      return false;
    }
    
    return true;
  }
  
  keys() {
    return Array.from(this.cache.keys());
  }
  
  mget(keys) {
    const result = {};
    keys.forEach(key => {
      const value = this.get(key);
      if (value !== undefined) {
        result[key] = value;
      }
    });
    return result;
  }
  
  mset(keyValuePairs, ttl) {
    Object.entries(keyValuePairs).forEach(([key, value]) => {
      this.set(key, value, ttl);
    });
    return true;
  }
  
  flushAll() {
    this.cache.clear();
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.stats.keys = 0;
  }
  
  getStats() {
    return { ...this.stats };
  }
  
  checkExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry && now > item.expiry) {
        this.del(key);
      }
    }
  }
  
  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.flushAll();
  }
  
  // Event emitter simulation
  on(event, callback) {
    // Simple event handling - can be expanded if needed
  }
}

// Cache configuration
const cacheConfig = {
  // Default TTL: 10 minutes
  stdTTL: 600,
  // Check for expired keys every 2 minutes
  checkperiod: 120,
  // Use clones to prevent reference issues
  useClones: false,
  // Delete expired keys automatically
  deleteOnExpire: true,
  // Enable statistics
  enableLegacyCallbacks: false
};

// Create cache instances for different data types
const caches = {
  // User data cache (5 minutes TTL)
  users: new SimpleCache({ ...cacheConfig, stdTTL: 300 }),
  
  // Module data cache (15 minutes TTL)
  modules: new SimpleCache({ ...cacheConfig, stdTTL: 900 }),
  
  // Team data cache (10 minutes TTL)
  teams: new SimpleCache({ ...cacheConfig, stdTTL: 600 }),
  
  // Dashboard data cache (2 minutes TTL)
  dashboard: new SimpleCache({ ...cacheConfig, stdTTL: 120 }),
  
  // Leaderboard cache (5 minutes TTL)
  leaderboards: new SimpleCache({ ...cacheConfig, stdTTL: 300 }),
  
  // Search results cache (10 minutes TTL)
  search: new SimpleCache({ ...cacheConfig, stdTTL: 600 }),
  
  // Static data cache (1 hour TTL)
  static: new SimpleCache({ ...cacheConfig, stdTTL: 3600 }),
  
  // Session cache (30 minutes TTL)
  sessions: new SimpleCache({ ...cacheConfig, stdTTL: 1800 }),
  
  // API response cache (5 minutes TTL)
  api: new SimpleCache({ ...cacheConfig, stdTTL: 300 })
};

// Cache wrapper class
class CacheManager {
  constructor() {
    this.caches = caches;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0
    };
    
    // Setup cache event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    Object.keys(this.caches).forEach(cacheName => {
      const cache = this.caches[cacheName];
      
      cache.on('set', (key, value) => {
        this.stats.sets++;
        console.log(`Cache SET [${cacheName}]: ${key}`);
      });
      
      cache.on('del', (key, value) => {
        this.stats.deletes++;
        console.log(`Cache DELETE [${cacheName}]: ${key}`);
      });
      
      cache.on('expired', (key, value) => {
        console.log(`Cache EXPIRED [${cacheName}]: ${key}`);
      });
      
      cache.on('error', (error) => {
        this.stats.errors++;
        console.error(`Cache ERROR [${cacheName}]:`, error);
      });
    });
  }

  // Get value from specific cache
  get(cacheType, key) {
    try {
      const cache = this.caches[cacheType];
      if (!cache) {
        throw new Error(`Cache type '${cacheType}' not found`);
      }
      
      const value = cache.get(key);
      if (value !== undefined) {
        this.stats.hits++;
        console.log(`Cache HIT [${cacheType}]: ${key}`);
        return value;
      } else {
        this.stats.misses++;
        console.log(`Cache MISS [${cacheType}]: ${key}`);
        return null;
      }
    } catch (error) {
      this.stats.errors++;
      console.error(`Cache GET error [${cacheType}]:`, error);
      return null;
    }
  }

  // Set value in specific cache
  set(cacheType, key, value, ttl = null) {
    try {
      const cache = this.caches[cacheType];
      if (!cache) {
        throw new Error(`Cache type '${cacheType}' not found`);
      }
      
      const success = ttl ? cache.set(key, value, ttl) : cache.set(key, value);
      if (success) {
        this.stats.sets++;
        return true;
      }
      return false;
    } catch (error) {
      this.stats.errors++;
      console.error(`Cache SET error [${cacheType}]:`, error);
      return false;
    }
  }

  // Delete value from specific cache
  del(cacheType, key) {
    try {
      const cache = this.caches[cacheType];
      if (!cache) {
        throw new Error(`Cache type '${cacheType}' not found`);
      }
      
      const deleted = cache.del(key);
      if (deleted > 0) {
        this.stats.deletes++;
        return true;
      }
      return false;
    } catch (error) {
      this.stats.errors++;
      console.error(`Cache DELETE error [${cacheType}]:`, error);
      return false;
    }
  }

  // Check if key exists in cache
  has(cacheType, key) {
    try {
      const cache = this.caches[cacheType];
      if (!cache) {
        return false;
      }
      return cache.has(key);
    } catch (error) {
      this.stats.errors++;
      return false;
    }
  }

  // Get multiple values
  mget(cacheType, keys) {
    try {
      const cache = this.caches[cacheType];
      if (!cache) {
        throw new Error(`Cache type '${cacheType}' not found`);
      }
      
      const values = cache.mget(keys);
      
      // Update stats
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined) {
          this.stats.hits++;
        } else {
          this.stats.misses++;
        }
      });
      
      return values;
    } catch (error) {
      this.stats.errors++;
      console.error(`Cache MGET error [${cacheType}]:`, error);
      return {};
    }
  }

  // Set multiple values
  mset(cacheType, keyValuePairs, ttl = null) {
    try {
      const cache = this.caches[cacheType];
      if (!cache) {
        throw new Error(`Cache type '${cacheType}' not found`);
      }
      
      const success = ttl ? cache.mset(keyValuePairs, ttl) : cache.mset(keyValuePairs);
      if (success) {
        this.stats.sets += Object.keys(keyValuePairs).length;
        return true;
      }
      return false;
    } catch (error) {
      this.stats.errors++;
      console.error(`Cache MSET error [${cacheType}]:`, error);
      return false;
    }
  }

  // Clear all data from specific cache
  flushCache(cacheType) {
    try {
      const cache = this.caches[cacheType];
      if (!cache) {
        throw new Error(`Cache type '${cacheType}' not found`);
      }
      
      cache.flushAll();
      console.log(`Cache FLUSH [${cacheType}]: All keys cleared`);
      return true;
    } catch (error) {
      this.stats.errors++;
      console.error(`Cache FLUSH error [${cacheType}]:`, error);
      return false;
    }
  }

  // Clear all caches
  flushAll() {
    try {
      Object.keys(this.caches).forEach(cacheType => {
        this.caches[cacheType].flushAll();
      });
      console.log('All caches flushed');
      return true;
    } catch (error) {
      this.stats.errors++;
      console.error('Cache FLUSH ALL error:', error);
      return false;
    }
  }

  // Get cache statistics
  getStats() {
    const cacheStats = {};
    
    Object.keys(this.caches).forEach(cacheType => {
      const cache = this.caches[cacheType];
      cacheStats[cacheType] = {
        keys: cache.keys().length,
        stats: cache.getStats()
      };
    });
    
    return {
      global: this.stats,
      hitRate: this.stats.hits + this.stats.misses > 0 
        ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2) + '%'
        : '0%',
      caches: cacheStats,
      timestamp: new Date().toISOString()
    };
  }

  // Get cache size
  getSize(cacheType = null) {
    if (cacheType) {
      const cache = this.caches[cacheType];
      return cache ? cache.keys().length : 0;
    }
    
    return Object.keys(this.caches).reduce((total, type) => {
      return total + this.caches[type].keys().length;
    }, 0);
  }

  // Cache middleware for Express
  middleware(cacheType, generateKey, ttl = null) {
    return (req, res, next) => {
      const key = typeof generateKey === 'function' ? generateKey(req) : generateKey;
      
      // Try to get from cache
      const cachedResponse = this.get(cacheType, key);
      if (cachedResponse) {
        res.set('X-Cache', 'HIT');
        return res.json(cachedResponse);
      }
      
      // Cache the response
      const originalJson = res.json;
      res.json = function(data) {
        // Only cache successful responses
        if (res.statusCode === 200) {
          cacheManager.set(cacheType, key, data, ttl);
          res.set('X-Cache', 'MISS');
        }
        return originalJson.call(this, data);
      };
      
      next();
    };
  }

  // Helper method to generate cache keys
  static generateKey(prefix, ...parts) {
    return `${prefix}:${parts.join(':')}`;
  }

  // Helper method to invalidate related keys
  invalidatePattern(cacheType, pattern) {
    try {
      const cache = this.caches[cacheType];
      if (!cache) {
        return false;
      }
      
      const keys = cache.keys();
      const keysToDelete = keys.filter(key => {
        if (typeof pattern === 'string') {
          return key.includes(pattern);
        } else if (pattern instanceof RegExp) {
          return pattern.test(key);
        }
        return false;
      });
      
      keysToDelete.forEach(key => cache.del(key));
      console.log(`Cache INVALIDATE [${cacheType}]: Deleted ${keysToDelete.length} keys matching pattern`);
      
      return keysToDelete.length;
    } catch (error) {
      this.stats.errors++;
      console.error(`Cache INVALIDATE error [${cacheType}]:`, error);
      return 0;
    }
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

// Graceful shutdown - clear all caches
process.on('SIGTERM', () => {
  console.log('Clearing all caches before shutdown...');
  cacheManager.flushAll();
});

process.on('SIGINT', () => {
  console.log('Clearing all caches before shutdown...');
  cacheManager.flushAll();
});

module.exports = {
  cacheManager,
  CacheManager,
  caches
};