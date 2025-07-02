const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  
  // Event Classification
  type: {
    type: String,
    required: [true, 'Event type is required'],
    enum: [
      'webinar',
      'workshop',
      'conference',
      'networking',
      'training',
      'social',
      'competition',
      'hackathon',
      'lunch_and_learn',
      'panel_discussion',
      'product_launch',
      'town_hall'
    ]
  },
  category: {
    type: String,
    enum: [
      'Professional Development',
      'Banking Knowledge',
      'Technology',
      'Leadership',
      'Customer Service',
      'Compliance',
      'Team Building',
      'Innovation',
      'Diversity & Inclusion',
      'Wellness'
    ]
  },
  tags: [String],
  
  // Scheduling
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  timezone: {
    type: String,
    default: 'America/Toronto'
  },
  duration: {
    type: Number, // Duration in minutes
    required: [true, 'Duration is required']
  },
  
  // Location & Format
  format: {
    type: String,
    required: [true, 'Event format is required'],
    enum: ['virtual', 'in_person', 'hybrid']
  },
  location: {
    venue: String,
    address: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: { type: String, default: 'Canada' }
    },
    room: String,
    floor: String,
    building: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  virtualDetails: {
    platform: { type: String, enum: ['zoom', 'teams', 'webex', 'other'] },
    meetingLink: String,
    meetingId: String,
    password: String,
    dialInNumber: String,
    accessInstructions: String
  },
  
  // Organizer & Speakers
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer is required']
  },
  coOrganizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  speakers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String, // For external speakers
    title: String,
    bio: String,
    company: String,
    avatar: String,
    topic: String,
    sessionTime: {
      start: Date,
      end: Date
    }
  }],
  
  // Registration & Capacity
  registration: {
    required: { type: Boolean, default: true },
    deadline: Date,
    capacity: {
      total: Number,
      waitlist: { type: Number, default: 0 }
    },
    current: {
      registered: { type: Number, default: 0 },
      attended: { type: Number, default: 0 },
      waitlisted: { type: Number, default: 0 }
    },
    restrictions: {
      departments: [String],
      roles: [{ type: String, enum: ['employee', 'manager', 'admin'] }],
      levels: [String],
      inviteOnly: { type: Boolean, default: false }
    }
  },
  
  // Participants
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled', 'no_show', 'waitlisted'],
      default: 'registered'
    },
    registeredAt: { type: Date, default: Date.now },
    attendedAt: Date,
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      submittedAt: Date
    },
    certificates: [{
      type: String,
      issuedAt: { type: Date, default: Date.now },
      certificateId: String
    }]
  }],
  
  // Content & Materials
  agenda: [{
    time: String,
    title: String,
    description: String,
    speaker: String,
    duration: Number, // in minutes
    type: { type: String, enum: ['presentation', 'break', 'discussion', 'networking', 'qa'] }
  }],
  materials: [{
    name: String,
    description: String,
    type: { type: String, enum: ['presentation', 'document', 'video', 'link', 'resource'] },
    url: String,
    size: Number, // file size in bytes
    uploadedAt: { type: Date, default: Date.now },
    availableAt: { type: String, enum: ['before', 'during', 'after'], default: 'during' }
  }],
  
  // Learning & Development
  learningObjectives: [String],
  prerequisites: [String],
  skillsGained: [String],
  certificationOffered: {
    type: Boolean,
    default: false
  },
  certificateTemplate: String,
  cpeCredits: Number, // Continuing Professional Education credits
  
  // Gamification & Rewards
  rewards: {
    points: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    badge: String,
    certificate: String,
    specialReward: String
  },
  
  // Visual & Branding
  images: {
    banner: String,
    thumbnail: String,
    gallery: [String]
  },
  branding: {
    color: { type: String, default: '#1E40AF' },
    logo: String,
    sponsor: String
  },
  
  // Communication
  announcements: [{
    title: String,
    message: String,
    type: { type: String, enum: ['info', 'warning', 'reminder', 'update'] },
    sentAt: { type: Date, default: Date.now },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  reminders: [{
    type: { type: String, enum: ['registration_deadline', 'event_starting', 'follow_up'] },
    scheduledFor: Date,
    message: String,
    sent: { type: Boolean, default: false }
  }],
  
  // Analytics & Feedback
  analytics: {
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    registrationRate: { type: Number, default: 0 },
    attendanceRate: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
    npsScore: { type: Number, default: 0 }, // Net Promoter Score
    averageRating: { type: Number, default: 0 }
  },
  feedback: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    anonymous: { type: Boolean, default: false },
    questions: [{
      question: String,
      answer: String,
      type: { type: String, enum: ['text', 'rating', 'choice'] }
    }],
    submittedAt: { type: Date, default: Date.now }
  }],
  
  // Recurring Events
  recurring: {
    isRecurring: { type: Boolean, default: false },
    pattern: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
    interval: Number, // Every N periods
    endDate: Date,
    exceptions: [Date], // Dates to skip
    parentEventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
  },
  
  // Status & Visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'department', 'invitation_only'],
    default: 'public'
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  
  // Language & Localization
  language: {
    type: String,
    enum: ['en', 'fr', 'both'],
    default: 'both'
  },
  translations: {
    fr: {
      title: String,
      description: String,
      shortDescription: String,
      learningObjectives: [String]
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ type: 1, category: 1 });
eventSchema.index({ status: 1, visibility: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ 'participants.userId': 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ title: 'text', description: 'text' });

