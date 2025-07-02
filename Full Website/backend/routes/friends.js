const express = require('express');
const router = express.Router();

// Professional Banking Network Data Models
const professionalColleagues = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Chen',
    department: 'Investment Banking',
    role: 'Senior Portfolio Manager',
    avatar: '',
    skills: ['Portfolio Management', 'Risk Assessment', 'Financial Analysis', 'Client Relations', 'Team Leadership'],
    status: 'online',
    collaborationHistory: 8,
    mentorshipPotential: 'mentor',
    joinedAt: '2022-03-15',
    lastActive: '2 hours ago',
    projectsInCommon: 3,
    expertise: ['Investment Strategy', 'Market Analysis', 'Corporate Finance'],
    isConnected: true,
    connectionStrength: 94,
    achievements: ['Cross-Department Collaborator', 'Mentorship Excellence', 'Innovation Leader'],
    yearsExperience: 8,
    location: 'Toronto, ON',
    professionalCertifications: ['CFA', 'FRM', 'PMP']
  },
  {
    id: 2,
    firstName: 'Michael',
    lastName: 'Torres',
    department: 'Risk Management',
    role: 'Senior Risk Analyst',
    avatar: '',
    skills: ['Risk Modeling', 'Regulatory Compliance', 'Data Analysis', 'Financial Forecasting'],
    status: 'away',
    collaborationHistory: 6,
    mentorshipPotential: 'peer',
    joinedAt: '2021-08-20',
    lastActive: '1 day ago',
    projectsInCommon: 2,
    expertise: ['Credit Risk', 'Operational Risk', 'Basel III Compliance'],
    isConnected: true,
    connectionStrength: 87,
    achievements: ['Risk Innovation Award', 'Regulatory Excellence'],
    yearsExperience: 6,
    location: 'Montreal, QC',
    professionalCertifications: ['FRM', 'CRM']
  },
  {
    id: 3,
    firstName: 'Dr. Patricia',
    lastName: 'Wong',
    department: 'Technology',
    role: 'Chief Technology Officer',
    avatar: '',
    skills: ['Digital Transformation', 'Innovation Strategy', 'Technical Leadership', 'Cybersecurity'],
    status: 'busy',
    collaborationHistory: 15,
    mentorshipPotential: 'mentor',
    joinedAt: '2019-01-10',
    lastActive: '30 minutes ago',
    projectsInCommon: 0,
    expertise: ['Banking Systems', 'Security Implementation', 'AI/ML', 'Cloud Architecture'],
    isConnected: false,
    connectionStrength: 96,
    achievements: ['Technology Visionary', 'Innovation Pioneer', 'Digital Excellence'],
    yearsExperience: 15,
    location: 'Vancouver, BC',
    professionalCertifications: ['PhD Computer Science', 'CISSP', 'AWS Solutions Architect']
  },
  {
    id: 4,
    firstName: 'James',
    lastName: 'Rodriguez',
    department: 'Investment Banking',
    role: 'Executive Vice President',
    avatar: '',
    skills: ['Executive Leadership', 'Strategic Planning', 'Mergers & Acquisitions', 'Client Management'],
    status: 'online',
    collaborationHistory: 12,
    mentorshipPotential: 'mentor',
    joinedAt: '2018-05-15',
    lastActive: '15 minutes ago',
    projectsInCommon: 1,
    expertise: ['Corporate Strategy', 'M&A', 'Investment Banking', 'Executive Management'],
    isConnected: false,
    connectionStrength: 89,
    achievements: ['Executive Excellence', 'Strategic Leadership', 'M&A Expert'],
    yearsExperience: 18,
    location: 'Calgary, AB',
    professionalCertifications: ['MBA', 'CFA', 'ICD.D']
  },
  {
    id: 5,
    firstName: 'Jennifer',
    lastName: 'Wu',
    department: 'Technology',
    role: 'Senior Software Architect',
    avatar: '',
    skills: ['System Architecture', 'Full Stack Development', 'DevOps', 'Agile Leadership'],
    status: 'online',
    collaborationHistory: 7,
    mentorshipPotential: 'mentor',
    joinedAt: '2020-11-03',
    lastActive: '1 hour ago',
    projectsInCommon: 4,
    expertise: ['Banking Platforms', 'Microservices', 'Cloud Computing', 'Technical Leadership'],
    isConnected: true,
    connectionStrength: 91,
    achievements: ['Technical Innovation', 'Agile Champion', 'Architecture Excellence'],
    yearsExperience: 10,
    location: 'Toronto, ON',
    professionalCertifications: ['AWS Certified', 'Kubernetes Admin', 'Scrum Master']
  }
];

