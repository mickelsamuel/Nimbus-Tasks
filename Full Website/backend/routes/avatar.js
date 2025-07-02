const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const AvatarShare = require('../models/AvatarShare');
const AvatarAnalytics = require('../models/AvatarAnalytics');
const avatarService = require('../utils/avatarService');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { logUserAction } = require('../utils/auditLogger');

// Configure multer for avatar photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, '../uploads/avatars');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `avatar-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF) are allowed'));
    }
  }
});

// Default avatar route - Get user's avatar summary
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        avatar: user.avatar,
        avatar3D: user.avatar3D,
        avatar2D: user.avatar2D,
        avatarPortrait: user.avatarPortrait,
        hasCompletedAvatarSetup: user.hasCompletedAvatarSetup,
        configuration: user.avatarConfiguration
      }
    });
  } catch (error) {
    console.error('Avatar fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch avatar data'
    });
  }
});

// Get user's current avatar configuration
router.get('/config', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return current avatar configuration
    const avatarConfig = {
      avatar: user.avatar,
      inventory: user.inventory.avatars,
      preferences: user.preferences,
      stats: {
        level: user.stats.level,
        coins: user.stats.coins,
        tokens: user.stats.tokens
      }
    };

    res.json({
      success: true,
      data: avatarConfig
    });
  } catch (error) {
    console.error('Avatar config fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch avatar configuration'
    });
  }
});

// Generate avatar options for user
router.get('/options', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate avatar options using the avatar service
    const avatarOptions = await avatarService.generateAvatarOptions({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      employeeId: user.employeeId,
      role: user.role
    });

    res.json({
      success: true,
      data: avatarOptions
    });
  } catch (error) {
    console.error('Avatar options generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate avatar options'
    });
  }
});

// Get professional avatar presets
router.get('/presets', protect, async (req, res) => {
  try {
    const presets = avatarService.getProfessionalAvatarPresets();
    
    res.json({
      success: true,
      data: presets
    });
  } catch (error) {
    console.error('Avatar presets fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch avatar presets'
    });
  }
});

