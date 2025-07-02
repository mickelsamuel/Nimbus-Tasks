const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const { logUserAction } = require('../utils/auditLogger');
const router = express.Router();

// @route   GET /api/preferences
// @desc    Get user preferences
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.preferences
    });

  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving preferences'
    });
  }
});

// @route   PUT /api/preferences
// @desc    Update user preferences
// @access  Private
router.put('/', protect, [
  body('theme').optional().isIn(['light', 'dark', 'auto']),
  // Language preference removed
  
  // Accessibility preferences
  body('accessibility.fontSize').optional().isIn(['small', 'medium', 'large', 'extraLarge']),
  body('accessibility.timeFormat').optional().isIn(['12', '24']),
  body('accessibility.reducedMotion').optional().isBoolean(),
  body('accessibility.highContrast').optional().isBoolean(),
  body('accessibility.colorBlindSupport').optional().isBoolean(),
  body('accessibility.dyslexiaFriendly').optional().isBoolean(),
  body('accessibility.voiceNavigation').optional().isBoolean(),
  body('accessibility.adhdFocusMode').optional().isBoolean(),
  body('accessibility.screenReaderOptimized').optional().isBoolean(),
  body('accessibility.keyboardNavigation').optional().isIn(['standard', 'enhanced', 'simplified']),
  body('accessibility.motionSensitivity').optional().isIn(['normal', 'reduced', 'none']),
  
  // Enhanced notification preferences
  body('notifications.email').optional().isBoolean(),
  body('notifications.push').optional().isBoolean(),
  body('notifications.sms').optional().isBoolean(),
  body('notifications.inApp').optional().isBoolean(),
  body('notifications.moduleReminders').optional().isBoolean(),
  body('notifications.teamUpdates').optional().isBoolean(),
  body('notifications.friendRequests').optional().isBoolean(),
  body('notifications.achievements').optional().isBoolean(),
  body('notifications.events').optional().isBoolean(),
  body('notifications.security').optional().isBoolean(),
  
  // Notification scheduling
  body('notifications.workHours.enabled').optional().isBoolean(),
  body('notifications.workHours.start').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('notifications.workHours.end').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('notifications.workHours.weekendsEnabled').optional().isBoolean(),
  
  // Sound and delivery preferences
  body('notifications.soundEnabled').optional().isBoolean(),
  body('notifications.soundType').optional().isIn(['chime', 'bell', 'ping', 'notification']),
  body('notifications.volume').optional().isInt({ min: 0, max: 100 }),
  body('notifications.grouping').optional().isIn(['immediate', 'smart', 'priority', 'batched']),
  body('notifications.batchInterval').optional().isInt({ min: 5, max: 240 }),
  
  // Security preferences
  body('security.twoFactorEnabled').optional().isBoolean(),
  body('security.twoFactorMethod').optional().isIn(['sms', 'email', 'app']),
  body('security.securityAlerts.sms').optional().isBoolean(),
  body('security.securityAlerts.email').optional().isBoolean(),
  body('security.sessionTimeout').optional().isInt({ min: 15, max: 480 }),
  body('security.autoLogout').optional().isBoolean(),
  body('security.deviceTracking').optional().isBoolean(),
  body('security.loginNotifications').optional().isBoolean(),
  body('security.riskTolerance').optional().isIn(['low', 'medium', 'high']),
  body('security.biometrics.fingerprint').optional().isBoolean(),
  body('security.biometrics.faceRecognition').optional().isBoolean(),
  body('security.biometrics.voiceRecognition').optional().isBoolean(),
  
  // Privacy preferences
  body('privacy.profileVisibility').optional().isIn(['public', 'friends', 'private']),
  body('privacy.showStats').optional().isBoolean(),
  body('privacy.showAchievements').optional().isBoolean(),
  body('privacy.showActivity').optional().isBoolean(),
  
  // Analytics preferences
  body('analytics.enableTracking').optional().isBoolean(),
  body('analytics.shareWithTeam').optional().isBoolean(),
  body('analytics.peerComparison').optional().isBoolean(),
  body('analytics.predictiveAnalytics').optional().isBoolean(),
  body('analytics.exportEnabled').optional().isBoolean()
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

    const oldPreferences = JSON.parse(JSON.stringify(user.preferences));

    // Deep merge helper function
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) {target[key] = {};}
          deepMerge(target[key], source[key]);
        } else if (source[key] !== undefined) {
          target[key] = source[key];
        }
      }
    };

    // Update basic preferences
    if (req.body.theme !== undefined) {
      user.preferences.theme = req.body.theme;
    }
    // Language preference removed

    // Update accessibility preferences
    if (req.body.accessibility) {
      if (!user.preferences.accessibility) {user.preferences.accessibility = {};}
      deepMerge(user.preferences.accessibility, req.body.accessibility);
    }

    // Update notification preferences
    if (req.body.notifications) {
      if (!user.preferences.notifications) {user.preferences.notifications = {};}
      deepMerge(user.preferences.notifications, req.body.notifications);
    }

    // Update security preferences
    if (req.body.security) {
      if (!user.preferences.security) {user.preferences.security = {};}
      deepMerge(user.preferences.security, req.body.security);
    }

    // Update privacy preferences
    if (req.body.privacy) {
      if (!user.preferences.privacy) {user.preferences.privacy = {};}
      deepMerge(user.preferences.privacy, req.body.privacy);
    }

    // Update analytics preferences
    if (req.body.analytics) {
      if (!user.preferences.analytics) {user.preferences.analytics = {};}
      deepMerge(user.preferences.analytics, req.body.analytics);
    }

    await user.save();

    // Log the preference update
    await logUserAction(
      user._id,
      'PREFERENCES_UPDATED',
      req.ip,
      req.get('User-Agent'),
      {
        updatedFields: Object.keys(req.body),
        oldPreferences,
        newPreferences: user.preferences
      }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating preferences'
    });
  }
});

// @route   PUT /api/preferences/theme
// @desc    Update theme preference
// @access  Private
router.put('/theme', protect, [
  body('theme').isIn(['light', 'dark', 'auto']).withMessage('Theme must be light, dark, or auto')
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

    const { theme } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldTheme = user.preferences.theme;
    user.preferences.theme = theme;
    await user.save();

    // Log the theme change
    await logUserAction(
      user._id,
      'THEME_CHANGED',
      req.ip,
      req.get('User-Agent'),
      {
        oldTheme,
        newTheme: theme
      }
    );

    res.json({
      success: true,
      message: 'Theme updated successfully',
      data: {
        theme: user.preferences.theme
      }
    });

  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating theme'
    });
  }
});

// @route   PUT /api/preferences/language
// @desc    Language preference endpoint disabled
// @access  Private
router.put('/language', protect, async (req, res) => {
  res.json({
    success: true,
    message: 'Language preference is disabled - English only',
    data: {
      language: 'en'
    }
  });
});

// @route   PUT /api/preferences/notifications
// @desc    Update notification preferences
// @access  Private
router.put('/notifications', protect, [
  body('email').optional().isBoolean(),
  body('push').optional().isBoolean(),
  body('moduleReminders').optional().isBoolean(),
  body('teamUpdates').optional().isBoolean(),
  body('friendRequests').optional().isBoolean(),
  body('achievements').optional().isBoolean(),
  body('events').optional().isBoolean()
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

    const oldNotificationPreferences = { ...user.preferences.notifications };

    // Update notification preferences
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        user.preferences.notifications[key] = req.body[key];
      }
    });

    await user.save();

    // Log the notification preference change
    await logUserAction(
      user._id,
      'NOTIFICATION_PREFERENCES_UPDATED',
      req.ip,
      req.get('User-Agent'),
      {
        updatedSettings: Object.keys(req.body),
        oldPreferences: oldNotificationPreferences,
        newPreferences: user.preferences.notifications
      }
    );

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: {
        notifications: user.preferences.notifications
      }
    });

  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating notification preferences'
    });
  }
});

// @route   PUT /api/preferences/privacy
// @desc    Update privacy preferences
// @access  Private
router.put('/privacy', protect, [
  body('profileVisibility').optional().isIn(['public', 'friends', 'private']),
  body('showStats').optional().isBoolean(),
  body('showAchievements').optional().isBoolean(),
  body('showActivity').optional().isBoolean()
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

    const oldPrivacyPreferences = { ...user.preferences.privacy };

    // Update privacy preferences
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        user.preferences.privacy[key] = req.body[key];
      }
    });

    await user.save();

    // Log the privacy preference change
    await logUserAction(
      user._id,
      'PRIVACY_PREFERENCES_UPDATED',
      req.ip,
      req.get('User-Agent'),
      {
        updatedSettings: Object.keys(req.body),
        oldPreferences: oldPrivacyPreferences,
        newPreferences: user.preferences.privacy
      }
    );

    res.json({
      success: true,
      message: 'Privacy preferences updated successfully',
      data: {
        privacy: user.preferences.privacy
      }
    });

  } catch (error) {
    console.error('Update privacy preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating privacy preferences'
    });
  }
});

