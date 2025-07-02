const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  
  // Notification Content
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  
  // Notification Classification
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: [
      'module_completed',
      'achievement_unlocked',
      'friend_request',
      'team_invitation',
      'event_reminder',
      'message_received',
      'system_update',
      'deadline_approaching',
      'badge_earned',
      'level_up',
      'competition_result',
      'course_enrolled',
      'course_deadline',
      'team_activity',
      'admin_announcement',
      'password_reset',
      'email_verification',
      'security_alert',
      'welcome',
      'congratulations',
      'reminder',
      'warning',
      'error'
    ]
  },
  category: {
    type: String,
    enum: ['learning', 'social', 'system', 'achievement', 'reminder', 'security'],
    required: [true, 'Category is required']
  },
  
  // Priority & Urgency
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  importance: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  
  // Visual & Branding
  icon: {
    type: String,
    default: 'bell'
  },
  color: String,
  image: String, // Optional notification image
  
  // Action & Navigation
  actionRequired: {
    type: Boolean,
    default: false
  },
  actions: [{
    type: { type: String, enum: ['button', 'link'] },
    label: String,
    action: String, // URL or action identifier
    style: { type: String, enum: ['primary', 'secondary', 'success', 'warning', 'danger'] },
    external: { type: Boolean, default: false }
  }],
  
  // Related Data
  relatedEntity: {
    type: { type: String, enum: ['module', 'achievement', 'team', 'event', 'user', 'message', 'course'] },
    id: mongoose.Schema.Types.ObjectId,
    data: mongoose.Schema.Types.Mixed // Additional context data
  },
  
  // Sender Information (if applicable)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  senderName: String, // Cached for performance
  
  // Status & Tracking
  status: {
    type: String,
    enum: ['unread', 'read', 'dismissed', 'acted_upon'],
    default: 'unread'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  // Delivery & Channels
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    sms: { type: Boolean, default: false }
  },
  deliveryStatus: {
    inApp: { type: String, enum: ['pending', 'delivered', 'failed'], default: 'delivered' },
    email: { type: String, enum: ['pending', 'sent', 'delivered', 'failed'] },
    push: { type: String, enum: ['pending', 'sent', 'delivered', 'failed'] },
    sms: { type: String, enum: ['pending', 'sent', 'delivered', 'failed'] }
  },
  
  // Scheduling
  scheduledFor: Date, // For scheduled notifications
  expiresAt: Date, // Auto-expire date
  
  // Grouping & Batching
  group: String, // For grouping similar notifications
  batchId: String, // For batch processing
  
  // Localization
  language: {
    type: String,
    enum: ['en', 'fr'],
    default: 'en'
  },
  translations: {
    fr: {
      title: String,
      message: String
    }
  },
  
  // Analytics & Tracking
  analytics: {
    opened: { type: Boolean, default: false },
    openedAt: Date,
    clicked: { type: Boolean, default: false },
    clickedAt: Date,
    dismissed: { type: Boolean, default: false },
    dismissedAt: Date
  },
  
  // Metadata
  metadata: {
    source: String, // Where notification originated
    campaign: String, // Marketing campaign ID
    experiment: String, // A/B test identifier
    customData: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ type: 1, category: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
notificationSchema.index({ group: 1, userId: 1 });

// Virtual for time since creation
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) {return 'Just now';}
  if (diffMins < 60) {return `${diffMins}m ago`;}
  if (diffHours < 24) {return `${diffHours}h ago`;}
  if (diffDays < 7) {return `${diffDays}d ago`;}
  if (diffDays < 30) {return `${Math.floor(diffDays / 7)}w ago`;}
  
  return this.createdAt.toLocaleDateString();
});

// Virtual for notification badge color
notificationSchema.virtual('badgeColor').get(function() {
  const colorMap = {
    info: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  };
  return this.color || colorMap[this.importance] || colorMap.info;
});

// Pre-save middleware to handle defaults and validation
notificationSchema.pre('save', function(next) {
  // Set default expiration (30 days for most notifications)
  if (!this.expiresAt) {
    const expirationDays = this.type.includes('security') ? 7 : 30;
    this.expiresAt = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);
  }
  
  // Auto-set category based on type if not provided
  if (!this.category) {
    if (this.type.includes('achievement') || this.type.includes('badge') || this.type.includes('level')) {
      this.category = 'achievement';
    } else if (this.type.includes('friend') || this.type.includes('team') || this.type.includes('message')) {
      this.category = 'social';
    } else if (this.type.includes('module') || this.type.includes('course') || this.type.includes('deadline')) {
      this.category = 'learning';
    } else if (this.type.includes('security') || this.type.includes('password') || this.type.includes('verification')) {
      this.category = 'security';
    } else if (this.type.includes('reminder') || this.type.includes('event')) {
      this.category = 'reminder';
    } else {
      this.category = 'system';
    }
  }
  
  next();
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.status = 'read';
  this.readAt = new Date();
  this.analytics.opened = true;
  this.analytics.openedAt = new Date();
  
  return this.save();
};

