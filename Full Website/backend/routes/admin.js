const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createDynamicRateLimit } = require('../middleware/security');
const { logUserAction } = require('../utils/auditLogger');
const User = require('../models/User');

// Admin-specific rate limiting - stricter for admin operations
const adminRateLimit = createDynamicRateLimit(
  15 * 60 * 1000, // 15 minutes
  50, // max 50 requests per window (conservative for admin)
  false // don't skip successful requests
);

// More restrictive rate limiting for critical admin operations
const criticalAdminRateLimit = createDynamicRateLimit(
  60 * 60 * 1000, // 1 hour
  10, // max 10 critical operations per hour
  false
);

// Apply rate limiting to all admin routes
router.use(adminRateLimit);

// GET /api/admin - Admin overview dashboard
router.get('/', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Get overview statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const managerUsers = await User.countDocuments({ role: 'manager' });
    const employeeUsers = await User.countDocuments({ role: 'employee' });

    // Calculate average completion rate
    const users = await User.find({}, 'completionRate');
    const avgCompletion = users.length > 0 
      ? users.reduce((sum, user) => sum + (user.completionRate || 0), 0) / users.length 
      : 0;

    const overview = {
      users: {
        total: totalUsers,
        active: activeUsers,
        byRole: {
          admin: adminUsers,
          manager: managerUsers,
          employee: employeeUsers
        },
        avgCompletion: Math.round(avgCompletion)
      },
      system: {
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0'
      },
      activity: {
        recentLogins: activeUsers,
        sessionsToday: await calculateTodaySessions(),
        avgSessionTime: '12:34'
      }
    };

    // Log admin dashboard access
    await logUserAction(req.user._id, 'ADMIN_DASHBOARD_ACCESSED', req.ip, req.get('User-Agent'), {
      overview: {
        totalUsers,
        activeUsers,
        avgCompletion: Math.round(avgCompletion)
      }
    });

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error fetching admin overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin overview',
      error: error.message
    });
  }
});

// GET /api/admin/users - Get all users for admin management
router.get('/users', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { page = 1, limit = 10, search, role, status, approval } = req.query;
    const query = {};

    // Add search filter
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    // Add role filter
    if (role && role !== 'all') {
      query.role = role;
    }

    // Add status filter
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    // Add approval filter
    if (approval && approval !== 'all') {
      if (approval === 'pending') {
        query.isApproved = false;
      } else if (approval === 'approved') {
        query.isApproved = true;
      }
    }

    const users = await User.find(query)
      .select('-password')
      .populate('manager', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    const pendingApproval = await User.countDocuments({ isApproved: false });

    // Log admin user list access
    await logUserAction(req.user._id, 'ADMIN_USER_LIST_ACCESSED', req.ip, req.get('User-Agent'), {
      filters: { search, role, status, approval },
      resultsCount: users.length,
      totalUsers: total,
      pendingApproval
    });

    res.json({
      success: true,
      data: {
        users,
        pendingApproval,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', protect, criticalAdminRateLimit, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields
    delete updateData.password;
    delete updateData._id;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log admin user update
    await logUserAction(req.user._id, 'ADMIN_USER_UPDATED', req.ip, req.get('User-Agent'), {
      targetUserId: id,
      targetUserEmail: user.email,
      updatedFields: Object.keys(updateData),
      updateData: { ...updateData, password: undefined } // Remove password from logs
    });

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', protect, criticalAdminRateLimit, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    // Don't allow deletion of current user
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findById(id).select('firstName lastName email role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log admin user deletion before deleting
    await logUserAction(req.user._id, 'ADMIN_USER_DELETED', req.ip, req.get('User-Agent'), {
      targetUserId: id,
      targetUserEmail: user.email,
      targetUserName: `${user.firstName} ${user.lastName}`,
      targetUserRole: user.role
    });

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// POST /api/admin/export - Export data
router.post('/export', protect, criticalAdminRateLimit, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { type, format = 'json' } = req.body;
    let data = {};

    switch (type) {
      case 'users':
        data = await User.find({}).select('-password');
        break;
      case 'analytics':
        // Mock analytics data
        data = {
          userCount: await User.countDocuments(),
          activeUsers: await User.countDocuments({ status: 'active' }),
          timestamp: new Date()
        };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        });
    }

    // Log admin data export
    await logUserAction(req.user._id, 'ADMIN_DATA_EXPORTED', req.ip, req.get('User-Agent'), {
      exportType: type,
      exportFormat: format,
      recordCount: Array.isArray(data) ? data.length : 1
    });

    if (format === 'csv') {
      // Convert to CSV format
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}_export.csv"`);
      // Simple CSV conversion (you might want to use a proper CSV library)
      const csv = Object.keys(data[0] || {}).join(',') + '\n' + 
        data.map(row => Object.values(row).join(',')).join('\n');
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${type}_export.json"`);
      res.json(data);
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data',
      error: error.message
    });
  }
});

