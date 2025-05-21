const axios = require('axios');
const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi';
const CART_GET_ENDPOINT = '/getData_JSON/';
const UNIQUE_ID = 'test-1747835458618'; // The unique ID from previous test

async function getCartItems() {
  try {
    const spQuery = `[Web].[SP_Template1_Get_CartProductsDetails_Apps]'','127.0.0.1','${UNIQUE_ID}','3044',1`;
    
    const response = await axios.post(`${API_BASE_URL}${CART_GET_ENDPOINT}`, {
      strQuery: spQuery
    });
    
    const cartData = response.data;
    console.log('Cart Data Response:', JSON.stringify(cartData, null, 2));
    
    if (cartData.success === 1 && Array.isArray(cartData.row)) {
      console.log(`Found ${cartData.row.length} items in cart`);
      console.log('Cart items details:', cartData.row.map(item => ({
        CartID: item.CartID || item.CartId,
        ProductName: item.ProductName,
        Quantity: item.Quantity,
        Price: item.Price,
        SubTotal: item.SubTotal
      })));
      
      // Calculate total quantities
      const totalQuantity = cartData.row.reduce((total, item) => total + (Number(item.Quantity) || 0), 0);
      const totalItems = cartData.row.length;
      console.log(`Total unique items: ${totalItems}, Total quantity: ${totalQuantity}`);
    } else {
      console.log('No items in cart or error occurred');
    }
  } catch (error) {
    console.error('Error getting cart items:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

getCartItems(); 