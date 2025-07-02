#!/usr/bin/env node

/**
 * Script to fix database indexes before population
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');

async function fixIndexes() {
  try {
    console.log('🔧 Fixing database indexes...');
    
    // Connect to database
    await connectDB();
    
    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    try {
      // Drop the problematic index if it exists
      console.log('Dropping problematic activeSessions.sessionId index...');
      await usersCollection.dropIndex('activeSessions.sessionId_1');
      console.log('✅ Dropped activeSessions.sessionId_1 index');
    } catch (error) {
      if (error.code === 27 || error.codeName === 'IndexNotFound') {
        console.log('ℹ️  Index activeSessions.sessionId_1 does not exist, skipping...');
      } else {
        console.log('⚠️  Error dropping index:', error.message);
      }
    }
    
    // List all indexes to verify
    const indexes = await usersCollection.listIndexes().toArray();
    console.log('📋 Current indexes:');
    indexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('✅ Index fix completed');
    
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('📊 Database connection closed');
  }
}

// Run the script if called directly
if (require.main === module) {
  fixIndexes()
    .then(() => {
      console.log('✅ Index fix script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Index fix script failed:', error);
      process.exit(1);
    });
}

module.exports = fixIndexes;