const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { logUserAction } = require('../utils/auditLogger');
const router = express.Router();

// @route   GET /api/activity
// @desc    Get user activity timeline
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { 
      timeframe = 'week', 
      activityTypes, 
      limit = 50, 
      page = 1 
    } = req.query;

    // Calculate date range based on timeframe
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    // Build query filters
    const query = {
      userId: req.user._id,
      timestamp: { $gte: startDate }
    };

    // Filter by activity types if provided
    if (activityTypes) {
      const types = Array.isArray(activityTypes) 
        ? activityTypes 
        : activityTypes.split(',');
      query.action = { $in: types };
    }

    // Get activity logs with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const activities = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalCount = await AuditLog.countDocuments(query);

    // Enhance activities with additional context
    const enhancedActivities = activities.map(activity => ({
      ...activity,
      riskScore: calculateRiskScore(activity),
      location: activity.metadata?.location || { country: 'Canada', city: 'Unknown' },
      deviceInfo: activity.metadata?.deviceInfo || { browser: 'Unknown', os: 'Unknown' }
    }));

    res.json({
      success: true,
      data: {
        activities: enhancedActivities,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasMore: totalCount > skip + activities.length
        }
      }
    });

  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving activity'
    });
  }
});

// @route   GET /api/activity/analytics
// @desc    Get user analytics data
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    const { timeframe = 'month' } = req.query;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate analytics based on timeframe
    const analytics = await generateUserAnalytics(user._id, timeframe);

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving analytics'
    });
  }
});

// @route   GET /api/activity/export
// @desc    Export user activity data
// @access  Private
router.get('/export', protect, async (req, res) => {
  try {
    const { timeframe = 'month', format = 'json' } = req.query;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has export permissions
    if (!user.preferences?.analytics?.exportEnabled) {
      return res.status(403).json({
        success: false,
        message: 'Export functionality is disabled in your preferences'
      });
    }

    // Generate export data
    const exportData = await generateActivityExport(user._id, timeframe);

    // Log the export action
    await logUserAction(
      user._id,
      'ACTIVITY_EXPORTED',
      req.ip,
      req.get('User-Agent'),
      { timeframe, format, recordCount: exportData.activities.length }
    );

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=activity-export-${user.firstName}-${user.lastName}-${new Date().toISOString().split('T')[0]}.csv`);
      
      // Convert to CSV format
      const csv = convertToCSV(exportData.activities);
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=activity-export-${user.firstName}-${user.lastName}-${new Date().toISOString().split('T')[0]}.json`);
      res.json(exportData);
    }

  } catch (error) {
    console.error('Export activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error exporting activity'
    });
  }
});

// Helper function to calculate risk score
function calculateRiskScore(activity) {
  let score = 0;
  
  // Base score by action type
  const riskScores = {
    'LOGIN': 1,
    'PASSWORD_CHANGED': 5,
    'PREFERENCES_UPDATED': 2,
    'SESSION_TERMINATED': 3,
    'FAILED_LOGIN': 8,
    'ACCOUNT_LOCKED': 10,
    '2FA_ENABLED': 3,
    '2FA_DISABLED': 7
  };

  score += riskScores[activity.action] || 1;

  // Increase score for unusual locations or times
  if (activity.metadata?.suspicious) {
    score += 5;
  }

  // Increase score for multiple rapid actions
  if (activity.metadata?.rapidActions) {
    score += 3;
  }

  return Math.min(score, 10); // Cap at 10
}

