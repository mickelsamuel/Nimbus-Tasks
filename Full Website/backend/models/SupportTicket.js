const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: true,
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['account', 'system', 'training', 'feature', 'escalation'],
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting_response', 'resolved', 'closed'],
    default: 'open'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  responses: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    isStaff: {
      type: Boolean,
      default: false
    },
    attachments: [{
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  slaDeadline: {
    type: Date,
    required: true
  },
  resolvedAt: Date,
  escalatedAt: Date,
  escalationReason: String,
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    ratedAt: Date
  },
  tags: [String],
  lastResponseAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate unique ticket ID
supportTicketSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('SupportTicket').countDocuments();
    this.ticketId = `BNC-${String(count + 1).padStart(6, '0')}`;
    
    // Set SLA deadline based on priority
    const slaHours = {
      critical: 0.25, // 15 minutes
      high: 1,        // 1 hour
      medium: 4,      // 4 hours
      low: 24         // 24 hours
    };
    
    this.slaDeadline = new Date(Date.now() + (slaHours[this.priority] * 60 * 60 * 1000));
  }
  next();
});

// Update lastResponseAt when responses are added
supportTicketSchema.pre('save', function(next) {
  if (this.isModified('responses') && this.responses.length > 0) {
    this.lastResponseAt = this.responses[this.responses.length - 1].createdAt;
  }
  next();
});

// Indexes for performance
supportTicketSchema.index({ userId: 1, status: 1 });
supportTicketSchema.index({ priority: 1, status: 1 });
supportTicketSchema.index({ slaDeadline: 1 });
supportTicketSchema.index({ createdAt: -1 });

module.exports = mongoose.models.SupportTicket || mongoose.model('SupportTicket', supportTicketSchema);