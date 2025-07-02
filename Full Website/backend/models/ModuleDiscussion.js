const mongoose = require('mongoose');

const moduleDiscussionSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  category: {
    type: String,
    enum: ['question', 'discussion', 'help', 'announcement', 'general'],
    default: 'discussion'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  replies: [{
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 3000
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    isEdited: {
      type: Boolean,
      default: false
    },
    editedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    }
  }],
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastReplyAt: {
    type: Date,
    default: Date.now
  },
  lastReplyBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

// Indexes for performance
moduleDiscussionSchema.index({ moduleId: 1, createdAt: -1 });
moduleDiscussionSchema.index({ authorId: 1, createdAt: -1 });
moduleDiscussionSchema.index({ category: 1, isPinned: -1, lastReplyAt: -1 });
moduleDiscussionSchema.index({ tags: 1 });
moduleDiscussionSchema.index({ isDeleted: 1, lastReplyAt: -1 });

// Virtual for reply count
moduleDiscussionSchema.virtual('replyCount').get(function() {
  return this.replies.filter(reply => !reply.isDeleted).length;
});

// Virtual for like count
moduleDiscussionSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for view count
moduleDiscussionSchema.virtual('viewCount').get(function() {
  return this.views.length;
});

// Method to add a reply
moduleDiscussionSchema.methods.addReply = function(authorId, content) {
  this.replies.push({
    authorId,
    content: content.trim(),
    createdAt: new Date()
  });
  
  this.lastReplyAt = new Date();
  this.lastReplyBy = authorId;
  
  return this.save();
};

// Method to like/unlike discussion
moduleDiscussionSchema.methods.toggleLike = function(userId) {
  const existingLike = this.likes.find(like => like.userId.equals(userId));
  
  if (existingLike) {
    // Remove like
    this.likes = this.likes.filter(like => !like.userId.equals(userId));
  } else {
    // Add like
    this.likes.push({
      userId,
      createdAt: new Date()
    });
  }
  
  return this.save();
};

// Method to add view
moduleDiscussionSchema.methods.addView = function(userId) {
  // Check if user already viewed this discussion recently (within last hour)
  const recentView = this.views.find(view => 
    view.userId.equals(userId) && 
    (Date.now() - view.viewedAt.getTime()) < 60 * 60 * 1000
  );
  
  if (!recentView) {
    this.views.push({
      userId,
      viewedAt: new Date()
    });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Method to edit discussion
moduleDiscussionSchema.methods.editDiscussion = function(title, content, editorId) {
  // Only author can edit
  if (!this.authorId.equals(editorId)) {
    throw new Error('Only the author can edit this discussion');
  }
  
  this.title = title.trim();
  this.content = content.trim();
  this.isEdited = true;
  this.editedAt = new Date();
  
  return this.save();
};

// Method to edit reply
moduleDiscussionSchema.methods.editReply = function(replyId, content, editorId) {
  const reply = this.replies.id(replyId);
  
  if (!reply) {
    throw new Error('Reply not found');
  }
  
  if (!reply.authorId.equals(editorId)) {
    throw new Error('Only the author can edit this reply');
  }
  
  reply.content = content.trim();
  reply.isEdited = true;
  reply.editedAt = new Date();
  
  return this.save();
};

// Method to delete reply
moduleDiscussionSchema.methods.deleteReply = function(replyId, deleterId) {
  const reply = this.replies.id(replyId);
  
  if (!reply) {
    throw new Error('Reply not found');
  }
  
  // Only author can delete their reply
  if (!reply.authorId.equals(deleterId)) {
    throw new Error('Only the author can delete this reply');
  }
  
  reply.isDeleted = true;
  reply.deletedAt = new Date();
  
  return this.save();
};

// Method to resolve discussion
moduleDiscussionSchema.methods.resolve = function(resolverId) {
  this.isResolved = true;
  this.resolvedAt = new Date();
  this.resolvedBy = resolverId;
  
  return this.save();
};

// Static method to get discussions for a module
moduleDiscussionSchema.statics.getModuleDiscussions = function(moduleId, options = {}) {
  const {
    category,
    sort = 'recent',
    page = 1,
    limit = 20,
    search
  } = options;
  
  const query = {
    moduleId,
    isDeleted: false
  };
  
  if (category && category !== 'all') {
    query.category = category;
  }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }
  
  let sortOptions = {};
  switch (sort) {
    case 'popular':
      sortOptions = { 'likes.length': -1, lastReplyAt: -1 };
      break;
    case 'oldest':
      sortOptions = { createdAt: 1 };
      break;
    case 'recent':
    default:
      sortOptions = { isPinned: -1, lastReplyAt: -1 };
  }
  
  return this.find(query)
    .populate('authorId', 'firstName lastName avatar role department')
    .populate('lastReplyBy', 'firstName lastName avatar')
    .populate('replies.authorId', 'firstName lastName avatar role department')
    .sort(sortOptions)
    .limit(limit)
    .skip((page - 1) * limit)
    .lean();
};

module.exports = mongoose.model('ModuleDiscussion', moduleDiscussionSchema);