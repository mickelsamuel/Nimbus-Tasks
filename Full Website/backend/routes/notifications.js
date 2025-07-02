const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { logUserAction } = require('../utils/auditLogger');
const notificationService = require('../utils/notificationService');
const { getEmailQueueStatus } = require('../utils/emailService');
const { caches } = require('../config/cache');
const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications with pagination and filtering
// @access  Private
router.get('/', protect, [
  query('category').optional().isIn(['learning', 'social', 'system', 'achievement', 'reminder', 'security']),
  query('status').optional().isIn(['unread', 'read', 'dismissed', 'acted_upon']),
  query('isRead').optional().isBoolean(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('skip').optional().isInt({ min: 0 }).toInt(),
  query('sortBy').optional().isIn(['createdAt', 'priority', 'importance']),
  query('sortOrder').optional().isIn(['1', '-1'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      category,
      status,
      isRead,
      limit = 20,
      skip = 0,
      sortBy = 'createdAt',
      sortOrder = -1
    } = req.query;

    const options = {
      category,
      status,
      isRead: isRead !== undefined ? JSON.parse(isRead) : undefined,
      limit: parseInt(limit),
      skip: parseInt(skip),
      sortBy,
      sortOrder: parseInt(sortOrder)
    };

    const notifications = await Notification.getUserNotifications(req.user._id, options);
    const unreadCount = await notificationService.getUnreadCount(req.user._id);
    const totalCount = await Notification.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          currentPage: Math.floor(skip / limit) + 1,
          totalItems: totalCount,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalCount / limit)
        },
        unreadCount
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving notifications'
    });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', protect, [
  query('category').optional().isIn(['learning', 'social', 'system', 'achievement', 'reminder', 'security'])
], async (req, res) => {
  try {
    const { category } = req.query;
    const unreadCount = await notificationService.getUnreadCount(req.user._id);
    
    res.json({
      success: true,
      unreadCount
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving unread count'
    });
  }
});

// @route   POST /api/notifications
// @desc    Create a new notification (admin only or system)
// @access  Private (Admin)
router.post('/', protect, [
  body('userId').optional().isMongoId(),
  body('userIds').optional().isArray(),
  body('title').isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('message').isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  body('type').isIn([
    'module_completed', 'achievement_unlocked', 'friend_request', 'team_invitation',
    'event_reminder', 'message_received', 'system_update', 'deadline_approaching',
    'badge_earned', 'level_up', 'competition_result', 'course_enrolled',
    'course_deadline', 'team_activity', 'admin_announcement', 'password_reset',
    'email_verification', 'security_alert', 'welcome', 'congratulations',
    'reminder', 'warning', 'error'
  ]),
  body('category').optional().isIn(['learning', 'social', 'system', 'achievement', 'reminder', 'security']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('importance').optional().isIn(['info', 'success', 'warning', 'error']),
  body('channels.inApp').optional().isBoolean(),
  body('channels.email').optional().isBoolean(),
  body('channels.push').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Check if user has permission to create notifications
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to create notifications'
      });
    }

    const notificationData = req.body;
    
    // Handle bulk notifications
    if (notificationData.userIds && Array.isArray(notificationData.userIds)) {
      const notifications = await Promise.all(
        notificationData.userIds.map(userId => 
          Notification.createNotification({
            ...notificationData,
            userId,
            sender: req.user._id
          })
        )
      );

      await logUserAction(
        req.user._id,
        'BULK_NOTIFICATION_CREATED',
        req.ip,
        req.get('User-Agent'),
        {
          notificationCount: notifications.length,
          type: notificationData.type,
          category: notificationData.category
        }
      );

      res.status(201).json({
        success: true,
        message: `Created ${notifications.length} notifications`,
        data: { notificationCount: notifications.length }
      });
    } else {
      // Single notification
      const notification = await Notification.createNotification({
        ...notificationData,
        sender: req.user._id
      });

      await logUserAction(
        req.user._id,
        'NOTIFICATION_CREATED',
        req.ip,
        req.get('User-Agent'),
        {
          notificationId: notification._id,
          type: notification.type,
          recipient: notification.userId
        }
      );

      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notification
      });
    }

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating notification'
    });
  }
});

