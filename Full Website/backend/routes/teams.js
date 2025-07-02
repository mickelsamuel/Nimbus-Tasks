const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const TeamMessage = require('../models/TeamMessage');
const { protect } = require('../middleware/auth');

// @route   GET /api/teams
// @desc    Get all teams with optional filtering
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { department, category, search, sortBy, page = 1, limit = 20 } = req.query;
    
    const query = { isActive: true, isArchived: false };
    
    // Apply filters
    if (department) {
      query.department = department;
    }
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Determine sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'members':
        sortOptions = { 'stats.memberCount': -1 };
        break;
      case 'points':
        sortOptions = { 'stats.totalPoints': -1 };
        break;
      case 'activity':
        sortOptions = { lastActivity: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { 'stats.totalPoints': -1 };
    }

    const teams = await Team.find(query)
      .populate('leader', 'firstName lastName avatar')
      .populate('coLeaders', 'firstName lastName avatar')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Team.countDocuments(query);

    res.json({ 
      success: true, 
      teams,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/teams/:id
// @desc    Get team by ID with full details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'firstName lastName avatar email department')
      .populate('coLeaders', 'firstName lastName avatar email department')
      .populate('members.userId', 'firstName lastName avatar department stats')
      .populate('achievements.achievementId', 'name description tier')
      .populate('currentModules.moduleId', 'title description');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if user is a member or if team is public
    const isMember = team.members.some(member => member.userId._id.equals(req.user.id));
    const isLeader = team.leader._id.equals(req.user.id);
    const isCoLeader = team.coLeaders.some(coLeader => coLeader._id.equals(req.user.id));
    
    if (!team.settings.isPublic && !isMember && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Team is private.' });
    }

    res.json({ 
      success: true, 
      team,
      userRole: {
        isMember,
        isLeader,
        isCoLeader,
        canManage: isLeader || isCoLeader || req.user.role === 'admin'
      }
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/teams
// @desc    Create new team
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, department, category, focusAreas, settings } = req.body;

    // Validate required fields
    if (!name || !department) {
      return res.status(400).json({
        success: false,
        message: 'Team name and department are required'
      });
    }

    // Check if team name already exists
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'Team name already exists'
      });
    }

    const newTeam = new Team({
      name,
      description,
      department,
      category: category || 'Learning Group',
      leader: req.user.id,
      focusAreas: focusAreas || [],
      settings: {
        isPublic: true,
        allowJoinRequests: true,
        requireApproval: false,
        maxMembers: 50,
        ...settings
      },
      members: [{
        userId: req.user.id,
        role: 'leader',
        status: 'active',
        joinedAt: new Date()
      }],
      stats: {
        memberCount: 1,
        totalPoints: 0,
        level: 1
      }
    });

    await newTeam.save();

    // Add team to user's teams array
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        teams: {
          teamId: newTeam._id,
          role: 'leader',
          joinedAt: new Date()
        }
      }
    });

    const populatedTeam = await Team.findById(newTeam._id)
      .populate('leader', 'firstName lastName avatar')
      .populate('members.userId', 'firstName lastName avatar');

    res.status(201).json({ success: true, team: populatedTeam });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/teams/:id/join
