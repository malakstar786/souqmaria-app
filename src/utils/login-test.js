const axios = require('axios');

// API configuration
const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';
const ENDPOINTS = {
  LOGIN_USER: '/UserLogin/',
  GET_DATA_JSON: '/getData_JSON/',
};

// Test credentials from instructions.md
const CREDENTIALS = {
  UserName: 'hussain@test.com',
  Password: 'Test@786110',
  CompanyId: 3044
};

async function testLogin() {
  try {
    console.log('Testing login with credentials:', { 
      UserName: CREDENTIALS.UserName, 
      Password: CREDENTIALS.Password,
      CompanyId: CREDENTIALS.CompanyId 
    });
    
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.LOGIN_USER}`, CREDENTIALS);
    
    console.log('Login API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Extract user ID for orders API testing
    if (response.data.UserDetails && response.data.UserDetails.UserID) {
      const userId = response.data.UserDetails.UserID;
      console.log(`\nExtracted User ID from login response: ${userId}`);
      // Test getting wishlist with this user ID
      await testWishlistItems(userId);
      // Test getting orders with this user ID
      await testGetOrders(userId);
    } else {
      console.error('No UserID found in login response. Aborting further tests.');
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
    // Do not proceed to other API tests if login fails
  }
}

// Test getting wishlist items
async function testWishlistItems(userId) {
  try {
    console.log('\n--- Testing Wishlist Items with User ID:', userId);
    const strQuery = `[Web].[Sp_Templete1_Get_MyWishlist_Apps] 'Get_MyWishlist','${userId}','','','','',1,3044`;
    
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`, {
      strQuery
    });
    
    console.log('Wishlist API Response:');
    console.log(JSON.stringify({
      success: response.data.success,
      messageLength: response.data.Message ? response.data.Message.length : 0,
      numberOfItems: response.data.row ? response.data.row.length : 0
    }, null, 2));
    
    if (response.data.success === 1) {
      console.log(`Found ${response.data.row.length} wishlist items`);
    } else {
      console.log('No wishlist items found or user not authorized');
    }
  } catch (error) {
    console.error('Error fetching wishlist:');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Test getting orders
async function testGetOrders(userId) {
  try {
    console.log('\n--- Testing Get Orders with User ID:', userId);
    const strQuery = `[Web].[Sp_Template1_Get_MyOrders_Apps] 'Get_MyOrders_Parent','${userId}','','','CurrencyXName','CurrencyXCode',3044,1`;
    
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`, {
      strQuery
    });
    
    console.log('Orders API Response:');
    console.log(JSON.stringify({
      success: response.data.success,
      messageLength: response.data.Message ? response.data.Message.length : 0,
      numberOfItems: response.data.row ? response.data.row.length : 0
    }, null, 2));
    
    if (response.data.success === 1) {
      console.log(`Found ${response.data.row.length} orders`);
    } else {
      console.log('No orders found or user not authorized');
    }
  } catch (error) {
    console.error('Error fetching orders:');
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