// @route   PATCH /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();
    
    // Invalidate cache
    await notificationService.invalidateUserCache(req.user._id);

    await logUserAction(
      req.user._id,
      'NOTIFICATION_READ',
      req.ip,
      req.get('User-Agent'),
      { notificationId: notification._id }
    );

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking notification as read'
    });
  }
});

// @route   PATCH /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.patch('/mark-all-read', protect, [
  body('category').optional().isIn(['learning', 'social', 'system', 'achievement', 'reminder', 'security'])
], async (req, res) => {
  try {
    const { category } = req.body;
    
    const result = await Notification.markAllAsRead(req.user._id, category);
    
    // Invalidate cache
    await notificationService.invalidateUserCache(req.user._id);

    await logUserAction(
      req.user._id,
      'ALL_NOTIFICATIONS_READ',
      req.ip,
      req.get('User-Agent'),
      {
        category,
        modifiedCount: result.modifiedCount
      }
    );

    res.json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      data: { modifiedCount: result.modifiedCount }
    });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking notifications as read'
    });
  }
});

// @route   PATCH /api/notifications/:id/action
// @desc    Mark notification as acted upon
// @access  Private
router.patch('/:id/action', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markActedUpon();

    await logUserAction(
      req.user._id,
      'NOTIFICATION_ACTED_UPON',
      req.ip,
      req.get('User-Agent'),
      { notificationId: notification._id }
    );

    res.json({
      success: true,
      message: 'Notification marked as acted upon',
      data: notification
    });

  } catch (error) {
    console.error('Mark notification as acted upon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking notification as acted upon'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Dismiss/delete notification
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.dismiss();
    
    // Invalidate cache
    await notificationService.invalidateUserCache(req.user._id);

    await logUserAction(
      req.user._id,
      'NOTIFICATION_DISMISSED',
      req.ip,
      req.get('User-Agent'),
      { notificationId: notification._id }
    );

    res.json({
      success: true,
      message: 'Notification dismissed successfully'
    });

  } catch (error) {
    console.error('Dismiss notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error dismissing notification'
    });
  }
});

// @route   POST /api/notifications/achievement
// @desc    Create achievement notification
// @access  Private (System)
router.post('/achievement', protect, [
  body('userId').isMongoId(),
  body('achievement.name').isLength({ min: 1 }),
  body('achievement.tier').optional().isIn(['bronze', 'silver', 'gold', 'platinum']),
  body('achievement.rewards.points').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { userId, achievement } = req.body;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const notification = await Notification.createAchievementNotification(userId, achievement);

    res.status(201).json({
      success: true,
      message: 'Achievement notification created',
      data: notification
    });

  } catch (error) {
    console.error('Create achievement notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating achievement notification'
    });
  }
});

// @route   POST /api/notifications/module-completion
// @desc    Create module completion notification
// @access  Private (System)
router.post('/module-completion', protect, [
  body('userId').isMongoId(),
  body('module.title').isLength({ min: 1 }),
  body('score').isInt({ min: 0, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { userId, module, score } = req.body;

    const notification = await Notification.createModuleCompletionNotification(userId, module, score);

    res.status(201).json({
      success: true,
      message: 'Module completion notification created',
      data: notification
    });

  } catch (error) {
    console.error('Create module completion notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating module completion notification'
    });
  }
});

// @route   POST /api/notifications/friend-request
// @desc    Create friend request notification
// @access  Private
router.post('/friend-request', protect, [
  body('userId').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { userId } = req.body;

    // Verify target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const notification = await Notification.createFriendRequestNotification(userId, req.user);

    res.status(201).json({
      success: true,
      message: 'Friend request notification created',
      data: notification
    });

  } catch (error) {
    console.error('Create friend request notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating friend request notification'
    });
  }
});

// @route   POST /api/notifications/deadline-reminder
// @desc    Create deadline reminder notification
// @access  Private (System)
router.post('/deadline-reminder', protect, [
  body('userId').isMongoId(),
  body('module.title').isLength({ min: 1 }),
  body('daysLeft').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { userId, module, daysLeft } = req.body;

    const notification = await Notification.createDeadlineReminderNotification(userId, module, daysLeft);

    res.status(201).json({
      success: true,
      message: 'Deadline reminder notification created',
      data: notification
    });

  } catch (error) {
    console.error('Create deadline reminder notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating deadline reminder notification'
    });
  }
});

