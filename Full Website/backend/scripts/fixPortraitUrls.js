const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function fixPortraitUrls() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bnc-training', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Find all users with the old portrait URL format
    const users = await User.find({ 
      avatarPortrait: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png'
    });
    
    console.log(`Found ${users.length} users with old portrait URL format`);

    let updatedCount = 0;
    const defaultAvatarId = '65a8dba831b23abb4f401bae';
    const newPortraitUrl = `https://api.readyplayer.me/v1/avatars/${defaultAvatarId}.png?scene=halfbody-portrait-v1`;

    for (const user of users) {
      user.avatarPortrait = newPortraitUrl;
      await user.save();
      updatedCount++;
      
      if (updatedCount % 10 === 0) {
        console.log(`Updated ${updatedCount} users...`);
      }
    }

    console.log(`\nMigration complete! Updated ${updatedCount} users with correct portrait URL.`);
    console.log(`New portrait URL: ${newPortraitUrl}`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

// Run the migration
fixPortraitUrls();