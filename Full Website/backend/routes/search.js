const express = require('express');
const { query, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Module = require('../models/Module');
const Team = require('../models/Team');
const Event = require('../models/Event');
const Achievement = require('../models/Achievement');
const { logUserAction } = require('../utils/auditLogger');
const router = express.Router();

// @route   GET /api/search
// @desc    Global search across all content types
// @access  Private
router.get('/', protect, [
  query('q').isLength({ min: 1, max: 100 }).withMessage('Search query must be between 1 and 100 characters'),
  query('type').optional().isIn(['all', 'modules', 'teams', 'events', 'users', 'achievements']),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
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

    const { q: searchQuery, type = 'all', limit = 20, skip = 0 } = req.query;
    const searchRegex = new RegExp(searchQuery, 'i'); // Case-insensitive search

    const results = {
      query: searchQuery,
      type,
      total: 0,
      results: {
        modules: [],
        teams: [],
        events: [],
        users: [],
        achievements: []
      },
      pagination: {
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: false
      }
    };

    // Search in different collections based on type
    const searchPromises = [];

    if (type === 'all' || type === 'modules') {
      searchPromises.push(
        Module.find({
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { tags: { $in: [searchRegex] } },
            { 'content.sections.title': searchRegex }
          ],
          isActive: true
        })
        .select('title description difficulty estimatedTime points category tags thumbnail')
        .limit(type === 'modules' ? limit : 10)
        .skip(type === 'modules' ? skip : 0)
        .then(modules => {
          results.results.modules = modules.map(module => ({
            type: 'module',
            id: module._id,
            title: module.title,
            description: module.description,
            difficulty: module.difficulty,
            estimatedTime: module.estimatedTime,
            points: module.points,
            category: module.category,
            thumbnail: module.thumbnail,
            url: `/modules/${module._id}`
          }));
        })
      );
    }

    if (type === 'all' || type === 'teams') {
      searchPromises.push(
        Team.find({
          $or: [
            { name: searchRegex },
            { description: searchRegex },
            { department: searchRegex }
          ],
          isActive: true
        })
        .populate('leader', 'firstName lastName')
        .select('name description department memberCount isPublic leader')
        .limit(type === 'teams' ? limit : 10)
        .skip(type === 'teams' ? skip : 0)
        .then(teams => {
          results.results.teams = teams.map(team => ({
            type: 'team',
            id: team._id,
            name: team.name,
            description: team.description,
            department: team.department,
            memberCount: team.memberCount,
            isPublic: team.isPublic,
            leader: team.leader ? {
              name: `${team.leader.firstName} ${team.leader.lastName}`
            } : null,
            url: `/teams/${team._id}`
          }));
        })
      );
    }

    if (type === 'all' || type === 'events') {
      searchPromises.push(
        Event.find({
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { category: searchRegex },
            { location: searchRegex }
          ],
          isActive: true,
          startDate: { $gte: new Date() } // Only future events
        })
        .select('title description category location startDate endDate attendeeCount maxAttendees')
        .limit(type === 'events' ? limit : 10)
        .skip(type === 'events' ? skip : 0)
        .then(events => {
          results.results.events = events.map(event => ({
            type: 'event',
            id: event._id,
            title: event.title,
            description: event.description,
            category: event.category,
            location: event.location,
            startDate: event.startDate,
            endDate: event.endDate,
            attendeeCount: event.attendeeCount,
            maxAttendees: event.maxAttendees,
            url: `/events/${event._id}`
          }));
        })
      );
    }

    if (type === 'all' || type === 'users') {
      // Only search public profiles or colleagues in same department
      const userSearchCriteria = {
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { department: searchRegex },
          { jobTitle: searchRegex }
        ],
        isActive: true,
        $or: [
          { 'preferences.privacy.profileVisibility': 'public' },
          { 
            'preferences.privacy.profileVisibility': 'friends',
            department: req.user.department // Same department
          }
        ]
      };

      searchPromises.push(
        User.find(userSearchCriteria)
        .select('firstName lastName avatar department jobTitle stats.level')
        .limit(type === 'users' ? limit : 10)
        .skip(type === 'users' ? skip : 0)
        .then(users => {
          results.results.users = users.map(user => ({
            type: 'user',
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            avatar: user.avatar,
            department: user.department,
            jobTitle: user.jobTitle,
            level: user.stats?.level || 1,
            url: `/profile/${user._id}`
          }));
        })
      );
    }

    if (type === 'all' || type === 'achievements') {
      searchPromises.push(
        Achievement.find({
          $or: [
            { name: searchRegex },
            { description: searchRegex },
            { category: searchRegex }
          ],
          isActive: true
        })
        .select('name description category tier icon rewards requirements')
        .limit(type === 'achievements' ? limit : 10)
        .skip(type === 'achievements' ? skip : 0)
        .then(achievements => {
          results.results.achievements = achievements.map(achievement => ({
            type: 'achievement',
            id: achievement._id,
            name: achievement.name,
            description: achievement.description,
            category: achievement.category,
            tier: achievement.tier,
            icon: achievement.icon,
            rewards: achievement.rewards,
            url: `/achievements/${achievement._id}`
          }));
        })
      );
    }

    // Execute all search promises
    await Promise.all(searchPromises);

    // Calculate total results
    results.total = 
      results.results.modules.length +
      results.results.teams.length +
      results.results.events.length +
      results.results.users.length +
      results.results.achievements.length;

    // Determine if there are more results
    if (type !== 'all') {
      // For specific type searches, check if we hit the limit
      results.pagination.hasMore = results.total === limit;
    }

    // Log the search
    await logUserAction(
      req.user._id,
      'SEARCH_PERFORMED',
      req.ip,
      req.get('User-Agent'),
      {
        searchQuery,
        type,
        resultsCount: results.total,
        modules: results.results.modules.length,
        teams: results.results.teams.length,
        events: results.results.events.length,
        users: results.results.users.length,
        achievements: results.results.achievements.length
      }
    );

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error performing search'
    });
  }
});

