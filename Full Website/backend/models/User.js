const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Don't return password by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  
  // Professional Information
  employeeId: {
    type: String
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: [
      'Customer Service',
      'IT',
      'Human Resources',
      'Finance',
      'Marketing',
      'Operations',
      'Sales',
      'Risk Management',
      'Investment Banking',
      'Retail Banking'
    ]
  },
  role: {
    type: String,
    required: true,
    enum: ['employee', 'manager', 'admin'],
    default: 'employee'
  },
  jobTitle: {
    type: String,
    default: 'Banking Professional'
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  managerEmail: String, // Email of requested manager during registration
  managerApprovalStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  managerApprovedAt: Date,
  
  // Profile Information
  avatar: {
    type: String,
    default: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb'
  },
  avatar3D: {
    type: String,
    default: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb'
  },
  avatar2D: {
    type: String,
    default: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png'
  },
  avatarPortrait: {
    type: String,
    default: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png?textureAtlas=2048&morphTargets=ARKit'
  },
  avatarConfiguration: {
    face: {
      shape: { type: String, default: 'professional' },
      skinTone: { type: String, default: 'medium' },
      eyes: { type: String, default: 'confident' },
      eyeColor: { type: String, default: 'brown' },
      eyebrows: { type: String, default: 'professional' },
      nose: { type: String, default: 'classic' },
      mouth: { type: String, default: 'friendly' },
      expression: { type: String, default: 'confident-smile' }
    },
    hair: {
      style: { type: String, default: 'executive-cut' },
      color: { type: String, default: 'dark-brown' },
      facial: { type: String, default: 'clean-shaven' }
    },
    clothing: {
      suit: { type: String, default: 'navy-executive' },
      shirt: { type: String, default: 'white-premium' },
      tie: { type: String, default: 'silk-red' },
      accessories: [{ type: String }]
    },
    pose: {
      standing: { type: String, default: 'confident-stance' },
      gesture: { type: String, default: 'professional-handshake' },
      confidence: { type: Number, default: 85 }
    },
    environment: {
      background: { type: String, default: 'office-premium' },
      lighting: { type: String, default: 'studio-professional' },
      camera: { type: String, default: 'front' }
    }
  },
  bio: {
    type: String,
    maxlength: 500
  },
  phoneNumber: String,
  location: {
    city: String,
    province: String,
    country: { type: String, default: 'Canada' }
  },
  
  // Gaming & Progress Stats
  stats: {
    totalPoints: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    xpToNextLevel: { type: Number, default: 1000 },
    streak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    modulesCompleted: { type: Number, default: 0 },
    modulesInProgress: { type: Number, default: 0 },
    achievementsUnlocked: { type: Number, default: 0 },
    totalLearningTime: { type: Number, default: 0 }, // in minutes
    weeklyLearningTime: { type: Number, default: 0 },
    rank: String
  },

  // Currency System
  currency: {
    coins: { type: Number, default: 2500 },
    tokens: { type: Number, default: 45 }
    // Removed premiumCoins as per frontend requirements
  },

  // Shop & Inventory
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopItem'
  }],
  
  // Achievements & Badges
  achievements: [{
    achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    unlockedAt: { type: Date, default: Date.now },
    progress: Number,
    tier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'] }
  }],
  
  // Learning Progress
  enrolledModules: [{
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    completedChapters: [Number],
    lastAccessedAt: Date,
    completedAt: Date,
    score: Number,
    attempts: { type: Number, default: 0 }
  }],
  
  // Manager-Employee Relationships
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignedModules: [{
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedAt: { type: Date, default: Date.now },
    dueDate: Date,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['assigned', 'in_progress', 'completed', 'overdue'], default: 'assigned' },
    notes: String
  }],

  // Module Interactions
  bookmarkedModules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  likedModules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],

  // Social Features & Online Status
  onlineStatus: {
    type: String,
    enum: ['online', 'away', 'busy', 'offline'],
    default: 'offline'
  },
  lastSeen: { type: Date, default: Date.now },
  skills: [String],
  collaborationScore: { type: Number, default: 0 },
  
  teams: [{
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    joinedAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['member', 'leader', 'co-leader'], default: 'member' }
  }],
  friends: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'blocked'], default: 'pending' },
    mutualFriends: { type: Number, default: 0 }
  }],
  
  // Enhanced Inventory & Shop System
  inventory: {
    avatars: [{
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
      name: String,
      rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'] },
      purchasedAt: Date,
      isActive: { type: Boolean, default: false }
    }],
    themes: [{
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
      name: String,
      purchasedAt: Date,
      isActive: { type: Boolean, default: false }
    }],
    titles: [{
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
      name: String,
      description: String,
      earnedAt: Date,
      isActive: { type: Boolean, default: false }
    }],
    badges: [{
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
      name: String,
      tier: String,
      earnedAt: Date,
      isActive: { type: Boolean, default: false }
    }],
    frames: [{
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
      name: String,
      rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'] },
      purchasedAt: Date,
      isActive: { type: Boolean, default: false }
    }],
    auras: [{
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
      name: String,
      color: String,
      effect: String,
      purchasedAt: Date,
      isActive: { type: Boolean, default: false }
    }],
    emotes: [{
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
      name: String,
      animation: String,
      category: String,
      purchasedAt: Date
    }],
    consumables: [{
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
      name: String,
      quantity: { type: Number, default: 1 },
      purchasedAt: Date
    }]
  },
  
  // Active Items (what user is currently displaying)
  activeItems: {
    title: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
    badge: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
    frame: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
    aura: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
    theme: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' }
  },
  
  // Preferences
  preferences: {
    language: { type: String, enum: ['en', 'fr'], default: 'en' },
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' },
    
    // Accessibility & Display
    accessibility: {
      fontSize: { type: String, enum: ['small', 'medium', 'large', 'extraLarge'], default: 'medium' },
      timeFormat: { type: String, enum: ['12', '24'], default: '12' },
      reducedMotion: { type: Boolean, default: false },
      highContrast: { type: Boolean, default: false },
      colorBlindSupport: { type: Boolean, default: false },
      dyslexiaFriendly: { type: Boolean, default: false },
      voiceNavigation: { type: Boolean, default: false },
      adhdFocusMode: { type: Boolean, default: false },
      screenReaderOptimized: { type: Boolean, default: false },
      keyboardNavigation: { type: String, enum: ['standard', 'enhanced', 'simplified'], default: 'standard' },
      motionSensitivity: { type: String, enum: ['normal', 'reduced', 'none'], default: 'normal' }
    },

    // Enhanced Notifications
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true },
      moduleReminders: { type: Boolean, default: true },
      teamUpdates: { type: Boolean, default: true },
      friendRequests: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      events: { type: Boolean, default: true },
      security: { type: Boolean, default: true },
      
      // Notification Scheduling
      workHours: {
        enabled: { type: Boolean, default: false },
        start: { type: String, default: '09:00' },
        end: { type: String, default: '17:00' },
        weekendsEnabled: { type: Boolean, default: false }
      },
      
      // Sound & Delivery
      soundEnabled: { type: Boolean, default: true },
      soundType: { type: String, enum: ['chime', 'bell', 'ping', 'notification'], default: 'chime' },
      volume: { type: Number, min: 0, max: 100, default: 75 },
      grouping: { type: String, enum: ['immediate', 'smart', 'priority', 'batched'], default: 'smart' },
      batchInterval: { type: Number, default: 30 } // minutes
    },

    // Security Settings
    security: {
      twoFactorEnabled: { type: Boolean, default: false },
      twoFactorMethod: { type: String, enum: ['sms', 'email', 'app'], default: 'email' },
      backupCodes: [{ type: String }],
      securityAlerts: {
        sms: { type: Boolean, default: true },
        email: { type: Boolean, default: true }
      },
      sessionTimeout: { type: Number, default: 120 }, // minutes
      autoLogout: { type: Boolean, default: true },
      deviceTracking: { type: Boolean, default: true },
      loginNotifications: { type: Boolean, default: true },
      riskTolerance: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
      biometrics: {
        fingerprint: { type: Boolean, default: false },
        faceRecognition: { type: Boolean, default: false },
        voiceRecognition: { type: Boolean, default: false }
      }
    },

    privacy: {
      profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
      showStats: { type: Boolean, default: true },
      showAchievements: { type: Boolean, default: true },
      showActivity: { type: Boolean, default: true }
    },

    // Analytics Preferences
    analytics: {
      enableTracking: { type: Boolean, default: true },
      shareWithTeam: { type: Boolean, default: true },
      peerComparison: { type: Boolean, default: true },
      predictiveAnalytics: { type: Boolean, default: true },
      exportEnabled: { type: Boolean, default: true }
    }
  },
  
  // Account Status
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false }, // Admin approval required
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  rejectedAt: Date,
  rejectionReason: String,
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // User Flow Status
  hasPolicyAccepted: { type: Boolean, default: false },
  policyAcceptedAt: Date,
  selectedMode: { 
    type: String, 
    enum: ['gamified', 'standard'], 
    default: null 
  },
  modeSelectedAt: Date,
  hasCompletedAvatarSetup: { type: Boolean, default: false },
  avatarSetupCompletedAt: Date,

  // Emergency Contacts
  emergencyContacts: [{
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    isPrimary: { type: Boolean, default: false }
  }],

  // Professional Information
  certifications: [{
    name: { type: String, required: true },
    issuingOrganization: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    isActive: { type: Boolean, default: true }
  }],

  // Active Sessions
  activeSessions: [{
    sessionId: { type: String, required: true },
    deviceInfo: {
      browser: String,
      os: String,
      device: String,
      userAgent: String
    },
    location: {
      ip: String,
      country: String,
      city: String,
      timezone: String
    },
    loginTime: { type: Date, default: Date.now },
    lastActivity: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  }],
  
  // Timestamps & Activity
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  lastActivity: Date,
  loginCount: { type: Number, default: 0 },
  
  // Currency Transaction History
  currencyTransactions: [{
    type: { 
      type: String, 
      enum: ['earn', 'spend', 'transfer_in', 'transfer_out', 'purchase'], 
      required: true 
    },
    coins: { type: Number, default: 0 },
    tokens: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    reason: { type: String, required: true },
    source: String, // For earning: 'module_completion', 'achievement', etc.
    item: String, // For spending: item name
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' }, // For shop purchases
    category: String, // For spending: 'avatar', 'theme', etc.
    awardedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For admin awards
    transferId: String, // For transfers
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For transfer_in
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For transfer_out
    timestamp: { type: Date, default: Date.now }
  }],

  // Audit Trail
  accountHistory: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    ip: String,
    userAgent: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ employeeId: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ department: 1 });
