const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { protect, authorize } = require('../middleware/auth');
const { logUserAction } = require('../utils/auditLogger');
const ForumPost = require('../models/ForumPost');
const ForumComment = require('../models/ForumComment');
const User = require('../models/User');

const router = express.Router();

// Configure multer for forum file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/forum');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const extension = path.extname(file.originalname);
    cb(null, `forum-${timestamp}-${random}${extension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PNG, JPG, JPEG, and TXT files are allowed.'), false);
    }
  }
});

// FORUM POSTS ROUTES

// Get all forum posts with filtering
router.get('/posts', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      status = 'active',
      sortBy = 'activity',
      page = 1, 
      limit = 20,
      pinned
    } = req.query;
    
    const filter = { status };
    
    if (category) {filter.category = category;}
    if (pinned !== undefined) {filter.isPinned = pinned === 'true';}
    
    let query = ForumPost.find(filter);
    
    // Text search
    if (search) {
      query = ForumPost.find({
        ...filter,
        $text: { $search: search }
      });
      
      if (req.user) {
        await logUserAction(req.user._id, 'FORUM_SEARCH', req.ip, req.get('User-Agent'), { 
          searchQuery: search,
          category
        });
      }
    }
    
    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'activity':
        sortOptions = { isPinned: -1, lastActivity: -1 };
        break;
      case 'votes':
        sortOptions = { isPinned: -1, 'votes.upvotes': -1 };
        break;
      case 'views':
        sortOptions = { isPinned: -1, 'views.count': -1 };
        break;
      case 'newest':
        sortOptions = { isPinned: -1, createdAt: -1 };
        break;
      case 'comments':
        sortOptions = { isPinned: -1, commentCount: -1 };
        break;
      default:
        sortOptions = { isPinned: -1, lastActivity: -1 };
    }
    
    const posts = await query
      .populate('author', 'firstName lastName role department')
      .populate('lastActivityBy', 'firstName lastName')
      .populate('verifiedBy', 'firstName lastName')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await ForumPost.countDocuments(filter);
    
    // Update view counts for authenticated users
    if (req.user) {
      for (const post of posts) {
        await post.addView(req.user._id, req.ip);
      }
    }
    
    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch forum posts' });
  }
});

// Get forum categories with post counts
router.get('/categories', async (req, res) => {
  try {
    const categories = await ForumPost.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views.count' },
          totalComments: { $sum: '$commentCount' },
          latestActivity: { $max: '$lastActivity' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    const categoryMap = {
      'Portfolio Management': { icon: 'TrendingUp', color: '#3B82F6' },
      'Digital Innovation': { icon: 'Zap', color: '#8B5CF6' },
      'Leadership': { icon: 'Users', color: '#F59E0B' },
      'Risk Management': { icon: 'Shield', color: '#EF4444' },
      'Customer Relations': { icon: 'Heart', color: '#10B981' },
      'Training & Development': { icon: 'GraduationCap', color: '#6366F1' },
      'Market Analysis': { icon: 'BarChart', color: '#F97316' },
      'Regulatory Compliance': { icon: 'FileCheck', color: '#6B7280' },
      'Technology': { icon: 'Code', color: '#0EA5E9' },
      'General Discussion': { icon: 'MessageCircle', color: '#84CC16' }
    };
    
    const result = categories.map(cat => ({
      category: cat._id,
      count: cat.count,
      totalViews: cat.totalViews,
      totalComments: cat.totalComments,
      latestActivity: cat.latestActivity,
      ...categoryMap[cat._id]
    }));
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching forum categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch forum categories' });
  }
});

// Get specific forum post
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'firstName lastName role department')
      .populate('lastActivityBy', 'firstName lastName')
      .populate('verifiedBy', 'firstName lastName')
      .populate('solution.markedBy', 'firstName lastName')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'firstName lastName role'
        }
      });
    
    if (!post || post.status === 'deleted') {
      return res.status(404).json({ success: false, message: 'Forum post not found' });
    }
    
    // Update view count
    if (req.user) {
      await post.addView(req.user._id, req.ip);
    }
    
    if (req.user) {
      await logUserAction(req.user._id, 'FORUM_POST_VIEWED', req.ip, req.get('User-Agent'), { 
        postId: post._id,
        category: post.category
      });
    }
    
    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Error fetching forum post:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch forum post' });
  }
});

// Create new forum post
router.post('/posts', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const { title, content, category, tags, priority = 'normal' } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, content, and category are required' 
      });
    }
    
    // Process attachments
    const attachments = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    })) : [];
    
    const post = new ForumPost({
      title: title.trim(),
      content: content.trim(),
      author: req.user._id,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      priority,
      attachments
    });
    
    await post.save();
    await post.populate('author', 'firstName lastName role department');
    
    // Notify moderators about high/urgent priority posts
    if (['high', 'urgent'].includes(priority) || req.body.needsVerification) {
      if (global.io) {
        global.io.to('moderators').emit('new-high-priority-post', {
          postId: post._id,
          title: post.title,
          author: `${req.user.firstName} ${req.user.lastName}`,
          category: post.category,
          priority: post.priority
        });
      }
    }
    
    await logUserAction(req.user._id, 'FORUM_POST_CREATED', req.ip, req.get('User-Agent'), { 
      postId: post._id,
      category,
      priority,
      attachmentCount: attachments.length
    });
    
    res.status(201).json({ 
      success: true, 
      data: post,
      message: 'Forum post created successfully' 
    });
  } catch (error) {
    console.error('Error creating forum post:', error);
    res.status(500).json({ success: false, message: 'Failed to create forum post' });
  }
});

// Update forum post
router.put('/posts/:id', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Forum post not found' });
    }
    
    // Check if user owns post or is moderator
    if (post.author.toString() !== req.user._id.toString() && 
        !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const { title, content, category, tags, reason } = req.body;
    
    // Store edit history
    if (content && content !== post.content) {
      post.editHistory.push({
        editedBy: req.user._id,
        reason: reason || 'Content updated',
        previousContent: post.content
      });
    }
    
    // Update fields
    if (title) {post.title = title.trim();}
    if (content) {post.content = content.trim();}
    if (category) {post.category = category;}
    if (tags) {post.tags = tags.split(',').map(tag => tag.trim());}
    
    // Process new attachments
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      }));
      post.attachments = [...post.attachments, ...newAttachments];
    }
    
    await post.save();
    await post.populate('author', 'firstName lastName role department');
    
    await logUserAction(req.user._id, 'FORUM_POST_UPDATED', req.ip, req.get('User-Agent'), { 
      postId: post._id,
      reason
    });
    
    res.json({ 
      success: true, 
      data: post,
      message: 'Forum post updated successfully' 
    });
  } catch (error) {
    console.error('Error updating forum post:', error);
    res.status(500).json({ success: false, message: 'Failed to update forum post' });
  }
});

// Vote on forum post
router.post('/posts/:id/vote', protect, async (req, res) => {
  try {
    const { vote } = req.body; // 'up' or 'down'
    
    if (!['up', 'down'].includes(vote)) {
      return res.status(400).json({ success: false, message: 'Vote must be "up" or "down"' });
    }
    
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Forum post not found' });
    }
    
    // Can't vote on own posts
    if (post.author.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot vote on your own post' });
    }
    
    await post.vote(req.user._id, vote);
    
    await logUserAction(req.user._id, 'FORUM_POST_VOTED', req.ip, req.get('User-Agent'), { 
      postId: post._id,
      vote
    });
    
    res.json({ 
      success: true, 
      data: {
        upvotes: post.votes.upvotes,
        downvotes: post.votes.downvotes,
        userVote: vote
      },
      message: 'Vote recorded successfully'
    });
  } catch (error) {
    console.error('Error voting on forum post:', error);
    res.status(500).json({ success: false, message: 'Failed to record vote' });
  }
});

// FORUM COMMENTS ROUTES

// Get comments for a post
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const { sortBy = 'oldest', page = 1, limit = 50 } = req.query;
    
    let sortOptions = {};
    switch (sortBy) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'votes':
        sortOptions = { 'votes.upvotes': -1, createdAt: 1 };
        break;
      case 'solution':
        sortOptions = { isSolution: -1, 'votes.upvotes': -1, createdAt: 1 };
        break;
      default:
        sortOptions = { createdAt: 1 };
    }
    
    const comments = await ForumComment.find({
      postId: req.params.postId,
      status: { $ne: 'deleted' }
    })
    .populate('author', 'firstName lastName role department')
    .populate('verifiedBy', 'firstName lastName')
    .populate('markedAsSolutionBy', 'firstName lastName')
    .populate({
      path: 'replies',
      populate: {
        path: 'author',
        select: 'firstName lastName role'
      }
    })
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await ForumComment.countDocuments({
      postId: req.params.postId,
      status: { $ne: 'deleted' }
    });
    
    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching forum comments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch forum comments' });
  }
});

// Create comment
router.post('/posts/:postId/comments', protect, upload.array('attachments', 3), async (req, res) => {
  try {
    const { content, parentCommentId } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }
    
    const post = await ForumPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Forum post not found' });
    }
    
    if (post.status === 'locked') {
      return res.status(400).json({ success: false, message: 'Cannot comment on locked posts' });
    }
    
    // Check parent comment if specified
    let depth = 0;
    if (parentCommentId) {
      const parentComment = await ForumComment.findById(parentCommentId);
      if (!parentComment || parentComment.postId.toString() !== req.params.postId) {
        return res.status(400).json({ success: false, message: 'Invalid parent comment' });
      }
      depth = parentComment.depth + 1;
      if (depth > 5) {
        return res.status(400).json({ success: false, message: 'Maximum reply depth exceeded' });
      }
    }
    
    // Process attachments
    const attachments = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    })) : [];
    
    // Extract mentions from content
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push({ username: match[1] });
    }
    
    const comment = new ForumComment({
      postId: req.params.postId,
      author: req.user._id,
      content: content.trim(),
      parentComment: parentCommentId || undefined,
      depth,
      attachments,
      mentions,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });
    
    await comment.save();
    await comment.populate('author', 'firstName lastName role department');
    
    // Update parent comment replies
    if (parentCommentId) {
      await ForumComment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    }
    
    // Update post comment count and activity
    post.commentCount += 1;
    post.comments.push(comment._id);
    await post.updateActivity(req.user._id);
    
    // Notify post author if not commenting on own post
    if (post.author.toString() !== req.user._id.toString()) {
      if (global.io) {
        global.io.to(`user-${post.author}`).emit('new-comment', {
          postId: post._id,
          postTitle: post.title,
          commenterName: `${req.user.firstName} ${req.user.lastName}`,
          comment: content.substring(0, 100)
        });
      }
    }
    
    // Notify mentioned users
    for (const mention of mentions) {
      const mentionedUser = await User.findOne({ username: mention.username });
      if (mentionedUser && mentionedUser._id.toString() !== req.user._id.toString()) {
        mention.userId = mentionedUser._id;
        if (global.io) {
          global.io.to(`user-${mentionedUser._id}`).emit('mentioned-in-comment', {
            postId: post._id,
            postTitle: post.title,
            commenterName: `${req.user.firstName} ${req.user.lastName}`,
            comment: content
          });
        }
      }
    }
    
    await logUserAction(req.user._id, 'FORUM_COMMENT_CREATED', req.ip, req.get('User-Agent'), { 
      postId: req.params.postId,
      commentId: comment._id,
      parentCommentId,
      mentionCount: mentions.length
    });
    
    res.status(201).json({ 
      success: true, 
      data: comment,
      message: 'Comment created successfully' 
    });
  } catch (error) {
    console.error('Error creating forum comment:', error);
    res.status(500).json({ success: false, message: 'Failed to create comment' });
  }
});

// Vote on comment
router.post('/comments/:id/vote', protect, async (req, res) => {
  try {
    const { vote } = req.body; // 'up' or 'down'
    
    if (!['up', 'down'].includes(vote)) {
      return res.status(400).json({ success: false, message: 'Vote must be "up" or "down"' });
    }
    
    const comment = await ForumComment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    
    // Can't vote on own comments
    if (comment.author.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot vote on your own comment' });
    }
    
    await comment.vote(req.user._id, vote);
    
    await logUserAction(req.user._id, 'FORUM_COMMENT_VOTED', req.ip, req.get('User-Agent'), { 
      commentId: comment._id,
      vote
    });
    
    res.json({ 
      success: true, 
      data: {
        upvotes: comment.votes.upvotes,
        downvotes: comment.votes.downvotes,
        userVote: vote
      },
      message: 'Vote recorded successfully'
    });
  } catch (error) {
    console.error('Error voting on comment:', error);
    res.status(500).json({ success: false, message: 'Failed to record vote' });
  }
});

// Mark comment as solution
router.post('/comments/:id/solution', protect, async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id)
      .populate('postId');
    
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    
    const post = comment.postId;
    
    // Only post author or moderators can mark solutions
    if (post.author.toString() !== req.user._id.toString() && 
        !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only post author or moderators can mark solutions' });
    }
    
    // Remove previous solution if exists
    if (post.solution.commentId) {
      await ForumComment.findByIdAndUpdate(post.solution.commentId, {
        isSolution: false,
        $unset: { 
          markedAsSolutionBy: 1,
          markedAsSolutionAt: 1
        }
      });
    }
    
    // Mark new solution
    await comment.markAsSolution(req.user._id);
    
    // Update post solution reference
    post.solution = {
      commentId: comment._id,
      markedBy: req.user._id,
      markedAt: new Date()
    };
    await post.save();
    
    // Notify comment author
    if (comment.author.toString() !== req.user._id.toString()) {
      if (global.io) {
        global.io.to(`user-${comment.author}`).emit('solution-marked', {
          postId: post._id,
          postTitle: post.title,
          markedBy: `${req.user.firstName} ${req.user.lastName}`
        });
      }
    }
    
    await logUserAction(req.user._id, 'FORUM_SOLUTION_MARKED', req.ip, req.get('User-Agent'), { 
      postId: post._id,
      commentId: comment._id
    });
    
    res.json({ 
      success: true, 
      data: comment,
      message: 'Comment marked as solution successfully' 
    });
  } catch (error) {
    console.error('Error marking solution:', error);
    res.status(500).json({ success: false, message: 'Failed to mark solution' });
  }
});

// MODERATION ROUTES

// Pin/unpin post (moderators only)
router.patch('/posts/:id/pin', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const { pinned } = req.body;
    
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Forum post not found' });
    }
    
    post.isPinned = pinned;
    await post.save();
    
    await logUserAction(req.user._id, 'FORUM_POST_PINNED', req.ip, req.get('User-Agent'), { 
      postId: post._id,
      pinned
    });
    
    res.json({ 
      success: true, 
      data: post,
      message: `Post ${pinned ? 'pinned' : 'unpinned'} successfully` 
    });
  } catch (error) {
    console.error('Error pinning post:', error);
    res.status(500).json({ success: false, message: 'Failed to pin post' });
  }
});

// Verify post (moderators only)
router.patch('/posts/:id/verify', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const { verified } = req.body;
    
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Forum post not found' });
    }
    
    post.isVerified = verified;
    if (verified) {
      post.verifiedBy = req.user._id;
      post.verifiedAt = new Date();
    } else {
      post.verifiedBy = undefined;
      post.verifiedAt = undefined;
    }
    
    await post.save();
    
    await logUserAction(req.user._id, 'FORUM_POST_VERIFIED', req.ip, req.get('User-Agent'), { 
      postId: post._id,
      verified
    });
    
    res.json({ 
      success: true, 
      data: post,
      message: `Post ${verified ? 'verified' : 'unverified'} successfully` 
    });
  } catch (error) {
    console.error('Error verifying post:', error);
    res.status(500).json({ success: false, message: 'Failed to verify post' });
  }
});

// Lock/unlock post (moderators only)
router.patch('/posts/:id/lock', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const { locked } = req.body;
    
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Forum post not found' });
    }
    
    post.status = locked ? 'locked' : 'active';
    await post.save();
    
    await logUserAction(req.user._id, 'FORUM_POST_LOCKED', req.ip, req.get('User-Agent'), { 
      postId: post._id,
      locked
    });
    
    res.json({ 
      success: true, 
      data: post,
      message: `Post ${locked ? 'locked' : 'unlocked'} successfully` 
    });
  } catch (error) {
    console.error('Error locking post:', error);
    res.status(500).json({ success: false, message: 'Failed to lock post' });
  }
});

// Get forum statistics (moderators only)
router.get('/stats', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '24h':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } };
        break;
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
    }
    
    const [
      totalPosts,
      totalComments,
      activePosts,
      totalViews,
      categoryDistribution,
      topContributors
    ] = await Promise.all([
      ForumPost.countDocuments({ ...dateFilter, status: { $ne: 'deleted' } }),
      ForumComment.countDocuments({ ...dateFilter, status: { $ne: 'deleted' } }),
      ForumPost.countDocuments({ ...dateFilter, status: 'active' }),
      ForumPost.aggregate([
        { $match: { ...dateFilter, status: { $ne: 'deleted' } } },
        { $group: { _id: null, totalViews: { $sum: '$views.count' } } }
      ]),
      ForumPost.aggregate([
        { $match: { ...dateFilter, status: { $ne: 'deleted' } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      ForumPost.aggregate([
        { $match: { ...dateFilter, status: { $ne: 'deleted' } } },
        { $group: { _id: '$author', postCount: { $sum: 1 } } },
        { $sort: { postCount: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 1,
            postCount: 1,
            'user.firstName': 1,
            'user.lastName': 1,
            'user.role': 1
          }
        }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        period,
        totalPosts,
        totalComments,
        activePosts,
        totalViews: totalViews[0]?.totalViews || 0,
        categoryDistribution,
        topContributors
      }
    });
  } catch (error) {
    console.error('Error fetching forum statistics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch forum statistics' });
  }
});

module.exports = router;