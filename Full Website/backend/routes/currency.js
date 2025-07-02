const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const { logUserAction } = require('../utils/auditLogger');
const router = express.Router();

// @route   GET /api/currency/balance
// @desc    Get user's current currency balance
// @access  Private
router.get('/balance', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('stats');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        coins: user.stats.coins,
        tokens: user.stats.tokens,
        totalPoints: user.stats.totalPoints,
        level: user.stats.level
      }
    });

  } catch (error) {
    console.error('Get currency balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving currency balance'
    });
  }
});

// @route   POST /api/currency/earn
// @desc    Award currency to user (system/admin only)
// @access  Private (System/Admin)
router.post('/earn', protect, [
  body('userId').optional().isMongoId(),
  body('coins').optional().isInt({ min: 0, max: 10000 }),
  body('tokens').optional().isInt({ min: 0, max: 1000 }),
  body('xp').optional().isInt({ min: 0, max: 50000 }),
  body('reason').isLength({ min: 1, max: 200 }).withMessage('Reason is required'),
  body('source').optional().isIn(['module_completion', 'achievement', 'daily_streak', 'event_participation', 'admin_award', 'referral_bonus', 'special_event', 'bug_report', 'feedback_submission'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Only system, admin, or the user themselves can award currency
    const targetUserId = req.body.userId || req.user._id;
    if (targetUserId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to award currency'
      });
    }

    const { coins = 0, tokens = 0, xp = 0, reason, source = 'admin_award' } = req.body;

    // Validate amounts
    if (coins === 0 && tokens === 0 && xp === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one currency amount must be greater than 0'
      });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Record the transaction before updating user
    const transaction = {
      type: 'earn',
      coins,
      tokens,
      xp,
      reason,
      source,
      awardedBy: req.user._id,
      timestamp: new Date()
    };

    // Update user stats
    const oldStats = { ...user.stats };
    user.stats.coins += coins;
    user.stats.tokens += tokens;
    
    if (xp > 0) {
      user.addProgress(xp, coins); // This handles XP and level calculation
    }

    // Add transaction to user history (if the field exists)
    if (!user.currencyTransactions) {
      user.currencyTransactions = [];
    }
    user.currencyTransactions.push(transaction);

    // Keep only last 100 transactions
    if (user.currencyTransactions.length > 100) {
      user.currencyTransactions = user.currencyTransactions.slice(-100);
    }

    await user.save();

    // Log the currency award
    await logUserAction(
      req.user._id,
      'CURRENCY_AWARDED',
      req.ip,
      req.get('User-Agent'),
      {
        targetUserId,
        coins,
        tokens,
        xp,
        reason,
        source,
        oldBalance: oldStats,
        newBalance: user.stats
      }
    );

    res.json({
      success: true,
      message: 'Currency awarded successfully',
      data: {
        transaction,
        newBalance: {
          coins: user.stats.coins,
          tokens: user.stats.tokens,
          totalPoints: user.stats.totalPoints,
          level: user.stats.level,
          xp: user.stats.xp
        }
      }
    });

  } catch (error) {
    console.error('Award currency error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error awarding currency'
    });
  }
});

