const axios = require('axios');

// API configuration
const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';
const ENDPOINTS = {
  GET_DATA_JSON: '/getData_JSON/',
};

// Test data from the provided image for Get_Banner_List
const COMPANY_ID = '3044';
const CULTURE_ID = '1'; // English
const USER_ID = ''; // Assuming UserId can be empty for banners, or use a test UserID if required by actual API behavior

async function testGetBanners() {
  try {
    const bannerQuery = `[Web].[Sp_Get_SM_Apps] 'Get_Banner_List','','','','','',${CULTURE_ID},${COMPANY_ID},'${USER_ID}'`;
    
    console.log('Sending query:', bannerQuery); // Log the query
    
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`, {
      strQuery: bannerQuery
    });
    
    console.log('Banner List API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Error fetching Banners:');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
  }
}

// Execute the test
testGetBanners(); 