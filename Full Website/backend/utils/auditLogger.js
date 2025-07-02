const mongoose = require('mongoose');

// Audit Log Schema
const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  action: {
    type: String,
    required: true,
    enum: [
      // Authentication actions
      'LOGIN_SUCCESS',
      'LOGIN_FAILED_USER_NOT_FOUND',
      'LOGIN_FAILED_INVALID_PASSWORD',
      'LOGIN_VALIDATION_FAILED',
      'LOGIN_ERROR',
      'LOGOUT',
      
      // Registration actions
      'REGISTRATION_SUCCESS',
      'REGISTRATION_FAILED_USER_EXISTS',
      'REGISTRATION_VALIDATION_FAILED',
      'REGISTRATION_ERROR',
      
      // Password reset actions
      'PASSWORD_RESET_REQUESTED',
      'PASSWORD_RESET_REQUESTED_INVALID_EMAIL',
      'PASSWORD_RESET_EMAIL_SENT',
      'PASSWORD_RESET_SUCCESS',
      'PASSWORD_RESET_INVALID_TOKEN',
      
      // Policy and mode actions
      'POLICY_ACCEPTED',
      'MODE_SELECTED',
      
      // Security actions
      'ACCOUNT_LOCKED',
      'ACCOUNT_UNLOCKED',
      'SUSPICIOUS_ACTIVITY_DETECTED',
      'AUTO_BLOCK_TRIGGERED',
      'RATE_LIMIT_EXCEEDED',
      'TOKEN_REFRESH',
      'SESSION_EXPIRED',
      
      // Profile actions
      'PROFILE_UPDATED',
      'EMAIL_CHANGED',
      'PASSWORD_CHANGED',
      
      // Learning actions
      'MODULE_STARTED',
      'MODULE_COMPLETED',
      'ACHIEVEMENT_UNLOCKED',
      'ACHIEVEMENTS_VIEWED',
      'TEAM_JOINED',
      'TEAM_LEFT',
      
      // Meeting actions
      'MEETINGS_VIEWED',
      'MEETING_CREATED',
      'MEETING_UPDATED',
      'MEETING_DELETED',
      'MEETING_RESPONSE_UPDATED',
      'MEETING_ATTENDEES_ADDED',
      
      // Administrative actions
      'USER_CREATED_BY_ADMIN',
      'USER_DEACTIVATED',
      'USER_REACTIVATED',
      'ROLE_CHANGED',
      
      // Search actions
      'SEARCH_PERFORMED',
      'SEARCH_RESULT_CLICKED',
      
      // Notification actions
      'NOTIFICATION_CREATED',
      'NOTIFICATION_READ',
      'NOTIFICATION_DISMISSED',
      'BULK_NOTIFICATION_CREATED',
      'ALL_NOTIFICATIONS_READ',
      'NOTIFICATION_ACTED_UPON',
      
      // Currency actions
      'CURRENCY_AWARDED',
      'CURRENCY_SPENT',
      'CURRENCY_TRANSFERRED',
      
      // Preference actions
      'PREFERENCES_UPDATED',
      'THEME_CHANGED',
      'LANGUAGE_CHANGED',
      'NOTIFICATION_PREFERENCES_UPDATED',
      'PRIVACY_PREFERENCES_UPDATED',
      'PREFERENCES_RESET',
      
      // Socket/Real-time actions
      'SOCKET_CONNECTED',
      'SOCKET_DISCONNECTED',
      'JOINED_TEAM_ROOM',
      'MESSAGE_SENT',
      
      // System actions
      'SERVER_STARTED',
      'HEALTH_CHECK',
      'LARGE_REQUEST_DETECTED',
      'ENDPOINT_NOT_FOUND',
      'SERVER_ERROR',
      'EMAIL_DELIVERY_SUCCESS',
      'EMAIL_DELIVERY_FAILED',
      'EMAIL_RETRY_SCHEDULED',
      'EMAIL_DELIVERY_ALERT',
      'SYSTEM_BACKUP',
      'SYSTEM_MAINTENANCE',
      'DATABASE_MIGRATION',
      
      // Analytics actions
      'ANALYTICS_LOGIN_SUCCESS',
      'ANALYTICS_LOGIN_FAILED',
      'ANALYTICS_PAGE_VIEW',
      'ANALYTICS_USER_SESSION',
      'ANALYTICS_PERFORMANCE_METRIC',
      'ANALYTICS_BUSINESS_METRIC',
      
      // Security analytics
      'SECURITY_FAILED_LOGIN_ATTEMPT',
      'SECURITY_ACCOUNT_LOCKOUT',
      'SECURITY_SUSPICIOUS_ACTIVITY',
      'SECURITY_BRUTE_FORCE_DETECTED'
    ]
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    default: null
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  success: {
    type: Boolean,
    default: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String,
    default: null
  },
  location: {
    country: String,
    region: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ ipAddress: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// Main logging function
const logUserAction = async (userId, action, ipAddress, userAgent, details = {}, severity = 'LOW', sessionId = null) => {
  try {
    const logEntry = new AuditLog({
      userId: userId || null,
      action,
      ipAddress: ipAddress || 'unknown',
      userAgent: userAgent || 'unknown',
      details,
      severity,
      success: !action.includes('FAILED') && !action.includes('ERROR'),
      sessionId,
      timestamp: new Date()
    });

    await logEntry.save();
    
    // If this is a critical action, also log to console immediately
    if (severity === 'CRITICAL' || action.includes('FAILED') || action.includes('ERROR')) {
      console.log(`[AUDIT] ${severity}: ${action} - User: ${userId || 'anonymous'} - IP: ${ipAddress} - Details:`, details);
    }

    return logEntry;
  } catch (error) {
    console.error('Failed to create audit log entry:', error);
    // Don't throw error to prevent breaking the main application flow
    return null;
  }
};

// Specialized logging functions
const logSecurityEvent = async (userId, action, ipAddress, userAgent, details = {}) => {
  return await logUserAction(userId, action, ipAddress, userAgent, details, 'HIGH');
};

const logCriticalEvent = async (userId, action, ipAddress, userAgent, details = {}) => {
  return await logUserAction(userId, action, ipAddress, userAgent, details, 'CRITICAL');
};

const logAuthenticationEvent = async (userId, action, ipAddress, userAgent, details = {}) => {
  const severity = action.includes('SUCCESS') ? 'LOW' : 'MEDIUM';
  return await logUserAction(userId, action, ipAddress, userAgent, details, severity);
};

// Get audit logs with pagination and filtering
const getAuditLogs = async (filters = {}, options = {}) => {
  try {
    const {
      userId,
      action,
      ipAddress,
      severity,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = { ...filters, ...options };

    const query = {};

    // Build query filters
    if (userId) {query.userId = userId;}
    if (action) {query.action = action;}
    if (ipAddress) {query.ipAddress = new RegExp(ipAddress, 'i');}
    if (severity) {query.severity = severity;}
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {query.timestamp.$gte = new Date(startDate);}
      if (endDate) {query.timestamp.$lte = new Date(endDate);}
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('userId', 'firstName lastName email role')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(query)
    ]);

    return {
      logs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLogs: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw new Error('Failed to fetch audit logs');
  }
};

// Get audit statistics
const getAuditStats = async (timeframe = 'day') => {
  try {
    const now = new Date();
    let startDate;

    switch (timeframe) {
      case 'hour':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const stats = await AuditLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            action: '$action',
            severity: '$severity'
          },
          count: { $sum: 1 },
          latestTimestamp: { $max: '$timestamp' }
        }
      },
      {
        $group: {
          _id: '$_id.severity',
          actions: {
            $push: {
              action: '$_id.action',
              count: '$count',
              latestTimestamp: '$latestTimestamp'
            }
          },
          totalCount: { $sum: '$count' }
        }
      },
      {
        $sort: { totalCount: -1 }
      }
    ]);

    return {
      timeframe,
      startDate,
      endDate: now,
      stats
    };
  } catch (error) {
    console.error('Error generating audit statistics:', error);
    throw new Error('Failed to generate audit statistics');
  }
};