// Virtual for formatted duration
eventSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
});

// Virtual for registration status
eventSchema.virtual('registrationStatus').get(function() {
  const now = new Date();
  const registrationDeadline = this.registration.deadline || this.startDate;
  
  if (now > this.endDate) {return 'closed';}
  if (now > registrationDeadline) {return 'deadline_passed';}
  if (this.registration.current.registered >= this.registration.capacity.total) {return 'full';}
  return 'open';
});

// Virtual for attendance rate
eventSchema.virtual('attendanceRate').get(function() {
  if (this.registration.current.registered === 0) {return 0;}
  return Math.round((this.registration.current.attended / this.registration.current.registered) * 100);
});

// Virtual for average rating
eventSchema.virtual('averageRating').get(function() {
  if (!this.feedback || this.feedback.length === 0) {return 0;}
  const totalRating = this.feedback.reduce((sum, f) => sum + f.rating, 0);
  return Math.round((totalRating / this.feedback.length) * 10) / 10;
});

// Pre-save middleware to validate dates
eventSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  
  if (this.registration.deadline && this.registration.deadline > this.startDate) {
    return next(new Error('Registration deadline must be before event start'));
  }
  
  // Calculate duration if not provided
  if (!this.duration) {
    this.duration = Math.round((this.endDate - this.startDate) / (1000 * 60)); // in minutes
  }
  
  // Update analytics
  this.analytics.registrationRate = this.registration.capacity.total > 0 
    ? Math.round((this.registration.current.registered / this.registration.capacity.total) * 100)
    : 0;
    
  this.analytics.attendanceRate = this.attendanceRate;
  this.analytics.averageRating = this.averageRating;
  
  next();
});

// Method to register user
eventSchema.methods.registerUser = function(userId) {
  // Check if registration is open
  if (this.registrationStatus !== 'open') {
    if (this.registrationStatus === 'full') {
      // Add to waitlist if possible
      if (this.registration.current.waitlisted < this.registration.capacity.waitlist) {
        this.participants.push({
          userId,
          status: 'waitlisted',
          registeredAt: new Date()
        });
        this.registration.current.waitlisted += 1;
        return { success: true, waitlisted: true };
      }
      throw new Error('Event is full and waitlist is also full');
    }
    throw new Error('Registration is closed');
  }
  
  // Check if user is already registered
  const existingParticipant = this.participants.find(p => p.userId.equals(userId));
  if (existingParticipant) {
    throw new Error('User is already registered for this event');
  }
  
  // Register user
  this.participants.push({
    userId,
    status: 'registered',
    registeredAt: new Date()
  });
  
  this.registration.current.registered += 1;
  
  return this.save().then(() => ({ success: true, waitlisted: false }));
};

