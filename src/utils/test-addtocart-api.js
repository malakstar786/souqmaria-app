// Test script to debug AddToCart API
const axios = require('axios');

const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';

async function testAddToCart() {
  try {
    // Test multiple item codes to find one that works
    const testItemCodes = [
      'IM31110511',         // Example from earlier tests
      'HC31790001',         // From category list
      'MT300000010021',     // Try formatted as per image
      'MT300000010020'      // Another variation
    ];

    console.log('Will test the following item codes:', testItemCodes);
    
    for (const itemCode of testItemCodes) {
      console.log(`\n----- Testing with ItemCode: ${itemCode} -----`);
      
      // Try to get product details first
      try {
        const productDetailsResponse = await getProductDetails(itemCode);
        
        if (productDetailsResponse.data && 
            productDetailsResponse.data.success === 1 && 
            productDetailsResponse.data.row && 
            productDetailsResponse.data.row.length > 0) {
          
          const productData = productDetailsResponse.data.row[0];
          console.log(`Product details found for ${itemCode}:`, productData.Item_XName);
          
          // Add to cart with full details
          await testAddToCartEndpoint(itemCode, productData);
        } else {
          console.log(`No product details found for ${itemCode}. Will try direct cart add.`);
          // Try with minimal information
          await testAddToCartEndpoint(itemCode, { NewPrice: 10, OldPrice: 15, Discount: 5 });
        }
      } catch (error) {
        console.log(`Error getting product details for ${itemCode}:`, error.message);
        // Still try the cart add
        await testAddToCartEndpoint(itemCode, { NewPrice: 10, OldPrice: 15, Discount: 5 });
      }
    }
    
    // Finally, try with parameters exactly matching what's in the attached image
    console.log('\n----- Testing with parameters exactly as shown in documentation image -----');
    await testAddToCartWithDocParams();
  } catch (error) {
    console.error('Error in test script:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error('Full error:', error);
    }
  }
}

async function getProductDetails(itemCode) {
  console.log(`Getting product details for ${itemCode}...`);
  const query = `[Web].[Sp_Get_SM_Apps] 'Get_ProductDetails_ByItemCode','${itemCode}','304401HO','','','','1','3044',''`;
  
  return await axios.post(`${API_BASE_URL}getData_JSON/`, {
    strQuery: query
  });
}

async function testAddToCartEndpoint(itemCode, productData) {
  console.log('Testing AddToCart endpoint...');
  
  // Prepare test parameters based on provided image and product details
  const params = {
    ItemCode: itemCode,
    NewPrice: productData.NewPrice || 0,
    OldPrice: productData.OldPrice || 0,
    Discount: productData.Discount || 0,
    UserId: '', // Empty for guest user or add user ID for logged-in user
    UniqueId: 'web-test-' + Date.now(), // Generate a unique ID for this cart item
    IpAddress: '127.0.0.1', // Test IP address
    Company: '3044',
    Location: '304401HO',
    Qty: 1 // Default quantity
  };
  
  console.log('AddToCart Request Params:', params);
  
  try {
    // Try AddToCart endpoint
    const response = await axios.post(`${API_BASE_URL}AddToCart`, params);
    console.log('AddToCart Response:', JSON.stringify(response.data, null, 2));
    
    // Check response codes based on API documentation
    if (response.data) {
      if (response.data.StatusCode === 200 && response.data.ResponseCode === 2) {
        console.log('SUCCESS: Item added to cart successfully');
      } else if (response.data.StatusCode === 200 && response.data.ResponseCode === 4) {
        console.log('UPDATED: Item already in cart, quantity updated');
      } else if (response.data.StatusCode === 200 && response.data.ResponseCode === -4) {
        console.log('ERROR: Stock not available');
      } else if (response.data.StatusCode === 200 && response.data.ResponseCode === -10) {
        console.log('ERROR:', response.data.Message || 'Something went wrong');
      } else if (response.data.ResponseCode === '-4') {
        console.log('ERROR: Stock not available (string response code)');
      } else if (response.data.ResponseCode === 2 || response.data.ResponseCode === '2') {
        console.log('SUCCESS: Item added to cart (implied success)');
      } else {
        console.log('UNKNOWN RESPONSE:', response.data);
      }
    }
  } catch (error) {
    console.error('Error testing AddToCart:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error('Full error:', error);
    }
  }
}

// Test with parameters exactly as they appear in the documentation image
async function testAddToCartWithDocParams() {
  console.log('Testing AddToCart with parameters from documentation...');
  
  // These parameters match what's shown in the attached image
  const params = {
    ItemCode: "PRODUCTXCODE123", // Example product code
    NewPrice: 19.99,
    OldPrice: 24.99,
    Discount: 5.00,
    UserId: "", // Empty for guest user
    UniqueId: "web-test-" + Date.now(),
    IpAddress: "127.0.0.1",
    Company: "3044",
    Location: "304401HO",
    Qty: 1
  };
  
  console.log('AddToCart Doc Params:', params);
  
  try {
    const response = await axios.post(`${API_BASE_URL}AddToCart`, params);
    console.log('AddToCart Doc Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.ResponseCode === 2 || response.data.ResponseCode === '2') {
      console.log('SUCCESS: Item added to cart');
    } else if (response.data.ResponseCode === 4 || response.data.ResponseCode === '4') {
      console.log('UPDATED: Item already in cart, quantity updated');
    } else if (response.data.ResponseCode === -4 || response.data.ResponseCode === '-4') {
      console.log('ERROR: Stock not available');
    } else {
      console.log('UNKNOWN RESPONSE:', response.data);
    }
  } catch (error) {
    console.error('Error testing with doc params:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error('Full error:', error);
    }
  }
}

// Run the test
testAddToCart(); 