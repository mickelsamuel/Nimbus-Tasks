const express = require('express');
const router = express.Router();
const Module = require('../models/Module');
const User = require('../models/User');
const ModuleDiscussion = require('../models/ModuleDiscussion');
const { protect } = require('../middleware/auth');

// @route   GET /api/modules
// @desc    Get all modules with filtering and sorting
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      category,
      difficulty,
      search,
      sort = 'popularity',
      order = 'desc',
      page = 1,
      limit = 12,
      rarity,
      department
    } = req.query;

    // Build query
    const query = { status: 'published', isActive: true };

    // Apply filters
    if (category) {
      query.category = category;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (rarity) {
      query.rarity = { $regex: rarity, $options: 'i' };
    }
    if (department) {
      query.targetDepartments = { $in: [department] };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Determine sort options
    let sortOptions = {};
    switch (sort) {
      case 'popularity':
        sortOptions = { 'stats.enrolledCount': order === 'desc' ? -1 : 1 };
        break;
      case 'rating':
        sortOptions = { 'stats.averageRating': order === 'desc' ? -1 : 1 };
        break;
      case 'title':
        sortOptions = { title: order === 'desc' ? -1 : 1 };
        break;
      case 'duration':
        sortOptions = { totalDuration: order === 'desc' ? -1 : 1 };
        break;
      case 'points':
        sortOptions = { points: order === 'desc' ? -1 : 1 };
        break;
      case 'newest':
        sortOptions = { createdAt: order === 'desc' ? -1 : 1 };
        break;
      default:
        sortOptions = { 'stats.enrolledCount': -1 };
    }

    // Execute query with pagination
    const modules = await Module.find(query)
      .populate('author', 'firstName lastName')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Module.countDocuments(query);

    // Get filter options
    const [categories, difficulties, rarities] = await Promise.all([
      Module.distinct('category', { status: 'published', isActive: true }),
      Module.distinct('difficulty', { status: 'published', isActive: true }),
      Module.distinct('rarity', { status: 'published', isActive: true })
    ]);

    res.json({
      success: true,
      modules,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        categories,
        difficulties,
        rarities
      },
      stats: {
        totalModules: await Module.countDocuments({ status: 'published', isActive: true }),
        filteredCount: total
      }
    });
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/modules/user/enrolled
// @desc    Get user's enrolled modules
// @access  Private
router.get('/user/enrolled', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'enrolledModules.moduleId',
        select: 'title description category difficulty totalDuration points thumbnail rarity stats'
      });

    const enrolledModules = user.enrolledModules
      .filter(enrollment => enrollment.moduleId) // Filter out null references
      .map(enrollment => ({
        ...enrollment.moduleId.toObject(),
        userProgress: {
          progress: enrollment.progress,
          completedChapters: enrollment.completedChapters,
          enrolledAt: enrollment.enrolledAt,
          lastAccessedAt: enrollment.lastAccessedAt,
          completedAt: enrollment.completedAt,
          isEnrolled: true
        }
      }));

    res.json({
      success: true,
      modules: enrolledModules,
      total: enrolledModules.length
    });
  } catch (error) {
    console.error('Error fetching enrolled modules:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/modules/recommendations
// @desc    Get recommended modules for user
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledModules.moduleId', '_id');

    // Get completed module IDs
    const completedModuleIds = user.enrolledModules
      .filter(enrollment => enrollment.completedAt)
      .map(enrollment => enrollment.moduleId._id);

    const enrolledModuleIds = user.enrolledModules
      .map(enrollment => enrollment.moduleId._id);

    // Find recommended modules
    const recommendedModules = await Module.find({
      status: 'published',
      isActive: true,
      _id: { $nin: enrolledModuleIds }, // Not already enrolled
      $or: [
        { prerequisites: { $size: 0 } }, // No prerequisites
        { 'prerequisites.moduleId': { $in: completedModuleIds } } // Prerequisites met
      ]
    })
    .limit(6)
    .sort({ 'stats.averageRating': -1, 'stats.enrolledCount': -1 });

    res.json({
      success: true,
      modules: recommendedModules,
      total: recommendedModules.length
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/modules/:id
// @desc    Get module by ID with user progress
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate('author', 'firstName lastName avatar')
      .populate('prerequisites.moduleId', 'title');

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Get user's progress for this module
    const user = await User.findById(req.user.id);
    const userProgress = user.enrolledModules.find(
      enrollment => enrollment.moduleId.equals(module._id)
    );

    const moduleResponse = {
      ...module.toObject(),
      userProgress: userProgress || { progress: 0, completedChapters: [], isEnrolled: false }
    };

    res.json({
      success: true,
      module: moduleResponse
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/modules/:id/reviews
// @desc    Get reviews for a module
// @access  Private
router.get('/:id/reviews', protect, async (req, res) => {
  try {
    const { filter = 'all' } = req.query
    const moduleId = req.params.id
    
    // Check if module exists
    const module = await Module.findById(moduleId)
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      })
    }

    let sortOptions = { createdAt: -1 } // Default: newest first
    
    if (filter === 'helpful') {
      sortOptions = { helpful: -1, createdAt: -1 }
    } else if (filter === 'recent') {
      sortOptions = { createdAt: -1 }
    }

    // Get reviews with user info
    const reviews = await module.populate({
      path: 'reviews',
      populate: {
        path: 'userId',
        select: 'firstName lastName avatar department'
      },
      options: { sort: sortOptions }
    })

    // Format reviews for frontend
    const formattedReviews = reviews.reviews.map(review => ({
      id: review._id,
      userId: review.userId._id,
      userName: `${review.userId.firstName} ${review.userId.lastName}`,
      userAvatar: review.userId.avatar,
      department: review.userId.department,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      helpful: review.helpfulCount || 0,
      isHelpful: review.helpfulBy?.includes(req.user.id) || false
    }))

    // Check if current user has reviewed
    const userHasReviewed = reviews.reviews.some(review => 
      review.userId._id.equals(req.user.id)
    )

    res.json({
      success: true,
      reviews: formattedReviews,
      userHasReviewed
    })
  } catch (error) {
    console.error('Error fetching module reviews:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   POST /api/modules/:id/review
// @desc    Add a review to a module
// @access  Private
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body
    const moduleId = req.params.id
    
    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }

    // Check if module exists
    const module = await Module.findById(moduleId)
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      })
    }

    // Check if user is enrolled and has completed the module
    const user = await User.findById(req.user.id)
    const enrollment = user.enrolledModules.find(
      enroll => enroll.moduleId.equals(moduleId)
    )
    
    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'You must be enrolled to review this module'
      })
    }

    // Check if user already reviewed
    const existingReview = module.reviews.find(
      review => review.userId.equals(req.user.id)
    )
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this module'
      })
    }

    // Add review
    const newReview = {
      userId: req.user.id,
      rating,
      comment: comment?.trim() || '',
      createdAt: new Date(),
      helpfulCount: 0,
      helpfulBy: []
    }

    module.reviews.push(newReview)
    
    // Update module stats
    const totalRatings = module.reviews.length
    const sumRatings = module.reviews.reduce((sum, review) => sum + review.rating, 0)
    module.stats.averageRating = sumRatings / totalRatings
    module.stats.reviewCount = totalRatings
    
    await module.save()

    res.json({
      success: true,
      message: 'Review added successfully'
    })
  } catch (error) {
    console.error('Error adding module review:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   POST /api/modules/:id/reviews/:reviewId/helpful
// @desc    Mark a review as helpful
// @access  Private
router.post('/:id/reviews/:reviewId/helpful', protect, async (req, res) => {
  try {
    const { id: moduleId, reviewId } = req.params
    
    const module = await Module.findById(moduleId)
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      })
    }

    const review = module.reviews.id(reviewId)
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    const userId = req.user.id
    const hasMarkedHelpful = review.helpfulBy.includes(userId)
    
    if (hasMarkedHelpful) {
      // Remove helpful mark
      review.helpfulBy = review.helpfulBy.filter(id => !id.equals(userId))
      review.helpfulCount = Math.max(0, (review.helpfulCount || 0) - 1)
    } else {
      // Add helpful mark
      review.helpfulBy.push(userId)
      review.helpfulCount = (review.helpfulCount || 0) + 1
    }
    
    await module.save()

    res.json({
      success: true,
      helpful: !hasMarkedHelpful
    })
  } catch (error) {
    console.error('Error marking review helpful:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   POST /api/modules/:id/enroll
// @desc    Enroll in a module
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const user = await User.findById(req.user.id);
    
    // Check if already enrolled
    const existingEnrollment = user.enrolledModules.find(
      enrollment => enrollment.moduleId.equals(module._id)
    );
    
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this module'
      });
    }

    // Check prerequisites
    for (const prereq of module.prerequisites) {
      const prereqEnrollment = user.enrolledModules.find(
        enrollment => enrollment.moduleId.equals(prereq.moduleId) && enrollment.completedAt
      );
      if (!prereqEnrollment) {
        return res.status(400).json({
          success: false,
          message: `Prerequisites not met. Please complete: ${prereq.title}`
        });
      }
    }

    // Add enrollment to user
    user.enrolledModules.push({
      moduleId: module._id,
      enrolledAt: new Date(),
      progress: 0,
      completedChapters: [],
      attempts: 1
    });

    user.stats.modulesInProgress += 1;
    await user.save();

    // Update module stats
    await module.enrollUser();

    res.json({
      success: true,
      message: 'Successfully enrolled in module'
    });
  } catch (error) {
    console.error('Error enrolling in module:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/modules/:id/progress
// @desc    Get user's progress for a module
// @access  Private
router.get('/:id/progress', protect, async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const user = await User.findById(req.user.id);
    const enrollment = user.enrolledModules.find(
      enrollment => enrollment.moduleId.equals(module._id)
    );

    if (!enrollment) {
      return res.json({
        success: true,
        data: {
          enrolled: false,
          progress: 0,
          completedChapters: [],
          currentChapter: 0
        }
      });
    }

    res.json({
      success: true,
      data: {
        enrolled: true,
        progress: enrollment.progress || 0,
        completedChapters: enrollment.completedChapters || [],
        currentChapter: enrollment.currentChapter || 0,
        enrolledAt: enrollment.enrolledAt,
        lastAccessedAt: enrollment.lastAccessedAt,
        completedAt: enrollment.completedAt
      }
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/modules/:id/progress
// @desc    Update module progress
// @access  Private
router.put('/:id/progress', protect, async (req, res) => {
  try {
    const { chapterId, completed, currentChapter, completedChapters } = req.body;
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const user = await User.findById(req.user.id);
    const enrollmentIndex = user.enrolledModules.findIndex(
      enrollment => enrollment.moduleId.equals(module._id)
    );

    if (enrollmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this module'
      });
    }

    const enrollment = user.enrolledModules[enrollmentIndex];

    // Update current chapter if provided
    if (typeof currentChapter === 'number') {
      enrollment.currentChapter = currentChapter;
    }

    // Update completed chapters if provided as array
    if (Array.isArray(completedChapters)) {
      enrollment.completedChapters = completedChapters;
    } else if (typeof chapterId !== 'undefined') {
      // Legacy single chapter update
      if (completed && !enrollment.completedChapters.includes(chapterId)) {
        enrollment.completedChapters.push(chapterId);
      } else if (!completed) {
        enrollment.completedChapters = enrollment.completedChapters.filter(
          id => id !== chapterId
        );
      }
    }

    // Calculate progress percentage
    const totalChapters = module.chapters.length;
    const completedCount = enrollment.completedChapters.length;
    enrollment.progress = Math.round((completedCount / totalChapters) * 100);
    enrollment.lastAccessedAt = new Date();

    // Check if module is completed
    if (enrollment.progress === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
      
      // Update user stats
      user.stats.modulesCompleted += 1;
      user.stats.modulesInProgress -= 1;
      user.stats.totalPoints += module.points;
      user.addProgress(module.xpReward, module.points);
      
      // Update user currency
      user.currency.coins += module.coins;
      user.currency.xp = user.stats.xp;
      
      // Mark module completion
      await module.markCompletion(enrollment.lastAccessedAt - enrollment.enrolledAt);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      progress: enrollment
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/modules/:id/review
// @desc    Add a review to a module
// @access  Private
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Check if user has completed the module
    const user = await User.findById(req.user.id);
    const enrollment = user.enrolledModules.find(
      enrollment => enrollment.moduleId.equals(module._id) && enrollment.completedAt
    );

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'You must complete the module before reviewing it'
      });
    }

    await module.addReview(req.user.id, rating, comment);

    res.json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/modules/:id/reviews
// @desc    Get reviews for a module
// @access  Private
router.get('/:id/reviews', protect, async (req, res) => {
  try {
    const { filter = 'all' } = req.query;
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    let reviews = module.reviews || [];
    
    // Apply filters
    switch (filter) {
      case 'recent':
        reviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'helpful':
        reviews = reviews.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
      default:
        // Default to recent
        reviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Populate user information for reviews
    const populatedReviews = await Promise.all(
      reviews.map(async (review) => {
        try {
          const user = await User.findById(review.userId).select('firstName lastName avatar department');
          return {
            id: review._id || review.id,
            userId: review.userId,
            userName: user ? `${user.firstName} ${user.lastName}` : 'Anonymous User',
            userAvatar: user?.avatar || '/avatars/default.jpg',
            department: user?.department || 'Unknown',
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            helpful: review.helpful || 0,
            isHelpful: review.helpfulBy?.includes(req.user.id) || false
          };
        } catch (error) {
          console.error('Error populating review user:', error);
          return {
            id: review._id || review.id,
            userId: review.userId,
            userName: 'Anonymous User',
            userAvatar: '/avatars/default.jpg',
            department: 'Unknown',
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            helpful: review.helpful || 0,
            isHelpful: false
          };
        }
      })
    );

    // Check if current user has reviewed
    const userHasReviewed = reviews.some(review => review.userId.toString() === req.user.id.toString());

    res.json({
      success: true,
      reviews: populatedReviews,
      userHasReviewed
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/modules/:id/reviews/:reviewId/helpful
// @desc    Mark a review as helpful
// @access  Private
router.post('/:id/reviews/:reviewId/helpful', protect, async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const review = module.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Initialize arrays if they don't exist
    if (!review.helpfulBy) {
      review.helpfulBy = [];
    }

    const userId = req.user.id.toString();
    const hasMarkedHelpful = review.helpfulBy.includes(userId);

    if (hasMarkedHelpful) {
      // Remove helpful mark
      review.helpfulBy = review.helpfulBy.filter(id => id !== userId);
      review.helpful = Math.max(0, (review.helpful || 1) - 1);
    } else {
      // Add helpful mark
      review.helpfulBy.push(userId);
      review.helpful = (review.helpful || 0) + 1;
    }

    await module.save();

    res.json({
      success: true,
      helpful: review.helpful,
      isHelpful: !hasMarkedHelpful
    });
  } catch (error) {
    console.error('Error marking review helpful:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/modules/:id/bookmark
// @desc    Toggle bookmark status for a module
// @access  Private
router.post('/:id/bookmark', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if module exists
    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Get user and check current bookmark status
    const user = await User.findById(userId);
    const bookmarkedModules = user.bookmarkedModules || [];
    const isBookmarked = bookmarkedModules.includes(id);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarkedModules = bookmarkedModules.filter(moduleId => !moduleId.equals(id));
      await user.save();
      
      res.json({
        success: true,
        bookmarked: false,
        message: 'Module removed from bookmarks'
      });
    } else {
      // Add bookmark
      if (!user.bookmarkedModules) {
        user.bookmarkedModules = [];
      }
      user.bookmarkedModules.push(id);
      await user.save();
      
      res.json({
        success: true,
        bookmarked: true,
        message: 'Module bookmarked successfully'
      });
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/modules/:id/like
// @desc    Toggle like status for a module
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if module exists
    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Get user and check current like status
    const user = await User.findById(userId);
    const likedModules = user.likedModules || [];
    const isLiked = likedModules.includes(id);

    if (isLiked) {
      // Remove like
      user.likedModules = likedModules.filter(moduleId => !moduleId.equals(id));
      await user.save();
      
      // Decrement module like count
      module.likeCount = Math.max(0, (module.likeCount || 0) - 1);
      await module.save();
      
      res.json({
        success: true,
        liked: false,
        likeCount: module.likeCount,
        message: 'Module unliked successfully'
      });
    } else {
      // Add like
      if (!user.likedModules) {
        user.likedModules = [];
      }
      user.likedModules.push(id);
      await user.save();
      
      // Increment module like count
      module.likeCount = (module.likeCount || 0) + 1;
      await module.save();
      
      res.json({
        success: true,
        liked: true,
        likeCount: module.likeCount,
        message: 'Module liked successfully'
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ===========================================
// MODULE DISCUSSION ENDPOINTS
// ===========================================

// @route   GET /api/modules/:id/discussions
// @desc    Get discussions for a module
// @access  Private
router.get('/:id/discussions', protect, async (req, res) => {
  try {
    const { id: moduleId } = req.params;
    const { category, sort, page, limit, search } = req.query;

    // Check if module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Get discussions
    const discussions = await ModuleDiscussion.getModuleDiscussions(moduleId, {
      category,
      sort,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search
    });

    // Get total count for pagination
    const query = { moduleId, isDeleted: false };
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const totalDiscussions = await ModuleDiscussion.countDocuments(query);

    res.json({
      success: true,
      data: {
        discussions,
        pagination: {
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 20,
          total: totalDiscussions,
          pages: Math.ceil(totalDiscussions / (parseInt(limit) || 20))
        }
      }
    });

  } catch (error) {
    console.error('Error fetching module discussions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/modules/:id/discussions
// @desc    Create a new discussion for a module
// @access  Private
router.post('/:id/discussions', protect, async (req, res) => {
  try {
    const { id: moduleId } = req.params;
    const { title, content, category = 'discussion', tags = [] } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Check if module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Create discussion
    const discussion = new ModuleDiscussion({
      moduleId,
      authorId: req.user.id,
      title: title.trim(),
      content: content.trim(),
      category,
      tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : []
    });

    await discussion.save();
    await discussion.populate('authorId', 'firstName lastName avatar role department');

    res.status(201).json({
      success: true,
      data: discussion
    });

  } catch (error) {
    console.error('Error creating module discussion:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/modules/:moduleId/discussions/:discussionId
// @desc    Get a specific discussion with replies
// @access  Private
router.get('/:moduleId/discussions/:discussionId', protect, async (req, res) => {
  try {
    const { discussionId } = req.params;

    const discussion = await ModuleDiscussion.findById(discussionId)
      .populate('authorId', 'firstName lastName avatar role department')
      .populate('lastReplyBy', 'firstName lastName avatar')
      .populate('replies.authorId', 'firstName lastName avatar role department')
      .lean();

    if (!discussion || discussion.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Add view for this user
    await ModuleDiscussion.findById(discussionId).then(doc => {
      if (doc) doc.addView(req.user.id);
    });

    // Filter out deleted replies
    discussion.replies = discussion.replies.filter(reply => !reply.isDeleted);

    res.json({
      success: true,
      data: discussion
    });

  } catch (error) {
    console.error('Error fetching discussion:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/modules/:moduleId/discussions/:discussionId
// @desc    Edit a discussion
// @access  Private
router.put('/:moduleId/discussions/:discussionId', protect, async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const discussion = await ModuleDiscussion.findById(discussionId);
    if (!discussion || discussion.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    await discussion.editDiscussion(title, content, req.user.id);
    await discussion.populate('authorId', 'firstName lastName avatar role department');

    res.json({
      success: true,
      data: discussion
    });

  } catch (error) {
    if (error.message === 'Only the author can edit this discussion') {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    
    console.error('Error editing discussion:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/modules/:moduleId/discussions/:discussionId
// @desc    Delete a discussion
// @access  Private
router.delete('/:moduleId/discussions/:discussionId', protect, async (req, res) => {
  try {
    const { discussionId } = req.params;

    const discussion = await ModuleDiscussion.findById(discussionId);
    if (!discussion || discussion.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Only author or admin can delete
    if (!discussion.authorId.equals(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    discussion.isDeleted = true;
    discussion.deletedAt = new Date();
    await discussion.save();

    res.json({
      success: true,
      message: 'Discussion deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting discussion:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/modules/:moduleId/discussions/:discussionId/replies
// @desc    Add a reply to a discussion
// @access  Private
router.post('/:moduleId/discussions/:discussionId/replies', protect, async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reply content is required'
      });
    }

    const discussion = await ModuleDiscussion.findById(discussionId);
    if (!discussion || discussion.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    if (discussion.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'This discussion is locked'
      });
    }

    await discussion.addReply(req.user.id, content);
    
    // Populate the new reply
    await discussion.populate('replies.authorId', 'firstName lastName avatar role department');
    
    const newReply = discussion.replies[discussion.replies.length - 1];

    res.status(201).json({
      success: true,
      data: newReply
    });

  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/modules/:moduleId/discussions/:discussionId/replies/:replyId
// @desc    Edit a reply
// @access  Private
router.put('/:moduleId/discussions/:discussionId/replies/:replyId', protect, async (req, res) => {
  try {
    const { discussionId, replyId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reply content is required'
      });
    }

    const discussion = await ModuleDiscussion.findById(discussionId);
    if (!discussion || discussion.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    await discussion.editReply(replyId, content, req.user.id);
    await discussion.populate('replies.authorId', 'firstName lastName avatar role department');
    
    const editedReply = discussion.replies.id(replyId);

    res.json({
      success: true,
      data: editedReply
    });

  } catch (error) {
    if (error.message.includes('Only the author can edit')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    
    console.error('Error editing reply:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/modules/:moduleId/discussions/:discussionId/replies/:replyId
// @desc    Delete a reply
// @access  Private
router.delete('/:moduleId/discussions/:discussionId/replies/:replyId', protect, async (req, res) => {
  try {
    const { discussionId, replyId } = req.params;

    const discussion = await ModuleDiscussion.findById(discussionId);
    if (!discussion || discussion.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    await discussion.deleteReply(replyId, req.user.id);

    res.json({
      success: true,
      message: 'Reply deleted successfully'
    });

  } catch (error) {
    if (error.message.includes('Only the author can delete')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    
    console.error('Error deleting reply:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/modules/:id/preview
// @desc    Get module preview (first chapter, overview, requirements)
// @access  Private
router.get('/:id/preview', protect, async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate('instructors', 'firstName lastName avatar')
      .lean();

    if (!module || module.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Module not found or not available for preview'
      });
    }

    // Get first chapter content (limited)
    const previewChapter = module.chapters[0] ? {
      id: module.chapters[0].id,
      title: module.chapters[0].title,
      content: module.chapters[0].content ? 
        module.chapters[0].content.substring(0, 500) + '...' : 
        'Preview content coming soon...',
      duration: module.chapters[0].duration,
      type: module.chapters[0].type
    } : null;

    // Create preview data
    const previewData = {
      id: module._id,
      title: module.title,
      description: module.description,
      category: module.category,
      difficulty: module.difficulty,
      estimatedDuration: module.estimatedDuration,
      xpReward: module.xpReward,
      coins: module.coins,
      instructors: module.instructors,
      learning_objectives: module.learning_objectives || [],
      prerequisites: module.prerequisites || [],
      tags: module.tags || [],
      totalChapters: module.chapters.length,
      previewChapter,
      stats: {
        enrolledCount: module.stats?.enrolledCount || 0,
        averageRating: module.stats?.averageRating || 0,
        reviewCount: module.stats?.reviewCount || 0
      },
      hasAccess: false // Always false for preview
    };

    res.json({
      success: true,
      data: previewData
    });

  } catch (error) {
    console.error('Error fetching module preview:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/modules/:moduleId/discussions/:discussionId/like
// @desc    Toggle like on a discussion
// @access  Private
router.post('/:moduleId/discussions/:discussionId/like', protect, async (req, res) => {
  try {
    const { discussionId } = req.params;

    const discussion = await ModuleDiscussion.findById(discussionId);
    if (!discussion || discussion.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    await discussion.toggleLike(req.user.id);

    res.json({
      success: true,
      data: {
        likes: discussion.likes,
        likeCount: discussion.likes.length
      }
    });

  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;