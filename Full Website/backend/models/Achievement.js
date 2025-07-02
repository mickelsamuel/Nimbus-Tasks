const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  
  // Visual Identity
  icon: {
    type: String,
    required: [true, 'Achievement icon is required'],
    default: 'trophy'
  },
  image: String, // Optional achievement image/badge
  color: {
    type: String,
    default: '#F59E0B' // Gold color
  },
  
  // Classification
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Learning', 
      'Social', 
      'Progress', 
      'Leadership', 
      'Completion', 
      'Streak', 
      'Competition',
      'Special Event',
      'Milestone',
      'Exploration',
      'Mastery',
      'Collaboration'
    ]
  },
  type: {
    type: String,
    required: [true, 'Achievement type is required'],
    enum: ['individual', 'team', 'global']
  },
  
  // Tiers & Progression
  tier: {
    type: String,
    required: [true, 'Tier is required'],
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'],
    default: 'common'
  },
  
  // Requirements & Criteria
  criteria: {
    type: {
      type: String,
      required: [true, 'Criteria type is required'],
      enum: [
        'modules_completed',
        'points_earned',
        'streak_days',
        'login_days',
        'social_interactions',
        'team_contributions',
        'perfect_scores',
        'completion_time',
        'help_others',
        'course_rating',
        'custom'
      ]
    },
    target: {
      type: Number,
      required: [true, 'Target value is required']
    },
    timeframe: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'all_time'],
      default: 'all_time'
    },
    specificModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    specificCategories: [String],
    customConditions: mongoose.Schema.Types.Mixed
  },
  
  // Rewards
  rewards: {
    points: {
      type: Number,
      required: [true, 'Point reward is required'],
      min: [0, 'Points cannot be negative']
    },
    xp: {
      type: Number,
      default: function() { return this.rewards.points * 2; }
    },
    coins: {
      type: Number,
      default: function() { return Math.floor(this.rewards.points / 10); }
    },
    tokens: {
      type: Number,
      default: 0
    },
    items: [{
      itemType: { type: String, enum: ['avatar', 'theme', 'title', 'badge'] },
      itemId: String,
      itemName: String
    }],
    special: {
      title: String,
      description: String,
      unlocks: [String] // Special features or content unlocked
    }
  },
  
  // Progression & Series
  series: {
    name: String, // e.g., "Module Master Series"
    order: Number, // 1, 2, 3 for bronze, silver, gold
    nextAchievement: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    previousAchievement: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }
  },
  
  // Availability & Visibility
  isActive: { type: Boolean, default: true },
  isSecret: { type: Boolean, default: false }, // Hidden until unlocked
  isLimited: { type: Boolean, default: false }, // Limited time or quantity
  availableFrom: Date,
  availableUntil: Date,
  maxUnlocks: Number, // For limited achievements
  
  // Statistics
  stats: {
    totalUnlocked: { type: Number, default: 0 },
    unlockRate: { type: Number, default: 0 }, // Percentage of users who have unlocked
    averageTimeToUnlock: { type: Number, default: 0 }, // In days
    firstUnlockedAt: Date,
    lastUnlockedAt: Date
  },
  
  // Metadata
  tags: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'extreme'],
    default: 'medium'
  },
  estimatedTimeToComplete: Number, // In hours
  
  // Localization
  translations: {
    fr: {
      title: String,
      name: String,
      description: String,
      shortDescription: String
    }
  },
  
  // Admin & Creation
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approved: { type: Boolean, default: false },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
achievementSchema.index({ category: 1, tier: 1 });
achievementSchema.index({ type: 1, isActive: 1 });
achievementSchema.index({ rarity: 1 });
achievementSchema.index({ 'criteria.type': 1 });
achievementSchema.index({ isSecret: 1, isActive: 1 });
achievementSchema.index({ 'stats.totalUnlocked': -1 });

// Virtual for completion percentage
achievementSchema.virtual('completionPercentage').get(function() {
  return this.stats.unlockRate;
});

// Virtual for rarity score (for sorting)
achievementSchema.virtual('rarityScore').get(function() {
  const rarityScores = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    mythic: 6
  };
  return rarityScores[this.rarity] || 1;
});

// Virtual for tier score (for sorting)
achievementSchema.virtual('tierScore').get(function() {
  const tierScores = {
    bronze: 1,
    silver: 2,
    gold: 3,
    platinum: 4,
    diamond: 5
  };
  return tierScores[this.tier] || 1;
});

