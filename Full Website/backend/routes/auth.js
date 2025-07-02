const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { protect, checkUserFlow } = require('../middleware/auth');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../utils/emailService');
const { logUserAction } = require('../utils/auditLogger');
const { analyticsTracker } = require('../utils/analytics');
const router = express.Router();

// Rate limiting for auth routes - relaxed for development
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // increased limit for development testing
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later.'
  }
});


// Generate JWT Token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await logUserAction(null, 'LOGIN_VALIDATION_FAILED', req.ip, req.get('User-Agent'), { errors: errors.array() });
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user with password field included
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      await logUserAction(null, 'LOGIN_FAILED_USER_NOT_FOUND', req.ip, req.get('User-Agent'), { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is approved
    if (!user.isApproved) {
      await logUserAction(user._id, 'LOGIN_ERROR', req.ip, req.get('User-Agent'), { email, reason: 'Account not approved' });
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. You will receive an email once approved.',
        pendingApproval: true
      });
    }

    // Check if user is active
    if (!user.isActive) {
      await logUserAction(user._id, 'LOGIN_FAILED_INACTIVE', req.ip, req.get('User-Agent'), { email });
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await logUserAction(user._id, 'LOGIN_FAILED_INVALID_PASSWORD', req.ip, req.get('User-Agent'), { email });
      
      // Track failed login analytics
      await analyticsTracker.trackAuthEvent('login_failed', user._id, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        email,
        reason: 'invalid_password'
      });
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login and login count
    user.lastLogin = new Date();
    user.loginCount += 1;
    user.lastActivity = new Date();
    user.updateStreak();
    
    // Add to account history
    user.accountHistory.push({
      action: 'LOGIN',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Log successful login
    await logUserAction(user._id, 'LOGIN_SUCCESS', req.ip, req.get('User-Agent'), { email });

    // Track analytics
    await analyticsTracker.trackAuthEvent('login_success', user._id, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      email,
      role: user.role,
      department: user.department
    });

    // Return user data without password
    const userResponse = user.toJSON();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    await logUserAction(null, 'LOGIN_ERROR', req.ip, req.get('User-Agent'), { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public (in real app, this might be admin-only)
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('department').trim().isLength({ min: 1 }).withMessage('Department is required'),
  body('managerEmail').optional().isEmail().withMessage('Manager email must be valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await logUserAction(null, 'REGISTRATION_VALIDATION_FAILED', req.ip, req.get('User-Agent'), { errors: errors.array() });
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password, firstName, lastName, department, role = 'employee', managerEmail } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await logUserAction(null, 'REGISTRATION_FAILED_USER_EXISTS', req.ip, req.get('User-Agent'), { email });
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Check if manager exists (if provided)
    let managerUser = null;
    if (managerEmail) {
      managerUser = await User.findOne({ email: managerEmail, role: { $in: ['manager', 'admin'] } });
      if (!managerUser) {
        await logUserAction(null, 'REGISTRATION_FAILED_MANAGER_NOT_FOUND', req.ip, req.get('User-Agent'), { email, managerEmail });
        return res.status(400).json({
          success: false,
          message: 'Manager with provided email not found or not authorized'
        });
      }
    }

    // Create new user (requires admin approval)
    const newUser = new User({
      email,
      password, // Will be hashed by pre-save middleware
      firstName,
      lastName,
      department,
      role,
      managerEmail,
      manager: managerUser?._id,
      isActive: false, // Inactive until approved
      isApproved: false, // Requires admin approval
      loginCount: 0, // Will be 1 after first login post-approval
      accountHistory: [{
        action: 'REGISTRATION_PENDING_APPROVAL',
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }]
    });

    await newUser.save();

    // Send notifications
    try {
      // Notify admins about new registration
      const admins = await User.find({ role: 'admin', isActive: true });
      for (const admin of admins) {
        // Create notification for admin (you'll need to implement this)
        await require('../utils/notificationService').createNotification({
          userId: admin._id,
          type: 'admin_approval_required',
          title: 'New User Registration',
          message: `${firstName} ${lastName} has registered and requires approval`,
          data: { newUserId: newUser._id }
        });
      }

      // Notify manager if assigned
      if (managerUser) {
        await require('../utils/notificationService').createNotification({
          userId: managerUser._id,
          type: 'new_employee',
          title: 'New Employee Assignment',
          message: `${firstName} ${lastName} has registered with you as their manager`,
          data: { newUserId: newUser._id }
        });
      }
    } catch (notificationError) {
      console.error('Failed to send registration notifications:', notificationError);
    }

    // Log registration pending approval
    await logUserAction(newUser._id, 'REGISTRATION_PENDING_APPROVAL', req.ip, req.get('User-Agent'), { email, managerEmail });

    // Return success without token (user can't login until approved)
    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully. Your account is pending admin approval. You will receive an email once approved.',
      pendingApproval: true,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        isApproved: false
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    await logUserAction(null, 'REGISTRATION_ERROR', req.ip, req.get('User-Agent'), { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update last activity
    user.lastActivity = new Date();
    await user.save();

    res.json({
      success: true,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Auth me error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new token
    const newToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token: newToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', passwordResetLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
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

    const { email } = req.body;

    const user = await User.findOne({ email, isActive: true });
    
    // Always return success to prevent email enumeration
    if (!user) {
      await logUserAction(null, 'PASSWORD_RESET_REQUESTED_INVALID_EMAIL', req.ip, req.get('User-Agent'), { email });
      
      // Track invalid email attempts
      await analyticsTracker.trackPasswordResetFlow('requested', email, {
        success: false,
        reason: 'invalid_email',
        ip: req.ip
      });
      
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpiry;
    await user.save();

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, user.firstName, resetToken);
      await logUserAction(user._id, 'PASSWORD_RESET_EMAIL_SENT', req.ip, req.get('User-Agent'), { email });
      
      // Track successful password reset request
      await analyticsTracker.trackPasswordResetFlow('email_sent', user.email, {
        success: true,
        userId: user._id,
        ip: req.ip
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      
      // Track email failure
      await analyticsTracker.trackPasswordResetFlow('email_failed', user.email, {
        success: false,
        reason: 'email_send_error',
        error: emailError.message,
        ip: req.ip
      });
      
      return res.status(500).json({
        success: false,
        message: 'Error sending password reset email. Please try again later.'
      });
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing password reset request'
    });
  }
});

// @route   POST /api/auth/validate-reset-token
// @desc    Validate password reset token
// @access  Public
router.post('/validate-reset-token', [
  body('token').notEmpty().withMessage('Reset token is required')
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

    const { token } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
      isActive: true
    });

    if (!user) {
      await logUserAction(null, 'PASSWORD_RESET_INVALID_TOKEN', req.ip, req.get('User-Agent'), { token: token.substring(0, 8) + '...' });
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Token is valid
    res.json({
      success: true,
      message: 'Token is valid',
      expiresAt: user.passwordResetExpires
    });

  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error validating token'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
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

    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
      isActive: true
    });

    if (!user) {
      await logUserAction(null, 'PASSWORD_RESET_INVALID_TOKEN', req.ip, req.get('User-Agent'), { token });
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = password; // Will be hashed by pre-save middleware
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    // Add to account history
    user.accountHistory.push({
      action: 'PASSWORD_RESET',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    await user.save();

    await logUserAction(user._id, 'PASSWORD_RESET_SUCCESS', req.ip, req.get('User-Agent'));

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password'
    });
  }
});

// @route   POST /api/auth/accept-policy
// @desc    Accept privacy policy
// @access  Private
router.post('/accept-policy', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.hasPolicyAccepted = true;
    user.policyAcceptedAt = new Date();
    
    // Add to account history
    user.accountHistory.push({
      action: 'POLICY_ACCEPTED',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    await user.save();

    await logUserAction(user._id, 'POLICY_ACCEPTED', req.ip, req.get('User-Agent'));

    res.json({
      success: true,
      message: 'Policy accepted successfully',
      user: {
        hasPolicyAccepted: user.hasPolicyAccepted,
        policyAcceptedAt: user.policyAcceptedAt,
        selectedMode: user.selectedMode
      }
    });

  } catch (error) {
    console.error('Policy acceptance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during policy acceptance'
    });
  }
});

