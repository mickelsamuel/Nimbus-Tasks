const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Chapter title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Chapter description is required']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Chapter duration is required']
  },
  content: {
    type: String, // HTML or markdown content
    required: [true, 'Chapter content is required']
  },
  videoUrl: String,
  resources: [{
    name: String,
    url: String,
    type: { type: String, enum: ['pdf', 'video', 'link', 'download'] }
  }],
  quiz: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
      points: { type: Number, default: 10 }
    }],
    passingScore: { type: Number, default: 70 }
  },
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const moduleSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Module description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  
  // Categorization & Metadata
  category: {
    type: String,
    required: [true, 'Category is required'],
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
      'Technology',
      'Marketing',
      'Operations',
      'Finance',
      'Professional Development'
    ]
  },
  subCategory: String,
  tags: [String],
  
  // Difficulty & Requirements
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  prerequisites: [{
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    title: String
  }],
  
  // Learning Objectives & Content
  learningObjectives: [String],
  chapters: [chapterSchema],
  totalDuration: {
    type: Number, // Total duration in minutes (calculated)
    default: 0
  },
  
  // Instructor & Author Information
  instructor: {
    name: String,
    title: String,
    bio: String,
    avatar: String,
    email: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Visual & Media
  thumbnail: {
    type: String,
    default: '/modules/default-thumbnail.jpg'
  },
  banner: String,
  color: {
    type: String,
    default: '#1E40AF' // Default blue color
  },
  
  // Gamification & Rewards
  points: {
    type: Number,
    required: [true, 'Module points are required'],
    min: [10, 'Minimum points is 10'],
    max: [1000, 'Maximum points is 1000']
  },
  xpReward: {
    type: Number,
    default: function() { return this.points * 2; }
  },
  coins: {
    type: Number,
    default: function() { return Math.floor(this.points / 10); }
  },
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    default: 'Common'
  },
  
  // Stats & Analytics
  stats: {
    enrolledCount: { type: Number, default: 0 },
    completedCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    averageCompletionTime: { type: Number, default: 0 }, // in minutes
    successRate: { type: Number, default: 0 } // percentage
  },
  
  // Social Features
  likeCount: { type: Number, default: 0 },
  
  // Reviews & Feedback
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    helpfulCount: { type: Number, default: 0 },
    helpfulBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Status & Visibility
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  isPublic: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // Departments & Access Control
  targetDepartments: [{
    type: String,
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
      'Retail Banking'
    ]
  }],
  requiredRole: {
    type: String,
    enum: ['employee', 'manager', 'admin'],
    default: 'employee'
  },
  
  // Certification & Compliance
  certification: {
    name: String,
    validityPeriod: Number, // in months
    renewalRequired: { type: Boolean, default: false }
  },
  complianceRequired: { type: Boolean, default: false },
  
  // Scheduling & Availability
  availableFrom: Date,
  availableUntil: Date,
  maxEnrollments: Number,
  
  // Language & Localization
  language: {
    type: String,
    enum: ['en', 'fr', 'both'],
    default: 'both'
  },
  translations: {
    fr: {
      title: String,
      description: String,
      shortDescription: String,
      learningObjectives: [String]
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
moduleSchema.index({ category: 1 });
moduleSchema.index({ difficulty: 1 });
moduleSchema.index({ status: 1 });
moduleSchema.index({ isActive: 1 });
moduleSchema.index({ isPublic: 1 });
moduleSchema.index({ isFeatured: 1 });
moduleSchema.index({ author: 1 });
moduleSchema.index({ targetDepartments: 1 });
moduleSchema.index({ requiredRole: 1 });
moduleSchema.index({ tags: 1 });
moduleSchema.index({ language: 1 });
moduleSchema.index({ rarity: 1 });
moduleSchema.index({ complianceRequired: 1 });

// Analytics and stats indexes
moduleSchema.index({ 'stats.averageRating': -1 });
moduleSchema.index({ 'stats.enrolledCount': -1 });
moduleSchema.index({ 'stats.completedCount': -1 });
moduleSchema.index({ 'stats.totalRatings': -1 });
moduleSchema.index({ 'stats.successRate': -1 });
moduleSchema.index({ likeCount: -1 });
moduleSchema.index({ points: -1 });
moduleSchema.index({ xpReward: -1 });
moduleSchema.index({ totalDuration: 1 });

// Date-based indexes
moduleSchema.index({ createdAt: -1 });
moduleSchema.index({ updatedAt: -1 });
moduleSchema.index({ availableFrom: 1 });
moduleSchema.index({ availableUntil: 1 });

// Compound indexes for complex queries
moduleSchema.index({ category: 1, difficulty: 1 });
moduleSchema.index({ category: 1, 'stats.averageRating': -1 });
moduleSchema.index({ status: 1, isActive: 1 });
moduleSchema.index({ status: 1, isActive: 1, isPublic: 1 });
moduleSchema.index({ status: 1, isActive: 1, isFeatured: 1 });
moduleSchema.index({ targetDepartments: 1, difficulty: 1 });
moduleSchema.index({ targetDepartments: 1, category: 1 });
moduleSchema.index({ requiredRole: 1, isActive: 1 });
moduleSchema.index({ language: 1, status: 1 });
moduleSchema.index({ complianceRequired: 1, isActive: 1 });

// Review-related indexes
moduleSchema.index({ 'reviews.userId': 1 });
moduleSchema.index({ 'reviews.rating': -1 });
moduleSchema.index({ 'reviews.createdAt': -1 });

// Prerequisites and certification indexes
moduleSchema.index({ 'prerequisites.moduleId': 1 });
moduleSchema.index({ 'certification.name': 1 });
moduleSchema.index({ 'certification.renewalRequired': 1 });

// Chapter-related indexes for embedded documents
moduleSchema.index({ 'chapters.order': 1 });

// Text search index for searching modules
moduleSchema.index({ 
  title: 'text', 
  description: 'text',
  shortDescription: 'text',
  tags: 'text',
  learningObjectives: 'text',
  'instructor.name': 'text',
  'chapters.title': 'text',
  'chapters.description': 'text'
});

// French translation indexes
moduleSchema.index({ 'translations.fr.title': 'text', 'translations.fr.description': 'text' });

// Virtual for completion rate
moduleSchema.virtual('completionRate').get(function() {
  if (this.stats.enrolledCount === 0) {return 0;}
  return Math.round((this.stats.completedCount / this.stats.enrolledCount) * 100);
});

// Virtual for formatted duration
moduleSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.totalDuration / 60);
  const minutes = this.totalDuration % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

// Pre-save middleware to calculate total duration
moduleSchema.pre('save', function(next) {
  if (this.chapters && this.chapters.length > 0) {
    this.totalDuration = this.chapters.reduce((total, chapter) => total + (chapter.duration || 0), 0);
  }
  next();
});

// Method to calculate average rating
moduleSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.stats.averageRating = 0;
    this.stats.totalRatings = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.stats.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10;
  this.stats.totalRatings = this.reviews.length;
};

