const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function addAvatarPortraitField() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bnc-training', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Find all users without avatarPortrait field
    const users = await User.find({ avatarPortrait: { $exists: false } });
    console.log(`Found ${users.length} users without avatarPortrait field`);

    let updatedCount = 0;

    for (const user of users) {
      // Generate portrait URL based on existing avatar fields
      let portraitUrl = null;

      if (user.avatar2D) {
        portraitUrl = user.avatar2D;
      } else if (user.avatar && user.avatar.includes('readyplayer.me')) {
        // Extract avatar ID and generate portrait URL
        const avatarId = user.avatar.match(/\/([a-zA-Z0-9]+)\.glb/)?.[1];
        if (avatarId) {
          portraitUrl = `https://api.readyplayer.me/v1/avatars/${avatarId}.png?scene=halfbody-portrait-v1`;
        } else {
          portraitUrl = user.avatar.replace('.glb', '.png');
        }
      } else if (user.avatar) {
        // For non-ReadyPlayerMe avatars, use the same URL
        portraitUrl = user.avatar;
      } else {
        // Default portrait
        portraitUrl = 'https://api.readyplayer.me/v1/avatars/65a8dba831b23abb4f401bae.png?scene=halfbody-portrait-v1';
      }

      // Update user with portrait URL
      user.avatarPortrait = portraitUrl;
      await user.save();
      updatedCount++;

      console.log(`Updated user ${user.email} with portrait: ${portraitUrl}`);
    }

    console.log(`\nMigration complete! Updated ${updatedCount} users with avatarPortrait field.`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

// Run the migration
addAvatarPortraitField();