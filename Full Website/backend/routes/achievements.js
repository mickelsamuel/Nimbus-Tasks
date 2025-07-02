const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const { protect, checkUserFlow } = require('../middleware/auth');
const { logUserAction } = require('../utils/auditLogger');

// @desc    Get all achievements for user
// @route   GET /api/achievements
// @access  Private
router.get('/', protect, checkUserFlow, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('achievements.achievementId');
    
    // Get all active achievements
    const allAchievements = await Achievement.findActive();
    
    // Map achievements with user progress
    const achievementsWithProgress = allAchievements.map(achievement => {
      const userAchievement = user.achievements.find(
        ua => ua.achievementId && ua.achievementId._id.equals(achievement._id)
      );
      
      return {
        ...achievement.toObject(),
        userProgress: userAchievement ? {
          progress: userAchievement.progress,
          unlockedAt: userAchievement.unlockedAt,
          tier: userAchievement.tier
        } : {
          progress: 0,
          unlockedAt: null,
          tier: null
        }
      };
    });
    
    // Sort by category and progress
    achievementsWithProgress.sort((a, b) => {
      // Unlocked achievements first
      if (a.userProgress.unlockedAt && !b.userProgress.unlockedAt) {return -1;}
      if (!a.userProgress.unlockedAt && b.userProgress.unlockedAt) {return 1;}
      
      // Then by category
      if (a.category < b.category) {return -1;}
      if (a.category > b.category) {return 1;}
      
      // Then by tier
      return b.tierScore - a.tierScore;
    });
    
    await logUserAction(
      req.user.id,
      'ACHIEVEMENTS_VIEWED',
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({
      success: true,
      count: achievementsWithProgress.length,
      totalUnlocked: user.stats.achievementsUnlocked || 0,
      data: achievementsWithProgress
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements'
    });
  }
});

// @desc    Get achievements by category
// @route   GET /api/achievements/category/:category
// @access  Private
router.get('/category/:category', protect, checkUserFlow, async (req, res) => {
  try {
    const { category } = req.params;
    const user = await User.findById(req.user.id);
    
    const achievements = await Achievement.findByCategory(category);
    
    // Map with user progress
    const achievementsWithProgress = achievements.map(achievement => {
      const userAchievement = user.achievements.find(
        ua => ua.achievementId.equals(achievement._id)
      );
      
      return {
        ...achievement.toObject(),
        userProgress: userAchievement ? {
          progress: userAchievement.progress,
          unlockedAt: userAchievement.unlockedAt,
          tier: userAchievement.tier
        } : {
          progress: 0,
          unlockedAt: null,
          tier: null
        }
      };
    });
    
    res.json({
      success: true,
      category,
      count: achievementsWithProgress.length,
      data: achievementsWithProgress
    });
  } catch (error) {
    console.error('Error fetching achievements by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements'
    });
  }
});

// @desc    Get achievement details
// @route   GET /api/achievements/:id
// @access  Private
router.get('/:id', protect, checkUserFlow, async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
      .populate('series.nextAchievement')
      .populate('series.previousAchievement');
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    // Get user's progress for this achievement
    const user = await User.findById(req.user.id);
    const userAchievement = user.achievements.find(
      ua => ua.achievementId.equals(achievement._id)
    );
    
    const achievementData = {
      ...achievement.toObject(),
      userProgress: userAchievement ? {
        progress: userAchievement.progress,
        unlockedAt: userAchievement.unlockedAt,
        tier: userAchievement.tier
      } : {
        progress: 0,
        unlockedAt: null,
        tier: null
      }
    };
    
    // Calculate current progress if not unlocked
    if (!userAchievement || userAchievement.progress < 100) {
      const progressCheck = achievement.checkCriteria(user.stats);
      achievementData.userProgress.progress = progressCheck.progress;
      achievementData.userProgress.currentValue = progressCheck.currentValue;
      achievementData.userProgress.targetValue = progressCheck.target;
    }
    
    res.json({
      success: true,
      data: achievementData
    });
  } catch (error) {
    console.error('Error fetching achievement details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement details'
    });
  }
});

// @desc    Check and update user achievements
// @route   POST /api/achievements/check
// @access  Private
router.post('/check', protect, checkUserFlow, async (req, res) => {
  try {
    const newAchievements = await Achievement.checkAllForUser(req.user.id);
    
    if (newAchievements.length > 0) {
      await logUserAction(
        req.user.id,
        'ACHIEVEMENTS_UNLOCKED',
        req.ip,
        req.get('User-Agent'),
        {
          count: newAchievements.length,
          achievements: newAchievements.map(a => ({
            id: a.achievement._id,
            name: a.achievement.name,
            tier: a.achievement.tier
          }))
        }
      );
      
      // Send notifications for new achievements
      if (global.io) {
        global.io.to(`user_${req.user.id}`).emit('achievements_unlocked', {
          achievements: newAchievements.map(a => ({
            id: a.achievement._id,
            name: a.achievement.name,
            description: a.achievement.description,
            icon: a.achievement.icon,
            tier: a.achievement.tier,
            rewards: a.achievement.rewards
          }))
        });
      }
    }
    
    res.json({
      success: true,
      newAchievements: newAchievements.length,
      data: newAchievements
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check achievements'
    });
  }
});

// @desc    Get achievement statistics
// @route   GET /api/achievements/stats
// @access  Private
router.get('/stats/overview', protect, checkUserFlow, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get achievement statistics
    const totalAchievements = await Achievement.countDocuments({ isActive: true });
    const unlockedCount = user.stats.achievementsUnlocked || 0;
    
    // Get achievements by category
    const categoryStats = await Achievement.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          avgPoints: { $avg: '$rewards.points' }
        }
      }
    ]);
    
    // Get achievements by tier
    const tierStats = await Achievement.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$tier',
          total: { $sum: 1 },
          avgPoints: { $avg: '$rewards.points' }
        }
      }
    ]);
    
    // Get rarest unlocked achievements
    const rarestUnlocked = await Achievement.find({
      _id: { $in: user.achievements.map(a => a.achievementId) },
      isActive: true
    })
    .sort({ 'stats.unlockRate': 1 })
    .limit(5)
    .select('name icon tier rarity stats.unlockRate');
    
    res.json({
      success: true,
      data: {
        overview: {
          total: totalAchievements,
          unlocked: unlockedCount,
          percentage: totalAchievements > 0 ? Math.round((unlockedCount / totalAchievements) * 100) : 0
        },
        categoryStats,
        tierStats,
        rarestUnlocked,
        totalPoints: user.achievements.reduce((total, a) => {
          const achievement = a.achievementId;
          return total + (achievement && achievement.rewards ? achievement.rewards.points : 0);
        }, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching achievement statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement statistics'
    });
  }
});

// @desc    Get achievement leaderboard
// @route   GET /api/achievements/leaderboard
// @access  Private
router.get('/leaderboard/top', protect, checkUserFlow, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get users with most achievements
    const topUsers = await User.find({ isActive: true })
      .select('firstName lastName avatar stats.achievementsUnlocked achievements')
      .sort({ 'stats.achievementsUnlocked': -1 })
      .limit(limit)
      .lean();
    
    // Calculate total points from achievements for each user
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      achievementsUnlocked: user.stats.achievementsUnlocked || 0,
      totalAchievementPoints: 0 // Would need to populate and calculate
    }));
    
    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching achievement leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement leaderboard'
    });
  }
});

module.exports = router;