const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users (admin/manager only)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Check if user has permission to view all users
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or manager role required.'
      });
    }

    const users = await User.find({ isActive: true })
      .select('firstName lastName department role avatar stats _id')
      .sort({ 'stats.totalPoints': -1 });

    const publicUsers = users.map(user => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      department: user.department,
      role: user.role,
      avatar: user.avatar,
      stats: user.stats
    }));

    res.json({
      success: true,
      users: publicUsers,
      total: publicUsers.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Users can only view their own profile unless they're admin/manager
    if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own profile.'
      });
    }

    const user = await User.findById(userId)
      .select('-password -emailVerificationToken -passwordResetToken -accountHistory')
      .populate('teams.teamId', 'name description')
      .populate('achievements.achievementId', 'name description tier');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Users can only update their own profile unless they're admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own profile.'
      });
    }

    // Define allowed update fields based on user role
    const allowedUpdates = req.user.role === 'admin' 
      ? ['firstName', 'lastName', 'department', 'avatar', 'preferences', 'role', 'isActive', 'jobTitle']
      : ['firstName', 'lastName', 'avatar', 'preferences', 'bio', 'phoneNumber', 'location'];
    
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -passwordResetToken -accountHistory');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/search/:query
// @desc    Search users
// @access  Private
router.get('/search/:query', protect, async (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    
    // Create search conditions
    const searchConditions = {
      isActive: true,
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { department: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    };

    const users = await User.find(searchConditions)
      .select('firstName lastName department role avatar stats _id email')
      .limit(50)
      .sort({ 'stats.totalPoints': -1 });

    const filteredUsers = users.map(user => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      department: user.department,
      role: user.role,
      avatar: user.avatar,
      stats: user.stats,
      email: user.email
    }));

    res.json({
      success: true,
      users: filteredUsers,
      total: filteredUsers.length,
      query
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/department/:dept
// @desc    Get users by department
// @access  Private
router.get('/department/:dept', protect, async (req, res) => {
  try {
    const department = req.params.dept;
    
    const users = await User.find({
      department: { $regex: department, $options: 'i' },
      isActive: true
    })
    .select('firstName lastName department role avatar stats _id')
    .sort({ 'stats.totalPoints': -1 });

    const departmentUsers = users.map(user => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      department: user.department,
      role: user.role,
      avatar: user.avatar,
      stats: user.stats
    }));

    res.json({
      success: true,
      users: departmentUsers,
      total: departmentUsers.length,
      department
    });
  } catch (error) {
    console.error('Error fetching department users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics overview
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    // Check if user has permission to view user statistics
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or manager role required.'
      });
    }

    const [totalUsersResult, activeUsersResult, statsAggregation, departmentStatsResult] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.aggregate([
        {
          $group: {
            _id: null,
            totalPoints: { $sum: '$stats.totalPoints' },
            totalModulesCompleted: { $sum: '$stats.modulesCompleted' },
            averageLevel: { $avg: '$stats.level' },
            totalXP: { $sum: '$stats.xp' }
          }
        }
      ]),
      User.aggregate([
        {
          $group: {
            _id: '$department',
            users: { $sum: 1 },
            totalPoints: { $sum: '$stats.totalPoints' },
            modulesCompleted: { $sum: '$stats.modulesCompleted' },
            averageLevel: { $avg: '$stats.level' }
          }
        }
      ])
    ]);

    const totalUsers = totalUsersResult;
    const activeUsers = activeUsersResult;
    const stats = statsAggregation[0] || { totalPoints: 0, totalModulesCompleted: 0, averageLevel: 0, totalXP: 0 };
    
    const departmentStats = departmentStatsResult.reduce((acc, dept) => {
      acc[dept._id] = {
        users: dept.users,
        totalPoints: dept.totalPoints,
        modulesCompleted: dept.modulesCompleted,
        averageLevel: Math.round(dept.averageLevel * 10) / 10
      };
      return acc;
    }, {});

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalPoints: stats.totalPoints,
        totalModulesCompleted: stats.totalModulesCompleted,
        averagePointsPerUser: totalUsers > 0 ? Math.round(stats.totalPoints / totalUsers) : 0,
        averageLevel: Math.round(stats.averageLevel * 10) / 10,
        totalXP: stats.totalXP,
        departmentStats
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/:id/achievements
// @desc    Get user's achievements
// @access  Private
router.get('/:id/achievements', protect, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Users can only view their own achievements unless they're admin/manager
    if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own achievements.'
      });
    }

    const user = await User.findById(userId)
      .populate('achievements.achievementId', 'name description category icon tier rewards rarity');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Format achievements data
    const achievements = user.achievements
      .filter(ua => ua.achievementId) // Only include valid achievements
      .map(ua => ({
        id: ua.achievementId._id,
        title: ua.achievementId.name,
        description: ua.achievementId.description,
        category: ua.achievementId.category,
        rarity: ua.achievementId.rarity || 'common',
        icon: ua.achievementId.icon || '🏆',
        unlockedAt: ua.unlockedAt,
        points: ua.achievementId.rewards?.points || 0,
        isRecent: ua.unlockedAt && (new Date() - new Date(ua.unlockedAt)) < (7 * 24 * 60 * 60 * 1000) // Within last week
      }))
      .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt)); // Most recent first

    res.json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/:id/badges
// @desc    Get user's badges
// @access  Private
router.get('/:id/badges', protect, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Users can only view their own badges unless they're admin/manager
    if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own badges.'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Format badges data (from user's achievements that have badges)
    const badges = user.achievements
      .filter(ua => ua.achievementId && ua.tier) // Only achievements with tiers count as badges
      .map((ua, index) => ({
        id: `badge_${ua.achievementId}_${index}`,
        name: `${ua.tier} Badge`,
        icon: getBadgeIcon(ua.tier),
        rarity: getBadgeRarity(ua.tier),
        earnedAt: ua.unlockedAt,
        category: 'Achievement'
      }))
      .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt)); // Most recent first

    res.json({
      success: true,
      badges
    });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper functions for badges
function getBadgeIcon(tier) {
  switch (tier?.toLowerCase()) {
    case 'bronze': return '🥉';
    case 'silver': return '🥈';
    case 'gold': return '🥇';
    case 'platinum': return '💎';
    case 'diamond': return '💠';
    default: return '🏅';
  }
}

function getBadgeRarity(tier) {
  switch (tier?.toLowerCase()) {
    case 'bronze': return 'common';
    case 'silver': return 'uncommon';
    case 'gold': return 'rare';
    case 'platinum': return 'epic';
    case 'diamond': return 'legendary';
    default: return 'common';
  }
}

module.exports = router;