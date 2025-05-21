const axios = require('axios');

// API configuration
const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';
const ENDPOINTS = {
  LOGIN_USER: '/UserLogin/',
};

// Test credentials from instructions.md
const CREDENTIALS = {
  UserName: 'hussain@test.com',
  Password: 'Test@786110',
  Company: 3044
};

async function testLogin() {
  try {
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.LOGIN_USER}`, CREDENTIALS);
    
    console.log('Login API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Extract user ID for orders API testing
    if (response.data.UserDetails) {
      console.log(`\nUser ID for orders API: ${response.data.UserDetails.UserID}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error during login:');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Execute the test
testLogin(); 