userSchema.index({ manager: 1 });
userSchema.index({ isActive: 1, isApproved: 1 });
userSchema.index({ managerApprovalStatus: 1 });
userSchema.index({ 'stats.level': -1 });
userSchema.index({ 'stats.totalPoints': -1 });
userSchema.index({ 'stats.xp': -1 });
userSchema.index({ 'stats.streak': -1 });
userSchema.index({ 'stats.modulesCompleted': -1 });
userSchema.index({ lastSeen: -1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ updatedAt: -1 });
userSchema.index({ onlineStatus: 1 });

// Compound indexes for complex queries
userSchema.index({ department: 1, role: 1 });
userSchema.index({ department: 1, 'stats.level': -1 });
userSchema.index({ isActive: 1, isApproved: 1, role: 1 });
userSchema.index({ manager: 1, isActive: 1 });
userSchema.index({ 'enrolledModules.moduleId': 1, 'enrolledModules.progress': 1 });
userSchema.index({ 'teams.teamId': 1, 'teams.role': 1 });
userSchema.index({ 'friends.userId': 1, 'friends.status': 1 });

// Text search index for searching users
userSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  email: 'text',
  jobTitle: 'text',
  bio: 'text',
  skills: 'text'
});

// Session management indexes
userSchema.index({ 'activeSessions.sessionId': 1 }, { sparse: true });
userSchema.index({ 'activeSessions.isActive': 1, 'activeSessions.lastActivity': -1 });

