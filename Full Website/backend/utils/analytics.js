const { logUserAction } = require('./auditLogger');

// Analytics tracking system for user behavior and system performance
class AnalyticsTracker {
  constructor() {
    this.events = new Map();
    this.userSessions = new Map();
    this.pageViews = new Map();
    this.performanceMetrics = new Map();
  }

  // Track user authentication events
  async trackAuthEvent(eventType, userId, metadata = {}) {
    const event = {
      type: 'authentication',
      event: eventType,
      userId,
      timestamp: new Date(),
      metadata: {
        ...metadata,
        userAgent: metadata.userAgent,
        ip: metadata.ip
      }
    };

    await this.recordEvent(event);
    
    // Log to audit system
    await logUserAction(
      userId,
      `ANALYTICS_${eventType.toUpperCase()}`,
      metadata.ip || 'unknown',
      metadata.userAgent || 'unknown',
      metadata,
      'LOW'
    );
  }

  // Track password reset flow
  async trackPasswordResetFlow(step, email, metadata = {}) {
    const event = {
      type: 'password_reset',
      step, // 'requested', 'email_sent', 'token_validated', 'completed'
      email: this.hashEmail(email),
      timestamp: new Date(),
      metadata
    };

    await this.recordEvent(event);
  }

  // Track user registration flow
  async trackRegistrationFlow(step, email, metadata = {}) {
    const event = {
      type: 'registration',
      step, // 'started', 'form_completed', 'email_sent', 'completed'
      email: this.hashEmail(email),
      timestamp: new Date(),
      metadata
    };

    await this.recordEvent(event);
  }

  // Track page views and user navigation
  async trackPageView(userId, page, metadata = {}) {
    const event = {
      type: 'page_view',
      userId,
      page,
      timestamp: new Date(),
      metadata: {
        ...metadata,
        loadTime: metadata.loadTime,
        previousPage: metadata.previousPage,
        sessionId: metadata.sessionId
      }
    };

    await this.recordEvent(event);
    this.updatePageViewStats(page);
  }

  // Track user session information
  async trackUserSession(userId, action, metadata = {}) {
    const sessionKey = `${userId}_${metadata.sessionId || 'default'}`;
    const timestamp = new Date();

    let session = this.userSessions.get(sessionKey);
    
    if (action === 'start' || !session) {
      session = {
        userId,
        sessionId: metadata.sessionId,
        startTime: timestamp,
        lastActivity: timestamp,
        pageViews: 0,
        actions: 0,
        device: metadata.device,
        browser: metadata.browser,
        ip: metadata.ip
      };
    } else {
      session.lastActivity = timestamp;
      if (action === 'page_view') {session.pageViews++;}
      if (action === 'action') {session.actions++;}
    }

    this.userSessions.set(sessionKey, session);

    if (action === 'end') {
      session.endTime = timestamp;
      session.duration = timestamp - session.startTime;
      await this.recordSessionMetrics(session);
    }
  }

  // Track performance metrics
  async trackPerformanceMetric(metric, value, metadata = {}) {
    const event = {
      type: 'performance',
      metric, // 'page_load_time', 'api_response_time', 'email_delivery_time'
      value,
      timestamp: new Date(),
      metadata
    };

    await this.recordEvent(event);
    this.updatePerformanceStats(metric, value);
  }

  // Track business metrics
  async trackBusinessMetric(metric, value, metadata = {}) {
    const event = {
      type: 'business',
      metric, // 'password_reset_success_rate', 'user_activation_rate', 'daily_active_users'
      value,
      timestamp: new Date(),
      metadata
    };

    await this.recordEvent(event);
  }

  // Track security events
  async trackSecurityEvent(eventType, metadata = {}) {
    const event = {
      type: 'security',
      event: eventType,
      timestamp: new Date(),
      metadata
    };

    await this.recordEvent(event);
    
    // Log security events with higher priority
    await logUserAction(
      metadata.userId || null,
      `SECURITY_${eventType.toUpperCase()}`,
      metadata.ip || 'unknown',
      metadata.userAgent || 'unknown',
      metadata,
      'MEDIUM'
    );
  }

