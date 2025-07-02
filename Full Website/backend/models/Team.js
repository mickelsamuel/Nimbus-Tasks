const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    maxlength: [100, 'Team name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  tagline: {
    type: String,
    maxlength: [200, 'Tagline cannot exceed 200 characters']
  },
  
  // Visual Identity
  avatar: {
    type: String,
    default: '/teams/default-avatar.jpg'
  },
  banner: String,
  color: {
    type: String,
    default: '#1E40AF'
  },
  
  // Organization
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
      'Retail Banking',
      'Cross-Department'
    ]
  },
  category: {
    type: String,
    enum: ['Project', 'Learning Group', 'Social', 'Competition', 'Department'],
    default: 'Learning Group'
  },
  
  // Leadership
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Team leader is required']
  },
  coLeaders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Membership
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { 
      type: String, 
      enum: ['member', 'moderator', 'co-leader', 'leader'], 
      default: 'member' 
    },
    joinedAt: { type: Date, default: Date.now },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'pending'], 
      default: 'active' 
    },
    contributions: {
      modulesCompleted: { type: Number, default: 0 },
      pointsEarned: { type: Number, default: 0 },
      helpGiven: { type: Number, default: 0 },
      postsCreated: { type: Number, default: 0 }
    }
  }],
  
  // Team Statistics
  stats: {
    memberCount: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    totalModulesCompleted: { type: Number, default: 0 },
    averageProgress: { type: Number, default: 0 },
    weeklyActivity: { type: Number, default: 0 },
    monthlyActivity: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    level: { type: Number, default: 1 }
  },
  
  // Achievements & Recognition
  achievements: [{
    achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    unlockedAt: { type: Date, default: Date.now },
    unlockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  badges: [{
    name: String,
    description: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now },
    tier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'] }
  }],
  
  // Goals & Challenges
  goals: [{
    title: String,
    description: String,
    targetValue: Number,
    currentValue: { type: Number, default: 0 },
    metric: { 
      type: String, 
      enum: ['modules_completed', 'points_earned', 'members_added', 'activity_days'] 
    },
    deadline: Date,
    reward: {
      points: Number,
      coins: Number,
      badge: String
    },
    status: { 
      type: String, 
      enum: ['active', 'completed', 'expired'], 
      default: 'active' 
    },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Learning Focus
  focusAreas: [{
    type: String,
    enum: [
      'Banking Fundamentals',
      'Customer Service',
      'Risk Management',
      'Investment Banking',
      'Retail Banking',
      'Corporate Banking',
      'Digital Banking',
      'Compliance',
      'Leadership',
      'Technology'
    ]
  }],
  currentModules: [{
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    startedAt: { type: Date, default: Date.now },
    targetCompletion: Date,
    progress: { type: Number, default: 0 }
  }],
  
  // Communication & Activity
  announcements: [{
    title: String,
    message: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    pinned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  
  // Settings & Permissions
  settings: {
    isPublic: { type: Boolean, default: true },
    allowJoinRequests: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    maxMembers: { type: Number, default: 50 },
    allowMemberInvites: { type: Boolean, default: true },
    showMemberStats: { type: Boolean, default: true },
    showTeamStats: { type: Boolean, default: true }
  },
  
  // Activity Tracking
  activityLog: [{
    action: String, // 'member_joined', 'module_completed', 'goal_achieved', etc.
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    target: String, // What was acted upon
    details: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Status
  isActive: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
teamSchema.index({ name: 1 }, { unique: true });
teamSchema.index({ department: 1 });
teamSchema.index({ category: 1 });
teamSchema.index({ leader: 1 });
teamSchema.index({ isActive: 1 });
teamSchema.index({ isArchived: 1 });
teamSchema.index({ 'settings.isPublic': 1 });
teamSchema.index({ 'settings.allowJoinRequests': 1 });

// Member-related indexes
teamSchema.index({ 'members.userId': 1 });
teamSchema.index({ 'members.role': 1 });
teamSchema.index({ 'members.status': 1 });
teamSchema.index({ 'members.joinedAt': -1 });
teamSchema.index({ coLeaders: 1 });

// Statistics indexes
teamSchema.index({ 'stats.memberCount': -1 });
teamSchema.index({ 'stats.totalPoints': -1 });
teamSchema.index({ 'stats.totalModulesCompleted': -1 });
teamSchema.index({ 'stats.averageProgress': -1 });
teamSchema.index({ 'stats.weeklyActivity': -1 });
teamSchema.index({ 'stats.monthlyActivity': -1 });
teamSchema.index({ 'stats.rank': 1 });
teamSchema.index({ 'stats.level': -1 });

// Date-based indexes
teamSchema.index({ createdAt: -1 });
teamSchema.index({ lastActivity: -1 });

// Focus and module indexes
teamSchema.index({ focusAreas: 1 });
teamSchema.index({ 'currentModules.moduleId': 1 });
teamSchema.index({ 'currentModules.targetCompletion': 1 });

// Achievements and goals indexes
teamSchema.index({ 'achievements.achievementId': 1 });
teamSchema.index({ 'achievements.unlockedAt': -1 });
teamSchema.index({ 'goals.status': 1 });
teamSchema.index({ 'goals.deadline': 1 });
teamSchema.index({ 'goals.metric': 1 });

// Communication indexes
teamSchema.index({ 'announcements.pinned': 1, 'announcements.createdAt': -1 });
teamSchema.index({ 'announcements.priority': 1 });
teamSchema.index({ 'activityLog.timestamp': -1 });
teamSchema.index({ 'activityLog.action': 1 });
teamSchema.index({ 'activityLog.actor': 1 });

// Compound indexes for complex queries
teamSchema.index({ department: 1, category: 1 });
teamSchema.index({ department: 1, 'stats.totalPoints': -1 });
teamSchema.index({ isActive: 1, isArchived: 1 });
teamSchema.index({ isActive: 1, 'settings.isPublic': 1 });
teamSchema.index({ category: 1, 'stats.memberCount': -1 });
teamSchema.index({ 'settings.isPublic': 1, 'settings.allowJoinRequests': 1 });

// Text search index
teamSchema.index({ 
  name: 'text', 
  description: 'text',
  tagline: 'text',
  focusAreas: 'text'
});

// Virtual for formatted member count
teamSchema.virtual('memberCountText').get(function() {
  const count = this.stats.memberCount;
  return count === 1 ? '1 member' : `${count} members`;
});

// Virtual for team level calculation
teamSchema.virtual('teamLevel').get(function() {
  const points = this.stats.totalPoints;
  if (points >= 100000) {return 10;}
  if (points >= 50000) {return 9;}
  if (points >= 25000) {return 8;}
  if (points >= 15000) {return 7;}
  if (points >= 10000) {return 6;}
  if (points >= 6000) {return 5;}
  if (points >= 3000) {return 4;}
  if (points >= 1500) {return 3;}
  if (points >= 500) {return 2;}
  return 1;
});

// Pre-save middleware to update member count
teamSchema.pre('save', function(next) {
  if (this.members) {
    this.stats.memberCount = this.members.filter(member => member.status === 'active').length;
  }
  next();
});

// Method to add member
teamSchema.methods.addMember = function(userId, invitedBy = null, role = 'member') {
  // Check if user is already a member
  const existingMember = this.members.find(member => member.userId.equals(userId));
  if (existingMember) {
    throw new Error('User is already a member of this team');
  }
  
  // Check member limit
  if (this.stats.memberCount >= this.settings.maxMembers) {
    throw new Error('Team has reached maximum member limit');
  }
  
  // Add member
  this.members.push({
    userId,
    role,
    joinedAt: new Date(),
    invitedBy,
    status: this.settings.requireApproval ? 'pending' : 'active'
  });
  
  // Log activity
  this.activityLog.push({
    action: 'member_joined',
    actor: userId,
    target: 'team',
    timestamp: new Date()
  });
  
  this.lastActivity = new Date();
  return this.save();
};

// Method to remove member
teamSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => !member.userId.equals(userId));
  
  // Log activity
  this.activityLog.push({
    action: 'member_left',
    actor: userId,
    target: 'team',
    timestamp: new Date()
  });
  
  this.lastActivity = new Date();
  return this.save();
};

// Method to update member role
teamSchema.methods.updateMemberRole = function(userId, newRole) {
  const member = this.members.find(member => member.userId.equals(userId));
  if (!member) {
    throw new Error('User is not a member of this team');
  }
  
  const oldRole = member.role;
  member.role = newRole;
  
  // Log activity
  this.activityLog.push({
    action: 'role_changed',
    actor: userId,
    target: 'team',
    details: { from: oldRole, to: newRole },
    timestamp: new Date()
  });
  
  this.lastActivity = new Date();
  return this.save();
};

// Method to add points to team
teamSchema.methods.addPoints = function(points, earnedBy = null) {
  this.stats.totalPoints += points;
  this.stats.level = this.teamLevel;
  
  // Log activity
  this.activityLog.push({
    action: 'points_earned',
    actor: earnedBy,
    target: 'team',
    details: { points },
    timestamp: new Date()
  });
  
  this.lastActivity = new Date();
  return this.save();
};

// Method to create announcement
teamSchema.methods.createAnnouncement = function(title, message, author, priority = 'medium') {
  this.announcements.unshift({
    title,
    message,
    author,
    priority,
    createdAt: new Date()
  });
  
  // Keep only last 50 announcements
  if (this.announcements.length > 50) {
    this.announcements = this.announcements.slice(0, 50);
  }
  
  this.lastActivity = new Date();
  return this.save();
};

// Method to update team statistics
teamSchema.methods.updateStats = function() {
  // This would typically be called periodically or when members complete activities
  // Calculate average progress, weekly activity, etc.
  const activeMembers = this.members.filter(member => member.status === 'active');
  
  if (activeMembers.length > 0) {
    const totalProgress = activeMembers.reduce((sum, member) => {
      return sum + (member.contributions.modulesCompleted || 0);
    }, 0);
    
    this.stats.averageProgress = Math.round(totalProgress / activeMembers.length);
  }
  
  return this.save();
};

// Static method to find public teams
teamSchema.statics.findPublicTeams = function() {
  return this.find({ 
    'settings.isPublic': true, 
    isActive: true, 
    isArchived: false 
  });
};

// Static method to find teams by department
teamSchema.statics.findByDepartment = function(department) {
  return this.find({ 
    department, 
    isActive: true, 
    isArchived: false 
  });
};

// Static method to search teams
teamSchema.statics.searchTeams = function(query, options = {}) {
  const { department, category, sortBy = 'members' } = options;
  
  const searchQuery = {
    isActive: true,
    isArchived: false,
    'settings.isPublic': true
  };
  
  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  // Filters
  if (department) {searchQuery.department = department;}
  if (category) {searchQuery.category = category;}
  
  // Sorting
  let sortOptions = {};
  switch (sortBy) {
    case 'members':
      sortOptions = { 'stats.memberCount': -1 };
      break;
    case 'points':
      sortOptions = { 'stats.totalPoints': -1 };
      break;
    case 'activity':
      sortOptions = { lastActivity: -1 };
      break;
    case 'newest':
      sortOptions = { createdAt: -1 };
      break;
    default:
      sortOptions = { 'stats.memberCount': -1 };
  }
  
  return this.find(searchQuery).sort(sortOptions);
};

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

module.exports = Team;