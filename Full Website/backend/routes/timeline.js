const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Module = require('../models/Module');
const Team = require('../models/Team');

// Sample timeline data
const timelineEvents = [
  {
    id: '1',
    year: 1859,
    date: 'March 15, 1859',
    title: 'National Bank Founded',
    description: 'The National Bank of Canada opens its doors for the first time, beginning a legacy of financial innovation.',
    type: 'milestone',
    category: 'founding',
    era: 'pioneer',
    impact: [
      { metric: 'Initial Capital', value: '$500,000' },
      { metric: 'First Branches', value: '3 locations' }
    ]
  },
  {
    id: '2',
    year: 1872,
    date: 'June 1, 1872',
    title: 'First International Partnership',
    description: 'Established groundbreaking international banking relationships with European institutions.',
    type: 'expansion',
    category: 'international',
    era: 'pioneer',
    impact: [
      { metric: 'Countries Connected', value: '5' },
      { metric: 'Trade Volume', value: '$2.5M' }
    ]
  },
  {
    id: '3',
    year: 1885,
    date: 'November 11, 1885',
    title: 'First Branch Network Expansion',
    description: 'Opened 10 new branches across Ontario and Quebec, establishing National Bank as a regional leader.',
    type: 'expansion',
    category: 'growth',
    era: 'pioneer',
    impact: [
      { metric: 'New Branches', value: '10 locations' },
      { metric: 'Coverage Area', value: '2 provinces' }
    ]
  },
  {
    id: '4',
    year: 1920,
    date: 'January 10, 1920',
    title: 'Introduced Personal Banking',
    description: 'Revolutionary personal banking services made financial management accessible to all Canadians.',
    type: 'innovation',
    category: 'services',
    era: 'growth',
    impact: [
      { metric: 'New Customers', value: '50,000+' },
      { metric: 'Branches', value: '25 locations' }
    ]
  },
  {
    id: '5',
    year: 1945,
    date: 'May 8, 1945',
    title: 'Post-War Reconstruction Loans',
    description: 'Launched special lending programs to support Canadian businesses rebuilding after WWII.',
    type: 'social-impact',
    category: 'community',
    era: 'growth',
    impact: [
      { metric: 'Reconstruction Loans', value: '$50M' },
      { metric: 'Businesses Supported', value: '5,000+' }
    ]
  },
  {
    id: '6',
    year: 1967,
    date: 'July 1, 1967',
    title: 'First Computer System',
    description: 'Pioneered computerized banking in Canada, transforming transaction processing.',
    type: 'innovation',
    category: 'technology',
    era: 'innovation',
    impact: [
      { metric: 'Processing Speed', value: '10x faster' },
      { metric: 'Accuracy', value: '99.9%' }
    ]
  },
  {
    id: '7',
    year: 1975,
    date: 'July 15, 1975',
    title: 'First ATM Installation',
    description: 'Pioneered automated banking in Canada with the installation of our first ATM network.',
    type: 'innovation',
    category: 'technology',
    era: 'innovation',
    impact: [
      { metric: 'ATMs Installed', value: '50 units' },
      { metric: 'Daily Transactions', value: '1,000+' }
    ]
  },
  {
    id: '8',
    year: 1995,
    date: 'September 30, 1995',
    title: 'Environmental Sustainability Initiative',
    description: 'Became the first Canadian bank to implement comprehensive environmental policies.',
    type: 'social-impact',
    category: 'environment',
    era: 'innovation',
    impact: [
      { metric: 'Carbon Reduction', value: '40%' },
      { metric: 'Green Projects Funded', value: '$500M' }
    ]
  },
  {
    id: '9',
    year: 2001,
    date: 'September 15, 2001',
    title: 'Launch of Online Banking',
    description: 'Introduced comprehensive online banking platform, bringing banking to the digital age.',
    type: 'innovation',
    category: 'digital',
    era: 'digital',
    impact: [
      { metric: 'Online Users', value: '1M+' },
      { metric: 'Digital Transactions', value: '50M/year' }
    ]
  },
  {
    id: '10',
    year: 2010,
    date: 'January 15, 2010',
    title: 'Mobile Banking Revolution',
    description: 'Launched Canada\'s most advanced mobile banking app with biometric security.',
    type: 'innovation',
    category: 'digital',
    era: 'digital',
    impact: [
      { metric: 'Mobile Users', value: '2M+' },
      { metric: 'App Rating', value: '4.8/5' }
    ]
  },
  {
    id: '11',
    year: 2020,
    date: 'March 20, 2020',
    title: 'COVID-19 Support Initiative',
    description: 'Launched comprehensive support programs for businesses and individuals during the pandemic.',
    type: 'social-impact',
    category: 'community',
    era: 'digital',
    impact: [
      { metric: 'Businesses Helped', value: '100,000+' },
      { metric: 'Relief Funding', value: '$5B' }
    ]
  },
  {
    id: '12',
    year: 2024,
    date: 'March 15, 2024',
    title: '165th Anniversary Celebration',
    description: 'Celebrating 165 years of innovation, growth, and community impact across Canada.',
    type: 'milestone',
    category: 'anniversary',
    era: 'digital',
    impact: [
      { metric: 'Customers Served', value: '10M+' },
      { metric: 'Branches Nationwide', value: '2,400+' }
    ]
  }
];

