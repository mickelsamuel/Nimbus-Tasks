const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { protect, authorize } = require('../middleware/auth');
const { logUserAction } = require('../utils/auditLogger');
const { sendEmail } = require('../utils/emailService');
const SupportChat = require('../models/SupportChat');
const User = require('../models/User');
const aiService = require('../utils/enhancedAiService');

const router = express.Router();

// Helper function to determine if a question is financial/banking related
async function isFinancialBankingQuestion(message) {
  const financialKeywords = [
    'bank', 'banking', 'finance', 'financial', 'investment', 'portfolio', 'loan', 'credit',
    'mortgage', 'interest', 'rate', 'deposit', 'account', 'savings', 'checking', 'money',
    'currency', 'exchange', 'trading', 'stock', 'bond', 'mutual fund', 'etf', 'rrsp',
    'tfsa', 'tax', 'insurance', 'wealth', 'retirement', 'pension', 'budget', 'debt',
    'equity', 'dividend', 'yield', 'capital', 'risk', 'return', 'market', 'economy',
    'gdp', 'inflation', 'deflation', 'recession', 'bull market', 'bear market',
    'national bank', 'bnc', 'banque nationale', 'canada', 'canadian', 'cad', 'usd',
    'compliance', 'regulation', 'basel', 'stress test', 'liquidity', 'capital ratio',
    'aml', 'kyc', 'fatca', 'crs', 'privacy', 'security', 'fraud', 'cybersecurity'
  ];
  
  const messageLower = message.toLowerCase();
  
  // Check for direct keyword matches
  const hasFinancialKeywords = financialKeywords.some(keyword => 
    messageLower.includes(keyword)
  );
  
  // Check for financial question patterns
  const financialPatterns = [
    /how.*invest/i,
    /what.*interest/i,
    /when.*market/i,
    /why.*price/i,
    /where.*bank/i,
    /portfolio.*performance/i,
    /risk.*management/i,
    /financial.*planning/i,
    /credit.*score/i,
    /mortgage.*rate/i,
    /retirement.*planning/i,
    /tax.*strategy/i,
    /investment.*strategy/i
  ];
  
  const hasFinancialPatterns = financialPatterns.some(pattern => 
    pattern.test(message)
  );
  
  return hasFinancialKeywords || hasFinancialPatterns;
}

