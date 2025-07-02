#!/usr/bin/env node

/**
 * Basic Database Population Script
 * Creates core data: Users, Teams, Achievements, and basic relationships
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const { User, Team, Achievement } = require('../models');

// Configuration
const CONFIG = {
  USERS_COUNT: 150,
  TEAMS_COUNT: 20,
  ACHIEVEMENTS_COUNT: 100
};

// Sample data
const DEPARTMENTS = [
  'Customer Service', 'IT', 'Human Resources', 'Finance', 'Marketing',
  'Operations', 'Sales', 'Risk Management', 'Investment Banking', 'Retail Banking'
];

// const CITIES = ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'];
// const PROVINCES = ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'];
const FIRST_NAMES = ['James', 'Sarah', 'Michael', 'Emily', 'Robert', 'Jessica', 'William', 'Ashley'];
const LAST_NAMES = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White'];

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateUniqueEmail(firstName, lastName, existingEmails) {
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
  let email = `${cleanFirst}.${cleanLast}@bnc.ca`;
  let counter = 1;
  
  while (existingEmails.has(email)) {
    email = `${cleanFirst}.${cleanLast}${counter}@bnc.ca`;
    counter++;
  }
  
  return email;
}

function getUserFlowState() {
  const states = [
    { hasPolicyAccepted: false, selectedMode: null, hasCompletedAvatarSetup: false },
    { hasPolicyAccepted: true, selectedMode: null, hasCompletedAvatarSetup: false },
    { hasPolicyAccepted: true, selectedMode: randomChoice(['gamified', 'standard']), hasCompletedAvatarSetup: false },
    { hasPolicyAccepted: true, selectedMode: randomChoice(['gamified', 'standard']), hasCompletedAvatarSetup: true }
  ];
  
  const weights = [0.1, 0.1, 0.2, 0.6];
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return states[i];
    }
  }
  
  return states[states.length - 1];
}

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...');
  await User.deleteMany({});
  await Team.deleteMany({});
  await Achievement.deleteMany({});
  console.log('✅ Database cleared');
}

async function createUsers() {
  console.log('👥 Creating users...');
  
  const users = [];
  const emails = new Set();
  
  // Admin user
  const adminEmail = 'admin@bnc.ca';
  const adminUser = new User({
    email: adminEmail,
    password: 'Admin123!',
    firstName: 'System',
    lastName: 'Administrator',
    department: 'IT',
    role: 'admin',
    employeeId: 'ADM001',
    isEmailVerified: true,
    hasPolicyAccepted: true,
    selectedMode: 'standard',
    hasCompletedAvatarSetup: true,
    stats: {
      totalPoints: 50000,
      level: 15,
      xp: 270000,
      rank: 'Master'
    },
    currency: { coins: 15000, tokens: 200, premiumCoins: 50 }
  });
  
  users.push(adminUser);
  emails.add(adminEmail);
  
  // Manager users
  for (let i = 0; i < 15; i++) {
    const firstName = randomChoice(FIRST_NAMES);
    const lastName = randomChoice(LAST_NAMES);
    const department = randomChoice(DEPARTMENTS);
    const email = generateUniqueEmail(firstName, lastName, emails);
    emails.add(email);
    
    const flowState = getUserFlowState();
    
    const manager = new User({
      email,
      password: 'Manager123!',
      firstName,
      lastName,
      department,
      role: 'manager',
      employeeId: `MGR${String(i + 1).padStart(3, '0')}`,
      isEmailVerified: Math.random() > 0.1,
      ...flowState,
      stats: {
        totalPoints: randomBetween(10000, 40000),
        level: randomBetween(8, 14),
        xp: randomBetween(8500, 200000),
        streak: randomBetween(5, 30),
        rank: randomChoice(['Advanced', 'Expert', 'Master'])
      },
      currency: {
        coins: randomBetween(5000, 12000),
        tokens: randomBetween(50, 150),
        premiumCoins: randomBetween(10, 40)
      },
      createdAt: randomDate(new Date(2023, 0, 1), new Date())
    });
    
    users.push(manager);
  }
  
  // Employee users
  for (let i = 0; i < CONFIG.USERS_COUNT - 16; i++) {
    const firstName = randomChoice(FIRST_NAMES);
    const lastName = randomChoice(LAST_NAMES);
    const department = randomChoice(DEPARTMENTS);
    const email = generateUniqueEmail(firstName, lastName, emails);
    emails.add(email);
    
    const flowState = getUserFlowState();
    
    const user = new User({
      email,
      password: 'Employee123!',
      firstName,
      lastName,
      department,
      role: 'employee',
      employeeId: `EMP${String(i + 1).padStart(3, '0')}`,
      isEmailVerified: Math.random() > 0.15,
      ...flowState,
      stats: {
        totalPoints: randomBetween(0, 25000),
        level: randomBetween(1, 12),
        xp: randomBetween(0, 160000),
        streak: randomBetween(0, 25),
        rank: randomChoice(['Novice', 'Beginner', 'Intermediate', 'Advanced'])
      },
      currency: {
        coins: randomBetween(500, 8000),
        tokens: randomBetween(10, 100),
        premiumCoins: randomBetween(0, 25)
      },
      createdAt: randomDate(new Date(2023, 6, 1), new Date())
    });
    
    users.push(user);
  }
  
  // Save users individually to trigger password hashing middleware
  const savedUsers = [];
  for (const user of users) {
    const savedUser = await user.save();
    savedUsers.push(savedUser);
  }
  console.log(`✅ Created ${savedUsers.length} users`);
  return savedUsers;
}

async function createAchievements() {
  console.log('🏆 Creating achievements...');
  
  const categories = ['Learning', 'Social', 'Progress', 'Leadership', 'Completion', 'Streak'];
  const achievements = [];
  
  for (let i = 0; i < CONFIG.ACHIEVEMENTS_COUNT; i++) {
    const category = randomChoice(categories);
    const tier = randomChoice(['bronze', 'silver', 'gold', 'platinum']);
    
    const achievement = new Achievement({
      title: `${category} ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
      name: `${category} ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
      description: `Outstanding performance in ${category.toLowerCase()} activities.`,
      icon: `fa-${category.toLowerCase()}`,
      category,
      type: randomChoice(['individual', 'team', 'global']),
      tier,
      rarity: randomChoice(['common', 'uncommon', 'rare', 'epic']),
      criteria: {
        type: randomChoice(['modules_completed', 'points_earned', 'streak_days']),
        target: randomBetween(1, 50),
        timeframe: randomChoice(['weekly', 'monthly', 'all_time'])
      },
      rewards: {
        points: randomBetween(100, 1000),
        xp: randomBetween(200, 2000),
        coins: randomBetween(50, 500),
        tokens: randomBetween(5, 50)
      },
      isActive: true
    });
    
    achievements.push(achievement);
  }
  
  const savedAchievements = await Achievement.insertMany(achievements);
  console.log(`✅ Created ${savedAchievements.length} achievements`);
  return savedAchievements;
}

async function createTeams(users) {
  console.log('👥 Creating teams...');
  
  const teamNames = [
    'Digital Innovators', 'Customer Champions', 'Risk Masters', 'Compliance Guardians',
    'Investment Eagles', 'Retail Banking Stars', 'Tech Pioneers', 'Sales Achievers',
    'Operations Excellence', 'Leadership Circle'
  ];
  
  const managers = users.filter(user => user.role === 'manager');
  const employees = users.filter(user => user.role === 'employee');
  const teams = [];
  const usedNames = new Set();
  
  for (let i = 0; i < CONFIG.TEAMS_COUNT; i++) {
    const leader = randomChoice(managers);
    const department = leader.department;
    
    let teamName = randomChoice(teamNames);
    while (usedNames.has(teamName)) {
      teamName = randomChoice(teamNames) + ` ${randomBetween(1, 99)}`;
    }
    usedNames.add(teamName);
    
    // Select team members
    const memberCount = randomBetween(5, 12);
    const deptEmployees = employees.filter(emp => emp.department === department);
    const selectedMembers = [];
    
    for (let j = 0; j < Math.min(memberCount, deptEmployees.length); j++) {
      const member = deptEmployees[j];
      if (member) {
        selectedMembers.push({
          userId: member._id,
          joinedAt: randomDate(new Date(2023, 6, 1), new Date()),
          role: 'member',
          status: 'active'
        });
      }
    }
    
    const team = new Team({
      name: teamName,
      description: `High-performing team focused on ${department.toLowerCase()} excellence.`,
      department,
      category: randomChoice(['Project', 'Learning Group', 'Social', 'Competition']),
      leader: leader._id,
      members: selectedMembers,
      stats: {
        memberCount: selectedMembers.length + 1,
        totalPoints: randomBetween(1000, 20000),
        rank: randomBetween(1, 100),
        level: randomBetween(1, 10)
      },
      isActive: true
    });
    
    teams.push(team);
  }
  
  const savedTeams = await Team.insertMany(teams);
  console.log(`✅ Created ${savedTeams.length} teams`);
  return savedTeams;
}

async function populateBasicDatabase() {
  try {
    console.log('🚀 Starting basic database population...');
    
    await connectDB();
    await clearDatabase();
    
    const users = await createUsers();
    const achievements = await createAchievements();
    const teams = await createTeams(users);
    
    console.log('\n🎉 Basic database population completed!');
    console.log('📈 Summary:');
    console.log(`   👥 Users: ${users.length} (1 admin, 15 managers, ${users.length - 16} employees)`);
    console.log(`   🏆 Achievements: ${achievements.length}`);
    console.log(`   👥 Teams: ${teams.length}`);
    
    console.log('\n🔑 Test Accounts:');
    console.log('   Admin: admin@bnc.ca (password: Admin123!)');
    console.log('   Managers: *.bnc.ca (password: Manager123!)');
    console.log('   Employees: *.bnc.ca (password: Employee123!)');
    
    console.log('\n✅ Database is ready for testing!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  populateBasicDatabase();
}

module.exports = populateBasicDatabase;