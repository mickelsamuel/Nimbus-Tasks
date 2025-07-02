const mongoose = require('mongoose');

const ChallengeSubmissionSchema = new mongoose.Schema({
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  submitter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  // For public submissions without login
  publicSubmitter: {
    name: String,
    email: String,
    organization: String
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  submissionDetails: {
    type: String,
    required: true
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    type: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  githubRepo: String,
  demoUrl: String,
  videoUrl: String,
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected', 'winner'],
    default: 'pending'
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comments: String,
    reviewedAt: Date,
    scores: [{
      criteria: String,
      score: Number,
      comments: String
    }]
  },
  isWinner: {
    type: Boolean,
    default: false
  },
  rank: Number,
  prize: {
    amount: Number,
    description: String
  },
  votes: {
    count: {
      type: Number,
      default: 0
    },
    voters: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  views: {
    type: Number,
    default: 0
  },
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    publicAuthor: {
      name: String
    },
    content: String,
    isCreatorReply: Boolean,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  technologies: [{
    type: String
  }],
  implementationPlan: String,
  estimatedImpact: String,
  resourcesNeeded: String
}, {
  timestamps: true
});

// Indexes
ChallengeSubmissionSchema.index({ challenge: 1, status: 1 });
ChallengeSubmissionSchema.index({ submitter: 1 });
ChallengeSubmissionSchema.index({ team: 1 });
ChallengeSubmissionSchema.index({ status: 1 });
ChallengeSubmissionSchema.index({ score: -1 });
ChallengeSubmissionSchema.index({ 'votes.count': -1 });

// Virtual for vote count
ChallengeSubmissionSchema.virtual('voteCount').get(function() {
  return this.votes.count;
});

// Method to add vote
ChallengeSubmissionSchema.methods.addVote = async function(userId) {
  // Check if user already voted
  const hasVoted = this.votes.voters.some(v => 
    v.user && v.user.toString() === userId.toString()
  );
  
  if (!hasVoted) {
    this.votes.voters.push({ user: userId });
    this.votes.count += 1;
    await this.save();
    return true;
  }
  return false;
};

// Method to remove vote
ChallengeSubmissionSchema.methods.removeVote = async function(userId) {
  const voterIndex = this.votes.voters.findIndex(v => 
    v.user && v.user.toString() === userId.toString()
  );
  
  if (voterIndex > -1) {
    this.votes.voters.splice(voterIndex, 1);
    this.votes.count = Math.max(0, this.votes.count - 1);
    await this.save();
    return true;
  }
  return false;
};

// Method to add comment
ChallengeSubmissionSchema.methods.addComment = async function(authorId, content, isCreator = false, publicName = null) {
  const comment = {
    content,
    isCreatorReply: isCreator
  };
  
  if (authorId) {
    comment.author = authorId;
  } else if (publicName) {
    comment.publicAuthor = { name: publicName };
  }
  
  this.comments.push(comment);
  await this.save();
  return this.comments[this.comments.length - 1];
};

// Method to increment views
ChallengeSubmissionSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

module.exports = mongoose.model('ChallengeSubmission', ChallengeSubmissionSchema);