// Helper function to generate user analytics
async function generateUserAnalytics(userId, timeframe) {
  const now = new Date();
  let startDate;
  
  switch (timeframe) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'quarter':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
  }

  // Get activity statistics
  const activityStats = await AuditLog.aggregate([
    {
      $match: {
        userId: userId,
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        lastOccurrence: { $max: '$timestamp' }
      }
    }
  ]);

  // Generate mock learning analytics (since we don't have a modules system yet)
  const learningProgress = {
    totalHours: Math.floor(Math.random() * 40) + 10,
    modulesCompleted: Math.floor(Math.random() * 15) + 5,
    averageScore: Math.floor(Math.random() * 20) + 75,
    streak: Math.floor(Math.random() * 30) + 1,
    skillDevelopment: [
      { skill: 'Customer Service', progress: Math.floor(Math.random() * 30) + 70 },
      { skill: 'Risk Assessment', progress: Math.floor(Math.random() * 25) + 60 },
      { skill: 'Compliance', progress: Math.floor(Math.random() * 35) + 65 },
      { skill: 'Technology', progress: Math.floor(Math.random() * 40) + 50 }
    ]
  };

  // Generate peer comparison (mock data)
  const peerComparison = {
    departmentRank: Math.floor(Math.random() * 50) + 1,
    totalInDepartment: Math.floor(Math.random() * 20) + 60,
    scoreVsAverage: Math.floor(Math.random() * 20) - 10, // -10 to +10
    improvementRate: Math.floor(Math.random() * 40) + 60
  };

  return {
    timeframe,
    period: {
      start: startDate,
      end: new Date()
    },
    activitySummary: {
      totalActions: activityStats.reduce((sum, stat) => sum + stat.count, 0),
      actionBreakdown: activityStats,
      mostActiveDay: generateMostActiveDay(),
      securityEvents: activityStats.filter(stat => 
        ['FAILED_LOGIN', 'PASSWORD_CHANGED', '2FA_ENABLED'].includes(stat._id)
      ).reduce((sum, stat) => sum + stat.count, 0)
    },
    learningProgress,
    peerComparison,
    predictiveInsights: {
      likelyCompletionDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      recommendedModules: ['Advanced Risk Management', 'Digital Banking Trends'],
      confidenceScore: Math.floor(Math.random() * 20) + 75
    },
    careerAnalytics: {
      promotionReadiness: Math.floor(Math.random() * 30) + 70,
      skillGaps: ['Leadership', 'Data Analytics'],
      trainingROI: Math.floor(Math.random() * 15) + 15, // 15-30% ROI
      marketValue: Math.floor(Math.random() * 20000) + 80000
    }
  };
}

// Helper function to generate activity export
async function generateActivityExport(userId, timeframe) {
  const now = new Date();
  let startDate;
  
  switch (timeframe) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'quarter':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
  }

  const activities = await AuditLog.find({
    userId: userId,
    timestamp: { $gte: startDate }
  }).sort({ timestamp: -1 }).lean();

  return {
    exportInfo: {
      userId,
      exportDate: new Date(),
      timeframe,
      period: { start: startDate, end: new Date() },
      totalRecords: activities.length
    },
    activities: activities.map(activity => ({
      timestamp: activity.timestamp,
      action: activity.action,
      ipAddress: activity.ipAddress,
      userAgent: activity.userAgent,
      metadata: activity.metadata,
      riskScore: calculateRiskScore(activity)
    }))
  };
}

// Helper function to convert data to CSV
function convertToCSV(activities) {
  const headers = ['Timestamp', 'Action', 'IP Address', 'User Agent', 'Risk Score', 'Location', 'Device'];
  const rows = activities.map(activity => [
    activity.timestamp,
    activity.action,
    activity.ipAddress,
    activity.userAgent,
    activity.riskScore,
    activity.metadata?.location ? JSON.stringify(activity.metadata.location) : '',
    activity.metadata?.deviceInfo ? JSON.stringify(activity.metadata.deviceInfo) : ''
  ]);

  return [headers, ...rows].map(row => 
    row.map(field => `"${field}"`).join(',')
  ).join('\n');
}

// Helper function to generate most active day
function generateMostActiveDay() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[Math.floor(Math.random() * days.length)];
}

