const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function createTestUser() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    // Delete test user if exists
    await User.deleteOne({ email: 'test@bnc.ca' });

    // Create test user
    const testUser = new User({
      email: 'test@bnc.ca',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      department: 'IT',
      role: 'employee',
      employeeId: 'TEST001',
      isEmailVerified: true,
      hasPolicyAccepted: true,
      selectedMode: 'standard',
      hasCompletedAvatarSetup: true,
      stats: {
        totalPoints: 2500,
        level: 5,
        xp: 8500,
        rank: 'Intermediate'
      },
      currency: { coins: 2500, tokens: 45 }
    });

    await testUser.save();
    console.log('✅ Test user created: test@bnc.ca / Password123!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

createTestUser();