// @desc    Join a team
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if user is already a member
    const existingMember = team.members.find(member => member.userId.equals(req.user.id));
    if (existingMember) {
      return res.status(400).json({ success: false, message: 'You are already a member of this team' });
    }

    // Check if team allows join requests
    if (!team.settings.allowJoinRequests) {
      return res.status(403).json({ success: false, message: 'This team does not allow join requests' });
    }

    // Check member limit
    if (team.stats.memberCount >= team.settings.maxMembers) {
      return res.status(400).json({ success: false, message: 'Team has reached maximum member limit' });
    }

    // Add member
    await team.addMember(req.user.id);

    // Add team to user's teams array
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        teams: {
          teamId: team._id,
          role: 'member',
          joinedAt: new Date()
        }
      }
    });

    res.json({ success: true, message: 'Successfully joined the team' });
  } catch (error) {
    console.error('Error joining team:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   POST /api/teams/:id/leave
// @desc    Leave a team
// @access  Private
router.post('/:id/leave', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if user is a member
    const memberIndex = team.members.findIndex(member => member.userId.equals(req.user.id));
    if (memberIndex === -1) {
      return res.status(400).json({ success: false, message: 'You are not a member of this team' });
    }

    // Prevent leader from leaving (they must transfer leadership first)
    if (team.leader.equals(req.user.id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Team leader cannot leave. Please transfer leadership first.' 
      });
    }

    // Remove member
    await team.removeMember(req.user.id);

    // Remove team from user's teams array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        teams: { teamId: team._id }
      }
    });

    res.json({ success: true, message: 'Successfully left the team' });
  } catch (error) {
    console.error('Error leaving team:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/teams/:id
// @desc    Update team details
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if user is leader or admin
    const isLeader = team.leader.equals(req.user.id);
    const isAdmin = req.user.role === 'admin';
    
    if (!isLeader && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only team leaders or admins can update team details' 
      });
    }

    const { name, description, category, settings } = req.body;
    
    // Update team fields
    if (name) {
      team.name = name;
    }
    if (description) {
      team.description = description;
    }
    if (category) {
      team.category = category;
    }
    if (settings) {
      team.settings = { ...team.settings, ...settings };
    }

    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('leader', 'firstName lastName avatar')
      .populate('coLeaders', 'firstName lastName avatar')
      .populate('members.userId', 'firstName lastName avatar');

    res.json({ 
      success: true, 
      team: updatedTeam,
      message: 'Team updated successfully' 
    });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/teams/:id
// @desc    Delete team
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if user is leader or admin
    const isLeader = team.leader.equals(req.user.id);
    const isAdmin = req.user.role === 'admin';
    
    if (!isLeader && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only team leaders or admins can delete teams' 
      });
    }

    // Remove team from all members' teams arrays
    const allMemberIds = [team.leader, ...team.coLeaders, ...team.members.map(m => m.userId)];
    await User.updateMany(
      { _id: { $in: allMemberIds } },
      { $pull: { teams: { teamId: team._id } } }
    );

    // Delete the team
    await Team.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true, 
      message: 'Team deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===========================================
// TEAM MESSAGING ENDPOINTS
// ===========================================

