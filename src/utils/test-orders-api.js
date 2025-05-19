const axios = require('axios');

// API configuration
const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';
const ENDPOINTS = {
  GET_DATA_JSON: '/getData_JSON/',
};

// Test data with user ID obtained from login test
const USER_ID = '7975'; // Hussain Test user ID
const COMPANY_ID = '3044';
const CULTURE_ID = '1'; // English

async function testGetMyOrders() {
  try {
    // Based on the image in the prompt, the My Orders API uses [Web].[Sp_Template1_Get_MyOrders_Apps]
    const myOrdersQuery = `[Web].[Sp_Template1_Get_MyOrders_Apps] 'Get_MyOrders_Parent','${USER_ID}','','','CurrencyXName','CurrencyXCode',${COMPANY_ID},${CULTURE_ID}`;
    
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`, {
      strQuery: myOrdersQuery
    });
    
    console.log('My Orders API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Error fetching My Orders:');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Execute the test
testGetMyOrders(); 