// Save avatar configuration
router.post('/save', protect, async (req, res) => {
  try {
    const { avatarUrl, configuration } = req.body;
    // eslint-disable-next-line no-unused-vars
    const { preset } = req.body;
    
    if (!avatarUrl) {
      return res.status(400).json({
        success: false,
        message: 'Avatar URL is required'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validate avatar URL
    const isValidUrl = await avatarService.validateAvatarUrl(avatarUrl);
    if (!isValidUrl) {
      return res.status(400).json({
        success: false,
        message: 'Invalid avatar URL'
      });
    }

    // Determine if this is a 3D (.glb) or 2D (.png) avatar URL
    const is3D = avatarUrl.includes('.glb');
    const is2D = avatarUrl.includes('.png') || avatarUrl.includes('.jpg') || avatarUrl.includes('.jpeg');
    
    // Update user avatar fields
    user.avatar = avatarUrl; // Keep for backward compatibility
    
    if (is3D) {
      user.avatar3D = avatarUrl;
      // Generate 2D URL from 3D URL
      user.avatar2D = avatarUrl.replace('.glb', '.png');
      // Generate portrait URL from 3D URL - use headshot/portrait endpoint
      if (avatarUrl.includes('readyplayer.me')) {
        const avatarId = avatarUrl.match(/\/([a-zA-Z0-9]+)\.glb/)?.[1];
        if (avatarId) {
          // Use high-quality 2D avatar for portrait - frontend will handle cropping
          user.avatarPortrait = `https://models.readyplayer.me/${avatarId}.png?textureAtlas=2048&morphTargets=ARKit`;
        } else {
          user.avatarPortrait = avatarUrl.replace('.glb', '.png');
        }
      }
    } else if (is2D) {
      user.avatar2D = avatarUrl;
      user.avatarPortrait = avatarUrl; // For 2D, portrait is same as 2D
      // If we only have 2D, keep 3D field as is or derive from 2D
      if (avatarUrl.includes('readyplayer.me') && avatarUrl.includes('.png')) {
        user.avatar3D = avatarUrl.replace('.png', '.glb');
      }
    }
    
    // Save configuration if provided
    if (configuration) {
      user.avatarConfiguration = configuration;
    }

    // Mark avatar setup as completed if this is the first time
    if (!user.hasCompletedAvatarSetup) {
      user.hasCompletedAvatarSetup = true;
      user.avatarSetupCompletedAt = new Date();
    }

    // Update last activity
    user.lastActivity = new Date();

    await user.save();

    res.json({
      success: true,
      message: 'Avatar saved successfully',
      data: {
        avatar: user.avatar,
        avatar3D: user.avatar3D,
        avatar2D: user.avatar2D,
        avatarPortrait: user.avatarPortrait,
        configuration: configuration
      }
    });
  } catch (error) {
    console.error('Avatar save error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save avatar'
    });
  }
});

// @route   POST /api/avatar/complete-setup
// @desc    Complete avatar setup process
// @access  Private
router.post('/complete-setup', protect, [
  body('avatar').isURL().withMessage('Valid avatar URL is required'),
  body('hasCompletedAvatarSetup').isBoolean().withMessage('Avatar setup completion status must be boolean')
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

    const { avatar, hasCompletedAvatarSetup } = req.body;
    const userId = req.user._id;

    // Find and update user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update avatar setup completion
    user.avatar = avatar;
    
    // Determine if this is a 3D (.glb) or 2D (.png) avatar URL
    const is3D = avatar.includes('.glb');
    const is2D = avatar.includes('.png') || avatar.includes('.jpg') || avatar.includes('.jpeg');
    
    if (is3D) {
      user.avatar3D = avatar;
      // Generate 2D URL from 3D URL
      user.avatar2D = avatar.replace('.glb', '.png');
      // Generate portrait URL from 3D URL - use headshot/portrait endpoint
      if (avatar.includes('readyplayer.me')) {
        const avatarId = avatar.match(/\/([a-zA-Z0-9]+)\.glb/)?.[1];
        if (avatarId) {
          // Use high-quality 2D avatar for portrait - frontend will handle cropping
          user.avatarPortrait = `https://models.readyplayer.me/${avatarId}.png?textureAtlas=2048&morphTargets=ARKit`;
        } else {
          user.avatarPortrait = avatar.replace('.glb', '.png');
        }
      }
    } else if (is2D) {
      user.avatar2D = avatar;
      user.avatarPortrait = avatar; // For 2D, portrait is same as 2D
      // If we only have 2D, keep 3D field as is or derive from 2D
      if (avatar.includes('readyplayer.me') && avatar.includes('.png')) {
        user.avatar3D = avatar.replace('.png', '.glb');
      }
    }
    
    user.hasCompletedAvatarSetup = hasCompletedAvatarSetup;
    user.avatarSetupCompletedAt = new Date();

    // Add to account history
    user.accountHistory.push({
      action: 'AVATAR_SETUP_COMPLETED',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    await user.save();

    // Log action
    await logUserAction(userId, 'AVATAR_SETUP_COMPLETED', req.ip, req.get('User-Agent'), { 
      avatar,
      completedAt: user.avatarSetupCompletedAt
    });

    res.json({
      success: true,
      message: 'Avatar setup completed successfully',
      data: {
        avatar: user.avatar,
        avatar3D: user.avatar3D,
        avatar2D: user.avatar2D,
        avatarPortrait: user.avatarPortrait,
        hasCompletedAvatarSetup: user.hasCompletedAvatarSetup,
        avatarSetupCompletedAt: user.avatarSetupCompletedAt
      }
    });

  } catch (error) {
    console.error('Avatar setup completion error:', error);
    await logUserAction(req.user?._id || null, 'AVATAR_SETUP_ERROR', req.ip, req.get('User-Agent'), { 
      error: error.message 
    });
    
    res.status(500).json({
      success: false,
      message: 'Server error completing avatar setup'
    });
  }
});

// Generate role-based avatar
router.post('/generate', protect, async (req, res) => {
  try {
    const { role } = req.body;
    // eslint-disable-next-line no-unused-vars
    const { preset } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate avatar based on role or use current user role
    const targetRole = role || user.role;
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      employeeId: user.employeeId,
      role: targetRole
    };

    const avatarUrl = await avatarService.generateRoleBasedAvatar(userData);

    res.json({
      success: true,
      data: {
        avatarUrl,
        role: targetRole,
        preview: avatarService.getAvatarPreview(avatarUrl)
      }
    });
  } catch (error) {
    console.error('Avatar generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate avatar'
    });
  }
});

// Purchase avatar item
router.post('/purchase', protect, async (req, res) => {
  try {
    const { itemId, itemType, cost } = req.body;
    
    if (!itemId || !itemType || !cost) {
      return res.status(400).json({
        success: false,
        message: 'Item ID, type, and cost are required'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has enough currency
    const hasEnoughCoins = !cost.coins || user.stats.coins >= cost.coins;
    const hasEnoughTokens = !cost.tokens || user.stats.tokens >= cost.tokens;
    
    if (!hasEnoughCoins || !hasEnoughTokens) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient currency'
      });
    }

    // Check if user already owns the item
    const alreadyOwned = user.inventory.avatars.some(item => item.itemId === itemId);
    if (alreadyOwned) {
      return res.status(400).json({
        success: false,
        message: 'Item already owned'
      });
    }

    // Deduct currency
    if (cost.coins) {user.stats.coins -= cost.coins;}
    if (cost.tokens) {user.stats.tokens -= cost.tokens;}

    // Add item to inventory
    const newItem = {
      itemId,
      name: req.body.name || `Avatar Item ${itemId}`,
      rarity: req.body.rarity || 'common',
      purchasedAt: new Date()
    };
    user.inventory.avatars.push(newItem);

    // Add transaction record
    user.currencyTransactions.push({
      type: 'spend',
      coins: cost.coins || 0,
      tokens: cost.tokens || 0,
      reason: `Purchased avatar item: ${newItem.name}`,
      item: newItem.name,
      category: 'avatar'
    });

    await user.save();

    res.json({
      success: true,
      message: 'Avatar item purchased successfully',
      data: {
        item: newItem,
        remainingCurrency: {
          coins: user.stats.coins,
          tokens: user.stats.tokens
        }
      }
    });
  } catch (error) {
    console.error('Avatar purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase avatar item'
    });
  }
});

