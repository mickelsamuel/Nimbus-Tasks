const { EventEmitter } = require('events');
const { caches } = require('../config/cache');

class EmailQueue extends EventEmitter {
  constructor(options = {}) {
    super();
    this.queue = [];
    this.processing = false;
    this.retryAttempts = options.retryAttempts || 3;
    this.batchSize = options.batchSize || 10;
    this.delayBetweenBatches = options.delayBetweenBatches || 2000; // 2 seconds
    this.maxQueueSize = options.maxQueueSize || 1000;
    
    // Email rate limiting
    this.rateLimits = {
      perMinute: options.rateLimitPerMinute || 60,
      perHour: options.rateLimitPerHour || 1000,
      perDay: options.rateLimitPerDay || 10000
    };
    
    this.stats = {
      processed: 0,
      failed: 0,
      retries: 0,
      lastProcessed: null
    };
    
    // Start processing
    this.startProcessing();
  }

  // Add email to queue
  async add(emailData, priority = 'normal') {
    try {
      if (this.queue.length >= this.maxQueueSize) {
        throw new Error('Email queue is full');
      }

      const queueItem = {
        id: this.generateId(),
        data: emailData,
        priority,
        attempts: 0,
        addedAt: new Date(),
        scheduledAt: emailData.scheduledAt || new Date()
      };

      // Insert based on priority
      if (priority === 'high') {
        this.queue.unshift(queueItem);
      } else {
        this.queue.push(queueItem);
      }

      this.emit('added', queueItem);
      
      // Start processing if not already running
      if (!this.processing) {
        this.startProcessing();
      }

      return queueItem.id;
    } catch (error) {
      console.error('Failed to add email to queue:', error);
      throw error;
    }
  }

  // Check rate limits
  async checkRateLimits() {
    const now = new Date();
    const minuteKey = `email_rate:${now.getFullYear()}:${now.getMonth()}:${now.getDate()}:${now.getHours()}:${now.getMinutes()}`;
    const hourKey = `email_rate:${now.getFullYear()}:${now.getMonth()}:${now.getDate()}:${now.getHours()}`;
    const dayKey = `email_rate:${now.getFullYear()}:${now.getMonth()}:${now.getDate()}`;

    const [minuteCount, hourCount, dayCount] = [
      caches.dashboard.get(minuteKey) || 0,
      caches.dashboard.get(hourKey) || 0,  
      caches.dashboard.get(dayKey) || 0
    ];

    if (minuteCount >= this.rateLimits.perMinute) {
      return { allowed: false, reason: 'Rate limit exceeded: per minute' };
    }
    if (hourCount >= this.rateLimits.perHour) {
      return { allowed: false, reason: 'Rate limit exceeded: per hour' };
    }
    if (dayCount >= this.rateLimits.perDay) {
      return { allowed: false, reason: 'Rate limit exceeded: per day' };
    }

    return { allowed: true };
  }

  // Update rate limit counters
  async updateRateLimits() {
    const now = new Date();
    const minuteKey = `email_rate:${now.getFullYear()}:${now.getMonth()}:${now.getDate()}:${now.getHours()}:${now.getMinutes()}`;
    const hourKey = `email_rate:${now.getFullYear()}:${now.getMonth()}:${now.getDate()}:${now.getHours()}`;
    const dayKey = `email_rate:${now.getFullYear()}:${now.getMonth()}:${now.getDate()}`;

    caches.dashboard.set(minuteKey, (caches.dashboard.get(minuteKey) || 0) + 1, 60);
    caches.dashboard.set(hourKey, (caches.dashboard.get(hourKey) || 0) + 1, 3600);
    caches.dashboard.set(dayKey, (caches.dashboard.get(dayKey) || 0) + 1, 86400);
  }

  // Process queue
  async startProcessing() {
    if (this.processing) {
      return;
    }

    this.processing = true;
    
    try {
      while (this.queue.length > 0) {
        // Check rate limits
        const rateLimitCheck = await this.checkRateLimits();
        if (!rateLimitCheck.allowed) {
          console.warn('Email rate limit reached:', rateLimitCheck.reason);
          await this.delay(60000); // Wait 1 minute
          continue;
        }

        // Get next batch
        const batch = this.queue.splice(0, this.batchSize);
        const readyEmails = batch.filter(item => new Date() >= item.scheduledAt);
        
        // Put non-ready emails back
        const notReady = batch.filter(item => new Date() < item.scheduledAt);
        this.queue.unshift(...notReady);

        if (readyEmails.length === 0) {
          await this.delay(5000); // Wait 5 seconds before checking again
          continue;
        }

        // Process batch
        await this.processBatch(readyEmails);
        
        // Delay between batches
        if (this.queue.length > 0) {
          await this.delay(this.delayBetweenBatches);
        }
      }
    } catch (error) {
      console.error('Error processing email queue:', error);
    } finally {
      this.processing = false;
      
      // Check if more items were added while processing
      if (this.queue.length > 0) {
        setTimeout(() => this.startProcessing(), 1000);
      }
    }
  }

