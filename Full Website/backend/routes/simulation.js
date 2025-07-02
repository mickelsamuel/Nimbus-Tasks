const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Mock market data and simulation state
const marketData = {
  indices: {
    TSX: { price: 20250.45, change: +125.30, changePercent: +0.62 },
    DOW: { price: 34890.25, change: -89.45, changePercent: -0.26 },
    NASDAQ: { price: 14125.78, change: +78.22, changePercent: +0.56 },
    SPX: { price: 4485.90, change: +35.12, changePercent: +0.79 }
  },
  stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.25, change: +2.45, volume: 2500000 },
    { symbol: 'BNS', name: 'National Bank of Canada', price: 62.45, change: -0.85, volume: 890000 },
    { symbol: 'RY', name: 'Royal Bank of Canada', price: 125.80, change: +1.25, volume: 1200000 },
    { symbol: 'TD', name: 'Toronto-Dominion Bank', price: 78.90, change: +0.45, volume: 950000 },
    { symbol: 'SHOP', name: 'Shopify Inc.', price: 45.20, change: -1.80, volume: 1800000 }
  ],
  lastUpdate: new Date()
};

// Mock user portfolio
const userPortfolio = {
  userId: 1,
  balance: 100000,
  totalValue: 125000,
  dayGainLoss: +2500,
  totalGainLoss: +25000,
  positions: [
    { symbol: 'BNS', shares: 100, avgPrice: 60.00, currentPrice: 62.45, value: 6245 },
    { symbol: 'RY', shares: 50, avgPrice: 120.00, currentPrice: 125.80, value: 6290 },
    { symbol: 'AAPL', shares: 25, avgPrice: 170.00, currentPrice: 175.25, value: 4381.25 }
  ],
  orderHistory: [
    { id: 1, symbol: 'BNS', type: 'BUY', shares: 100, price: 60.00, date: new Date('2024-01-15') },
    { id: 2, symbol: 'RY', type: 'BUY', shares: 50, price: 120.00, date: new Date('2024-01-20') },
    { id: 3, symbol: 'AAPL', type: 'BUY', shares: 25, price: 170.00, date: new Date('2024-02-01') }
  ]
};

// Default simulation route - Get simulation overview
router.get('/', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        market: {
          status: 'open',
          lastUpdate: marketData.lastUpdate,
          indicesCount: Object.keys(marketData.indices).length,
          stocksCount: marketData.stocks.length
        },
        portfolio: {
          balance: userPortfolio.balance,
          totalValue: userPortfolio.totalValue,
          positionsCount: userPortfolio.positions.length,
          dayGainLoss: userPortfolio.dayGainLoss
        },
        features: [
          'Real-time market data',
          'Portfolio management',
          'Trading simulation',
          'Performance analytics',
          'Leaderboards',
          'Trading challenges'
        ]
      }
    });
  } catch (error) {
    console.error('Simulation overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch simulation overview'
    });
  }
});

