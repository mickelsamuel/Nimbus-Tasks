const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { logUserAction } = require('../utils/auditLogger');
const SupportResource = require('../models/SupportResource');

const router = express.Router();

// Get all resources with filtering
router.get('/resources', async (req, res) => {
  try {
    const { 
      category, 
      type, 
      difficulty, 
      search, 
      featured,
      page = 1, 
      limit = 12,
      sortBy = 'rating'
    } = req.query;
    
    const filter = { 
      isPublished: true,
      accessLevel: { $in: ['public', 'employee'] }
    };
    
    // Add role-based access
    if (req.user && ['manager', 'admin'].includes(req.user.role)) {
      filter.accessLevel.$in.push('manager');
    }
    if (req.user && req.user.role === 'admin') {
      filter.accessLevel.$in.push('admin');
    }
    
    if (category) {filter.category = category;}
    if (type) {filter.type = type;}
    if (difficulty) {filter.difficulty = difficulty;}
    if (featured !== undefined) {filter.isFeatured = featured === 'true';}
    
    let query = SupportResource.find(filter);
    
    // Text search
    if (search) {
      query = SupportResource.find({
        ...filter,
        $text: { $search: search }
      });
      
      if (req.user) {
        await logUserAction(req.user._id, 'RESOURCE_SEARCH', req.ip, req.get('User-Agent'), { 
          searchQuery: search,
          category,
          type
        });
      }
    }
    
    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { 'rating.averageRating': -1, 'rating.ratingCount': -1 };
        break;
      case 'views':
        sortOptions = { viewCount: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'title':
        sortOptions = { title: 1 };
        break;
      default:
        sortOptions = { 'rating.averageRating': -1 };
    }
    
    const resources = await query
      .populate('createdBy', 'firstName lastName')
      .populate('lastUpdatedBy', 'firstName lastName')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await SupportResource.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        resources,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resources' });
  }
});

