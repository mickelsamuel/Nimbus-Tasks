const mongoose = require('mongoose');
require('dotenv').config();

// Import models to register schemas
require('../models/User');
require('../models/Module');
require('../models/Team');
require('../models/Achievement');
require('../models/Notification');
require('../models/Event');
require('../models/Space');
require('../models/Challenge');
require('../models/ShopItem');
require('../models/SupportTicket');
require('../models/SupportChat');
require('../models/Message');
require('../models/TeamMessage');
require('../models/ModuleDiscussion');
require('../models/Portfolio');
require('../models/MarketData');
require('../models/Leaderboard');
require('../models/AuditLog');
require('../models/ForumPost');
require('../models/ForumComment');
require('../models/FAQ');
require('../models/SupportResource');
require('../models/AvatarShare');
require('../models/AvatarAnalytics');
require('../models/UserPurchase');
require('../models/ChallengeSubmission');

async function createIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Creating database indexes...');
    const startTime = Date.now();

    // Get all registered models
    const modelNames = mongoose.modelNames();
    console.log(`Found ${modelNames.length} models:`, modelNames.join(', '));

    let totalIndexes = 0;
    let errors = [];

    for (const modelName of modelNames) {
      try {
        console.log(`\nProcessing model: ${modelName}`);
        const Model = mongoose.model(modelName);
        
        // Create indexes for this model
        const indexResult = await Model.createIndexes();
        const indexCount = indexResult.length || Object.keys(indexResult).length || 0;
        
        console.log(`  ✓ Created ${indexCount} indexes for ${modelName}`);
        totalIndexes += indexCount;

        // List existing indexes
        const indexes = await Model.collection.getIndexes();
        console.log(`  📋 Total indexes for ${modelName}:`, Object.keys(indexes).length);
        
        // Show index details
        for (const [indexName, indexDef] of Object.entries(indexes)) {
          if (indexName !== '_id_') {
            const keys = Object.keys(indexDef.key || {}).join(', ');
            const options = [];
            if (indexDef.unique) options.push('unique');
            if (indexDef.sparse) options.push('sparse');
            if (indexDef.background) options.push('background');
            if (indexDef.expireAfterSeconds) options.push(`ttl:${indexDef.expireAfterSeconds}s`);
            
            const optionsStr = options.length ? ` (${options.join(', ')})` : '';
            console.log(`    - ${indexName}: ${keys}${optionsStr}`);
          }
        }
        
      } catch (error) {
        console.error(`  ❌ Error creating indexes for ${modelName}:`, error.message);
        errors.push({ model: modelName, error: error.message });
      }
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log('\n' + '='.repeat(60));
    console.log('INDEX CREATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Total models processed: ${modelNames.length}`);
    console.log(`✅ Total indexes created: ${totalIndexes}`);
    console.log(`⏱️  Duration: ${duration.toFixed(2)}s`);
    
    if (errors.length > 0) {
      console.log(`\n❌ Errors encountered: ${errors.length}`);
      errors.forEach(({ model, error }) => {
        console.log(`  - ${model}: ${error}`);
      });
    } else {
      console.log('\n🎉 All indexes created successfully!');
    }

    // Verify critical indexes exist
    console.log('\n' + '='.repeat(60));
    console.log('VERIFYING CRITICAL INDEXES');
    console.log('='.repeat(60));
    
    const criticalIndexes = [
      { model: 'User', field: 'email' },
      { model: 'User', field: 'department' },
      { model: 'Module', field: 'category' },
      { model: 'Module', field: 'status' },
      { model: 'Team', field: 'department' },
      { model: 'Achievement', field: 'category' },
      { model: 'Notification', field: 'userId' },
      { model: 'Event', field: 'department' }
    ];

    for (const { model, field } of criticalIndexes) {
      try {
        if (modelNames.includes(model)) {
          const Model = mongoose.model(model);
          const indexes = await Model.collection.getIndexes();
          const hasIndex = Object.values(indexes).some(index => 
            index.key && Object.keys(index.key).includes(field)
          );
          
          if (hasIndex) {
            console.log(`✅ ${model}.${field} index exists`);
          } else {
            console.log(`⚠️  ${model}.${field} index missing`);
          }
        }
      } catch (error) {
        console.log(`❌ ${model}.${field} verification failed:`, error.message);
      }
    }

    console.log('\n📊 Database Index Analysis Complete');
    
  } catch (error) {
    console.error('Fatal error creating indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  console.log('🚀 Starting MongoDB Index Creation Script');
  console.log('Database URI:', process.env.MONGODB_URI ? 'Configured' : 'Missing');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    process.exit(1);
  }
  
  createIndexes();
}

module.exports = createIndexes;