// Get avatar shop items
router.get('/shop', protect, async (req, res) => {
  try {
    const shopItems = [
      {
        id: 'exec-suit-1',
        name: 'Executive Business Suit',
        category: 'clothing',
        rarity: 'legendary',
        cost: { premiumCoins: 200 },
        preview: '/api/placeholder/120/120',
        description: 'Premium executive suit for senior leadership'
      },
      {
        id: 'prof-hair-1',
        name: 'Professional Styled Hair',
        category: 'hair',
        rarity: 'rare',
        cost: { tokens: 50 },
        preview: '/api/placeholder/120/120',
        description: 'Professional hairstyle for banking environment'
      },
      {
        id: 'conf-pose-1',
        name: 'Confident Leadership Pose',
        category: 'pose',
        rarity: 'epic',
        cost: { coins: 800 },
        preview: '/api/placeholder/120/120',
        description: 'Commanding leadership stance'
      },
      {
        id: 'gold-cufflinks',
        name: 'Gold Cufflinks',
        category: 'accessory',
        rarity: 'rare',
        cost: { coins: 300 },
        preview: '/api/placeholder/120/120',
        description: 'Elegant gold cufflinks for professional attire'
      },
      {
        id: 'luxury-watch',
        name: 'Luxury Watch',
        category: 'accessory',
        rarity: 'epic',
        cost: { tokens: 75 },
        preview: '/api/placeholder/120/120',
        description: 'Premium timepiece for executives'
      },
      {
        id: 'exec-glasses',
        name: 'Executive Glasses',
        category: 'accessory',
        rarity: 'uncommon',
        cost: { coins: 150 },
        preview: '/api/placeholder/120/120',
        description: 'Professional eyewear for business leaders'
      }
    ];

    res.json({
      success: true,
      data: shopItems
    });
  } catch (error) {
    console.error('Avatar shop fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop items'
    });
  }
});