// Clean up old audit logs (for data retention)
const cleanupOldLogs = async (retentionDays = 365) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await AuditLog.deleteMany({
      timestamp: { $lt: cutoffDate },
      severity: { $in: ['LOW', 'MEDIUM'] } // Keep HIGH and CRITICAL logs longer
    });

    console.log(`Cleaned up ${result.deletedCount} old audit logs older than ${retentionDays} days`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up old audit logs:', error);
    throw new Error('Failed to clean up old audit logs');
  }
};

// Detect suspicious patterns
const detectSuspiciousActivity = async (ipAddress, timeWindowMinutes = 15) => {
  try {
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - timeWindowMinutes);

    const suspiciousPatterns = await AuditLog.aggregate([
      {
        $match: {
          ipAddress,
          timestamp: { $gte: startTime },
          $or: [
            { action: { $regex: 'FAILED' } },
            { action: { $regex: 'ERROR' } },
            { severity: 'HIGH' }
          ]
        }
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          latestAttempt: { $max: '$timestamp' }
        }
      },
      {
        $match: {
          count: { $gte: 3 } // 3 or more failed attempts
        }
      }
    ]);

    if (suspiciousPatterns.length > 0) {
      await logSecurityEvent(
        null,
        'SUSPICIOUS_ACTIVITY_DETECTED',
        ipAddress,
        'system',
        { patterns: suspiciousPatterns, timeWindow: timeWindowMinutes }
      );
    }

    return suspiciousPatterns;
  } catch (error) {
    console.error('Error detecting suspicious activity:', error);
    return [];
  }
};

module.exports = {
  AuditLog,
  logUserAction,
  logSecurityEvent,
  logCriticalEvent,
  logAuthenticationEvent,
  getAuditLogs,
  getAuditStats,
  cleanupOldLogs,
  detectSuspiciousActivity
};