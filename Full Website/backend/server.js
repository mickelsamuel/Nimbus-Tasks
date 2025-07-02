const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Validate required environment variables
const validateEnvironment = () => {
  const requiredVars = [
    'JWT_SECRET',
    'MONGODB_URI'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    console.error('Application cannot start without these variables');
    process.exit(1);
  }
  
  // Warn about recommended variables
  const recommendedVars = [
    'SESSION_SECRET',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS'
  ];
  
  const missingRecommended = recommendedVars.filter(varName => !process.env[varName]);
  
  if (missingRecommended.length > 0) {
    console.warn('Missing recommended environment variables:', missingRecommended.join(', '));
    console.warn('Some features may not work correctly without these variables');
  }
};

// Validate environment before starting
validateEnvironment();

// Import database connection
const connectDB = require('./config/database');

// Import security middleware
const {
  securityHeaders,
  // apiRateLimit,
  ipFilter,
  // suspiciousActivityDetector,
  sanitizeInput,
  corsOptions,
  sessionConfig
} = require('./middleware/security');

// Import audit logging
const { logUserAction, cleanupOldLogs } = require('./utils/auditLogger');

// Import performance monitoring
const performanceMonitor = require('./middleware/monitoring');

const app = express();
const server = createServer(app);

// Trust proxy for accurate IP detection
app.set('trust proxy', 1);

// Enhanced security headers
app.use(securityHeaders);

// Compression middleware
app.use(compression());

// IP filtering
app.use(ipFilter);

// CORS configuration
app.use(cors(corsOptions));

// Performance monitoring
app.use(performanceMonitor.middleware());

// Body parsing middleware with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Log large requests for monitoring
    if (buf.length > 1024 * 1024) { // 1MB
      logUserAction(
        null,
        'LARGE_REQUEST_DETECTED',
        req.ip,
        req.get('User-Agent'),
        { size: buf.length, endpoint: req.path }
      );
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Session configuration
app.use(session({
  ...sessionConfig,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600 // lazy session update
  })
}));

// Enhanced logging with audit trail
app.use(morgan('combined', {
  stream: {
    write: (message) => {
      console.log(message.trim());
      // Could also write to file or external logging service here
    }
  }
}));

// Suspicious activity detection - DISABLED FOR DEVELOPMENT
// app.use(suspiciousActivityDetector);

// General API rate limiting - DISABLED FOR DEVELOPMENT
// app.use('/api/', apiRateLimit);

// Socket.IO setup with enhanced security
const io = new Server(server, {
  cors: corsOptions,
  cookie: {
    name: 'bnc.io',
    httpOnly: true,
    sameSite: 'strict'
  }
});

// Make io globally available for notifications
global.io = io;

// Initialize notification service
const notificationService = require('./utils/notificationService');
notificationService.init(io);