// @route   GET /api/search/suggestions
// @desc    Get search suggestions/autocomplete
// @access  Private
router.get('/suggestions', protect, [
  query('q').isLength({ min: 1, max: 50 }).withMessage('Query must be between 1 and 50 characters'),
  query('limit').optional().isInt({ min: 1, max: 20 }).toInt()
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

    const { q: searchQuery, limit = 10 } = req.query;
    const searchRegex = new RegExp(`^${searchQuery}`, 'i'); // Starts with query

    const suggestions = new Set(); // Use Set to avoid duplicates

    // Get suggestions from different sources
    const suggestionPromises = [
      // Module titles and categories
      Module.find({ 
        $or: [
          { title: searchRegex },
          { category: searchRegex }
        ],
        isActive: true 
      })
      .select('title category')
      .limit(5)
      .then(modules => {
        modules.forEach(module => {
          if (module.title.toLowerCase().startsWith(searchQuery.toLowerCase())) {
            suggestions.add(module.title);
          }
          if (module.category.toLowerCase().startsWith(searchQuery.toLowerCase())) {
            suggestions.add(module.category);
          }
        });
      }),

      // Team names and departments
      Team.find({
        $or: [
          { name: searchRegex },
          { department: searchRegex }
        ],
        isActive: true
      })
      .select('name department')
      .limit(5)
      .then(teams => {
        teams.forEach(team => {
          if (team.name.toLowerCase().startsWith(searchQuery.toLowerCase())) {
            suggestions.add(team.name);
          }
          if (team.department.toLowerCase().startsWith(searchQuery.toLowerCase())) {
            suggestions.add(team.department);
          }
        });
      }),

      // Event titles and categories
      Event.find({
        $or: [
          { title: searchRegex },
          { category: searchRegex }
        ],
        isActive: true,
        startDate: { $gte: new Date() }
      })
      .select('title category')
      .limit(5)
      .then(events => {
        events.forEach(event => {
          if (event.title.toLowerCase().startsWith(searchQuery.toLowerCase())) {
            suggestions.add(event.title);
          }
          if (event.category.toLowerCase().startsWith(searchQuery.toLowerCase())) {
            suggestions.add(event.category);
          }
        });
      }),

      // Achievement names
      Achievement.find({
        name: searchRegex,
        isActive: true
      })
      .select('name')
      .limit(5)
      .then(achievements => {
        achievements.forEach(achievement => {
          if (achievement.name.toLowerCase().startsWith(searchQuery.toLowerCase())) {
            suggestions.add(achievement.name);
          }
        });
      })
    ];

    await Promise.all(suggestionPromises);

    // Convert Set to Array and limit results
    const suggestionArray = Array.from(suggestions).slice(0, limit);

    res.json({
      success: true,
      data: {
        query: searchQuery,
        suggestions: suggestionArray
      }
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting search suggestions'
    });
  }
});

