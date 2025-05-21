// Test script to document the wishlist APIs available
const axios = require('axios');

async function testWishlistAPIs() {
  try {
    console.log('===== WISHLIST API DOCUMENTATION =====\n');
    
    // Create a unique item code for testing
    const itemCode = 'IM31790673'; // Example item code

    console.log('\n1. ADD TO WISHLIST API');
    console.log('Endpoint: https://api.souqmaria.com/api/MerpecWebApi/CRUD_Wishlist');
    console.log('Method: POST');
    console.log('Description: Adds an item to the wishlist');
    
    const addToWishlistParams = {
      ItemCode: itemCode,
      UserId: '7975', // Use a test user ID
      IpAddress: '127.0.0.1',
      CompanyId: 3044,
      Command: 'Save'
    };
    
    console.log('Request parameters:', addToWishlistParams);

    try {
      // Test the Add to Wishlist API
      const addResponse = await axios.post('https://api.souqmaria.com/api/MerpecWebApi/CRUD_Wishlist', 
        addToWishlistParams
      );
      
      console.log('Add to Wishlist Response:', JSON.stringify(addResponse.data, null, 2));
      console.log('Response codes explanation:');
      console.log('- StatusCode 200 and ResponseCode 2: Item added to wishlist successfully');
      console.log('- StatusCode 200 and ResponseCode -2: Item not added to wishlist successfully');
      console.log('- StatusCode 200 and ResponseCode 6: Command not passed');
      console.log('- StatusCode 200 and ResponseCode -10: Something went wrong');
      console.log('- StatusCode 400 and ResponseCode -8: Server-side validation error');
      console.log('- StatusCode 500 and ResponseCode -2: Something went wrong on server side');
    } catch (error) {
      console.error('Error testing Add to Wishlist API:', error.response?.status || error.message);
      if (error.response?.data) {
        console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    
    
    console.log('\n3. GET WISHLIST ITEMS API');
    console.log('Endpoint: https://api.souqmaria.com/api/MerpecWebApi/getData_JSON');
    console.log('Method: POST');
    console.log('Description: Gets all items in the wishlist');
    
    const getWishlistParams = {
      strQuery: `[Web].[Sp_Templete1_Get_MyWishlist_Apps]'Get_MyWishlist','7975','','','','',1,3044`
    };
    
    console.log('Request parameters:', getWishlistParams);

    try {
      // Test the Get Wishlist Items API
      const getResponse = await axios.post('https://api.souqmaria.com/api/MerpecWebApi/getData_JSON', 
        getWishlistParams
      );
      
      console.log('Get Wishlist Items Response:', JSON.stringify(getResponse.data, null, 2));
      console.log('Response structure:');
      console.log('- success: 1 indicates successful response');
      console.log('- row: Array of wishlist items');
      console.log('- Message: Response message');
    } catch (error) {
      console.error('Error testing Get Wishlist Items API:', error.response?.status || error.message);
      if (error.response?.data) {
        console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
      }
    }
  } catch (error) {
    console.error('Error in testWishlistAPIs:', error.message);
  }

  console.log('\n2. DELETE FROM WISHLIST API');
    console.log('Endpoint: https://api.souqmaria.com/api/MerpecWebApi/CRUD_Wishlist');
    console.log('Method: POST');
    console.log('Description: Removes an item from the wishlist');
    
    const deleteFromWishlistParams = {
      ItemCode: 'IM31790673',
      UserId: '7975', // Use a test user ID
      IpAddress: '127.0.0.1',
      CompanyId: 3044,
      Command: 'Delete'
    };
    
    console.log('Request parameters:', deleteFromWishlistParams);

    try {
      // Test the Delete from Wishlist API
      const deleteResponse = await axios.post('https://api.souqmaria.com/api/MerpecWebApi/CRUD_Wishlist', 
        deleteFromWishlistParams
      );
      
      console.log('Delete from Wishlist Response:', JSON.stringify(deleteResponse.data, null, 2));
      console.log('Response codes explanation:');
      console.log('- StatusCode 200 and ResponseCode 4: Item deleted from wishlist successfully');
      console.log('- StatusCode 200 and ResponseCode -2: Item not deleted from wishlist successfully');
      console.log('- StatusCode 200 and ResponseCode -4: Data not found');
      console.log('- StatusCode 200 and ResponseCode -6: Command not passed');
      console.log('- StatusCode 200 and ResponseCode -10: Something went wrong');
      console.log('- StatusCode 400 and ResponseCode -8: Server-side validation error');
      console.log('- StatusCode 500 and ResponseCode -2: Something went wrong on server side');
    } catch (error) {
      console.error('Error testing Delete from Wishlist API:', error.response?.status || error.message);
      if (error.response?.data) {
        console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
      }
    }
}

// Run the tests
testWishlistAPIs().catch(console.error); 