// Method to mark as acted upon
notificationSchema.methods.markActedUpon = function() {
  this.status = 'acted_upon';
  this.analytics.clicked = true;
  this.analytics.clickedAt = new Date();
  
  if (!this.isRead) {
    this.markAsRead();
  }
  
  return this.save();
};

// Method to dismiss notification
notificationSchema.methods.dismiss = function() {
  this.status = 'dismissed';
  this.analytics.dismissed = true;
  this.analytics.dismissedAt = new Date();
  
  return this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = function(notificationData) {
  const notification = new this(notificationData);
  
  // Handle batch creation if multiple users
  if (Array.isArray(notificationData.userId)) {
    const notifications = notificationData.userId.map(userId => {
      const data = { ...notificationData };
      data.userId = userId;
      delete data.userIds; // Remove array field
      return new this(data);
    });
    
    return this.insertMany(notifications);
  }
  
  return notification.save();
};

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = function(userId, options = {}) {
  const {
    category,
    status,
    isRead,
    limit = 20,
    skip = 0,
    sortBy = 'createdAt',
    sortOrder = -1
  } = options;
  
  const query = { userId };
  
  if (category) {query.category = category;}
  if (status) {query.status = status;}
  if (isRead !== undefined) {query.isRead = isRead;}
  
  return this.find(query)
    .populate('sender', 'firstName lastName avatar')
    .sort({ [sortBy]: sortOrder })
    .limit(limit)
    .skip(skip);
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function(userId, category = null) {
  const query = { userId, isRead: false };
  if (category) {query.category = category;}
  
  return this.countDocuments(query);
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = function(userId, category = null) {
  const query = { userId, isRead: false };
  if (category) {query.category = category;}
  
  return this.updateMany(query, {
    $set: {
      isRead: true,
      status: 'read',
      readAt: new Date(),
      'analytics.opened': true,
      'analytics.openedAt': new Date()
    }
  });
};

// Static method to create achievement notification
notificationSchema.statics.createAchievementNotification = function(userId, achievement) {
  return this.createNotification({
    userId,
    title: 'Achievement Unlocked!',
    message: `Congratulations! You've earned the "${achievement.name}" achievement.`,
    type: 'achievement_unlocked',
    category: 'achievement',
    importance: 'success',
    icon: 'trophy',
    color: '#F59E0B',
    relatedEntity: {
      type: 'achievement',
      id: achievement._id,
      data: {
        name: achievement.name,
        tier: achievement.tier,
        points: achievement.rewards.points
      }
    },
    actions: [{
      type: 'button',
      label: 'View Achievement',
      action: `/achievements/${achievement._id}`,
      style: 'primary'
    }]
  });
};

// Static method to create module completion notification
notificationSchema.statics.createModuleCompletionNotification = function(userId, module, score) {
  return this.createNotification({
    userId,
    title: 'Module Completed!',
    message: `Great job! You've completed "${module.title}" with a score of ${score}%.`,
    type: 'module_completed',
    category: 'learning',
    importance: 'success',
    icon: 'graduation-cap',
    color: '#10B981',
    relatedEntity: {
      type: 'module',
      id: module._id,
      data: {
        title: module.title,
        score,
        points: module.points
      }
    },
    actions: [{
      type: 'button',
      label: 'Continue Learning',
      action: '/modules',
      style: 'primary'
    }]
  });
};

// Static method to create friend request notification
notificationSchema.statics.createFriendRequestNotification = function(userId, fromUser) {
  return this.createNotification({
    userId,
    title: 'New Friend Request',
    message: `${fromUser.fullName} has sent you a friend request.`,
    type: 'friend_request',
    category: 'social',
    importance: 'info',
    icon: 'user-plus',
    sender: fromUser._id,
    senderName: fromUser.fullName,
    actionRequired: true,
    relatedEntity: {
      type: 'user',
      id: fromUser._id,
      data: {
        name: fromUser.fullName,
        avatar: fromUser.avatar
      }
    },
    actions: [
      {
        type: 'button',
        label: 'Accept',
        action: `/friends/accept/${fromUser._id}`,
        style: 'success'
      },
      {
        type: 'button',
        label: 'Decline',
        action: `/friends/decline/${fromUser._id}`,
        style: 'secondary'
      }
    ]
  });
};

// Static method to create deadline reminder notification
notificationSchema.statics.createDeadlineReminderNotification = function(userId, module, daysLeft) {
  const urgency = daysLeft <= 1 ? 'urgent' : daysLeft <= 3 ? 'high' : 'medium';
  const importance = daysLeft <= 1 ? 'error' : daysLeft <= 3 ? 'warning' : 'info';
  
  return this.createNotification({
    userId,
    title: 'Deadline Approaching',
    message: `You have ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left to complete "${module.title}".`,
    type: 'deadline_approaching',
    category: 'reminder',
    priority: urgency,
    importance,
    icon: 'clock',
    actionRequired: true,
    relatedEntity: {
      type: 'module',
      id: module._id,
      data: {
        title: module.title,
        daysLeft
      }
    },
    actions: [{
      type: 'button',
      label: 'Continue Module',
      action: `/modules/${module._id}`,
      style: 'primary'
    }]
  });
};

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

module.exports = Notification;