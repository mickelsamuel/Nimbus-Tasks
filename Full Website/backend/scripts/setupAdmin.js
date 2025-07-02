#!/usr/bin/env node

/**
 * BNC Training Platform - Admin Setup Script
 * 
 * This script ensures there's always an active admin user and can:
 * - Create the primary admin user
 * - Reset admin password
 * - Create additional admin users
 * - List all admin users
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function setupAdmin(action, options = {}) {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📊 MongoDB Connected');

    switch (action) {
      case 'create':
        await createAdmin(options);
        break;
      case 'reset':
        await resetAdminPassword(options);
        break;
      case 'list':
        await listAdmins();
        break;
      case 'ensure':
        await ensureAdmin();
        break;
      default:
        console.log('❌ Unknown action. Use: create, reset, list, or ensure');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

async function createAdmin(options) {
  const {
    email = 'admin@bnc.ca',
    password = 'Admin123!',
    firstName = 'System',
    lastName = 'Administrator',
    department = 'IT'
  } = options;

  console.log(`🔧 Creating admin user: ${email}`);

  // Check if admin already exists
  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    console.log(`⚠️ User with email ${email} already exists`);
    
    if (!existingAdmin.role === 'admin') {
      // Promote to admin
      existingAdmin.role = 'admin';
      existingAdmin.isApproved = true;
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log(`✅ Promoted ${email} to admin role`);
    } else {
      console.log(`ℹ️ ${email} is already an admin`);
    }
    return;
  }

  // Create new admin
  const adminUser = new User({
    email,
    password, // Will be hashed by pre-save middleware
    firstName,
    lastName,
    department,
    role: 'admin',
    employeeId: 'ADM001',
    jobTitle: 'System Administrator',
    isEmailVerified: true,
    isApproved: true,
    isActive: true,
    hasPolicyAccepted: true,
    selectedMode: 'standard',
    hasCompletedAvatarSetup: true,
    phoneNumber: '416-555-0001',
    location: {
      city: 'Toronto',
      province: 'Ontario',
      country: 'Canada'
    },
    bio: 'System administrator responsible for platform management and technical operations.',
    stats: {
      totalPoints: 50000,
      level: 15,
      xp: 270000,
      xpToNextLevel: 999999,
      streak: 45,
      bestStreak: 67,
      modulesCompleted: 25,
      achievementsUnlocked: 35,
      totalLearningTime: 2400,
      rank: 'Master'
    },
    currency: {
      coins: 15000,
      tokens: 200
    },
    accountHistory: [{
      action: 'ADMIN_CREATED_BY_SCRIPT',
      timestamp: new Date(),
      ip: 'localhost',
      userAgent: 'admin-setup-script'
    }]
  });

  await adminUser.save();

  console.log('🎉 Admin user created successfully!');
  console.log(`   - Email: ${email}`);
  console.log(`   - Password: ${password}`);
  console.log(`   - Name: ${firstName} ${lastName}`);
  console.log(`   - Role: admin`);
  console.log(`   - Department: ${department}`);
  console.log('⚠️ Please change the default password after first login!');
}

async function resetAdminPassword(options) {
  const { email = 'admin@bnc.ca', newPassword = 'Admin123!' } = options;

  console.log(`🔑 Resetting password for admin: ${email}`);

  const admin = await User.findOne({ email, role: 'admin' });
  if (!admin) {
    console.log(`❌ Admin user not found: ${email}`);
    return;
  }

  admin.password = newPassword; // Will be hashed by pre-save middleware
  admin.accountHistory.push({
    action: 'PASSWORD_RESET_BY_SCRIPT',
    timestamp: new Date(),
    ip: 'localhost',
    userAgent: 'admin-setup-script'
  });

  await admin.save();

  console.log('✅ Admin password reset successfully!');
  console.log(`   - Email: ${email}`);
  console.log(`   - New Password: ${newPassword}`);
  console.log('⚠️ Please change this password after login!');
}

async function listAdmins() {
  console.log('👑 Current Admin Users:');
  console.log('=' .repeat(60));

  const admins = await User.find({ role: 'admin' }).sort({ createdAt: 1 });

  if (admins.length === 0) {
    console.log('❌ No admin users found!');
    console.log('💡 Run: node setupAdmin.js ensure');
    return;
  }

  admins.forEach((admin, index) => {
    const lastLogin = admin.lastLogin ? admin.lastLogin.toLocaleDateString() : 'Never';
    const status = admin.isActive ? '✅ Active' : '❌ Inactive';
    
    console.log(`${index + 1}. ${admin.email} - ${status}`);
    console.log(`   Name: ${admin.firstName} ${admin.lastName}`);
    console.log(`   Department: ${admin.department}`);
    console.log(`   Last Login: ${lastLogin}`);
    console.log(`   Created: ${admin.createdAt.toLocaleDateString()}`);
    console.log(`   Approved: ${admin.isApproved ? '✅' : '❌'}`);
    console.log('');
  });

  console.log(`Total admin users: ${admins.length}`);
}

async function ensureAdmin() {
  console.log('🔍 Checking for admin users...');

  const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
  
  if (adminCount === 0) {
    console.log('⚠️ No active admin users found! Creating default admin...');
    await createAdmin({});
  } else {
    console.log(`✅ Found ${adminCount} active admin user(s)`);
    await listAdmins();
  }
}

// Parse command line arguments
const action = process.argv[2];
const args = process.argv.slice(3);

// Parse additional options
const options = {};
for (let i = 0; i < args.length; i += 2) {
  if (args[i] && args[i].startsWith('--')) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    if (value && !value.startsWith('--')) {
      options[key] = value;
    }
  }
}

if (!action) {
  console.log('📖 BNC Training Platform - Admin Setup');
  console.log('');
  console.log('Available commands:');
  console.log('  ensure                           Ensure at least one admin exists');
  console.log('  create                          Create new admin user');
  console.log('  reset                           Reset admin password');
  console.log('  list                            List all admin users');
  console.log('');
  console.log('Options for create/reset:');
  console.log('  --email <email>                 Admin email (default: admin@bnc.ca)');
  console.log('  --password <password>           Admin password (default: Admin123!)');
  console.log('  --firstName <name>              First name (default: System)');
  console.log('  --lastName <name>               Last name (default: Administrator)');
  console.log('  --department <dept>             Department (default: IT)');
  console.log('');
  console.log('Examples:');
  console.log('  node setupAdmin.js ensure');
  console.log('  node setupAdmin.js create --email admin@bnc.ca --password NewPass123!');
  console.log('  node setupAdmin.js reset --email admin@bnc.ca --password NewPass123!');
  console.log('  node setupAdmin.js list');
  process.exit(1);
}

console.log(`🚀 Starting admin setup: ${action}`);
if (Object.keys(options).length > 0) {
  console.log('⚙️ Options:', options);
}

setupAdmin(action, options)
  .then(() => {
    console.log('✅ Admin setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Admin setup failed:', error);
    process.exit(1);
  });