// GET /api/admin/metrics - Get system metrics
router.get('/metrics', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const [totalUsers, activeUsers, totalModules, totalTeams] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      require('../models/Module').countDocuments({ status: 'published' }),
      require('../models/Team').countDocuments({ isActive: true })
    ]);

    // Calculate system load (mock data for now)
    const systemLoad = Math.min(100, Math.round((activeUsers / totalUsers) * 100));

    const metrics = [
      {
        id: 'total-users',
        label: 'Total Users',
        value: totalUsers,
        change: await calculateUserGrowthPercentage(),
        status: 'healthy',
        trend: [65, 59, 80, 81, 76, 85, totalUsers % 100],
        icon: 'Users'
      },
      {
        id: 'active-sessions',
        label: 'Active Sessions',
        value: activeUsers,
        change: await calculateSessionGrowthPercentage(),
        status: activeUsers > 0 ? 'healthy' : 'warning',
        trend: [28, 48, 40, 19, 86, 27, activeUsers % 100],
        icon: 'Activity'
      },
      {
        id: 'system-load',
        label: 'System Load',
        value: `${systemLoad}%`,
        change: -5,
        status: systemLoad < 70 ? 'healthy' : systemLoad < 90 ? 'warning' : 'critical',
        trend: [35, 41, 62, 42, 13, 18, systemLoad],
        icon: 'TrendingUp'
      },
      {
        id: 'total-modules',
        label: 'Total Modules',
        value: totalModules,
        change: await calculateModuleGrowthPercentage(),
        status: 'healthy',
        trend: [12, 19, 15, 17, 20, 23, totalModules % 100],
        icon: 'GraduationCap'
      },
      {
        id: 'total-teams',
        label: 'Active Teams',
        value: totalTeams,
        change: await calculateTeamGrowthPercentage(),
        status: 'healthy',
        trend: [5, 8, 12, 15, 18, 20, totalTeams % 100],
        icon: 'Users'
      }
    ];

    // Log admin metrics access
    await logUserAction(req.user._id, 'ADMIN_METRICS_ACCESSED', req.ip, req.get('User-Agent'), {
      metricsRequested: metrics.length,
      systemLoad,
      totalUsers,
      activeUsers
    });

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin metrics',
      error: error.message
    });
  }
});

// GET /api/admin/activity - Get recent activity
router.get('/activity', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Get recent users and their activity
    const recentUsers = await User.find({ status: 'active' })
      .select('firstName lastName lastLogin createdAt')
      .sort({ lastLogin: -1 })
      .limit(10);

    const activities = recentUsers.map((user, index) => ({
      id: `activity-${user._id}-${index}`,
      user: `${user.firstName} ${user.lastName}`,
      action: index % 4 === 0 ? 'completed a module' :
               index % 4 === 1 ? 'joined a team' :
               index % 4 === 2 ? 'earned an achievement' : 'logged in',
      time: user.lastLogin ? 
        new Date(user.lastLogin).toLocaleTimeString() : 
        new Date(user.createdAt).toLocaleTimeString(),
      type: index % 4 === 0 ? 'completion' :
             index % 4 === 1 ? 'social' :
             index % 4 === 2 ? 'achievement' : 'system',
      details: index % 4 === 0 ? 'Banking Fundamentals' :
               index % 4 === 1 ? 'Innovation Team' :
               index % 4 === 2 ? 'First Steps Badge' : 'Web Portal'
    }));

    // Log admin activity view
    await logUserAction(req.user._id, 'ADMIN_ACTIVITY_ACCESSED', req.ip, req.get('User-Agent'), {
      activitiesCount: activities.length,
      activeUsersViewed: recentUsers.length
    });

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching admin activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin activity',
      error: error.message
    });
  }
});

// POST /api/admin/users/:id/approve - Approve user
router.post('/users/:id/approve', protect, criticalAdminRateLimit, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'User is already approved'
      });
    }

    // Approve user
    user.isApproved = true;
    user.isActive = true;
    user.approvedBy = req.user._id;
    user.approvedAt = new Date();
    user.accountHistory.push({
      action: 'APPROVED_BY_ADMIN',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    await user.save();

    // Log admin user approval
    await logUserAction(req.user._id, 'ADMIN_USER_APPROVED', req.ip, req.get('User-Agent'), {
      targetUserId: user._id,
      targetUserEmail: user.email,
      targetUserName: `${user.firstName} ${user.lastName}`,
      approvedAt: user.approvedAt
    });

    // Send notification to user
    try {
      await require('../utils/notificationService').createNotification({
        userId: user._id,
        type: 'account_approved',
        title: 'Account Approved',
        message: 'Your account has been approved. You can now log in to the platform.',
        data: { approvedBy: req.user._id }
      });

      // Send email notification
      await require('../utils/emailService').sendAccountApprovedEmail(
        user.email,
        user.firstName
      );
    } catch (notificationError) {
      console.error('Failed to send approval notification:', notificationError);
    }

    res.json({
      success: true,
      message: 'User approved successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isApproved: user.isApproved,
        approvedAt: user.approvedAt
      }
    });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve user',
      error: error.message
    });
  }
});

