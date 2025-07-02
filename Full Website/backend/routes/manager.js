const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Mock team members data
const teamMembers = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@nationalbank.com',
    avatar: '/avatars/sarah-chen.jpg',
    role: 'Senior Analyst',
    department: 'Investment Banking',
    performance: 95,
    completedModules: 12,
    totalModules: 15,
    lastActive: new Date('2024-01-20T14:30:00'),
    status: 'active',
    skills: ['Risk Assessment', 'Portfolio Management', 'Financial Modeling'],
    joinDate: '2022-03-15',
    managerId: 'mgr-001'
  },
  {
    id: '2', 
    name: 'Marcus Johnson',
    email: 'marcus.johnson@nationalbank.com',
    avatar: '/avatars/marcus-johnson.jpg',
    role: 'Financial Advisor',
    department: 'Wealth Management',
    performance: 89,
    completedModules: 10,
    totalModules: 14,
    lastActive: new Date('2024-01-20T13:15:00'),
    status: 'active',
    skills: ['Client Relations', 'Investment Strategy', 'Compliance'],
    joinDate: '2021-08-20',
    managerId: 'mgr-001'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@nationalbank.com', 
    avatar: '/avatars/elena-rodriguez.jpg',
    role: 'Credit Analyst',
    department: 'Risk Management',
    performance: 91,
    completedModules: 8,
    totalModules: 12,
    lastActive: new Date('2024-01-20T09:45:00'),
    status: 'away',
    skills: ['Credit Assessment', 'Data Analysis', 'Regulatory Compliance'],
    joinDate: '2023-01-10',
    managerId: 'mgr-001'
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david.park@nationalbank.com',
    avatar: '/avatars/david-park.jpg',
    role: 'Operations Manager',
    department: 'Operations',
    performance: 88,
    completedModules: 9,
    totalModules: 11,
    lastActive: new Date('2024-01-20T11:20:00'),
    status: 'active',
    skills: ['Process Optimization', 'Team Leadership', 'Quality Assurance'],
    joinDate: '2020-11-05',
    managerId: 'mgr-001'
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa.wang@nationalbank.com',
    avatar: '/avatars/lisa-wang.jpg',
    role: 'Portfolio Manager',
    department: 'Investment Banking',
    performance: 93,
    completedModules: 14,
    totalModules: 16,
    lastActive: new Date('2024-01-20T15:45:00'),
    status: 'active',
    skills: ['Asset Allocation', 'Market Analysis', 'Risk Management'],
    joinDate: '2019-06-12',
    managerId: 'mgr-001'
  },
  {
    id: '6',
    name: 'Michael Torres',
    email: 'michael.torres@nationalbank.com',
    avatar: '/avatars/michael-torres.jpg',
    role: 'Compliance Officer',
    department: 'Risk Management',
    performance: 90,
    completedModules: 11,
    totalModules: 13,
    lastActive: new Date('2024-01-20T08:30:00'),
    status: 'offline',
    skills: ['Regulatory Compliance', 'Audit Management', 'Policy Development'],
    joinDate: '2021-02-28',
    managerId: 'mgr-001'
  }
];

// Mock training modules for assignment
const trainingModules = [
  {
    id: 'risk-101',
    title: 'Advanced Risk Assessment',
    description: 'Comprehensive risk analysis techniques for modern banking',
    category: 'Risk Management',
    difficulty: 'Advanced',
    duration: '4 hours',
    completionRate: 78,
    recommended: true,
    prerequisites: ['basic-risk-101'],
    skills: ['Risk Assessment', 'Data Analysis']
  },
  {
    id: 'portfolio-202',
    title: 'Portfolio Optimization Strategies',
    description: 'Advanced portfolio management and optimization techniques',
    category: 'Investment',
    difficulty: 'Expert',
    duration: '6 hours',
    completionRate: 65,
    recommended: false,
    prerequisites: ['portfolio-101', 'statistics-201'],
    skills: ['Portfolio Management', 'Financial Modeling']
  },
  {
    id: 'compliance-301',
    title: 'Regulatory Compliance Update',
    description: 'Latest regulatory requirements and compliance procedures',
    category: 'Compliance',
    difficulty: 'Intermediate',
    duration: '2 hours',
    completionRate: 92,
    recommended: true,
    prerequisites: ['compliance-basics'],
    skills: ['Regulatory Compliance', 'Policy Development']
  }
];