// Get resource categories
router.get('/resources/categories', async (req, res) => {
  try {
    const categories = await SupportResource.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating.averageRating' },
          totalViews: { $sum: '$viewCount' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    const categoryMap = {
      'handbook': { 
        title: 'Executive Handbook',
        description: 'Comprehensive guides and best practices',
        icon: 'BookOpen',
        color: '#1E40AF'
      },
      'training': { 
        title: 'Masterclass Series',
        description: 'Professional video tutorials',
        icon: 'Video',
        color: '#7C3AED'
      },
      'community': { 
        title: 'Executive Network',
        description: 'Peer-to-peer support forum',
        icon: 'MessageSquare',
        color: '#059669'
      },
      'practices': { 
        title: 'Best Practices',
        description: 'Industry standards and procedures',
        icon: 'Target',
        color: '#F59E0B'
      },
      'technical': {
        title: 'Technical Documentation',
        description: 'System and platform guides',
        icon: 'Settings',
        color: '#6B7280'
      }
    };
    
    const result = categories.map(cat => ({
      category: cat._id,
      count: cat.count,
      avgRating: Math.round((cat.avgRating || 0) * 10) / 10,
      totalViews: cat.totalViews,
      ...categoryMap[cat._id]
    }));
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching resource categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resource categories' });
  }
});

// Get specific resource and increment view count
router.get('/resources/:id', async (req, res) => {
  try {
    const resource = await SupportResource.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('lastUpdatedBy', 'firstName lastName')
      .populate('relatedResources', 'title description type category rating');
    
    if (!resource || !resource.isPublished) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    
    // Check access level
    const userRole = req.user?.role || 'public';
    const hasAccess = 
      resource.accessLevel === 'public' ||
      (resource.accessLevel === 'employee' && req.user) ||
      (resource.accessLevel === 'manager' && ['manager', 'admin'].includes(userRole)) ||
      (resource.accessLevel === 'admin' && userRole === 'admin');
    
    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Increment view count
    resource.viewCount += 1;
    await resource.save();
    
    if (req.user) {
      await logUserAction(req.user._id, 'RESOURCE_VIEWED', req.ip, req.get('User-Agent'), { 
        resourceId: resource._id,
        category: resource.category,
        type: resource.type
      });
    }
    
    res.json({ success: true, data: resource });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resource' });
  }
});

// Rate a resource
router.post('/resources/:id/rate', protect, async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    
    const resource = await SupportResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    
    // Check if user already rated
    const existingRatingIndex = resource.userRatings.findIndex(
      r => r.userId.toString() === req.user._id.toString()
    );
    
    if (existingRatingIndex !== -1) {
      // Update existing rating
      resource.userRatings[existingRatingIndex].rating = rating;
      resource.userRatings[existingRatingIndex].ratedAt = new Date();
    } else {
      // Add new rating
      resource.userRatings.push({
        userId: req.user._id,
        rating
      });
    }
    
    await resource.save();
    
    await logUserAction(req.user._id, 'RESOURCE_RATED', req.ip, req.get('User-Agent'), { 
      resourceId: resource._id,
      rating
    });
    
    res.json({ 
      success: true, 
      data: {
        averageRating: resource.rating.averageRating,
        ratingCount: resource.rating.ratingCount,
        userRating: rating
      },
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Error rating resource:', error);
    res.status(500).json({ success: false, message: 'Failed to submit rating' });
  }
});

// Download resource (increment download count)
router.get('/resources/:id/download', protect, async (req, res) => {
  try {
    const resource = await SupportResource.findById(req.params.id);
    
    if (!resource || !resource.isPublished) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    
    // Check access level
    const userRole = req.user.role;
    const hasAccess = 
      resource.accessLevel === 'public' ||
      (resource.accessLevel === 'employee' && req.user) ||
      (resource.accessLevel === 'manager' && ['manager', 'admin'].includes(userRole)) ||
      (resource.accessLevel === 'admin' && userRole === 'admin');
    
    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    if (!resource.filePath) {
      return res.status(400).json({ success: false, message: 'No downloadable file available' });
    }
    
    // Increment download count
    resource.downloadCount += 1;
    await resource.save();
    
    await logUserAction(req.user._id, 'RESOURCE_DOWNLOADED', req.ip, req.get('User-Agent'), { 
      resourceId: resource._id,
      category: resource.category
    });
    
    // Return download URL or redirect
    res.json({ 
      success: true, 
      data: {
        downloadUrl: resource.filePath,
        filename: resource.title
      }
    });
  } catch (error) {
    console.error('Error downloading resource:', error);
    res.status(500).json({ success: false, message: 'Failed to download resource' });
  }
});

// Create new resource (admin only)
router.post('/resources', protect, authorize('admin'), async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      type,
      category,
      url,
      filePath,
      videoUrl,
      duration,
      difficulty,
      tags,
      accessLevel,
      isFeatured,
      prerequisites,
      estimatedReadTime
    } = req.body;
    
    if (!title || !description || !content || !type || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, description, content, type, and category are required' 
      });
    }
    
    const resource = new SupportResource({
      title,
      description,
      content,
      type,
      category,
      url,
      filePath,
      videoUrl,
      duration: duration || null,
      difficulty: difficulty || 'beginner',
      tags: tags || [],
      accessLevel: accessLevel || 'employee',
      isFeatured: isFeatured || false,
      prerequisites: prerequisites || [],
      estimatedReadTime: estimatedReadTime || null,
      createdBy: req.user._id
    });
    
    await resource.save();
    await resource.populate('createdBy', 'firstName lastName');
    
    await logUserAction(req.user._id, 'RESOURCE_CREATED', req.ip, req.get('User-Agent'), { 
      resourceId: resource._id,
      category,
      type
    });
    
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ success: false, message: 'Failed to create resource' });
  }
});

// Update resource (admin only)
router.put('/resources/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const resource = await SupportResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    
    const allowedUpdates = [
      'title', 'description', 'content', 'type', 'category', 'url', 'filePath',
      'videoUrl', 'duration', 'difficulty', 'tags', 'accessLevel', 'isFeatured',
      'prerequisites', 'estimatedReadTime', 'isPublished'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        resource[field] = req.body[field];
      }
    });
    
    resource.lastUpdatedBy = req.user._id;
    await resource.save();
    
    await logUserAction(req.user._id, 'RESOURCE_UPDATED', req.ip, req.get('User-Agent'), { 
      resourceId: resource._id
    });
    
    res.json({ success: true, data: resource });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ success: false, message: 'Failed to update resource' });
  }
});

// Delete resource (admin only)
router.delete('/resources/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const resource = await SupportResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    
    await resource.deleteOne();
    
    await logUserAction(req.user._id, 'RESOURCE_DELETED', req.ip, req.get('User-Agent'), { 
      resourceId: resource._id,
      title: resource.title
    });
    
    res.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resource' });
  }
});

module.exports = router;