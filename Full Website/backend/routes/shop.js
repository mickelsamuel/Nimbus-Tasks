const express = require('express');
const router = express.Router();
const ShopItem = require('../models/ShopItem');
const UserPurchase = require('../models/UserPurchase');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get all shop items with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      category = 'all',
      rarity = 'all',
      sortBy = 'newest',
      page = 1,
      limit = 20,
      featured,
      limited,
      new: isNew
    } = req.query;

    const filters = {
      category: category !== 'all' ? category : undefined,
      rarity: rarity !== 'all' ? rarity : undefined,
      sortBy
    };

    let query = ShopItem.searchItems(search, filters);

    // Special filters
    if (featured === 'true') {
      query = query.where('metadata.isFeatured').equals(true);
    }
    if (limited === 'true') {
      query = query.where('metadata.isLimited').equals(true)
        .where('limitedTime.endDate').gt(new Date());
    }
    if (isNew === 'true') {
      query = query.where('metadata.isNew').equals(true);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.skip(skip).limit(parseInt(limit));

    const items = await query.exec();
    const total = await ShopItem.countDocuments({ 'metadata.isActive': true });

    // Get user's owned items if authenticated
    let ownedItems = [];
    if (req.user) {
      const purchases = await UserPurchase.find({
        user: req.user.id,
        status: 'completed'
      }).select('shopItem');
      ownedItems = purchases.map(p => p.shopItem.toString());
    }

    // Add ownership status to items
    const itemsWithOwnership = items.map(item => {
      const itemObj = item.toObject({ virtuals: true });
      itemObj.owned = ownedItems.includes(item._id.toString());
      return itemObj;
    });

    res.json({
      success: true,
      data: {
        items: itemsWithOwnership,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: items.length,
          totalItems: total
        }
      }
    });
  } catch (error) {
    console.error('Shop items fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop items',
      error: error.message
    });
  }
});

// Get featured items
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const items = await ShopItem.getFeaturedItems(limit);
    
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Featured items fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured items',
      error: error.message
    });
  }
});

// Get limited time items
router.get('/limited', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const items = await ShopItem.getLimitedItems(limit);
    
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Limited items fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch limited items',
      error: error.message
    });
  }
});

// Get new items
router.get('/new', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const items = await ShopItem.getNewItems(limit);
    
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('New items fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch new items',
      error: error.message
    });
  }
});

// Get single shop item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await ShopItem.findById(req.params.id);
    
    if (!item || !item.metadata.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Shop item not found'
      });
    }

    // Increment view count
    await item.incrementView();

    // Check if user owns this item
    let owned = false;
    if (req.user) {
      const purchase = await UserPurchase.hasUserPurchased(req.user.id, item._id);
      owned = !!purchase;
    }

    const itemData = item.toObject({ virtuals: true });
    itemData.owned = owned;

    res.json({
      success: true,
      data: itemData
    });
  } catch (error) {
    console.error('Shop item fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop item',
      error: error.message
    });
  }
});

// Purchase item (protected route)
router.post('/:id/purchase', protect, async (req, res) => {
  try {
    const { currency } = req.body;
    const itemId = req.params.id;
    const userId = req.user.id;

    // Get the item
    const item = await ShopItem.findById(itemId);
    if (!item || !item.metadata.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Item not found or unavailable'
      });
    }

    // Check if user already owns this item
    const existingPurchase = await UserPurchase.hasUserPurchased(userId, itemId);
    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: 'You already own this item'
      });
    }

    // Get user's wallet
    const user = await User.findById(userId);
    const userWallet = {
      coins: user.currency?.coins || 0,
      tokens: user.currency?.tokens || 0,
      premiumCoins: user.currency?.premiumCoins || 0
    };

    // Check if user can afford the item
    if (!item.canUserAfford(userWallet)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds'
      });
    }

    // Get the discounted price
    const price = item.discountedPrice;
    const purchasePrice = price[currency] || item.price[currency];
    
    if (!purchasePrice) {
      return res.status(400).json({
        success: false,
        message: 'Invalid currency for this item'
      });
    }

    // Check specific currency balance
    if (userWallet[currency] < purchasePrice) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds in selected currency'
      });
    }

    // Create purchase record
    const purchase = new UserPurchase({
      user: userId,
      shopItem: itemId,
      purchaseDetails: {
        price: price,
        currency: currency,
        amount: purchasePrice,
        discountApplied: item.currentDiscount || 0
      },
      status: 'completed',
      metadata: {
        userIP: req.ip,
        userAgent: req.get('User-Agent'),
        platform: 'web',
        source: 'shop'
      }
    });

    await purchase.save();

    // Deduct currency from user
    const updateField = `currency.${currency}`;
    await User.findByIdAndUpdate(userId, {
      $inc: { [updateField]: -purchasePrice }
    });

    // Increment purchase count for item
    await item.incrementPurchase();

    // Add item to user's inventory (if you have an inventory system)
    // await User.findByIdAndUpdate(userId, {
    //   $addToSet: { 'inventory.items': itemId }
    // });

    res.json({
      success: true,
      message: 'Purchase completed successfully',
      data: {
        purchase: purchase,
        remainingBalance: {
          [currency]: userWallet[currency] - purchasePrice
        }
      }
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete purchase',
      error: error.message
    });
  }
});

// Get user's purchase history (protected route)
router.get('/user/purchases', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const purchases = await UserPurchase.getUserPurchases(
      req.user.id, 
      parseInt(limit), 
      skip
    );

    const total = await UserPurchase.countDocuments({
      user: req.user.id,
      status: 'completed'
    });

    res.json({
      success: true,
      data: {
        purchases,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: purchases.length,
          totalItems: total
        }
      }
    });
  } catch (error) {
    console.error('Purchase history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase history',
      error: error.message
    });
  }
});

// Get user's owned items (protected route)
router.get('/user/inventory', protect, async (req, res) => {
  try {
    const ownedItems = await UserPurchase.getUserOwnedItems(req.user.id);
    
    res.json({
      success: true,
      data: ownedItems.map(purchase => ({
        purchaseId: purchase._id,
        purchaseDate: purchase.createdAt,
        item: purchase.shopItem
      }))
    });
  } catch (error) {
    console.error('Inventory fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
      error: error.message
    });
  }
});

// Add item to wishlist (protected route)
router.post('/:id/wishlist', protect, async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user.id;

    // Check if item exists
    const item = await ShopItem.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Add to user's wishlist (assuming you have a wishlist field in User model)
    await User.findByIdAndUpdate(userId, {
      $addToSet: { wishlist: itemId }
    });

    // Increment wishlist count
    await ShopItem.findByIdAndUpdate(itemId, {
      $inc: { 'stats.wishlistCount': 1 }
    });

    res.json({
      success: true,
      message: 'Item added to wishlist'
    });
  } catch (error) {
    console.error('Wishlist add error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to wishlist',
      error: error.message
    });
  }
});

// Remove item from wishlist (protected route)
router.delete('/:id/wishlist', protect, async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user.id;

    // Remove from user's wishlist
    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: itemId }
    });

    // Decrement wishlist count
    await ShopItem.findByIdAndUpdate(itemId, {
      $inc: { 'stats.wishlistCount': -1 }
    });

    res.json({
      success: true,
      message: 'Item removed from wishlist'
    });
  } catch (error) {
    console.error('Wishlist remove error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from wishlist',
      error: error.message
    });
  }
});

module.exports = router;
