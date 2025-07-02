const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { logUserAction } = require('../utils/auditLogger');
const WorkspaceRoom = require('../models/WorkspaceRoom');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

// GET /api/workspaces/rooms - Get all available rooms
router.get('/rooms', protect, async (req, res) => {
  try {
    const { type, capacity, floor, date, startTime, endTime } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    // Filter by type
    if (type && type !== 'all') {
      query.type = type;
    }
    
    // Filter by minimum capacity
    if (capacity) {
      query.capacity = { $gte: parseInt(capacity) };
    }
    
    // Filter by floor
    if (floor) {
      query.floor = parseInt(floor);
    }
    
    let rooms = await WorkspaceRoom.find(query);
    
    // Check availability for specific time slot
    if (date && startTime && endTime) {
      const requestedStart = new Date(`${date} ${startTime}`);
      const requestedEnd = new Date(`${date} ${endTime}`);
      
      // Filter out rooms that are not available during requested time
      const availableRooms = [];
      for (const room of rooms) {
        if (room.isAvailable(requestedStart, requestedEnd)) {
          availableRooms.push(room);
        }
      }
      rooms = availableRooms;
    }

    await logUserAction(req.user._id, 'ROOMS_VIEWED', req.ip, req.get('User-Agent'), {
      filters: { type, capacity, floor, date }
    });

    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms'
    });
  }
});

// GET /api/workspaces/rooms/:id - Get specific room details
router.get('/rooms/:id', protect, async (req, res) => {
  try {
    const room = await WorkspaceRoom.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Get upcoming bookings for this room
    const upcomingBookings = await Booking.find({
      room: room._id,
      status: { $in: ['scheduled', 'in_progress'] },
      startTime: { $gte: new Date() }
    })
    .populate('user', 'firstName lastName email')
    .sort({ startTime: 1 })
    .limit(5);

    res.json({
      success: true,
      data: {
        ...room.toObject(),
        upcomingBookings
      }
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room'
    });
  }
});

// POST /api/workspaces/bookings - Create a new booking
router.post('/bookings', protect, async (req, res) => {
  try {
    const {
      roomId,
      title,
      description,
      startTime,
      endTime,
      attendees,
      type = 'meeting'
    } = req.body;

    // Validate room exists
    const room = await WorkspaceRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Parse dates
    const bookingStart = new Date(startTime);
    const bookingEnd = new Date(endTime);

    // Validate time range
    if (bookingStart >= bookingEnd) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Check if room is available
    const isAvailable = room.isAvailable(bookingStart, bookingEnd);
    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: 'Room is not available during the requested time'
      });
    }

    // Create booking
    const newBooking = new Booking({
      user: req.user._id,
      room: roomId,
      title: title || 'Meeting',
      description: description || '',
      startTime: bookingStart,
      endTime: bookingEnd,
      attendees: attendees || [],
      type,
      status: 'scheduled'
    });

    const savedBooking = await newBooking.save();
    
    // Populate user and room data for response
    await savedBooking.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'room', select: 'name type location floor' }
    ]);

    await logUserAction(req.user._id, 'WORKSPACE_BOOKED', req.ip, req.get('User-Agent'), {
      roomId: room._id,
      roomName: room.name,
      startTime: bookingStart,
      endTime: bookingEnd
    });

    res.status(201).json({
      success: true,
      data: savedBooking,
      message: 'Workspace booked successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    });
  }
});

// GET /api/workspaces/bookings - Get user's bookings
router.get('/bookings', protect, async (req, res) => {
  try {
    const { status, upcoming } = req.query;
    
    // Build query for user's bookings
    let query = { user: req.user._id };
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter for upcoming bookings only
    if (upcoming === 'true') {
      query.startTime = { $gte: new Date() };
    }

    const userBookings = await Booking.find(query)
      .populate('room', 'name type location floor capacity')
      .sort({ startTime: 1 });

    await logUserAction(req.user._id, 'BOOKINGS_VIEWED', req.ip, req.get('User-Agent'));

    res.json({
      success: true,
      data: userBookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
});

// PUT /api/workspaces/bookings/:id - Update a booking
router.put('/bookings/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('room');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or access denied'
      });
    }
    
    // Don't allow updates to past bookings
    if (new Date(booking.endTime) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update past bookings'
      });
    }

    // Update booking with new data
    Object.assign(booking, req.body);
    booking.updatedAt = new Date();
    
    const updatedBooking = await booking.save();
    await updatedBooking.populate('room', 'name type location floor');

    await logUserAction(req.user._id, 'BOOKING_UPDATED', req.ip, req.get('User-Agent'), {
      bookingId: updatedBooking._id,
      roomName: updatedBooking.room.name
    });

    res.json({
      success: true,
      data: updatedBooking,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking'
    });
  }
});

// DELETE /api/workspaces/bookings/:id - Cancel a booking
router.delete('/bookings/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('room');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or access denied'
      });
    }
    
    // Update status to cancelled instead of deleting
    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    await booking.save();

    await logUserAction(req.user._id, 'BOOKING_CANCELLED', req.ip, req.get('User-Agent'), {
      bookingId: booking._id,
      roomName: booking.room.name
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
});

// GET /api/workspaces/analytics - Get workspace utilization analytics
router.get('/analytics', protect, async (req, res) => {
  try {
    const { timeframe = 'week' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    // Get bookings in timeframe
    const timeframeBookings = await Booking.find({
      startTime: { $gte: startDate, $lte: now },
      status: { $ne: 'cancelled' }
    }).populate('room', 'name type');

    // Get all active rooms
    const rooms = await WorkspaceRoom.find({ isActive: true });

    // Calculate analytics
    const totalBookings = timeframeBookings.length;
    
    // Room utilization
    const roomUtilization = rooms.map(room => {
      const roomBookings = timeframeBookings.filter(booking => 
        booking.room._id.toString() === room._id.toString()
      );
      
      const totalHours = roomBookings.reduce((sum, booking) => {
        return sum + (new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60 * 60);
      }, 0);
      
      // Assume 8 hours per day, multiply by days in timeframe
      const days = timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : 30;
      const availableHours = days * 8;
      const utilizationRate = availableHours > 0 ? (totalHours / availableHours) * 100 : 0;
      
      return {
        roomId: room._id,
        roomName: room.name,
        bookings: roomBookings.length,
        totalHours: Math.round(totalHours * 10) / 10,
        utilizationRate: Math.round(utilizationRate * 10) / 10
      };
    });

    // Peak hours analysis
    const hourlyBookings = {};
    timeframeBookings.forEach(booking => {
      const hour = new Date(booking.startTime).getHours();
      hourlyBookings[hour] = (hourlyBookings[hour] || 0) + 1;
    });

    const peakHour = Object.keys(hourlyBookings).length > 0 
      ? Object.keys(hourlyBookings).reduce((a, b) => 
          hourlyBookings[a] > hourlyBookings[b] ? a : b, '9'
        )
      : '9';

    const analytics = {
      overview: {
        totalBookings,
        peakHour: `${peakHour}:00`,
        totalRooms: rooms.length,
        activeBookings: await Booking.countDocuments({ 
          status: 'in_progress',
          startTime: { $lte: now },
          endTime: { $gte: now }
        })
      },
      roomUtilization,
      trends: {
        hourlyDistribution: hourlyBookings
      }
    };

    await logUserAction(req.user._id, 'ANALYTICS_VIEWED', req.ip, req.get('User-Agent'), {
      timeframe
    });

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching workspace analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

module.exports = router;