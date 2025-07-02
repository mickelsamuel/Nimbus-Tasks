const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { logUserAction } = require('../utils/auditLogger');
const mongoose = require('mongoose');

// GET /api/meetings - Get all meetings for the user
router.get('/', protect, async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    const options = {
      status: status || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    };

    // Remove undefined values
    Object.keys(options).forEach(key => {
      if (options[key] === undefined) {
        delete options[key];
      }
    });

    const meetings = await Meeting.findUserMeetings(req.user._id, options)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalMeetings = await Meeting.countDocuments({
      isDeleted: false,
      $or: [
        { organizer: req.user._id },
        { 'attendees.userId': req.user._id }
      ]
    });

    await logUserAction(req.user._id, 'MEETINGS_VIEWED', req.ip, req.get('User-Agent'));

    res.json({
      success: true,
      data: meetings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMeetings / parseInt(limit)),
        totalMeetings,
        hasNext: page < Math.ceil(totalMeetings / parseInt(limit)),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meetings'
    });
  }
});

// GET /api/meetings/:id - Get a specific meeting
router.get('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meeting ID'
      });
    }

    const meeting = await Meeting.findById(req.params.id)
      .populate('organizer', 'firstName lastName email avatar department')
      .populate('attendees.userId', 'firstName lastName email avatar department')
      .populate('agenda.presenter', 'firstName lastName avatar')
      .populate('attachments.uploadedBy', 'firstName lastName avatar');

    if (!meeting || meeting.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check if user has access to this meeting
    const isOrganizer = meeting.organizer._id.equals(req.user._id);
    const isAttendee = meeting.attendees.some(attendee => 
      attendee.userId._id.equals(req.user._id)
    );
    const isAdmin = req.user.role === 'admin';

    if (!isOrganizer && !isAttendee && !isAdmin && meeting.privacy !== 'public') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: meeting,
      userRole: {
        isOrganizer,
        isAttendee,
        isAdmin
      }
    });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meeting'
    });
  }
});

// POST /api/meetings - Create a new meeting
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      startTime,
      endTime,
      location,
      attendees,
      agenda,
      isRecurring,
      recurrencePattern,
      privacy,
      tags,
      reminders
    } = req.body;

    // Validate required fields
    if (!title || !startTime || !endTime || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, startTime, endTime, type'
      });
    }

    // Validate times
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Start time cannot be in the past'
      });
    }

    // Process attendees
    const processedAttendees = [];
    if (attendees && Array.isArray(attendees)) {
      for (const attendeeId of attendees) {
        if (mongoose.isValidObjectId(attendeeId)) {
          const user = await User.findById(attendeeId);
          if (user) {
            processedAttendees.push({
              userId: attendeeId,
              status: 'pending'
            });
          }
        }
      }
    }

    const meetingData = {
      title,
      description,
      type,
      startTime: start,
      endTime: end,
      organizer: req.user._id,
      attendees: processedAttendees,
      location: location || { type: type },
      agenda: agenda || [],
      isRecurring: isRecurring || false,
      recurrencePattern: isRecurring ? recurrencePattern : undefined,
      privacy: privacy || 'team-only',
      tags: tags || [],
      reminders: reminders || [{ type: 'email', timing: 15 }]
    };

    const meeting = new Meeting(meetingData);
    await meeting.save();

    // Populate the created meeting
    await meeting.populate('organizer', 'firstName lastName email avatar');
    await meeting.populate('attendees.userId', 'firstName lastName email avatar');

    await logUserAction(
      req.user._id, 
      'MEETING_CREATED', 
      req.ip, 
      req.get('User-Agent'),
      { meetingId: meeting._id, title }
    );

    res.status(201).json({
      success: true,
      data: meeting,
      message: 'Meeting created successfully'
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create meeting'
    });
  }
});

