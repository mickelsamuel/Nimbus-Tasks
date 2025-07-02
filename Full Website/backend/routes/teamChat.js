const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { protect } = require('../middleware/auth');

// @route   GET /api/teams/:teamId/channels
// @desc    Get all channels for a team
// @access  Private
router.get('/:teamId/channels', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Check if user is member of the team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const isMember = team.members.some(member => 
      member.userId.equals(req.user.id)
    );
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this team.'
      });
    }

    // Get channels - for now we'll create default channels
    const channels = [
      {
        id: `${teamId}_general`,
        name: 'general',
        type: 'text',
        description: 'General team discussion',
        memberCount: team.members.length,
        isPrivate: false,
        lastActivity: new Date().toISOString()
      },
      {
        id: `${teamId}_announcements`,
        name: 'announcements',
        type: 'text', 
        description: 'Important team announcements',
        memberCount: team.members.length,
        isPrivate: false,
        lastActivity: new Date().toISOString()
      },
      {
        id: `${teamId}_projects`,
        name: 'projects',
        type: 'text',
        description: 'Project discussions and updates',
        memberCount: team.members.length,
        isPrivate: false,
        lastActivity: new Date().toISOString()
      },
      {
        id: `${teamId}_random`,
        name: 'random',
        type: 'text',
        description: 'Off-topic conversations',
        memberCount: team.members.length,
        isPrivate: false,
        lastActivity: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      channels
    });
  } catch (error) {
    console.error('Error fetching team channels:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/teams/:teamId/channels/:channelId/messages
// @desc    Get messages for a channel
// @access  Private
router.get('/:teamId/channels/:channelId/messages', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Check team membership
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const isMember = team.members.some(member => 
      member.userId.equals(req.user.id)
    );
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // For now, return mock messages - in a real app you'd store these in the database
    const mockMessages = [
      {
        id: '1',
        content: 'Welcome to the team chat! 🎉',
        senderId: 'system',
        senderName: 'System',
        senderAvatar: '/avatars/system.jpg',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        type: 'system'
      },
      {
        id: '2',
        content: 'Hey everyone! Excited to be working with this team.',
        senderId: req.user.id,
        senderName: `${req.user.firstName} ${req.user.lastName}`,
        senderAvatar: req.user.avatar || '/avatars/default.jpg',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        type: 'text'
      },
      {
        id: '3',
        content: 'Welcome aboard! Looking forward to collaborating.',
        senderId: 'other_user',
        senderName: 'Team Leader',
        senderAvatar: '/avatars/leader.jpg',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        type: 'text',
        reactions: [
          {
            emoji: '👍',
            count: 2,
            users: ['user1', 'user2']
          }
        ]
      }
    ];

    res.json({
      success: true,
      messages: mockMessages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/teams/:teamId/channels/:channelId/messages
// @desc    Send a message to a channel
// @access  Private
router.post('/:teamId/channels/:channelId/messages', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { content, type = 'text', replyTo } = req.body;
    
    // Validation
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Check team membership
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const isMember = team.members.some(member => 
      member.userId.equals(req.user.id)
    );
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // In a real app, you would save this message to the database
    const newMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      senderId: req.user.id,
      senderName: `${req.user.firstName} ${req.user.lastName}`,
      senderAvatar: req.user.avatar || '/avatars/default.jpg',
      timestamp: new Date().toISOString(),
      type,
      replyTo: replyTo || null,
      reactions: []
    };

    // Here you would also implement real-time broadcasting to other team members
    // using WebSockets or Server-Sent Events

    res.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/teams/:teamId/channels/:channelId/messages/:messageId/reactions
// @desc    Add reaction to a message
// @access  Private
router.post('/:teamId/channels/:channelId/messages/:messageId/reactions', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { emoji } = req.body;
    
    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: 'Emoji is required'
      });
    }

    // Check team membership
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const isMember = team.members.some(member => 
      member.userId.equals(req.user.id)
    );
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // In a real app, you would update the message reactions in the database
    res.json({
      success: true,
      message: 'Reaction added successfully'
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/teams/:teamId/channels
// @desc    Create a new channel
// @access  Private (team admin/leader only)
router.post('/:teamId/channels', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name, description, type = 'text', isPrivate = false } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Channel name is required'
      });
    }

    // Check team membership and permissions
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const member = team.members.find(member => 
      member.userId.equals(req.user.id)
    );
    
    if (!member) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if user has permission to create channels (admin/leader)
    if (member.role !== 'admin' && member.role !== 'leader') {
      return res.status(403).json({
        success: false,
        message: 'Only team admins and leaders can create channels'
      });
    }

    const newChannel = {
      id: `${teamId}_${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      name: name.trim().toLowerCase(),
      type,
      description: description?.trim() || '',
      memberCount: team.members.length,
      isPrivate,
      lastActivity: new Date().toISOString(),
      createdBy: req.user.id,
      createdAt: new Date().toISOString()
    };

    // In a real app, you would save this channel to the database
    res.json({
      success: true,
      channel: newChannel
    });
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/teams/:teamId/members
// @desc    Get team members for chat
// @access  Private
router.get('/:teamId/members', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    
    const team = await Team.findById(teamId)
      .populate('members.userId', 'firstName lastName avatar department status lastSeen');
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is member
    const isMember = team.members.some(member => 
      member.userId._id.equals(req.user.id)
    );
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const members = team.members.map(member => ({
      id: member.userId._id,
      name: `${member.userId.firstName} ${member.userId.lastName}`,
      avatar: member.userId.avatar || '/avatars/default.jpg',
      department: member.userId.department,
      role: member.role,
      status: member.userId.status || 'offline',
      lastSeen: member.userId.lastSeen,
      isOnline: member.userId.status === 'online'
    }));

    res.json({
      success: true,
      members
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;