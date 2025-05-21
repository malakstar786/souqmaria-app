const axios = require('axios');
const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi';
const CART_ID = 28447; // From previous test

async function updateCart() {
  try {
    const response = await axios.post(`${API_BASE_URL}/UpdateCartQty`, {
      CartId: CART_ID,
      Qty: 2,
      Company: '3044',
      Location: '304401HO'
    });
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) console.error('Response data:', error.response.data);
  }
}

updateCart(); 