// Method to add a review
moduleSchema.methods.addReview = function(userId, rating, comment) {
  // Remove existing review from same user
  this.reviews = this.reviews.filter(review => !review.userId.equals(userId));
  
  // Add new review
  this.reviews.push({
    userId,
    rating,
    comment,
    createdAt: new Date()
  });
  
  this.calculateAverageRating();
  return this.save();
};

// Method to enroll user
moduleSchema.methods.enrollUser = function() {
  this.stats.enrolledCount += 1;
  return this.save();
};

// Method to mark user completion
moduleSchema.methods.markCompletion = function(completionTime) {
  this.stats.completedCount += 1;
  
  // Update average completion time
  if (this.stats.averageCompletionTime === 0) {
    this.stats.averageCompletionTime = completionTime;
  } else {
    this.stats.averageCompletionTime = Math.round(
      (this.stats.averageCompletionTime + completionTime) / 2
    );
  }
  
  // Update success rate
  this.stats.successRate = Math.round((this.stats.completedCount / this.stats.enrolledCount) * 100);
  
  return this.save();
};

// Static method to find featured modules
moduleSchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, status: 'published', isActive: true });
};

// Static method to find by category
moduleSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'published', isActive: true });
};

// Static method to search modules
moduleSchema.statics.searchModules = function(query, options = {}) {
  const {
    category,
    difficulty,
    department,
    language = 'en',
    sortBy = 'popularity'
  } = options;
  
  const searchQuery = {
    status: 'published',
    isActive: true
  };
  
  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  // Filters
  if (category) {searchQuery.category = category;}
  if (difficulty) {searchQuery.difficulty = difficulty;}
  if (department) {searchQuery.targetDepartments = { $in: [department] };}
  
  // Language filter
  if (language === 'fr') {
    searchQuery['translations.fr.title'] = { $exists: true };
  }
  
  // Sorting
  let sortOptions = {};
  switch (sortBy) {
    case 'popularity':
      sortOptions = { 'stats.enrolledCount': -1 };
      break;
    case 'rating':
      sortOptions = { 'stats.averageRating': -1 };
      break;
    case 'newest':
      sortOptions = { createdAt: -1 };
      break;
    case 'duration':
      sortOptions = { totalDuration: 1 };
      break;
    default:
      sortOptions = { 'stats.enrolledCount': -1 };
  }
  
  return this.find(searchQuery).sort(sortOptions);
};

const Module = mongoose.models.Module || mongoose.model('Module', moduleSchema);

module.exports = Module;