// GET /api/manager/team - Get team overview
router.get('/team', (req, res) => {
  const { department, status, search } = req.query;
  
  let filteredMembers = [...teamMembers];
  
  // Filter by department
  if (department && department !== 'all') {
    filteredMembers = filteredMembers.filter(member => 
      member.department === department
    );
  }
  
  // Filter by status
  if (status && status !== 'all') {
    filteredMembers = filteredMembers.filter(member => 
      member.status === status
    );
  }
  
  // Search filter
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredMembers = filteredMembers.filter(member =>
      member.name.toLowerCase().includes(searchTerm) ||
      member.department.toLowerCase().includes(searchTerm) ||
      member.role.toLowerCase().includes(searchTerm) ||
      member.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
  }
  
  // Calculate team metrics
  const metrics = {
    totalMembers: teamMembers.length,
    activeToday: teamMembers.filter(m => m.status === 'active').length,
    completionRate: Math.round(
      teamMembers.reduce((sum, member) => 
        sum + (member.completedModules / member.totalModules * 100), 0
      ) / teamMembers.length
    ),
    averagePerformance: Math.round(
      teamMembers.reduce((sum, member) => sum + member.performance, 0) / teamMembers.length
    ),
    pendingAssignments: 7,
    upcomingDeadlines: 12
  };
  
  res.json({
    success: true,
    data: {
      members: filteredMembers,
      metrics,
      departments: ['Investment Banking', 'Wealth Management', 'Risk Management', 'Operations']
    }
  });
});

// GET /api/manager/analytics - Get team analytics
router.get('/analytics', (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const { period = '7d' } = req.query;
  
  // Mock analytics data
  const analyticsData = {
    performanceTrends: [88, 92, 85, 94, 89, 96, 93],
    departmentComparison: [
      { dept: 'Investment Banking', score: 94, change: '+5%', members: 8 },
      { dept: 'Wealth Management', score: 89, change: '+2%', members: 6 },
      { dept: 'Risk Management', score: 91, change: '+7%', members: 5 },
      { dept: 'Operations', score: 87, change: '+3%', members: 5 }
    ],
    insights: [
      {
        type: 'ai-prediction',
        metric: '98% prediction',
        description: 'team will exceed Q4 targets',
        confidence: 'high'
      },
      {
        type: 'benchmark',
        metric: '23% above org avg',
        description: 'performance vs company benchmark',
        trend: 'positive'
      },
      {
        type: 'alert',
        metric: '2 members at risk',
        description: 'require intervention this week',
        priority: 'high'
      }
    ]
  };
  
  res.json({
    success: true,
    data: analyticsData
  });
});

// GET /api/manager/training/modules - Get available training modules
router.get('/training/modules', (req, res) => {
  const { category, difficulty, recommended } = req.query;
  
  let filteredModules = [...trainingModules];
  
  if (category) {
    filteredModules = filteredModules.filter(module => 
      module.category === category
    );
  }
  
  if (difficulty) {
    filteredModules = filteredModules.filter(module => 
      module.difficulty === difficulty
    );
  }
  
  if (recommended === 'true') {
    filteredModules = filteredModules.filter(module => module.recommended);
  }
  
  res.json({
    success: true,
    data: {
      modules: filteredModules,
      categories: ['Risk Management', 'Investment', 'Compliance', 'Operations'],
      difficulties: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    }
  });
});

// POST /api/manager/training/assign - Assign training to team members
router.post('/training/assign', (req, res) => {
  const { moduleIds, memberIds, schedule, deadline } = req.body;
  
  // Validate input
  if (!moduleIds || !moduleIds.length || !memberIds || !memberIds.length) {
    return res.status(400).json({
      success: false,
      message: 'Module IDs and member IDs are required'
    });
  }
  
  // Mock assignment creation
  const assignment = {
    id: `assign-${Date.now()}`,
    moduleIds,
    memberIds,
    schedule: schedule || 'immediate',
    deadline: deadline || null,
    createdAt: new Date(),
    status: 'pending',
    assignedBy: 'mgr-001'
  };
  
  res.json({
    success: true,
    message: `Successfully assigned ${moduleIds.length} modules to ${memberIds.length} team members`,
    data: assignment
  });
});

