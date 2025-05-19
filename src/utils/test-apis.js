const axios = require('axios');

// Base API URL
const BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi';

// Test Country List API
async function testGetCountryList() {
  try {
    const response = await axios.post(`${BASE_URL}/getData_JSON`, {
      strQuery: "[Web].[Sp_Manage_Address_Apps_SM] 'Get_Country_List','','','','','',1,3044"
    });
    console.log('Country List Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error fetching country list:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Test State List API - Kuwait (69)
async function testGetStateList() {
  try {
    const response = await axios.post(`${BASE_URL}/getData_JSON`, {
      strQuery: "[Web].[Sp_Manage_Address_Apps_SM] 'Get_State_List','69','','','','',1,3044"
    });
    console.log('State List Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error fetching state list:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Test City List API
async function testGetCityList() {
  try {
    // Get first state ID from the state response and use it
    const stateData = await testGetStateList();
    if (stateData && stateData.row && stateData.row.length > 0) {
      const stateId = stateData.row[0].XCode;
      
      console.log(`Using state ID: ${stateId} for city list`);
      const response = await axios.post(`${BASE_URL}/getData_JSON`, {
        strQuery: `[Web].[Sp_Manage_Address_Apps_SM] 'Get_City_List','${stateId}','','','','',1,3044`
      });
      console.log('City List Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } else {
      console.log('No state data available to test city list');
      return null;
    }
  } catch (error) {
    console.error('Error fetching city list:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('===== TESTING COUNTRY LIST API =====');
  await testGetCountryList();
  
  console.log('\n===== TESTING STATE LIST API =====');
  await testGetStateList();
  
  console.log('\n===== TESTING CITY LIST API =====');
  await testGetCityList();
}

// Execute the tests
runAllTests(); 