// PUT /api/meetings/:id - Update a meeting
router.put('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meeting ID'
      });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting || meeting.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check permissions
    const isOrganizer = meeting.organizer.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOrganizer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the organizer or admin can update this meeting'
      });
    }

    const {
      title,
      description,
      type,
      startTime,
      endTime,
      location,
      agenda,
      privacy,
      tags,
      status
    } = req.body;

    // Validate times if provided
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time'
        });
      }
    }

    // Update fields
    if (title !== undefined) meeting.title = title;
    if (description !== undefined) meeting.description = description;
    if (type !== undefined) meeting.type = type;
    if (startTime !== undefined) meeting.startTime = new Date(startTime);
    if (endTime !== undefined) meeting.endTime = new Date(endTime);
    if (location !== undefined) meeting.location = location;
    if (agenda !== undefined) meeting.agenda = agenda;
    if (privacy !== undefined) meeting.privacy = privacy;
    if (tags !== undefined) meeting.tags = tags;
    if (status !== undefined) meeting.status = status;

    await meeting.save();

    // Populate updated meeting
    await meeting.populate('organizer', 'firstName lastName email avatar');
    await meeting.populate('attendees.userId', 'firstName lastName email avatar');

    await logUserAction(
      req.user._id, 
      'MEETING_UPDATED', 
      req.ip, 
      req.get('User-Agent'),
      { meetingId: meeting._id, title: meeting.title }
    );

    res.json({
      success: true,
      data: meeting,
      message: 'Meeting updated successfully'
    });
  } catch (error) {
    console.error('Error updating meeting:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update meeting'
    });
  }
});

// DELETE /api/meetings/:id - Delete a meeting
router.delete('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meeting ID'
      });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting || meeting.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check permissions
    const isOrganizer = meeting.organizer.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOrganizer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the organizer or admin can delete this meeting'
      });
    }

    // Soft delete
    meeting.isDeleted = true;
    meeting.deletedAt = new Date();
    meeting.deletedBy = req.user._id;
    await meeting.save();

    await logUserAction(
      req.user._id, 
      'MEETING_DELETED', 
      req.ip, 
      req.get('User-Agent'),
      { meetingId: meeting._id, title: meeting.title }
    );

    res.json({
      success: true,
      message: 'Meeting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete meeting'
    });
  }
});

// POST /api/meetings/:id/attend - Update attendance status
router.post('/:id/attend', protect, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted', 'declined', 'tentative'

    if (!['accepted', 'declined', 'tentative'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: accepted, declined, or tentative'
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meeting ID'
      });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting || meeting.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check if user is an attendee
    const attendee = meeting.attendees.find(a => a.userId.equals(req.user._id));
    if (!attendee) {
      return res.status(403).json({
        success: false,
        message: 'You are not invited to this meeting'
      });
    }

    // Update status
    await meeting.updateAttendeeStatus(req.user._id, status);

    await logUserAction(
      req.user._id, 
      'MEETING_RESPONSE_UPDATED', 
      req.ip, 
      req.get('User-Agent'),
      { meetingId: meeting._id, status }
    );

    res.json({
      success: true,
      message: `Meeting response updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating meeting attendance:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update attendance'
    });
  }
});

// GET /api/meetings/calendar/:year/:month - Get calendar view of meetings
router.get('/calendar/:year/:month', protect, async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    
    // Validate year and month
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid year or month'
      });
    }

    // Calculate date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const meetings = await Meeting.findByDateRange(startDate, endDate, {
      attendee: req.user._id
    });

    // Group meetings by date
    const calendar = {};
    meetings.forEach(meeting => {
      const dateKey = meeting.startTime.toISOString().split('T')[0];
      if (!calendar[dateKey]) {
        calendar[dateKey] = [];
      }
      calendar[dateKey].push(meeting);
    });

    res.json({
      success: true,
      data: {
        year,
        month,
        calendar,
        totalMeetings: meetings.length
      }
    });
  } catch (error) {
    console.error('Error fetching calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calendar'
    });
  }
});

// POST /api/meetings/:id/attendees - Add attendees to meeting
router.post('/:id/attendees', protect, async (req, res) => {
  try {
    const { attendeeIds } = req.body;

    if (!Array.isArray(attendeeIds) || attendeeIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'attendeeIds must be a non-empty array'
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meeting ID'
      });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting || meeting.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check permissions
    const isOrganizer = meeting.organizer.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOrganizer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the organizer or admin can add attendees'
      });
    }

    // Add attendees
    const addedAttendees = [];
    for (const attendeeId of attendeeIds) {
      if (mongoose.isValidObjectId(attendeeId)) {
        try {
          await meeting.addAttendee(attendeeId);
          addedAttendees.push(attendeeId);
        } catch (error) {
          // Skip if already attendee
          continue;
        }
      }
    }

    await logUserAction(
      req.user._id, 
      'MEETING_ATTENDEES_ADDED', 
      req.ip, 
      req.get('User-Agent'),
      { meetingId: meeting._id, attendeesAdded: addedAttendees.length }
    );

    res.json({
      success: true,
      message: `${addedAttendees.length} attendees added successfully`
    });
  } catch (error) {
    console.error('Error adding attendees:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add attendees'
    });
  }
});

module.exports = router;