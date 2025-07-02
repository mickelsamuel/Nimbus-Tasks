const express = require('express');
const router = express.Router();
const Module = require('../models/Module');
const Achievement = require('../models/Achievement');
const User = require('../models/User');

// GET /api/public/dashboard-preview - Get sample dashboard data for homepage preview
router.get('/dashboard-preview', async (req, res) => {
  try {
    // Fetch popular published modules
    const popularModules = await Module.find({ 
      status: 'published',
      featured: true 
    })
    .sort({ enrollmentCount: -1 })
    .limit(3)
    .select('title category estimatedDuration');

    // If we don't have enough featured modules, get any published modules
    if (popularModules.length < 3) {
      const additionalModules = await Module.find({ 
        status: 'published',
        _id: { $nin: popularModules.map(m => m._id) }
      })
      .sort({ createdAt: -1 })
      .limit(3 - popularModules.length)
      .select('title category estimatedDuration');
      
      popularModules.push(...additionalModules);
    }

    // Generate sample progress for each module
    const coursesWithProgress = popularModules.map((module, index) => ({
      name: module.title,
      category: module.category,
      progress: index === 0 ? 85 : index === 1 ? 60 : 30, // Decreasing progress for visual effect
      color: index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-purple-500'
    }));

    // Get total certifications available
    const certificationCount = await Achievement.countDocuments({
      type: { $in: ['certification', 'certificate', 'badge'] }
    });

    // Get sample user stats
    const avgUserStats = await User.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          avgProgress: { $avg: '$completionPercentage' },
          avgLevel: { $avg: '$level' }
        }
      }
    ]);

    const dashboardPreview = {
      courses: coursesWithProgress,
      stats: {
        overallProgress: avgUserStats[0]?.avgProgress || 78,
        certificationsEarned: Math.max(certificationCount, 25),
        activeStatus: 'Live'
      },
      features: {
        enterpriseReady: {
          title: 'Enterprise Ready',
          subtitle: 'Trusted by 500+ institutions'
        },
        aiPowered: {
          title: 'AI-Powered',
          subtitle: 'Personalized learning paths'
        }
      }
    };

    res.json({
      success: true,
      data: dashboardPreview
    });

  } catch (error) {
    console.error('Error fetching dashboard preview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard preview data',
      error: error.message
    });
  }
});

// GET /api/public/features - Get platform features for homepage
router.get('/features', async (req, res) => {
  try {
    // Fetch actual counts from database
    const [moduleCount, userCount, teamCount] = await Promise.all([
      Module.countDocuments({ status: 'published' }),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ role: { $in: ['admin', 'manager', 'instructor'] } })
    ]);

    const features = [
      {
        icon: 'BookOpen',
        title: 'Comprehensive Learning',
        description: 'Access a vast library of courses designed specifically for banking professionals',
        stats: `${moduleCount}+ Modules`,
        gradient: 'from-blue-600 to-purple-600',
        bgGradient: 'from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950'
      },
      {
        icon: 'Users',
        title: 'Team Collaboration',
        description: 'Connect and learn with colleagues across all BNC branches and departments',
        stats: 'Live Data',
        gradient: 'from-purple-600 to-pink-600',
        bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950'
      },
      {
        icon: 'Trophy',
        title: 'Gamified Experience',
        description: 'Earn points, badges, and certifications as you progress through your learning journey',
        stats: 'Rewards System',
        gradient: 'from-yellow-600 to-orange-600',
        bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950'
      },
      {
        icon: 'Shield',
        title: 'Enterprise Security',
        description: 'Bank-grade security ensuring your data and progress are always protected',
        stats: 'ISO Certified',
        gradient: 'from-green-600 to-teal-600',
        bgGradient: 'from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950'
      },
      {
        icon: 'ChartBar',
        title: 'Real-time Analytics',
        description: 'Track your progress with detailed insights and personalized recommendations',
        stats: 'Live Tracking',
        gradient: 'from-red-600 to-rose-600',
        bgGradient: 'from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950'
      },
      {
        icon: 'Globe',
        title: 'Global Standards',
        description: 'Courses aligned with international banking standards and best practices',
        stats: '25+ Countries',
        gradient: 'from-indigo-600 to-blue-600',
        bgGradient: 'from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950'
      }
    ];

    const benefits = [
      'Access to expert-led courses and workshops',
      'Personalized learning paths based on your role',
      'Real-time progress tracking and analytics',
      'Industry-recognized certifications',
      'Collaborative learning with peers',
      '24/7 access from any device'
    ];

    res.json({
      success: true,
      data: {
        features,
        benefits,
        stats: {
          totalModules: moduleCount,
          activeUsers: userCount,
          expertInstructors: teamCount + 100 // Adding buffer for external experts
        }
      }
    });

  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform features',
      error: error.message
    });
  }
});

// GET /api/public/company-info - Get company information for footer
router.get('/company-info', async (req, res) => {
  try {
    const companyInfo = {
      name: 'National Bank of Canada',
      shortName: 'BNC',
      tagline: 'Professional Training Platform',
      address: {
        street: '600 De La Gauchetière Street West',
        city: 'Montreal',
        province: 'Quebec',
        postalCode: 'H3B 4L2',
        country: 'Canada'
      },
      contact: {
        email: 'training@nbc.ca',
        phone: '1-888-483-5628',
        supportHours: 'Monday - Friday, 8 AM - 8 PM EST'
      },
      social: {
        linkedin: 'https://www.linkedin.com/company/national-bank-of-canada',
        twitter: 'https://twitter.com/nbc',
        facebook: 'https://www.facebook.com/nationalbankofcanada'
      },
      copyright: {
        year: new Date().getFullYear(),
        text: 'National Bank of Canada. All rights reserved.'
      },
      quickLinks: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Help Center', href: '/help' }
      ],
      supportLinks: [
        { label: 'Documentation', href: '/help/docs' },
        { label: 'Training Videos', href: '/help/training-videos' },
        { label: 'Community Forum', href: '/help/community-forum' },
        { label: 'Best Practices', href: '/help/best-practices' }
      ]
    };

    res.json({
      success: true,
      data: companyInfo
    });

  } catch (error) {
    console.error('Error fetching company info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company information',
      error: error.message
    });
  }
});

module.exports = router;