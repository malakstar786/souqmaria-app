const axios = require('axios');

// API configuration
const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';
const ENDPOINTS = {
  GET_DATA_JSON: '/getData_JSON/',
};

// Test data
const COMPANY_ID = '3044';
const CULTURE_ID = '1'; // English

async function testGetCategories() {
  try {
    // Based on the image in the prompt, try a simpler format
    const query = `[Web].[Sp_Get_SM_Apps] 'Get_HomePage_Category_List','','','','','',${CULTURE_ID},${COMPANY_ID},''`;
    
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`, {
      strQuery: query
    });
    
    console.log('Category List API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Error fetching Categories:');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Execute the test
testGetCategories(); 