// @route   POST /api/currency/spend
// @desc    Spend user currency
// @access  Private
router.post('/spend', protect, [
  body('coins').optional().isInt({ min: 0, max: 10000 }),
  body('tokens').optional().isInt({ min: 0, max: 1000 }),
  body('reason').isLength({ min: 1, max: 200 }).withMessage('Reason is required'),
  body('item').optional().isString(),
  body('category').optional().isIn(['avatar', 'theme', 'badge', 'title', 'boost', 'gift', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { coins = 0, tokens = 0, reason, item, category = 'other' } = req.body;

    // Validate amounts
    if (coins === 0 && tokens === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one currency amount must be greater than 0'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has sufficient balance
    if (user.stats.coins < coins) {
      return res.status(400).json({
        success: false,
        message: `Insufficient coins. You have ${user.stats.coins} but need ${coins}`,
        data: {
          required: coins,
          available: user.stats.coins,
          shortfall: coins - user.stats.coins
        }
      });
    }

    if (user.stats.tokens < tokens) {
      return res.status(400).json({
        success: false,
        message: `Insufficient tokens. You have ${user.stats.tokens} but need ${tokens}`,
        data: {
          required: tokens,
          available: user.stats.tokens,
          shortfall: tokens - user.stats.tokens
        }
      });
    }

    // Record the transaction before updating user
    const transaction = {
      type: 'spend',
      coins,
      tokens,
      reason,
      item,
      category,
      timestamp: new Date()
    };

    // Update user stats
    const oldStats = { ...user.stats };
    user.stats.coins -= coins;
    user.stats.tokens -= tokens;

    // Add transaction to user history
    if (!user.currencyTransactions) {
      user.currencyTransactions = [];
    }
    user.currencyTransactions.push(transaction);

    // Keep only last 100 transactions
    if (user.currencyTransactions.length > 100) {
      user.currencyTransactions = user.currencyTransactions.slice(-100);
    }

    await user.save();

    // Log the currency spending
    await logUserAction(
      req.user._id,
      'CURRENCY_SPENT',
      req.ip,
      req.get('User-Agent'),
      {
        coins,
        tokens,
        reason,
        item,
        category,
        oldBalance: oldStats,
        newBalance: user.stats
      }
    );

    res.json({
      success: true,
      message: 'Currency spent successfully',
      data: {
        transaction,
        newBalance: {
          coins: user.stats.coins,
          tokens: user.stats.tokens,
          totalPoints: user.stats.totalPoints,
          level: user.stats.level
        }
      }
    });

  } catch (error) {
    console.error('Spend currency error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error spending currency'
    });
  }
});

// @route   GET /api/currency/transactions
// @desc    Get user's currency transaction history
// @access  Private
router.get('/transactions', protect, [
  query('type').optional().isIn(['earn', 'spend']),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('skip').optional().isInt({ min: 0 }).toInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { type, limit = 20, skip = 0 } = req.query;

    const user = await User.findById(req.user._id).select('currencyTransactions');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let transactions = user.currencyTransactions || [];

    // Filter by type if specified
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }

    // Sort by timestamp (newest first)
    transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Paginate
    const paginatedTransactions = transactions.slice(skip, skip + limit);
    const totalCount = transactions.length;

    res.json({
      success: true,
      data: {
        transactions: paginatedTransactions,
        pagination: {
          currentPage: Math.floor(skip / limit) + 1,
          totalItems: totalCount,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get currency transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving currency transactions'
    });
  }
});

// @route   GET /api/currency/stats
// @desc    Get currency statistics for user
// @access  Private
router.get('/stats', protect, [
  query('timeframe').optional().isIn(['day', 'week', 'month', 'year'])
], async (req, res) => {
  try {
    const { timeframe = 'month' } = req.query;

    const user = await User.findById(req.user._id).select('currencyTransactions stats');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const transactions = user.currencyTransactions || [];
    const now = new Date();
    let startDate;

    switch (timeframe) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Filter transactions within timeframe
    const periodTransactions = transactions.filter(t => 
      new Date(t.timestamp) >= startDate
    );

    // Calculate statistics
    const stats = {
      currentBalance: {
        coins: user.stats.coins,
        tokens: user.stats.tokens,
        totalPoints: user.stats.totalPoints,
        level: user.stats.level
      },
      period: {
        timeframe,
        startDate,
        endDate: now,
        totalTransactions: periodTransactions.length
      },
      earned: {
        coins: 0,
        tokens: 0,
        xp: 0,
        count: 0
      },
      spent: {
        coins: 0,
        tokens: 0,
        count: 0
      },
      topEarningReasons: {},
      topSpendingCategories: {}
    };

    // Process transactions
    periodTransactions.forEach(transaction => {
      if (transaction.type === 'earn') {
        stats.earned.coins += transaction.coins || 0;
        stats.earned.tokens += transaction.tokens || 0;
        stats.earned.xp += transaction.xp || 0;
        stats.earned.count++;

        // Track earning reasons
        const reason = transaction.reason || 'Unknown';
        stats.topEarningReasons[reason] = (stats.topEarningReasons[reason] || 0) + 1;
      } else if (transaction.type === 'spend') {
        stats.spent.coins += transaction.coins || 0;
        stats.spent.tokens += transaction.tokens || 0;
        stats.spent.count++;

        // Track spending categories
        const category = transaction.category || 'other';
        stats.topSpendingCategories[category] = (stats.topSpendingCategories[category] || 0) + 1;
      }
    });

    // Convert top reasons/categories to arrays
    stats.topEarningReasons = Object.entries(stats.topEarningReasons)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    stats.topSpendingCategories = Object.entries(stats.topSpendingCategories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate net change
    stats.netChange = {
      coins: stats.earned.coins - stats.spent.coins,
      tokens: stats.earned.tokens - stats.spent.tokens
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get currency stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving currency statistics'
    });
  }
});

// @route   POST /api/currency/transfer
// @desc    Transfer currency between users (admin only or special events)
// @access  Private (Admin)
router.post('/transfer', protect, [
  body('fromUserId').isMongoId(),
  body('toUserId').isMongoId(),
  body('coins').optional().isInt({ min: 0, max: 10000 }),
  body('tokens').optional().isInt({ min: 0, max: 1000 }),
  body('reason').isLength({ min: 1, max: 200 }).withMessage('Reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Only admins can transfer currency between users
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to transfer currency'
      });
    }

    const { fromUserId, toUserId, coins = 0, tokens = 0, reason } = req.body;

    if (coins === 0 && tokens === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one currency amount must be greater than 0'
      });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot transfer currency to the same user'
      });
    }

    // Get both users
    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(toUserId)
    ]);

    if (!fromUser || !toUser) {
      return res.status(404).json({
        success: false,
        message: 'One or both users not found'
      });
    }

    // Check if fromUser has sufficient balance
    if (fromUser.stats.coins < coins || fromUser.stats.tokens < tokens) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance for transfer',
        data: {
          required: { coins, tokens },
          available: { 
            coins: fromUser.stats.coins, 
            tokens: fromUser.stats.tokens 
          }
        }
      });
    }

    // Create transaction records
    const transferId = new Date().getTime().toString();
    const timestamp = new Date();

    const fromTransaction = {
      type: 'transfer_out',
      coins,
      tokens,
      reason: `Transfer to ${toUser.firstName} ${toUser.lastName}: ${reason}`,
      transferId,
      recipientId: toUserId,
      timestamp
    };

    const toTransaction = {
      type: 'transfer_in',
      coins,
      tokens,
      reason: `Transfer from ${fromUser.firstName} ${fromUser.lastName}: ${reason}`,
      transferId,
      senderId: fromUserId,
      timestamp
    };

    // Update balances
    fromUser.stats.coins -= coins;
    fromUser.stats.tokens -= tokens;
    toUser.stats.coins += coins;
    toUser.stats.tokens += tokens;

    // Add transactions to history
    if (!fromUser.currencyTransactions) {fromUser.currencyTransactions = [];}
    if (!toUser.currencyTransactions) {toUser.currencyTransactions = [];}

    fromUser.currencyTransactions.push(fromTransaction);
    toUser.currencyTransactions.push(toTransaction);

    // Save both users
    await Promise.all([fromUser.save(), toUser.save()]);

    // Log the transfer
    await logUserAction(
      req.user._id,
      'CURRENCY_TRANSFERRED',
      req.ip,
      req.get('User-Agent'),
      {
        fromUserId,
        toUserId,
        coins,
        tokens,
        reason,
        transferId
      }
    );

    res.json({
      success: true,
      message: 'Currency transferred successfully',
      data: {
        transferId,
        fromUser: {
          id: fromUserId,
          newBalance: {
            coins: fromUser.stats.coins,
            tokens: fromUser.stats.tokens
          }
        },
        toUser: {
          id: toUserId,
          newBalance: {
            coins: toUser.stats.coins,
            tokens: toUser.stats.tokens
          }
        }
      }
    });

  } catch (error) {
    console.error('Transfer currency error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error transferring currency'
    });
  }
});

// @route   GET /api/currency/leaderboard
// @desc    Get currency leaderboard
// @access  Private
router.get('/leaderboard', protect, [
  query('type').optional().isIn(['coins', 'tokens', 'totalPoints']),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], async (req, res) => {
  try {
    const { type = 'totalPoints', limit = 10 } = req.query;

    const sortField = `stats.${type}`;
    const users = await User.find({ isActive: true })
      .select('firstName lastName avatar stats department role')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        department: user.department,
        role: user.role
      },
      value: user.stats[type],
      level: user.stats.level
    }));

    // Find current user's rank
    const userRank = await User.countDocuments({
      isActive: true,
      [sortField]: { $gt: req.user.stats[type] }
    }) + 1;

    res.json({
      success: true,
      data: {
        leaderboard,
        currentUserRank: userRank,
        type,
        totalUsers: await User.countDocuments({ isActive: true })
      }
    });

  } catch (error) {
    console.error('Get currency leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving currency leaderboard'
    });
  }
});

module.exports = router;