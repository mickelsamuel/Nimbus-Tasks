const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
  // Basic Information
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Space name is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Space description is required'],
    trim: true,
    maxlength: 500
  },
  icon: {
    type: String,
    required: true,
    trim: true
  },
  
  // Environment Configuration
  environment: {
    type: String,
    required: true,
    enum: [
      'premium-corporate',
      'classical-elegant', 
      'futuristic-tech',
      'cozy-modern',
      'professional-stage',
      'natural-wellness',
      'scholarly-gothic',
      'luxury-dining'
    ]
  },
  primaryColor: {
    type: String,
    default: '#E01A1A'
  },
  atmosphere: {
    type: String,
    maxlength: 200
  },
  ambientSound: {
    type: String,
    maxlength: 100
  },
  
  // Capacity Management
  maxUsers: {
    type: Number,
    required: true,
    min: 1,
    max: 500
  },
  currentUsers: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Features & Capabilities
  features: [{
    type: String,
    trim: true
  }],
  achievements: [{
    type: String,
    trim: true
  }],
  
  // Access Control
  isPublic: {
    type: Boolean,
    default: true
  },
  allowedRoles: [{
    type: String,
    enum: ['admin', 'manager', 'employee', 'guest'],
    default: ['admin', 'manager', 'employee']
  }],
  allowedDepartments: [{
    type: String,
    trim: true
  }],
  
  // Activity Tracking
  isActive: {
    type: Boolean,
    default: true
  },
  totalVisits: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number, // in minutes
    default: 0
  },
  avgSessionDuration: {
    type: Number, // in minutes
    default: 0
  },
  peakHour: {
    type: String,
    default: '14:00'
  },
  popularityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Real-time Data
  activeUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    avatar: String,
    activity: {
      type: String,
      enum: ['working', 'meeting', 'studying', 'browsing', 'collaborating', 'idle'],
      default: 'idle'
    },
    position: {
      x: Number,
      y: Number
    },
    status: {
      type: String,
      enum: ['online', 'away', 'busy'],
      default: 'online'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Settings
  settings: {
    allowVoiceChat: {
      type: Boolean,
      default: true
    },
    allowVideoChat: {
      type: Boolean,
      default: true
    },
    allowScreenShare: {
      type: Boolean,
      default: true
    },
    requirePermissionToJoin: {
      type: Boolean,
      default: false
    },
    enableNotifications: {
      type: Boolean,
      default: true
    }
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for occupancy percentage
spaceSchema.virtual('occupancyPercentage').get(function() {
  return Math.round((this.currentUsers / this.maxUsers) * 100);
});

// Virtual for occupancy status
spaceSchema.virtual('occupancyStatus').get(function() {
  const percentage = this.occupancyPercentage;
  if (percentage < 30) {return 'low';}
  if (percentage < 70) {return 'medium';}
  return 'high';
});

// Indexes for performance
// id already has unique: true which creates an index
spaceSchema.index({ environment: 1 });
spaceSchema.index({ isActive: 1, isPublic: 1 });
spaceSchema.index({ popularityScore: -1 });
spaceSchema.index({ currentUsers: -1 });

// Methods
spaceSchema.methods.addUser = function(userInfo) {
  // Remove user if already in space
  this.activeUsers = this.activeUsers.filter(user => 
    user.userId.toString() !== userInfo.userId.toString()
  );
  
  // Add user
  this.activeUsers.push({
    userId: userInfo.userId,
    name: userInfo.name,
    avatar: userInfo.avatar,
    activity: userInfo.activity || 'idle',
    position: {
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    },
    status: 'online'
  });
  
  this.currentUsers = this.activeUsers.length;
  return this.save();
};

spaceSchema.methods.removeUser = function(userId) {
  this.activeUsers = this.activeUsers.filter(user => 
    user.userId.toString() !== userId.toString()
  );
  this.currentUsers = this.activeUsers.length;
  return this.save();
};

spaceSchema.methods.updateUserActivity = function(userId, activity) {
  const user = this.activeUsers.find(user => 
    user.userId.toString() === userId.toString()
  );
  if (user) {
    user.activity = activity;
    return this.save();
  }
  return Promise.reject(new Error('User not found in space'));
};

spaceSchema.methods.canUserJoin = function(user) {
  if (!this.isActive) {return false;}
  if (this.currentUsers >= this.maxUsers) {return false;}
  if (!this.isPublic && this.requirePermissionToJoin) {return false;}
  
  // Check role permissions
  if (this.allowedRoles.length > 0 && !this.allowedRoles.includes(user.role)) {
    return false;
  }
  
  // Check department permissions
  if (this.allowedDepartments.length > 0 && !this.allowedDepartments.includes(user.department)) {
    return false;
  }
  
  return true;
};

module.exports = mongoose.model('Space', spaceSchema);