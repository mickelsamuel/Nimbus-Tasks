const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  }
});

const WorkspaceRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['meeting', 'conference', 'phone_booth', 'collaboration', 'focus', 'lounge']
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  location: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  amenities: [{
    type: String
  }],
  equipment: [{
    name: String,
    available: {
      type: Boolean,
      default: true
    }
  }],
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'out_of_order'],
    default: 'available'
  },
  currentOccupancy: {
    type: Number,
    default: 0,
    min: 0
  },
  operatingHours: {
    start: {
      type: String,
      default: '08:00'
    },
    end: {
      type: String,
      default: '18:00'
    }
  },
  bookingRules: {
    maxBookingDuration: {
      type: Number,
      default: 480 // 8 hours in minutes
    },
    minBookingDuration: {
      type: Number,
      default: 30 // 30 minutes
    },
    advanceBookingDays: {
      type: Number,
      default: 30
    }
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  timeSlots: [TimeSlotSchema],
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
WorkspaceRoomSchema.index({ type: 1, status: 1 });
WorkspaceRoomSchema.index({ location: 1, floor: 1 });
WorkspaceRoomSchema.index({ 'timeSlots.start': 1, 'timeSlots.end': 1 });

// Virtual for utilization calculation
WorkspaceRoomSchema.virtual('utilizationRate').get(function() {
  if (!this.timeSlots || this.timeSlots.length === 0) {return 0;}
  const bookedSlots = this.timeSlots.filter(slot => slot.isBooked).length;
  return Math.round((bookedSlots / this.timeSlots.length) * 100);
});

// Methods
WorkspaceRoomSchema.methods.getAvailableSlots = function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.timeSlots.filter(slot => 
    slot.start >= startOfDay && 
    slot.end <= endOfDay && 
    !slot.isBooked
  );
};

WorkspaceRoomSchema.methods.isAvailable = function(startTime, endTime) {
  return !this.timeSlots.some(slot => 
    slot.isBooked && (
      (startTime >= slot.start && startTime < slot.end) ||
      (endTime > slot.start && endTime <= slot.end) ||
      (startTime <= slot.start && endTime >= slot.end)
    )
  );
};

// Static methods
WorkspaceRoomSchema.statics.findAvailableRooms = function(startTime, endTime, type = null) {
  const query = { isActive: true, status: 'available' };
  if (type) {query.type = type;}
  
  return this.find(query).then(rooms => 
    rooms.filter(room => room.isAvailable(startTime, endTime))
  );
};

WorkspaceRoomSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('WorkspaceRoom', WorkspaceRoomSchema);