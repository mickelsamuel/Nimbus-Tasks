const mongoose = require('mongoose');

const userPurchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shopItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopItem',
    required: true
  },
  purchaseDetails: {
    price: {
      coins: { type: Number, min: 0 },
      tokens: { type: Number, min: 0 }
    },
    currency: {
      type: String,
      enum: ['coins', 'tokens'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    discountApplied: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  metadata: {
    userIP: { type: String },
    userAgent: { type: String },
    platform: { type: String },
    source: { type: String, default: 'web' }
  }
}, {
  timestamps: true
});

// Indexes
userPurchaseSchema.index({ user: 1, createdAt: -1 });
userPurchaseSchema.index({ shopItem: 1 });
// transactionId already has unique: true which creates an index
userPurchaseSchema.index({ status: 1 });
userPurchaseSchema.index({ createdAt: -1 });

// Static methods
userPurchaseSchema.statics.getUserPurchases = function(userId, limit = 20, skip = 0) {
  return this.find({ user: userId, status: 'completed' })
    .populate('shopItem', 'name category rarity images')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

userPurchaseSchema.statics.hasUserPurchased = function(userId, itemId) {
  return this.findOne({ 
    user: userId, 
    shopItem: itemId, 
    status: 'completed' 
  });
};

userPurchaseSchema.statics.getUserOwnedItems = function(userId) {
  return this.find({ 
    user: userId, 
    status: 'completed' 
  })
  .populate('shopItem')
  .sort({ createdAt: -1 });
};

// Generate unique transaction ID
userPurchaseSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

module.exports = mongoose.model('UserPurchase', userPurchaseSchema);