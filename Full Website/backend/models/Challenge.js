const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  detailedDescription: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['Process Improvement', 'Technology Innovation', 'Sustainability', 'Employee Experience', 'Customer Success', 'Product Development', 'Cost Optimization', 'Data & Analytics']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'archived'],
    default: 'draft'
  },
  deadline: {
    type: Date,
    required: true
  },
  maxTeamSize: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  rewards: {
    type: String,
    required: true
  },
  prizePool: {
    type: Number,
    default: 0
  },
  successCriteria: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  submissionCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  resources: [{
    title: String,
    description: String,
    url: String,
    type: {
      type: String,
      enum: ['document', 'video', 'link', 'dataset']
    }
  }],
  requirements: [{
    type: String
  }],
  evaluationCriteria: [{
    criteria: String,
    weight: Number
  }],
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
ChallengeSchema.index({ creator: 1 });
ChallengeSchema.index({ status: 1, isPublic: 1 });
ChallengeSchema.index({ deadline: 1 });
ChallengeSchema.index({ featured: 1 });
ChallengeSchema.index({ tags: 1 });
ChallengeSchema.index({ category: 1 });

// Virtual for checking if challenge is expired
ChallengeSchema.virtual('isExpired').get(function() {
  return this.deadline < new Date();
});

// Virtual for days remaining
ChallengeSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const deadline = new Date(this.deadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Method to increment view count
ChallengeSchema.methods.incrementViewCount = async function() {
  this.viewCount += 1;
  await this.save();
};

// Method to check if user can submit
ChallengeSchema.methods.canUserSubmit = function(userId) {
  if (this.status !== 'active') {return false;}
  if (this.isExpired) {return false;}
  
  // Check if user is already a participant
  const isParticipant = this.participants.some(p => 
    p.user && p.user.toString() === userId.toString()
  );
  
  return !isParticipant || this.maxTeamSize > 1;
};

module.exports = mongoose.model('Challenge', ChallengeSchema);