// @route   GET /api/notifications/stats
// @desc    Get notification statistics
// @access  Private
router.get('/stats', protect, [
  query('timeframe').optional().isIn(['day', 'week', 'month'])
], async (req, res) => {
  try {
    const { timeframe = 'week' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
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
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const stats = await Notification.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
          },
          read: {
            $sum: { $cond: [{ $eq: ['$isRead', true] }, 1, 0] }
          },
          byCategory: {
            $push: {
              category: '$category',
              count: 1
            }
          },
          byType: {
            $push: {
              type: '$type',
              count: 1
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      unread: 0,
      read: 0,
      byCategory: [],
      byType: []
    };

    // Process category and type groupings
    const categoryMap = {};
    const typeMap = {};

    result.byCategory.forEach(item => {
      categoryMap[item.category] = (categoryMap[item.category] || 0) + 1;
    });

    result.byType.forEach(item => {
      typeMap[item.type] = (typeMap[item.type] || 0) + 1;
    });

    result.byCategory = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count
    }));

    result.byType = Object.entries(typeMap).map(([type, count]) => ({
      type,
      count
    }));

    res.json({
      success: true,
      data: {
        timeframe,
        startDate,
        endDate: now,
        stats: result
      }
    });

  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving notification statistics'
    });
  }
});

// Enhanced email and notification management endpoints

// @route   GET /api/notifications/email-queue
// @desc    Get email queue status (admin only)
// @access  Private (Admin)
router.get('/email-queue', protect, async (req, res) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const emailStatus = getEmailQueueStatus();
    const notificationStats = await notificationService.getNotificationStats('24h');

    res.json({
      success: true,
      data: {
        emailQueue: emailStatus,
        notifications: notificationStats,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching email queue status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving email queue status'
    });
  }
});

// @route   POST /api/notifications/test-email
// @desc    Send test notification with email (admin only)
// @access  Private (Admin)
router.post('/test-email', protect, [
  body('userId').isMongoId(),
  body('type').isIn(['module_assignment', 'achievement_unlocked', 'module_reminder', 'welcome']),
  body('priority').optional().isIn(['low', 'medium', 'high'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Check admin permissions
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const { userId, type, priority = 'medium' } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create test data based on type
    let result;
    switch (type) {
      case 'module_assignment':
        const testModule = {
          _id: '507f1f77bcf86cd799439011',
          title: 'Test Training Module',
          description: 'This is a test module for notification testing',
          category: 'compliance',
          difficulty: 'beginner',
          totalDuration: 45,
          points: 100,
          learningObjectives: ['Test objective 1', 'Test objective 2']
        };
        const testAssignment = {
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority,
          notes: 'This is a test assignment'
        };
        result = await notificationService.notifyModuleAssignment(user, testModule, testAssignment, req.user);
        break;
        
      case 'achievement_unlocked':
        const testAchievement = {
          _id: '507f1f77bcf86cd799439012',
          title: 'Test Achievement',
          description: 'You completed a test notification',
          icon: '🏆',
          rarity: 'Common',
          points: 50
        };
        result = await notificationService.notifyAchievementUnlocked(user, testAchievement);
        break;
        
      case 'module_reminder':
        const reminderModule = {
          _id: '507f1f77bcf86cd799439013',
          title: 'Overdue Test Module',
          category: 'security',
          difficulty: 'intermediate'
        };
        const reminderAssignment = {
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        };
        result = await notificationService.notifyModuleReminder(user, reminderModule, reminderAssignment, {
          currentProgress: 25,
          chaptersCompleted: 2,
          timeSpent: '30 min'
        });
        break;
        
      case 'welcome':
        const welcomeNotification = {
          type: 'welcome',
          title: 'Welcome to BNC Training Platform!',
          message: 'Thank you for joining our training platform. Start your learning journey today!',
          priority: 'medium',
          sendEmail: true
        };
        result = await notificationService.sendToUser(user._id, welcomeNotification);
        break;
    }

    await logUserAction(
      req.user._id,
      'TEST_EMAIL_SENT',
      req.ip,
      req.get('User-Agent'),
      { 
        recipientId: userId,
        emailType: type,
        priority 
      }
    );

    res.json({
      success: true,
      message: `Test ${type} notification sent to ${user.email}`,
      data: { notificationId: result?._id || result }
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      message: 'Server error sending test email'
    });
  }
});

// @route   POST /api/notifications/broadcast
// @desc    Broadcast notification to multiple users (admin only)
// @access  Private (Admin)
router.post('/broadcast', protect, [
  body('notification.title').isLength({ min: 1, max: 200 }),
  body('notification.message').isLength({ min: 1, max: 1000 }),
  body('notification.type').isIn([
    'system_announcement', 'maintenance', 'update', 'policy_change',
    'training_reminder', 'event_announcement', 'security_alert'
  ]),
  body('targetRole').optional().isIn(['employee', 'manager', 'admin', 'training_coordinator']),
  body('targetDepartment').optional().isString(),
  body('sendEmail').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Check admin permissions
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const { notification, targetRole, targetDepartment, sendEmail = false } = req.body;
    
    // Build user query
    let userQuery = { isActive: true };
    if (targetRole) userQuery.role = targetRole;
    if (targetDepartment) userQuery.department = targetDepartment;

    const users = await User.find(userQuery).select('_id email firstName lastName');
    
    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No users match the target criteria'
      });
    }

    // Create broadcast notification
    const broadcastNotification = {
      ...notification,
      type: 'system_broadcast',
      priority: notification.priority || 'medium',
      sendEmail,
      data: {
        ...notification.data,
        broadcast: true,
        targetRole,
        targetDepartment,
        sentBy: req.user._id,
        sentAt: new Date()
      }
    };

    // Send to all users with queue processing
    const notifications = users.map(user => ({
      userId: user._id,
      ...broadcastNotification
    }));

    const results = await notificationService.processNotificationQueue(notifications);

    await logUserAction(
      req.user._id,
      'BROADCAST_NOTIFICATION_SENT',
      req.ip,
      req.get('User-Agent'),
      {
        targetUsers: users.length,
        targetRole,
        targetDepartment,
        notificationType: notification.type,
        sendEmail
      }
    );

    res.json({
      success: true,
      message: `Broadcast sent to ${users.length} users`,
      data: {
        targetUsers: users.length,
        processed: results.processed,
        emails: results.emails,
        pushes: results.pushes
      }
    });

  } catch (error) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error broadcasting notification'
    });
  }
});

