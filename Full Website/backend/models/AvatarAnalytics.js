const mongoose = require('mongoose');

const avatarAnalyticsSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Avatar usage tracking
  avatarUsage: {
    totalCreated: { type: Number, default: 0 },
    totalModified: { type: Number, default: 0 },
    totalShared: { type: Number, default: 0 },
    totalExported: { type: Number, default: 0 },
    averageCreationTime: { type: Number, default: 0 }, // in seconds
    lastAvatarUpdate: Date
  },
  
  // Feature usage
  featureUsage: {
    faceCustomizations: { type: Number, default: 0 },
    hairCustomizations: { type: Number, default: 0 },
    clothingCustomizations: { type: Number, default: 0 },
    poseCustomizations: { type: Number, default: 0 },
    environmentCustomizations: { type: Number, default: 0 },
    presetUsage: {
      executive: { type: Number, default: 0 },
      bankingProfessional: { type: Number, default: 0 },
      creativeProfessional: { type: Number, default: 0 },
      leadershipTeam: { type: Number, default: 0 }
    }
  },
  
  // Compliance tracking
  complianceHistory: [{
    checkDate: { type: Date, default: Date.now },
    bankingStandardsScore: Number,
    professionalAppearanceScore: Number,
    accessibilityScore: Number,
    overallScore: Number,
    passed: Boolean,
    issues: [String]
  }],
  
  // Popular configurations
  mostUsedFeatures: {
    faceShape: String,
    skinTone: String,
    hairStyle: String,
    hairColor: String,
    suit: String,
    pose: String,
    background: String
  },
  
  // Time-based analytics
  dailyUsage: [{
    date: { type: Date, required: true },
    sessionDuration: Number, // in seconds
    actionsPerformed: Number,
    featuresUsed: [String]
  }],
  
  // Performance metrics
  performance: {
    averageLoadTime: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
    successfulSaves: { type: Number, default: 0 },
    failedSaves: { type: Number, default: 0 }
  },
  
  // Social features
  social: {
    avatarViews: { type: Number, default: 0 },
    avatarLikes: { type: Number, default: 0 },
    teamAvatarComparisons: { type: Number, default: 0 },
    collaborativeSessions: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
avatarAnalyticsSchema.index({ userId: 1 });
avatarAnalyticsSchema.index({ 'dailyUsage.date': -1 });
avatarAnalyticsSchema.index({ createdAt: -1 });

// Virtual for compliance average
avatarAnalyticsSchema.virtual('averageComplianceScore').get(function() {
  if (!this.complianceHistory || this.complianceHistory.length === 0) {return 0;}
  
  const total = this.complianceHistory.reduce((sum, record) => sum + (record.overallScore || 0), 0);
  return Math.round(total / this.complianceHistory.length);
});

// Virtual for total customizations
avatarAnalyticsSchema.virtual('totalCustomizations').get(function() {
  const usage = this.featureUsage;
  return (usage.faceCustomizations || 0) + 
         (usage.hairCustomizations || 0) + 
         (usage.clothingCustomizations || 0) + 
         (usage.poseCustomizations || 0) + 
         (usage.environmentCustomizations || 0);
});

// Method to record avatar creation
avatarAnalyticsSchema.methods.recordAvatarCreation = function(creationTimeSeconds) {
  this.avatarUsage.totalCreated += 1;
  this.avatarUsage.lastAvatarUpdate = new Date();
  
  // Update average creation time
  const totalCreations = this.avatarUsage.totalCreated;
  const currentAverage = this.avatarUsage.averageCreationTime || 0;
  this.avatarUsage.averageCreationTime = Math.round(
    ((currentAverage * (totalCreations - 1)) + creationTimeSeconds) / totalCreations
  );
  
  return this.save();
};

// Method to record feature usage
avatarAnalyticsSchema.methods.recordFeatureUsage = function(featureType, specificFeature = null) {
  switch (featureType) {
    case 'face':
      this.featureUsage.faceCustomizations += 1;
      break;
    case 'hair':
      this.featureUsage.hairCustomizations += 1;
      break;
    case 'clothing':
      this.featureUsage.clothingCustomizations += 1;
      break;
    case 'pose':
      this.featureUsage.poseCustomizations += 1;
      break;
    case 'environment':
      this.featureUsage.environmentCustomizations += 1;
      break;
    case 'preset':
      if (specificFeature && this.featureUsage.presetUsage[specificFeature] !== undefined) {
        this.featureUsage.presetUsage[specificFeature] += 1;
      }
      break;
  }
  
  return this.save();
};

// Method to record compliance check
avatarAnalyticsSchema.methods.recordComplianceCheck = function(complianceResult) {
  this.complianceHistory.push({
    checkDate: new Date(),
    bankingStandardsScore: complianceResult.bankingStandards?.score || 0,
    professionalAppearanceScore: complianceResult.professionalAppearance?.score || 0,
    accessibilityScore: complianceResult.accessibility?.score || 0,
    overallScore: complianceResult.overallScore || 0,
    passed: complianceResult.approved || false,
    issues: complianceResult.issues || []
  });
  
  // Keep only last 50 compliance checks to prevent unlimited growth
  if (this.complianceHistory.length > 50) {
    this.complianceHistory = this.complianceHistory.slice(-50);
  }
  
  return this.save();
};

// Method to record daily usage
avatarAnalyticsSchema.methods.recordDailyUsage = function(sessionDuration, actionsPerformed, featuresUsed) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find or create today's usage record
  const todayUsage = this.dailyUsage.find(usage => 
    usage.date.getTime() === today.getTime()
  );
  
  if (todayUsage) {
    todayUsage.sessionDuration += sessionDuration;
    todayUsage.actionsPerformed += actionsPerformed;
    // Merge unique features
    const uniqueFeatures = new Set([...todayUsage.featuresUsed, ...featuresUsed]);
    todayUsage.featuresUsed = Array.from(uniqueFeatures);
  } else {
    this.dailyUsage.push({
      date: today,
      sessionDuration,
      actionsPerformed,
      featuresUsed
    });
  }
  
  // Keep only last 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  this.dailyUsage = this.dailyUsage.filter(usage => usage.date >= ninetyDaysAgo);
  
  return this.save();
};

// Static method to get user analytics
avatarAnalyticsSchema.statics.getUserAnalytics = function(userId) {
  return this.findOne({ userId }).populate('userId', 'firstName lastName role department');
};

// Static method to get department analytics
avatarAnalyticsSchema.statics.getDepartmentAnalytics = async function(department) {
  const User = mongoose.model('User');
  const users = await User.find({ department }).select('_id');
  const userIds = users.map(user => user._id);
  
  return this.find({ userId: { $in: userIds } })
    .populate('userId', 'firstName lastName role department');
};

// Static method to get system-wide analytics
avatarAnalyticsSchema.statics.getSystemAnalytics = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        totalAvatarsCreated: { $sum: '$avatarUsage.totalCreated' },
        totalCustomizations: { $sum: {
          $add: [
            '$featureUsage.faceCustomizations',
            '$featureUsage.hairCustomizations',
            '$featureUsage.clothingCustomizations',
            '$featureUsage.poseCustomizations',
            '$featureUsage.environmentCustomizations'
          ]
        }},
        averageComplianceScore: { $avg: {
          $avg: '$complianceHistory.overallScore'
        }}
      }
    }
  ]);
};

const AvatarAnalytics = mongoose.models.AvatarAnalytics || mongoose.model('AvatarAnalytics', avatarAnalyticsSchema);

module.exports = AvatarAnalytics;