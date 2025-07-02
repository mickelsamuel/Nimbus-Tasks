#!/usr/bin/env node

/**
 * BNC Training Platform - User Approval Script
 * 
 * This script allows direct database updates to approve users.
 * Usage: node approveUser.js <email> [approver-email]
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function approveUser(userEmail, approverEmail = 'admin@bnc.ca') {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📊 MongoDB Connected');

    // Find the user to approve
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.error(`❌ User not found: ${userEmail}`);
      return;
    }

    // Find the approver (admin)
    const approver = await User.findOne({ email: approverEmail, role: 'admin' });
    if (!approver) {
      console.error(`❌ Approver not found or not admin: ${approverEmail}`);
      return;
    }

    // Check if already approved
    if (user.isApproved) {
      console.log(`✅ User ${userEmail} is already approved`);
      console.log(`   - Approved at: ${user.approvedAt}`);
      console.log(`   - Approved by: ${user.approvedBy}`);
      return;
    }

    // Approve the user
    user.isApproved = true;
    user.isActive = true;
    user.approvedBy = approver._id;
    user.approvedAt = new Date();
    
    // Add to account history
    user.accountHistory.push({
      action: 'APPROVED_BY_SCRIPT',
      timestamp: new Date(),
      ip: 'localhost',
      userAgent: 'approval-script'
    });

    await user.save();

    console.log('🎉 User approved successfully!');
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Name: ${user.firstName} ${user.lastName}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Department: ${user.department}`);
    console.log(`   - Approved by: ${approver.email}`);
    console.log(`   - Approved at: ${user.approvedAt}`);
    console.log(`   - Is Active: ${user.isActive}`);

  } catch (error) {
    console.error('❌ Error approving user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Script execution
const userEmail = process.argv[2];
const approverEmail = process.argv[3];

if (!userEmail) {
  console.log('📖 Usage: node approveUser.js <user-email> [approver-email]');
  console.log('📖 Example: node approveUser.js emily.jackson@bnc.ca admin@bnc.ca');
  console.log('📖 Default approver: admin@bnc.ca');
  process.exit(1);
}

console.log(`🚀 Starting user approval process...`);
console.log(`   - Target user: ${userEmail}`);
console.log(`   - Approver: ${approverEmail || 'admin@bnc.ca'}`);

approveUser(userEmail, approverEmail)
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });