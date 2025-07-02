const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function updateAvatarPortraits() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);

    let updated = 0;
    let errors = 0;

    for (const user of users) {
      try {
        let needsUpdate = false;
        
        // Check if user has a ReadyPlayerMe avatar
        if (user.avatar && user.avatar.includes('readyplayer.me')) {
          const avatarId = user.avatar.match(/\/([a-zA-Z0-9]+)\.glb/)?.[1];
          if (avatarId) {
            // Update to use high-quality 2D with proper parameters
            const newPortraitUrl = `https://models.readyplayer.me/${avatarId}.png?textureAtlas=2048&morphTargets=ARKit`;
            
            if (user.avatarPortrait !== newPortraitUrl) {
              user.avatarPortrait = newPortraitUrl;
              needsUpdate = true;
            }
          }
        }
        
        // Check if user has a 3D avatar field
        if (user.avatar3D && user.avatar3D.includes('readyplayer.me')) {
          const avatarId = user.avatar3D.match(/\/([a-zA-Z0-9]+)\.glb/)?.[1];
          if (avatarId) {
            // Update to use high-quality 2D with proper parameters
            const newPortraitUrl = `https://models.readyplayer.me/${avatarId}.png?textureAtlas=2048&morphTargets=ARKit`;
            
            if (user.avatarPortrait !== newPortraitUrl) {
              user.avatarPortrait = newPortraitUrl;
              needsUpdate = true;
            }
          }
        }

        if (needsUpdate) {
          await user.save();
          updated++;
          console.log(`Updated portrait for user ${user.email} (${user.fullName})`);
        }
        
      } catch (error) {
        console.error(`Error updating user ${user.email}:`, error.message);
        errors++;
      }
    }

    console.log(`\nMigration completed:`);
    console.log(`- Users updated: ${updated}`);
    console.log(`- Errors: ${errors}`);
    console.log(`- Total users: ${users.length}`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
updateAvatarPortraits();