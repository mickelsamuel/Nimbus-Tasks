#!/usr/bin/env node

/**
 * BNC Training Platform - User Status Management Script
 * 
 * This script provides comprehensive user status management including:
 * - List pending users
 * - Approve/reject users
 * - View user details
 * - Search users by various criteria
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

class UserStatusManager {
  async connect() {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📊 MongoDB Connected');
  }

  async disconnect() {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }

  async listPendingUsers() {
    console.log('\n📋 Pending Users (Awaiting Approval):');
    console.log('=' .repeat(80));
    
    const pendingUsers = await User.find({ 
      isApproved: false,
      rejectedAt: { $exists: false }
    }).sort({ createdAt: -1 });

    if (pendingUsers.length === 0) {
      console.log('✅ No pending users found');
      return;
    }

    pendingUsers.forEach((user, index) => {
      const days = Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24));
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   Role: ${user.role} | Department: ${user.department}`);
      console.log(`   Manager: ${user.managerEmail || 'Not specified'}`);
      console.log(`   Registered: ${user.createdAt.toLocaleDateString()} (${days} days ago)`);
      console.log(`   ID: ${user._id}`);
      console.log('');
    });

    console.log(`Total pending users: ${pendingUsers.length}`);
  }

  async getUserDetails(email) {
    console.log(`\n🔍 User Details for: ${email}`);
    console.log('=' .repeat(50));

    const user = await User.findOne({ email })
      .populate('manager', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName email');

    if (!user) {
      console.log('❌ User not found');
      return null;
    }

    console.log(`Name: ${user.firstName} ${user.lastName}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Department: ${user.department}`);
    console.log(`Employee ID: ${user.employeeId || 'Not set'}`);
    console.log(`Manager: ${user.manager ? `${user.manager.firstName} ${user.manager.lastName} (${user.manager.email})` : user.managerEmail || 'Not specified'}`);
    console.log(`Registered: ${user.createdAt.toLocaleDateString()}`);
    console.log(`Last Login: ${user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}`);
    console.log('');
    console.log('Status:');
    console.log(`  Active: ${user.isActive ? '✅' : '❌'}`);
    console.log(`  Approved: ${user.isApproved ? '✅' : '❌'}`);
    console.log(`  Email Verified: ${user.isEmailVerified ? '✅' : '❌'}`);
    
    if (user.isApproved && user.approvedBy) {
      console.log(`  Approved by: ${user.approvedBy.firstName} ${user.approvedBy.lastName} on ${user.approvedAt.toLocaleDateString()}`);
    }
    
    if (user.rejectedAt) {
      console.log(`  Rejected: ${user.rejectedAt.toLocaleDateString()}`);
      console.log(`  Rejection Reason: ${user.rejectionReason}`);
    }

    console.log('');
    console.log('Flow Progress:');
    console.log(`  Policy Accepted: ${user.hasPolicyAccepted ? '✅' : '❌'}`);
    console.log(`  Mode Selected: ${user.selectedMode || 'Not selected'}`);
    console.log(`  Avatar Setup: ${user.hasCompletedAvatarSetup ? '✅' : '❌'}`);

    console.log('');
    console.log('Stats:');
    console.log(`  Level: ${user.stats.level} | Points: ${user.stats.totalPoints}`);
    console.log(`  XP: ${user.stats.xp} | Rank: ${user.stats.rank || 'Novice'}`);
    console.log(`  Modules Completed: ${user.stats.modulesCompleted}`);
    console.log(`  Current Streak: ${user.stats.streak} days`);

    return user;
  }

  async approveUser(email) {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return false;
    }

    if (user.isApproved) {
      console.log(`✅ User ${email} is already approved`);
      return true;
    }

    const approver = await User.findOne({ email: 'admin@bnc.ca', role: 'admin' });
    if (!approver) {
      console.log('❌ Admin user not found for approval');
      return false;
    }

    user.isApproved = true;
    user.isActive = true;
    user.approvedBy = approver._id;
    user.approvedAt = new Date();
    
    user.accountHistory.push({
      action: 'APPROVED_BY_MANAGEMENT_SCRIPT',
      timestamp: new Date(),
      ip: 'localhost',
      userAgent: 'user-management-script'
    });

    await user.save();
    console.log(`✅ User approved: ${email}`);
    return true;
  }

  async searchUsers(criteria = {}) {
    console.log('\n🔍 Search Results:');
    console.log('=' .repeat(60));

    const query = {};
    
    if (criteria.department) {
      query.department = new RegExp(criteria.department, 'i');
    }
    if (criteria.role) {
      query.role = criteria.role;
    }
    if (criteria.status === 'pending') {
      query.isApproved = false;
      query.rejectedAt = { $exists: false };
    } else if (criteria.status === 'approved') {
      query.isApproved = true;
    } else if (criteria.status === 'rejected') {
      query.rejectedAt = { $exists: true };
    }
    if (criteria.name) {
      query.$or = [
        { firstName: new RegExp(criteria.name, 'i') },
        { lastName: new RegExp(criteria.name, 'i') }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 }).limit(50);

    if (users.length === 0) {
      console.log('No users found matching criteria');
      return;
    }

    users.forEach((user, index) => {
      const status = user.isApproved ? '✅ Approved' : 
                    user.rejectedAt ? '❌ Rejected' : '⏳ Pending';
      
      console.log(`${index + 1}. ${user.email} - ${status}`);
      console.log(`   ${user.firstName} ${user.lastName} | ${user.role} | ${user.department}`);
      console.log(`   Registered: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    console.log(`Found ${users.length} users (showing first 50)`);
  }

  async getStats() {
    console.log('\n📊 User Statistics:');
    console.log('=' .repeat(40));

    const [total, approved, pending, rejected, active] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isApproved: true }),
      User.countDocuments({ isApproved: false, rejectedAt: { $exists: false } }),
      User.countDocuments({ rejectedAt: { $exists: true } }),
      User.countDocuments({ isActive: true })
    ]);

    console.log(`Total Users: ${total}`);
    console.log(`Approved: ${approved} (${Math.round((approved/total)*100)}%)`);
    console.log(`Pending: ${pending} (${Math.round((pending/total)*100)}%)`);
    console.log(`Rejected: ${rejected} (${Math.round((rejected/total)*100)}%)`);
    console.log(`Active: ${active} (${Math.round((active/total)*100)}%)`);

    // Department breakdown
    const deptStats = await User.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\nUsers by Department:');
    deptStats.forEach(dept => {
      console.log(`  ${dept._id}: ${dept.count}`);
    });

    // Role breakdown
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\nUsers by Role:');
    roleStats.forEach(role => {
      console.log(`  ${role._id}: ${role.count}`);
    });
  }
}

// CLI Interface
async function main() {
  const manager = new UserStatusManager();
  const command = process.argv[2];
  const args = process.argv.slice(3);

  try {
    await manager.connect();

    switch (command) {
      case 'list':
      case 'pending':
        await manager.listPendingUsers();
        break;

      case 'details':
        if (!args[0]) {
          console.log('❌ Email required. Usage: node manageUserStatus.js details <email>');
          break;
        }
        await manager.getUserDetails(args[0]);
        break;

      case 'approve':
        if (!args[0]) {
          console.log('❌ Email required. Usage: node manageUserStatus.js approve <email>');
          break;
        }
        await manager.approveUser(args[0]);
        break;

      case 'search':
        const criteria = {};
        for (let i = 0; i < args.length; i += 2) {
          if (args[i] && args[i + 1]) {
            criteria[args[i].replace('--', '')] = args[i + 1];
          }
        }
        await manager.searchUsers(criteria);
        break;

      case 'stats':
        await manager.getStats();
        break;

      default:
        console.log('📖 BNC Training Platform - User Status Management');
        console.log('');
        console.log('Available commands:');
        console.log('  list, pending                    List all pending users');
        console.log('  details <email>                  Show detailed user information');
        console.log('  approve <email>                  Approve a specific user');
        console.log('  stats                           Show user statistics');
        console.log('  search --key value              Search users by criteria');
        console.log('');
        console.log('Search options:');
        console.log('  --department <name>             Filter by department');
        console.log('  --role <role>                   Filter by role (employee/manager/admin)');
        console.log('  --status <status>               Filter by status (pending/approved/rejected)');
        console.log('  --name <name>                   Search by first or last name');
        console.log('');
        console.log('Examples:');
        console.log('  node manageUserStatus.js list');
        console.log('  node manageUserStatus.js details emily.jackson@bnc.ca');
        console.log('  node manageUserStatus.js approve emily.jackson@bnc.ca');
        console.log('  node manageUserStatus.js search --department IT --status pending');
        console.log('  node manageUserStatus.js stats');
        break;
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await manager.disconnect();
  }
}

main().catch(console.error);