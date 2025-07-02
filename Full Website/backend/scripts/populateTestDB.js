#!/usr/bin/env node

/**
 * Test version of database population script using in-memory MongoDB
 * This version can be run without requiring MongoDB to be installed
 */

process.env.USE_MEMORY_DB = 'true'; // Force in-memory database

const populateDatabase = require('./populateDatabase');

console.log('🧪 BNC Training Platform - Test Database Population');
console.log('Using in-memory MongoDB for testing...');
console.log('===============================================\n');

populateDatabase()
  .then(() => {
    console.log('\n✅ Test database population completed successfully!');
    console.log('📝 Note: This was using an in-memory database for testing.');
    console.log('🚀 To populate your actual database, ensure MongoDB is running and use:');
    console.log('   npm run populate-db');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test database population failed:', error);
    process.exit(1);
  });