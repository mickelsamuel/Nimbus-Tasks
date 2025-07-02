#!/usr/bin/env node

/**
 * Simple runner script for database population
 * Usage: npm run populate-db
 */

require('dotenv').config();
const populateDatabase = require('./populateDatabase');

console.log('🚀 BNC Training Platform - Database Population');
console.log('===============================================\n');

populateDatabase()
  .then(() => {
    console.log('\n✅ Database population completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database population failed:', error);
    process.exit(1);
  });