// @route   GET /api/search/trending
// @desc    Get trending search terms
// @access  Private
router.get('/trending', protect, [
  query('limit').optional().isInt({ min: 1, max: 20 }).toInt()
], async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get trending searches from audit logs (last 7 days)
    const { AuditLog } = require('../models/AuditLog');
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const trendingSearches = await AuditLog.aggregate([
      {
        $match: {
          action: 'SEARCH_PERFORMED',
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: '$details.searchQuery',
          count: { $sum: 1 },
          lastSearched: { $max: '$timestamp' }
        }
      },
      {
        $match: {
          _id: { $ne: null, $ne: '' },
          count: { $gte: 2 } // At least 2 searches
        }
      },
      {
        $sort: { count: -1, lastSearched: -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          query: '$_id',
          count: 1,
          lastSearched: 1,
          _id: 0
        }
      }
    ]);

    // Fallback trending terms if no search data
    const fallbackTrending = [
      { query: 'Banking Fundamentals', count: 45, lastSearched: new Date() },
      { query: 'Risk Management', count: 38, lastSearched: new Date() },
      { query: 'Customer Service', count: 32, lastSearched: new Date() },
      { query: 'Cybersecurity', count: 28, lastSearched: new Date() },
      { query: 'Digital Banking', count: 25, lastSearched: new Date() },
      { query: 'Compliance Training', count: 22, lastSearched: new Date() },
      { query: 'Investment Banking', count: 20, lastSearched: new Date() },
      { query: 'Team Collaboration', count: 18, lastSearched: new Date() }
    ];

    const trending = trendingSearches.length > 0 ? trendingSearches : fallbackTrending.slice(0, limit);

    res.json({
      success: true,
      data: {
        trending,
        timeframe: '7 days',
        generated: new Date()
      }
    });

  } catch (error) {
    console.error('Trending searches error:', error);
    
    // Return fallback data on error
    res.json({
      success: true,
      data: {
        trending: [
          { query: 'Banking Fundamentals', count: 45, lastSearched: new Date() },
          { query: 'Risk Management', count: 38, lastSearched: new Date() },
          { query: 'Customer Service', count: 32, lastSearched: new Date() },
          { query: 'Cybersecurity', count: 28, lastSearched: new Date() },
          { query: 'Digital Banking', count: 25, lastSearched: new Date() }
        ].slice(0, req.query.limit || 10),
        timeframe: '7 days',
        generated: new Date(),
        fallback: true
      }
    });
  }
});

// @route   GET /api/search/filters
// @desc    Get available search filters
// @access  Private
router.get('/filters', protect, async (req, res) => {
  try {
    // Get distinct values for filters
    const [moduleCategories, moduleDifficulties, teamDepartments, eventCategories, achievementTiers] = await Promise.all([
      Module.distinct('category', { isActive: true }),
      Module.distinct('difficulty', { isActive: true }),
      Team.distinct('department', { isActive: true }),
      Event.distinct('category', { isActive: true }),
      Achievement.distinct('tier', { isActive: true })
    ]);

    const filters = {
      modules: {
        categories: moduleCategories.sort(),
        difficulties: moduleDifficulties.sort()
      },
      teams: {
        departments: teamDepartments.sort()
      },
      events: {
        categories: eventCategories.sort()
      },
      achievements: {
        tiers: achievementTiers.sort()
      },
      general: {
        types: ['modules', 'teams', 'events', 'users', 'achievements'],
        sortOptions: [
          { value: 'relevance', label: 'Relevance' },
          { value: 'newest', label: 'Newest First' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'alphabetical', label: 'Alphabetical' }
        ]
      }
    };

    res.json({
      success: true,
      data: filters
    });

  } catch (error) {
    console.error('Get search filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving search filters'
    });
  }
});

// @route   POST /api/search/track-click
// @desc    Track search result clicks for analytics
// @access  Private
router.post('/track-click', protect, [
  query('query').isLength({ min: 1 }),
  query('resultType').isIn(['module', 'team', 'event', 'user', 'achievement']),
  query('resultId').isMongoId(),
  query('position').optional().isInt({ min: 1 })
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

    const { query: searchQuery, resultType, resultId, position } = req.body;

    // Log the click for analytics
    await logUserAction(
      req.user._id,
      'SEARCH_RESULT_CLICKED',
      req.ip,
      req.get('User-Agent'),
      {
        searchQuery,
        resultType,
        resultId,
        position: position || null
      }
    );

    res.json({
      success: true,
      message: 'Click tracked successfully'
    });

  } catch (error) {
    console.error('Track search click error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error tracking click'
    });
  }
});

module.exports = router;