// @route   GET /api/simulation/market
// @desc    Get current market data
// @access  Private
router.get('/market', protect, (req, res) => {
  try {
    // Simulate real-time price updates
    marketData.stocks.forEach(stock => {
      const volatility = Math.random() * 0.02 - 0.01; // -1% to +1%
      stock.price = Math.max(0.01, stock.price * (1 + volatility));
      stock.change = stock.price - (stock.price / (1 + volatility));
    });
    
    marketData.lastUpdate = new Date();

    res.json({
      success: true,
      data: marketData
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/simulation/portfolio
// @desc    Get user portfolio
// @access  Private
router.get('/portfolio', protect, (req, res) => {
  try {
    // Update portfolio values based on current prices
    userPortfolio.positions.forEach(position => {
      const currentStock = marketData.stocks.find(s => s.symbol === position.symbol);
      if (currentStock) {
        position.currentPrice = currentStock.price;
        position.value = position.shares * currentStock.price;
      }
    });

    // Recalculate totals
    const totalPositionValue = userPortfolio.positions.reduce((sum, pos) => sum + pos.value, 0);
    userPortfolio.totalValue = userPortfolio.balance + totalPositionValue;

    res.json({
      success: true,
      portfolio: userPortfolio
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/simulation/order
// @desc    Place a trade order
// @access  Private
router.post('/order', (req, res) => {
  try {
    const { symbol, type, shares, orderType = 'MARKET' } = req.body;
    
    const stock = marketData.stocks.find(s => s.symbol === symbol);
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    const totalCost = stock.price * shares;

    if (type === 'BUY') {
      if (userPortfolio.balance < totalCost) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient funds'
        });
      }

      // Execute buy order
      userPortfolio.balance -= totalCost;
      
      const existingPosition = userPortfolio.positions.find(p => p.symbol === symbol);
      if (existingPosition) {
        const totalShares = existingPosition.shares + shares;
        const totalValue = (existingPosition.shares * existingPosition.avgPrice) + totalCost;
        existingPosition.avgPrice = totalValue / totalShares;
        existingPosition.shares = totalShares;
        existingPosition.currentPrice = stock.price;
        existingPosition.value = totalShares * stock.price;
      } else {
        userPortfolio.positions.push({
          symbol,
          shares,
          avgPrice: stock.price,
          currentPrice: stock.price,
          value: totalCost
        });
      }
    } else if (type === 'SELL') {
      const position = userPortfolio.positions.find(p => p.symbol === symbol);
      if (!position || position.shares < shares) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient shares'
        });
      }

      // Execute sell order
      userPortfolio.balance += totalCost;
      position.shares -= shares;
      
      if (position.shares === 0) {
        userPortfolio.positions = userPortfolio.positions.filter(p => p.symbol !== symbol);
      } else {
        position.value = position.shares * stock.price;
      }
    }

    // Add to order history
    const order = {
      id: userPortfolio.orderHistory.length + 1,
      symbol,
      type,
      shares,
      price: stock.price,
      orderType,
      date: new Date(),
      status: 'FILLED'
    };
    userPortfolio.orderHistory.unshift(order);

    res.json({
      success: true,
      message: `${type} order executed successfully`,
      order,
      portfolio: userPortfolio
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/simulation/leaderboard
// @desc    Get simulation leaderboard
// @access  Private
router.get('/leaderboard', protect, (req, res) => {
  try {
    const leaderboard = [
      { rank: 1, userId: 5, name: 'David Rodriguez', portfolioValue: 150000, gainLoss: +50000, roi: 50.0 },
      { rank: 2, userId: 3, name: 'Lisa Wang', portfolioValue: 142000, gainLoss: +42000, roi: 42.0 },
      { rank: 3, userId: 1, name: 'John Smith', portfolioValue: 125000, gainLoss: +25000, roi: 25.0 },
      { rank: 4, userId: 7, name: 'Sarah Johnson', portfolioValue: 118000, gainLoss: +18000, roi: 18.0 },
      { rank: 5, userId: 2, name: 'Mike Chen', portfolioValue: 112000, gainLoss: +12000, roi: 12.0 }
    ];

    res.json({
      success: true,
      leaderboard,
      userRank: 3
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/simulation/challenges
// @desc    Get available trading challenges
// @access  Private
router.get('/challenges', protect, (req, res) => {
  try {
    const challenges = [
      {
        id: 1,
        title: 'Conservative Investor',
        description: 'Build a low-risk portfolio with maximum 5% volatility',
        reward: 1000,
        timeLimit: 7,
        status: 'active',
        participants: 45
      },
      {
        id: 2,
        title: 'Growth Hunter',
        description: 'Achieve 20% returns within 30 days',
        reward: 2500,
        timeLimit: 30,
        status: 'active',
        participants: 67
      },
      {
        id: 3,
        title: 'Day Trader',
        description: 'Make 10 profitable trades in one day',
        reward: 500,
        timeLimit: 1,
        status: 'completed',
        participants: 23
      }
    ];

    res.json({
      success: true,
      challenges
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/simulation/analytics
// @desc    Get portfolio analytics
// @access  Private
router.get('/analytics', protect, (req, res) => {
  try {
    const analytics = {
      performance: {
        dayGain: 2.1,
        weekGain: 8.5,
        monthGain: 15.2,
        ytdGain: 25.0
      },
      allocation: [
        { sector: 'Financial Services', percentage: 60, value: 12535 },
        { sector: 'Technology', percentage: 35, value: 4381 },
        { sector: 'Cash', percentage: 5, value: 100000 }
      ],
      riskMetrics: {
        beta: 0.85,
        sharpeRatio: 1.24,
        volatility: 12.5,
        maxDrawdown: -5.2
      },
      recommendations: [
        'Consider diversifying into healthcare sector',
        'Your tech allocation is overweight',
        'Good cash position for opportunities'
      ]
    };

    res.json({
      success: true,
      analytics
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/simulation/sessions
// @desc    Get user simulation sessions
// @access  Private
router.get('/sessions', protect, (req, res) => {
  try {
    const sessions = [
      {
        id: 1,
        scenario: 'Basic Trading',
        startTime: new Date('2024-01-15T09:00:00'),
        endTime: new Date('2024-01-15T10:30:00'),
        duration: 90, // minutes
        performance: {
          initialValue: 100000,
          finalValue: 102500,
          return: 2.5,
          trades: 8
        },
        grade: 'B',
        completed: true
      },
      {
        id: 2,
        scenario: 'Risk Management',
        startTime: new Date('2024-01-20T14:00:00'),
        endTime: new Date('2024-01-20T15:45:00'),
        duration: 105,
        performance: {
          initialValue: 100000,
          finalValue: 98500,
          return: -1.5,
          trades: 12
        },
        grade: 'C',
        completed: true
      },
      {
        id: 3,
        scenario: 'Market Volatility',
        startTime: new Date('2024-02-01T11:00:00'),
        endTime: new Date('2024-02-01T12:30:00'),
        duration: 90,
        performance: {
          initialValue: 100000,
          finalValue: 105000,
          return: 5.0,
          trades: 6
        },
        grade: 'A',
        completed: true
      }
    ];

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error('Sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/simulation/performance
// @desc    Get user performance metrics
// @access  Private
router.get('/performance', protect, (req, res) => {
  try {
    const performance = {
      totalSessions: 15,
      averageReturn: 2.8,
      winRate: 67,
      riskScore: 6.2,
      learningProgress: 75,
      skillLevel: 'Intermediate',
      streaks: {
        current: 3,
        longest: 7
      },
      timeInvested: {
        totalHours: 25.5,
        averageSession: 85 // minutes
      },
      achievements: [
        { id: 1, title: 'First Trade', completed: true },
        { id: 2, title: 'Profitable Week', completed: true },
        { id: 3, title: 'Risk Manager', completed: false }
      ]
    };

    res.json({
      success: true,
      performance
    });
  } catch (error) {
    console.error('Performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/simulation/insights
// @desc    Get performance insights and recommendations
// @access  Private
router.get('/insights', protect, (req, res) => {
  try {
    const insights = [
      {
        id: 1,
        type: 'strength',
        title: 'Strong Risk Management',
        description: 'You consistently limit losses to under 3% per trade',
        impact: 'high',
        category: 'risk'
      },
      {
        id: 2,
        type: 'improvement',
        title: 'Diversification Opportunity',
        description: 'Consider spreading investments across more sectors',
        impact: 'medium',
        category: 'strategy'
      },
      {
        id: 3,
        type: 'achievement',
        title: 'Consistent Performance',
        description: 'You\'ve maintained positive returns for 5 consecutive sessions',
        impact: 'high',
        category: 'performance'
      },
      {
        id: 4,
        type: 'recommendation',
        title: 'Try Advanced Scenarios',
        description: 'Based on your progress, you\'re ready for complex market conditions',
        impact: 'medium',
        category: 'learning'
      }
    ];

    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;