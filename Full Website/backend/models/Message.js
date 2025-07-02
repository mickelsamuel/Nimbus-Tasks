const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Message Content
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'link', 'system', 'announcement'],
    default: 'text'
  },
  
  // Sender Information
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  senderName: String, // Cached for performance
  senderAvatar: String, // Cached for performance
  
  // Recipient Information (for direct messages)
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Team/Group Information (for team messages)
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  
  // Conversation Thread
  conversationId: {
    type: String,
    required: [true, 'Conversation ID is required']
  },
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message' // Reference to parent message for replies
  },
  
  // Message Status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  
  // Read Receipts (for team messages)
  readBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  
  // Delivery Status (for direct messages)
  deliveredAt: Date,
  readAt: Date,
  
  // Media & Attachments
  attachments: [{
    type: { type: String, enum: ['image', 'file', 'video', 'audio'] },
    filename: String,
    originalName: String,
    url: String,
    size: Number, // in bytes
    mimeType: String,
    thumbnailUrl: String // for images/videos
  }],
  
  // Rich Content
  richContent: {
    // For announcements or system messages
    title: String,
    description: String,
    actionButtons: [{
      text: String,
      action: String,
      url: String,
      style: { type: String, enum: ['primary', 'secondary', 'success', 'warning', 'danger'] }
    }],
    // For links
    linkPreview: {
      url: String,
      title: String,
      description: String,
      image: String,
      siteName: String
    },
    // For polls or questions
    poll: {
      question: String,
      options: [{
        text: String,
        votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
      }],
      multipleChoice: { type: Boolean, default: false },
      expiresAt: Date
    }
  },
  
  // Reactions & Interactions
  reactions: [{
    emoji: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    count: { type: Number, default: 0 }
  }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  replyCount: { type: Number, default: 0 },
  
  // Message Priority & Importance
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  isPinned: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false },
  editHistory: [{
    content: String,
    editedAt: { type: Date, default: Date.now }
  }],
  
  // Mentions & Notifications
  mentions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['user', 'everyone', 'here'] },
    position: Number // Character position in message
  }],
  
  // Moderation
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isHidden: { type: Boolean, default: false },
  hiddenReason: String,
  
  // Auto-delete (for temporary messages)
  expiresAt: Date,
  
  // AI Assistant Context (if applicable)
  aiContext: {
    isAIResponse: { type: Boolean, default: false },
    confidence: Number,
    sources: [String],
    relatedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }]
  },
  
  // Analytics
  analytics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }, // For links
    shares: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ team: 1, createdAt: -1 });
messageSchema.index({ threadId: 1, createdAt: 1 });
messageSchema.index({ status: 1 });
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
messageSchema.index({ content: 'text' });

// Virtual for formatted timestamp
messageSchema.virtual('formattedTime').get(function() {
  const now = new Date();
  const messageTime = this.createdAt;
  const diffMs = now - messageTime;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) {return 'Just now';}
  if (diffMins < 60) {return `${diffMins}m ago`;}
  if (diffHours < 24) {return `${diffHours}h ago`;}
  if (diffDays < 7) {return `${diffDays}d ago`;}
  
  return messageTime.toLocaleDateString();
});

// Virtual for read status in team messages
messageSchema.virtual('readByCount').get(function() {
  return this.readBy ? this.readBy.length : 0;
});

// Virtual for total reaction count
messageSchema.virtual('totalReactions').get(function() {
  return this.reactions.reduce((total, reaction) => total + reaction.count, 0);
});

// Pre-save middleware
messageSchema.pre('save', function(next) {
  // Update reaction counts
  this.reactions.forEach(reaction => {
    reaction.count = reaction.users.length;
  });
  
  // Cache sender info for performance
  if (this.isModified('sender') && this.populated('sender')) {
    this.senderName = this.sender.fullName;
    this.senderAvatar = this.sender.avatar;
  }
  
  next();
});

