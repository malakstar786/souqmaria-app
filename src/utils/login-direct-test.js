const axios = require('axios');

async function testLogin() {
  const API_URL = 'https://api.souqmaria.com/api/MerpecWebApi/UserLogin';
  
  try {
    console.log('Testing direct login...');
    
    // Try the credentials from the documentation
    const response = await axios({
      method: 'post',
      url: API_URL,
      data: {
        UserName: 'hussain@test.com',
        Password: 'Test@786110',
        CompanyId: 3044
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Request failed:');
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin(); 