  // Process a batch of emails
  async processBatch(batch) {
    const promises = batch.map(item => this.processEmail(item));
    await Promise.allSettled(promises);
  }

  // Process individual email
  async processEmail(item) {
    try {
      const { sendEmailWithFallback } = require('./emailService');
      
      // Increment attempt counter
      item.attempts++;
      
      // Send email
      const result = await sendEmailWithFallback(
        item.data.mailOptions,
        item.data.emailType || 'notification',
        1 // Don't retry in emailService, we handle retries here
      );

      // Update rate limits
      await this.updateRateLimits();
      
      // Success
      this.stats.processed++;
      this.stats.lastProcessed = new Date();
      
      this.emit('success', { item, result });
      
      return result;
    } catch (error) {
      console.error(`Failed to send email (attempt ${item.attempts}):`, error.message);
      
      // Retry logic
      if (item.attempts < this.retryAttempts) {
        this.stats.retries++;
        
        // Exponential backoff: 1min, 5min, 15min
        const delay = Math.pow(3, item.attempts) * 60000;
        item.scheduledAt = new Date(Date.now() + delay);
        
        // Put back in queue for retry
        this.queue.unshift(item);
        
        this.emit('retry', { item, error, nextAttempt: item.scheduledAt });
      } else {
        // Max retries reached
        this.stats.failed++;
        
        this.emit('failed', { item, error });
        
        // Log to error tracking system if available
        try {
          const errorData = {
            type: 'email_queue_failure',
            emailType: item.data.emailType,
            recipient: item.data.mailOptions?.to,
            attempts: item.attempts,
            error: error.message,
            addedAt: item.addedAt,
            failedAt: new Date()
          };
          
          // Store in cache for monitoring
          const errorKey = `email_errors:${Date.now()}`;
          caches.dashboard.set(errorKey, errorData, 86400); // Keep for 24 hours
        } catch (logError) {
          console.error('Failed to log email error:', logError);
        }
      }
    }
  }

  // Utility methods
  generateId() {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Queue management
  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      stats: { ...this.stats },
      rateLimits: this.rateLimits
    };
  }

  // Get pending emails by priority
  getPendingByPriority() {
    const high = this.queue.filter(item => item.priority === 'high').length;
    const normal = this.queue.filter(item => item.priority === 'normal').length;
    const low = this.queue.filter(item => item.priority === 'low').length;
    
    return { high, normal, low, total: this.queue.length };
  }

  // Clear queue (for maintenance)
  clearQueue() {
    const clearedCount = this.queue.length;
    this.queue = [];
    this.emit('cleared', { count: clearedCount });
    return clearedCount;
  }

  // Add scheduled email
  async scheduleEmail(emailData, sendAt, priority = 'normal') {
    const scheduledData = {
      ...emailData,
      scheduledAt: new Date(sendAt)
    };
    
    return this.add(scheduledData, priority);
  }

  // Bulk add emails with intelligent batching
  async addBulk(emails, priority = 'normal') {
    const results = [];
    
    for (const emailData of emails) {
      try {
        const id = await this.add(emailData, priority);
        results.push({ success: true, id, email: emailData.mailOptions?.to });
      } catch (error) {
        results.push({ 
          success: false, 
          error: error.message, 
          email: emailData.mailOptions?.to 
        });
      }
    }
    
    return results;
  }

  // Get queue analytics
  getAnalytics() {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const recentItems = this.queue.filter(item => item.addedAt >= hourAgo);
    const avgWaitTime = this.queue.length > 0 ? 
      this.queue.reduce((sum, item) => sum + (now - item.addedAt), 0) / this.queue.length : 0;

    return {
      ...this.getQueueStatus(),
      recentlyAdded: recentItems.length,
      averageWaitTime: Math.round(avgWaitTime / 1000), // in seconds
      oldestItem: this.queue.length > 0 ? this.queue[this.queue.length - 1].addedAt : null,
      pendingByPriority: this.getPendingByPriority()
    };
  }
}

// Create singleton instance
const emailQueue = new EmailQueue({
  retryAttempts: 3,
  batchSize: 5, // Conservative batch size
  delayBetweenBatches: 3000, // 3 seconds between batches
  rateLimitPerMinute: 30, // Conservative rate limiting
  rateLimitPerHour: 500,
  rateLimitPerDay: 5000
});

// Event logging
emailQueue.on('success', (data) => {
  console.log(`Email sent successfully: ${data.item.data.mailOptions?.to}`);
});

emailQueue.on('failed', (data) => {
  console.error(`Email failed permanently: ${data.item.data.mailOptions?.to} - ${data.error.message}`);
});

emailQueue.on('retry', (data) => {
  console.warn(`Email retry scheduled: ${data.item.data.mailOptions?.to} - Attempt ${data.item.attempts} - Next: ${data.nextAttempt}`);
});

module.exports = emailQueue;