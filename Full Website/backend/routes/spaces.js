const express = require('express');
const router = express.Router();
const Space = require('../models/Space');
const { protect } = require('../middleware/auth');

// Get all available spaces
router.get('/', protect, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const spaces = await Space.find({ 
      isActive: true,
      $or: [
        { isPublic: true },
        { allowedRoles: user.role },
        { allowedDepartments: user.department }
      ]
    }).sort({ popularityScore: -1 });

    res.json({
      success: true,
      data: spaces,
      total: spaces.length
    });
  } catch (error) {
    console.error('Error fetching spaces:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching spaces',
      error: error.message 
    });
  }
});

// Get specific space details
router.get('/:spaceId', protect, async (req, res) => {
  try {
    const space = await Space.findOne({ id: req.params.spaceId })
      .populate('activeUsers.userId', 'firstName lastName avatar')
      .populate('createdBy', 'firstName lastName')
      .populate('moderators', 'firstName lastName');

    if (!space) {
      return res.status(404).json({ 
        success: false, 
        message: 'Space not found' 
      });
    }

    const user = req.user;
    if (!space.canUserJoin(user)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied to this space' 
      });
    }

    res.json({
      success: true,
      data: space
    });
  } catch (error) {
    console.error('Error fetching space details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching space details',
      error: error.message 
    });
  }
});

// Join a space
router.post('/:spaceId/join', protect, async (req, res) => {
  try {
    const space = await Space.findOne({ id: req.params.spaceId });
    if (!space) {
      return res.status(404).json({ 
        success: false, 
        message: 'Space not found' 
      });
    }

    const user = req.user;
    if (!space.canUserJoin(user)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot join this space' 
      });
    }

    // Check if user is already in the space
    const existingUser = space.activeUsers.find(activeUser => 
      activeUser.userId.toString() === req.user._id
    );

    if (existingUser) {
      return res.json({
        success: true,
        message: 'Already in space',
        data: space
      });
    }

    await space.addUser({
      userId: req.user._id,
      name: `${req.user.firstName} ${req.user.lastName}`,
      avatar: req.user.avatar || '🧑‍💼',
      activity: req.body.activity || 'exploring'
    });

    // Update space analytics
    space.totalVisits += 1;
    await space.save();

    // Emit socket event for real-time updates
    req.io?.to(`space-${space.id}`).emit('userJoined', {
      userId: req.user._id,
      name: `${req.user.firstName} ${req.user.lastName}`,
      avatar: req.user.avatar || '🧑‍💼'
    });

    res.json({
      success: true,
      message: 'Successfully joined space',
      data: space
    });
  } catch (error) {
    console.error('Error joining space:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error joining space',
      error: error.message 
    });
  }
});

// Leave a space
router.post('/:spaceId/leave', protect, async (req, res) => {
  try {
    const space = await Space.findOne({ id: req.params.spaceId });
    if (!space) {
      return res.status(404).json({ 
        success: false, 
        message: 'Space not found' 
      });
    }

    const userInSpace = space.activeUsers.find(activeUser => 
      activeUser.userId.toString() === req.user._id
    );

    if (!userInSpace) {
      return res.json({
        success: true,
        message: 'Not in space'
      });
    }

    // Calculate session duration
    const sessionDuration = Math.round((Date.now() - userInSpace.joinedAt) / 60000); // minutes
    space.totalTimeSpent += sessionDuration;
    
    // Update average session duration
    if (space.totalVisits > 0) {
      space.avgSessionDuration = Math.round(space.totalTimeSpent / space.totalVisits);
    }

    await space.removeUser(req.user._id);

    // Emit socket event for real-time updates
    req.io?.to(`space-${space.id}`).emit('userLeft', {
      userId: req.user._id
    });

    res.json({
      success: true,
      message: 'Successfully left space',
      sessionDuration
    });
  } catch (error) {
    console.error('Error leaving space:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error leaving space',
      error: error.message 
    });
  }
});

// Update user activity in space
router.put('/:spaceId/activity', protect, async (req, res) => {
  try {
    const { activity } = req.body;
    const validActivities = ['working', 'meeting', 'studying', 'browsing', 'collaborating', 'idle'];
    
    if (!activity || !validActivities.includes(activity)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid activity' 
      });
    }

    const space = await Space.findOne({ id: req.params.spaceId });
    if (!space) {
      return res.status(404).json({ 
        success: false, 
        message: 'Space not found' 
      });
    }

    await space.updateUserActivity(req.user._id, activity);

    // Emit socket event for real-time updates
    req.io?.to(`space-${space.id}`).emit('userActivityUpdated', {
      userId: req.user._id,
      activity
    });

    res.json({
      success: true,
      message: 'Activity updated successfully'
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating activity',
      error: error.message 
    });
  }
});

// Get space analytics
router.get('/:spaceId/analytics', protect, async (req, res) => {
  try {
    const space = await Space.findOne({ id: req.params.spaceId });
    if (!space) {
      return res.status(404).json({ 
        success: false, 
        message: 'Space not found' 
      });
    }

    const analytics = {
      totalVisits: space.totalVisits,
      currentUsers: space.currentUsers,
      maxUsers: space.maxUsers,
      occupancyPercentage: space.occupancyPercentage,
      occupancyStatus: space.occupancyStatus,
      avgSessionDuration: space.avgSessionDuration,
      totalTimeSpent: space.totalTimeSpent,
      peakHour: space.peakHour,
      popularityScore: space.popularityScore,
      activeUsers: space.activeUsers.map(user => ({
        name: user.name,
        avatar: user.avatar,
        activity: user.activity,
        status: user.status,
        sessionDuration: Math.round((Date.now() - user.joinedAt) / 60000)
      }))
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching analytics',
      error: error.message 
    });
  }
});

// Search spaces
router.get('/search/:query', protect, async (req, res) => {
  try {
    const { query } = req.params;
    const user = req.user;
    
    const spaces = await Space.find({
      isActive: true,
      $or: [
        { isPublic: true },
        { allowedRoles: user.role },
        { allowedDepartments: user.department }
      ],
      $and: [
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { features: { $in: [new RegExp(query, 'i')] } },
            { environment: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).sort({ popularityScore: -1 });

    res.json({
      success: true,
      data: spaces,
      total: spaces.length,
      query
    });
  } catch (error) {
    console.error('Error searching spaces:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error searching spaces',
      error: error.message 
    });
  }
});

// Admin route: Create new space
router.post('/admin/create', protect, async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    const space = new Space({
      ...req.body,
      createdBy: req.user._id
    });

    await space.save();

    res.status(201).json({
      success: true,
      message: 'Space created successfully',
      data: space
    });
  } catch (error) {
    console.error('Error creating space:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating space',
      error: error.message 
    });
  }
});

module.exports = router;