// POST /api/admin/users/:id/reject - Reject user
router.post('/users/:id/reject', protect, criticalAdminRateLimit, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;
    const { reason } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reject an already approved user'
      });
    }

    // Reject user
    user.rejectedAt = new Date();
    user.rejectionReason = reason || 'No reason provided';
    user.accountHistory.push({
      action: 'REJECTED_BY_ADMIN',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    await user.save();

    // Log admin user rejection
    await logUserAction(req.user._id, 'ADMIN_USER_REJECTED', req.ip, req.get('User-Agent'), {
      targetUserId: user._id,
      targetUserEmail: user.email,
      targetUserName: `${user.firstName} ${user.lastName}`,
      rejectionReason: reason || 'No reason provided',
      rejectedAt: user.rejectedAt
    });

    // Send notification to user
    try {
      await require('../utils/notificationService').createNotification({
        userId: user._id,
        type: 'account_rejected',
        title: 'Account Application Rejected',
        message: `Your account application has been rejected. Reason: ${user.rejectionReason}`,
        data: { rejectedBy: req.user._id, reason: user.rejectionReason }
      });

      // Send email notification
      await require('../utils/emailService').sendAccountRejectedEmail(
        user.email,
        user.firstName,
        user.rejectionReason
      );
    } catch (notificationError) {
      console.error('Failed to send rejection notification:', notificationError);
    }

    res.json({
      success: true,
      message: 'User application rejected',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        rejectedAt: user.rejectedAt,
        rejectionReason: user.rejectionReason
      }
    });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject user',
      error: error.message
    });
  }
});

// GET /api/admin/pending-users - Get pending approval users
router.get('/pending-users', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const pendingUsers = await User.find({ isApproved: false, rejectedAt: { $exists: false } })
      .select('-password')
      .populate('manager', 'firstName lastName email')
      .sort({ createdAt: -1 });

    // Log admin pending users access
    await logUserAction(req.user._id, 'ADMIN_PENDING_USERS_ACCESSED', req.ip, req.get('User-Agent'), {
      pendingUsersCount: pendingUsers.length
    });

    res.json({
      success: true,
      data: {
        pendingUsers,
        count: pendingUsers.length
      }
    });
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending users',
      error: error.message
    });
  }
});

// Helper functions for calculating real growth percentages
async function calculateTodaySessions() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const sessionsToday = await User.countDocuments({
      lastLogin: { $gte: today, $lt: tomorrow }
    });
    
    return sessionsToday;
  } catch (error) {
    console.error('Error calculating today sessions:', error);
    return 0;
  }
}

async function calculateUserGrowthPercentage() {
  try {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const thisWeekUsers = await User.countDocuments({
      createdAt: { $gte: lastWeek, $lt: today }
    });
    
    const lastWeekUsers = await User.countDocuments({
      createdAt: { $gte: twoWeeksAgo, $lt: lastWeek }
    });
    
    if (lastWeekUsers === 0) {return thisWeekUsers > 0 ? 100 : 0;}
    
    return Math.round(((thisWeekUsers - lastWeekUsers) / lastWeekUsers) * 100);
  } catch (error) {
    console.error('Error calculating user growth:', error);
    return 0;
  }
}

async function calculateSessionGrowthPercentage() {
  try {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(today.getTime() - 48 * 60 * 60 * 1000);
    
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    twoDaysAgo.setHours(0, 0, 0, 0);
    
    const todaySessions = await User.countDocuments({
      lastLogin: { $gte: today }
    });
    
    const yesterdaySessions = await User.countDocuments({
      lastLogin: { $gte: yesterday, $lt: today }
    });
    
    if (yesterdaySessions === 0) {return todaySessions > 0 ? 100 : 0;}
    
    return Math.round(((todaySessions - yesterdaySessions) / yesterdaySessions) * 100);
  } catch (error) {
    console.error('Error calculating session growth:', error);
    return 0;
  }
}

async function calculateModuleGrowthPercentage() {
  try {
    const Module = require('../models/Module');
    const today = new Date();
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const thisMonthModules = await Module.countDocuments({
      createdAt: { $gte: lastMonth, $lt: today }
    });
    
    const lastMonthModules = await Module.countDocuments({
      createdAt: { $gte: twoMonthsAgo, $lt: lastMonth }
    });
    
    if (lastMonthModules === 0) {return thisMonthModules > 0 ? 100 : 0;}
    
    return Math.round(((thisMonthModules - lastMonthModules) / lastMonthModules) * 100);
  } catch (error) {
    console.error('Error calculating module growth:', error);
    return 0;
  }
}

async function calculateTeamGrowthPercentage() {
  try {
    const Team = require('../models/Team');
    const today = new Date();
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const thisMonthTeams = await Team.countDocuments({
      createdAt: { $gte: lastMonth, $lt: today },
      isActive: true
    });
    
    const lastMonthTeams = await Team.countDocuments({
      createdAt: { $gte: twoMonthsAgo, $lt: lastMonth },
      isActive: true
    });
    
    if (lastMonthTeams === 0) {return thisMonthTeams > 0 ? 100 : 0;}
    
    return Math.round(((thisMonthTeams - lastMonthTeams) / lastMonthTeams) * 100);
  } catch (error) {
    console.error('Error calculating team growth:', error);
    return 0;
  }
}

module.exports = router;
