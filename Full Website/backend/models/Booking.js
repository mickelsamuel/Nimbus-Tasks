const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkspaceRoom',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    email: String,
    name: String,
    status: {
      type: String,
      enum: ['invited', 'accepted', 'declined', 'tentative'],
      default: 'invited'
    }
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['meeting', 'training', 'presentation', 'interview', 'social', 'other'],
    default: 'meeting'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrenceRule: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: {
      type: Number,
      default: 1
    },
    endDate: Date,
    daysOfWeek: [Number], // 0-6 (Sunday to Saturday)
    weekOfMonth: Number // 1-4 for monthly recurrence
  },
  parentBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  },
  equipment: [{
    name: String,
    quantity: {
      type: Number,
      default: 1
    }
  }],
  catering: {
    required: {
      type: Boolean,
      default: false
    },
    details: String,
    cost: {
      type: Number,
      default: 0
    }
  },
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkedInAt: Date,
  checkedOut: {
    type: Boolean,
    default: false
  },
  checkedOutAt: Date,
  actualAttendees: {
    type: Number,
    default: 0
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  cost: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better performance
BookingSchema.index({ user: 1, startTime: 1 });
BookingSchema.index({ room: 1, startTime: 1, endTime: 1 });
BookingSchema.index({ startTime: 1, endTime: 1, status: 1 });
BookingSchema.index({ createdAt: -1 });

// Virtual for duration in minutes
BookingSchema.virtual('duration').get(function() {
  return Math.ceil((this.endTime - this.startTime) / (1000 * 60));
});

// Virtual for checking if booking is current
BookingSchema.virtual('isCurrent').get(function() {
  const now = new Date();
  return this.startTime <= now && this.endTime > now && this.status === 'in_progress';
});

// Virtual for checking if booking is upcoming
BookingSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  return this.startTime > now && this.status === 'scheduled';
});

// Methods
BookingSchema.methods.checkIn = function() {
  this.checkedIn = true;
  this.checkedInAt = new Date();
  this.status = 'in_progress';
  return this.save();
};

BookingSchema.methods.checkOut = function(actualAttendees = null) {
  this.checkedOut = true;
  this.checkedOutAt = new Date();
  this.status = 'completed';
  if (actualAttendees !== null) {
    this.actualAttendees = actualAttendees;
  }
  return this.save();
};

BookingSchema.methods.cancel = function(reason = '') {
  this.status = 'cancelled';
  if (reason) {
    this.notes = (this.notes ? this.notes + '\n' : '') + `Cancelled: ${reason}`;
  }
  return this.save();
};

// Static methods
BookingSchema.statics.findUpcoming = function(userId, limit = 10) {
  return this.find({
    user: userId,
    startTime: { $gt: new Date() },
    status: 'scheduled'
  })
  .populate('room', 'name type location floor')
  .sort({ startTime: 1 })
  .limit(limit);
};

BookingSchema.statics.findByDateRange = function(startDate, endDate, roomId = null) {
  const query = {
    startTime: { $gte: startDate },
    endTime: { $lte: endDate },
    status: { $ne: 'cancelled' }
  };
  
  if (roomId) {
    query.room = roomId;
  }
  
  return this.find(query)
    .populate('user', 'firstName lastName email')
    .populate('room', 'name type location floor')
    .sort({ startTime: 1 });
};

BookingSchema.statics.getRoomUtilization = function(roomId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        room: mongoose.Types.ObjectId(roomId),
        startTime: { $gte: startDate },
        endTime: { $lte: endDate },
        status: { $in: ['scheduled', 'in_progress', 'completed'] }
      }
    },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalDuration: { 
          $sum: { 
            $divide: [{ $subtract: ['$endTime', '$startTime'] }, 1000 * 60] 
          }
        },
        averageAttendees: { $avg: '$actualAttendees' },
        completedBookings: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        }
      }
    }
  ]);
};

// Pre-save middleware
BookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Validate booking time
  if (this.startTime >= this.endTime) {
    next(new Error('End time must be after start time'));
    return;
  }
  
  // Validate future booking
  if (this.startTime <= new Date() && this.isNew) {
    next(new Error('Cannot book in the past'));
    return;
  }
  
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);