// @route   POST /api/auth/select-mode
// @desc    Select user mode (gamified or standard)
// @access  Private
router.post('/select-mode', [
  protect,
  body('mode').isIn(['gamified', 'standard']).withMessage('Mode must be either gamified or standard')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mode selection',
        errors: errors.array()
      });
    }

    const { mode } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.selectedMode = mode;
    user.modeSelectedAt = new Date();
    
    // Add to account history
    user.accountHistory.push({
      action: 'MODE_SELECTED',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    await user.save();

    await logUserAction(user._id, 'MODE_SELECTED', req.ip, req.get('User-Agent'), { mode });

    res.json({
      success: true,
      message: 'Mode selected successfully',
      user: {
        selectedMode: user.selectedMode,
        modeSelectedAt: user.modeSelectedAt,
        hasPolicyAccepted: user.hasPolicyAccepted
      }
    });

  } catch (error) {
    console.error('Mode selection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during mode selection'
    });
  }
});

// @route   GET /api/auth/flow-status
// @desc    Get user flow completion status
// @access  Private
router.get('/flow-status', protect, checkUserFlow, async (req, res) => {
  try {
    res.json({
      success: true,
      flowStatus: req.userFlow
    });
  } catch (error) {
    console.error('Flow status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting flow status'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('department').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Department must be between 2 and 100 characters'),
  body('preferences.theme').optional().isIn(['light', 'dark']).withMessage('Theme must be light or dark'),
  body('preferences.language').optional().isIn(['en', 'fr']).withMessage('Language must be en or fr'),
  body('preferences.notifications').optional().isBoolean().withMessage('Notifications must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await logUserAction(
        req.user.id,
        'PROFILE_UPDATE_FAILED',
        req.ip,
        req.get('User-Agent'),
        { reason: 'Validation failed', errors: errors.array() }
      );
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const updates = req.body;

    // Check if email is being changed and if it's already taken
    if (updates.email && updates.email !== req.user.email) {
      const existingUser = await User.findOne({ 
        email: updates.email,
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        await logUserAction(
          userId,
          'PROFILE_UPDATE_FAILED',
          req.ip,
          req.get('User-Agent'),
          { reason: 'Email already exists', email: updates.email }
        );
        
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      },
      { 
        new: true, 
        runValidators: true,
        select: '-password -resetPasswordToken -resetPasswordExpire'
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log successful profile update
    await logUserAction(
      userId,
      'PROFILE_UPDATED',
      req.ip,
      req.get('User-Agent'),
      { 
        updatedFields: Object.keys(updates),
        profileData: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          department: user.department
        }
      }
    );

    // Track profile updates in analytics
    const { analyticsTracker } = require('../utils/analytics');
    analyticsTracker.trackEvent('profile_updated', {
      userId: user._id,
      userRole: user.role,
      userDepartment: user.department,
      updatedFields: Object.keys(updates),
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        stats: user.stats,
        preferences: user.preferences,
        progress: user.progress,
        streak: user.streak,
        joinedAt: user.createdAt,
        lastActive: user.lastActive,
        hasPolicyAccepted: user.hasPolicyAccepted,
        selectedMode: user.selectedMode
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    
    await logUserAction(
      req.user?.id || null,
      'PROFILE_UPDATE_ERROR',
      req.ip,
      req.get('User-Agent'),
      { error: error.message }
    );
    
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

module.exports = router;