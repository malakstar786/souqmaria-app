const axios = require('axios');

// API configuration
const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi';
const ENDPOINTS = {
  LOGIN_USER: '/UserLogin/',
  GET_DATA_JSON: '/getData_JSON/',
};

// Test credentials
const TEST_CREDENTIALS = {
  UserName: 'hussain@test.com',
  Password: 'Test@786110',
  CompanyId: 3044
};

// Test function to call an API and log response
async function callApi(name, url, method = 'post', data = {}) {
  console.log(`\n\n----- Testing ${name} API -----`);
  console.log(`URL: ${url}`);
  console.log(`Method: ${method.toUpperCase()}`);
  console.log(`Data: ${JSON.stringify(data, null, 2)}`);
  
  try {
    const response = await axios({
      method,
      url,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(response.data, null, 2)}`);
    return response.data;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
      return error.response.data;
    }
    return null;
  }
}

// Test Categories API
async function testCategoriesApi() {
  const url = `${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`;
  const data = {
    strQuery: "[Web].[Sp_Get_SM_Apps] 'Get_HomePage_Category_List','','','','','',1,3044,''"
  };
  
  return callApi('Categories', url, 'post', data);
}

// Test Banners API
async function testBannersApi() {
  const url = `${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`;
  const data = {
    strQuery: "[Web].[Sp_Get_SM_Apps] 'Get_Banner_List','','','','','',1,3044,''"
  };
  
  return callApi('Banners', url, 'post', data);
}

// Test Advertisements API
async function testAdvertisementsApi() {
  const url = `${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`;
  const data = {
    strQuery: "[Web].[Sp_Get_SM_Apps] 'Get_Ads_List','','','','','',1,3044,''"
  };
  
  return callApi('Advertisements', url, 'post', data);
}

// Run all tests
async function runAllTests() {
  console.log("Starting API Tests...");
  
  // First test login to see if it's still failing
  await callApi('Login', `${API_BASE_URL}${ENDPOINTS.LOGIN_USER}`, 'post', TEST_CREDENTIALS);
  
  // Test other endpoints
  await testCategoriesApi();
  await testBannersApi();
  await testAdvertisementsApi();
  
  console.log("\nAPI Tests Completed");
}

runAllTests(); 