const connectionRequests = [
  {
    id: 1,
    from: professionalColleagues[2], // Dr. Patricia Wong
    to: 1, // Current user
    message: 'Hello! I noticed your exceptional work on the digital banking transformation project. I\'d love to connect and potentially explore mentorship opportunities in technology leadership and innovation strategy.',
    endorsements: ['Technical Leadership', 'Innovation Strategy', 'Digital Transformation'],
    mutualConnections: 7,
    timestamp: '2024-03-15T10:30:00Z',
    status: 'pending',
    recommendationLetter: 'Patricia is recognized as a visionary technology leader who has successfully led multiple digital transformation initiatives across the banking sector.',
    departmentVerified: true,
    projectRelevance: 'Digital Banking Modernization Initiative'
  },
  {
    id: 2,
    from: professionalColleagues[3], // James Rodriguez
    to: 1,
    message: 'Greetings! Your strategic approach to portfolio management and client relations strongly aligns with our executive development program. I\'d appreciate the opportunity to connect and discuss career advancement opportunities.',
    endorsements: ['Strategic Planning', 'Executive Leadership', 'Client Management'],
    mutualConnections: 5,
    timestamp: '2024-03-14T15:45:00Z',
    status: 'pending',
    recommendationLetter: 'James brings exceptional executive leadership experience and has a proven track record of developing high-potential banking professionals.',
    departmentVerified: true,
    projectRelevance: 'Executive Leadership Development Program'
  }
];

const networkingAnalytics = {
  totalConnections: 147,
  departmentConnections: {
    'Investment Banking': 45,
    'Risk Management': 28,
    'Technology': 32,
    'Retail Banking': 25,
    'Human Resources': 17
  },
  networkingGrowth: 23,
  collaborationScore: 89,
  mentorshipImpact: 76,
  professionalInfluence: 4,
  connectionStrengthAverage: 82,
  crossDepartmentConnections: 85,
  monthlyGrowthTrend: [
    { month: 'January', connections: 98, collaborations: 12, influence: 72 },
    { month: 'February', connections: 112, collaborations: 18, influence: 75 },
    { month: 'March', connections: 135, collaborations: 24, influence: 78 },
    { month: 'April', connections: 147, collaborations: 31, influence: 82 }
  ],
  topCollaborators: [
    { name: 'Sarah Chen', department: 'Investment Banking', projects: 8, connectionStrength: 94 },
    { name: 'Michael Torres', department: 'Risk Management', projects: 6, connectionStrength: 87 },
    { name: 'Jennifer Wu', department: 'Technology', projects: 7, connectionStrength: 91 },
    { name: 'David Kim', department: 'Retail Banking', projects: 5, connectionStrength: 83 }
  ]
};

const mentorshipData = {
  currentMentorships: [
    {
      id: 1,
      mentor: {
        firstName: 'Rebecca',
        lastName: 'Martinez',
        role: 'Senior Investment Director',
        department: 'Investment Banking',
        expertise: ['Portfolio Strategy', 'Client Relations', 'Team Leadership'],
        yearsExperience: 12,
        menteeCount: 6,
        successRate: 94
      },
      mentee: 'Current User',
      startDate: '2024-01-15',
      focus: ['Leadership Development', 'Strategic Planning', 'Client Management'],
      progress: 78,
      nextSession: '2024-03-20T14:00:00Z',
      goals: [
        { goal: 'Complete leadership certification', completed: true, completedDate: '2024-02-15' },
        { goal: 'Lead cross-departmental project', completed: true, completedDate: '2024-03-01' },
        { goal: 'Develop client presentation skills', completed: false, targetDate: '2024-04-15' },
        { goal: 'Build strategic partnership network', completed: false, targetDate: '2024-05-01' }
      ],
      sessionHistory: [
        { date: '2024-03-06', topic: 'Strategic Communication', rating: 5 },
        { date: '2024-02-27', topic: 'Leadership Presence', rating: 5 },
        { date: '2024-02-13', topic: 'Project Management', rating: 4 }
      ]
    }
  ],
  mentorshipRecommendations: [
    {
      id: 1,
      colleague: professionalColleagues[2], // Dr. Patricia Wong
      matchScore: 94,
      reason: 'Exceptional match for technology leadership and digital banking innovation. Dr. Wong has successfully mentored 15+ professionals in technical leadership roles.',
      availability: 'Limited - 2 spots available',
      specializations: ['Technical Leadership', 'Innovation Strategy', 'Digital Transformation']
    },
    {
      id: 2,
      colleague: professionalColleagues[3], // James Rodriguez
      matchScore: 89,
      reason: 'Strong alignment with your career trajectory and leadership aspirations. James has extensive experience in executive development and strategic planning.',
      availability: 'Open - 3 spots available',
      specializations: ['Executive Leadership', 'Strategic Planning', 'Career Development']
    }
  ]
};

// Professional networking endpoints

// Get all professional network data
router.get('/', (req, res) => {
  try {
    const friendsData = {
      colleagues: professionalColleagues,
      connectionRequests: connectionRequests,
      analytics: networkingAnalytics,
      recommendedConnections: professionalColleagues.filter(c => !c.isConnected).slice(0, 5),
      recentActivity: [
        {
          id: 1,
          type: 'connection',
          user: 'Sarah Chen',
          action: 'accepted your connection request',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          id: 2,
          type: 'mentorship',
          user: 'Dr. Patricia Wong',
          action: 'sent a mentorship request',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        },
        {
          id: 3,
          type: 'collaboration',
          user: 'Michael Torres',
          action: 'invited you to collaborate on Risk Assessment Project',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
        }
      ],
      mentorshipData: mentorshipData
    };

    res.json({ 
      success: true, 
      message: 'Professional network data retrieved successfully',
      data: friendsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving professional network data',
      error: error.message
    });
  }
});

