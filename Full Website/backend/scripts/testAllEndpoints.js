const axios = require('axios');

async function testAllEndpoints() {
  try {
    console.log('=== Testing BNC Training Platform APIs ===\n');
    
    // Login first
    console.log('1. Testing Authentication...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'test@bnc.ca',
      password: 'Password123!'
    });
    
    console.log('✅ Login successful');
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test various endpoints
    const endpoints = [
      { name: 'Dashboard', url: '/api/dashboard' },
      { name: 'User Profile', url: '/api/auth/me' },
      { name: 'Modules', url: '/api/modules' },
      { name: 'Achievements', url: '/api/achievements' },
      { name: 'Teams', url: '/api/teams' },
      { name: 'Events', url: '/api/events' },
      { name: 'Leaderboards', url: '/api/leaderboards' },
      { name: 'Shop', url: '/api/shop' },
      { name: 'Avatar', url: '/api/avatar' },
      { name: 'Notifications', url: '/api/notifications' },
      { name: 'Timeline', url: '/api/timeline' },
      { name: 'Career', url: '/api/career' },
      { name: 'Simulation', url: '/api/simulation' },
      { name: 'University', url: '/api/university' },
      { name: 'Spaces', url: '/api/spaces' },
      { name: 'Friends', url: '/api/friends' }
    ];
    
    console.log('\n2. Testing API Endpoints...');
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`http://localhost:3000${endpoint.url}`, { headers });
        
        // Check if response has data
        const hasData = response.data && (
          response.data.success !== false || 
          Array.isArray(response.data) || 
          Object.keys(response.data).length > 0
        );
        
        console.log(`✅ ${endpoint.name}: ${hasData ? 'Has data' : 'Empty response'}`);
        
        // Log sample data for key endpoints
        if (endpoint.name === 'Dashboard' && response.data.welcome) {
          console.log(`   - Welcome: ${response.data.welcome.greeting || 'Generated'}`);
        }
        if (endpoint.name === 'Modules' && response.data.modules) {
          console.log(`   - Modules count: ${response.data.modules.length}`);
        }
        if (endpoint.name === 'Achievements' && Array.isArray(response.data)) {
          console.log(`   - Achievements count: ${response.data.length}`);
        }
        
      } catch (error) {
        if (error.response) {
          console.log(`❌ ${endpoint.name}: ${error.response.status} - ${error.response.data?.message || 'Error'}`);
        } else {
          console.log(`❌ ${endpoint.name}: Network error`);
        }
      }
    }
    
    console.log('\n=== API Testing Complete ===');
    
  } catch (error) {
    console.error('❌ Initial login failed:', error.response?.data || error.message);
  }
}

testAllEndpoints();