// GET /api/manager/achievements - Get team achievements
router.get('/achievements', (req, res) => {
  const achievements = [
    {
      id: 1,
      title: 'Team Excellence Award',
      description: 'Achieved 95% team performance rating',
      rarity: 'legendary',
      date: '2024-01-15',
      members: 24,
      icon: 'crown'
    },
    {
      id: 2,
      title: 'Training Completion Leader',
      description: 'First team to complete Q1 training goals',
      rarity: 'epic',
      date: '2024-01-10',
      members: 18,
      icon: 'target'
    },
    {
      id: 3,
      title: 'Innovation Champion',
      description: 'Top 3 innovative solutions implemented',
      rarity: 'rare',
      date: '2024-01-05',
      members: 12,
      icon: 'star'
    }
  ];
  
  const stats = {
    totalAchievements: 47,
    legendaryBadges: 12,
    goalCompletion: 89
  };
  
  res.json({
    success: true,
    data: {
      achievements,
      stats
    }
  });
});

// GET /api/manager/member/:id - Get individual team member details
router.get('/member/:id', (req, res) => {
  const { id } = req.params;
  const member = teamMembers.find(m => m.id === id);
  
  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Team member not found'
    });
  }
  
  // Add additional details for individual view
  const memberDetails = {
    ...member,
    recentActivity: [
      { type: 'module_completion', module: 'Risk Assessment 101', date: '2024-01-19' },
      { type: 'achievement', achievement: 'Excel Expert', date: '2024-01-18' },
      { type: 'assignment', module: 'Compliance Update', date: '2024-01-17' }
    ],
    performanceHistory: [89, 91, 88, 92, 94, 93, 95],
    goals: [
      { id: 1, title: 'Complete Advanced Risk Training', progress: 75, dueDate: '2024-02-15' },
      { id: 2, title: 'Mentor Junior Analyst', progress: 50, dueDate: '2024-03-01' }
    ]
  };
  
  res.json({
    success: true,
    data: memberDetails
  });
});

// PUT /api/manager/member/:id - Update team member
router.put('/member/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const memberIndex = teamMembers.findIndex(m => m.id === id);
  
  if (memberIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Team member not found'
    });
  }
  
  // Update member (in a real app, this would update the database)
  teamMembers[memberIndex] = { ...teamMembers[memberIndex], ...updates };
  
  res.json({
    success: true,
    message: 'Team member updated successfully',
    data: teamMembers[memberIndex]
  });
});

// POST /api/manager/team-progress - Get team training progress
router.post('/team-progress', protect, async (req, res) => {
  try {
    const { userIds } = req.body;
    const User = require('../models/User');
    const Module = require('../models/Module');

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    // Get users with their enrolled modules
    const users = await User.find({ _id: { $in: userIds } })
      .select('firstName lastName enrolledModules')
      .populate('enrolledModules.moduleId', 'title');

    const progressData = [];

    for (const user of users) {
      for (const enrollment of user.enrolledModules) {
        if (enrollment.progress > 0 && !enrollment.completedAt) {
          // Calculate estimated time remaining
          const estimatedDuration = enrollment.moduleId?.estimatedDuration || 4;
          const remainingHours = (estimatedDuration * (100 - enrollment.progress)) / 100;
          
          let timeRemaining;
          if (enrollment.progress === 100) {
            timeRemaining = 'Completed';
          } else if (remainingHours < 1) {
            timeRemaining = `${Math.round(remainingHours * 60)} minutes`;
          } else {
            timeRemaining = `${remainingHours.toFixed(1)} hours`;
          }

          progressData.push({
            userId: user._id,
            userName: `${user.firstName} ${user.lastName}`,
            moduleId: enrollment.moduleId._id,
            moduleTitle: enrollment.moduleId.title,
            progress: enrollment.progress,
            timeRemaining,
            status: enrollment.progress === 100 ? 'completed' : 'in-progress'
          });
        }
      }
    }

    res.json({
      success: true,
      data: progressData
    });
  } catch (error) {
    console.error('Error fetching team progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team progress'
    });
  }
});

// Legacy routes for backward compatibility
router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Manager API is working. Use /team for team data.',
    endpoints: [
      'GET /team - Get team overview',
      'GET /analytics - Get team analytics',
      'GET /training/modules - Get training modules',
      'POST /training/assign - Assign training',
      'GET /achievements - Get team achievements',
      'GET /member/:id - Get member details',
      'PUT /member/:id - Update member',
      'POST /team-progress - Get team training progress'
    ]
  });
});

router.get('/:id', (req, res) => {
  res.redirect(`/api/manager/member/${req.params.id}`);
});

module.exports = router;