// @route   POST /api/preferences/reset
// @desc    Reset preferences to default
// @access  Private
router.post('/reset', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldPreferences = { ...user.preferences };

    // Reset to default preferences
    user.preferences = {
      language: 'en',
      theme: 'light',
      
      accessibility: {
        fontSize: 'medium',
        timeFormat: '12',
        reducedMotion: false,
        highContrast: false,
        colorBlindSupport: false,
        dyslexiaFriendly: false,
        voiceNavigation: false,
        adhdFocusMode: false,
        screenReaderOptimized: false,
        keyboardNavigation: 'standard',
        motionSensitivity: 'normal'
      },
      
      notifications: {
        email: true,
        push: true,
        sms: false,
        inApp: true,
        moduleReminders: true,
        teamUpdates: true,
        friendRequests: true,
        achievements: true,
        events: true,
        security: true,
        
        workHours: {
          enabled: false,
          start: '09:00',
          end: '17:00',
          weekendsEnabled: false
        },
        
        soundEnabled: true,
        soundType: 'chime',
        volume: 75,
        grouping: 'smart',
        batchInterval: 30
      },
      
      security: {
        twoFactorEnabled: false,
        twoFactorMethod: 'email',
        backupCodes: [],
        securityAlerts: {
          sms: true,
          email: true
        },
        sessionTimeout: 120,
        autoLogout: true,
        deviceTracking: true,
        loginNotifications: true,
        riskTolerance: 'medium',
        biometrics: {
          fingerprint: false,
          faceRecognition: false,
          voiceRecognition: false
        }
      },
      
      privacy: {
        profileVisibility: 'public',
        showStats: true,
        showAchievements: true,
        showActivity: true
      },
      
      analytics: {
        enableTracking: true,
        shareWithTeam: true,
        peerComparison: true,
        predictiveAnalytics: true,
        exportEnabled: true
      }
    };

    await user.save();

    // Log the preference reset
    await logUserAction(
      user._id,
      'PREFERENCES_RESET',
      req.ip,
      req.get('User-Agent'),
      {
        oldPreferences,
        newPreferences: user.preferences
      }
    );

    res.json({
      success: true,
      message: 'Preferences reset to default successfully',
      data: user.preferences
    });

  } catch (error) {
    console.error('Reset preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting preferences'
    });
  }
});

// @route   POST /api/preferences/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
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

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const bcrypt = require('bcryptjs');
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
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

// @route   GET /api/preferences/sessions
// @desc    Get user active sessions
// @access  Private
router.get('/sessions', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('activeSessions');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter active sessions and update last activity
    const activeSessions = user.activeSessions
      .filter(session => session.isActive)
      .map(session => ({
        sessionId: session.sessionId,
        deviceInfo: session.deviceInfo,
        location: session.location,
        loginTime: session.loginTime,
        lastActivity: session.lastActivity,
        isCurrent: session.sessionId === req.sessionId // Assuming sessionId is added by auth middleware
      }));

    res.json({
      success: true,
      data: activeSessions
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving sessions'
    });
  }
});

// @route   DELETE /api/preferences/sessions/:sessionId
// @desc    Terminate a specific session
// @access  Private
router.delete('/sessions/:sessionId', protect, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find and deactivate the session
    const sessionIndex = user.activeSessions.findIndex(
      session => session.sessionId === sessionId && session.isActive
    );

    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    user.activeSessions[sessionIndex].isActive = false;
    await user.save();

    // Log the session termination
    await logUserAction(
      user._id,
      'SESSION_TERMINATED',
      req.ip,
      req.get('User-Agent'),
      { terminatedSessionId: sessionId }
    );

    res.json({
      success: true,
      message: 'Session terminated successfully'
    });

  } catch (error) {
    console.error('Terminate session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error terminating session'
    });
  }
});

// @route   POST /api/preferences/sessions/terminate-all
// @desc    Terminate all sessions except current
// @access  Private
router.post('/sessions/terminate-all', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Deactivate all sessions except current
    let terminatedCount = 0;
    user.activeSessions.forEach(session => {
      if (session.sessionId !== req.sessionId && session.isActive) {
        session.isActive = false;
        terminatedCount++;
      }
    });

    await user.save();

    // Log the action
    await logUserAction(
      user._id,
      'ALL_SESSIONS_TERMINATED',
      req.ip,
      req.get('User-Agent'),
      { terminatedCount }
    );

    res.json({
      success: true,
      message: `${terminatedCount} sessions terminated successfully`
    });

  } catch (error) {
    console.error('Terminate all sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error terminating sessions'
    });
  }
});