// Configure multer for chat file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/chat');
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
    cb(null, `chat-${timestamp}-${random}${extension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for chat files
    files: 3
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, PNG, JPG, JPEG, and TXT files are allowed.'), false);
    }
  }
});

// Start new chat session
router.post('/start', protect, async (req, res) => {
  try {
    const { priority = 'medium', category = 'general', initialMessage } = req.body;
    
    if (!initialMessage || initialMessage.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Initial message is required to start chat' 
      });
    }
    
    // Check if user has an active chat session
    const existingChat = await SupportChat.findOne({
      userId: req.user._id,
      status: { $in: ['waiting', 'active'] }
    });
    
    if (existingChat) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have an active chat session',
        data: { sessionId: existingChat.sessionId }
      });
    }
    
    // Create new chat session
    const chat = new SupportChat({
      userId: req.user._id,
      priority,
      category,
      metadata: {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        referrer: req.get('Referrer') || req.get('Referer'),
        department: req.user.department
      },
      messages: [{
        senderId: req.user._id,
        senderType: 'user',
        message: initialMessage.trim(),
        messageType: 'text'
      }]
    });
    
    await chat.save();
    await chat.populate([
      { path: 'userId', select: 'firstName lastName email role department' },
      { path: 'messages.senderId', select: 'firstName lastName role' }
    ]);
    
    // Notify support team about new chat
    if (global.io) {
      global.io.to('support-team').emit('new-chat', {
        sessionId: chat.sessionId,
        userId: req.user._id,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        userEmail: req.user.email,
        priority,
        category,
        initialMessage,
        startedAt: chat.startedAt
      });
    }
    
    // Send email notification to support team for high/critical priority
    if (['critical', 'high'].includes(priority)) {
      try {
        const supportEmails = process.env.SUPPORT_EMAILS?.split(',') || ['support@bnc.ca'];
        await sendEmail({
          to: supportEmails,
          subject: `${priority.toUpperCase()} Priority Chat: ${chat.sessionId}`,
          html: `
            <h2>New ${priority.toUpperCase()} Priority Chat Session</h2>
            <p><strong>Session ID:</strong> ${chat.sessionId}</p>
            <p><strong>User:</strong> ${req.user.firstName} ${req.user.lastName} (${req.user.email})</p>
            <p><strong>Department:</strong> ${req.user.department || 'Not specified'}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Priority:</strong> ${priority.toUpperCase()}</p>
            <hr>
            <p><strong>Initial Message:</strong></p>
            <p>${initialMessage}</p>
          `
        });
      } catch (emailError) {
        console.error('Failed to send chat notification email:', emailError);
      }
    }
    
    await logUserAction(req.user._id, 'CHAT_SESSION_STARTED', req.ip, req.get('User-Agent'), { 
      sessionId: chat.sessionId,
      priority,
      category
    });
    
    res.status(201).json({ 
      success: true, 
      data: chat,
      message: 'Chat session started successfully' 
    });
  } catch (error) {
    console.error('Error starting chat session:', error);
    res.status(500).json({ success: false, message: 'Failed to start chat session' });
  }
});

// Get user's chat sessions
router.get('/sessions', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { userId: req.user._id };
    if (status) {filter.status = status;}
    
    const chats = await SupportChat.find(filter)
      .populate([
        { path: 'userId', select: 'firstName lastName email' },
        { path: 'assignedAgent', select: 'firstName lastName email' },
        { path: 'messages.senderId', select: 'firstName lastName role' }
      ])
      .sort({ startedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await SupportChat.countDocuments(filter);
    
    await logUserAction(req.user._id, 'CHAT_SESSIONS_VIEWED', req.ip, req.get('User-Agent'), { 
      filter,
      resultCount: chats.length 
    });
    
    res.json({
      success: true,
      data: {
        chats,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chat sessions' });
  }
});

// Get specific chat session
router.get('/sessions/:sessionId', protect, async (req, res) => {
  try {
    const chat = await SupportChat.findOne({
      sessionId: req.params.sessionId
    }).populate([
      { path: 'userId', select: 'firstName lastName email role department' },
      { path: 'assignedAgent', select: 'firstName lastName email role' },
      { path: 'messages.senderId', select: 'firstName lastName role' }
    ]);
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }
    
    // Check if user owns chat or is support agent
    if (chat.userId._id.toString() !== req.user._id.toString() && 
        !['admin', 'support'].includes(req.user.role) &&
        (!chat.assignedAgent || chat.assignedAgent._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Mark messages as read for current user
    let hasUnreadMessages = false;
    for (const message of chat.messages) {
      if (message.senderId._id.toString() !== req.user._id.toString() && !message.isRead) {
        message.isRead = true;
        hasUnreadMessages = true;
      }
    }
    
    if (hasUnreadMessages) {
      await chat.save();
    }
    
    await logUserAction(req.user._id, 'CHAT_SESSION_VIEWED', req.ip, req.get('User-Agent'), { 
      sessionId: chat.sessionId 
    });
    
    res.json({ success: true, data: chat });
  } catch (error) {
    console.error('Error fetching chat session:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chat session' });
  }
});

// Send message in chat
router.post('/sessions/:sessionId/messages', protect, upload.array('attachments', 3), async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }
    
    const chat = await SupportChat.findOne({
      sessionId: req.params.sessionId
    });
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }
    
    // Check if user can send messages in this chat
    const isOwner = chat.userId.toString() === req.user._id.toString();
    const isAssignedAgent = chat.assignedAgent && chat.assignedAgent.toString() === req.user._id.toString();
    const isSupportStaff = ['admin', 'support'].includes(req.user.role);
    
    if (!isOwner && !isAssignedAgent && !isSupportStaff) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Check if chat is still active
    if (['resolved', 'closed', 'abandoned'].includes(chat.status)) {
      return res.status(400).json({ success: false, message: 'Cannot send messages to a closed chat session' });
    }
    
    // Process attachments
    const attachments = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    })) : [];
    
    // Determine sender type
    let senderType = 'user';
    if (isSupportStaff || isAssignedAgent) {
      senderType = 'agent';
    }
    
    // Add message to chat
    const newMessage = {
      senderId: req.user._id,
      senderType,
      message: message.trim(),
      messageType: attachments.length > 0 ? 'file' : 'text',
      attachments,
      isRead: false
    };
    
    chat.messages.push(newMessage);
    
    // Generate AI response if user message and AI service is available
    if (senderType === 'user' && aiService.isAvailable()) {
      try {
        const userProfile = {
          role: req.user.role,
          department: req.user.department,
          level: req.user.level || 'intermediate'
        };
        
        // Use enhanced AI service with better domain filtering
        const aiResponse = await aiService.answerQuestion(message.trim(), {
          userProfile: userProfile,
          userRole: userProfile.role,
          department: userProfile.department,
          currentModule: 'Banking Advisory Chat'
        });
        
        // Add AI response to chat
        const aiMessage = {
          senderId: req.user._id, // Using user ID but marking as AI
          senderType: 'ai',
          message: aiResponse.answer,
          messageType: 'text',
          attachments: [],
          isRead: false,
          metadata: {
            confidence: aiResponse.confidence || 95,
            isFinancialQuery: aiResponse.isFinancialQuery !== false,
            model: 'Max AI - Enhanced National Bank Assistant',
            generatedAt: aiResponse.answeredAt,
            questionAnalysis: aiResponse.questionAnalysis
          }
        };
        
        chat.messages.push(aiMessage);
      } catch (aiError) {
        console.error('AI response generation failed:', aiError);
        
        // Enhanced fallback AI response
        const fallbackMessage = {
          senderId: req.user._id,
          senderType: 'ai',
          message: `Hello! I'm Max, your enhanced AI banking advisor from National Bank of Canada. I'm here to help with your banking and financial questions. 

🏦 How can I assist you today with:
• Personal and business banking services
• Investment strategies and portfolio management
• Loans, mortgages, and credit solutions
• Financial planning and retirement strategies
• Risk management and insurance options
• National Bank's digital banking tools
• Market insights and economic trends

Please feel free to ask me anything related to banking and finance! I'm powered by advanced AI to provide you with accurate, personalized guidance.`,
          messageType: 'text',
          attachments: [],
          isRead: false,
          metadata: {
            confidence: 85,
            model: 'Max AI - Enhanced Fallback Response',
            error: 'AI service temporarily unavailable',
            isFinancialQuery: true
          }
        };
        
        chat.messages.push(fallbackMessage);
      }
    }
    
    // Update chat status if needed
    if (chat.status === 'waiting' && senderType === 'agent') {
      chat.status = 'active';
      if (!chat.assignedAgent) {
        chat.assignedAgent = req.user._id;
      }
    }
    
    await chat.save();
    await chat.populate([
      { path: 'userId', select: 'firstName lastName email' },
      { path: 'assignedAgent', select: 'firstName lastName email' },
      { path: 'messages.senderId', select: 'firstName lastName role' }
    ]);
    
    // Emit real-time message
    if (global.io) {
      const messageData = {
        sessionId: chat.sessionId,
        message: newMessage,
        sender: {
          id: req.user._id,
          name: `${req.user.firstName} ${req.user.lastName}`,
          role: req.user.role
        }
      };
      
      // Send to chat participants
      global.io.to(`chat-${chat.sessionId}`).emit('new-message', messageData);
      
      // Send to support team if user message
      if (senderType === 'user') {
        global.io.to('support-team').emit('chat-message', messageData);
      }
    }
    
    await logUserAction(req.user._id, 'CHAT_MESSAGE_SENT', req.ip, req.get('User-Agent'), { 
      sessionId: chat.sessionId,
      messageType: newMessage.messageType,
      attachmentCount: attachments.length
    });
    
    res.json({ 
      success: true, 
      data: chat,
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Error sending chat message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// Assign agent to chat (support staff only)
router.patch('/sessions/:sessionId/assign', protect, authorize('admin', 'support'), async (req, res) => {
  try {
    const { agentId } = req.body;
    
    const chat = await SupportChat.findOne({
      sessionId: req.params.sessionId
    });
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }
    
    // Verify agent exists and is support staff
    if (agentId) {
      const agent = await User.findById(agentId);
      if (!agent || !['admin', 'support'].includes(agent.role)) {
        return res.status(400).json({ success: false, message: 'Invalid agent specified' });
      }
      chat.assignedAgent = agentId;
    } else {
      chat.assignedAgent = undefined;
    }
    
    if (chat.status === 'waiting' && agentId) {
      chat.status = 'active';
    }
    
    await chat.save();
    await chat.populate([
      { path: 'assignedAgent', select: 'firstName lastName email role' }
    ]);
    
    // Emit assignment update
    if (global.io) {
      global.io.to(`chat-${chat.sessionId}`).emit('agent-assigned', {
        sessionId: chat.sessionId,
        agent: chat.assignedAgent,
        assignedBy: req.user._id
      });
    }
    
    await logUserAction(req.user._id, 'CHAT_AGENT_ASSIGNED', req.ip, req.get('User-Agent'), { 
      sessionId: chat.sessionId,
      agentId
    });
    
    res.json({ success: true, data: chat });
  } catch (error) {
    console.error('Error assigning agent:', error);
    res.status(500).json({ success: false, message: 'Failed to assign agent' });
  }
});

// Update chat status
router.patch('/sessions/:sessionId/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'resolved', 'closed', 'abandoned'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const chat = await SupportChat.findOne({
      sessionId: req.params.sessionId
    });
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }
    
    // Check permissions
    const isOwner = chat.userId.toString() === req.user._id.toString();
    const isAssignedAgent = chat.assignedAgent && chat.assignedAgent.toString() === req.user._id.toString();
    const isSupportStaff = ['admin', 'support'].includes(req.user.role);
    
    if (!isOwner && !isAssignedAgent && !isSupportStaff) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Users can only close their own chats
    if (isOwner && !isSupportStaff && !['resolved', 'closed'].includes(status)) {
      return res.status(403).json({ success: false, message: 'Users can only close or mark chats as resolved' });
    }
    
    chat.status = status;
    
    if (['resolved', 'closed'].includes(status)) {
      chat.endedAt = new Date();
    }
    
    await chat.save();
    
    // Emit status update
    if (global.io) {
      global.io.to(`chat-${chat.sessionId}`).emit('status-updated', {
        sessionId: chat.sessionId,
        status,
        updatedBy: req.user._id
      });
    }
    
    await logUserAction(req.user._id, 'CHAT_STATUS_UPDATED', req.ip, req.get('User-Agent'), { 
      sessionId: chat.sessionId,
      newStatus: status
    });
    
    res.json({ success: true, data: chat });
  } catch (error) {
    console.error('Error updating chat status:', error);
    res.status(500).json({ success: false, message: 'Failed to update chat status' });
  }
});

