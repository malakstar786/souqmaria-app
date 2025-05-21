const axios = require('axios');
const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi';
const GET_DATA_JSON = '/getData_JSON/';
const userId = ''; // Update with a real user ID for testing

async function getWishlistItems() {
  try {
    const spQuery = `[Web].[Sp_Templete1_Get_MyWishlist_Apps] 'Get_MyWishlist','${userId}','','','','',1,3044`;
    
    const response = await axios.post(`${API_BASE_URL}${GET_DATA_JSON}`, {
      strQuery: spQuery
    });
    
    console.log('Wishlist API Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success === 1 && Array.isArray(response.data.row)) {
      console.log('Wishlist Items:', response.data.row.length);
      
      // Check each item's image URL field
      response.data.row.forEach((item, index) => {
        console.log(`Item ${index + 1}:`);
        console.log(`  ItemCode: ${item.ItemCode}`);
        console.log(`  ItemName: ${item.ItemName}`);
        console.log(`  ItemImage: ${item.ItemImage}`);
        console.log(`  Price: ${item.OnlineActualPrice}`);
      });
    } else {
      console.log('No wishlist items found');
    }
  } catch (error) {
    console.error('Error getting wishlist items:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

getWishlistItems(); 