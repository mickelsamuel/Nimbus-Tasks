#!/usr/bin/env node

/**
 * BNC Training Platform - MongoDB Interactive Shell
 * 
 * This script provides an interactive MongoDB shell specifically for user management.
 * It includes pre-built queries for common user approval tasks.
 */

const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

const User = require('../models/User');

class MongoShell {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async connect() {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📊 MongoDB Connected');
    console.log('🔗 Database:', process.env.MONGODB_URI?.split('/').pop());
  }

  async disconnect() {
    await mongoose.connection.close();
    this.rl.close();
    console.log('🔌 Database connection closed');
  }

  async executeQuery(queryName, params = {}) {
    const queries = {
      // List all pending users
      'pending': async () => {
        const users = await User.find({ 
          isApproved: false, 
          rejectedAt: { $exists: false }
        }, 'email firstName lastName department createdAt')
          .sort({ createdAt: -1 });
        
        console.log('\n📋 Pending Users:');
        users.forEach((user, i) => {
          console.log(`${i+1}. ${user.email} - ${user.firstName} ${user.lastName} (${user.department})`);
        });
        return users;
      },

      // Approve user by email
      'approve': async (email) => {
        if (!email) {
          console.log('❌ Email required. Usage: approve <email>');
          return;
        }
        
        const admin = await User.findOne({ role: 'admin', email: 'admin@bnc.ca' });
        const result = await User.updateOne(
          { email, isApproved: false },
          { 
            $set: { 
              isApproved: true, 
              isActive: true,
              approvedBy: admin?._id,
              approvedAt: new Date()
            },
            $push: {
              accountHistory: {
                action: 'APPROVED_VIA_MONGO_SHELL',
                timestamp: new Date(),
                ip: 'localhost',
                userAgent: 'mongo-shell'
              }
            }
          }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`✅ Approved user: ${email}`);
        } else {
          console.log(`❌ User not found or already approved: ${email}`);
        }
        return result;
      },

      // Get user details
      'user': async (email) => {
        if (!email) {
          console.log('❌ Email required. Usage: user <email>');
          return;
        }
        
        const user = await User.findOne({ email }, '-password');
        if (user) {
          console.log('\n👤 User Details:');
          console.log(`Email: ${user.email}`);
          console.log(`Name: ${user.firstName} ${user.lastName}`);
          console.log(`Role: ${user.role} | Department: ${user.department}`);
          console.log(`Approved: ${user.isApproved ? '✅' : '❌'} | Active: ${user.isActive ? '✅' : '❌'}`);
          console.log(`Created: ${user.createdAt}`);
          if (user.lastLogin) console.log(`Last Login: ${user.lastLogin}`);
        } else {
          console.log(`❌ User not found: ${email}`);
        }
        return user;
      },

      // Count users by status
      'stats': async () => {
        const [total, approved, pending, rejected] = await Promise.all([
          User.countDocuments(),
          User.countDocuments({ isApproved: true }),
          User.countDocuments({ isApproved: false, rejectedAt: { $exists: false } }),
          User.countDocuments({ rejectedAt: { $exists: true } })
        ]);
        
        console.log('\n📊 User Statistics:');
        console.log(`Total: ${total}`);
        console.log(`Approved: ${approved}`);
        console.log(`Pending: ${pending}`);
        console.log(`Rejected: ${rejected}`);
        return { total, approved, pending, rejected };
      },

      // Direct MongoDB query execution
      'query': async (mongoQuery) => {
        if (!mongoQuery) {
          console.log('❌ Query required. Usage: query <MongoDB query>');
          console.log('Example: query {"email": "test@bnc.ca"}');
          return;
        }
        
        try {
          const query = JSON.parse(mongoQuery);
          const results = await User.find(query, '-password').limit(10);
          console.log(`\n🔍 Query Results (${results.length}):`, results);
          return results;
        } catch (error) {
          console.log('❌ Invalid JSON query:', error.message);
        }
      },

      // Update user directly
      'update': async (email, updateData) => {
        if (!email || !updateData) {
          console.log('❌ Email and update data required');
          console.log('Usage: update <email> <JSON update>');
          console.log('Example: update test@bnc.ca {"isApproved": true}');
          return;
        }
        
        try {
          const update = JSON.parse(updateData);
          const result = await User.updateOne({ email }, { $set: update });
          
          if (result.modifiedCount > 0) {
            console.log(`✅ Updated user: ${email}`);
            console.log('Updated fields:', update);
          } else {
            console.log(`❌ User not found or no changes made: ${email}`);
          }
          return result;
        } catch (error) {
          console.log('❌ Invalid JSON update:', error.message);
        }
      }
    };

    if (queries[queryName]) {
      return await queries[queryName](params);
    } else {
      console.log(`❌ Unknown query: ${queryName}`);
      this.showHelp();
    }
  }

  showHelp() {
    console.log('\n📖 Available Commands:');
    console.log('  pending                     - List all pending users');
    console.log('  approve <email>            - Approve a user');
    console.log('  user <email>               - Show user details');
    console.log('  stats                      - Show user statistics');
    console.log('  query <JSON>               - Execute MongoDB query');
    console.log('  update <email> <JSON>      - Update user data');
    console.log('  help                       - Show this help');
    console.log('  exit                       - Exit shell');
    console.log('\nExamples:');
    console.log('  > pending');
    console.log('  > approve emily.jackson@bnc.ca');
    console.log('  > user emily.jackson@bnc.ca');
    console.log('  > query {"department": "IT"}');
    console.log('  > update test@bnc.ca {"role": "manager"}');
  }

  prompt() {
    return new Promise((resolve) => {
      this.rl.question('mongo> ', (input) => {
        resolve(input.trim());
      });
    });
  }

  async startInteractiveShell() {
    console.log('\n🚀 MongoDB Interactive Shell for BNC Training Platform');
    console.log('💡 Type "help" for available commands or "exit" to quit');
    
    while (true) {
      try {
        const input = await this.prompt();
        
        if (input === 'exit' || input === 'quit') {
          break;
        }
        
        if (input === 'help' || input === '') {
          this.showHelp();
          continue;
        }

        const [command, ...args] = input.split(' ');
        await this.executeQuery(command, args.join(' '));
        
      } catch (error) {
        console.log('❌ Error:', error.message);
      }
    }
  }
}

async function main() {
  const shell = new MongoShell();
  
  try {
    await shell.connect();
    
    // If command provided via args, execute it directly
    const command = process.argv[2];
    if (command) {
      const params = process.argv.slice(3).join(' ');
      await shell.executeQuery(command, params);
    } else {
      // Start interactive shell
      await shell.startInteractiveShell();
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await shell.disconnect();
  }
}

main().catch(console.error);