// User bookmarks storage (in production, this would be in database)
const userBookmarks = new Map();

// Get all timeline events with filtering
router.get('/', protect, async (req, res) => {
  try {
    const { era, type, search, year, limit, offset } = req.query;

    // Generate dynamic timeline events based on platform activity
    const dynamicEvents = await generateDynamicTimelineEvents();
    
    // Combine static historical events with dynamic events
    let events = [...timelineEvents, ...dynamicEvents];

    // Apply filters
    if (era) {
      events = events.filter(event => event.era === era);
    }
    if (type) {
      events = events.filter(event => event.type === type);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      events = events.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.year.toString().includes(search)
      );
    }
    if (year) {
      events = events.filter(event => event.year === parseInt(year));
    }

    // Sort by year (newest first for recent events)
    events.sort((a, b) => b.year - a.year);

    // Apply pagination
    const startIndex = offset ? parseInt(offset) : 0;
    const limitNum = limit ? parseInt(limit) : events.length;
    events = events.slice(startIndex, startIndex + limitNum);

    res.json({ 
      success: true, 
      data: events,
      totalCount: events.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching timeline events',
      error: error.message 
    });
  }
});

// Generate dynamic timeline events based on platform activity
async function generateDynamicTimelineEvents() {
  try {
    const currentYear = new Date().getFullYear();
    const events = [];

    // Get platform statistics
    const [totalUsers, totalModules, activeTeams, recentSignups] = await Promise.all([
      User.countDocuments(),
      Module.countDocuments({ status: 'published' }),
      Team.countDocuments({ isActive: true }),
      User.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      })
    ]);

    // Platform milestone events
    if (totalUsers >= 1000) {
      events.push({
        id: `milestone-users-${Math.floor(totalUsers / 1000)}k`,
        year: currentYear,
        date: new Date().toLocaleDateString(),
        title: `${Math.floor(totalUsers / 1000)}K+ Users Milestone`,
        description: `The BNC Training Platform reaches ${totalUsers.toLocaleString()} registered professionals, marking a significant growth milestone.`,
        type: 'achievement',
        category: 'platform',
        era: 'digital',
        impact: [
          { metric: 'Total Users', value: totalUsers.toLocaleString() },
          { metric: 'Growth Rate', value: 'Accelerating' }
        ]
      });
    }

    if (totalModules >= 50) {
      events.push({
        id: `milestone-modules-${totalModules}`,
        year: currentYear,
        date: new Date().toLocaleDateString(),
        title: `${totalModules}+ Training Modules Available`,
        description: `Platform now offers ${totalModules} comprehensive training modules covering all aspects of modern banking.`,
        type: 'expansion',
        category: 'education',
        era: 'digital',
        impact: [
          { metric: 'Total Modules', value: totalModules.toString() },
          { metric: 'Coverage', value: 'Comprehensive' }
        ]
      });
    }

    if (activeTeams >= 10) {
      events.push({
        id: `milestone-teams-${activeTeams}`,
        year: currentYear,
        date: new Date().toLocaleDateString(),
        title: `${activeTeams} Active Learning Teams`,
        description: `Professional teams are collaborating actively on the platform, fostering knowledge sharing and team development.`,
        type: 'community',
        category: 'collaboration',
        era: 'digital',
        impact: [
          { metric: 'Active Teams', value: activeTeams.toString() },
          { metric: 'Collaboration', value: 'Growing' }
        ]
      });
    }

    // Recent growth events
    if (recentSignups > 0) {
      events.push({
        id: `growth-recent-${Date.now()}`,
        year: currentYear,
        date: new Date().toLocaleDateString(),
        title: `${recentSignups} New Professionals This Month`,
        description: `${recentSignups} banking professionals joined the platform this month, expanding our learning community.`,
        type: 'growth',
        category: 'community',
        era: 'digital',
        impact: [
          { metric: 'New Users', value: recentSignups.toString() },
          { metric: 'Period', value: 'Last 30 days' }
        ]
      });
    }

    // Add current year platform launch event if not exists
    const currentYearEvent = {
      id: `platform-launch-${currentYear}`,
      year: currentYear,
      date: 'January 1, 2024',
      title: 'Digital Training Platform Launch',
      description: 'National Bank of Canada launches its next-generation digital training and professional development platform.',
      type: 'milestone',
      category: 'digital',
      era: 'digital',
      impact: [
        { metric: 'Platform Features', value: 'Comprehensive' },
        { metric: 'Accessibility', value: '24/7 Global' }
      ]
    };

    events.push(currentYearEvent);

    return events;

  } catch (error) {
    console.error('Error generating dynamic timeline events:', error);
    return [];
  }
}

