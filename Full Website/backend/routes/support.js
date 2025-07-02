const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { protect, authorize } = require('../middleware/auth');
const { logUserAction } = require('../utils/auditLogger');
const { sendEmail } = require('../utils/emailService');
const SupportTicket = require('../models/SupportTicket');
const FAQ = require('../models/FAQ');
const User = require('../models/User');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/support');
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
    cb(null, `${timestamp}-${random}${extension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
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

// TICKET ROUTES

// Get all tickets for user
router.get('/tickets', protect, async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    
    const filter = { userId: req.user._id };
    if (status) {filter.status = status;}
    if (priority) {filter.priority = priority;}
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'userId', select: 'firstName lastName email' },
        { path: 'assignedTo', select: 'firstName lastName email' },
        { path: 'responses.userId', select: 'firstName lastName email role' }
      ]
    };
    
    const tickets = await SupportTicket.find(filter)
      .populate(options.populate)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);
    
    const total = await SupportTicket.countDocuments(filter);
    
    await logUserAction(req.user._id, 'SUPPORT_TICKETS_VIEWED', req.ip, req.get('User-Agent'), { 
      filter, 
      resultCount: tickets.length 
    });
    
    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          current: options.page,
          pages: Math.ceil(total / options.limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
  }
});

// Get specific ticket
router.get('/tickets/:ticketId', protect, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      $or: [
        { ticketId: req.params.ticketId },
        { _id: req.params.ticketId }
      ]
    }).populate([
      { path: 'userId', select: 'firstName lastName email' },
      { path: 'assignedTo', select: 'firstName lastName email role' },
      { path: 'responses.userId', select: 'firstName lastName email role' }
    ]);
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    // Check if user owns ticket or is admin/support
    if (ticket.userId._id.toString() !== req.user._id.toString() && 
        !['admin', 'support'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    await logUserAction(req.user._id, 'SUPPORT_TICKET_VIEWED', req.ip, req.get('User-Agent'), { 
      ticketId: ticket.ticketId 
    });
    
    res.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ticket' });
  }
});

// Create new ticket
router.post('/tickets', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const { priority, category, subject, description } = req.body;
    
    // Validate required fields
    if (!priority || !category || !subject || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required: priority, category, subject, description' 
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
    
    const ticket = new SupportTicket({
      userId: req.user._id,
      priority,
      category,
      subject,
      description,
      attachments
    });
    
    await ticket.save();
    await ticket.populate([
      { path: 'userId', select: 'firstName lastName email' }
    ]);
    
    // Send notification email to support team
    try {
      const supportEmails = process.env.SUPPORT_EMAILS?.split(',') || ['support@bnc.ca'];
      await sendEmail({
        to: supportEmails,
        subject: `New Support Ticket: ${ticket.ticketId} - ${priority.toUpperCase()}`,
        html: `
          <h2>New Support Ticket Created</h2>
          <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
          <p><strong>Priority:</strong> ${priority.toUpperCase()}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>From:</strong> ${req.user.firstName} ${req.user.lastName} (${req.user.email})</p>
          <p><strong>SLA Deadline:</strong> ${ticket.slaDeadline.toLocaleString()}</p>
          <hr>
          <p><strong>Description:</strong></p>
          <p>${description}</p>
          ${attachments.length > 0 ? `<p><strong>Attachments:</strong> ${attachments.length} file(s)</p>` : ''}
        `
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }
    
    // Log action
    await logUserAction(req.user._id, 'SUPPORT_TICKET_CREATED', req.ip, req.get('User-Agent'), { 
      ticketId: ticket.ticketId,
      priority,
      category,
      attachmentCount: attachments.length
    });
    
    // Emit real-time notification to support team
    if (global.io) {
      global.io.to('support-team').emit('new-ticket', {
        ticketId: ticket.ticketId,
        priority,
        category,
        subject,
        user: {
          name: `${req.user.firstName} ${req.user.lastName}`,
          email: req.user.email
        },
        createdAt: ticket.createdAt
      });
    }
    
    res.status(201).json({ 
      success: true, 
      data: ticket,
      message: `Ticket ${ticket.ticketId} created successfully` 
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ success: false, message: 'Failed to create ticket' });
  }
});

// Add response to ticket
router.post('/tickets/:ticketId/responses', protect, upload.array('attachments', 3), async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }
    
    const ticket = await SupportTicket.findOne({
      $or: [
        { ticketId: req.params.ticketId },
        { _id: req.params.ticketId }
      ]
    });
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    // Check permissions
    if (ticket.userId.toString() !== req.user._id.toString() && 
        !['admin', 'support'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Process attachments
    const attachments = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    })) : [];
    
    const response = {
      userId: req.user._id,
      message,
      isStaff: ['admin', 'support'].includes(req.user.role),
      attachments
    };
    
    ticket.responses.push(response);
    
    // Update ticket status if it was waiting for response
    if (ticket.status === 'waiting_response' && response.isStaff) {
      ticket.status = 'in_progress';
    } else if (!response.isStaff && ticket.status === 'in_progress') {
      ticket.status = 'waiting_response';
    }
    
    await ticket.save();
    await ticket.populate([
      { path: 'responses.userId', select: 'firstName lastName email role' }
    ]);
    
    // Send notification email
    try {
      const recipient = response.isStaff ? ticket.userId : ticket.assignedTo;
      if (recipient) {
        const user = await User.findById(recipient);
        if (user) {
          await sendEmail({
            to: user.email,
            subject: `Ticket Update: ${ticket.ticketId}`,
            html: `
              <h2>New Response on Your Support Ticket</h2>
              <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
              <p><strong>Subject:</strong> ${ticket.subject}</p>
              <p><strong>From:</strong> ${req.user.firstName} ${req.user.lastName}</p>
              <hr>
              <p><strong>Response:</strong></p>
              <p>${message}</p>
            `
          });
        }
      }
    } catch (emailError) {
      console.error('Failed to send response notification:', emailError);
    }
    
    await logUserAction(req.user._id, 'SUPPORT_TICKET_RESPONSE_ADDED', req.ip, req.get('User-Agent'), { 
      ticketId: ticket.ticketId,
      isStaff: response.isStaff
    });
    
    res.json({ 
      success: true, 
      data: ticket,
      message: 'Response added successfully' 
    });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({ success: false, message: 'Failed to add response' });
  }
});

// Update ticket status (admin/support only)
router.patch('/tickets/:ticketId/status', protect, authorize('admin', 'support'), async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    
    const ticket = await SupportTicket.findOne({
      $or: [
        { ticketId: req.params.ticketId },
        { _id: req.params.ticketId }
      ]
    });
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    if (status) {ticket.status = status;}
    if (assignedTo) {ticket.assignedTo = assignedTo;}
    
    if (status === 'resolved') {
      ticket.resolvedAt = new Date();
    }
    
    await ticket.save();
    
    await logUserAction(req.user._id, 'SUPPORT_TICKET_STATUS_UPDATED', req.ip, req.get('User-Agent'), { 
      ticketId: ticket.ticketId,
      newStatus: status,
      assignedTo
    });
    
    res.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ success: false, message: 'Failed to update ticket status' });
  }
});

// FAQ ROUTES

// Get all FAQs with filtering and search
router.get('/faq', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      page = 1, 
      limit = 20, 
      sortBy = 'helpful',
      verified
    } = req.query;
    
    const filter = { isPublished: true };
    
    if (category) {filter.category = category;}
    if (verified !== undefined) {filter.isVerified = verified === 'true';}
    
    let query = FAQ.find(filter);
    
    // Text search
    if (search) {
      query = FAQ.find({
        ...filter,
        $text: { $search: search }
      });
      
      // Log search for analytics
      if (req.user) {
        await logUserAction(req.user._id, 'FAQ_SEARCH', req.ip, req.get('User-Agent'), { 
          searchQuery: search,
          category
        });
      }
    }
    
    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'helpful':
        sortOptions = { 'votes.helpfulPercentage': -1, 'votes.totalVotes': -1 };
        break;
      case 'views':
        sortOptions = { viewCount: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'updated':
        sortOptions = { updatedAt: -1 };
        break;
      default:
        sortOptions = { 'votes.helpfulPercentage': -1 };
    }
    
    const faqs = await query
      .populate('createdBy', 'firstName lastName')
      .populate('lastUpdatedBy', 'firstName lastName')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await FAQ.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        faqs,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch FAQs' });
  }
});

// Get FAQ categories with article counts
router.get('/faq/categories', async (req, res) => {
  try {
    const categories = await FAQ.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgHelpfulness: { $avg: '$votes.helpfulPercentage' },
          totalViews: { $sum: '$viewCount' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    const categoryMap = {
      'Account Management': { icon: 'Shield', color: '#1E40AF' },
      'Training Excellence': { icon: 'GraduationCap', color: '#7C3AED' },
      'Team Leadership': { icon: 'Users', color: '#F59E0B' },
      'Rewards & Recognition': { icon: 'Trophy', color: '#059669' },
      'Technical Excellence': { icon: 'Settings', color: '#6B7280' }
    };
    
    const result = categories.map(cat => ({
      name: cat._id,
      count: cat.count,
      avgHelpfulness: Math.round(cat.avgHelpfulness || 0),
      totalViews: cat.totalViews,
      ...categoryMap[cat._id]
    }));
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch FAQ categories' });
  }
});

// Get specific FAQ and increment view count
router.get('/faq/:id', async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('lastUpdatedBy', 'firstName lastName');
    
    if (!faq || !faq.isPublished) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    
    // Increment view count
    faq.viewCount += 1;
    await faq.save();
    
    if (req.user) {
      await logUserAction(req.user._id, 'FAQ_VIEWED', req.ip, req.get('User-Agent'), { 
        faqId: faq._id,
        category: faq.category
      });
    }
    
    res.json({ success: true, data: faq });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch FAQ' });
  }
});

// Vote on FAQ (helpful/not helpful)
router.post('/faq/:id/vote', protect, async (req, res) => {
  try {
    const { helpful } = req.body;
    
    if (typeof helpful !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Vote must be true (helpful) or false (not helpful)' });
    }
    
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    
    // Check if user already voted
    const existingVoteIndex = faq.userVotes.findIndex(
      vote => vote.userId.toString() === req.user._id.toString()
    );
    
    if (existingVoteIndex !== -1) {
      // Update existing vote
      const oldVote = faq.userVotes[existingVoteIndex].vote;
      faq.userVotes[existingVoteIndex].vote = helpful;
      faq.userVotes[existingVoteIndex].votedAt = new Date();
      
      // Adjust vote counts
      if (oldVote !== helpful) {
        if (helpful) {
          faq.votes.helpful += 1;
          faq.votes.notHelpful -= 1;
        } else {
          faq.votes.helpful -= 1;
          faq.votes.notHelpful += 1;
        }
      }
    } else {
      // Add new vote
      faq.userVotes.push({
        userId: req.user._id,
        vote: helpful
      });
      
      if (helpful) {
        faq.votes.helpful += 1;
      } else {
        faq.votes.notHelpful += 1;
      }
    }
    
    await faq.save();
    
    await logUserAction(req.user._id, 'FAQ_VOTED', req.ip, req.get('User-Agent'), { 
      faqId: faq._id,
      vote: helpful ? 'helpful' : 'not_helpful'
    });
    
    res.json({ 
      success: true, 
      data: {
        votes: faq.votes,
        userVote: helpful
      },
      message: 'Vote recorded successfully'
    });
  } catch (error) {
    console.error('Error voting on FAQ:', error);
    res.status(500).json({ success: false, message: 'Failed to record vote' });
  }
});

// Create new FAQ (admin only)
router.post('/faq', protect, authorize('admin'), async (req, res) => {
  try {
    const { question, answer, category, tags, isVerified } = req.body;
    
    if (!question || !answer || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Question, answer, and category are required' 
      });
    }
    
    const faq = new FAQ({
      question,
      answer,
      category,
      tags: tags || [],
      isVerified: isVerified || false,
      createdBy: req.user._id
    });
    
    await faq.save();
    await faq.populate('createdBy', 'firstName lastName');
    
    await logUserAction(req.user._id, 'FAQ_CREATED', req.ip, req.get('User-Agent'), { 
      faqId: faq._id,
      category
    });
    
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ success: false, message: 'Failed to create FAQ' });
  }
});

module.exports = router;