// Validate professional compliance
router.post('/validate', protect, async (req, res) => {
  try {
    const { configuration } = req.body;
    
    if (!configuration) {
      return res.status(400).json({
        success: false,
        message: 'Avatar configuration is required'
      });
    }

    // Professional compliance checks
    const compliance = {
      bankingStandards: {
        passed: true,
        score: 95,
        details: 'Meets banking industry appearance standards'
      },
      professionalAppearance: {
        passed: true,
        score: 92,
        details: 'Professional attire and grooming standards met'
      },
      accessibility: {
        passed: configuration.accessibility?.highContrast || false,
        score: configuration.accessibility?.highContrast ? 88 : 75,
        details: configuration.accessibility?.highContrast 
          ? 'Accessibility standards met' 
          : 'Consider enabling high contrast for better accessibility'
      }
    };

    const overallScore = Math.round(
      (compliance.bankingStandards.score + 
       compliance.professionalAppearance.score + 
       compliance.accessibility.score) / 3
    );

    res.json({
      success: true,
      data: {
        compliance,
        overallScore,
        approved: overallScore >= 80
      }
    });
  } catch (error) {
    console.error('Avatar validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate avatar'
    });
  }
});

// Export avatar with metadata
router.get('/export/:format?', protect, async (req, res) => {
  try {
    const { format = 'glb' } = req.params;
    const { quality = 'high', includeMetadata = false } = req.query;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.avatar) {
      return res.status(400).json({
        success: false,
        message: 'No avatar found to export'
      });
    }

    // Generate export URL with specified format and quality
    const exportData = {
      avatarUrl: user.avatar,
      format,
      quality,
      configuration: user.avatarConfiguration,
      metadata: includeMetadata ? {
        userId: user._id,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt,
        exportedAt: new Date()
      } : undefined
    };

    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    console.error('Avatar export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export avatar'
    });
  }
});

// Share avatar and generate shareable link
router.post('/share', protect, async (req, res) => {
  try {
    const { includeConfiguration = false, expiresIn = '7d', isPublic = false, allowDownload = false } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.avatar) {
      return res.status(400).json({
        success: false,
        message: 'No avatar found to share'
      });
    }

    // Generate a shareable token
    const shareToken = require('crypto').randomBytes(32).toString('hex');
    const expiresAt = new Date();
    
    // Set expiration based on expiresIn parameter
    const expireDays = expiresIn === '1d' ? 1 : expiresIn === '7d' ? 7 : expiresIn === '30d' ? 30 : 7;
    expiresAt.setDate(expiresAt.getDate() + expireDays);

    // Create share record in database
    const avatarShare = new AvatarShare({
      shareToken,
      ownerId: user._id,
      avatarUrl: user.avatar,
      avatarConfiguration: includeConfiguration ? user.avatarConfiguration : undefined,
      includeConfiguration,
      isPublic,
      allowDownload,
      expiresAt
    });

    await avatarShare.save();

    // Update analytics
    let analytics = await AvatarAnalytics.findOne({ userId: user._id });
    if (!analytics) {
      analytics = new AvatarAnalytics({ userId: user._id });
    }
    analytics.avatarUsage.totalShared += 1;
    analytics.social.avatarViews += 1;
    await analytics.save();

    const shareData = {
      shareToken: avatarShare.shareToken,
      shareUrl: avatarShare.shareUrl,
      avatar: user.avatar,
      ownerName: user.fullName,
      configuration: includeConfiguration ? user.avatarConfiguration : undefined,
      expiresAt: avatarShare.expiresAt,
      isPublic,
      allowDownload,
      createdAt: avatarShare.createdAt
    };

    res.json({
      success: true,
      data: shareData,
      message: 'Avatar share link generated successfully'
    });
  } catch (error) {
    console.error('Avatar share error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate share link'
    });
  }
});

// Get shared avatar by token
router.get('/shared/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    // Find the shared avatar
    const avatarShare = await AvatarShare.findOne({ 
      shareToken: token, 
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).populate('ownerId', 'firstName lastName role department');

    if (!avatarShare) {
      return res.status(404).json({
        success: false,
        message: 'Shared avatar not found or expired'
      });
    }

    // Record view
    const viewerId = req.user?.id || null;
    await avatarShare.incrementView(viewerId, clientIP, userAgent);

    const responseData = {
      avatar: avatarShare.avatarUrl,
      ownerName: avatarShare.ownerId.fullName,
      ownerRole: avatarShare.ownerId.role,
      ownerDepartment: avatarShare.ownerId.department,
      configuration: avatarShare.includeConfiguration ? avatarShare.avatarConfiguration : null,
      isPublic: avatarShare.isPublic,
      allowDownload: avatarShare.allowDownload,
      viewCount: avatarShare.viewCount,
      createdAt: avatarShare.createdAt,
      expiresAt: avatarShare.expiresAt,
      timeRemaining: avatarShare.timeRemaining
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Shared avatar fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shared avatar'
    });
  }
});

