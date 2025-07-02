const { logUserAction } = require('./auditLogger');

// Email delivery monitoring system
class EmailMonitor {
  constructor() {
    this.deliveryAttempts = new Map();
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailure = null;
    this.alertThreshold = 5; // Alert after 5 consecutive failures
  }

  // Track email delivery attempt
  async trackDelivery(emailType, recipient, success, messageId = null, error = null) {
    const timestamp = new Date();
    const deliveryId = `${emailType}_${recipient}_${timestamp.getTime()}`;
    
    const deliveryRecord = {
      id: deliveryId,
      emailType,
      recipient,
      success,
      messageId,
      error: error?.message || null,
      timestamp,
      retryCount: 0
    };

    // Store delivery attempt
    this.deliveryAttempts.set(deliveryId, deliveryRecord);
    
    // Update counters
    if (success) {
      this.successCount++;
      this.resetFailureStreak();
    } else {
      this.failureCount++;
      this.lastFailure = timestamp;
      await this.handleFailure(deliveryRecord);
    }

    // Log the delivery attempt
    await logUserAction(
      null,
      success ? 'EMAIL_DELIVERY_SUCCESS' : 'EMAIL_DELIVERY_FAILED',
      'system',
      'email-service',
      {
        emailType,
        recipient: this.maskEmail(recipient),
        messageId,
        error: error?.message,
        deliveryId
      },
      success ? 'LOW' : 'MEDIUM'
    );

    // Clean up old records (keep last 1000 for monitoring)
    this.cleanupOldRecords();
    
    return deliveryRecord;
  }

  // Handle email delivery failure
  async handleFailure(deliveryRecord) {
    const consecutiveFailures = this.getConsecutiveFailures();
    
    // Send alert if threshold exceeded
    if (consecutiveFailures >= this.alertThreshold) {
      await this.sendAlert(deliveryRecord, consecutiveFailures);
    }

    // Determine if retry is needed
    const shouldRetry = this.shouldRetryDelivery(deliveryRecord);
    if (shouldRetry) {
      await this.scheduleRetry(deliveryRecord);
    }
  }

  // Get consecutive failure count
  getConsecutiveFailures() {
    let failures = 0;
    const recentAttempts = Array.from(this.deliveryAttempts.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10); // Check last 10 attempts

    for (const attempt of recentAttempts) {
      if (!attempt.success) {
        failures++;
      } else {
        break; // Stop counting when we hit a success
      }
    }

    return failures;
  }

  // Determine if delivery should be retried
  shouldRetryDelivery(deliveryRecord) {
    const maxRetries = this.getMaxRetries(deliveryRecord.emailType);
    const isRetryableError = this.isRetryableError(deliveryRecord.error);
    
    return deliveryRecord.retryCount < maxRetries && isRetryableError;
  }

  // Get maximum retry attempts based on email type
  getMaxRetries(emailType) {
    const retryLimits = {
      'password-reset': 3,
      'welcome': 2,
      'policy-confirmation': 2,
      'notification': 1
    };
    
    return retryLimits[emailType] || 1;
  }

  // Check if error is retryable
  isRetryableError(error) {
    if (!error) {return false;}
    
    const retryableErrors = [
      'ETIMEDOUT',
      'ECONNRESET',
      'ENOTFOUND',
      'ECONNREFUSED',
      'Network Error',
      'Temporary failure'
    ];
    
    return retryableErrors.some(retryableError => 
      error.includes(retryableError)
    );
  }

  // Schedule email retry
  async scheduleRetry(deliveryRecord) {
    const retryDelay = this.calculateRetryDelay(deliveryRecord.retryCount);
    
    setTimeout(async () => {
      deliveryRecord.retryCount++;
      await logUserAction(
        null,
        'EMAIL_RETRY_SCHEDULED',
        'system',
        'email-service',
        {
          emailType: deliveryRecord.emailType,
          recipient: this.maskEmail(deliveryRecord.recipient),
          retryCount: deliveryRecord.retryCount,
          retryDelay
        },
        'MEDIUM'
      );
    }, retryDelay);
  }

  // Calculate retry delay with exponential backoff
  calculateRetryDelay(retryCount) {
    const baseDelay = 30000; // 30 seconds
    const maxDelay = 300000; // 5 minutes
    const delay = baseDelay * Math.pow(2, retryCount);
    
    return Math.min(delay, maxDelay);
  }