// @route   GET /api/activity/feed
// @desc    Get activity feed based on type and filters
// @access  Private
router.get('/feed', protect, async (req, res) => {
  try {
    const {
      filter = 'all',
      timeRange = 'week',
      limit = 50,
      userId,
      since
    } = req.query;

    // Generate mock activities based on type and filters
    const activities = generateMockActivities({
      filter,
      timeRange,
      limit: parseInt(limit),
      userId: userId || req.user._id,
      currentUser: req.user,
      since
    });

    res.json({
      success: true,
      activities,
      hasMore: activities.length >= parseInt(limit),
      total: activities.length
    });
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/activity/:activityId/reaction
// @desc    Add reaction to an activity
// @access  Private
router.post('/:activityId/reaction', protect, async (req, res) => {
  try {
    const { emoji } = req.body;
    
    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: 'Emoji is required'
      });
    }

    res.json({
      success: true,
      message: 'Reaction added successfully'
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/activity/:activityId/read
// @desc    Mark activity as read
// @access  Private
router.post('/:activityId/read', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Activity marked as read'
    });
  } catch (error) {
    console.error('Error marking activity as read:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to generate mock activities
function generateMockActivities({
  filter,
  timeRange,
  limit,
  userId,
  currentUser,
  since
}) {
  const now = new Date();
  const activities = [];

  // Calculate time filter
  let startDate = null;
  switch (timeRange) {
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
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  if (since) {
    startDate = new Date(since);
  }

  // Mock users
  const mockUsers = [
    {
      id: userId,
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      avatar: currentUser.avatar || '/avatars/default.jpg',
      department: currentUser.department
    },
    {
      id: 'user2',
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      department: 'Customer Service'
    },
    {
      id: 'user3',
      name: 'Mike Chen',
      avatar: '/avatars/mike.jpg',
      department: 'IT'
    },
    {
      id: 'user4',
      name: 'Emily Davis',
      avatar: '/avatars/emily.jpg',
      department: 'Marketing'
    }
  ];

  // Activity templates
  const activityTemplates = [
    {
      type: 'achievement',
      title: 'Achievement Unlocked: Speed Learner',
      description: '{user} earned the Speed Learner achievement for completing 10 modules in a week!',
      metadata: { achievementName: 'Speed Learner', points: 500, xpGained: 1000 },
      priority: 'high'
    },
    {
      type: 'module_completion',
      title: 'Module Completed: Customer Service Excellence',
      description: '{user} completed "Customer Service Excellence" and earned 250 XP!',
      metadata: { moduleId: 'mod_1', moduleName: 'Customer Service Excellence', points: 250, completionRate: 95 },
      priority: 'medium'
    },
    {
      type: 'team_join',
      title: 'New Team Member',
      description: '{user} joined the Innovation Squad team. Welcome aboard!',
      metadata: { teamId: 'team_1', teamName: 'Innovation Squad' },
      priority: 'medium'
    },
    {
      type: 'ranking',
      title: 'Leaderboard Update',
      description: '{user} climbed from #15 to #8 on the monthly leaderboard!',
      metadata: { oldRank: 15, newRank: 8, points: 150 },
      priority: 'high'
    },
    {
      type: 'challenge',
      title: 'Challenge Completed',
      description: '{user} completed the "30-Day Learning Sprint" challenge with flying colors!',
      metadata: { challengeId: 'ch_1', challengeName: '30-Day Learning Sprint', points: 750, completionRate: 100 },
      priority: 'high'
    },
    {
      type: 'collaboration',
      title: 'Collaboration Success',
      description: '{user} and 3 team members completed a group project together!',
      metadata: { collaborators: ['Sarah J.', 'Mike C.', 'Emily D.'], points: 400, category: 'Teamwork' },
      priority: 'medium'
    },
    {
      type: 'milestone',
      title: 'Learning Milestone',
      description: '{user} completed 50 modules and earned the Dedicated Learner milestone!',
      metadata: { milestoneType: 'Module Completion', points: 1500, level: 12 },
      priority: 'high'
    },
    {
      type: 'system',
      title: 'Platform Update',
      description: 'New features added: Enhanced team collaboration tools and improved mobile experience!',
      metadata: { category: 'Platform Updates' },
      priority: 'low'
    }
  ];

  // Generate activities
  for (let i = 0; i < limit; i++) {
    const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
    
    // Skip if filter doesn't match
    if (filter !== 'all' && filter !== template.type) {
      continue;
    }

    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    
    // Generate timestamp within range
    const maxAge = now.getTime() - startDate.getTime();
    const timestamp = new Date(now.getTime() - Math.random() * maxAge);

    // Replace user placeholder
    const title = template.title.replace('{user}', user.name);
    const description = template.description.replace('{user}', user.name);

    // Generate reactions
    const reactions = [];
    if (Math.random() > 0.7) {
      const emojis = ['👍', '🎉', '💪', '🔥', '⭐'];
      const numReactions = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < numReactions; j++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        reactions.push({
          emoji,
          count: Math.floor(Math.random() * 5) + 1,
          users: [`user${Math.floor(Math.random() * 5) + 1}`]
        });
      }
    }

    activities.push({
      id: `activity_${i}_${Date.now()}`,
      type: template.type,
      title,
      description,
      timestamp: timestamp.toISOString(),
      user,
      metadata: template.metadata,
      priority: template.priority,
      isRead: Math.random() > 0.3,
      reactions,
      canInteract: true
    });
  }

  // Sort by timestamp (newest first)
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return activities.slice(0, limit);
}

module.exports = router;