// @route   PUT /api/preferences/emergency-contacts
// @desc    Update emergency contacts
// @access  Private
router.put('/emergency-contacts', protect, [
  body('contacts').isArray().withMessage('Contacts must be an array'),
  body('contacts.*.name').notEmpty().withMessage('Contact name is required'),
  body('contacts.*.relationship').notEmpty().withMessage('Relationship is required'),
  body('contacts.*.phone').notEmpty().withMessage('Phone number is required'),
  body('contacts.*.email').optional().isEmail().withMessage('Invalid email format')
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

    const oldContacts = [...user.emergencyContacts];
    user.emergencyContacts = req.body.contacts;
    await user.save();

    // Log the update
    await logUserAction(
      user._id,
      'EMERGENCY_CONTACTS_UPDATED',
      req.ip,
      req.get('User-Agent'),
      {
        oldContacts: oldContacts.length,
        newContacts: user.emergencyContacts.length
      }
    );

    res.json({
      success: true,
      message: 'Emergency contacts updated successfully',
      data: user.emergencyContacts
    });

  } catch (error) {
    console.error('Update emergency contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating emergency contacts'
    });
  }
});

// @route   PUT /api/preferences/certifications
// @desc    Update professional certifications
// @access  Private
router.put('/certifications', protect, [
  body('certifications').isArray().withMessage('Certifications must be an array'),
  body('certifications.*.name').notEmpty().withMessage('Certification name is required')
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

    const oldCertifications = [...user.certifications];
    user.certifications = req.body.certifications;
    await user.save();

    // Log the update
    await logUserAction(
      user._id,
      'CERTIFICATIONS_UPDATED',
      req.ip,
      req.get('User-Agent'),
      {
        oldCount: oldCertifications.length,
        newCount: user.certifications.length
      }
    );

    res.json({
      success: true,
      message: 'Certifications updated successfully',
      data: user.certifications
    });

  } catch (error) {
    console.error('Update certifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating certifications'
    });
  }
});

// @route   POST /api/preferences/2fa/enable
// @desc    Enable two-factor authentication
// @access  Private
router.post('/2fa/enable', protect, [
  body('method').isIn(['sms', 'email', 'app']).withMessage('Invalid 2FA method')
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

    const { method } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(Math.random().toString(36).substr(2, 8).toUpperCase());
    }

    // Update user 2FA settings
    user.preferences.security.twoFactorEnabled = true;
    user.preferences.security.twoFactorMethod = method;
    user.preferences.security.backupCodes = backupCodes;
    
    await user.save();

    // Log the 2FA enablement
    await logUserAction(
      user._id,
      '2FA_ENABLED',
      req.ip,
      req.get('User-Agent'),
      { method, backupCodesGenerated: backupCodes.length }
    );

    res.json({
      success: true,
      message: '2FA enabled successfully',
      data: {
        method,
        backupCodes,
        enabled: true
      }
    });

  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error enabling 2FA'
    });
  }
});

// @route   POST /api/preferences/2fa/disable
// @desc    Disable two-factor authentication
// @access  Private
router.post('/2fa/disable', protect, [
  body('password').notEmpty().withMessage('Password is required to disable 2FA')
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

    const { password } = req.body;

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Disable 2FA
    user.preferences.security.twoFactorEnabled = false;
    user.preferences.security.twoFactorMethod = 'email';
    user.preferences.security.backupCodes = [];
    
    await user.save();

    // Log the 2FA disablement
    await logUserAction(
      user._id,
      '2FA_DISABLED',
      req.ip,
      req.get('User-Agent'),
      { timestamp: new Date() }
    );

    res.json({
      success: true,
      message: '2FA disabled successfully',
      data: {
        enabled: false
      }
    });

  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error disabling 2FA'
    });
  }
});

// @route   POST /api/preferences/2fa/regenerate-codes
// @desc    Regenerate 2FA backup codes
// @access  Private
router.post('/2fa/regenerate-codes', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.preferences.security.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is not enabled'
      });
    }

    // Generate new backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(Math.random().toString(36).substr(2, 8).toUpperCase());
    }

    user.preferences.security.backupCodes = backupCodes;
    await user.save();

    // Log the backup code regeneration
    await logUserAction(
      user._id,
      '2FA_BACKUP_CODES_REGENERATED',
      req.ip,
      req.get('User-Agent'),
      { newBackupCodesCount: backupCodes.length }
    );

    res.json({
      success: true,
      message: 'Backup codes regenerated successfully',
      data: {
        backupCodes
      }
    });

  } catch (error) {
    console.error('Regenerate backup codes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error regenerating backup codes'
    });
  }
});

module.exports = router;