// @route   GET /api/teams/:teamId/messages
// @desc    Get messages for a team channel
// @access  Private
router.get('/:teamId/messages', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { channelId = 'general', page = 1, limit = 50 } = req.query;

    // Check if user is team member
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const isMember = team.members.some(member => 
      member.userId.equals(req.user.id)
    ) || team.leader.equals(req.user.id);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You must be a team member to view messages.'
      });
    }

    const messages = await TeamMessage.getChannelMessages(
      teamId, 
      channelId, 
      parseInt(page), 
      parseInt(limit)
    );

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          hasMore: messages.length === parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching team messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/teams/:teamId/messages
// @desc    Send a message to a team channel
// @access  Private
router.post('/:teamId/messages', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { content, channelId = 'general', messageType = 'text', mentions = [] } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Check if user is team member
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const isMember = team.members.some(member => 
      member.userId.equals(req.user.id)
    ) || team.leader.equals(req.user.id);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You must be a team member to send messages.'
      });
    }

    // Create new message
    const message = new TeamMessage({
      teamId,
      channelId,
      authorId: req.user.id,
      content: content.trim(),
      messageType,
      mentions
    });

    await message.save();

    // Populate author details
    await message.populate('authorId', 'firstName lastName avatar role department');

    // Update team's last activity
    team.lastActivity = new Date();
    await team.save();

    res.status(201).json({
      success: true,
      data: message
    });

  } catch (error) {
    console.error('Error sending team message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/teams/:teamId/messages/:messageId
// @desc    Edit a team message
// @access  Private
router.put('/:teamId/messages/:messageId', protect, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const message = await TeamMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the author
    if (!message.authorId.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own messages'
      });
    }

    await message.editMessage(content.trim(), req.user.id);
    await message.populate('authorId', 'firstName lastName avatar role department');

    res.json({
      success: true,
      data: message
    });

  } catch (error) {
    console.error('Error editing team message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/teams/:teamId/messages/:messageId
// @desc    Delete a team message
// @access  Private
router.delete('/:teamId/messages/:messageId', protect, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await TeamMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the author or team leader
    const team = await Team.findById(message.teamId);
    const canDelete = message.authorId.equals(req.user.id) || 
                     team.leader.equals(req.user.id) ||
                     team.coLeaders.includes(req.user.id);

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.deletedBy = req.user.id;
    await message.save();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting team message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/teams/:teamId/messages/:messageId/reactions
// @desc    Add reaction to a message
// @access  Private
router.post('/:teamId/messages/:messageId/reactions', protect, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: 'Emoji is required'
      });
    }

    const message = await TeamMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.addReaction(emoji, req.user.id);

    res.json({
      success: true,
      data: message.reactions
    });

  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/teams/:teamId/messages/:messageId/reactions/:emoji
// @desc    Remove reaction from a message
// @access  Private
router.delete('/:teamId/messages/:messageId/reactions/:emoji', protect, async (req, res) => {
  try {
    const { messageId, emoji } = req.params;

    const message = await TeamMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.removeReaction(emoji, req.user.id);

    res.json({
      success: true,
      data: message.reactions
    });

  } catch (error) {
    console.error('Error removing reaction:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/teams/:teamId/analytics
// @desc    Get team performance analytics
// @access  Private
router.get('/:teamId/analytics', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { period = '30d' } = req.query;

    // Check if user is team member
    const team = await Team.findById(teamId)
      .populate('members.userId', 'stats enrolledModules')
      .populate('leader', 'stats enrolledModules');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const isMember = team.members.some(member => 
      member.userId._id.equals(req.user.id)
    ) || team.leader._id.equals(req.user.id);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Calculate period dates
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;

    // Get all team members including leader
    const allMembers = [...team.members.map(m => m.userId), team.leader];

    // Calculate team performance metrics
    const teamMetrics = {
      totalMembers: allMembers.length,
      totalXP: allMembers.reduce((sum, member) => sum + (member.stats?.totalXP || member.stats?.xp || 0), 0),
      totalModulesCompleted: allMembers.reduce((sum, member) => {
        const completed = member.enrolledModules?.filter(m => m.completedAt).length || 0;
        return sum + completed;
      }, 0),
      averageLevel: allMembers.reduce((sum, member) => sum + (member.stats?.level || 1), 0) / allMembers.length,
      totalCoins: allMembers.reduce((sum, member) => sum + (member.stats?.coins || 0), 0),
      activeStreak: Math.round(allMembers.reduce((sum, member) => sum + (member.stats?.streak || 0), 0) / allMembers.length)
    };

    // Get individual member performance
    const memberPerformance = allMembers.map(member => ({
      id: member._id,
      name: `${member.firstName} ${member.lastName}`,
      avatar: member.avatar || member.avatarPortrait,
      level: member.stats?.level || 1,
      xp: member.stats?.totalXP || member.stats?.xp || 0,
      modulesCompleted: member.enrolledModules?.filter(m => m.completedAt).length || 0,
      coins: member.stats?.coins || 0,
      streak: member.stats?.streak || 0,
      role: team.leader._id.equals(member._id) ? 'leader' : 'member'
    }));

    // Sort by XP for rankings
    memberPerformance.sort((a, b) => b.xp - a.xp);
    memberPerformance.forEach((member, index) => {
      member.rank = index + 1;
    });

    // Calculate growth metrics (mock data for now, would be real in production)
    const growthMetrics = {
      xpGrowth: Math.floor(Math.random() * 20) + 5, // 5-25%
      completionGrowth: Math.floor(Math.random() * 15) + 3, // 3-18%
      activityGrowth: Math.floor(Math.random() * 10) + 2, // 2-12%
    };

    // Generate activity timeline (last 7 days)
    const activityTimeline = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().split('T')[0],
        xpEarned: Math.floor(Math.random() * 500) + 100,
        modulesCompleted: Math.floor(Math.random() * 3) + 1,
        activeMembers: Math.floor(Math.random() * allMembers.length) + 1
      };
    });

    // Team achievements (based on milestones)
    const achievements = [];
    if (teamMetrics.totalXP >= 10000) {
      achievements.push({
        id: 'xp-milestone-10k',
        title: 'XP Champions',
        description: 'Team earned 10,000+ total XP',
        icon: 'star',
        earned: true
      });
    }
    if (teamMetrics.totalModulesCompleted >= 50) {
      achievements.push({
        id: 'modules-milestone-50',
        title: 'Learning Masters',
        description: 'Team completed 50+ modules',
        icon: 'book',
        earned: true
      });
    }
    if (teamMetrics.averageLevel >= 5) {
      achievements.push({
        id: 'level-milestone-5',
        title: 'Elite Team',
        description: 'Average team level 5+',
        icon: 'trophy',
        earned: true
      });
    }

    const analytics = {
      overview: teamMetrics,
      members: memberPerformance,
      growth: growthMetrics,
      activity: activityTimeline,
      achievements,
      period: `${periodDays} days`
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching team analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/teams/:teamId/channels
// @desc    Get team channels
// @access  Private
router.get('/:teamId/channels', protect, async (req, res) => {
  try {
    const { teamId } = req.params;

    // Check if user is team member
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const isMember = team.members.some(member => 
      member.userId.equals(req.user.id)
    ) || team.leader.equals(req.user.id);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get distinct channels for this team
    const channels = await TeamMessage.distinct('channelId', { teamId });

    // Get message counts for each channel
    const channelData = await Promise.all(
      channels.map(async (channelId) => {
        const messageCount = await TeamMessage.countDocuments({ 
          teamId, 
          channelId, 
          isDeleted: false 
        });
        
        const lastMessage = await TeamMessage.findOne({ 
          teamId, 
          channelId, 
          isDeleted: false 
        })
        .sort({ createdAt: -1 })
        .populate('authorId', 'firstName lastName')
        .lean();

        return {
          id: channelId,
          name: channelId === 'general' ? 'General' : channelId.charAt(0).toUpperCase() + channelId.slice(1),
          messageCount,
          lastMessage,
          isDefault: channelId === 'general'
        };
      })
    );

    // Ensure 'general' channel always exists
    if (!channels.includes('general')) {
      channelData.unshift({
        id: 'general',
        name: 'General',
        messageCount: 0,
        lastMessage: null,
        isDefault: true
      });
    }

    res.json({
      success: true,
      data: channelData.sort((a, b) => {
        if (a.isDefault) {return -1;}
        if (b.isDefault) {return 1;}
        return a.name.localeCompare(b.name);
      })
    });

  } catch (error) {
    console.error('Error fetching team channels:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/teams/:teamId/performance
// @desc    Get team performance dashboard data
// @access  Private
router.get('/:teamId/performance', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { timeRange = 'month' } = req.query;
    
    // Check if user is team member
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
        message: 'Access denied. You must be a team member to view performance data.'
      });
    }

    // Generate performance data
    const performanceData = generateTeamPerformanceData(team, timeRange);

    res.json({
      success: true,
      performance: performanceData
    });
  } catch (error) {
    console.error('Error fetching team performance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/teams/:teamId/performance/export
// @desc    Export team performance data as CSV
// @access  Private
router.get('/:teamId/performance/export', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { timeRange = 'month' } = req.query;
    
    // Check if user is team member
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

    // Generate CSV data
    const performanceData = generateTeamPerformanceData(team, timeRange);
    const csv = convertPerformanceToCSV(performanceData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=team-performance-${team.name}-${timeRange}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting team performance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to generate team performance data
function generateTeamPerformanceData(team, timeRange) {
  const now = new Date();
  
  // Mock performance data based on team
  const basePerformance = {
    overview: {
      totalMembers: team.members.length,
      activeMembers: Math.floor(team.members.length * 0.8), // 80% active
      completionRate: Math.floor(Math.random() * 30) + 70, // 70-100%
      averageScore: Math.floor(Math.random() * 20) + 75, // 75-95%
      totalXP: Math.floor(Math.random() * 50000) + 25000, // 25k-75k
      teamRank: Math.floor(Math.random() * 20) + 1, // 1-20
      challengesCompleted: Math.floor(Math.random() * 10) + 5, // 5-15
      collaborationScore: Math.floor(Math.random() * 25) + 75 // 75-100%
    },
    trends: {
      period: timeRange,
      completionTrend: Math.floor(Math.random() * 20) - 10, // -10 to +10
      scoreTrend: Math.floor(Math.random() * 15) - 7, // -7 to +8
      engagementTrend: Math.floor(Math.random() * 25) - 12, // -12 to +13
      activeMembersTrend: Math.floor(Math.random() * 10) - 5 // -5 to +5
    },
    goals: {
      monthlyGoal: 50,
      progress: Math.floor(Math.random() * 40) + 15, // 15-55
      daysRemaining: 15,
      onTrack: Math.random() > 0.3 // 70% chance of being on track
    }
  };

  // Generate top performers
  const topPerformers = team.members.slice(0, 8).map((member, index) => ({
    id: member.userId,
    name: `Team Member ${index + 1}`,
    avatar: `/avatars/member${index + 1}.jpg`,
    role: ['Developer', 'Analyst', 'Manager', 'Specialist'][index % 4],
    department: team.department || 'General',
    stats: {
      modulesCompleted: Math.floor(Math.random() * 25) + 10,
      averageScore: Math.floor(Math.random() * 20) + 75,
      totalXP: Math.floor(Math.random() * 10000) + 5000,
      rank: index + 1,
      streakDays: Math.floor(Math.random() * 30) + 1,
      lastActive: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    performance: {
      weeklyProgress: Math.floor(Math.random() * 100),
      monthlyProgress: Math.floor(Math.random() * 100),
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
      engagementScore: Math.floor(Math.random() * 30) + 70
    }
  }));

  // Generate recent activities
  const recentActivities = Array.from({ length: 10 }, (_, index) => ({
    id: `activity_${index}`,
    type: ['module_completion', 'achievement', 'collaboration', 'milestone'][Math.floor(Math.random() * 4)],
    member: `Team Member ${Math.floor(Math.random() * team.members.length) + 1}`,
    description: [
      'completed "Customer Service Excellence" module',
      'earned the "Speed Learner" achievement',
      'collaborated on team project',
      'reached learning milestone'
    ][Math.floor(Math.random() * 4)],
    timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    points: Math.floor(Math.random() * 500) + 100
  }));

  // Generate skills breakdown
  const skillBreakdown = [
    'Customer Service',
    'Risk Management', 
    'Compliance',
    'Technology',
    'Leadership'
  ].map(skill => ({
    skill,
    averageScore: Math.floor(Math.random() * 30) + 65,
    completed: Math.floor(Math.random() * 15) + 5,
    inProgress: Math.floor(Math.random() * 8) + 2,
    notStarted: Math.floor(Math.random() * 5) + 1
  }));

  // Generate weekly data
  const weeklyData = Array.from({ length: 8 }, (_, index) => {
    return {
      week: `Week ${index + 1}`,
      modulesCompleted: Math.floor(Math.random() * 20) + 5,
      averageScore: Math.floor(Math.random() * 20) + 75,
      activeMembers: Math.floor(Math.random() * 5) + Math.floor(team.members.length * 0.6),
      xpEarned: Math.floor(Math.random() * 3000) + 1000
    };
  });

  return {
    ...basePerformance,
    topPerformers,
    recentActivities,
    skillBreakdown,
    weeklyData
  };
}

// Helper function to convert performance data to CSV
function convertPerformanceToCSV(data) {
  const headers = [
    'Metric', 'Value', 'Trend', 'Period'
  ];

  const rows = [
    ['Total Members', data.overview.totalMembers, '', data.trends.period],
    ['Active Members', data.overview.activeMembers, data.trends.activeMembersTrend + '%', data.trends.period],
    ['Completion Rate', data.overview.completionRate + '%', data.trends.completionTrend + '%', data.trends.period],
    ['Average Score', data.overview.averageScore + '%', data.trends.scoreTrend + '%', data.trends.period],
    ['Total XP', data.overview.totalXP, '', data.trends.period],
    ['Team Rank', '#' + data.overview.teamRank, '', data.trends.period],
    ['Challenges Completed', data.overview.challengesCompleted, '', data.trends.period],
    ['Collaboration Score', data.overview.collaborationScore + '%', '', data.trends.period]
  ];

  // Add top performers
  rows.push(['', '', '', '']); // Empty row
  rows.push(['Top Performers', '', '', '']);
  rows.push(['Name', 'Modules Completed', 'Average Score', 'Total XP']);
  
  data.topPerformers.forEach(performer => {
    rows.push([
      performer.name,
      performer.stats.modulesCompleted,
      performer.stats.averageScore + '%',
      performer.stats.totalXP
    ]);
  });

  return [headers, ...rows].map(row => 
    row.map(field => `"${field}"`).join(',')
  ).join('\n');
}

// @route   GET /api/teams/:teamId/projects
// @desc    Get team projects
// @access  Private
router.get('/:teamId/projects', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Check if user is team member
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

    // Generate mock projects
    const projects = generateMockProjects(team);

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Error fetching team projects:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/teams/:teamId/tasks
// @desc    Get team tasks
// @access  Private
router.get('/:teamId/tasks', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { project } = req.query;
    
    // Check if user is team member
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

    // Generate mock tasks
    const tasks = generateMockTasks(team, project);

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Error fetching team tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/teams/:teamId/tasks
// @desc    Create a new task
// @access  Private
router.post('/:teamId/tasks', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    const {
      title,
      description,
      priority,
      assignee,
      dueDate,
      estimatedHours,
      labels,
      subtasks,
      projectId
    } = req.body;
    
    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    // Check if user is team member
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

    // Create task (mock implementation)
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description?.trim() || '',
      status: 'todo',
      priority: priority || 'medium',
      assignee: {
        id: assignee || req.user.id,
        name: 'Team Member',
        avatar: '/avatars/default.jpg'
      },
      reporter: {
        id: req.user.id,
        name: `${req.user.firstName} ${req.user.lastName}`,
        avatar: req.user.avatar || '/avatars/default.jpg'
      },
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      labels: labels || [],
      attachments: 0,
      comments: 0,
      subtasks: {
        completed: 0,
        total: subtasks?.length || 0
      },
      estimatedHours: estimatedHours || 0,
      timeSpent: 0,
      project: projectId || 'default'
    };

    res.json({
      success: true,
      task: newTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/teams/:teamId/tasks/:taskId
// @desc    Update a task
// @access  Private
router.patch('/:teamId/tasks/:taskId', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Check if user is team member
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

    // Mock task update
    res.json({
      success: true,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to generate mock projects
function generateMockProjects(team) {
  return [
    {
      id: 'proj_1',
      name: 'Customer Onboarding Redesign',
      description: 'Redesign the customer onboarding flow to improve user experience',
      status: 'active',
      progress: 65,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      teamMembers: team.members.slice(0, 5).map((member, index) => ({
        id: member.userId,
        name: `Team Member ${index + 1}`,
        avatar: `/avatars/member${index + 1}.jpg`,
        role: ['Lead', 'Developer', 'Designer', 'Analyst', 'Tester'][index % 5]
      })),
      tasks: {
        todo: 8,
        inProgress: 5,
        review: 3,
        done: 12
      }
    },
    {
      id: 'proj_2',
      name: 'Mobile Banking Features',
      description: 'Implement new features for the mobile banking application',
      status: 'active',
      progress: 40,
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      teamMembers: team.members.slice(0, 4).map((member, index) => ({
        id: member.userId,
        name: `Team Member ${index + 1}`,
        avatar: `/avatars/member${index + 1}.jpg`,
        role: ['Lead', 'Developer', 'Designer', 'QA'][index % 4]
      })),
      tasks: {
        todo: 15,
        inProgress: 8,
        review: 2,
        done: 6
      }
    },
    {
      id: 'proj_3',
      name: 'Security Audit & Compliance',
      description: 'Complete security audit and ensure regulatory compliance',
      status: 'active',
      progress: 80,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      teamMembers: team.members.slice(0, 3).map((member, index) => ({
        id: member.userId,
        name: `Team Member ${index + 1}`,
        avatar: `/avatars/member${index + 1}.jpg`,
        role: ['Security Lead', 'Compliance Officer', 'Auditor'][index % 3]
      })),
      tasks: {
        todo: 2,
        inProgress: 3,
        review: 4,
        done: 16
      }
    }
  ];
}

// Helper function to generate mock tasks
function generateMockTasks(team, projectId) {
  const taskTemplates = [
    {
      title: 'Design user interface mockups',
      description: 'Create wireframes and mockups for the new user interface',
      priority: 'high',
      labels: ['design', 'ui/ux'],
      estimatedHours: 16
    },
    {
      title: 'Implement authentication system',
      description: 'Set up secure authentication with JWT tokens',
      priority: 'urgent',
      labels: ['backend', 'security'],
      estimatedHours: 24
    },
    {
      title: 'Write unit tests',
      description: 'Add comprehensive unit tests for core functionality',
      priority: 'medium',
      labels: ['testing', 'quality'],
      estimatedHours: 12
    },
    {
      title: 'Update documentation',
      description: 'Update API documentation and user guides',
      priority: 'low',
      labels: ['documentation'],
      estimatedHours: 8
    },
    {
      title: 'Performance optimization',
      description: 'Optimize database queries and improve page load times',
      priority: 'medium',
      labels: ['performance', 'backend'],
      estimatedHours: 20
    },
    {
      title: 'Mobile responsive design',
      description: 'Ensure all pages work well on mobile devices',
      priority: 'high',
      labels: ['frontend', 'mobile'],
      estimatedHours: 14
    }
  ];

  const statuses = ['todo', 'in-progress', 'review', 'done'];
  
  return Array.from({ length: 20 }, (_, index) => {
    const template = taskTemplates[index % taskTemplates.length];
    const assignee = team.members[index % team.members.length];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: `task_${index + 1}`,
      title: `${template.title} #${index + 1}`,
      description: template.description,
      status,
      priority: template.priority,
      assignee: {
        id: assignee.userId,
        name: `Team Member ${(index % team.members.length) + 1}`,
        avatar: `/avatars/member${(index % team.members.length) + 1}.jpg`
      },
      reporter: {
        id: team.members[0].userId,
        name: 'Project Manager',
        avatar: '/avatars/pm.jpg'
      },
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      labels: template.labels,
      attachments: Math.floor(Math.random() * 3),
      comments: Math.floor(Math.random() * 8),
      subtasks: {
        completed: Math.floor(Math.random() * 5),
        total: Math.floor(Math.random() * 5) + 2
      },
      estimatedHours: template.estimatedHours,
      timeSpent: Math.floor(Math.random() * template.estimatedHours),
      project: projectId || 'proj_1'
    };
  });
}

// @route   GET /api/teams/:teamId/meetings
// @desc    Get team meetings
// @access  Private
router.get('/:teamId/meetings', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Check if user is team member
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const isMember = team.members.some(member => 
      member.userId.equals(req.user.id)
    ) || team.leader.equals(req.user.id);
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Generate mock meetings for the team
    const meetings = generateMockMeetings(team);

    res.json({
      success: true,
      meetings
    });
  } catch (error) {
    console.error('Error fetching team meetings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/teams/:teamId/meetings
// @desc    Create team meeting
// @access  Private
router.post('/:teamId/meetings', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { title, description, type, startTime, endTime, attendees } = req.body;
    
    // Validation
    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Title, start time, and end time are required'
      });
    }

    // Check if user is team member
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const isMember = team.members.some(member => 
      member.userId.equals(req.user.id)
    ) || team.leader.equals(req.user.id);
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create meeting (mock implementation)
    const newMeeting = {
      id: Date.now(),
      title: title.trim(),
      description: description?.trim() || '',
      type: type || 'team-meeting',
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      teamId,
      organizer: req.user.id,
      organizerName: `${req.user.firstName} ${req.user.lastName}`,
      attendees: attendees || [],
      status: 'scheduled',
      isRecurring: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      success: true,
      meeting: newMeeting
    });
  } catch (error) {
    console.error('Error creating team meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/teams/:teamId/discussions
// @desc    Get team discussions
// @access  Private
router.get('/:teamId/discussions', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Check if user is team member
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const isMember = team.members.some(member => 
      member.userId.equals(req.user.id)
    ) || team.leader.equals(req.user.id);
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Generate mock discussions for the team
    const discussions = generateMockDiscussions(team);

    res.json({
      success: true,
      discussions
    });
  } catch (error) {
    console.error('Error fetching team discussions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/teams/:teamId/discussions
// @desc    Create team discussion
// @access  Private
router.post('/:teamId/discussions', protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { title, category, message } = req.body;
    
    // Validation
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    // Check if user is team member
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const isMember = team.members.some(member => 
      member.userId.equals(req.user.id)
    ) || team.leader.equals(req.user.id);
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create discussion (mock implementation)
    const newDiscussion = {
      id: Date.now(),
      title: title.trim(),
      category: category || 'general',
      message: message.trim(),
      teamId,
      authorId: req.user.id,
      authorName: `${req.user.firstName} ${req.user.lastName}`,
      replies: 0,
      replyCount: 0,
      isResolved: false,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReply: new Date()
    };

    res.json({
      success: true,
      discussion: newDiscussion
    });
  } catch (error) {
    console.error('Error creating team discussion:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to generate mock meetings
function generateMockMeetings(team) {
  const meetingTypes = ['team-standup', 'project-planning', 'code-review', 'sprint-retrospective', 'team-meeting'];
  const now = new Date();
  
  return Array.from({ length: 8 }, (_, index) => {
    const startTime = new Date(now.getTime() + (index - 2) * 24 * 60 * 60 * 1000 + Math.random() * 8 * 60 * 60 * 1000);
    const duration = [30, 60, 90, 120][Math.floor(Math.random() * 4)];
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    const type = meetingTypes[index % meetingTypes.length];
    
    return {
      id: index + 1,
      title: `${type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Meeting`,
      description: `${team.name} ${type.replace('-', ' ')} meeting`,
      type,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      teamId: team._id,
      organizer: team.leader,
      organizerName: 'Team Leader',
      attendees: team.members.slice(0, Math.min(5, team.members.length)).map((member, idx) => ({
        userId: member.userId,
        name: `Team Member ${idx + 1}`,
        status: 'accepted'
      })),
      status: startTime > now ? 'scheduled' : 'completed',
      isRecurring: Math.random() > 0.7,
      roomId: `room_${index + 1}`,
      createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

// Helper function to generate mock discussions
function generateMockDiscussions(team) {
  const categories = ['general', 'project', 'help', 'announcement'];
  const titles = [
    'Welcome to the team discussion board!',
    'Project kickoff planning session',
    'Need help with authentication implementation',
    'New feature release announcement',
    'Team building event ideas',
    'Code review best practices',
    'Performance optimization strategies',
    'Weekly standup schedule update',
    'Documentation standards discussion',
    'Sprint retrospective insights'
  ];
  
  const now = new Date();
  
  return Array.from({ length: 10 }, (_, index) => {
    const createdAt = new Date(now.getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000);
    const lastReply = new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
    const category = categories[index % categories.length];
    const replies = Math.floor(Math.random() * 15);
    
    return {
      id: index + 1,
      title: titles[index % titles.length],
      category,
      teamId: team._id,
      authorId: team.members[index % team.members.length]?.userId || team.leader,
      authorName: `Team Member ${(index % team.members.length) + 1}`,
      author: {
        name: `Team Member ${(index % team.members.length) + 1}`,
        avatar: `/avatars/member${(index % team.members.length) + 1}.jpg`
      },
      replies,
      replyCount: replies,
      isResolved: category === 'help' ? Math.random() > 0.6 : false,
      isPinned: category === 'announcement' ? Math.random() > 0.5 : false,
      createdAt: createdAt.toISOString(),
      updatedAt: lastReply.toISOString(),
      lastReply: lastReply.toISOString(),
      tags: category === 'project' ? ['planning', 'development'] : 
            category === 'help' ? ['question', 'support'] :
            category === 'announcement' ? ['news', 'update'] : ['chat', 'social']
    };
  }).sort((a, b) => new Date(b.lastReply).getTime() - new Date(a.lastReply).getTime());
}

module.exports = router;