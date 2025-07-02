const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/user/achievements
// @desc    Get current user's achievements
// @access  Private
router.get('/achievements', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
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
      data: {
        achievements
      }
    });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/user/badges
// @desc    Get current user's badges
// @access  Private
router.get('/badges', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('achievements.achievementId', 'name description category icon tier rewards rarity');

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
        id: `badge_${ua.achievementId._id}_${index}`,
        name: `${ua.tier} Badge`,
        icon: getBadgeIcon(ua.tier),
        rarity: getBadgeRarity(ua.tier),
        earnedAt: ua.unlockedAt,
        category: ua.achievementId.category || 'Achievement'
      }))
      .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt)); // Most recent first

    // If no tier-based badges, create some from achievements
    if (badges.length === 0 && user.achievements.length > 0) {
      const achievementBadges = user.achievements
        .filter(ua => ua.achievementId)
        .slice(0, 6) // Limit to 6 badges
        .map((ua, index) => ({
          id: `achievement_badge_${ua.achievementId._id}`,
          name: ua.achievementId.name,
          icon: ua.achievementId.icon || '🏅',
          rarity: ua.achievementId.rarity || 'common',
          earnedAt: ua.unlockedAt,
          category: ua.achievementId.category || 'Achievement'
        }));
      badges.push(...achievementBadges);
    }

    res.json({
      success: true,
      data: {
        badges
      }
    });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/user/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
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
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update current user's profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    // Define allowed update fields for users
    const allowedUpdates = ['firstName', 'lastName', 'avatar', 'preferences', 'bio', 'phoneNumber', 'location'];
    
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
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
      message: 'Profile updated successfully',
      user: user
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
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