// Notification and audit indexes
userSchema.index({ 'currencyTransactions.timestamp': -1 });
userSchema.index({ 'currencyTransactions.type': 1, 'currencyTransactions.timestamp': -1 });
userSchema.index({ 'accountHistory.timestamp': -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for profile completion percentage
userSchema.virtual('profileCompletion').get(function() {
  const fields = ['email', 'firstName', 'lastName', 'department', 'avatar', 'bio', 'phoneNumber', 'location.city'];
  const completed = fields.filter(field => {
    const value = field.includes('.') 
      ? field.split('.').reduce((obj, key) => obj?.[key], this)
      : this[field];
    return value && value !== '/avatars/default.jpg';
  }).length;
  return Math.round((completed / fields.length) * 100);
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {return next();}
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate and update level based on XP
userSchema.methods.updateLevel = function() {
  const xpThresholds = [0, 1000, 2500, 5000, 8500, 13000, 20000, 30000, 45000, 65000, 90000, 120000, 160000, 210000, 270000];
  
  let newLevel = 1;
  for (let i = 0; i < xpThresholds.length; i++) {
    if (this.stats.xp >= xpThresholds[i]) {
      newLevel = i + 1;
    } else {
      break;
    }
  }
  
  this.stats.level = newLevel;
  this.stats.xpToNextLevel = xpThresholds[newLevel] || 999999;
  
  // Update rank based on level
  if (newLevel >= 15) {this.stats.rank = 'Master';}
  else if (newLevel >= 12) {this.stats.rank = 'Expert';}
  else if (newLevel >= 9) {this.stats.rank = 'Advanced';}
  else if (newLevel >= 6) {this.stats.rank = 'Intermediate';}
  else if (newLevel >= 3) {this.stats.rank = 'Beginner';}
  else {this.stats.rank = 'Novice';}
};

// Method to add XP and points
userSchema.methods.addProgress = function(xp, points) {
  this.stats.xp += xp;
  this.stats.totalPoints += points;
  this.updateLevel();
};

// Method to update streak
userSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastActivity = this.lastActivity || this.lastLogin;
  
  if (lastActivity) {
    const hoursSinceLastActivity = (now - lastActivity) / (1000 * 60 * 60);
    
    if (hoursSinceLastActivity < 48) {
      this.stats.streak += 1;
      if (this.stats.streak > this.stats.bestStreak) {
        this.stats.bestStreak = this.stats.streak;
      }
    } else {
      this.stats.streak = 1;
    }
  } else {
    this.stats.streak = 1;
  }
  
  this.lastActivity = now;
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Clean up sensitive data before sending
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.accountHistory;
  return user;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;