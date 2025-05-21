// Test script to test the AddToCart API functionality

const fetch = require('node-fetch');

const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';
const COMMON_PARAMS = {
  Company: '3044',
  Location: '304401HO',
};

// Response codes
const RESPONSE_CODES = {
  SUCCESS: 200,
  SUCCESS_ALT: 2,
  CART_ADDED: 2,           // Item added to cart successfully
  CART_UPDATED: 4,         // Item already in cart, quantity updated
  CART_OUT_OF_STOCK: -4,   // Stock not available
  CART_ERROR: -10,         // General error in add to cart
};

async function addToCart(params) {
  try {
    const url = `${API_BASE_URL}AddToCart`;
    
    console.log('Sending request to:', url);
    console.log('Request body:', JSON.stringify(params, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const responseData = await response.json();
    return {
      StatusCode: response.status,
      ResponseCode: responseData.ResponseCode || -1000,
      Message: responseData.Message || 'Unknown response from server',
      Data: responseData,
    };
  } catch (error) {
    console.error('Error in addToCart:', error);
    return {
      StatusCode: 500,
      ResponseCode: -1000,
      Message: error.message || 'An error occurred while adding to cart',
      Data: null,
    };
  }
}

async function testAddToCart() {
  // Test with a sample product - these values would need to be valid in your system
  const productId = '10101010'; // Replace with a valid product ID
  const productPrice = 10.500; // Replace with actual price
  const oldPrice = 12.000; // Replace with actual old price if applicable
  const discount = 0; // Replace with actual discount if applicable
  
  const uniqueId = `test-${Date.now()}`;
  
  const params = {
    ItemCode: productId,
    NewPrice: productPrice,
    OldPrice: oldPrice,
    Discount: discount,
    UserId: '', // Replace with an actual user ID if needed for testing
    UniqueId: uniqueId,
    IpAddress: '127.0.0.1', // Simplified for testing
    Company: COMMON_PARAMS.Company,
    Location: COMMON_PARAMS.Location,
    Qty: 1
  };

  console.log(`Testing Add to Cart API for product ID: ${productId}`);
  
  try {
    const response = await addToCart(params);
    
    console.log('\nAPI Response:');
    console.log(JSON.stringify(response, null, 2));
    
    // Handle different response codes
    if (response.ResponseCode === RESPONSE_CODES.CART_ADDED || 
        response.ResponseCode === RESPONSE_CODES.SUCCESS_ALT ||
        response.ResponseCode === '2' || 
        response.ResponseCode === 2) {
      console.log('\n✅ Success: Item added to cart!');
    } else if (response.ResponseCode === 4 || response.ResponseCode === '4') {
      console.log('\n✅ Success: Item already in cart, quantity updated!');
    } else if (response.ResponseCode === -4 || response.ResponseCode === '-4') {
      console.log('\n❌ Stock Unavailable: This product is currently out of stock.');
    } else {
      console.log('\n❌ Error: Failed to add item to cart. Please try again.');
    }
  } catch (error) {
    console.error('Error running test:', error);
  }
}

// Run the test
testAddToCart();