// Rate chat session
router.post('/sessions/:sessionId/rate', protect, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    
    const chat = await SupportChat.findOne({
      sessionId: req.params.sessionId,
      userId: req.user._id
    });
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }
    
    if (!['resolved', 'closed'].includes(chat.status)) {
      return res.status(400).json({ success: false, message: 'Can only rate completed chat sessions' });
    }
    
    chat.satisfaction = {
      rating,
      feedback: feedback || '',
      ratedAt: new Date()
    };
    
    await chat.save();
    
    await logUserAction(req.user._id, 'CHAT_SESSION_RATED', req.ip, req.get('User-Agent'), { 
      sessionId: chat.sessionId,
      rating
    });
    
    res.json({ 
      success: true, 
      data: { rating, feedback },
      message: 'Rating submitted successfully' 
    });
  } catch (error) {
    console.error('Error rating chat session:', error);
    res.status(500).json({ success: false, message: 'Failed to submit rating' });
  }
});

// Get chat statistics (support staff only)
router.get('/stats', protect, authorize('admin', 'support'), async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '24h':
        dateFilter = { startedAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } };
        break;
      case '7d':
        dateFilter = { startedAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { startedAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
    }
    
    const [
      totalChats,
      activeChats,
      avgWaitTime,
      avgResponseTime,
      avgSatisfaction,
      statusDistribution,
      categoryDistribution
    ] = await Promise.all([
      SupportChat.countDocuments(dateFilter),
      SupportChat.countDocuments({ ...dateFilter, status: { $in: ['waiting', 'active'] } }),
      SupportChat.aggregate([
        { $match: { ...dateFilter, waitTime: { $exists: true } } },
        { $group: { _id: null, avgWaitTime: { $avg: '$waitTime' } } }
      ]),
      SupportChat.aggregate([
        { $match: { ...dateFilter, responseTime: { $exists: true } } },
        { $group: { _id: null, avgResponseTime: { $avg: '$responseTime' } } }
      ]),
      SupportChat.aggregate([
        { $match: { ...dateFilter, 'satisfaction.rating': { $exists: true } } },
        { $group: { _id: null, avgRating: { $avg: '$satisfaction.rating' } } }
      ]),
      SupportChat.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      SupportChat.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        period,
        totalChats,
        activeChats,
        avgWaitTime: avgWaitTime[0]?.avgWaitTime || 0,
        avgResponseTime: avgResponseTime[0]?.avgResponseTime || 0,
        avgSatisfaction: avgSatisfaction[0]?.avgRating || 0,
        statusDistribution,
        categoryDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching chat statistics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chat statistics' });
  }
});

