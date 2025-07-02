const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const { logUserAction } = require('../utils/auditLogger');
const router = express.Router();

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed!'));
    }
  }
});

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires')
      .populate('manager', 'firstName lastName email')
      .populate('teams.teamId', 'name description')
      .populate('enrolledModules.moduleId', 'title description');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving profile'
    });
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', protect, [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phoneNumber').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('location.city').optional().trim(),
  body('location.province').optional().trim(),
  body('location.country').optional().trim()
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

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      location: user.location
    };

    // Check if email is being changed and if it's already taken
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
      user.isEmailVerified = false; // Require re-verification for new email
    }

    // Update allowed fields
    const allowedUpdates = ['firstName', 'lastName', 'email', 'phoneNumber', 'bio'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Update location if provided
    if (req.body.location) {
      user.location = {
        ...user.location,
        ...req.body.location
      };
    }

    await user.save();

    // Log the profile update
    await logUserAction(
      user._id,
      'PROFILE_UPDATED',
      req.ip,
      req.get('User-Agent'),
      {
        updatedFields: Object.keys(req.body),
        oldProfile,
        newProfile: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          bio: user.bio,
          location: user.location
        }
      }
    );

    // Return updated user (exclude sensitive fields)
    const updatedUser = await User.findById(user._id)
      .select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @route   PUT /api/profile/password
// @desc    Change user password
// @access  Private
router.put('/password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match');
    }
    return true;
  })
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

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Log the password change
    await logUserAction(
      user._id,
      'PASSWORD_CHANGED',
      req.ip,
      req.get('User-Agent'),
      { timestamp: new Date() }
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
});

// @route   PUT /api/profile/avatar
// @desc    Update avatar configuration
// @access  Private
router.put('/avatar', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldAvatarConfig = { ...user.avatarConfiguration };

    // Update avatar configuration
    if (req.body.avatarConfiguration) {
      user.avatarConfiguration = {
        ...user.avatarConfiguration,
        ...req.body.avatarConfiguration
      };
    }

    await user.save();

    // Log the avatar update
    await logUserAction(
      user._id,
      'AVATAR_UPDATED',
      req.ip,
      req.get('User-Agent'),
      {
        oldConfig: oldAvatarConfig,
        newConfig: user.avatarConfiguration
      }
    );

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatarConfiguration: user.avatarConfiguration
      }
    });

  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating avatar'
    });
  }
});

// @route   POST /api/profile/upload-photo
// @desc    Upload profile photo
// @access  Private
router.post('/upload-photo', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldAvatar = user.avatar;
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    // Log the photo upload
    await logUserAction(
      user._id,
      'PROFILE_PHOTO_UPLOADED',
      req.ip,
      req.get('User-Agent'),
      {
        oldAvatar,
        newAvatar: user.avatar,
        filename: req.file.filename,
        fileSize: req.file.size
      }
    );

    res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error uploading photo'
    });
  }
});

// @route   GET /api/profile/analytics
// @desc    Get user analytics data
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const { timeframe = 'month' } = req.query;
    
    const user = await User.findById(req.user._id)
      .populate('enrolledModules.moduleId', 'title category duration')
      .populate('achievements.achievementId', 'title description category tier')
      .populate('teams.teamId', 'name members');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate analytics based on user data
    const analytics = {
      overview: {
        completionRate: calculateCompletionRate(user),
        averageScore: calculateAverageScore(user),
        timeSpent: user.stats.totalLearningTime,
        currentStreak: user.stats.streak,
        targetStreak: 30
      },
      skills: calculateSkillsAnalysis(user),
      achievements: user.achievements.map(achievement => ({
        id: achievement.achievementId._id,
        title: achievement.achievementId.title,
        category: achievement.achievementId.category,
        tier: achievement.tier,
        earnedAt: achievement.unlockedAt
      })),
      learningStyle: calculateLearningStyle(user),
      peerComparison: await calculatePeerComparison(user),
      predictiveAnalytics: calculatePredictiveAnalytics(user),
      roiCalculation: calculateROI(user)
    };

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

// Helper functions for analytics calculations
function calculateCompletionRate(user) {
  const completed = user.stats.modulesCompleted;
  const total = user.stats.modulesCompleted + user.stats.modulesInProgress;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function calculateAverageScore(user) {
  // Calculate from enrolled modules scores
  const completedModules = user.enrolledModules.filter(module => module.completedAt);
  if (completedModules.length === 0) {return 0;}
  
  const totalScore = completedModules.reduce((sum, module) => sum + (module.score || 0), 0);
  return Math.round(totalScore / completedModules.length);
}

function calculateSkillsAnalysis(user) {
  // Skills analysis based on completed modules
  return {
    customerService: Math.min(user.stats.level * 10, 100),
    financialProducts: Math.min(user.stats.level * 8, 100),
    communication: Math.min(user.stats.level * 12, 100),
    problemSolving: Math.min(user.stats.level * 9, 100),
    compliance: Math.min(user.stats.level * 7, 100),
    technology: Math.min(user.stats.level * 6, 100)
  };
}

// eslint-disable-next-line no-unused-vars
function calculateLearningStyle(user) {
  return {
    primary: 'Visual',
    secondary: 'Kinesthetic',
    preferences: {
      visual: 45,
      auditory: 20,
      kinesthetic: 25,
      reading: 10
    }
  };
}

async function calculatePeerComparison(user) {
  // Get department peers for comparison
  const peers = await User.find({ 
    department: user.department,
    _id: { $ne: user._id },
    isActive: true 
  }).select('stats firstName lastName');

  const departmentStats = {
    averageLevel: peers.reduce((sum, peer) => sum + peer.stats.level, 0) / peers.length,
    averagePoints: peers.reduce((sum, peer) => sum + peer.stats.totalPoints, 0) / peers.length,
    totalPeers: peers.length
  };

  return {
    departmentRank: calculateRank(user, peers),
    percentile: calculatePercentile(user, peers),
    benchmarks: departmentStats
  };
}

function calculateRank(user, peers) {
  const sorted = [...peers, user].sort((a, b) => b.stats.totalPoints - a.stats.totalPoints);
  return sorted.findIndex(u => u._id.equals(user._id)) + 1;
}

function calculatePercentile(user, peers) {
  const belowUser = peers.filter(peer => peer.stats.totalPoints < user.stats.totalPoints).length;
  return Math.round((belowUser / peers.length) * 100);
}

function calculatePredictiveAnalytics(user) {
  const currentLevel = user.stats.level;
  const projectedGrowth = Math.min(currentLevel * 0.2, 3);
  
  return {
    careerProgression: `Level ${currentLevel + projectedGrowth}`,
    timeToPromotion: `${12 - Math.min(currentLevel, 10)} months`,
    keySkillsNeeded: ['Leadership', 'Advanced Financial Analysis', 'Team Management'],
    successProbability: Math.min(currentLevel * 10 + 30, 95)
  };
}

function calculateROI(user) {
  const trainingCost = user.stats.totalLearningTime * 0.5; // $0.50 per minute
  const productivityGain = user.stats.level * 1000; // $1000 per level
  const roi = ((productivityGain - trainingCost) / trainingCost) * 100;
  
  return {
    trainingInvestment: trainingCost,
    productivityReturns: productivityGain,
    roiPercentage: Math.round(roi),
    paybackPeriod: Math.max(1, Math.round(trainingCost / (productivityGain / 12)))
  };
}

module.exports = router;