// @route   POST /api/notifications/preferences
// @desc    Update notification preferences
// @access  Private
router.post('/preferences', protect, [
  body('preferences.email').optional().isObject(),
  body('preferences.push').optional().isObject(),
  body('preferences.frequency').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { preferences } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      notificationPreferences: preferences
    });

    // Invalidate user cache
    caches.users.del(`user:${req.user._id}`);

    await logUserAction(
      req.user._id,
      'NOTIFICATION_PREFERENCES_UPDATED',
      req.ip,
      req.get('User-Agent'),
      { preferences }
    );

    res.json({
      success: true,
      message: 'Notification preferences updated'
    });

  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating preferences'
    });
  }
});

// @route   GET /api/notifications/preferences
// @desc    Get notification preferences
// @access  Private
router.get('/preferences', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notificationPreferences');
    
    const defaultPreferences = {
      email: {
        moduleAssignments: true,
        achievements: true,
        reminders: true,
        teamInvitations: true,
        systemUpdates: false
      },
      push: {
        moduleAssignments: true,
        achievements: true,
        reminders: true,
        teamInvitations: true,
        systemUpdates: true
      },
      frequency: {
        immediate: ['achievements', 'teamInvitations'],
        daily: ['reminders'],
        weekly: ['systemUpdates']
      }
    };

    const preferences = user?.notificationPreferences || defaultPreferences;
    
    res.json({
      success: true,
      data: { preferences }
    });

  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching preferences'
    });
  }
});

// @route   POST /api/notifications/clear-cache
// @desc    Clear notification cache (admin only)
// @access  Private (Admin)
router.post('/clear-cache', protect, async (req, res) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const { userId } = req.body;
    
    if (userId) {
      await notificationService.invalidateUserCache(userId);
      res.json({
        success: true,
        message: `Cache cleared for user ${userId}`
      });
    } else {
      // Clear all notification caches
      caches.dashboard.flushAll();
      caches.users.flushAll();
      
      res.json({
        success: true,
        message: 'All notification caches cleared'
      });
    }

    await logUserAction(
      req.user._id,
      'NOTIFICATION_CACHE_CLEARED',
      req.ip,
      req.get('User-Agent'),
      { targetUser: userId || 'all' }
    );

  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      success: false,
      message: 'Server error clearing cache'
    });
  }
});

module.exports = router;
