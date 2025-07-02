const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['in-person', 'virtual', 'hybrid'],
    required: true,
    default: 'virtual'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'tentative'],
      default: 'pending'
    },
    responseTime: {
      type: Date
    },
    notes: {
      type: String,
      maxlength: 500
    }
  }],
  location: {
    type: {
      type: String,
      enum: ['in-person', 'virtual', 'hybrid'],
      required: true
    },
    venue: {
      type: String,
      trim: true
    },
    room: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    virtualLink: {
      type: String,
      trim: true
    },
    virtualPlatform: {
      type: String,
      enum: ['zoom', 'teams', 'meet', 'webex', 'other'],
      default: 'teams'
    }
  },
  agenda: [{
    item: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    duration: {
      type: Number, // in minutes
      default: 15
    },
    presenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      maxlength: 500
    }
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: 'weekly'
    },
    interval: {
      type: Number,
      default: 1 // every N weeks/months/etc
    },
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6 // 0 = Sunday, 6 = Saturday
    }],
    endDate: {
      type: Date
    },
    maxOccurrences: {
      type: Number
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'postponed'],
    default: 'scheduled'
  },
  privacy: {
    type: String,
    enum: ['public', 'private', 'team-only'],
    default: 'team-only'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  attachments: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: {
      type: Number
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    maxlength: 2000
  },
  recording: {
    isRecorded: {
      type: Boolean,
      default: false
    },
    recordingUrl: {
      type: String
    },
    duration: {
      type: Number // in seconds
    },
    transcription: {
      type: String
    }
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'push', 'sms'],
      default: 'email'
    },
    timing: {
      type: Number, // minutes before meeting
      default: 15
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: {
      type: Date
    }
  }],
  stats: {
    attendeeCount: {
      type: Number,
      default: 0
    },
    acceptedCount: {
      type: Number,
      default: 0
    },
    declinedCount: {
      type: Number,
      default: 0
    },
    tentativeCount: {
      type: Number,
      default: 0
    },
    actualAttendees: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      joinTime: Date,
      leaveTime: Date,
      duration: Number // in minutes
    }]
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
meetingSchema.index({ organizer: 1, startTime: -1 });
meetingSchema.index({ 'attendees.userId': 1, startTime: -1 });
meetingSchema.index({ startTime: 1, endTime: 1 });
meetingSchema.index({ status: 1, startTime: -1 });
meetingSchema.index({ tags: 1 });
meetingSchema.index({ isDeleted: 1, startTime: -1 });

// Virtual for duration in minutes
meetingSchema.virtual('durationMinutes').get(function() {
  if (this.startTime && this.endTime) {
    return Math.round((this.endTime - this.startTime) / (1000 * 60));
  }
  return 0;
});

// Virtual for formatted time range
meetingSchema.virtual('timeRange').get(function() {
  if (this.startTime && this.endTime) {
    const start = this.startTime.toLocaleString();
    const end = this.endTime.toLocaleString();
    return `${start} - ${end}`;
  }
  return '';
});

// Pre-save middleware to validate times and update stats
meetingSchema.pre('save', function(next) {
  // Validate that end time is after start time
  if (this.endTime <= this.startTime) {
    return next(new Error('End time must be after start time'));
  }

  // Update attendee counts
  this.stats.attendeeCount = this.attendees.length;
  this.stats.acceptedCount = this.attendees.filter(a => a.status === 'accepted').length;
  this.stats.declinedCount = this.attendees.filter(a => a.status === 'declined').length;
  this.stats.tentativeCount = this.attendees.filter(a => a.status === 'tentative').length;

  next();
});

// Instance method to add attendee
meetingSchema.methods.addAttendee = function(userId, status = 'pending') {
  const existingAttendee = this.attendees.find(a => a.userId.equals(userId));
  if (existingAttendee) {
    throw new Error('User is already an attendee');
  }

  this.attendees.push({
    userId,
    status,
    responseTime: status !== 'pending' ? new Date() : undefined
  });

  return this.save();
};

// Instance method to update attendee status
meetingSchema.methods.updateAttendeeStatus = function(userId, status) {
  const attendee = this.attendees.find(a => a.userId.equals(userId));
  if (!attendee) {
    throw new Error('User is not an attendee');
  }

  attendee.status = status;
  attendee.responseTime = new Date();

  return this.save();
};

// Instance method to remove attendee
meetingSchema.methods.removeAttendee = function(userId) {
  this.attendees = this.attendees.filter(a => !a.userId.equals(userId));
  return this.save();
};

// Static method to find meetings by date range
meetingSchema.statics.findByDateRange = function(startDate, endDate, options = {}) {
  const query = {
    isDeleted: false,
    $or: [
      { startTime: { $gte: startDate, $lte: endDate } },
      { endTime: { $gte: startDate, $lte: endDate } },
      { startTime: { $lte: startDate }, endTime: { $gte: endDate } }
    ]
  };

  if (options.organizer) {
    query.organizer = options.organizer;
  }

  if (options.attendee) {
    query['attendees.userId'] = options.attendee;
  }

  if (options.status) {
    query.status = options.status;
  }

  return this.find(query)
    .populate('organizer', 'firstName lastName email avatar')
    .populate('attendees.userId', 'firstName lastName email avatar')
    .sort({ startTime: 1 });
};

// Static method to find user's meetings
meetingSchema.statics.findUserMeetings = function(userId, options = {}) {
  const query = {
    isDeleted: false,
    $or: [
      { organizer: userId },
      { 'attendees.userId': userId }
    ]
  };

  if (options.status) {
    query.status = options.status;
  }

  if (options.startDate && options.endDate) {
    query.startTime = { $gte: options.startDate, $lte: options.endDate };
  }

  return this.find(query)
    .populate('organizer', 'firstName lastName email avatar')
    .populate('attendees.userId', 'firstName lastName email avatar')
    .sort({ startTime: 1 });
};

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;