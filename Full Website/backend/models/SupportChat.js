const mongoose = require('mongoose');

const supportChatSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'resolved', 'closed', 'abandoned'],
    default: 'waiting'
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'technical', 'account', 'training', 'escalation'],
    default: 'general'
  },
  messages: [{
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderType: {
      type: String,
      enum: ['user', 'agent', 'system', 'ai'],
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    messageType: {
      type: String,
      enum: ['text', 'file', 'system'],
      default: 'text'
    },
    attachments: [{
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String
    }],
    isRead: {
      type: Boolean,
      default: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      confidence: Number,
      isFinancialQuery: Boolean,
      model: String,
      generatedAt: String,
      error: String
    }
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: Date,
  waitTime: Number, // in seconds
  responseTime: Number, // average response time in seconds
  satisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    ratedAt: Date
  },
  escalatedToTicket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportTicket'
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    referrer: String,
    department: String
  },
  tags: [String],
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate unique session ID
supportChatSchema.pre('save', async function(next) {
  if (this.isNew) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.sessionId = `CHAT-${timestamp}-${random}`;
  }
  next();
});

// Calculate wait time and response time
supportChatSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'active' && !this.waitTime) {
      this.waitTime = Math.floor((Date.now() - this.startedAt.getTime()) / 1000);
    }
    if (this.status === 'resolved' || this.status === 'closed') {
      this.endedAt = new Date();
    }
  }
  
  // Calculate average response time
  if (this.isModified('messages') && this.messages.length > 1) {
    const agentMessages = this.messages.filter(msg => msg.senderType === 'agent');
    if (agentMessages.length > 0) {
      let totalResponseTime = 0;
      let responseCount = 0;
      
      for (let i = 1; i < this.messages.length; i++) {
        const currentMsg = this.messages[i];
        const previousMsg = this.messages[i - 1];
        
        if (currentMsg.senderType === 'agent' && previousMsg.senderType === 'user') {
          const responseTime = (currentMsg.timestamp.getTime() - previousMsg.timestamp.getTime()) / 1000;
          totalResponseTime += responseTime;
          responseCount++;
        }
      }
      
      if (responseCount > 0) {
        this.responseTime = Math.floor(totalResponseTime / responseCount);
      }
    }
  }
  
  next();
});

// Indexes for performance
supportChatSchema.index({ userId: 1, status: 1 });
supportChatSchema.index({ assignedAgent: 1, status: 1 });
supportChatSchema.index({ startedAt: -1 });
supportChatSchema.index({ status: 1, priority: 1 });

module.exports = mongoose.models.SupportChat || mongoose.model('SupportChat', supportChatSchema);