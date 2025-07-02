const mongoose = require('mongoose');

const marketDataSchema = new mongoose.Schema({
  // Stock/Security Identification
  symbol: {
    type: String,
    required: [true, 'Symbol is required'],
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Company/Security name is required'],
    trim: true
  },
  exchange: {
    type: String,
    enum: ['TSX', 'TSX-V', 'NYSE', 'NASDAQ', 'CSE'],
    default: 'TSX'
  },
  
  // Current Price Data
  price: {
    current: {
      type: Number,
      required: [true, 'Current price is required'],
      min: [0, 'Price cannot be negative']
    },
    open: {
      type: Number,
      required: [true, 'Opening price is required']
    },
    high: {
      type: Number,
      required: [true, 'High price is required']
    },
    low: {
      type: Number,
      required: [true, 'Low price is required']
    },
    close: {
      type: Number,
      required: [true, 'Previous close is required']
    }
  },
  
  // Change Data
  change: {
    absolute: {
      type: Number,
      required: [true, 'Price change is required']
    },
    percent: {
      type: Number,
      required: [true, 'Percentage change is required']
    }
  },
  
  // Volume & Trading Data
  volume: {
    current: {
      type: Number,
      default: 0,
      min: [0, 'Volume cannot be negative']
    },
    average: {
      type: Number,
      default: 0
    },
    previous: {
      type: Number,
      default: 0
    }
  },
  
  // Market Cap & Valuation
  marketCap: {
    type: Number,
    min: [0, 'Market cap cannot be negative']
  },
  sharesOutstanding: {
    type: Number,
    min: [0, 'Shares outstanding cannot be negative']
  },
  
  // Trading Range
  fiftyTwoWeek: {
    high: Number,
    low: Number,
    highDate: Date,
    lowDate: Date
  },
  
  // Company Information
  sector: {
    type: String,
    enum: [
      'Technology',
      'Healthcare',
      'Financials',
      'Energy',
      'Materials',
      'Industrials',
      'Consumer Discretionary',
      'Consumer Staples',
      'Utilities',
      'Real Estate',
      'Communication Services'
    ]
  },
  industry: String,
  country: {
    type: String,
    default: 'Canada'
  },
  currency: {
    type: String,
    default: 'CAD',
    enum: ['CAD', 'USD', 'EUR', 'GBP']
  },
  
  // Financial Ratios
  ratios: {
    peRatio: Number,
    pegRatio: Number,
    priceToBook: Number,
    priceToSales: Number,
    dividendYield: Number,
    beta: Number,
    eps: Number, // Earnings per share
    roe: Number, // Return on equity
    roa: Number, // Return on assets
    debtToEquity: Number
  },
  
  // Dividend Information
  dividend: {
    rate: Number, // Annual dividend rate
    yield: Number, // Dividend yield percentage
    exDate: Date, // Ex-dividend date
    payDate: Date, // Payment date
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'semi-annually', 'annually', 'none'],
      default: 'none'
    }
  },
  
  // Historical Data (for charts)
  history: [{
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    adjustedClose: Number
  }],
  
  // Technical Indicators
  technical: {
    rsi: Number, // Relative Strength Index
    macd: {
      line: Number,
      signal: Number,
      histogram: Number
    },
    movingAverages: {
      sma20: Number, // 20-day Simple Moving Average
      sma50: Number, // 50-day Simple Moving Average
      sma200: Number, // 200-day Simple Moving Average
      ema12: Number, // 12-day Exponential Moving Average
      ema26: Number // 26-day Exponential Moving Average
    },
    bollinger: {
      upper: Number,
      middle: Number,
      lower: Number
    },
    stochastic: {
      k: Number,
      d: Number
    }
  },
  
  // News & Events Impact
  news: [{
    headline: String,
    summary: String,
    url: String,
    publishedAt: Date,
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
    impact: { type: String, enum: ['low', 'medium', 'high'] }
  }],
  
  // Analyst Data
  analyst: {
    rating: {
      type: String,
      enum: ['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell']
    },
    targetPrice: Number,
    consensus: {
      strongBuy: { type: Number, default: 0 },
      buy: { type: Number, default: 0 },
      hold: { type: Number, default: 0 },
      sell: { type: Number, default: 0 },
      strongSell: { type: Number, default: 0 }
    },
    priceTargets: {
      high: Number,
      average: Number,
      low: Number
    }
  },
  
  // Market Status
  marketStatus: {
    type: String,
    enum: ['open', 'closed', 'pre_market', 'after_hours'],
    default: 'closed'
  },
  
  // Data Quality & Sources
  dataSource: {
    type: String,
    enum: ['Yahoo Finance', 'Alpha Vantage', 'IEX Cloud', 'Simulated'],
    default: 'Simulated'
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  
  // Educational Context
  educational: {
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    description: String,
    keyPoints: [String],
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'very_high'],
      default: 'medium'
    },
    volatility: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    recommendedFor: [String] // e.g., ['beginners', 'growth_investors', 'income_investors']
  },
  
  // Status & Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  isTradeable: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Simulation Parameters
  simulation: {
    volatilityMultiplier: {
      type: Number,
      default: 1.0,
      min: 0.1,
      max: 3.0
    },
    trendBias: {
      type: Number,
      default: 0,
      min: -1,
      max: 1
    },
    eventProbability: {
      type: Number,
      default: 0.05,
      min: 0,
      max: 1
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
marketDataSchema.index({ symbol: 1 });
marketDataSchema.index({ sector: 1, industry: 1 });
marketDataSchema.index({ exchange: 1 });
marketDataSchema.index({ marketCap: -1 });
marketDataSchema.index({ 'change.percent': -1 });
marketDataSchema.index({ 'volume.current': -1 });
marketDataSchema.index({ lastUpdated: -1 });
marketDataSchema.index({ isActive: 1, isTradeable: 1 });

// Virtual for market performance
marketDataSchema.virtual('performance').get(function() {
  const changePercent = this.change.percent;
  if (changePercent > 5) {return 'excellent';}
  if (changePercent > 2) {return 'good';}
  if (changePercent > -2) {return 'neutral';}
  if (changePercent > -5) {return 'poor';}
  return 'very_poor';
});

// Virtual for risk category
marketDataSchema.virtual('riskCategory').get(function() {
  const beta = this.ratios?.beta || 1;
  const volatility = Math.abs(this.change.percent);
  
  if (beta > 1.5 || volatility > 5) {return 'high';}
  if (beta > 1.2 || volatility > 3) {return 'medium';}
  return 'low';
});

// Virtual for investment grade
marketDataSchema.virtual('investmentGrade').get(function() {
  const marketCap = this.marketCap || 0;
  const peRatio = this.ratios?.peRatio || 0;
  const dividendYield = this.dividend?.yield || 0;
  
  let score = 0;
  
  // Market cap score
  if (marketCap > 10000000000) {score += 3;} // Large cap
  else if (marketCap > 2000000000) {score += 2;} // Mid cap
  else {score += 1;} // Small cap
  
  // P/E ratio score
  if (peRatio > 0 && peRatio < 20) {score += 2;}
  else if (peRatio < 30) {score += 1;}
  
  // Dividend score
  if (dividendYield > 3) {score += 2;}
  else if (dividendYield > 1) {score += 1;}
  
  if (score >= 6) {return 'A';}
  if (score >= 4) {return 'B';}
  if (score >= 2) {return 'C';}
  return 'D';
});

// Method to update price with simulation
marketDataSchema.methods.simulateUpdate = function() {
  const baseVolatility = 0.02; // 2% base daily volatility
  const volatility = baseVolatility * this.simulation.volatilityMultiplier;
  const trend = this.simulation.trendBias * 0.001; // Small trend component
  
  // Generate random price movement
  const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
  const priceChange = this.price.current * (trend + volatility * randomFactor);
  
  // Update prices
  this.price.close = this.price.current;
  this.price.current = Math.max(0.01, this.price.current + priceChange);
  
  // Update daily high/low
  this.price.high = Math.max(this.price.high, this.price.current);
  this.price.low = Math.min(this.price.low, this.price.current);
  
  // Calculate change
  this.change.absolute = this.price.current - this.price.open;
  this.change.percent = (this.change.absolute / this.price.open) * 100;
  
  // Simulate volume (more volume on big moves)
  const volumeMultiplier = 1 + Math.abs(this.change.percent) * 0.1;
  this.volume.current = Math.floor(this.volume.average * volumeMultiplier * (0.5 + Math.random()));
  
  this.lastUpdated = new Date();
  
  return this.save();
};

// Method to add historical data point
marketDataSchema.methods.addHistoricalData = function() {
  const dataPoint = {
    date: new Date(),
    open: this.price.open,
    high: this.price.high,
    low: this.price.low,
    close: this.price.current,
    volume: this.volume.current,
    adjustedClose: this.price.current
  };
  
  this.history.push(dataPoint);
  
  // Keep only last 365 days of history
  if (this.history.length > 365) {
    this.history = this.history.slice(-365);
  }
  
  return this.save();
};

// Method to calculate technical indicators
marketDataSchema.methods.calculateTechnicalIndicators = function() {
  if (this.history.length < 20) {return;} // Need at least 20 days for calculations
  
  const prices = this.history.map(h => h.close);
  // eslint-disable-next-line no-unused-vars
  const volumes = this.history.map(h => h.volume);
  
  // Simple Moving Averages
  if (prices.length >= 20) {
    this.technical.movingAverages.sma20 = this.calculateSMA(prices, 20);
  }
  if (prices.length >= 50) {
    this.technical.movingAverages.sma50 = this.calculateSMA(prices, 50);
  }
  if (prices.length >= 200) {
    this.technical.movingAverages.sma200 = this.calculateSMA(prices, 200);
  }
  
  // RSI (14 period)
  if (prices.length >= 14) {
    this.technical.rsi = this.calculateRSI(prices, 14);
  }
  
  return this.save();
};

// Helper method to calculate Simple Moving Average
marketDataSchema.methods.calculateSMA = function(prices, period) {
  if (prices.length < period) {return null;}
  
  const recentPrices = prices.slice(-period);
  const sum = recentPrices.reduce((a, b) => a + b, 0);
  return Math.round((sum / period) * 100) / 100;
};

// Helper method to calculate RSI
marketDataSchema.methods.calculateRSI = function(prices, period = 14) {
  if (prices.length < period + 1) {return null;}
  
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
  
  if (avgLoss === 0) {return 100;}
  
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  return Math.round(rsi * 100) / 100;
};

// Static method to get market overview
marketDataSchema.statics.getMarketOverview = function() {
  return this.aggregate([
    { $match: { isActive: true, isTradeable: true } },
    {
      $group: {
        _id: null,
        totalStocks: { $sum: 1 },
        avgChange: { $avg: '$change.percent' },
        gainers: {
          $sum: {
            $cond: [{ $gt: ['$change.percent', 0] }, 1, 0]
          }
        },
        losers: {
          $sum: {
            $cond: [{ $lt: ['$change.percent', 0] }, 1, 0]
          }
        },
        totalVolume: { $sum: '$volume.current' },
        totalMarketCap: { $sum: '$marketCap' }
      }
    }
  ]);
};

// Static method to get sector performance
marketDataSchema.statics.getSectorPerformance = function() {
  return this.aggregate([
    { $match: { isActive: true, isTradeable: true, sector: { $exists: true } } },
    {
      $group: {
        _id: '$sector',
        avgChange: { $avg: '$change.percent' },
        stockCount: { $sum: 1 },
        totalVolume: { $sum: '$volume.current' },
        topGainer: { $max: '$change.percent' },
        topLoser: { $min: '$change.percent' }
      }
    },
    { $sort: { avgChange: -1 } }
  ]);
};

// Static method to get top movers
marketDataSchema.statics.getTopMovers = function(limit = 10) {
  return Promise.all([
    this.find({ isActive: true, isTradeable: true })
      .sort({ 'change.percent': -1 })
      .limit(limit)
      .select('symbol name price change sector'),
    this.find({ isActive: true, isTradeable: true })
      .sort({ 'change.percent': 1 })
      .limit(limit)
      .select('symbol name price change sector'),
    this.find({ isActive: true, isTradeable: true })
      .sort({ 'volume.current': -1 })
      .limit(limit)
      .select('symbol name price volume sector')
  ]).then(([gainers, losers, mostActive]) => ({
    gainers,
    losers,
    mostActive
  }));
};

// Static method to search stocks
marketDataSchema.statics.searchStocks = function(query, options = {}) {
  const { sector, exchange, sortBy = 'marketCap', limit = 20 } = options;
  
  const searchQuery = {
    isActive: true,
    isTradeable: true
  };
  
  // Text search
  if (query) {
    searchQuery.$or = [
      { symbol: { $regex: query, $options: 'i' } },
      { name: { $regex: query, $options: 'i' } }
    ];
  }
  
  // Filters
  if (sector) {searchQuery.sector = sector;}
  if (exchange) {searchQuery.exchange = exchange;}
  
  // Sorting
  let sortOptions = {};
  switch (sortBy) {
    case 'marketCap':
      sortOptions = { marketCap: -1 };
      break;
    case 'change':
      sortOptions = { 'change.percent': -1 };
      break;
    case 'volume':
      sortOptions = { 'volume.current': -1 };
      break;
    case 'price':
      sortOptions = { 'price.current': -1 };
      break;
    default:
      sortOptions = { marketCap: -1 };
  }
  
  return this.find(searchQuery)
    .sort(sortOptions)
    .limit(limit);
};

const MarketData = mongoose.models.MarketData || mongoose.model('MarketData', marketDataSchema);

module.exports = MarketData;