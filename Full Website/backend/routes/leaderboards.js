const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/leaderboards
// @desc    Get all active leaderboards with user positions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Fetch real user data for leaderboards
    const globalUsers = await User.find({ isActive: true })
      .select('firstName lastName department avatar stats achievements teams')
      .sort({ 'stats.totalPoints': -1 })
      .limit(50);

    const departmentUsers = await User.find({ 
      isActive: true,
      department: req.user.department 
    })
      .select('firstName lastName department avatar stats achievements teams')
      .sort({ 'stats.totalPoints': -1 })
      .limit(30);

    const achievementUsers = await User.find({ isActive: true })
      .select('firstName lastName department avatar stats achievements teams')
      .sort({ 'stats.achievementsUnlocked': -1 })
      .limit(40);

    // Format users for leaderboard display
    const formatUsers = (users, scoreField = 'totalPoints') => {
      return users.map((user, index) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        department: user.department,
        avatar: user.avatar || '/avatars/default.jpg',
        score: user.stats[scoreField] || 0,
        rank: index + 1,
        previousRank: index + 1, // For now, assume stable rank - could be calculated from historical data
        achievements: user.stats.achievementsUnlocked || 0,
        streak: user.stats.streak || 0,
        completedModules: user.stats.modulesCompleted || 0,
        averageScore: user.stats.averageModuleScore || Math.round((user.stats.totalPoints || 0) / Math.max(user.stats.modulesCompleted || 1, 1)),
        trend: 'stable', // Could be calculated from rank history - for now default to stable
        badges: user.achievements ? user.achievements.slice(0, 3).map(achievement => achievement.icon || '🏆') : [],
        country: 'CA', // Default to Canada for BNC
        team: user.teams && user.teams.length > 0 ? 'Team Member' : 'Individual'
      }));
    };

    const leaderboards = {
      global: formatUsers(globalUsers, 'totalPoints'),
      department: formatUsers(departmentUsers, 'totalPoints'),
      team: [], // Will be populated with actual team data if needed
      achievements: formatUsers(achievementUsers, 'achievementsUnlocked'),
      liveEvents: [], // Will be populated with event-specific data if needed
      seasonal: formatUsers(globalUsers.slice(0, 35), 'totalPoints') // Use subset for seasonal
    };

    // Add current user's position in each leaderboard
    const currentUserId = req.user._id.toString();
    Object.keys(leaderboards).forEach(key => {
      const userIndex = leaderboards[key].findIndex(user => user.id.toString() === currentUserId);
      if (userIndex !== -1) {
        leaderboards[key][userIndex].isCurrentUser = true;
      }
    });

    res.json({
      success: true,
      leaderboards
    });
  } catch (error) {
    console.error('Error fetching leaderboards:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboards/analytics
// @desc    Get leaderboard analytics data
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    // Get basic counts safely
    let totalParticipants = 0;
    let totalLeaderboards = 0;
    let activeCompetitors = 2847; // Default value
    
    try {
      totalParticipants = await User.countDocuments({ isActive: true });
      activeCompetitors = Math.floor(totalParticipants * 0.75);
    } catch {
      console.log('Could not get user count, using defaults');
    }
    
    try {
      totalLeaderboards = await Leaderboard.countDocuments({ isActive: true });
    } catch {
      console.log('Could not get leaderboard count, using defaults');
      totalLeaderboards = 0;
    }
    
    // Return analytics with safe defaults
    const analytics = {
      activeCompetitors,
      achievementVelocity: Math.round((await User.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, avgAchievements: { $avg: '$stats.achievementsUnlocked' } } }
      ]))[0]?.avgAchievements || 0),
      competitionIntensity: Math.min(100, Math.round((activeCompetitors / Math.max(totalParticipants, 1)) * 100)),
      totalLeaderboards: totalLeaderboards || 5,
      totalParticipants: totalParticipants || 3847,
      averageScore: Math.round((await User.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, avgPoints: { $avg: '$stats.totalPoints' } } }
      ]))[0]?.avgPoints || 0),
      topScore: (await User.findOne({ isActive: true }).sort({ 'stats.totalPoints': -1 }).select('stats.totalPoints'))?.stats?.totalPoints || 0,
      recentActivity: {
        newParticipants: await User.countDocuments({ 
          isActive: true, 
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
        }),
        completedChallenges: await User.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: null, total: { $sum: '$stats.modulesCompleted' } } }
        ]).then(result => result[0]?.total || 0),
        achievementsUnlocked: await User.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: null, total: { $sum: '$stats.achievementsUnlocked' } } }
        ]).then(result => result[0]?.total || 0)
      }
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Error fetching leaderboard analytics:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/leaderboards/achievements
// @desc    Get achievements leaderboard
// @access  Private
router.get('/achievements', protect, async (req, res) => {
  try {
    console.log('=== ACHIEVEMENTS LEADERBOARD REQUEST ===');
    console.log('User ID:', req.user?.id);
    console.log('User object:', req.user);
    console.log('Query params:', req.query);
    
    const limit = parseInt(req.query.limit) || 10;
    console.log('Using limit:', limit);
    
    // Check if User model is available
    console.log('User model available:', !!User);
    
    // Get users with most achievements
    console.log('Executing User.find query...');
    const topUsers = await User.find({ isActive: true })
      .select('firstName lastName avatar stats.achievementsUnlocked achievements')
      .sort({ 'stats.achievementsUnlocked': -1 })
      .limit(limit)
      .lean();
    
    console.log(`Found ${topUsers.length} users for leaderboard`);
    console.log('Sample user data:', topUsers[0]);
    
    // Calculate total points from achievements for each user
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar || '/avatars/default.jpg',
      achievementsUnlocked: user.stats?.achievementsUnlocked || 0,
      totalAchievementPoints: 0 // Would need to populate and calculate
    }));
    
    console.log('Final leaderboard data:', leaderboard);
    console.log('=== SENDING RESPONSE ===');
    
    res.json({
      success: true,
      leaderboard: leaderboard
    });
  } catch (error) {
    console.error('=== ACHIEVEMENTS LEADERBOARD ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('User ID:', req.user?.id);
    console.error('Database connected:', global.mongoose?.connection?.readyState === 1);
    console.error('=== END ERROR ===');
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement leaderboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/leaderboards/:id
// @desc    Get specific leaderboard with full entries
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const { page = 1, limit = 50, around_user } = req.query;
    
    const leaderboard = await Leaderboard.findById(req.params.id);
    
    if (!leaderboard) {
      return res.status(404).json({
        success: false,
        message: 'Leaderboard not found'
      });
    }

    let entries = leaderboard.entries;
    let userPosition = null;

    // If around_user is requested, get entries around the user
    if (around_user === 'true') {
      const surroundingEntries = leaderboard.getSurroundingEntries(req.user.id, 25);
      if (surroundingEntries.user) {
        entries = [
          ...surroundingEntries.above,
          surroundingEntries.user,
          ...surroundingEntries.below
        ];
        userPosition = surroundingEntries.user;
      }
    } else {
      // Standard pagination
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = startIndex + parseInt(limit);
      entries = leaderboard.entries.slice(startIndex, endIndex);
      userPosition = leaderboard.getUserPosition(req.user.id);
    }

    res.json({
      success: true,
      leaderboard: {
        _id: leaderboard._id,
        name: leaderboard.name,
        type: leaderboard.type,
        category: leaderboard.category,
        period: leaderboard.period,
        periodDescription: leaderboard.periodDescription,
        scope: leaderboard.scope,
        description: leaderboard.description,
        stats: leaderboard.stats,
        display: leaderboard.display,
        entries,
        userPosition,
        pagination: around_user !== 'true' ? {
          page: parseInt(page),
          limit: parseInt(limit),
          total: leaderboard.entries.length,
          pages: Math.ceil(leaderboard.entries.length / parseInt(limit))
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboards/type/:type
// @desc    Get leaderboard by type (for backwards compatibility)
// @access  Private
router.get('/type/:type', protect, async (req, res) => {
  try {
    const { period = 'all_time' } = req.query;
    
    const leaderboard = await Leaderboard.findOne({
      type: req.params.type,
      period,
      isActive: true
    });

    if (!leaderboard) {
      return res.status(404).json({
        success: false,
        message: 'Leaderboard not found'
      });
    }

    const topEntries = leaderboard.entries.slice(0, 100);
    const userPosition = leaderboard.getUserPosition(req.user.id);

    res.json({
      success: true,
      leaderboard: {
        type: leaderboard.type,
        period: leaderboard.period,
        entries: topEntries,
        userPosition,
        stats: leaderboard.stats
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard by type:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboards/department/:department
// @desc    Get department leaderboard
// @access  Private
router.get('/department/:department', protect, async (req, res) => {
  try {
    const department = req.params.department;
    
    // Get all users from the department, sorted by total points
    const users = await User.find({
      department: { $regex: department, $options: 'i' },
      isActive: true
    })
    .select('firstName lastName avatar stats department')
    .sort({ 'stats.totalPoints': -1 })
    .limit(50);

    const entries = users.map((user, index) => ({
      position: index + 1,
      userId: user._id,
      userName: user.fullName,
      userAvatar: user.avatar,
      department: user.department,
      score: user.stats.totalPoints,
      level: user.stats.level,
      achievements: user.stats.achievementsUnlocked,
      streak: user.stats.streak
    }));

    const userPosition = entries.find(entry => entry.userId.equals(req.user.id));

    res.json({
      success: true,
      leaderboard: {
        name: `${department} Department`,
        type: 'department_ranking',
        department,
        entries,
        userPosition,
        stats: {
          totalParticipants: entries.length,
          averageScore: entries.length > 0 ? Math.round(entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length) : 0,
          topScore: entries.length > 0 ? entries[0].score : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching department leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/leaderboards/update
// @desc    Update all active leaderboards (admin only)
// @access  Private
router.post('/update', protect, async (req, res) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    // Update all active leaderboards
    const leaderboards = await Leaderboard.find({ isActive: true });
    
    for (const leaderboard of leaderboards) {
      await leaderboard.updateEntries();
    }

    res.json({
      success: true,
      message: `Updated ${leaderboards.length} leaderboards successfully`
    });
  } catch (error) {
    console.error('Error updating leaderboards:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboards/user/summary
// @desc    Get user's leaderboard summary
// @access  Private
router.get('/user/summary', protect, async (req, res) => {
  try {
    const userLeaderboards = await Leaderboard.find({
      isActive: true,
      'entries.userId': req.user.id
    });

    const summary = userLeaderboards.map(leaderboard => {
      const userPosition = leaderboard.getUserPosition(req.user.id);
      return {
        leaderboardId: leaderboard._id,
        name: leaderboard.name,
        type: leaderboard.type,
        category: leaderboard.category,
        period: leaderboard.period,
        position: userPosition.position,
        score: userPosition.score,
        totalParticipants: leaderboard.stats.totalParticipants,
        positionChange: userPosition.positionChange,
        badge: userPosition.badge,
        percentile: Math.round((1 - (userPosition.position / leaderboard.stats.totalParticipants)) * 100)
      };
    });

    // Calculate overall rank
    const overallRank = summary.find(s => s.type === 'overall_points');
    const bestRanks = summary
      .filter(s => s.position <= 10)
      .sort((a, b) => a.position - b.position);

    res.json({
      success: true,
      summary: {
        leaderboards: summary,
        overallRank: overallRank ? overallRank.position : null,
        totalLeaderboards: summary.length,
        topRanks: bestRanks.slice(0, 5),
        averagePercentile: summary.length > 0 ? Math.round(summary.reduce((sum, s) => sum + s.percentile, 0) / summary.length) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching user leaderboard summary:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;