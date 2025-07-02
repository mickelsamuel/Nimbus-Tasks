#!/usr/bin/env node

const connectDB = require('../config/database');
const Space = require('../models/Space');

// Sample spaces data
const spacesData = [
  {
    id: 'virtual-office',
    name: 'Virtual Office',
    description: 'Modern virtual office space for general work and collaboration',
    icon: 'Building2',
    environment: 'premium-corporate',
    primaryColor: '#E01A1A',
    atmosphere: 'Professional and focused workspace',
    ambientSound: 'Office ambiance',
    maxUsers: 50,
    currentUsers: 0,
    features: ['Video Conferencing', 'Screen Sharing', 'Whiteboard', 'Chat'],
    achievements: ['First Meeting', 'Team Player', 'Collaboration Master'],
    isPublic: true,
    allowedRoles: ['admin', 'manager', 'employee'],
    allowedDepartments: [],
    isActive: true,
    totalVisits: 245,
    totalTimeSpent: 12400,
    avgSessionDuration: 45,
    peakHour: '14:00',
    popularityScore: 85,
    activeUsers: [],
    settings: {
      allowVoiceChat: true,
      allowVideoChat: true,
      allowScreenShare: true,
      requirePermissionToJoin: false,
      enableNotifications: true
    }
  },
  {
    id: 'meeting-room-a',
    name: 'Meeting Room Alpha',
    description: 'Executive meeting room for presentations and formal discussions',
    icon: 'Users',
    environment: 'classical-elegant',
    primaryColor: '#2563EB',
    atmosphere: 'Elegant and professional meeting space',
    ambientSound: 'Quiet ambiance',
    maxUsers: 20,
    currentUsers: 0,
    features: ['Video Conferencing', 'Presentation Mode', 'Recording', 'Document Sharing'],
    achievements: ['Executive Presence', 'Great Presenter'],
    isPublic: true,
    allowedRoles: ['admin', 'manager', 'employee'],
    allowedDepartments: [],
    isActive: true,
    totalVisits: 156,
    totalTimeSpent: 8900,
    avgSessionDuration: 57,
    peakHour: '10:00',
    popularityScore: 78,
    activeUsers: [],
    settings: {
      allowVoiceChat: true,
      allowVideoChat: true,
      allowScreenShare: true,
      requirePermissionToJoin: false,
      enableNotifications: true
    }
  },
  {
    id: 'training-center',
    name: 'Training Center',
    description: 'Interactive learning space for workshops and training sessions',
    icon: 'GraduationCap',
    environment: 'futuristic-tech',
    primaryColor: '#7C3AED',
    atmosphere: 'Modern tech-enabled learning environment',
    ambientSound: 'Learning ambiance',
    maxUsers: 30,
    currentUsers: 0,
    features: ['Interactive Whiteboard', 'Screen Sharing', 'Breakout Rooms', 'Quiz Tools'],
    achievements: ['Eager Learner', 'Knowledge Seeker'],
    isPublic: true,
    allowedRoles: ['admin', 'manager', 'employee'],
    allowedDepartments: [],
    isActive: true,
    totalVisits: 189,
    totalTimeSpent: 15600,
    avgSessionDuration: 82,
    peakHour: '09:00',
    popularityScore: 92,
    activeUsers: [],
    settings: {
      allowVoiceChat: true,
      allowVideoChat: true,
      allowScreenShare: true,
      requirePermissionToJoin: false,
      enableNotifications: true
    }
  },
  {
    id: 'innovation-lab',
    name: 'Innovation Lab',
    description: 'Creative space for brainstorming and innovation projects',
    icon: 'Lightbulb',
    environment: 'cozy-modern',
    primaryColor: '#F59E0B',
    atmosphere: 'Creative and inspiring workspace',
    ambientSound: 'Creative ambiance',
    maxUsers: 25,
    currentUsers: 0,
    features: ['Digital Whiteboard', 'Mind Mapping', 'Collaboration Tools', 'Idea Voting'],
    achievements: ['Innovator', 'Creative Thinker'],
    isPublic: true,
    allowedRoles: ['admin', 'manager', 'employee'],
    allowedDepartments: [],
    isActive: true,
    totalVisits: 134,
    totalTimeSpent: 9800,
    avgSessionDuration: 73,
    peakHour: '15:00',
    popularityScore: 88,
    activeUsers: [],
    settings: {
      allowVoiceChat: true,
      allowVideoChat: true,
      allowScreenShare: true,
      requirePermissionToJoin: false,
      enableNotifications: true
    }
  },
  {
    id: 'wellness-lounge',
    name: 'Wellness Lounge',
    description: 'Relaxing space for breaks and informal conversations',
    icon: 'Heart',
    environment: 'natural-wellness',
    primaryColor: '#10B981',
    atmosphere: 'Calm and refreshing wellness environment',
    ambientSound: 'Nature sounds',
    maxUsers: 15,
    currentUsers: 0,
    features: ['Casual Chat', 'Relaxation Mode', 'Meditation Timer'],
    achievements: ['Zen Master', 'Wellness Advocate'],
    isPublic: true,
    allowedRoles: ['admin', 'manager', 'employee'],
    allowedDepartments: [],
    isActive: true,
    totalVisits: 98,
    totalTimeSpent: 4200,
    avgSessionDuration: 43,
    peakHour: '12:00',
    popularityScore: 72,
    activeUsers: [],
    settings: {
      allowVoiceChat: true,
      allowVideoChat: false,
      allowScreenShare: false,
      requirePermissionToJoin: false,
      enableNotifications: true
    }
  },
  {
    id: 'executive-boardroom',
    name: 'Executive Boardroom',
    description: 'Premium boardroom for senior leadership meetings',
    icon: 'Crown',
    environment: 'luxury-dining',
    primaryColor: '#991B1B',
    atmosphere: 'Exclusive executive meeting environment',
    ambientSound: 'Quiet executive ambiance',
    maxUsers: 12,
    currentUsers: 0,
    features: ['High-Quality Video', 'Premium Audio', 'Document Security', 'Executive Tools'],
    achievements: ['Executive Leader', 'Strategic Thinker'],
    isPublic: false,
    allowedRoles: ['admin', 'manager'],
    allowedDepartments: [],
    isActive: true,
    totalVisits: 67,
    totalTimeSpent: 5100,
    avgSessionDuration: 76,
    peakHour: '11:00',
    popularityScore: 95,
    activeUsers: [],
    settings: {
      allowVoiceChat: true,
      allowVideoChat: true,
      allowScreenShare: true,
      requirePermissionToJoin: true,
      enableNotifications: true
    }
  }
];

async function populateSpaces() {
  try {
    console.log('🌐 Starting spaces population...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing spaces
    await Space.deleteMany({});
    console.log('🗑️  Cleared existing spaces');
    
    // Create spaces
    const savedSpaces = await Space.insertMany(spacesData);
    console.log(`✅ Created ${savedSpaces.length} virtual spaces`);
    
    // Display created spaces
    savedSpaces.forEach(space => {
      console.log(`   🏢 ${space.name} - ${space.description}`);
    });
    
    console.log('\n🎉 Spaces population completed successfully!');
    
  } catch (error) {
    console.error('❌ Error populating spaces:', error);
    process.exit(1);
  } finally {
    console.log('\n🔌 Spaces population script completed.');
    process.exit(0);
  }
}

// Run the script if called directly
if (require.main === module) {
  populateSpaces();
}

module.exports = populateSpaces;