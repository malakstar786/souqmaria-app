const axios = require('axios');

async function testCartOperations() {
  try {
    // Create a unique ID for testing
    const uniqueId = 'test-' + Date.now();
    console.log('Using uniqueId:', uniqueId);
    
    // Step 1: Add item to cart
    const addToCartParams = {
      ItemCode: 'IM31790673',
      NewPrice: 20,
      OldPrice: 0,
      Discount: 0,
      UserId: '',
      UniqueId: uniqueId,
      IpAddress: '127.0.0.1',
      Company: '3044',
      Location: '304401HO',
      Qty: 1
    };

    
    console.log('Adding item to cart...');
    const addResponse = await axios.post(
      'https://api.souqmaria.com/api/MerpecWebApi/AddToCart', 
      addToCartParams
    );
    console.log('AddToCart response:', JSON.stringify(addResponse.data, null, 2));
    
    // Try alternative approach - call the Get_CartItems endpoint directly
    console.log('\nTrying to get cart items...');
    try {
      // Use the correct parameters based on the image
      const directCartResponse = await axios.post(
        `https://api.souqmaria.com/api/MerpecWebApi/getData_JSON`,
        {
          strQuery: `[Web].[SP_Template1_Get_CartProductsDetails_Apps] '','127.0.0.1','${uniqueId}',3044,1`
        }
      );
      console.log('Cart items response:', JSON.stringify(directCartResponse.data, null, 2));
      
      // Check if we got cart items
      if (directCartResponse.data && 
          directCartResponse.data.success === 1 && 
          directCartResponse.data.row && 
          directCartResponse.data.row.length > 0) {
        const cartItem = directCartResponse.data.row[0];
        console.log('Found cart item with CartID:', cartItem.CartID);
        
        // Step 3: Update cart item quantity
        console.log('\nUpdating cart item quantity...');
        const updateParams = {
          CartId: cartItem.CartID,
          Qty: 2, // Increase quantity to 2
          Company: '3044',
          Location: '304401HO'
        };
        
        const updateResponse = await axios.post(
          'https://api.souqmaria.com/api/MerpecWebApi/UpdateCartQty', 
          updateParams
        );
        console.log('UpdateCartQty response:', JSON.stringify(updateResponse.data, null, 2));
        
        // Step 4: Delete cart item
        console.log('\nDeleting cart item...');
        const deleteParams = {
          CartId: cartItem.CartID,
          Company: '3044'
        };
        
        const deleteResponse = await axios.post(
          'https://api.souqmaria.com/api/MerpecWebApi/DeleteCartItem', 
          deleteParams
        );
        console.log('DeleteCartItem response:', JSON.stringify(deleteResponse.data, null, 2));
      } else {
        console.log('No cart items found in the API response.');
      }
    } catch (error) {
      console.error('Error with cart API:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response && error.response.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testCartOperations(); 