const express = require('express');
const router = express.Router();

// GET /api/team-categories - Get all available team categories
router.get('/', async (req, res) => {
  try {
    // Team categories with their properties
    const categories = [
      {
        id: 'trading',
        name: 'Trading',
        description: 'Teams focused on trading strategies and market analysis',
        icon: 'TrendingUp',
        color: 'from-green-500 to-emerald-600'
      },
      {
        id: 'learning',
        name: 'Learning',
        description: 'Teams dedicated to continuous learning and skill development',
        icon: 'BookOpen',
        color: 'from-blue-500 to-indigo-600'
      },
      {
        id: 'innovation',
        name: 'Innovation',
        description: 'Teams working on innovative projects and new technologies',
        icon: 'Zap',
        color: 'from-purple-500 to-pink-600'
      },
      {
        id: 'research',
        name: 'Research',
        description: 'Teams conducting market research and analysis',
        icon: 'Brain',
        color: 'from-orange-500 to-red-600'
      },
      {
        id: 'networking',
        name: 'Networking',
        description: 'Teams focused on building professional relationships',
        icon: 'Users',
        color: 'from-teal-500 to-cyan-600'
      },
      {
        id: 'risk-management',
        name: 'Risk Management',
        description: 'Teams specializing in risk assessment and mitigation',
        icon: 'Shield',
        color: 'from-gray-500 to-slate-600'
      },
      {
        id: 'compliance',
        name: 'Compliance',
        description: 'Teams ensuring regulatory compliance and best practices',
        icon: 'Settings',
        color: 'from-yellow-500 to-amber-600'
      },
      {
        id: 'customer-service',
        name: 'Customer Service',
        description: 'Teams focused on customer experience and support',
        icon: 'Heart',
        color: 'from-rose-500 to-pink-600'
      }
    ];

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error fetching team categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team categories',
      error: error.message
    });
  }
});

module.exports = router;