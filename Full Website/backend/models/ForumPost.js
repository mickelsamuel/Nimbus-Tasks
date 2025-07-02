const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: [
      'Portfolio Management',
      'Digital Innovation', 
      'Leadership',
      'Risk Management',
      'Customer Relations',
      'Training & Development',
      'Market Analysis',
      'Regulatory Compliance',
      'Technology',
      'General Discussion'
    ],
    required: true
  },
  tags: [String],
  status: {
    type: String,
    enum: ['active', 'locked', 'archived', 'deleted'],
    default: 'active'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    count: {
      type: Number,
      default: 0
    },
    viewedBy: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      viewedAt: {
        type: Date,
        default: Date.now
      },
      ipAddress: String
    }]
  },
  votes: {
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    },
    userVotes: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      vote: {
        type: String,
        enum: ['up', 'down']
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumComment'
  }],
  commentCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  lastActivityBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  solution: {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumComment'
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    markedAt: Date
  },
  followers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    followedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reports: [{
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'harassment', 'misinformation', 'other']
    },
    description: String,
    reportedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending'
    }
  }],
  editHistory: [{
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    editedAt: {
      type: Date,
      default: Date.now
    },
    reason: String,
    previousContent: String
  }]
}, {
  timestamps: true
});

// Update view count and track unique views
forumPostSchema.methods.addView = function(userId, ipAddress) {
  // Check if user already viewed this post recently (within 24 hours)
  const recentView = this.views.viewedBy.find(view => 
    view.userId && view.userId.toString() === userId.toString() &&
    view.viewedAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  
  if (!recentView) {
    this.views.count += 1;
    this.views.viewedBy.push({
      userId: userId,
      ipAddress: ipAddress
    });
  }
  
  return this.save();
};

// Add or update vote
forumPostSchema.methods.vote = function(userId, voteType) {
  const existingVoteIndex = this.votes.userVotes.findIndex(
    vote => vote.userId.toString() === userId.toString()
  );
  
  if (existingVoteIndex !== -1) {
    const oldVote = this.votes.userVotes[existingVoteIndex].vote;
    
    // Remove old vote count
    if (oldVote === 'up') {
      this.votes.upvotes -= 1;
    } else {
      this.votes.downvotes -= 1;
    }
    
    // Update vote if different
    if (oldVote !== voteType) {
      this.votes.userVotes[existingVoteIndex].vote = voteType;
      this.votes.userVotes[existingVoteIndex].votedAt = new Date();
      
      if (voteType === 'up') {
        this.votes.upvotes += 1;
      } else {
        this.votes.downvotes += 1;
      }
    } else {
      // Remove vote if same type (toggle off)
      this.votes.userVotes.splice(existingVoteIndex, 1);
    }
  } else {
    // Add new vote
    this.votes.userVotes.push({
      userId: userId,
      vote: voteType
    });
    
    if (voteType === 'up') {
      this.votes.upvotes += 1;
    } else {
      this.votes.downvotes += 1;
    }
  }
  
  return this.save();
};

// Update last activity when comments are added
forumPostSchema.methods.updateActivity = function(userId) {
  this.lastActivity = new Date();
  this.lastActivityBy = userId;
  return this.save();
};

// Text search index
forumPostSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text' 
});

// Other indexes
forumPostSchema.index({ category: 1, status: 1 });
forumPostSchema.index({ author: 1, createdAt: -1 });
forumPostSchema.index({ isPinned: -1, lastActivity: -1 });
forumPostSchema.index({ status: 1, lastActivity: -1 });
forumPostSchema.index({ 'votes.upvotes': -1 });
forumPostSchema.index({ 'views.count': -1 });
forumPostSchema.index({ verifiedAt: -1 });

module.exports = mongoose.models.ForumPost || mongoose.model('ForumPost', forumPostSchema);