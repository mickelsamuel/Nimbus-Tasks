const mongoose = require('mongoose');

const leaderboardEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  userName: String, // Cached for performance
  userAvatar: String, // Cached for performance
  department: String, // Cached for performance
  position: {
    type: Number,
    required: [true, 'Position is required'],
    min: [1, 'Position must be at least 1']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative']
  },
  previousPosition: Number,
  positionChange: {
    type: String,
    enum: ['up', 'down', 'same', 'new'],
    default: 'same'
  },
  streak: {
    type: Number,
    default: 0
  },
  badge: String, // Special badge for top performers
  achievements: Number // Number of achievements unlocked
}, {
  _id: false
});

const leaderboardSchema = new mongoose.Schema({
  // Leaderboard Configuration
  name: {
    type: String,
    required: [true, 'Leaderboard name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Leaderboard type is required'],
    enum: [
      'overall_points',
      'monthly_points',
      'weekly_points',
      'daily_points',
      'modules_completed',
      'streak_days',
      'portfolio_performance',
      'trading_profit',
      'achievements_count',
      'learning_time',
      'team_contributions',
      'department_ranking',
      'newcomer_ranking',
      'simulation_leaderboard'
    ]
  },
  category: {
    type: String,
    enum: ['learning', 'trading', 'social', 'overall', 'gaming'],
    required: [true, 'Category is required']
  },
  
  // Scope & Filters
  scope: {
    type: String,
    enum: ['global', 'department', 'team', 'region', 'role'],
    default: 'global'
  },
  filters: {
    departments: [String],
    roles: [{ type: String, enum: ['employee', 'manager', 'admin'] }],
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    regions: [String],
    joinedAfter: Date, // For newcomer rankings
    joinedBefore: Date
  },
  
  // Time Period
  period: {
    type: String,
    enum: ['real_time', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'all_time'],
    default: 'all_time'
  },
  startDate: Date,
  endDate: Date,
  
  // Leaderboard Entries
  entries: [leaderboardEntrySchema],
  
  // Configuration
  maxEntries: {
    type: Number,
    default: 100,
    min: [10, 'Must show at least 10 entries'],
    max: [1000, 'Cannot exceed 1000 entries']
  },
  updateFrequency: {
    type: String,
    enum: ['real_time', 'hourly', 'daily', 'weekly'],
    default: 'daily'
  },
  
  // Scoring Configuration
  scoringMethod: {
    type: String,
    enum: ['sum', 'average', 'weighted', 'custom'],
    default: 'sum'
  },
  weightings: {
    points: { type: Number, default: 1 },
    modules: { type: Number, default: 100 },
    achievements: { type: Number, default: 50 },
    streak: { type: Number, default: 10 },
    social: { type: Number, default: 25 }
  },
  
  // Statistics
  stats: {
    totalParticipants: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    medianScore: { type: Number, default: 0 },
    topScore: { type: Number, default: 0 },
    scoreRange: { type: Number, default: 0 },
    lastUpdated: Date
  },
  
  // Rewards & Recognition
  rewards: {
    top1: {
      points: Number,
      coins: Number,
      badge: String,
      title: String,
      special: String
    },
    top3: {
      points: Number,
      coins: Number,
      badge: String,
      title: String
    },
    top10: {
      points: Number,
      coins: Number,
      badge: String
    },
    participation: {
      points: Number,
      coins: Number
    }
  },
  
  // Display Configuration
  display: {
    showPositionChange: { type: Boolean, default: true },
    showScore: { type: Boolean, default: true },
    showAvatar: { type: Boolean, default: true },
    showDepartment: { type: Boolean, default: true },
    showBadges: { type: Boolean, default: true },
    hideNames: { type: Boolean, default: false }, // For anonymous leaderboards
    customFields: [String]
  },
  
  // Historical Data
  history: [{
    date: Date,
    snapshot: [leaderboardEntrySchema],
    topScore: Number,
    participantCount: Number
  }],
  
  // Status & Metadata
  isActive: { type: Boolean, default: true },
  isPublic: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  
  // Administrative
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  description: String,
  icon: String,
  color: {
    type: String,
    default: '#F59E0B'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
leaderboardSchema.index({ type: 1, period: 1 });
leaderboardSchema.index({ category: 1, scope: 1 });
leaderboardSchema.index({ 'entries.userId': 1 });
leaderboardSchema.index({ 'entries.position': 1 });
leaderboardSchema.index({ isActive: 1, isPublic: 1 });
leaderboardSchema.index({ startDate: 1, endDate: 1 });

// Virtual for current period description
leaderboardSchema.virtual('periodDescription').get(function() {
  const periodMap = {
    real_time: 'Live Rankings',
    daily: 'Today',
    weekly: 'This Week',
    monthly: 'This Month',
    quarterly: 'This Quarter',
    yearly: 'This Year',
    all_time: 'All Time'
  };
  return periodMap[this.period] || this.period;
});

// Virtual for participation rate
leaderboardSchema.virtual('participationRate').get(function() {
  if (!this.stats.totalParticipants) {return 0;}
  return Math.round((this.entries.length / this.stats.totalParticipants) * 100);
});

// Pre-save middleware to update statistics
leaderboardSchema.pre('save', function(next) {
  if (this.entries && this.entries.length > 0) {
    const scores = this.entries.map(entry => entry.score);
    
    this.stats.totalParticipants = this.entries.length;
    this.stats.averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    this.stats.topScore = Math.max(...scores);
    this.stats.scoreRange = Math.max(...scores) - Math.min(...scores);
    
    // Calculate median
    const sortedScores = scores.sort((a, b) => a - b);
    const middle = Math.floor(sortedScores.length / 2);
    this.stats.medianScore = sortedScores.length % 2 === 0
      ? Math.round((sortedScores[middle - 1] + sortedScores[middle]) / 2)
      : sortedScores[middle];
    
    this.stats.lastUpdated = new Date();
  }
  
  next();
});

// Method to update leaderboard entries
leaderboardSchema.methods.updateEntries = async function(userData) {
  // eslint-disable-next-line no-unused-vars
  const User = mongoose.model('User');
  const previousEntries = new Map(this.entries.map(entry => [entry.userId.toString(), entry]));
  
  // Calculate scores based on leaderboard type
  const scoredUsers = await this.calculateScores(userData);
  
  // Sort by score (descending)
  scoredUsers.sort((a, b) => b.score - a.score);
  
  // Update entries with positions
  this.entries = scoredUsers.map((userData, index) => {
    const position = index + 1;
    const previousEntry = previousEntries.get(userData.userId.toString());
    const previousPosition = previousEntry ? previousEntry.position : null;
    
    let positionChange = 'same';
    if (!previousPosition) {
      positionChange = 'new';
    } else if (position < previousPosition) {
      positionChange = 'up';
    } else if (position > previousPosition) {
      positionChange = 'down';
    }
    
    return {
      userId: userData.userId,
      userName: userData.userName,
      userAvatar: userData.userAvatar,
      department: userData.department,
      position,
      score: userData.score,
      previousPosition,
      positionChange,
      streak: userData.streak || 0,
      badge: this.getBadgeForPosition(position),
      achievements: userData.achievements || 0
    };
  });
  
  // Limit to maxEntries
  if (this.entries.length > this.maxEntries) {
    this.entries = this.entries.slice(0, this.maxEntries);
  }
  
  return this.save();
};

// Method to calculate scores based on leaderboard type
leaderboardSchema.methods.calculateScores = async function() {
  const User = mongoose.model('User');
  const Portfolio = mongoose.model('Portfolio');
  
  // Apply filters
  const userQuery = { isActive: true };
  if (this.filters.departments && this.filters.departments.length > 0) {
    userQuery.department = { $in: this.filters.departments };
  }
  if (this.filters.roles && this.filters.roles.length > 0) {
    userQuery.role = { $in: this.filters.roles };
  }
  if (this.filters.joinedAfter) {
    userQuery.createdAt = { $gte: this.filters.joinedAfter };
  }
  if (this.filters.joinedBefore) {
    userQuery.createdAt = { ...userQuery.createdAt, $lte: this.filters.joinedBefore };
  }
  
  const users = await User.find(userQuery);
  
  const scoredUsers = [];
  
  for (const user of users) {
    let score = 0;
    
    switch (this.type) {
      case 'overall_points':
        score = user.stats.totalPoints;
        break;
        
      case 'modules_completed':
        score = user.stats.modulesCompleted;
        break;
        
      case 'streak_days':
        score = user.stats.streak;
        break;
        
      case 'achievements_count':
        score = user.stats.achievementsUnlocked;
        break;
        
      case 'learning_time':
        score = user.stats.totalLearningTime;
        break;
        
      case 'portfolio_performance':
        const portfolio = await Portfolio.findOne({ userId: user._id });
        score = portfolio ? portfolio.performance.totalGainLossPercent : 0;
        break;
        
      case 'trading_profit':
        const tradingPortfolio = await Portfolio.findOne({ userId: user._id });
        score = tradingPortfolio ? tradingPortfolio.performance.totalGainLoss : 0;
        break;
        
      default:
        // Custom scoring method
        score = this.calculateCustomScore(user);
    }
    
    scoredUsers.push({
      userId: user._id,
      userName: user.fullName,
      userAvatar: user.avatar,
      department: user.department,
      score: Math.round(score),
      streak: user.stats.streak,
      achievements: user.stats.achievementsUnlocked
    });
  }
  
  return scoredUsers;
};

// Method to calculate custom score
leaderboardSchema.methods.calculateCustomScore = function(user) {
  const w = this.weightings;
  
  return (
    (user.stats.totalPoints * w.points) +
    (user.stats.modulesCompleted * w.modules) +
    (user.stats.achievementsUnlocked * w.achievements) +
    (user.stats.streak * w.streak)
  );
};

// Method to get badge for position
leaderboardSchema.methods.getBadgeForPosition = function(position) {
  if (position === 1) {return '🥇';}
  if (position === 2) {return '🥈';}
  if (position === 3) {return '🥉';}
  if (position <= 10) {return '🏆';}
  if (position <= 25) {return '⭐';}
  return null;
};

// Method to create historical snapshot
leaderboardSchema.methods.createSnapshot = function() {
  const snapshot = {
    date: new Date(),
    snapshot: this.entries.map(entry => ({ ...entry })),
    topScore: this.stats.topScore,
    participantCount: this.stats.totalParticipants
  };
  
  this.history.push(snapshot);
  
  // Keep only last 52 snapshots (for weekly leaderboards = 1 year)
  if (this.history.length > 52) {
    this.history = this.history.slice(-52);
  }
  
  return this.save();
};

// Method to get user position
leaderboardSchema.methods.getUserPosition = function(userId) {
  const entry = this.entries.find(entry => entry.userId.equals(userId));
  return entry || null;
};

// Method to get surrounding entries for a user
leaderboardSchema.methods.getSurroundingEntries = function(userId, range = 5) {
  const userEntry = this.getUserPosition(userId);
  if (!userEntry) {return { user: null, above: [], below: [] };}
  
  const userIndex = this.entries.findIndex(entry => entry.userId.equals(userId));
  const start = Math.max(0, userIndex - range);
  const end = Math.min(this.entries.length, userIndex + range + 1);
  
  return {
    user: userEntry,
    above: this.entries.slice(start, userIndex),
    below: this.entries.slice(userIndex + 1, end)
  };
};

// Static method to get active leaderboards
leaderboardSchema.statics.getActiveLeaderboards = function(category = null) {
  const query = { isActive: true };
  if (category) {query.category = category;}
  
  return this.find(query).sort({ isFeatured: -1, createdAt: -1 });
};

// Static method to get user's leaderboards
leaderboardSchema.statics.getUserLeaderboards = function(userId) {
  return this.find({
    isActive: true,
    'entries.userId': userId
  }).select('name type category period entries.$');
};

// Static method to create or update standard leaderboards
leaderboardSchema.statics.updateStandardLeaderboards = async function() {
  const standardLeaderboards = [
    {
      name: 'Overall Champions',
      type: 'overall_points',
      category: 'overall',
      period: 'all_time',
      scope: 'global'
    },
    {
      name: 'Monthly Leaders',
      type: 'monthly_points',
      category: 'learning',
      period: 'monthly',
      scope: 'global'
    },
    {
      name: 'Learning Masters',
      type: 'modules_completed',
      category: 'learning',
      period: 'all_time',
      scope: 'global'
    },
    {
      name: 'Trading Titans',
      type: 'portfolio_performance',
      category: 'trading',
      period: 'all_time',
      scope: 'global'
    },
    {
      name: 'Streak Legends',
      type: 'streak_days',
      category: 'gaming',
      period: 'all_time',
      scope: 'global'
    }
  ];
  
  for (const config of standardLeaderboards) {
    let leaderboard = await this.findOne({ type: config.type, period: config.period });
    
    if (!leaderboard) {
      leaderboard = new this(config);
    }
    
    await leaderboard.updateEntries();
  }
};

const Leaderboard = mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;