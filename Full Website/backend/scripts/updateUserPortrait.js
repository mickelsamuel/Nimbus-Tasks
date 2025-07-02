const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function updateUserPortrait(email) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bnc-training', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`\nCurrent avatar URLs for ${user.firstName} ${user.lastName}:`);
    console.log('Avatar:', user.avatar);
    console.log('Avatar3D:', user.avatar3D);
    console.log('Avatar2D:', user.avatar2D);
    console.log('AvatarPortrait:', user.avatarPortrait);

    // Update portrait URL if avatar exists
    if (user.avatar && user.avatar.includes('readyplayer.me')) {
      const avatarId = user.avatar.match(/\/([a-zA-Z0-9]+)\.glb/)?.[1];
      if (avatarId) {
        const newPortraitUrl = `https://api.readyplayer.me/v1/avatars/${avatarId}.png?scene=halfbody-portrait-v1`;
        user.avatarPortrait = newPortraitUrl;
        await user.save();
        
        console.log(`\nUpdated portrait URL to: ${newPortraitUrl}`);
      }
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node updateUserPortrait.js <email>');
  process.exit(1);
}

updateUserPortrait(email);