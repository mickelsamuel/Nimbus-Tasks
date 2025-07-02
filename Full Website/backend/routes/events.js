const express = require('express');
const router = express.Router();
const { Event } = require('../models');
const { protect } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// Validation middleware
const validateEventData = [
  body('title').notEmpty().trim().isLength({ min: 3, max: 200 }),
  body('description').notEmpty().trim().isLength({ min: 10, max: 1000 }),
  body('category').isIn(['training', 'competition', 'team', 'special', 'certification']),
  body('startDate').isISO8601(),
  body('endDate').isISO8601().custom((value, { req }) => {
    return new Date(value) > new Date(req.body.startDate);
  }),
  body('maxParticipants').isInt({ min: 1, max: 10000 }),
  body('rewards.coins').isInt({ min: 0 }),
  body('rewards.experience').isInt({ min: 0 }),
  body('rewards.badges').isArray()
];

// Get all events with filtering
router.get('/', async (req, res) => {
  try {
    const {
      status,
      category,
      search,
      page = 1,
      limit = 12,
      userId
    } = req.query;

    const filter = {};
    
    if (status) {filter.status = status;}
    if (category) {filter.category = category;}
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (userId) {
      filter.$or = [
        { 'participants.userId': userId },
        { organizerId: userId }
      ];
    }

    const skip = (page - 1) * limit;

    const events = await Event.find(filter)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('leaderboard.user', 'firstName lastName avatar')
      .lean();

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
});

// Get event stats
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const liveEvents = await Event.countDocuments({ status: 'live' });
    
    const activeParticipants = await Event.aggregate([
      { $match: { status: 'live' } },
      { $group: { _id: null, total: { $sum: '$participantCount' } } }
    ]);

    const todayChampionships = await Event.countDocuments({
      category: 'competition',
      startDate: { $gte: startOfDay, $lte: endOfDay }
    });

    res.json({
      success: true,
      liveEvents,
      activeParticipants: activeParticipants[0]?.total || 0,
      todayChampionships
    });
  } catch (error) {
    console.error('Error fetching event stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event stats',
      error: error.message
    });
  }
});

// Get event by ID
router.get('/:id', param('id').isMongoId(), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('participants.user', 'firstName lastName avatar email')
      .populate('leaderboard.user', 'firstName lastName avatar')
      .lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
});

// Create new event (admin/manager only)
router.post('/', protect, ...validateEventData, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const eventData = {
      ...req.body,
      organizerId: req.user.id,
      createdBy: req.user.id,
      participantCount: 0,
      participants: []
    };

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
});

// Update event
router.put('/:id', protect, param('id').isMongoId(), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is organizer
    if (event.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
});

// Delete event
router.delete('/:id', protect, param('id').isMongoId(), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is organizer or admin
    if (event.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await event.remove();

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
});

// Register for event
router.post('/:id/register', protect, param('id').isMongoId(), async (req, res) => {
  try {
    const result = await Event.registerUser(req.params.id, req.user.id, req.body.teamId);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: 'Successfully registered for event'
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for event',
      error: error.message
    });
  }
});

// Cancel registration
router.delete('/:id/register/:userId', protect, param('id').isMongoId(), async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // Check if user can cancel (self or admin)
    if (userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this registration'
      });
    }

    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.participants = event.participants.filter(
      p => p.user.toString() !== userId
    );
    event.participantCount = event.participants.length;
    await event.save();

    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel registration',
      error: error.message
    });
  }
});

// Mark attendance
router.post('/:id/attendance', protect, param('id').isMongoId(), async (req, res) => {
  try {
    const result = await Event.markAttendance(req.params.id, req.user.id);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: 'Attendance marked successfully'
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message
    });
  }
});

// Submit feedback
router.post('/:id/feedback', protect, [
  param('id').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { rating, comment, suggestions } = req.body;
    const result = await Event.submitFeedback(
      req.params.id,
      req.user.id,
      { rating, comment, suggestions }
    );
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
});

// Get event leaderboard
router.get('/:id/leaderboard', param('id').isMongoId(), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .select('leaderboard')
      .populate('leaderboard.user', 'firstName lastName avatar')
      .lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      leaderboard: event.leaderboard || []
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
});

// Get user's events
router.get('/user/:userId/events', param('userId').isMongoId(), async (req, res) => {
  try {
    const events = await Event.find({
      'participants.user': req.params.userId
    })
    .sort({ startDate: -1 })
    .lean();

    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user events',
      error: error.message
    });
  }
});

module.exports = router;
