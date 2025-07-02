const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'Stock symbol is required'],
    uppercase: true,
    trim: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  shares: {
    type: Number,
    required: [true, 'Number of shares is required'],
    min: [0, 'Shares cannot be negative']
  },
  avgPrice: {
    type: Number,
    required: [true, 'Average price is required'],
    min: [0, 'Price cannot be negative']
  },
  currentPrice: {
    type: Number,
    required: [true, 'Current price is required'],
    min: [0, 'Price cannot be negative']
  },
  totalValue: {
    type: Number,
    required: [true, 'Total value is required']
  },
  totalCost: {
    type: Number,
    required: [true, 'Total cost is required']
  },
  gainLoss: {
    type: Number,
    default: 0
  },
  gainLossPercent: {
    type: Number,
    default: 0
  },
  dayChange: {
    type: Number,
    default: 0
  },
  dayChangePercent: {
    type: Number,
    default: 0
  },
  sector: String,
  industry: String,
  purchasedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const orderSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'Stock symbol is required'],
    uppercase: true,
    trim: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  type: {
    type: String,
    required: [true, 'Order type is required'],
    enum: ['BUY', 'SELL']
  },
  orderType: {
    type: String,
    required: [true, 'Order type is required'],
    enum: ['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'],
    default: 'MARKET'
  },
  shares: {
    type: Number,
    required: [true, 'Number of shares is required'],
    min: [1, 'Must order at least 1 share']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  limitPrice: Number, // For limit orders
  stopPrice: Number,  // For stop orders
  totalValue: {
    type: Number,
    required: [true, 'Total value is required']
  },
  fees: {
    type: Number,
    default: 9.99 // Standard trading fee
  },
  status: {
    type: String,
    enum: ['PENDING', 'FILLED', 'PARTIALLY_FILLED', 'CANCELLED', 'EXPIRED'],
    default: 'PENDING'
  },
  filledShares: {
    type: Number,
    default: 0
  },
  filledPrice: Number,
  placedAt: {
    type: Date,
    default: Date.now
  },
  executedAt: Date,
  expiresAt: Date,
  notes: String
}, {
  timestamps: true
});

