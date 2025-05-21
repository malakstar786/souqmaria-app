const axios = require('axios');

// Base API URL
const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';

// Common parameters
const COMMON_PARAMS = {
  Company: '3044',
  Location: '304401HO',
};

// Test credentials
const TEST_EMAIL = 'hussain@test.com';
const TEST_PASSWORD = 'Test@786110';
const TEST_USER_ID = 'USER123'; // This should be a real user ID from your system

// Helper function to print formatted responses
const logResponse = (title, data) => {
  console.log('\n' + '='.repeat(40));
  console.log(`${title}:`);
  console.log('='.repeat(40));
  if (typeof data === 'object') {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(data);
  }
};

// 1. Test Login API
async function testLogin() {
  try {
    console.log('\n🔑 Testing Login API...');
    const response = await axios.post(`${API_BASE_URL}UserLogin/`, {
      UserName: TEST_EMAIL,
      Password: TEST_PASSWORD,
      Company: COMMON_PARAMS.Company,
    });
    
    logResponse('Login Response', response.data);
    
    if (response.data.UserDetails && response.data.UserDetails.UserID) {
      console.log(`✅ User ID found: ${response.data.UserDetails.UserID}`);
      return response.data.UserDetails.UserID;
    } else {
      console.log('❌ No User ID found in response. Using test User ID.');
      return TEST_USER_ID;
    }
  } catch (error) {
    console.error('❌ Login Error:', error.response ? error.response.data : error.message);
    console.log('⚠️ Using test User ID for remaining tests.');
    return TEST_USER_ID;
  }
}

// 2. Test Get Billing Addresses API
async function testGetBillingAddresses(userId) {
  try {
    console.log('\n🏠 Testing Get Billing Addresses API...');
    const query = `[Web].[Sp_Manage_Address_Apps_SM]'Get_BillingAddress_List','${userId}','','','','',1,3044`;
    console.log(`\nUsing userId: ${userId}`);
    console.log(`Query: ${query}`);
    
    const response = await axios.post(`${API_BASE_URL}getData_JSON/`, {
      strQuery: query
    });
    
    logResponse('Billing Addresses Response', {
      success: response.data.success,
      messageLength: response.data.Message ? response.data.Message.length : 0,
      numberOfAddresses: response.data.row ? response.data.row.length : 0
    });
    
    if (response.data.row && response.data.row.length > 0) {
      console.log('✅ Found billing addresses.');
      return true;
    } else {
      console.log('ℹ️ No billing addresses found for this user.');
      return false;
    }
  } catch (error) {
    console.error('❌ Get Billing Addresses Error:', error.response ? error.response.data : error.message);
    return false;
  }
}

// 3. Test Get Wishlist Items API
async function testGetWishlistItems(userId) {
  try {
    console.log('\n❤️ Testing Get Wishlist Items API...');
    const query = `[Web].[Sp_Templete1_Get_MyWishlist_Apps] 'Get_MyWishlist','${userId}','','','','',1,3044`;
    console.log(`\nUsing userId: ${userId}`);
    console.log(`Query: ${query}`);
    
    const response = await axios.post(`${API_BASE_URL}getData_JSON/`, {
      strQuery: query
    });
    
    logResponse('Wishlist Response', {
      success: response.data.success,
      messageLength: response.data.Message ? response.data.Message.length : 0,
      numberOfItems: response.data.row ? response.data.row.length : 0
    });
    
    if (response.data.row && response.data.row.length > 0) {
      console.log('✅ Found wishlist items.');
      return true;
    } else {
      console.log('ℹ️ No wishlist items found for this user.');
      return false;
    }
  } catch (error) {
    console.error('❌ Get Wishlist Items Error:', error.response ? error.response.data : error.message);
    return false;
  }
}

// 4. Test Get Cart Items API
async function testGetCartItems(userId) {
  try {
    console.log('\n🛒 Testing Get Cart Items API...');
    const uniqueId = `test-${Date.now()}`;
    const query = `[Web].[SP_Template1_Get_CartProductsDetails_Apps]'${userId}','127.0.0.1','${uniqueId}',${COMMON_PARAMS.Company},1`;
    console.log(`\nUsing userId: ${userId}`);
    console.log(`Query: ${query}`);
    
    const response = await axios.post(`${API_BASE_URL}getData_JSON/`, {
      strQuery: query
    });
    
    logResponse('Cart Items Response', {
      success: response.data.success,
      messageLength: response.data.Message ? response.data.Message.length : 0,
      numberOfItems: response.data.row ? response.data.row.length : 0
    });
    
    if (response.data.row && response.data.row.length > 0) {
      console.log('✅ Found cart items.');
      return true;
    } else {
      console.log('ℹ️ No cart items found for this user.');
      return false;
    }
  } catch (error) {
    console.error('❌ Get Cart Items Error:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting API Tests with User ID...');
  
  // Login and get user ID if possible
  const userId = await testLogin();
  console.log(`\n📝 Using User ID: ${userId} for all subsequent tests.\n`);
  
  // Test all user-specific APIs
  await testGetBillingAddresses(userId);
  await testGetWishlistItems(userId);
  await testGetCartItems(userId);
  
  console.log('\n🏁 Finished API Tests');
}

// Execute all tests
runAllTests(); 