// Test script to fetch product details from the API

const fetch = require('node-fetch');

const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';
const COMMON_PARAMS = {
  Company: '3044',
  Location: '304401HO',
};
const CULTURE_IDS = {
  ENGLISH: '1',
};

async function getProductDetailsByItemCode(itemCode, location, cultureId, userId) {
  const strQuery = `[Web].[Sp_Get_SM_Apps] 'Get_ProductDetails_ByItemCode','${itemCode}','${location}','','','',${cultureId},${COMMON_PARAMS.Company},'${userId}'`;
  
  const payload = { strQuery };
  
  try {
    const response = await fetch(`${API_BASE_URL}getData_JSON/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

async function getSpecialDescriptionListByItemCode(itemCode, cultureId, userId) {
  const strQuery = `[Web].[Sp_Get_SM_Apps] 'Get_Special_Description_List_ByItemCode','${itemCode}','','','','',${cultureId},${COMMON_PARAMS.Company},'${userId}'`;
  
  const payload = { strQuery };
  
  try {
    const response = await fetch(`${API_BASE_URL}getData_JSON/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error fetching special descriptions:', error);
    return null;
  }
}

async function testProductDetailsFetch() {
  // Test with a sample product ID - this would need to be a valid product ID in your system
  const productId = '10101010'; // Replace with a valid ID
  
  console.log(`Fetching details for product ID: ${productId}`);
  
  try {
    const detailsResponse = await getProductDetailsByItemCode(
      productId,
      COMMON_PARAMS.Location,
      CULTURE_IDS.ENGLISH,
      '' // No user ID for this test
    );
    
    console.log('Product details API response:');
    console.log(JSON.stringify(detailsResponse, null, 2));
    
    if (detailsResponse && detailsResponse.success === 1 && Array.isArray(detailsResponse.row) && detailsResponse.row.length > 0) {
      const productData = detailsResponse.row[0];
      console.log('\nProduct data fields:', Object.keys(productData));
      console.log('\nImage field value:', productData.Item_Image1);
      
      // Test description API
      const descriptionResponse = await getSpecialDescriptionListByItemCode(
        productId,
        CULTURE_IDS.ENGLISH,
        '' // No user ID for this test
      );
      
      console.log('\nDescription API response:');
      console.log(JSON.stringify(descriptionResponse, null, 2));
      
    } else {
      console.log('\nProduct not found or API returned an error.');
    }
  } catch (error) {
    console.error('Error running test:', error);
  }
}

// Run the test
testProductDetailsFetch();
