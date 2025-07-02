const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  answer: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['Account Management', 'Training Excellence', 'Team Leadership', 'Rewards & Recognition', 'Technical Excellence']
  },
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  votes: {
    helpful: {
      type: Number,
      default: 0
    },
    notHelpful: {
      type: Number,
      default: 0
    },
    totalVotes: {
      type: Number,
      default: 0
    },
    helpfulPercentage: {
      type: Number,
      default: 0
    }
  },
  userVotes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vote: {
      type: Boolean // true = helpful, false = not helpful
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  searchCount: {
    type: Number,
    default: 0
  },
  relatedTickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportTicket'
  }],
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate helpful percentage when votes are updated
faqSchema.pre('save', function(next) {
  if (this.isModified('votes')) {
    this.votes.totalVotes = this.votes.helpful + this.votes.notHelpful;
    if (this.votes.totalVotes > 0) {
      this.votes.helpfulPercentage = Math.round((this.votes.helpful / this.votes.totalVotes) * 100);
    } else {
      this.votes.helpfulPercentage = 0;
    }
  }
  next();
});

// Text search index
faqSchema.index({ 
  question: 'text', 
  answer: 'text', 
  tags: 'text' 
});

// Other indexes
faqSchema.index({ category: 1, isPublished: 1 });
faqSchema.index({ 'votes.helpfulPercentage': -1 });
faqSchema.index({ viewCount: -1 });
faqSchema.index({ createdAt: -1 });

module.exports = mongoose.models.FAQ || mongoose.model('FAQ', faqSchema);