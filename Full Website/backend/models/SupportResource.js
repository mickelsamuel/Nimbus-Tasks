const mongoose = require('mongoose');

const supportResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['documentation', 'video', 'tutorial', 'best-practice', 'guide'],
    required: true
  },
  category: {
    type: String,
    enum: ['handbook', 'training', 'community', 'practices', 'technical'],
    required: true
  },
  url: String,
  filePath: String,
  videoUrl: String,
  duration: Number, // in minutes for videos
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  accessLevel: {
    type: String,
    enum: ['public', 'employee', 'manager', 'admin'],
    default: 'employee'
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
  viewCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  rating: {
    totalRating: {
      type: Number,
      default: 0
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    }
  },
  userRatings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    ratedAt: {
      type: Date,
      default: Date.now
    }
  }],
  relatedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportResource'
  }],
  prerequisites: [String],
  estimatedReadTime: Number // in minutes
}, {
  timestamps: true
});

// Calculate average rating when ratings are updated
supportResourceSchema.pre('save', function(next) {
  if (this.isModified('userRatings')) {
    this.rating.ratingCount = this.userRatings.length;
    if (this.rating.ratingCount > 0) {
      this.rating.totalRating = this.userRatings.reduce((sum, rating) => sum + rating.rating, 0);
      this.rating.averageRating = Math.round((this.rating.totalRating / this.rating.ratingCount) * 10) / 10;
    } else {
      this.rating.totalRating = 0;
      this.rating.averageRating = 0;
    }
  }
  next();
});

// Text search index
supportResourceSchema.index({ 
  title: 'text', 
  description: 'text', 
  content: 'text',
  tags: 'text' 
});

// Other indexes
supportResourceSchema.index({ category: 1, type: 1, isPublished: 1 });
supportResourceSchema.index({ 'rating.averageRating': -1 });
supportResourceSchema.index({ viewCount: -1 });
supportResourceSchema.index({ isFeatured: -1, createdAt: -1 });
supportResourceSchema.index({ accessLevel: 1 });

module.exports = mongoose.models.SupportResource || mongoose.model('SupportResource', supportResourceSchema);