const portfolioSchema = new mongoose.Schema({
  // Owner
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  
  // Account Information
  accountType: {
    type: String,
    enum: ['PRACTICE', 'COMPETITION', 'EDUCATIONAL'],
    default: 'PRACTICE'
  },
  accountName: {
    type: String,
    default: 'My Portfolio'
  },
  
  // Financial Summary
  balance: {
    cash: {
      type: Number,
      default: 100000, // Starting with $100k virtual money
      min: [0, 'Cash balance cannot be negative']
    },
    invested: {
      type: Number,
      default: 0
    },
    totalValue: {
      type: Number,
      default: 100000
    }
  },
  
  // Performance Metrics
  performance: {
    totalGainLoss: {
      type: Number,
      default: 0
    },
    totalGainLossPercent: {
      type: Number,
      default: 0
    },
    dayGainLoss: {
      type: Number,
      default: 0
    },
    dayGainLossPercent: {
      type: Number,
      default: 0
    },
    weekGainLoss: {
      type: Number,
      default: 0
    },
    monthGainLoss: {
      type: Number,
      default: 0
    },
    yearGainLoss: {
      type: Number,
      default: 0
    },
    allTimeHigh: {
      type: Number,
      default: 100000
    },
    allTimeLow: {
      type: Number,
      default: 100000
    },
    maxDrawdown: {
      type: Number,
      default: 0
    }
  },
  
  // Risk Metrics
  risk: {
    level: {
      type: String,
      enum: ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE', 'VERY_AGGRESSIVE'],
      default: 'MODERATE'
    },
    volatility: {
      type: Number,
      default: 0
    },
    sharpeRatio: {
      type: Number,
      default: 0
    },
    beta: {
      type: Number,
      default: 1
    },
    diversificationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  
  // Holdings
  positions: [positionSchema],
  
  // Trading Activity
  orders: [orderSchema],
  
  // Historical Performance
  history: [{
    date: {
      type: Date,
      default: Date.now
    },
    totalValue: Number,
    cash: Number,
    invested: Number,
    gainLoss: Number,
    gainLossPercent: Number,
    trades: Number
  }],
  
  // Statistics
  stats: {
    totalTrades: {
      type: Number,
      default: 0
    },
    winningTrades: {
      type: Number,
      default: 0
    },
    losingTrades: {
      type: Number,
      default: 0
    },
    winRate: {
      type: Number,
      default: 0
    },
    avgWin: {
      type: Number,
      default: 0
    },
    avgLoss: {
      type: Number,
      default: 0
    },
    profitFactor: {
      type: Number,
      default: 0
    },
    avgHoldingPeriod: {
      type: Number,
      default: 0
    }, // in days
    sectorsTraded: [String],
    mostTradedSymbol: String,
    largestWin: {
      symbol: String,
      amount: { type: Number, default: 0 },
      percent: { type: Number, default: 0 }
    },
    largestLoss: {
      symbol: String,
      amount: { type: Number, default: 0 },
      percent: { type: Number, default: 0 }
    }
  },
  
  // Achievements & Challenges
  challengesCompleted: [{
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TradingChallenge' },
    completedAt: { type: Date, default: Date.now },
    score: Number,
    rank: Number,
    reward: {
      points: Number,
      coins: Number,
      badge: String
    }
  }],
  
  // Settings & Preferences
  settings: {
    riskTolerance: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM'
    },
    autoRebalance: {
      type: Boolean,
      default: false
    },
    notifications: {
      priceAlerts: { type: Boolean, default: true },
      orderFills: { type: Boolean, default: true },
      marketNews: { type: Boolean, default: true },
      performanceUpdates: { type: Boolean, default: true }
    },
    displayCurrency: {
      type: String,
      default: 'CAD'
    },
    tradingHours: {
      type: String,
      enum: ['MARKET_HOURS', 'EXTENDED_HOURS', 'ALWAYS'],
      default: 'MARKET_HOURS'
    }
  },
  
  // Watchlists
  watchlists: [{
    name: {
      type: String,
      default: 'My Watchlist'
    },
    symbols: [{
      symbol: String,
      addedAt: { type: Date, default: Date.now },
      notes: String,
      alertPrice: Number,
      alertType: { type: String, enum: ['ABOVE', 'BELOW'] }
    }],
    isDefault: { type: Boolean, default: false }
  }],
  
  // Educational Progress
  education: {
    modulesCompleted: [{
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
      completedAt: { type: Date, default: Date.now },
      score: Number
    }],
    knowledgeLevel: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
      default: 'BEGINNER'
    },
    certifications: [String],
    skillPoints: {
      technicalAnalysis: { type: Number, default: 0 },
      fundamentalAnalysis: { type: Number, default: 0 },
      riskManagement: { type: Number, default: 0 },
      portfolioManagement: { type: Number, default: 0 },
      optionsTrading: { type: Number, default: 0 }
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  lastTrade: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
// userId already has unique: true which creates an index
portfolioSchema.index({ 'balance.totalValue': -1 });
portfolioSchema.index({ 'performance.totalGainLossPercent': -1 });
portfolioSchema.index({ accountType: 1 });
portfolioSchema.index({ isActive: 1 });

// Virtual for total portfolio value
portfolioSchema.virtual('currentValue').get(function() {
  return this.balance.cash + this.balance.invested;
});

// Virtual for number of positions
portfolioSchema.virtual('positionCount').get(function() {
  return this.positions ? this.positions.length : 0;
});

// Virtual for diversification by sector
portfolioSchema.virtual('sectorDiversification').get(function() {
  if (!this.positions || this.positions.length === 0) {return {};}
  
  const sectorAllocation = {};
  let totalValue = 0;
  
  this.positions.forEach(position => {
    const sector = position.sector || 'Unknown';
    if (!sectorAllocation[sector]) {
      sectorAllocation[sector] = 0;
    }
    sectorAllocation[sector] += position.totalValue;
    totalValue += position.totalValue;
  });
  
  // Convert to percentages
  Object.keys(sectorAllocation).forEach(sector => {
    sectorAllocation[sector] = Math.round((sectorAllocation[sector] / totalValue) * 100);
  });
  
  return sectorAllocation;
});

// Pre-save middleware to update calculated fields
portfolioSchema.pre('save', function(next) {
  // Update total invested amount
  this.balance.invested = this.positions.reduce((total, position) => {
    return total + position.totalValue;
  }, 0);
  
  // Update total portfolio value
  this.balance.totalValue = this.balance.cash + this.balance.invested;
  
  // Update performance metrics
  const initialValue = 100000; // Starting amount
  this.performance.totalGainLoss = this.balance.totalValue - initialValue;
  this.performance.totalGainLossPercent = ((this.balance.totalValue - initialValue) / initialValue) * 100;
  
  // Update all-time high/low
  if (this.balance.totalValue > this.performance.allTimeHigh) {
    this.performance.allTimeHigh = this.balance.totalValue;
  }
  if (this.balance.totalValue < this.performance.allTimeLow) {
    this.performance.allTimeLow = this.balance.totalValue;
  }
  
  // Update drawdown
  this.performance.maxDrawdown = ((this.performance.allTimeHigh - this.balance.totalValue) / this.performance.allTimeHigh) * 100;
  
  // Update diversification score
  this.risk.diversificationScore = this.calculateDiversificationScore();
  
  this.lastUpdated = new Date();
  next();
});

// Method to calculate diversification score
portfolioSchema.methods.calculateDiversificationScore = function() {
  if (!this.positions || this.positions.length === 0) {return 0;}
  
  const sectorAllocation = this.sectorDiversification;
  const sectors = Object.keys(sectorAllocation);
  
  if (sectors.length === 1) {return 20;} // Single sector = low diversification
  if (sectors.length >= 8) {return 100;} // 8+ sectors = excellent diversification
  
  // Calculate based on number of sectors and balance
  const baseScore = (sectors.length / 8) * 80;
  
  // Penalty for concentration (any sector > 40%)
  const maxSectorWeight = Math.max(...Object.values(sectorAllocation));
  const concentrationPenalty = maxSectorWeight > 40 ? (maxSectorWeight - 40) * 0.5 : 0;
  
  return Math.max(20, Math.min(100, baseScore - concentrationPenalty));
};

// Method to add position
portfolioSchema.methods.addPosition = function(symbol, companyName, shares, price, sector, industry) {
  const existingPosition = this.positions.find(pos => pos.symbol === symbol);
  
  if (existingPosition) {
    // Update existing position (average down/up)
    const totalShares = existingPosition.shares + shares;
    const totalCost = (existingPosition.shares * existingPosition.avgPrice) + (shares * price);
    existingPosition.avgPrice = totalCost / totalShares;
    existingPosition.shares = totalShares;
    existingPosition.totalCost = totalCost;
    existingPosition.totalValue = totalShares * price;
    existingPosition.currentPrice = price;
  } else {
    // Add new position
    this.positions.push({
      symbol,
      companyName,
      shares,
      avgPrice: price,
      currentPrice: price,
      totalValue: shares * price,
      totalCost: shares * price,
      sector,
      industry,
      purchasedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to remove/reduce position
portfolioSchema.methods.reducePosition = function(symbol, shares, currentPrice) {
  const position = this.positions.find(pos => pos.symbol === symbol);
  if (!position) {
    throw new Error('Position not found');
  }
  
  if (shares >= position.shares) {
    // Remove entire position
    this.positions = this.positions.filter(pos => pos.symbol !== symbol);
  } else {
    // Reduce position
    position.shares -= shares;
    position.totalValue = position.shares * currentPrice;
    position.currentPrice = currentPrice;
  }
  
  return this.save();
};

// Method to update all position prices
portfolioSchema.methods.updatePositionPrices = function(marketData) {
  this.positions.forEach(position => {
    const marketPrice = marketData[position.symbol];
    if (marketPrice) {
      const oldPrice = position.currentPrice;
      position.currentPrice = marketPrice.price;
      position.totalValue = position.shares * marketPrice.price;
      position.gainLoss = position.totalValue - position.totalCost;
      position.gainLossPercent = ((position.totalValue - position.totalCost) / position.totalCost) * 100;
      position.dayChange = (marketPrice.price - oldPrice) * position.shares;
      position.dayChangePercent = ((marketPrice.price - oldPrice) / oldPrice) * 100;
      position.lastUpdated = new Date();
    }
  });
  
  return this.save();
};

// Method to execute order
portfolioSchema.methods.executeOrder = function(orderId, fillPrice = null, fillShares = null) {
  const order = this.orders.find(o => o._id.equals(orderId));
  if (!order || order.status !== 'PENDING') {
    throw new Error('Order not found or not pending');
  }
  
  const executionPrice = fillPrice || order.price;
  const executionShares = fillShares || order.shares;
  const totalCost = executionShares * executionPrice + order.fees;
  
  if (order.type === 'BUY') {
    // Check if enough cash
    if (this.balance.cash < totalCost) {
      throw new Error('Insufficient funds');
    }
    
    // Deduct cash
    this.balance.cash -= totalCost;
    
    // Add to position
    this.addPosition(order.symbol, order.companyName, executionShares, executionPrice);
  } else { // SELL
    // Find position
    const position = this.positions.find(pos => pos.symbol === order.symbol);
    if (!position || position.shares < executionShares) {
      throw new Error('Insufficient shares');
    }
    
    // Add cash (subtract fees)
    this.balance.cash += (executionShares * executionPrice) - order.fees;
    
    // Remove from position
    this.reducePosition(order.symbol, executionShares, executionPrice);
  }
  
  // Update order status
  order.status = 'FILLED';
  order.filledShares = executionShares;
  order.filledPrice = executionPrice;
  order.executedAt = new Date();
  
  // Update stats
  this.stats.totalTrades += 1;
  this.lastTrade = new Date();
  
  return this.save();
};

// Static method to get leaderboard
portfolioSchema.statics.getLeaderboard = function(period = 'all', limit = 10) {
  let sortField = 'performance.totalGainLossPercent';
  
  switch (period) {
    case 'day':
      sortField = 'performance.dayGainLossPercent';
      break;
    case 'week':
      sortField = 'performance.weekGainLoss';
      break;
    case 'month':
      sortField = 'performance.monthGainLoss';
      break;
    case 'year':
      sortField = 'performance.yearGainLoss';
      break;
  }
  
  return this.find({ isActive: true, isPublic: true })
    .populate('userId', 'firstName lastName avatar')
    .sort({ [sortField]: -1 })
    .limit(limit);
};

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;