// Search timeline events
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json({ 
        success: true, 
        data: [] 
      });
    }

    const searchLower = q.toLowerCase();
    const results = timelineEvents.filter(event => 
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.year.toString().includes(q) ||
      event.type.toLowerCase().includes(searchLower) ||
      (event.era && event.era.toLowerCase().includes(searchLower))
    );

    res.json({ 
      success: true, 
      data: results 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error searching events',
      error: error.message 
    });
  }
});

// Get events by era
router.get('/era/:era', (req, res) => {
  try {
    const events = timelineEvents.filter(e => e.era === req.params.era);
    
    res.json({ 
      success: true, 
      data: events 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching events by era',
      error: error.message 
    });
  }
});

// Get timeline statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalEvents: timelineEvents.length,
      eventsByEra: {},
      eventsByType: {},
      yearsSpanned: 2024 - 1859
    };

    // Count events by era
    timelineEvents.forEach(event => {
      if (event.era) {
        stats.eventsByEra[event.era] = (stats.eventsByEra[event.era] || 0) + 1;
      }
      stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
    });

    res.json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching timeline stats',
      error: error.message 
    });
  }
});

// Get user's bookmarked events
router.get('/bookmarks', (req, res) => {
  try {
    const userId = req.user?.id || 'anonymous';
    const bookmarkedIds = userBookmarks.get(userId) || [];
    const bookmarkedEvents = timelineEvents.filter(e => bookmarkedIds.includes(e.id));
    
    res.json({ 
      success: true, 
      data: bookmarkedEvents 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching bookmarks',
      error: error.message 
    });
  }
});

// Get a single event by ID
router.get('/:id', (req, res) => {
  try {
    const event = timelineEvents.find(e => e.id === req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    res.json({ 
      success: true, 
      data: event 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching event',
      error: error.message 
    });
  }
});

// Get related events
router.get('/:id/related', (req, res) => {
  try {
    const event = timelineEvents.find(e => e.id === req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Find related events (same era or type)
    const related = timelineEvents
      .filter(e => 
        e.id !== event.id && 
        (e.era === event.era || e.type === event.type)
      )
      .sort((a, b) => Math.abs(a.year - event.year) - Math.abs(b.year - event.year))
      .slice(0, 4);

    res.json({ 
      success: true, 
      data: related 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching related events',
      error: error.message 
    });
  }
});

// Track event view (for analytics)
router.post('/:id/view', (req, res) => {
  try {
    // In production, this would track views in database
    // TODO: Implement database view tracking;
    
    res.json({ 
      success: true, 
      message: 'View tracked' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error tracking view',
      error: error.message 
    });
  }
});

// Get user's bookmarked events
router.get('/bookmarks', (req, res) => {
  try {
    const userId = req.user?.id || 'anonymous';
    const bookmarkedIds = userBookmarks.get(userId) || [];
    const bookmarkedEvents = timelineEvents.filter(e => bookmarkedIds.includes(e.id));
    
    res.json({ 
      success: true, 
      data: bookmarkedEvents 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching bookmarks',
      error: error.message 
    });
  }
});

// Toggle bookmark for an event
router.post('/:id/bookmark', (req, res) => {
  try {
    const userId = req.user?.id || 'anonymous';
    const eventId = req.params.id;
    
    // Get current bookmarks
    const bookmarks = userBookmarks.get(userId) || [];
    
    // Toggle bookmark
    const index = bookmarks.indexOf(eventId);
    if (index > -1) {
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(eventId);
    }
    
    // Save bookmarks
    userBookmarks.set(userId, bookmarks);
    
    res.json({ 
      success: true, 
      data: { 
        bookmarked: index === -1 
      } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error toggling bookmark',
      error: error.message 
    });
  }
});

// Create a new timeline event (admin only)
router.post('/', (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    const newEvent = {
      id: Date.now().toString(),
      ...req.body
    };

    timelineEvents.push(newEvent);
    
    res.status(201).json({ 
      success: true, 
      data: newEvent 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating event',
      error: error.message 
    });
  }
});

// Update an existing event (admin only)
router.put('/:id', (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    const index = timelineEvents.findIndex(e => e.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    timelineEvents[index] = {
      ...timelineEvents[index],
      ...req.body,
      id: req.params.id
    };
    
    res.json({ 
      success: true, 
      data: timelineEvents[index] 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating event',
      error: error.message 
    });
  }
});

// Delete an event (admin only)
router.delete('/:id', (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    const index = timelineEvents.findIndex(e => e.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    timelineEvents.splice(index, 1);
    
    res.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting event',
      error: error.message 
    });
  }
});

module.exports = router;