// Method to add reaction
messageSchema.methods.addReaction = function(userId, emoji) {
  let reaction = this.reactions.find(r => r.emoji === emoji);
  
  if (!reaction) {
    // Create new reaction
    reaction = { emoji, users: [], count: 0 };
    this.reactions.push(reaction);
  }
  
  // Toggle user reaction
  const userIndex = reaction.users.findIndex(id => id.equals(userId));
  if (userIndex > -1) {
    // Remove reaction
    reaction.users.splice(userIndex, 1);
    if (reaction.users.length === 0) {
      // Remove empty reaction
      this.reactions = this.reactions.filter(r => r.emoji !== emoji);
    }
  } else {
    // Add reaction
    reaction.users.push(userId);
  }
  
  return this.save();
};

// Method to mark as read
messageSchema.methods.markAsRead = function(userId) {
  if (this.recipient && this.recipient.equals(userId)) {
    // Direct message
    this.status = 'read';
    this.readAt = new Date();
  } else if (this.team) {
    // Team message
    const existingRead = this.readBy.find(r => r.userId.equals(userId));
    if (!existingRead) {
      this.readBy.push({
        userId,
        readAt: new Date()
      });
    }
  }
  
  return this.save();
};

// Method to edit message
messageSchema.methods.editContent = function(newContent, editorId) {
  // Only sender can edit (or admin in team context)
  if (!this.sender.equals(editorId)) {
    throw new Error('Only the sender can edit this message');
  }
  
  // Save edit history
  this.editHistory.push({
    content: this.content,
    editedAt: new Date()
  });
  
  this.content = newContent;
  this.isEdited = true;
  
  return this.save();
};

// Method to delete message
messageSchema.methods.deleteMessage = function(deleterId, reason = null) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deleterId;
  if (reason) {
    this.hiddenReason = reason;
  }
  
  // Clear sensitive content but keep metadata
  this.content = '[Message deleted]';
  this.attachments = [];
  
  return this.save();
};

// Static method to get conversation messages
messageSchema.statics.getConversation = function(conversationId, options = {}) {
  const { limit = 50, skip = 0, before = null } = options;
  
  const query = {
    conversationId,
    isDeleted: false
  };
  
  if (before) {
    query.createdAt = { $lt: before };
  }
  
  return this.find(query)
    .populate('sender', 'firstName lastName avatar')
    .populate('recipient', 'firstName lastName avatar')
    .populate('team', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get unread messages for user
messageSchema.statics.getUnreadForUser = function(userId) {
  return this.find({
    $or: [
      // Direct messages to user
      {
        recipient: userId,
        status: { $in: ['sent', 'delivered'] },
        isDeleted: false
      },
      // Team messages where user hasn't read
      {
        team: { $exists: true },
        'readBy.userId': { $ne: userId },
        sender: { $ne: userId },
        isDeleted: false
      }
    ]
  })
  .populate('sender', 'firstName lastName avatar')
  .populate('team', 'name avatar')
  .sort({ createdAt: -1 });
};

// Static method to search messages
messageSchema.statics.searchMessages = function(userId, query, options = {}) {
  const { conversationId, type, limit = 20 } = options;
  
  const searchQuery = {
    $text: { $search: query },
    isDeleted: false,
    $or: [
      { sender: userId },
      { recipient: userId },
      { 'readBy.userId': userId }
    ]
  };
  
  if (conversationId) {
    searchQuery.conversationId = conversationId;
  }
  
  if (type) {
    searchQuery.type = type;
  }
  
  return this.find(searchQuery)
    .populate('sender', 'firstName lastName avatar')
    .populate('recipient', 'firstName lastName avatar')
    .populate('team', 'name avatar')
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .limit(limit);
};

// Static method to create conversation ID
messageSchema.statics.createConversationId = function(userId1, userId2, teamId = null) {
  if (teamId) {
    return `team_${teamId}`;
  } else {
    // For direct messages, create consistent ID regardless of order
    const ids = [userId1.toString(), userId2.toString()].sort();
    return `dm_${ids[0]}_${ids[1]}`;
  }
};

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = Message;