const Notification = require('../models/Notification');
const { 
  sendModuleAssignmentEmail, 
  sendAchievementEmail, 
  sendModuleReminderEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail 
} = require('./emailService');
const { caches } = require('../config/cache');

class NotificationService {
  constructor() {
    this.io = null;
  }

  // Initialize with Socket.IO instance
  init(io) {
    this.io = io;
  }

  // Send notification to specific user
  async sendToUser(userId, notification) {
    try {
      // Save to database
      const newNotification = new Notification({
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
        priority: notification.priority || 'medium'
      });

      await newNotification.save();

      // Send real-time notification via Socket.IO
      if (this.io) {
        this.io.to(`user-${userId}`).emit('notification', {
          id: newNotification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          priority: notification.priority,
          createdAt: newNotification.createdAt
        });
      }

      // Send email for high priority notifications
      if (notification.priority === 'high' && notification.sendEmail) {
        await this.sendEmailNotification(userId, notification);
      }

      return newNotification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Send notification to multiple users
  async sendToUsers(userIds, notification) {
    const promises = userIds.map(userId => this.sendToUser(userId, notification));
    return Promise.all(promises);
  }

  // Send notification to support team
  async sendToSupportTeam(notification) {
    try {
      const User = require('../models/User');
      const supportUsers = await User.find({ 
        role: { $in: ['admin', 'support'] },
        isActive: true 
      }).select('_id');

      const userIds = supportUsers.map(user => user._id);
      await this.sendToUsers(userIds, notification);

      // Also emit to support team room
      if (this.io) {
        this.io.to('support-team').emit('team-notification', {
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          priority: notification.priority,
          timestamp: new Date()
        });
      }

      return userIds.length;
    } catch (error) {
      console.error('Error sending notification to support team:', error);
      throw error;
    }
  }

  // Enhanced email notification with template support
  async sendEmailNotification(userId, notification) {
    try {
      const User = require('../models/User');
      
      // Check cache first
      let user = caches.users.get(`user:${userId}`);
      if (!user) {
        user = await User.findById(userId);
        if (user) {
          caches.users.set(`user:${userId}`, user);
        }
      }
      
      if (!user || !user.email) {
        console.warn(`No user or email found for userId: ${userId}`);
        return;
      }

      // Route to appropriate email template based on notification type
      switch (notification.type) {
        case 'module_assignment':
          if (notification.data?.module && notification.data?.assignment) {
            await sendModuleAssignmentEmail(
              user, 
              notification.data.module, 
              notification.data.assignment,
              notification.data.assignedBy
            );
          }
          break;
          
        case 'achievement_unlocked':
          if (notification.data?.achievement) {
            await sendAchievementEmail(user, notification.data.achievement);
          }
          break;
          
        case 'module_reminder':
          if (notification.data?.module && notification.data?.assignment) {
            await sendModuleReminderEmail(
              user, 
              notification.data.module, 
              notification.data.assignment,
              notification.data.options || {}
            );
          }
          break;
          
        case 'password_reset':
          if (notification.data?.resetToken) {
            await sendPasswordResetEmail(
              user.email, 
              user.firstName, 
              notification.data.resetToken
            );
          }
          break;
          
        case 'welcome':
          await sendWelcomeEmail(user.email, user.firstName);
          break;
          
        default:
          // Fall back to generic template for other notification types
          await this.sendGenericEmailNotification(user, notification);
          break;
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
      // Don't throw error to prevent notification system from failing
    }
  }

  // Generic email template for notifications without specific templates
  async sendGenericEmailNotification(user, notification) {
    const { sendEmailWithFallback } = require('./emailService');
    
    const mailOptions = {
      from: {
        name: 'BNC Training Platform',
        address: process.env.EMAIL_FROM || 'noreply@bnc-training.com'
      },
      to: user.email,
      subject: `[BNC Training] ${notification.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #E01A1A 0%, #B71C1C 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🏦 National Bank of Canada</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Training Platform Notification</p>
          </div>
          
          <div style="padding: 40px; background: #f8f9fa;">
            <div style="background: white; padding: 30px; border-radius: 12px; border-left: 4px solid ${notification.priority === 'high' ? '#DC2626' : '#E01A1A'};">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px;">${notification.title}</h2>
              <p style="margin: 0 0 20px 0; color: #4b5563; line-height: 1.6; font-size: 16px;">${notification.message}</p>
              
              ${notification.data?.actionUrl ? `
                <div style="margin-top: 30px; text-align: center;">
                  <a href="${notification.data.actionUrl}" 
                     style="background: linear-gradient(135deg, #E01A1A 0%, #B71C1C 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(224,26,26,0.3);">
                    View Details
                  </a>
                </div>
              ` : ''}
            </div>
          </div>
          
          <div style="padding: 25px; text-align: center; color: #6b7280; font-size: 14px; background: #f8f9fa; border-top: 1px solid #e9ecef;">
            <p style="margin: 0;">© 2024 National Bank of Canada. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">This is an automated notification from the BNC Training Platform.</p>
          </div>
        </div>
      `,
      text: `${notification.title}\n\n${notification.message}${notification.data?.actionUrl ? `\n\nView details: ${notification.data.actionUrl}` : ''}\n\n© 2024 National Bank of Canada`
    };

    await sendEmailWithFallback(mailOptions, 'generic-notification');
  }

  // Support-specific notifications
  async notifyNewTicket(ticket, user) {
    const notification = {
      type: 'support_ticket_created',
      title: `New ${ticket.priority.toUpperCase()} Priority Ticket`,
      message: `${user.firstName} ${user.lastName} created a new support ticket: ${ticket.subject}`,
      data: {
        ticketId: ticket.ticketId,
        priority: ticket.priority,
        category: ticket.category,
        actionUrl: `/support/tickets/${ticket.ticketId}`
      },
      priority: ['critical', 'high'].includes(ticket.priority) ? 'high' : 'medium',
      sendEmail: ['critical', 'high'].includes(ticket.priority)
    };

    return this.sendToSupportTeam(notification);
  }

  async notifyTicketUpdate(ticket, user, message) {
    const notification = {
      type: 'support_ticket_updated',
      title: 'Ticket Update',
      message: `Your support ticket has been updated: ${message}`,
      data: {
        ticketId: ticket.ticketId,
        actionUrl: `/support/tickets/${ticket.ticketId}`
      },
      priority: 'medium'
    };

    return this.sendToUser(ticket.userId, notification);
  }

  async notifyNewChatSession(chat, user) {
    const notification = {
      type: 'chat_session_started',
      title: `New ${chat.priority.toUpperCase()} Priority Chat`,
      message: `${user.firstName} ${user.lastName} started a new chat session`,
      data: {
        sessionId: chat.sessionId,
        priority: chat.priority,
        category: chat.category,
        actionUrl: `/support/chat/${chat.sessionId}`
      },
      priority: ['critical', 'high'].includes(chat.priority) ? 'high' : 'medium',
      sendEmail: ['critical', 'high'].includes(chat.priority)
    };

    return this.sendToSupportTeam(notification);
  }

  // eslint-disable-next-line no-unused-vars
  async notifyAgentAssigned(chat, agent, user) {
    const notification = {
      type: 'chat_agent_assigned',
      title: 'Support Agent Assigned',
      message: `${agent.firstName} ${agent.lastName} has been assigned to your chat session`,
      data: {
        sessionId: chat.sessionId,
        agentName: `${agent.firstName} ${agent.lastName}`,
        actionUrl: `/support/chat/${chat.sessionId}`
      },
      priority: 'medium'
    };

    return this.sendToUser(chat.userId, notification);
  }

  // Forum notifications
  async notifyNewForumPost(post, author) {
    if (post.priority === 'high' || post.priority === 'urgent') {
      const notification = {
        type: 'forum_high_priority_post',
        title: `High Priority Forum Post`,
        message: `${author.firstName} ${author.lastName} created a ${post.priority} priority post: ${post.title}`,
        data: {
          postId: post._id,
          category: post.category,
          priority: post.priority,
          actionUrl: `/forum/posts/${post._id}`
        },
        priority: 'high'
      };

      // Notify moderators
      const User = require('../models/User');
      const moderators = await User.find({ 
        role: { $in: ['admin', 'moderator'] },
        isActive: true 
      }).select('_id');

      const moderatorIds = moderators.map(mod => mod._id);
      return this.sendToUsers(moderatorIds, notification);
    }
  }

  async notifyMentionInComment(comment, mentionedUser, author, post) {
    const notification = {
      type: 'forum_mention',
      title: 'You were mentioned in a comment',
      message: `${author.firstName} ${author.lastName} mentioned you in a comment on "${post.title}"`,
      data: {
        postId: post._id,
        commentId: comment._id,
        authorName: `${author.firstName} ${author.lastName}`,
        actionUrl: `/forum/posts/${post._id}#comment-${comment._id}`
      },
      priority: 'medium'
    };

    return this.sendToUser(mentionedUser._id, notification);
  }

  async notifyCommentOnPost(comment, author, post) {
    // Notify post author if not commenting on own post
    if (post.author.toString() !== author._id.toString()) {
      const notification = {
        type: 'forum_comment',
        title: 'New comment on your post',
        message: `${author.firstName} ${author.lastName} commented on your post: "${post.title}"`,
        data: {
          postId: post._id,
          commentId: comment._id,
          authorName: `${author.firstName} ${author.lastName}`,
          actionUrl: `/forum/posts/${post._id}#comment-${comment._id}`
        },
        priority: 'low'
      };

      return this.sendToUser(post.author, notification);
    }
  }

  async notifySolutionMarked(comment, markedBy, post) {
    // Notify comment author
    if (comment.author.toString() !== markedBy._id.toString()) {
      const notification = {
        type: 'forum_solution_marked',
        title: 'Your comment was marked as solution',
        message: `${markedBy.firstName} ${markedBy.lastName} marked your comment as the solution for "${post.title}"`,
        data: {
          postId: post._id,
          commentId: comment._id,
          markedByName: `${markedBy.firstName} ${markedBy.lastName}`,
          actionUrl: `/forum/posts/${post._id}#comment-${comment._id}`
        },
        priority: 'medium'
      };

      return this.sendToUser(comment.author, notification);
    }
  }

  // Training-specific notification methods
  async notifyModuleAssignment(user, module, assignment, assignedBy) {
    const notification = {
      type: 'module_assignment',
      title: `New Training Assignment: ${module.title}`,
      message: `You have been assigned a new training module by ${assignedBy?.firstName || 'System'}. Due: ${assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}`,
      data: {
        module,
        assignment,
        assignedBy,
        moduleId: module._id,
        actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/modules/${module._id}`
      },
      priority: assignment.priority || 'medium',
      sendEmail: true
    };

    return this.sendToUser(user._id, notification);
  }

  async notifyAchievementUnlocked(user, achievement) {
    const notification = {
      type: 'achievement_unlocked',
      title: `Achievement Unlocked: ${achievement.title}!`,
      message: `Congratulations! You've unlocked the "${achievement.title}" achievement and earned ${achievement.points || 0} XP.`,
      data: {
        achievement,
        achievementId: achievement._id,
        actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`
      },
      priority: 'medium',
      sendEmail: true
    };

    return this.sendToUser(user._id, notification);
  }

  async notifyModuleReminder(user, module, assignment, options = {}) {
    const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
    const isOverdue = dueDate && dueDate < new Date();
    
    const notification = {
      type: 'module_reminder',
      title: isOverdue ? `Overdue Training: ${module.title}` : `Training Reminder: ${module.title}`,
      message: isOverdue ? 
        `Your training module "${module.title}" is now overdue. Please complete it as soon as possible.` :
        `Your training module "${module.title}" is due ${dueDate ? dueDate.toLocaleDateString() : 'soon'}. Please complete it on time.`,
      data: {
        module,
        assignment,
        options,
        moduleId: module._id,
        isOverdue,
        actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/modules/${module._id}`
      },
      priority: isOverdue ? 'high' : 'medium',
      sendEmail: true
    };

    return this.sendToUser(user._id, notification);
  }

  async notifyModuleCompleted(user, module) {
    const notification = {
      type: 'module_completed',
      title: `Module Completed: ${module.title}`,
      message: `Congratulations! You have successfully completed the training module "${module.title}" and earned ${module.points || 0} XP.`,
      data: {
        module,
        moduleId: module._id,
        actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`
      },
      priority: 'low',
      sendEmail: false
    };

    return this.sendToUser(user._id, notification);
  }

  async notifyLevelUp(user, newLevel, oldLevel) {
    const notification = {
      type: 'level_up',
      title: `Level Up! You've reached Level ${newLevel}`,
      message: `Amazing progress! You've advanced from Level ${oldLevel} to Level ${newLevel}. Keep up the excellent work!`,
      data: {
        newLevel,
        oldLevel,
        actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile`
      },
      priority: 'medium',
      sendEmail: false
    };

    return this.sendToUser(user._id, notification);
  }

  async notifyTeamInvitation(user, team, invitedBy) {
    const notification = {
      type: 'team_invitation',
      title: `Team Invitation: ${team.name}`,
      message: `${invitedBy.firstName} ${invitedBy.lastName} has invited you to join the team "${team.name}".`,
      data: {
        team,
        invitedBy,
        teamId: team._id,
        actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/teams/${team._id}`
      },
      priority: 'medium',
      sendEmail: false
    };

    return this.sendToUser(user._id, notification);
  }

  // Batch notification processing with queue
  async processNotificationQueue(notifications) {
    const emailQueue = [];
    const pushQueue = [];

    for (const notif of notifications) {
      if (notif.sendEmail) {
        emailQueue.push(notif);
      } else {
        pushQueue.push(notif);
      }
    }

    // Process push notifications immediately
    const pushPromises = pushQueue.map(notif => 
      this.sendToUser(notif.userId, notif).catch(err => 
        console.error(`Failed to send push notification to ${notif.userId}:`, err)
      )
    );

    // Process email notifications with delay to avoid overwhelming email provider
    const emailPromises = [];
    for (let i = 0; i < emailQueue.length; i++) {
      const notif = emailQueue[i];
      emailPromises.push(
        new Promise(resolve => {
          setTimeout(async () => {
            try {
              await this.sendToUser(notif.userId, notif);
              resolve();
            } catch (err) {
              console.error(`Failed to send email notification to ${notif.userId}:`, err);
              resolve();
            }
          }, i * 1000); // 1 second delay between emails
        })
      );
    }

    await Promise.all([...pushPromises, ...emailPromises]);
    return { processed: notifications.length, emails: emailQueue.length, pushes: pushQueue.length };
  }

  // General notification methods
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      if (this.io) {
        this.io.to(`user-${userId}`).emit('notification-read', { notificationId });
      }

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      if (this.io) {
        this.io.to(`user-${userId}`).emit('all-notifications-read');
      }

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async getUnreadCount(userId) {
    try {
      // Check cache first
      const cacheKey = `unread:${userId}`;
      let count = caches.dashboard.get(cacheKey);
      
      if (count === undefined) {
        count = await Notification.countDocuments({ userId, isRead: false });
        caches.dashboard.set(cacheKey, count, 60); // Cache for 1 minute
      }
      
      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Clear caches when notifications are updated
  async invalidateUserCache(userId) {
    caches.dashboard.del(`unread:${userId}`);
    caches.users.del(`user:${userId}`);
  }

  // Get recent notifications with caching
  async getRecentNotifications(userId, limit = 10) {
    try {
      const cacheKey = `recent:${userId}:${limit}`;
      let notifications = caches.dashboard.get(cacheKey);
      
      if (!notifications) {
        notifications = await Notification.find({ userId })
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();
        
        caches.dashboard.set(cacheKey, notifications, 120); // Cache for 2 minutes
      }
      
      return notifications;
    } catch (error) {
      console.error('Error getting recent notifications:', error);
      return [];
    }
  }

  // Analytics and monitoring
  async getNotificationStats(timeRange = '24h') {
    try {
      const cacheKey = `stats:${timeRange}`;
      let stats = caches.dashboard.get(cacheKey);
      
      if (!stats) {
        const startTime = new Date();
        switch (timeRange) {
          case '1h':
            startTime.setHours(startTime.getHours() - 1);
            break;
          case '24h':
            startTime.setDate(startTime.getDate() - 1);
            break;
          case '7d':
            startTime.setDate(startTime.getDate() - 7);
            break;
          default:
            startTime.setDate(startTime.getDate() - 1);
        }

        const [total, byType, byPriority] = await Promise.all([
          Notification.countDocuments({ createdAt: { $gte: startTime } }),
          Notification.aggregate([
            { $match: { createdAt: { $gte: startTime } } },
            { $group: { _id: '$type', count: { $sum: 1 } } }
          ]),
          Notification.aggregate([
            { $match: { createdAt: { $gte: startTime } } },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ])
        ]);

        stats = {
          total,
          byType: byType.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
          byPriority: byPriority.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
          timeRange,
          generatedAt: new Date()
        };
        
        caches.dashboard.set(cacheKey, stats, 300); // Cache for 5 minutes
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return { total: 0, byType: {}, byPriority: {}, timeRange, generatedAt: new Date() };
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

module.exports = notificationService;