// Get colleague by ID
router.get('/colleague/:id', (req, res) => {
  try {
    const colleagueId = parseInt(req.params.id);
    const colleague = professionalColleagues.find(c => c.id === colleagueId);
    
    if (!colleague) {
      return res.status(404).json({
        success: false,
        message: 'Professional colleague not found'
      });
    }

    res.json({ 
      success: true, 
      message: 'Colleague data retrieved successfully',
      data: colleague
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving colleague data',
      error: error.message
    });
  }
});

// Send connection request
router.post('/connect', (req, res) => {
  try {
    const { colleagueId, message, endorsements } = req.body;
    
    // Validate request
    if (!colleagueId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Colleague ID and message are required'
      });
    }

    const colleague = professionalColleagues.find(c => c.id === colleagueId);
    if (!colleague) {
      return res.status(404).json({
        success: false,
        message: 'Colleague not found'
      });
    }

    // Create new connection request
    const newRequest = {
      id: connectionRequests.length + 1,
      from: { id: 1, firstName: 'Current', lastName: 'User' }, // Mock current user
      to: colleagueId,
      message: message,
      endorsements: endorsements || [],
      mutualConnections: Math.floor(Math.random() * 10) + 1,
      timestamp: new Date().toISOString(),
      status: 'pending',
      departmentVerified: true
    };

    connectionRequests.push(newRequest);

    res.json({ 
      success: true, 
      message: 'Connection request sent successfully',
      data: newRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending connection request',
      error: error.message
    });
  }
});

// Handle connection request response
router.post('/respond', (req, res) => {
  try {
    const { requestId, action } = req.body; // action: 'accept' or 'decline'
    
    if (!requestId || !['accept', 'decline'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Valid request ID and action (accept/decline) are required'
      });
    }

    const requestIndex = connectionRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found'
      });
    }

    // Update request status
    connectionRequests[requestIndex].status = action === 'accept' ? 'accepted' : 'declined';

    // If accepted, update colleague connection status
    if (action === 'accept') {
      const colleague = professionalColleagues.find(c => c.id === connectionRequests[requestIndex].from.id);
      if (colleague) {
        colleague.isConnected = true;
      }
    }

    res.json({ 
      success: true, 
      message: `Connection request ${action}ed successfully`,
      data: connectionRequests[requestIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing connection request',
      error: error.message
    });
  }
});

// Get networking analytics
router.get('/analytics', (req, res) => {
  try {
    res.json({ 
      success: true, 
      message: 'Networking analytics retrieved successfully',
      data: networkingAnalytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving analytics data',
      error: error.message
    });
  }
});

// Get mentorship data
router.get('/mentorship', (req, res) => {
  try {
    res.json({ 
      success: true, 
      message: 'Mentorship data retrieved successfully',
      data: mentorshipData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving mentorship data',
      error: error.message
    });
  }
});

// Request mentorship
router.post('/mentorship/request', (req, res) => {
  try {
    const { mentorId, message, focusAreas } = req.body;
    
    if (!mentorId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Mentor ID and message are required'
      });
    }

    const mentor = professionalColleagues.find(c => c.id === mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // Create mentorship request
    const mentorshipRequest = {
      id: Date.now(),
      mentor: mentor,
      mentee: { id: 1, firstName: 'Current', lastName: 'User' },
      message: message,
      focusAreas: focusAreas || [],
      status: 'pending',
      requestDate: new Date().toISOString()
    };

    res.json({ 
      success: true, 
      message: 'Mentorship request sent successfully',
      data: mentorshipRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending mentorship request',
      error: error.message
    });
  }
});

// Search colleagues
router.get('/search', (req, res) => {
  try {
    const { query, department } = req.query;
    
    let filteredColleagues = [...professionalColleagues];
    
    // Filter by search query
    if (query) {
      filteredColleagues = filteredColleagues.filter(colleague => 
        colleague.firstName.toLowerCase().includes(query.toLowerCase()) ||
        colleague.lastName.toLowerCase().includes(query.toLowerCase()) ||
        colleague.role.toLowerCase().includes(query.toLowerCase()) ||
        colleague.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    // Filter by department
    if (department && department !== 'all') {
      filteredColleagues = filteredColleagues.filter(colleague => 
        colleague.department === department
      );
    }
    
    // Filter by mentorship potential
    if (mentorship) {
      filteredColleagues = filteredColleagues.filter(colleague => 
        colleague.mentorshipPotential === mentorship
      );
    }

    res.json({ 
      success: true, 
      message: 'Search results retrieved successfully',
      data: filteredColleagues,
      totalResults: filteredColleagues.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: error.message
    });
  }
});

module.exports = router;