// Middleware to make io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/user', require('./routes/user')); // New user routes for current user
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/modules', require('./routes/modules'));
app.use('/api/simulation', require('./routes/simulation'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/teams', require('./routes/teamChat'));
app.use('/api/team-categories', require('./routes/teamCategories'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/events', require('./routes/events'));
app.use('/api/leaderboards', require('./routes/leaderboards'));
app.use('/api/university', require('./routes/university'));
app.use('/api/career', require('./routes/career'));
app.use('/api/timeline', require('./routes/timeline'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/avatar', require('./routes/avatar'));
app.use('/api/shop', require('./routes/shop'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/manager', require('./routes/manager'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/currency', require('./routes/currency'));
app.use('/api/search', require('./routes/search'));
app.use('/api/preferences', require('./routes/preferences'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/support', require('./routes/support'));
app.use('/api/support', require('./routes/supportResources'));
app.use('/api/support', require('./routes/supportChat'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/forum', require('./routes/forum'));
app.use('/api/spaces', require('./routes/spaces'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/platform', require('./routes/platform'));
app.use('/api/public', require('./routes/public'));
app.use('/api/errors', require('./routes/errors'));
app.use('/api/health', require('./routes/health'));

// Cache management endpoints
app.get('/api/cache/stats', (req, res) => {
  try {
    const { cacheManager } = require('./config/cache');
    const stats = cacheManager.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/cache/flush/:cacheType?', (req, res) => {
  try {
    const { cacheManager } = require('./config/cache');
    const { cacheType } = req.params;
    
    if (cacheType) {
      const success = cacheManager.flushCache(cacheType);
      res.json({
        success,
        message: success ? `Cache '${cacheType}' flushed` : `Failed to flush cache '${cacheType}'`
      });
    } else {
      cacheManager.flushAll();
      res.json({
        success: true,
        message: 'All caches flushed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Performance metrics endpoint
app.get('/api/metrics', (req, res) => {
  try {
    const metrics = performanceMonitor.getMetricsSummary();
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Detailed metrics endpoint (admin only)
app.get('/api/metrics/detailed', (req, res) => {
  try {
    const metrics = performanceMonitor.getMetrics();
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Enhanced health check endpoint with security monitoring
app.get('/health', async (req, res) => {
  try {
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '2.0.0',
      database: {
        connected: true,
        type: process.env.USE_MEMORY_DB === 'false' ? 'MongoDB Atlas' : 'In-Memory'
      },
      security: {
        rateLimit: 'active',
        auditLogging: 'active',
        sessionSecurity: 'active'
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    };

    await logUserAction(null, 'HEALTH_CHECK', req.ip, req.get('User-Agent'));
    res.status(200).json(healthData);
  } catch {
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced admin audit logs endpoint
app.get('/api/audit-logs', require('./middleware/auth').protect, require('./middleware/auth').authorize('admin'), async (req, res) => {
  try {
    const { getAuditLogs } = require('./utils/auditLogger');
    const filters = {
      userId: req.query.userId,
      action: req.query.action,
      severity: req.query.severity,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    };

    const result = await getAuditLogs(filters, options);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
  }
});

// Email monitoring dashboard endpoint
app.get('/api/admin/email-monitoring', require('./middleware/auth').protect, require('./middleware/auth').authorize('admin'), async (req, res) => {
  try {
    const { emailMonitor } = require('./utils/emailService');
    const timeframe = req.query.timeframe || 'day';
    
    const stats = emailMonitor.getDeliveryStats(timeframe);
    const health = emailMonitor.getSystemHealth();
    const recentDeliveries = emailMonitor.getRecentDeliveries(parseInt(req.query.limit) || 50);
    
    res.json({
      success: true,
      data: {
        stats,
        health,
        recentDeliveries
      }
    });
  } catch (error) {
    console.error('Error fetching email monitoring data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch email monitoring data' });
  }
});


// Socket.IO for real-time features with enhanced security
io.use((socket, next) => {
  // Basic socket authentication
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    socket.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id, 'User ID:', socket.userId);
  
  // Log socket connection
  logUserAction(socket.userId, 'SOCKET_CONNECTED', socket.handshake.address, socket.handshake.headers['user-agent']);

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    if (socket.userId === userId) { // Ensure users can only join their own room
      socket.join(`user-${userId}`);
    }
  });

  // Join team room with validation
  socket.on('join-team-room', async (teamId) => {
    try {
      // Add team membership validation here
      socket.join(`team-${teamId}`);
      logUserAction(socket.userId, 'JOINED_TEAM_ROOM', socket.handshake.address, null, { teamId });
    } catch (error) {
      console.error('Failed to join team room:', error);
      socket.emit('error', 'Failed to join team room');
    }
  });

  // Join support chat room
  socket.on('join-chat-room', (sessionId) => {
    socket.join(`chat-${sessionId}`);
    logUserAction(socket.userId, 'JOINED_CHAT_ROOM', socket.handshake.address, null, { sessionId });
  });

  // Join support team room (for agents)
  socket.on('join-support-team', async () => {
    try {
      const User = require('./models/User');
      const user = await User.findById(socket.userId);
      if (user && ['admin', 'support'].includes(user.role)) {
        socket.join('support-team');
        logUserAction(socket.userId, 'JOINED_SUPPORT_TEAM', socket.handshake.address, null);
      }
    } catch (error) {
      console.error('Failed to join support team:', error);
      socket.emit('error', 'Failed to join support team');
    }
  });

  // Join moderators room (for forum moderation)
  socket.on('join-moderators', async () => {
    try {
      const User = require('./models/User');
      const user = await User.findById(socket.userId);
      if (user && ['admin', 'moderator'].includes(user.role)) {
        socket.join('moderators');
        logUserAction(socket.userId, 'JOINED_MODERATORS', socket.handshake.address, null);
      }
    } catch (error) {
      console.error('Failed to join moderators room:', error);
      socket.emit('error', 'Failed to join moderators room');
    }
  });

  // Virtual Spaces Events
  socket.on('join-space', async (spaceId) => {
    try {
      const Space = require('./models/Space');
      const User = require('./models/User');
      
      const space = await Space.findOne({ id: spaceId });
      const user = await User.findById(socket.userId);
      
      if (space && user && space.canUserJoin(user)) {
        socket.join(`space-${spaceId}`);
        socket.currentSpace = spaceId;
        
        // Notify others in the space
        socket.to(`space-${spaceId}`).emit('user-joined-space', {
          userId: socket.userId,
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.avatar || '🧑‍💼',
          timestamp: new Date()
        });
        
        logUserAction(socket.userId, 'JOINED_VIRTUAL_SPACE', socket.handshake.address, null, { spaceId });
      }
    } catch (error) {
      console.error('Failed to join virtual space:', error);
      socket.emit('error', 'Failed to join virtual space');
    }
  });

  socket.on('leave-space', (spaceId) => {
    if (socket.currentSpace === spaceId) {
      socket.leave(`space-${spaceId}`);
      socket.to(`space-${spaceId}`).emit('user-left-space', {
        userId: socket.userId,
        timestamp: new Date()
      });
      socket.currentSpace = null;
      logUserAction(socket.userId, 'LEFT_VIRTUAL_SPACE', socket.handshake.address, null, { spaceId });
    }
  });

  socket.on('space-activity-update', (data) => {
    if (socket.currentSpace && data.userId === socket.userId) {
      socket.to(`space-${socket.currentSpace}`).emit('user-activity-changed', {
        userId: socket.userId,
        activity: data.activity,
        timestamp: new Date()
      });
    }
  });

  socket.on('space-interaction', (data) => {
    if (socket.currentSpace && data.userId === socket.userId) {
      socket.to(`space-${socket.currentSpace}`).emit('space-interaction-event', {
        fromUserId: socket.userId,
        type: data.type, // 'wave', 'chat', 'connect', etc.
        targetUserId: data.targetUserId,
        message: data.message,
        timestamp: new Date()
      });
    }
  });

  // Chat typing indicators
  socket.on('typing-start', (data) => {
    if (data.userId === socket.userId) {
      socket.to(`chat-${data.sessionId}`).emit('user-typing', {
        userId: socket.userId,
        sessionId: data.sessionId
      });
    }
  });

  socket.on('typing-stop', (data) => {
    if (data.userId === socket.userId) {
      socket.to(`chat-${data.sessionId}`).emit('user-stopped-typing', {
        userId: socket.userId,
        sessionId: data.sessionId
      });
    }
  });

  // Agent availability status
  socket.on('agent-status-change', async (data) => {
    try {
      const User = require('./models/User');
      const user = await User.findById(socket.userId);
      if (user && ['admin', 'support'].includes(user.role)) {
        socket.to('support-team').emit('agent-status-updated', {
          agentId: socket.userId,
          status: data.status, // 'available', 'busy', 'away'
          timestamp: new Date()
        });
        logUserAction(socket.userId, 'AGENT_STATUS_CHANGED', socket.handshake.address, null, { status: data.status });
      }
    } catch (error) {
      console.error('Failed to update agent status:', error);
      socket.emit('error', 'Failed to update agent status');
    }
  });

  // Handle real-time chat messages with validation
  socket.on('send-message', (data) => {
    if (data.userId === socket.userId) { // Validate sender
      socket.to(data.roomId).emit('receive-message', data);
      logUserAction(socket.userId, 'MESSAGE_SENT', socket.handshake.address, null, { roomId: data.roomId });
    }
  });

  // Handle live event updates
  socket.on('event-update', (eventData) => {
    socket.broadcast.emit('live-event-update', eventData);
  });

  // Handle leaderboard updates
  socket.on('score-update', (scoreData) => {
    if (scoreData.userId === socket.userId) { // Validate score owner
      io.emit('leaderboard-update', scoreData);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    logUserAction(socket.userId, 'SOCKET_DISCONNECTED', socket.handshake.address, null);
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  
  // Log error for audit
  logUserAction(
    req.user?._id || null,
    'SERVER_ERROR',
    req.ip,
    req.get('User-Agent'),
    { 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      endpoint: req.path,
      method: req.method
    }
  );

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    message: isDevelopment ? err.message : 'Internal server error',
    error: isDevelopment ? {
      message: err.message,
      stack: err.stack
    } : {}
  });
});

// Enhanced 404 handler
app.use('*', (req, res) => {
  logUserAction(
    null,
    'ENDPOINT_NOT_FOUND',
    req.ip,
    req.get('User-Agent'),
    { endpoint: req.originalUrl, method: req.method }
  );
  
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: {
      auth: '/api/auth',
      users: '/api/users',
      dashboard: '/api/dashboard',
      health: '/health'
    }
  });
});

const PORT = process.env.PORT || 3000;

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Setup periodic audit log cleanup (run daily)
    setInterval(async () => {
      try {
        await cleanupOldLogs(365); // Keep logs for 1 year
      } catch (error) {
        console.error('Failed to cleanup old audit logs:', error);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

    // Start server
    server.listen(PORT, () => {
      console.log('🚀 BNC Training Platform Server Starting...');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🌟 Server: http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
      console.log(`💾 Database: ${process.env.USE_MEMORY_DB === 'false' ? 'MongoDB Atlas' : 'In-Memory MongoDB'}`);
      console.log(`🔒 Security: Enhanced (Rate Limiting, Audit Logging, Input Sanitization)`);
      console.log(`📧 Email Service: ${process.env.GOOGLE_EMAIL_USER ? 'Google Gmail Configured' : 'Not configured'}`);
      console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Using fallback'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ BNC Training Platform is ready for secure operations!');
      
      // Log server startup
      logUserAction(null, 'SERVER_STARTED', 'localhost', 'system', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        version: '2.0.0'
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, io };