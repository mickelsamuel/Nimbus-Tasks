const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  try {
    console.log('=== AUTH MIDDLEWARE ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found in Authorization header');
    }
    
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('Token found in cookies');
    }

    if (!token) {
      console.log('No token found - returning 401');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 20) + '...');

    // Verify token
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }
    
    console.log('JWT_SECRET present:', !!process.env.JWT_SECRET);
    console.log('Verifying token...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    
    // Fetch user from database
    console.log('Fetching user with ID:', decoded.userId);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    
    if (!user.isActive) {
      console.log('User is not active');
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    
    console.log('User found and active:', user.email);
    
    // Attach user to request object
    req.user = user;
    console.log('=== AUTH SUCCESS ===');

    next();
  } catch (error) {
    console.error('=== AUTH MIDDLEWARE ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Token present:', !!token);
    console.error('JWT_SECRET present:', !!process.env.JWT_SECRET);
    console.error('=== END AUTH ERROR ===');
    
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token && process.env.JWT_SECRET) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role || 'employee'
      };
    }
  } catch (error) {
    // Silent fail - user just won't be authenticated
    console.log('Optional auth failed:', error.message);
  }

  next();
};

// Middleware to check user flow completion status
const checkUserFlow = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  const flowStatus = {
    needsPolicyAcceptance: !req.user.hasPolicyAccepted,
    needsModeSelection: !req.user.selectedMode,
    needsAvatarSetup: !req.user.hasCompletedAvatarSetup,
    selectedMode: req.user.selectedMode
  };

  // Add flow status to request for route handlers to use
  req.userFlow = flowStatus;
  
  // If checking specific protected routes that require completed flow
  const protectedPaths = ['/dashboard', '/gamified'];
  const currentPath = req.path;
  
  if (protectedPaths.some(path => currentPath.startsWith(path))) {
    if (flowStatus.needsPolicyAcceptance) {
      return res.status(403).json({
        success: false,
        message: 'Policy acceptance required',
        redirectTo: '/policy'
      });
    }
    
    if (flowStatus.needsModeSelection) {
      return res.status(403).json({
        success: false,
        message: 'Mode selection required',
        redirectTo: '/choose-mode'
      });
    }
    
    // Note: Avatar setup is handled client-side via modal, not server redirect
    // This allows users to access dashboard/gamified while the modal shows
  }

  next();
};

module.exports = { protect, authorize, optionalAuth, checkUserFlow };