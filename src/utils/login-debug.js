// A simple script to test the API login response format
// You can run this with `node login-debug.js` from the terminal outside of the app

async function testLogin() {
  const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi';
  const ENDPOINT = '/UserLogin/';
  
  const loginPayload = {
    UserName: 'hussain@test.com', // Use test credentials from instructions
    Password: 'Test@786110',
    Company: 3044,
  };

  try {
    console.log('Sending login request with:', {
      ...loginPayload,
      Password: '***'
    });
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(loginPayload),
    });
    
    const data = await response.json();
    console.log('Full API Response:', JSON.stringify(data, null, 2));
    
    // Show the data structure specifically
    console.log('\nUser data structure:');
    if (data.Data) {
      Object.keys(data.Data).forEach(key => {
        console.log(`${key}: ${typeof data.Data[key]} = ${data.Data[key]}`);
      });
    } else {
      console.log('No Data object in response');
    }
    
  } catch (error) {
    console.error('API request failed:', error);
  }
}

testLogin(); 