const mongoose = require('mongoose');

const avatarShareSchema = new mongoose.Schema({
  // Share token for secure access
  shareToken: {
    type: String,
    required: true,
    unique: true
  },
  
  // Owner of the shared avatar
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Avatar data
  avatarUrl: {
    type: String,
    required: true
  },
  
  avatarConfiguration: {
    face: {
      shape: String,
      skinTone: String,
      eyes: String,
      eyeColor: String,
      eyebrows: String,
      nose: String,
      mouth: String,
      expression: String
    },
    hair: {
      style: String,
      color: String,
      facial: String
    },
    clothing: {
      suit: String,
      shirt: String,
      tie: String,
      accessories: [String]
    },
    pose: {
      standing: String,
      gesture: String,
      confidence: Number
    },
    environment: {
      background: String,
      lighting: String,
      camera: String
    }
  },
  
  // Share settings
  includeConfiguration: {
    type: Boolean,
    default: false
  },
  
  isPublic: {
    type: Boolean,
    default: false
  },
  
  allowDownload: {
    type: Boolean,
    default: false
  },
  
  // Access tracking
  viewCount: {
    type: Number,
    default: 0
  },
  
  lastViewedAt: Date,
  
  viewers: [{
    viewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    viewedAt: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String
  }],
  
  // Expiration
  expiresAt: {
    type: Date,
    required: true
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Analytics
  analytics: {
    totalViews: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    averageViewDuration: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
avatarShareSchema.index({ ownerId: 1 });
avatarShareSchema.index({ createdAt: -1 });
avatarShareSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for share URL
avatarShareSchema.virtual('shareUrl').get(function() {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${baseUrl}/avatar/shared/${this.shareToken}`;
});

// Virtual for time remaining
avatarShareSchema.virtual('timeRemaining').get(function() {
  if (!this.expiresAt) {return null;}
  const now = new Date();
  const remaining = this.expiresAt.getTime() - now.getTime();
  return Math.max(0, remaining);
});

// Virtual for is expired
avatarShareSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

// Method to increment view count
avatarShareSchema.methods.incrementView = function(viewerId = null, ipAddress = null, userAgent = null) {
  this.analytics.totalViews += 1;
  this.viewCount += 1;
  this.lastViewedAt = new Date();
  
  // Track unique views
  if (viewerId) {
    const existingViewer = this.viewers.find(v => v.viewerId && v.viewerId.toString() === viewerId.toString());
    if (!existingViewer) {
      this.analytics.uniqueViews += 1;
      this.viewers.push({
        viewerId,
        viewedAt: new Date(),
        ipAddress,
        userAgent
      });
    }
  } else if (ipAddress) {
    const existingIPViewer = this.viewers.find(v => v.ipAddress === ipAddress);
    if (!existingIPViewer) {
      this.analytics.uniqueViews += 1;
      this.viewers.push({
        viewedAt: new Date(),
        ipAddress,
        userAgent
      });
    }
  }
  
  return this.save();
};

// Method to increment download count
avatarShareSchema.methods.incrementDownload = function() {
  this.analytics.downloadCount += 1;
  return this.save();
};

// Method to increment share count
avatarShareSchema.methods.incrementShare = function() {
  this.analytics.shareCount += 1;
  return this.save();
};

// Static method to cleanup expired shares
avatarShareSchema.statics.cleanupExpired = function() {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

// Static method to find active shares by owner
avatarShareSchema.statics.findActiveByOwner = function(ownerId) {
  return this.find({ 
    ownerId, 
    isActive: true, 
    expiresAt: { $gt: new Date() } 
  }).populate('ownerId', 'firstName lastName avatar');
};

const AvatarShare = mongoose.models.AvatarShare || mongoose.model('AvatarShare', avatarShareSchema);

module.exports = AvatarShare;