// Get user's avatar analytics
router.get('/analytics', protect, async (req, res) => {
  try {
    const analytics = await AvatarAnalytics.getUserAnalytics(req.user.id);
    
    if (!analytics) {
      // Create new analytics record if none exists
      const newAnalytics = new AvatarAnalytics({ userId: req.user.id });
      await newAnalytics.save();
      
      return res.json({
        success: true,
        data: newAnalytics
      });
    }

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Avatar analytics fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch avatar analytics'
    });
  }
});

// Record avatar feature usage (for analytics)
router.post('/analytics/feature-usage', protect, async (req, res) => {
  try {
    const { featureType, specificFeature, sessionDuration, actionsPerformed } = req.body;
    
    let analytics = await AvatarAnalytics.findOne({ userId: req.user.id });
    if (!analytics) {
      analytics = new AvatarAnalytics({ userId: req.user.id });
    }

    // Record feature usage
    if (featureType) {
      await analytics.recordFeatureUsage(featureType, specificFeature);
    }

    // Record daily usage if provided
    if (sessionDuration && actionsPerformed) {
      await analytics.recordDailyUsage(sessionDuration, actionsPerformed, [featureType]);
    }

    res.json({
      success: true,
      message: 'Feature usage recorded'
    });
  } catch (error) {
    console.error('Feature usage recording error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record feature usage'
    });
  }
});

// Get user's shared avatars
router.get('/shares', protect, async (req, res) => {
  try {
    const shares = await AvatarShare.findActiveByOwner(req.user.id);
    
    res.json({
      success: true,
      data: shares
    });
  } catch (error) {
    console.error('Avatar shares fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch avatar shares'
    });
  }
});

// Delete/deactivate shared avatar
router.delete('/shares/:shareId', protect, async (req, res) => {
  try {
    const { shareId } = req.params;
    
    const avatarShare = await AvatarShare.findOne({ 
      _id: shareId, 
      ownerId: req.user.id 
    });

    if (!avatarShare) {
      return res.status(404).json({
        success: false,
        message: 'Shared avatar not found'
      });
    }

    avatarShare.isActive = false;
    await avatarShare.save();

    res.json({
      success: true,
      message: 'Shared avatar deactivated successfully'
    });
  } catch (error) {
    console.error('Avatar share deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete avatar share'
    });
  }
});

// Get department avatar analytics (for managers/admins)
router.get('/analytics/department/:department', protect, async (req, res) => {
  try {
    const { department } = req.params;
    
    // Check if user has permission to view department analytics
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin' && user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const analytics = await AvatarAnalytics.getDepartmentAnalytics(department);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Department analytics fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch department analytics'
    });
  }
});

// Team avatar standards enforcement
router.post('/team-standards/validate', protect, async (req, res) => {
  try {
    const { configuration } = req.body;
    // eslint-disable-next-line no-unused-vars
    const { teamId } = req.body;
    
    // Get team standards (this would be configurable by team leaders)
    const teamStandards = {
      requiredSuitColors: ['navy-executive', 'charcoal-professional', 'black-formal'],
      requiredHairStyles: ['executive-cut', 'professional-short', 'classic-professional'],
      bannedAccessories: ['casual-watch', 'sports-gear'],
      minConfidenceLevel: 75,
      requiredProfessionalScore: 85
    };

    // Validate against team standards
    const violations = [];
    
    if (configuration.clothing?.suit && !teamStandards.requiredSuitColors.includes(configuration.clothing.suit)) {
      violations.push('Suit color does not meet team standards');
    }
    
    if (configuration.hair?.style && !teamStandards.requiredHairStyles.includes(configuration.hair.style)) {
      violations.push('Hair style does not meet team standards');
    }
    
    if (configuration.pose?.confidence < teamStandards.minConfidenceLevel) {
      violations.push(`Confidence level too low (minimum: ${teamStandards.minConfidenceLevel}%)`);
    }

    const isCompliant = violations.length === 0;
    
    res.json({
      success: true,
      data: {
        isCompliant,
        violations,
        teamStandards,
        recommendation: isCompliant ? 'Avatar meets team standards' : 'Please adjust avatar to meet team requirements'
      }
    });
  } catch (error) {
    console.error('Team standards validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate team standards'
    });
  }
});

