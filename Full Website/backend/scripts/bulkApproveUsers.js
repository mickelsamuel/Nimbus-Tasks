#!/usr/bin/env node

/**
 * BNC Training Platform - Bulk User Approval Script
 * 
 * This script allows bulk approval of multiple users or all pending users.
 * Usage: 
 *   - node bulkApproveUsers.js --all                    (approve all pending)
 *   - node bulkApproveUsers.js --emails user1@bnc.ca,user2@bnc.ca
 *   - node bulkApproveUsers.js --department "IT"        (approve all pending in department)
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function bulkApproveUsers(options = {}) {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📊 MongoDB Connected');

    // Find the approver (admin)
    const approver = await User.findOne({ email: 'admin@bnc.ca', role: 'admin' });
    if (!approver) {
      console.error('❌ Admin user not found');
      return;
    }

    let query = { isApproved: false };
    let users = [];

    if (options.all) {
      // Approve all pending users
      users = await User.find(query);
      console.log(`📋 Found ${users.length} pending users for approval`);
    } else if (options.emails) {
      // Approve specific emails
      const emailList = options.emails.split(',').map(email => email.trim());
      users = await User.find({ 
        email: { $in: emailList },
        isApproved: false 
      });
      console.log(`📋 Found ${users.length} users to approve from email list`);
    } else if (options.department) {
      // Approve all pending users in department
      query.department = options.department;
      users = await User.find(query);
      console.log(`📋 Found ${users.length} pending users in ${options.department} department`);
    } else {
      console.error('❌ No approval criteria specified');
      return;
    }

    if (users.length === 0) {
      console.log('ℹ️ No users found matching the criteria');
      return;
    }

    console.log('\n📝 Users to be approved:');
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.firstName} ${user.lastName}) - ${user.department}`);
    });

    // Ask for confirmation in a real script (for now we'll proceed)
    console.log('\n⚡ Proceeding with bulk approval...\n');

    let approvedCount = 0;
    const results = [];

    for (const user of users) {
      try {
        // Approve the user
        user.isApproved = true;
        user.isActive = true;
        user.approvedBy = approver._id;
        user.approvedAt = new Date();
        
        // Add to account history
        user.accountHistory.push({
          action: 'BULK_APPROVED_BY_SCRIPT',
          timestamp: new Date(),
          ip: 'localhost',
          userAgent: 'bulk-approval-script'
        });

        await user.save();
        approvedCount++;

        console.log(`✅ Approved: ${user.email} (${user.firstName} ${user.lastName})`);
        results.push({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          status: 'approved'
        });

      } catch (error) {
        console.error(`❌ Failed to approve ${user.email}:`, error.message);
        results.push({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          status: 'failed',
          error: error.message
        });
      }
    }

    console.log('\n🎉 Bulk approval completed!');
    console.log(`   - Total users processed: ${users.length}`);
    console.log(`   - Successfully approved: ${approvedCount}`);
    console.log(`   - Failed: ${users.length - approvedCount}`);

    if (results.some(r => r.status === 'failed')) {
      console.log('\n❌ Failed approvals:');
      results
        .filter(r => r.status === 'failed')
        .forEach(r => console.log(`   - ${r.email}: ${r.error}`));
    }

  } catch (error) {
    console.error('❌ Error in bulk approval:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {};

if (args.includes('--all')) {
  options.all = true;
} else if (args.includes('--emails')) {
  const emailIndex = args.indexOf('--emails');
  options.emails = args[emailIndex + 1];
} else if (args.includes('--department')) {
  const deptIndex = args.indexOf('--department');
  options.department = args[deptIndex + 1];
}

if (Object.keys(options).length === 0) {
  console.log('📖 Usage: node bulkApproveUsers.js [options]');
  console.log('📖 Options:');
  console.log('   --all                                  Approve all pending users');
  console.log('   --emails user1@bnc.ca,user2@bnc.ca    Approve specific emails');
  console.log('   --department "IT"                      Approve all pending in department');
  console.log('');
  console.log('📖 Examples:');
  console.log('   node bulkApproveUsers.js --all');
  console.log('   node bulkApproveUsers.js --emails emily.jackson@bnc.ca,james.smith@bnc.ca');
  console.log('   node bulkApproveUsers.js --department "IT"');
  process.exit(1);
}

console.log('🚀 Starting bulk user approval process...');
console.log('⚙️ Options:', options);

bulkApproveUsers(options)
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });