const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { logUserAction } = require('../utils/auditLogger');
const SupportChat = require('../models/SupportChat');
const User = require('../models/User');

const router = express.Router();

// Initialize new chat session
router.post('/chat/start', protect, async (req, res) => {
  try {
    const { priority = 'medium', category = 'general', userInfo } = req.body;
    
    // Check if user has an active chat session
    const existingChat = await SupportChat.findOne({
      userId: req.user._id,
      status: { $in: ['waiting', 'active'] }
    });
    
    if (existingChat) {
      return res.json({ 
        success: true, 
        data: existingChat,
        message: 'Existing chat session found'
      });
    }
    
    const chat = new SupportChat({
      userId: req.user._id,
      priority,
      category,
      userInfo: {
        browserInfo: req.get('User-Agent'),
        ipAddress: req.ip,
        currentPage: userInfo?.currentPage || '/help'
      }
    });
    
    await chat.save();
    await chat.populate('userId', 'firstName lastName email');
    
    // Add initial system message
    chat.messages.push({
      senderId: req.user._id,
      message: 'Chat session started. Connecting you with a support agent...',
      messageType: 'system',
      isFromAgent: false
    });
    
    await chat.save();
    
    // Notify support team about new chat
    if (global.io) {
      global.io.to('support-team').emit('new-chat-request', {
        sessionId: chat.sessionId,
        userId: req.user._id,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        priority,
        category,
        startedAt: chat.startedAt
      });
    }
    
    await logUserAction(req.user._id, 'SUPPORT_CHAT_STARTED', req.ip, req.get('User-Agent'), { 
      sessionId: chat.sessionId,
      priority,
      category
    });
    
    res.status(201).json({ 
      success: true, 
      data: chat,
      message: 'Chat session started'
    });
  } catch (error) {
    console.error('Error starting chat:', error);
    res.status(500).json({ success: false, message: 'Failed to start chat session' });
  }
});

