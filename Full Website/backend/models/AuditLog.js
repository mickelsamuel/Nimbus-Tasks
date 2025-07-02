const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: String,
  userAgent: String,
  details: mongoose.Schema.Types.Mixed,
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  }
}, {
  timestamps: true,
  // TTL index to automatically delete old logs after 365 days
  index: { timestamp: 1 },
  expireAfterSeconds: 365 * 24 * 60 * 60
});

// Indexes for performance
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

module.exports = { AuditLog };