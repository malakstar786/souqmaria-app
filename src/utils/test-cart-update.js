const axios = require('axios');

// Configuration
const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi';
const CART_UPDATE_ENDPOINT = '/UpdateCartQty';
const CART_GET_ENDPOINT = '/getData_JSON/';
const CART_ADD_ENDPOINT = '/AddToCart';

// Common parameters
const COMMON_PARAMS = {
  COMPANY: '3044',
  LOCATION: '304401HO'
};

// Test updating cart quantity
async function testUpdateCartQuantity(cartId, newQuantity) {
  console.log(`🛒 Testing update cart quantity: CartID=${cartId}, Quantity=${newQuantity}`);
  
  try {
    const response = await axios.post(`${API_BASE_URL}${CART_UPDATE_ENDPOINT}`, {
      CartId: cartId,
      Qty: newQuantity,
      Company: COMMON_PARAMS.COMPANY,
      Location: COMMON_PARAMS.LOCATION
    });
    
    console.log('🛒 Update Cart Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('🛒 Error updating cart:', error.message);
    if (error.response) {
      console.error('🛒 Response data:', error.response.data);
    }
    throw error;
  }
}

// Test getting cart items
async function testGetCartItems(userId, uniqueId) {
  console.log(`🛒 Testing get cart items: UserId=${userId || ''}, UniqueId=${uniqueId}`);
  
  try {
    // Build the stored procedure query using the correct schema and name
    const spQuery = `[Web].[SP_Template1_Get_CartProductsDetails_Apps]'${userId}','127.0.0.1','${uniqueId}',${COMMON_PARAMS.COMPANY},1`;
    
    const response = await axios.post(`${API_BASE_URL}${CART_GET_ENDPOINT}`, {
      strQuery: spQuery
    });
    
    const cartData = response.data;
    console.log('🛒 Cart Data Response:', JSON.stringify(cartData, null, 2));
    
    if (cartData.success === 1 && Array.isArray(cartData.row)) {
      console.log(`🛒 Found ${cartData.row.length} items in cart`);
      console.log('🛒 Cart items details:', cartData.row.map(item => ({
        CartID: item.CartID || item.CartId,
        ProductName: item.ProductName,
        Quantity: item.Quantity,
        Price: item.Price,
        SubTotal: item.SubTotal
      })));
      
      // Calculate total quantities
      const totalQuantity = cartData.row.reduce((total, item) => total + (Number(item.Quantity) || 0), 0);
      const totalItems = cartData.row.length;
      console.log(`🛒 Total unique items: ${totalItems}, Total quantity: ${totalQuantity}`);
    } else {
      console.log('🛒 No items in cart or error occurred');
    }
    
    return cartData;
  } catch (error) {
    console.error('🛒 Error getting cart items:', error.message);
    if (error.response) {
      console.error('🛒 Response data:', error.response.data);
    }
    throw error;
  }
}

// Test adding an item to cart
async function testAddToCart(itemCode, price, quantity, uniqueId) {
  console.log(`🛒 Testing add to cart: ItemCode=${itemCode}, Price=${price}, Quantity=${quantity}, UniqueId=${uniqueId}`);
  
  try {
    const response = await axios.post(`${API_BASE_URL}${CART_ADD_ENDPOINT}`, {
      ItemCode: itemCode,
      NewPrice: price,
      OldPrice: price,
      Discount: 0,
      UserId: "",
      UniqueId: uniqueId,
      IpAddress: "127.0.0.1",
      Company: COMMON_PARAMS.COMPANY,
      Location: COMMON_PARAMS.LOCATION,
      Qty: quantity
    });
    
    console.log('🛒 Add to Cart Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('🛒 Error adding to cart:', error.message);
    if (error.response) {
      console.error('🛒 Response data:', error.response.data);
    }
    throw error;
  }
}

// Run tests
async function runTests() {
  try {
    // Test parameters - update these with real values from your app
    const UNIQUE_ID = `test-${Date.now()}`; // Generate a new unique ID for testing
    const USER_ID = ''; // Leave empty for guest user
    const ITEM_CODE = 'IM31790673'; // iPhone test product
    const PRICE = 20; // Price from the product details
    
    // Test sequence
    console.log('🛒 === CART TESTING SEQUENCE ===');
    
    // First, check current cart contents
    console.log('\n🛒 --- Initial Cart State ---');
    const initialCart = await testGetCartItems(USER_ID, UNIQUE_ID);
    
    // Add an item to the cart
    console.log('\n🛒 --- Adding Item to Cart ---');
    const addResult = await testAddToCart(ITEM_CODE, PRICE, 1, UNIQUE_ID);
    
    // Check cart after adding
    console.log('\n🛒 --- Cart State After Adding Item ---');
    const cartAfterAdd = await testGetCartItems(USER_ID, UNIQUE_ID);
    
    if (cartAfterAdd.success === 1 && cartAfterAdd.row.length > 0) {
      // Get cart ID of the first item
      const cartId = cartAfterAdd.row[0].CartID || cartAfterAdd.row[0].CartId;
      
      // Update quantity of the item
      console.log('\n🛒 --- Updating Cart Item Quantity ---');
      await testUpdateCartQuantity(cartId, 3);
      
      // Check cart after update
      console.log('\n🛒 --- Cart State After Update ---');
      await testGetCartItems(USER_ID, UNIQUE_ID);
    } else {
      console.log('🛒 No items found in cart to update');
    }
    
    console.log('\n🛒 === CART TESTING COMPLETE ===');
  } catch (error) {
    console.error('🛒 Test sequence failed:', error.message);
  }
}

// Run the tests
runTests(); 