// Method to check if user meets criteria
achievementSchema.methods.checkCriteria = function(userStats, additionalData = {}) {
  // eslint-disable-next-line no-unused-vars
  const { type, target, timeframe, specificModules, specificCategories } = this.criteria;
  
  let currentValue = 0;
  
  switch (type) {
    case 'modules_completed':
      currentValue = userStats.modulesCompleted || 0;
      break;
    case 'points_earned':
      currentValue = userStats.totalPoints || 0;
      break;
    case 'streak_days':
      currentValue = userStats.streak || 0;
      break;
    case 'login_days':
      currentValue = userStats.loginCount || 0;
      break;
    case 'social_interactions':
      currentValue = (userStats.friendsCount || 0) + (userStats.teamsCount || 0);
      break;
    case 'team_contributions':
      currentValue = userStats.teamContributions || 0;
      break;
    case 'perfect_scores':
      currentValue = userStats.perfectScores || 0;
      break;
    case 'completion_time':
      currentValue = userStats.averageCompletionTime || 0;
      break;
    case 'help_others':
      currentValue = userStats.helpGiven || 0;
      break;
    case 'course_rating':
      currentValue = userStats.averageRating || 0;
      break;
    case 'custom':
      // Handle custom criteria based on customConditions
      if (additionalData.customValue !== undefined) {
        currentValue = additionalData.customValue;
      }
      break;
    default:
      return { meets: false, progress: 0, currentValue: 0 };
  }
  
  const progress = Math.min((currentValue / target) * 100, 100);
  const meets = currentValue >= target;
  
  return {
    meets,
    progress: Math.round(progress),
    currentValue,
    target
  };
};

// Method to award achievement to user
achievementSchema.methods.awardToUser = async function(userId, progress = 100) {
  const User = mongoose.model('User');
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if user already has this achievement
    const existingAchievement = user.achievements.find(
      achievement => achievement.achievementId.equals(this._id)
    );
    
    if (existingAchievement) {
      // Update progress if it's higher
      if (progress > existingAchievement.progress) {
        existingAchievement.progress = progress;
        if (progress >= 100 && !existingAchievement.unlockedAt) {
          existingAchievement.unlockedAt = new Date();
          existingAchievement.tier = this.tier;
          
          // Award rewards
          user.addProgress(this.rewards.xp, this.rewards.points);
          user.stats.coins += this.rewards.coins;
          user.stats.tokens += this.rewards.tokens;
          user.stats.achievementsUnlocked += 1;
          
          // Update achievement stats
          this.stats.totalUnlocked += 1;
          this.stats.lastUnlockedAt = new Date();
          if (!this.stats.firstUnlockedAt) {
            this.stats.firstUnlockedAt = new Date();
          }
          
          await this.save();
        }
      }
    } else {
      // Add new achievement
      const achievement = {
        achievementId: this._id,
        progress,
        tier: this.tier
      };
      
      if (progress >= 100) {
        achievement.unlockedAt = new Date();
        
        // Award rewards
        user.addProgress(this.rewards.xp, this.rewards.points);
        user.stats.coins += this.rewards.coins;
        user.stats.tokens += this.rewards.tokens;
        user.stats.achievementsUnlocked += 1;
        
        // Update achievement stats
        this.stats.totalUnlocked += 1;
        this.stats.lastUnlockedAt = new Date();
        if (!this.stats.firstUnlockedAt) {
          this.stats.firstUnlockedAt = new Date();
        }
        
        await this.save();
      }
      
      user.achievements.push(achievement);
    }
    
    await user.save();
    return true;
  } catch (error) {
    console.error('Error awarding achievement:', error);
    return false;
  }
};

// Static method to find active achievements
achievementSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Static method to find by category
achievementSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

// Static method to find user-specific achievements
// eslint-disable-next-line no-unused-vars
achievementSchema.statics.findForUser = function(userLevel, userDepartment) {
  const query = {
    isActive: true,
    $or: [
      { isSecret: false },
      { isSecret: true, 'stats.totalUnlocked': { $gt: 0 } } // Show secret achievements if someone has unlocked them
    ]
  };
  
  return this.find(query);
};

// Static method to check all achievements for a user
achievementSchema.statics.checkAllForUser = async function(userId) {
  const User = mongoose.model('User');
  
  try {
    const user = await User.findById(userId);
    if (!user) {return;}
    
    const achievements = await this.find({ isActive: true });
    const newAchievements = [];
    
    for (const achievement of achievements) {
      const result = achievement.checkCriteria(user.stats);
      
      if (result.meets || result.progress > 0) {
        const awarded = await achievement.awardToUser(userId, result.progress);
        if (awarded && result.meets) {
          newAchievements.push({
            achievement,
            progress: result.progress
          });
        }
      }
    }
    
    return newAchievements;
  } catch (error) {
    console.error('Error checking achievements for user:', error);
    return [];
  }
};

const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;