  // Send alert for email delivery issues
  async sendAlert(deliveryRecord, consecutiveFailures) {
    const alertMessage = {
      type: 'EMAIL_DELIVERY_ALERT',
      severity: consecutiveFailures >= 10 ? 'CRITICAL' : 'HIGH',
      consecutiveFailures,
      lastFailure: deliveryRecord,
      timestamp: new Date(),
      suggestedActions: [
        'Check SMTP server status',
        'Verify email service credentials',
        'Review network connectivity',
        'Check rate limiting status'
      ]
    };

    // Log critical alert
    await logUserAction(
      null,
      'EMAIL_DELIVERY_ALERT',
      'system',
      'email-monitor',
      alertMessage,
      alertMessage.severity
    );

    // In production, this could send alerts via Slack, Discord, or email to admins
    console.error('🚨 EMAIL DELIVERY ALERT:', alertMessage);
  }

  // Reset failure streak counter
  resetFailureStreak() {
    if (this.failureCount > 0) {
      this.failureCount = 0;
      this.lastFailure = null;
    }
  }

  // Get delivery statistics
  getDeliveryStats(timeframe = 'day') {
    const now = new Date();
    let startTime;

    switch (timeframe) {
      case 'hour':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'day':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const relevantAttempts = Array.from(this.deliveryAttempts.values())
      .filter(attempt => attempt.timestamp >= startTime);

    const stats = {
      totalAttempts: relevantAttempts.length,
      successful: relevantAttempts.filter(a => a.success).length,
      failed: relevantAttempts.filter(a => !a.success).length,
      successRate: 0,
      failureRate: 0,
      byEmailType: {},
      commonErrors: {},
      timeframe,
      startTime,
      endTime: now
    };

    if (stats.totalAttempts > 0) {
      stats.successRate = (stats.successful / stats.totalAttempts * 100).toFixed(2);
      stats.failureRate = (stats.failed / stats.totalAttempts * 100).toFixed(2);
    }

    // Group by email type
    relevantAttempts.forEach(attempt => {
      if (!stats.byEmailType[attempt.emailType]) {
        stats.byEmailType[attempt.emailType] = {
          total: 0,
          successful: 0,
          failed: 0
        };
      }
      
      stats.byEmailType[attempt.emailType].total++;
      if (attempt.success) {
        stats.byEmailType[attempt.emailType].successful++;
      } else {
        stats.byEmailType[attempt.emailType].failed++;
      }
    });

    // Count common errors
    relevantAttempts
      .filter(a => !a.success && a.error)
      .forEach(attempt => {
        const error = attempt.error;
        stats.commonErrors[error] = (stats.commonErrors[error] || 0) + 1;
      });

    return stats;
  }

  // Clean up old delivery records
  cleanupOldRecords() {
    const maxRecords = 1000;
    const records = Array.from(this.deliveryAttempts.entries())
      .sort(([, a], [, b]) => b.timestamp - a.timestamp);

    if (records.length > maxRecords) {
      const recordsToDelete = records.slice(maxRecords);
      recordsToDelete.forEach(([id]) => {
        this.deliveryAttempts.delete(id);
      });
    }
  }

  // Mask email for privacy in logs
  maskEmail(email) {
    if (!email || typeof email !== 'string') {return email;}
    
    const [user, domain] = email.split('@');
    if (!user || !domain) {return email;}
    
    const maskedUser = user.length > 2 
      ? user[0] + '*'.repeat(user.length - 2) + user[user.length - 1]
      : user[0] + '*';
    
    return `${maskedUser}@${domain}`;
  }

  // Get recent delivery attempts
  getRecentDeliveries(limit = 50) {
    return Array.from(this.deliveryAttempts.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
      .map(delivery => ({
        ...delivery,
        recipient: this.maskEmail(delivery.recipient)
      }));
  }

  // Check system health
  getSystemHealth() {
    const recentStats = this.getDeliveryStats('hour');
    const overallStats = this.getDeliveryStats('day');
    
    const health = {
      status: 'healthy',
      issues: [],
      recommendations: []
    };

    // Check recent failure rate
    if (recentStats.failureRate > 20) {
      health.status = 'warning';
      health.issues.push(`High recent failure rate: ${recentStats.failureRate}%`);
      health.recommendations.push('Check SMTP server status and credentials');
    }

    // Check consecutive failures
    const consecutiveFailures = this.getConsecutiveFailures();
    if (consecutiveFailures >= 5) {
      health.status = consecutiveFailures >= 10 ? 'critical' : 'warning';
      health.issues.push(`${consecutiveFailures} consecutive failures detected`);
      health.recommendations.push('Immediate investigation required');
    }

    // Check overall performance
    if (overallStats.failureRate > 10) {
      health.status = health.status === 'healthy' ? 'warning' : health.status;
      health.issues.push(`Overall failure rate too high: ${overallStats.failureRate}%`);
      health.recommendations.push('Review email service configuration');
    }

    return {
      ...health,
      recentStats,
      overallStats,
      lastFailure: this.lastFailure,
      consecutiveFailures
    };
  }
}

// Create singleton instance
const emailMonitor = new EmailMonitor();

module.exports = {
  EmailMonitor,
  emailMonitor
};