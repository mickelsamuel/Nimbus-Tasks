const mongoose = require('mongoose');

const teamMessageSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  channelId: {
    type: String,
    default: 'general'
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'image', 'announcement', 'system'],
    default: 'text'
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String
  }],
  mentions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['user', 'channel', 'everyone'],
      default: 'user'
    }
  }],
  reactions: [{
    emoji: String,
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    count: {
      type: Number,
      default: 0
    }
  }],
  edited: {
    isEdited: {
      type: Boolean,
      default: false
    },
    editedAt: Date,
    originalContent: String
  },
  thread: {
    parentMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMessage'
    },
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMessage'
    }],
    replyCount: {
      type: Number,
      default: 0
    }
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
teamMessageSchema.index({ teamId: 1, channelId: 1, createdAt: -1 });
teamMessageSchema.index({ authorId: 1, createdAt: -1 });
teamMessageSchema.index({ 'thread.parentMessageId': 1 });

// Virtual for author details
teamMessageSchema.virtual('author', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true
});

// Method to add reaction
teamMessageSchema.methods.addReaction = function(emoji, userId) {
  const existingReaction = this.reactions.find(r => r.emoji === emoji);
  
  if (existingReaction) {
    if (!existingReaction.users.includes(userId)) {
      existingReaction.users.push(userId);
      existingReaction.count += 1;
    }
  } else {
    this.reactions.push({
      emoji,
      users: [userId],
      count: 1
    });
  }
  
  return this.save();
};

// Method to remove reaction
teamMessageSchema.methods.removeReaction = function(emoji, userId) {
  const reactionIndex = this.reactions.findIndex(r => r.emoji === emoji);
  
  if (reactionIndex !== -1) {
    const reaction = this.reactions[reactionIndex];
    const userIndex = reaction.users.indexOf(userId);
    
    if (userIndex !== -1) {
      reaction.users.splice(userIndex, 1);
      reaction.count -= 1;
      
      if (reaction.count === 0) {
        this.reactions.splice(reactionIndex, 1);
      }
    }
  }
  
  return this.save();
};

// Method to edit message
teamMessageSchema.methods.editMessage = function(newContent, editorId) {
  // Only author can edit their own message
  if (!this.authorId.equals(editorId)) {
    throw new Error('Only the author can edit this message');
  }
  
  this.edited.originalContent = this.content;
  this.content = newContent;
  this.edited.isEdited = true;
  this.edited.editedAt = new Date();
  
  return this.save();
};

// Static method to get channel messages
teamMessageSchema.statics.getChannelMessages = function(teamId, channelId, page = 1, limit = 50) {
  return this.find({
    teamId,
    channelId,
    isDeleted: false,
    'thread.parentMessageId': { $exists: false } // Only root messages, not replies
  })
  .populate('authorId', 'firstName lastName avatar role department')
  .populate('mentions.userId', 'firstName lastName')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip((page - 1) * limit)
  .lean();
};

// Static method to get thread replies
teamMessageSchema.statics.getThreadReplies = function(parentMessageId, page = 1, limit = 20) {
  return this.find({
    'thread.parentMessageId': parentMessageId,
    isDeleted: false
  })
  .populate('authorId', 'firstName lastName avatar role department')
  .sort({ createdAt: 1 })
  .limit(limit)
  .skip((page - 1) * limit)
  .lean();
};

module.exports = mongoose.model('TeamMessage', teamMessageSchema);