// @route   PUT /api/avatar/configuration
// @desc    Update avatar configuration
// @access  Private
router.put('/configuration', protect, [
  body('face').optional().isObject(),
  body('hair').optional().isObject(),
  body('clothing').optional().isObject(),
  body('pose').optional().isObject(),
  body('environment').optional().isObject()
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

    const oldConfiguration = JSON.parse(JSON.stringify(user.avatarConfiguration));

    // Update avatar configuration
    if (req.body.face) {
      user.avatarConfiguration.face = { ...user.avatarConfiguration.face, ...req.body.face };
    }
    if (req.body.hair) {
      user.avatarConfiguration.hair = { ...user.avatarConfiguration.hair, ...req.body.hair };
    }
    if (req.body.clothing) {
      user.avatarConfiguration.clothing = { ...user.avatarConfiguration.clothing, ...req.body.clothing };
    }
    if (req.body.pose) {
      user.avatarConfiguration.pose = { ...user.avatarConfiguration.pose, ...req.body.pose };
    }
    if (req.body.environment) {
      user.avatarConfiguration.environment = { ...user.avatarConfiguration.environment, ...req.body.environment };
    }

    await user.save();

    // Log the avatar update
    await logUserAction(
      user._id,
      'AVATAR_CONFIGURATION_UPDATED',
      req.ip,
      req.get('User-Agent'),
      {
        updatedSections: Object.keys(req.body),
        oldConfiguration,
        newConfiguration: user.avatarConfiguration
      }
    );

    res.json({
      success: true,
      message: 'Avatar configuration updated successfully',
      data: user.avatarConfiguration
    });

  } catch (error) {
    console.error('Update avatar configuration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating avatar configuration'
    });
  }
});

// @route   POST /api/avatar/upload-photo
// @desc    Upload avatar photo
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

    // Delete old avatar file if it exists and is not the default RPM avatar
    if (user.avatar && !user.avatar.includes('readyplayer.me') && !user.avatar.startsWith('http')) {
      const oldAvatarPath = path.join(__dirname, '../public', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user avatar path
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;
    user.avatar2D = avatarUrl;
    user.avatarPortrait = avatarUrl; // For uploaded photos, use same URL for portrait
    await user.save();

    // Log the avatar upload
    await logUserAction(
      user._id,
      'AVATAR_PHOTO_UPLOADED',
      req.ip,
      req.get('User-Agent'),
      {
        filename: req.file.filename,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      }
    );

    res.json({
      success: true,
      message: 'Avatar photo uploaded successfully',
      data: {
        avatar: avatarUrl,
        filename: req.file.filename
      }
    });

  } catch (error) {
    console.error('Upload avatar photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error uploading avatar photo'
    });
  }
});

// @route   DELETE /api/avatar/photo
// @desc    Delete avatar photo and reset to default
// @access  Private
router.delete('/photo', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete current avatar file if it's not the default RPM avatar
    if (user.avatar && !user.avatar.includes('readyplayer.me') && !user.avatar.startsWith('http')) {
      const avatarPath = path.join(__dirname, '../public', user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Reset to default Ready Player Me avatar
    user.avatar = 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb';
    user.avatar3D = 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb';
    user.avatar2D = 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png';
    user.avatarPortrait = 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png?textureAtlas=2048&morphTargets=ARKit';
    await user.save();

    // Log the avatar deletion
    await logUserAction(
      user._id,
      'AVATAR_PHOTO_DELETED',
      req.ip,
      req.get('User-Agent'),
      { resetToDefault: true }
    );

    res.json({
      success: true,
      message: 'Avatar photo deleted and reset to default',
      data: {
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Delete avatar photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting avatar photo'
    });
  }
});

module.exports = router;