// Get user's chat sessions
router.get('/chat/sessions', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { userId: req.user._id };
    if (status) {filter.status = status;}
    
    const chats = await SupportChat.find(filter)
      .populate('supportAgentId', 'firstName lastName')
      .sort({ startedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await SupportChat.countDocuments(filter);
    
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
router.get('/chat/:sessionId', protect, async (req, res) => {
  try {
    const chat = await SupportChat.findOne({ sessionId: req.params.sessionId })
      .populate('userId', 'firstName lastName email')
      .populate('supportAgentId', 'firstName lastName email')
      .populate('messages.senderId', 'firstName lastName email role');
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }
    
    // Check if user owns this chat or is support agent
    if (chat.userId._id.toString() !== req.user._id.toString() && 
        chat.supportAgentId?._id.toString() !== req.user._id.toString() &&
        !['admin', 'support'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Mark messages as read
    chat.messages.forEach(message => {
      const readByUser = message.readBy.find(
        read => read.userId.toString() === req.user._id.toString()
      );
      if (!readByUser) {
        message.readBy.push({ userId: req.user._id });
      }
    });
    
    await chat.save();
    
    res.json({ success: true, data: chat });
  } catch (error) {
    console.error('Error fetching chat session:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chat session' });
  }
});

// Send message in chat
router.post('/chat/:sessionId/message', protect, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }
    
    const chat = await SupportChat.findOne({ sessionId: req.params.sessionId });
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }
    
    // Check permissions
    if (chat.userId.toString() !== req.user._id.toString() && 
        chat.supportAgentId?.toString() !== req.user._id.toString() &&
        !['admin', 'support'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const newMessage = {
      senderId: req.user._id,
      message: message.trim(),
      isFromAgent: ['admin', 'support'].includes(req.user.role),
      readBy: [{ userId: req.user._id }]
    };
    
    chat.messages.push(newMessage);
    
    // Assign agent if not assigned and this is from support
    if (!chat.supportAgentId && newMessage.isFromAgent) {
      chat.supportAgentId = req.user._id;
      chat.status = 'active';
    }
    
    await chat.save();
    await chat.populate('messages.senderId', 'firstName lastName email role');
    
    // Get the just added message
    const addedMessage = chat.messages[chat.messages.length - 1];
    
    // Emit message to chat room
    if (global.io) {
      const roomId = `chat-${chat.sessionId}`;
      global.io.to(roomId).emit('new-message', {
        sessionId: chat.sessionId,
        message: addedMessage,
        sender: {
          _id: req.user._id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          role: req.user.role
        }
      });
    }
    
    await logUserAction(req.user._id, 'SUPPORT_CHAT_MESSAGE_SENT', req.ip, req.get('User-Agent'), { 
      sessionId: chat.sessionId,
      isFromAgent: newMessage.isFromAgent
    });
    
    res.json({ 
      success: true, 
      data: addedMessage,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// End chat session
router.post('/chat/:sessionId/end', protect, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    
    const chat = await SupportChat.findOne({ sessionId: req.params.sessionId });
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }
    
    // Check permissions
    if (chat.userId.toString() !== req.user._id.toString() && 
        !['admin', 'support'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    chat.status = 'resolved';
    chat.endedAt = new Date();
    
    if (rating) {
      chat.rating = {
        score: rating,
        feedback: feedback || '',
        ratedAt: new Date()
      };
    }
    
    // Add system message
    chat.messages.push({
      senderId: req.user._id,
      message: 'Chat session ended.',
      messageType: 'system',
      isFromAgent: ['admin', 'support'].includes(req.user.role)
    });
    
    await chat.save();
    
    // Notify other participants
    if (global.io) {
      const roomId = `chat-${chat.sessionId}`;
      global.io.to(roomId).emit('chat-ended', {
        sessionId: chat.sessionId,
        endedBy: req.user._id,
        rating: chat.rating
      });
    }
    
    await logUserAction(req.user._id, 'SUPPORT_CHAT_ENDED', req.ip, req.get('User-Agent'), { 
      sessionId: chat.sessionId,
      rating: rating || null
    });
    
    res.json({ 
      success: true, 
      data: chat,
      message: 'Chat session ended'
    });
  } catch (error) {
    console.error('Error ending chat:', error);
    res.status(500).json({ success: false, message: 'Failed to end chat session' });
  }
});

// Get available support agents (for admin/support)
router.get('/agents/available', protect, authorize('admin', 'support'), async (req, res) => {
  try {
    const agents = await User.find({ 
      role: { $in: ['admin', 'support'] },
      isActive: true 
    }).select('firstName lastName email role lastActive');
    
    // Get agent workload
    const agentWorkload = await SupportChat.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$supportAgentId', activeChats: { $sum: 1 } } }
    ]);
    
    const workloadMap = {};
    agentWorkload.forEach(item => {
      if (item._id) {
        workloadMap[item._id.toString()] = item.activeChats;
      }
    });
    
    const result = agents.map(agent => ({
      ...agent.toObject(),
      activeChats: workloadMap[agent._id.toString()] || 0
    }));
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching available agents:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch available agents' });
  }
});

// Assign agent to chat (admin/support only)
router.post('/chat/:sessionId/assign', protect, authorize('admin', 'support'), async (req, res) => {
  try {
    const { agentId } = req.body;
    
    const chat = await SupportChat.findOne({ sessionId: req.params.sessionId });
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }
    
    const agent = await User.findById(agentId);
    if (!agent || !['admin', 'support'].includes(agent.role)) {
      return res.status(400).json({ success: false, message: 'Invalid agent' });
    }
    
    chat.supportAgentId = agentId;
    chat.status = 'active';
    
    // Add system message
    chat.messages.push({
      senderId: agentId,
      message: `${agent.firstName} ${agent.lastName} has joined the chat.`,
      messageType: 'system',
      isFromAgent: true
    });
    
    await chat.save();
    
    // Notify participants
    if (global.io) {
      const roomId = `chat-${chat.sessionId}`;
      global.io.to(roomId).emit('agent-assigned', {
        sessionId: chat.sessionId,
        agent: {
          _id: agent._id,
          firstName: agent.firstName,
          lastName: agent.lastName
        }
      });
    }
    
    await logUserAction(req.user._id, 'SUPPORT_CHAT_AGENT_ASSIGNED', req.ip, req.get('User-Agent'), { 
      sessionId: chat.sessionId,
      agentId
    });
    
    res.json({ 
      success: true, 
      data: chat,
      message: 'Agent assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning agent:', error);
    res.status(500).json({ success: false, message: 'Failed to assign agent' });
  }
});

module.exports = router;