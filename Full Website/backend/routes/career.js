const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Mock career data
const executiveProfile = {
  name: "Alexandra Thompson",
  title: "Senior Portfolio Manager",
  department: "Investment Banking",
  employeeId: "NBF2089",
  startDate: "2019-03-15",
  level: "Level 8 - Senior Professional",
  yearsOfService: 5.2,
  profileImage: "/api/placeholder/120/120",
  reportingManager: "David Chen - VP Investment Banking",
  directReports: 3,
  currentLocation: "Toronto, ON",
  workStyle: "Hybrid",
  nextReview: "2024-06-15"
};

const performanceMetrics = {
  overallRating: 4.2,
  promotionReadiness: 87,
  leadershipScore: 92,
  innovationIndex: 78,
  collaborationRating: 94,
  clientSatisfaction: 96,
  goalCompletion: 88,
  learningVelocity: 85
};

const achievements = [
  {
    id: 1,
    title: "Portfolio Excellence",
    description: "Exceeded annual portfolio performance targets by 15%",
    type: "performance",
    rarity: "gold",
    date: "2024-02-15",
    impact: "$2.3M additional revenue",
    category: "Financial Performance"
  },
  {
    id: 2,
    title: "Innovation Leader",
    description: "Led implementation of AI-driven portfolio optimization",
    type: "innovation",
    rarity: "platinum",
    date: "2024-01-08",
    impact: "20% efficiency improvement",
    category: "Technology & Innovation"
  },
  {
    id: 3,
    title: "Mentorship Master",
    description: "Successfully mentored 5 junior analysts to promotion",
    type: "leadership",
    rarity: "silver",
    date: "2023-12-20",
    impact: "Team development excellence",
    category: "Leadership & Development"
  },
  {
    id: 4,
    title: "Client Champion",
    description: "Achieved 98% client retention rate",
    type: "client",
    rarity: "gold",
    date: "2023-11-30",
    impact: "$5.2M portfolio retention",
    category: "Client Excellence"
  }
];

const networkConnections = {
  directReports: [
    { name: "Michael Chen", role: "Junior Analyst", department: "Investment Banking" },
    { name: "Sarah Rodriguez", role: "Portfolio Associate", department: "Investment Banking" },
    { name: "James Wilson", role: "Research Analyst", department: "Investment Banking" }
  ],
  peers: [
    { name: "Jennifer Zhang", role: "Senior Portfolio Manager", department: "Wealth Management" },
    { name: "Robert Kumar", role: "Senior Relationship Manager", department: "Corporate Banking" },
    { name: "Lisa Thompson", role: "Senior Risk Analyst", department: "Risk Management" }
  ],
  mentors: [
    { name: "David Chen", role: "VP Investment Banking", department: "Investment Banking" },
    { name: "Maria Santos", role: "Executive Director", department: "Strategic Planning" }
  ],
  mentees: [
    { name: "Alex Johnson", role: "Junior Analyst", department: "Investment Banking" },
    { name: "Emily Davis", role: "Investment Associate", department: "Investment Banking" }
  ]
};

// Get executive profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledModules.moduleId', 'title category')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate years of service
    const yearsOfService = user.createdAt 
      ? ((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1)
      : 0.5;

    // Create dynamic executive profile from user data
    const executiveProfile = {
      name: `${user.firstName} ${user.lastName}`,
      title: user.jobTitle || user.role === 'admin' ? 'Senior Manager' : user.role === 'manager' ? 'Team Lead' : 'Professional',
      department: user.department || 'General Banking',
      employeeId: user.employeeId || `NBF${user._id.toString().substr(-4).toUpperCase()}`,
      startDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '2024-01-01',
      level: `Level ${user.stats?.level || 1} - ${user.stats?.level > 5 ? 'Senior' : user.stats?.level > 3 ? 'Mid-level' : 'Junior'} Professional`,
      yearsOfService: parseFloat(yearsOfService),
      profileImage: user.avatarPortrait || user.avatar || "/api/placeholder/120/120",
      reportingManager: "Manager - " + user.department,
      directReports: user.role === 'manager' ? Math.floor(Math.random() * 5) + 1 : 0,
      currentLocation: user.location || "Toronto, ON",
      workStyle: "Hybrid",
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completedModules: user.enrolledModules?.filter(m => m.completedAt).length || 0,
      totalXP: user.stats?.totalXP || user.stats?.xp || 0,
      currentStreak: user.stats?.streak || 0
    };

    res.json({
      success: true,
      data: executiveProfile
    });
  } catch (error) {
    console.error('Error fetching career profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get performance metrics
router.get('/performance', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate performance metrics from user data
    const completedModules = user.enrolledModules?.filter(m => m.completedAt).length || 0;
    const totalModules = user.enrolledModules?.length || 1;
    const completionRate = Math.round((completedModules / totalModules) * 100);
    
    const performanceMetrics = {
      overallRating: Math.min(4.2 + (user.stats?.level || 1) * 0.1, 5.0),
      promotionReadiness: Math.min(60 + (user.stats?.level || 1) * 5 + completionRate * 0.2, 100),
      leadershipScore: Math.min(70 + (user.role === 'manager' ? 20 : user.role === 'admin' ? 25 : 0) + (user.stats?.level || 1) * 2, 100),
      innovationIndex: Math.min(50 + completedModules * 3 + (user.stats?.level || 1) * 4, 100),
      collaborationRating: Math.min(80 + (user.stats?.streak || 0) * 2, 100),
      clientSatisfaction: Math.min(85 + (user.stats?.totalPoints || 0) / 100, 100),
      goalCompletion: completionRate,
      learningVelocity: Math.min(60 + (user.stats?.totalXP || user.stats?.xp || 0) / 50, 100)
    };

    res.json({
      success: true,
      data: performanceMetrics
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get achievements
router.get('/achievements', (req, res) => {
  res.json({
    success: true,
    data: achievements
  });
});

// Get network connections
router.get('/network', (req, res) => {
  res.json({
    success: true,
    data: networkConnections
  });
});

// Get all career data
router.get('/', (req, res) => {
  res.json({ 
    success: true,
    data: {
      profile: executiveProfile,
      performance: performanceMetrics,
      achievements,
      network: networkConnections
    }
  });
});

// Get career data by employee ID
router.get('/:id', (req, res) => {
  res.json({ 
    success: true, 
    message: 'career by ID endpoint working',
    id: req.params.id,
    data: {
      profile: { ...executiveProfile, employeeId: req.params.id },
      performance: performanceMetrics,
      achievements,
      network: networkConnections
    }
  });
});

// Update performance metrics
router.put('/performance', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Performance metrics updated successfully',
    data: { ...performanceMetrics, ...req.body }
  });
});

// Add new achievement
router.post('/achievements', (req, res) => {
  const newAchievement = {
    id: achievements.length + 1,
    ...req.body,
    date: new Date().toISOString().split('T')[0]
  };
  res.json({ 
    success: true, 
    message: 'Achievement added successfully',
    data: newAchievement
  });
});

module.exports = router;