  // Record event in storage
  async recordEvent(event) {
    const eventId = `${event.type}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.events.set(eventId, event);
    
    // Clean up old events (keep last 10000)
    if (this.events.size > 10000) {
      const oldestKeys = Array.from(this.events.keys()).slice(0, 1000);
      oldestKeys.forEach(key => this.events.delete(key));
    }
  }

  // Update page view statistics
  updatePageViewStats(page) {
    const stats = this.pageViews.get(page) || { views: 0, lastView: null };
    stats.views++;
    stats.lastView = new Date();
    this.pageViews.set(page, stats);
  }

  // Update performance statistics
  updatePerformanceStats(metric, value) {
    const stats = this.performanceMetrics.get(metric) || { 
      count: 0, 
      total: 0, 
      min: null, 
      max: null, 
      average: 0 
    };
    
    stats.count++;
    stats.total += value;
    stats.min = stats.min === null ? value : Math.min(stats.min, value);
    stats.max = stats.max === null ? value : Math.max(stats.max, value);
    stats.average = stats.total / stats.count;
    
    this.performanceMetrics.set(metric, stats);
  }

  // Record session metrics for analysis
  async recordSessionMetrics(session) {
    const sessionMetrics = {
      userId: session.userId,
      sessionDuration: session.duration,
      pageViews: session.pageViews,
      actions: session.actions,
      device: session.device,
      browser: session.browser,
      timestamp: new Date()
    };

    await this.trackBusinessMetric('session_completed', sessionMetrics);
  }

  // Get analytics dashboard data
  getDashboardData(timeframe = 'day') {
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
      case 'month':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const filteredEvents = Array.from(this.events.values())
      .filter(event => event.timestamp >= startTime);

    return {
      timeframe,
      startTime,
      endTime: now,
      summary: this.generateSummaryStats(filteredEvents),
      authentication: this.getAuthStats(filteredEvents),
      passwordReset: this.getPasswordResetStats(filteredEvents),
      registration: this.getRegistrationStats(filteredEvents),
      pageViews: this.getPageViewStats(filteredEvents),
      performance: this.getPerformanceStats(),
      security: this.getSecurityStats(filteredEvents),
      topPages: this.getTopPages(),
      activeUsers: this.getActiveUsers(startTime)
    };
  }

  // Generate summary statistics
  generateSummaryStats(events) {
    const summary = {
      totalEvents: events.length,
      uniqueUsers: new Set(events.map(e => e.userId).filter(Boolean)).size,
      byType: {},
      hourlyDistribution: {}
    };

    events.forEach(event => {
      // Count by type
      summary.byType[event.type] = (summary.byType[event.type] || 0) + 1;
      
      // Hourly distribution
      const hour = event.timestamp.getHours();
      summary.hourlyDistribution[hour] = (summary.hourlyDistribution[hour] || 0) + 1;
    });

    return summary;
  }

  // Get authentication statistics
  getAuthStats(events) {
    const authEvents = events.filter(e => e.type === 'authentication');
    const stats = {
      totalAttempts: authEvents.length,
      successful: authEvents.filter(e => e.event === 'login_success').length,
      failed: authEvents.filter(e => e.event === 'login_failed').length,
      passwordResets: authEvents.filter(e => e.event === 'password_reset_requested').length,
      registrations: authEvents.filter(e => e.event === 'user_registered').length
    };

    stats.successRate = stats.totalAttempts > 0 
      ? ((stats.successful / stats.totalAttempts) * 100).toFixed(2)
      : 0;

    return stats;
  }

  // Get password reset flow statistics
  getPasswordResetStats(events) {
    const resetEvents = events.filter(e => e.type === 'password_reset');
    const stats = {
      requested: resetEvents.filter(e => e.step === 'requested').length,
      emailSent: resetEvents.filter(e => e.step === 'email_sent').length,
      tokenValidated: resetEvents.filter(e => e.step === 'token_validated').length,
      completed: resetEvents.filter(e => e.step === 'completed').length
    };

    stats.completionRate = stats.requested > 0 
      ? ((stats.completed / stats.requested) * 100).toFixed(2)
      : 0;

    return stats;
  }

  // Get registration flow statistics
  getRegistrationStats(events) {
    const regEvents = events.filter(e => e.type === 'registration');
    const stats = {
      started: regEvents.filter(e => e.step === 'started').length,
      formCompleted: regEvents.filter(e => e.step === 'form_completed').length,
      emailSent: regEvents.filter(e => e.step === 'email_sent').length,
      completed: regEvents.filter(e => e.step === 'completed').length
    };

    stats.conversionRate = stats.started > 0 
      ? ((stats.completed / stats.started) * 100).toFixed(2)
      : 0;

    return stats;
  }

  // Get page view statistics
  getPageViewStats(events) {
    const pageEvents = events.filter(e => e.type === 'page_view');
    const stats = {
      totalViews: pageEvents.length,
      uniquePages: new Set(pageEvents.map(e => e.page)).size,
      byPage: {}
    };

    pageEvents.forEach(event => {
      stats.byPage[event.page] = (stats.byPage[event.page] || 0) + 1;
    });

    return stats;
  }

  // Get performance statistics
  getPerformanceStats() {
    const stats = {};
    
    for (const [metric, data] of this.performanceMetrics.entries()) {
      stats[metric] = {
        average: parseFloat(data.average.toFixed(2)),
        min: data.min,
        max: data.max,
        count: data.count
      };
    }

    return stats;
  }

  // Get security event statistics
  getSecurityStats(events) {
    const securityEvents = events.filter(e => e.type === 'security');
    const stats = {
      totalIncidents: securityEvents.length,
      byType: {},
      recentIncidents: securityEvents
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10)
    };

    securityEvents.forEach(event => {
      stats.byType[event.event] = (stats.byType[event.event] || 0) + 1;
    });

    return stats;
  }

  // Get top pages by views
  getTopPages(limit = 10) {
    return Array.from(this.pageViews.entries())
      .sort(([, a], [, b]) => b.views - a.views)
      .slice(0, limit)
      .map(([page, stats]) => ({ page, views: stats.views }));
  }

  // Get active users in timeframe
  getActiveUsers(startTime) {
    const activeSessions = Array.from(this.userSessions.values())
      .filter(session => session.lastActivity >= startTime);

    return {
      total: activeSessions.length,
      unique: new Set(activeSessions.map(s => s.userId)).size,
      averageSessionDuration: this.calculateAverageSessionDuration(activeSessions),
      averagePageViews: this.calculateAveragePageViews(activeSessions)
    };
  }

  // Calculate average session duration
  calculateAverageSessionDuration(sessions) {
    const completedSessions = sessions.filter(s => s.duration);
    if (completedSessions.length === 0) {return 0;}
    
    const totalDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    return Math.round(totalDuration / completedSessions.length / 1000 / 60); // minutes
  }

  // Calculate average page views per session
  calculateAveragePageViews(sessions) {
    if (sessions.length === 0) {return 0;}
    
    const totalPageViews = sessions.reduce((sum, s) => sum + s.pageViews, 0);
    return parseFloat((totalPageViews / sessions.length).toFixed(2));
  }

  // Hash email for privacy
  hashEmail(email) {
    if (!email) {return null;}
    
    // Simple hash for analytics (not cryptographically secure)
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  // Export data for external analytics tools
  exportData(format = 'json', timeframe = 'day') {
    const data = this.getDashboardData(timeframe);
    
    switch (format) {
      case 'csv':
        return this.convertToCSV(data);
      case 'json':
        return JSON.stringify(data, null, 2);
      default:
        return data;
    }
  }

  // Convert data to CSV format
  convertToCSV(data) {
    const headers = ['timestamp', 'type', 'metric', 'value'];
    const rows = [headers.join(',')];
    
    // Add summary data
    Object.entries(data.summary.byType).forEach(([type, count]) => {
      rows.push([data.endTime.toISOString(), 'summary', type, count].join(','));
    });
    
    return rows.join('\n');
  }
}

// Create singleton instance
const analyticsTracker = new AnalyticsTracker();

module.exports = {
  AnalyticsTracker,
  analyticsTracker
};