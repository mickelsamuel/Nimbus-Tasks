const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { detectSuspiciousActivity, logSecurityEvent } = require('../utils/auditLogger');

// Enhanced rate limiting with dynamic thresholds
const createDynamicRateLimit = (windowMs, max, skipSuccessfulRequests = false) => {
  return rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests,
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (req, res) => {
      // Log rate limit exceeded
      await logSecurityEvent(
        req.user?._id || null,
        'RATE_LIMIT_EXCEEDED',
        req.ip,
        req.get('User-Agent'),
        { 
          endpoint: req.path,
          method: req.method,
          windowMs,
          maxRequests: max
        }
      );

      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.round(windowMs / 1000)
      });
    },
    keyGenerator: (req) => {
      // Use combination of IP and user ID for authenticated requests
      return req.user ? `${req.ip}_${req.user._id}` : req.ip;
    }
  });
};

// Strict rate limiting for authentication endpoints - DISABLED FOR DEVELOPMENT
const authRateLimit = createDynamicRateLimit(
  15 * 60 * 1000, // 15 minutes
  1000, // max 1000 attempts per window (effectively disabled)
  false
);

// General API rate limiting
const apiRateLimit = createDynamicRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // max 100 requests per window
  true // skip successful requests
);

// Password reset rate limiting
const passwordResetRateLimit = createDynamicRateLimit(
  60 * 60 * 1000, // 1 hour
  3, // max 3 password reset attempts per hour
  false
);

// File upload rate limiting
const uploadRateLimit = createDynamicRateLimit(
  60 * 60 * 1000, // 1 hour
  20, // max 20 uploads per hour
  false
);

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || "http://localhost:3001"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  crossOriginEmbedderPolicy: false, // Disable for development
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin"
  }
});

// IP whitelist/blacklist middleware
const ipFilter = (req, res, next) => {
  const clientIP = req.ip;
  
  // List of blocked IPs (this could be moved to database/cache)
  const blockedIPs = process.env.BLOCKED_IPS ? process.env.BLOCKED_IPS.split(',') : [];
  
  if (blockedIPs.includes(clientIP)) {
    logSecurityEvent(
      null,
      'BLOCKED_IP_ACCESS_ATTEMPT',
      clientIP,
      req.get('User-Agent'),
      { endpoint: req.path, method: req.method }
    );
    
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  next();
};

// Suspicious activity detection middleware
const suspiciousActivityDetector = async (req, res, next) => {
  try {
    // Check for suspicious patterns in the last 15 minutes
    const suspiciousPatterns = await detectSuspiciousActivity(req.ip, 15);
    
    if (suspiciousPatterns.length > 0) {
      // Add warning header but don't block (for now)
      res.set('X-Security-Warning', 'Suspicious activity detected');
      
      // Could implement automatic blocking here if needed
      const totalFailedAttempts = suspiciousPatterns.reduce((sum, pattern) => sum + pattern.count, 0);
      
      if (totalFailedAttempts >= 10) {
        await logSecurityEvent(
          req.user?._id || null,
          'AUTO_BLOCK_TRIGGERED',
          req.ip,
          req.get('User-Agent'),
          { totalFailedAttempts, patterns: suspiciousPatterns }
        );
        
        return res.status(429).json({
          success: false,
          message: 'Account temporarily locked due to suspicious activity. Please contact support.'
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in suspicious activity detector:', error);
    next(); // Continue even if detection fails
  }
};

// Request sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Basic XSS prevention for all string inputs
  const sanitizeString = (str) => {
    if (typeof str !== 'string') {return str;}
    
    // Remove potentially dangerous characters
    return str
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove on* event handlers
      .trim();
  };

  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) {return obj;}
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3001',
      'http://localhost:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000'
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) {return callback(null, true);}
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logSecurityEvent(
        null,
        'CORS_VIOLATION',
        'unknown',
        'unknown',
        { origin, allowedOrigins }
      );
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Security-Warning']
};

// Session security configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || (() => {
    console.error('SESSION_SECRET environment variable is not set - using random session secret');
    return require('crypto').randomBytes(32).toString('hex');
  })(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // CSRF protection
  },
  name: 'bnc.session.id' // Custom session name
};

// Brute force protection for specific routes
const bruteForceProtection = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const key = `${req.ip}_${req.path}`;
    const now = Date.now();
    
    // Clean up old attempts
    for (const [attemptKey, attemptData] of attempts.entries()) {
      if (now - attemptData.firstAttempt > windowMs) {
        attempts.delete(attemptKey);
      }
    }
    
    const userAttempts = attempts.get(key);
    
    if (userAttempts && userAttempts.count >= maxAttempts) {
      logSecurityEvent(
        req.user?._id || null,
        'BRUTE_FORCE_BLOCKED',
        req.ip,
        req.get('User-Agent'),
        { 
          endpoint: req.path,
          attempts: userAttempts.count,
          windowMs
        }
      );
      
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please try again later.',
        retryAfter: Math.round((userAttempts.firstAttempt + windowMs - now) / 1000)
      });
    }
    
    // Increment attempts on failed responses
    res.on('finish', () => {
      if (res.statusCode >= 400) {
        if (userAttempts) {
          userAttempts.count++;
        } else {
          attempts.set(key, { count: 1, firstAttempt: now });
        }
      }
    });
    
    next();
  };
};

module.exports = {
  authRateLimit,
  apiRateLimit,
  passwordResetRateLimit,
  uploadRateLimit,
  securityHeaders,
  ipFilter,
  suspiciousActivityDetector,
  sanitizeInput,
  corsOptions,
  sessionConfig,
  bruteForceProtection,
  createDynamicRateLimit
};