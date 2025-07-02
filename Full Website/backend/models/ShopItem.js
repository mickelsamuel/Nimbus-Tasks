const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  description: {
    type: String,
    required: true,
    maxLength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['avatar', 'clothing', 'accessories', 'frames', 'titles', 'auras', 'emotes', 'themes', 'bundles', 'consumables']
  },
  rarity: {
    type: String,
    required: true,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']
  },
  price: {
    coins: { type: Number, min: 0 },
    tokens: { type: Number, min: 0 }
  },
  originalPrice: {
    coins: { type: Number, min: 0 },
    tokens: { type: Number, min: 0 }
  },
  images: {
    thumbnail: { type: String, required: true },
    preview: { type: String },
    showcase: { type: String }
  },
  metadata: {
    isNew: { type: Boolean, default: false },
    isHot: { type: Boolean, default: false },
    isLimited: { type: Boolean, default: false },
    isExclusive: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  discount: {
    percentage: { type: Number, min: 0, max: 100 },
    startDate: { type: Date },
    endDate: { type: Date }
  },
  limitedTime: {
    endDate: { type: Date },
    stock: { type: Number, min: 0 }
  },
  stats: {
    views: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 }
  },
  bonuses: {
    professionalRating: { type: Number, default: 0 },
    confidenceBoost: { type: Number, default: 0 },
    teamSynergy: { type: Number, default: 0 }
  },
  tags: [{ type: String, trim: true }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
shopItemSchema.index({ category: 1, rarity: 1 });
shopItemSchema.index({ 'metadata.isFeatured': 1 });
shopItemSchema.index({ 'metadata.isLimited': 1 });
shopItemSchema.index({ 'metadata.isNew': 1 });
shopItemSchema.index({ createdAt: -1 });
shopItemSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for current discount status
shopItemSchema.virtual('currentDiscount').get(function() {
  if (!this.discount.percentage || !this.discount.endDate) {return null;}
  
  const now = new Date();
  if (now <= this.discount.endDate && now >= this.discount.startDate) {
    return this.discount.percentage;
  }
  return null;
});

// Virtual for discounted price
shopItemSchema.virtual('discountedPrice').get(function() {
  const discount = this.currentDiscount;
  if (!discount) {return this.price;}
  
  const discountedPrice = {};
  Object.keys(this.price).forEach(currency => {
    if (this.price[currency]) {
      discountedPrice[currency] = Math.round(this.price[currency] * (1 - discount / 100));
    }
  });
  return discountedPrice;
});

// Virtual for main price currency
shopItemSchema.virtual('mainPrice').get(function() {
  if (this.price.tokens) {return { amount: this.price.tokens, type: 'tokens' };}
  if (this.price.coins) {return { amount: this.price.coins, type: 'coins' };}
  return { amount: 0, type: 'coins' };
});

// Methods
shopItemSchema.methods.canUserAfford = function(userWallet) {
  const price = this.discountedPrice;
  if (price.coins && userWallet.coins >= price.coins) {return true;}
  if (price.tokens && userWallet.tokens >= price.tokens) {return true;}
  return false;
};

shopItemSchema.methods.incrementView = function() {
  this.stats.views += 1;
  return this.save();
};

shopItemSchema.methods.incrementPurchase = function() {
  this.stats.purchases += 1;
  return this.save();
};

// Static methods
shopItemSchema.statics.getFeaturedItems = function(limit = 10) {
  return this.find({ 'metadata.isFeatured': true, 'metadata.isActive': true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

shopItemSchema.statics.getLimitedItems = function(limit = 10) {
  return this.find({ 
    'metadata.isLimited': true, 
    'metadata.isActive': true,
    'limitedTime.endDate': { $gt: new Date() }
  })
    .sort({ 'limitedTime.endDate': 1 })
    .limit(limit);
};

shopItemSchema.statics.getNewItems = function(limit = 10) {
  return this.find({ 'metadata.isNew': true, 'metadata.isActive': true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

shopItemSchema.statics.searchItems = function(query, filters = {}) {
  const searchCriteria = { 'metadata.isActive': true };
  
  // Text search
  if (query) {
    searchCriteria.$text = { $search: query };
  }
  
  // Category filter
  if (filters.category && filters.category !== 'all') {
    searchCriteria.category = filters.category;
  }
  
  // Rarity filter
  if (filters.rarity && filters.rarity !== 'all') {
    searchCriteria.rarity = filters.rarity;
  }
  
  // Price range filter
  if (filters.minPrice || filters.maxPrice) {
    // This would need more complex logic for multiple currencies
  }
  
  let queryBuilder = this.find(searchCriteria);
  
  // Sorting
  switch (filters.sortBy) {
    case 'price-low':
      queryBuilder = queryBuilder.sort({ 'price.coins': 1, 'price.tokens': 1 });
      break;
    case 'price-high':
      queryBuilder = queryBuilder.sort({ 'price.coins': -1, 'price.tokens': -1 });
      break;
    case 'newest':
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
      break;
    case 'popular':
      queryBuilder = queryBuilder.sort({ 'stats.purchases': -1, 'stats.views': -1 });
      break;
    case 'rarity':
      queryBuilder = queryBuilder.sort({ 
        rarity: { $switch: {
          branches: [
            { case: { $eq: ['$rarity', 'legendary'] }, then: 5 },
            { case: { $eq: ['$rarity', 'epic'] }, then: 4 },
            { case: { $eq: ['$rarity', 'rare'] }, then: 3 },
            { case: { $eq: ['$rarity', 'uncommon'] }, then: 2 },
            { case: { $eq: ['$rarity', 'common'] }, then: 1 }
          ],
          default: 0
        }}
      });
      break;
    default:
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
  }
  
  return queryBuilder;
};

module.exports = mongoose.model('ShopItem', shopItemSchema);