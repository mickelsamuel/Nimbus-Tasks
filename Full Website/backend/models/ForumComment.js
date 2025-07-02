const mongoose = require('mongoose');

const forumCommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumComment'
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumComment'
  }],
  depth: {
    type: Number,
    default: 0,
    max: 5 // Limit nesting to 5 levels
  },
  status: {
    type: String,
    enum: ['active', 'edited', 'deleted', 'hidden'],
    default: 'active'
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
  isSolution: {
    type: Boolean,
    default: false
  },
  markedAsSolutionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  markedAsSolutionAt: Date,
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
  mentions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
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
  }],
  metadata: {
    ipAddress: String,
    userAgent: String,
    editCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Add or update vote
forumCommentSchema.methods.vote = function(userId, voteType) {
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

// Mark as solution
forumCommentSchema.methods.markAsSolution = function(userId) {
  this.isSolution = true;
  this.markedAsSolutionBy = userId;
  this.markedAsSolutionAt = new Date();
  return this.save();
};

// Update edit count and history
forumCommentSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.metadata.editCount += 1;
    this.status = 'edited';
  }
  next();
});

// Indexes
forumCommentSchema.index({ postId: 1, createdAt: 1 });
forumCommentSchema.index({ author: 1, createdAt: -1 });
forumCommentSchema.index({ parentComment: 1 });
forumCommentSchema.index({ isSolution: -1, 'votes.upvotes': -1 });
forumCommentSchema.index({ status: 1 });
forumCommentSchema.index({ 'votes.upvotes': -1 });

module.exports = mongoose.models.ForumComment || mongoose.model('ForumComment', forumCommentSchema);