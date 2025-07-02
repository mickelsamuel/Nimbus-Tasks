const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login...');
    
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'test@bnc.ca',
      password: 'Password123!'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.user.firstName, response.data.user.lastName);
    console.log('Role:', response.data.user.role);
    console.log('Department:', response.data.user.department);
    console.log('Token:', response.data.token ? 'Generated' : 'Missing');
    
    // Test dashboard with token
    console.log('\nTesting dashboard API...');
    const dashboardResponse = await axios.get('http://localhost:3000/api/dashboard', {
      headers: { Authorization: `Bearer ${response.data.token}` }
    });
    
    console.log('✅ Dashboard API works!');
    console.log('Welcome message:', dashboardResponse.data.welcome?.greeting);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testLogin();