// Method to mark attendance
eventSchema.methods.markAttendance = function(userId) {
  const participant = this.participants.find(p => p.userId.equals(userId));
  if (!participant) {
    throw new Error('User is not registered for this event');
  }
  
  if (participant.status === 'attended') {
    throw new Error('User attendance already marked');
  }
  
  participant.status = 'attended';
  participant.attendedAt = new Date();
  
  // Update counters
  if (participant.status !== 'attended') {
    this.registration.current.attended += 1;
  }
  
  return this.save();
};

// Method to cancel registration
eventSchema.methods.cancelRegistration = function(userId) {
  const participantIndex = this.participants.findIndex(p => p.userId.equals(userId));
  if (participantIndex === -1) {
    throw new Error('User is not registered for this event');
  }
  
  const participant = this.participants[participantIndex];
  
  // Update counters
  if (participant.status === 'registered') {
    this.registration.current.registered -= 1;
  } else if (participant.status === 'waitlisted') {
    this.registration.current.waitlisted -= 1;
  }
  
  // Remove participant
  this.participants.splice(participantIndex, 1);
  
  // Move waitlisted user to registered if space available
  if (participant.status === 'registered') {
    const waitlistedParticipant = this.participants.find(p => p.status === 'waitlisted');
    if (waitlistedParticipant) {
      waitlistedParticipant.status = 'registered';
      this.registration.current.registered += 1;
      this.registration.current.waitlisted -= 1;
    }
  }
  
  return this.save();
};

// Method to add feedback
eventSchema.methods.addFeedback = function(userId, rating, comment, questions = []) {
  // Check if user attended the event
  const participant = this.participants.find(p => p.userId.equals(userId));
  if (!participant || participant.status !== 'attended') {
    throw new Error('Only attendees can provide feedback');
  }
  
  // Remove existing feedback from same user
  this.feedback = this.feedback.filter(f => !f.userId.equals(userId));
  
  // Add new feedback
  this.feedback.push({
    userId,
    rating,
    comment,
    questions,
    submittedAt: new Date()
  });
  
  // Update participant feedback
  participant.feedback = {
    rating,
    comment,
    submittedAt: new Date()
  };
  
  return this.save();
};

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function(limit = 10) {
  const now = new Date();
  return this.find({
    startDate: { $gte: now },
    status: 'published',
    isActive: true
  })
  .sort({ startDate: 1 })
  .limit(limit);
};

// Static method to find events by date range
eventSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    $or: [
      { startDate: { $gte: startDate, $lte: endDate } },
      { endDate: { $gte: startDate, $lte: endDate } },
      { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
    ],
    status: 'published',
    isActive: true
  }).sort({ startDate: 1 });
};

// Static method to search events
eventSchema.statics.searchEvents = function(query, options = {}) {
  const {
    type,
    category,
    format,
    language = 'en',
    sortBy = 'date'
  } = options;
  
  const searchQuery = {
    status: 'published',
    isActive: true
  };
  
  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  // Filters
  if (type) {searchQuery.type = type;}
  if (category) {searchQuery.category = category;}
  if (format) {searchQuery.format = format;}
  
  // Language filter
  if (language === 'fr') {
    searchQuery['translations.fr.title'] = { $exists: true };
  }
  
  // Sorting
  let sortOptions = {};
  switch (sortBy) {
    case 'date':
      sortOptions = { startDate: 1 };
      break;
    case 'popularity':
      sortOptions = { 'registration.current.registered': -1 };
      break;
    case 'rating':
      sortOptions = { 'analytics.averageRating': -1 };
      break;
    case 'newest':
      sortOptions = { createdAt: -1 };
      break;
    default:
      sortOptions = { startDate: 1 };
  }
  
  return this.find(searchQuery).sort(sortOptions);
};

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

module.exports = Event;