// AI service status endpoint
router.get('/ai/status', protect, async (req, res) => {
  try {
    const status = aiService.getStatus();
    
    res.json({
      success: true,
      data: {
        ...status,
        lastHealthCheck: new Date().toISOString(),
        version: '1.0.0',
        model: 'Alexandra AI - National Bank Assistant'
      }
    });
  } catch (error) {
    console.error('Error checking AI status:', error);
    res.status(500).json({ success: false, message: 'Failed to check AI status' });
  }
});

// Test AI response endpoint (for development/testing)
router.post('/ai/test', protect, async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }
    
    const isFinancialQuery = await isFinancialBankingQuestion(question.trim());
    
    let response;
    if (aiService.isAvailable()) {
      try {
        response = await aiService.answerQuestion(question.trim(), {
          userRole: req.user.role,
          department: req.user.department,
          currentModule: 'AI Test Environment'
        });
      } catch (aiError) {
        response = {
          answer: 'AI service temporarily unavailable. Please try again later.',
          error: aiError.message
        };
      }
    } else {
      response = {
        answer: 'AI service is not configured. Please contact support.',
        error: 'AI service unavailable'
      };
    }
    
    await logUserAction(req.user._id, 'AI_TEST_QUERY', req.ip, req.get('User-Agent'), { 
      question: question.trim(),
      isFinancialQuery,
      hasResponse: !!response.answer
    });
    
    res.json({
      success: true,
      data: {
        question: question.trim(),
        response: response.answer,
        isFinancialQuery,
        confidence: 95,
        metadata: {
          model: 'Alexandra AI - National Bank Assistant',
          generatedAt: new Date().toISOString(),
          error: response.error
        }
      }
    });
  } catch (error) {
    console.error('Error testing AI response:', error);
    res.status(500).json({ success: false, message: 'Failed to test AI response' });
  }
});

module.exports = router;
