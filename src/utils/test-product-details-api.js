// Test script to debug product details API
const axios = require('axios');

const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';
const PRODUCT_IMAGE_BASE_URL = 'https://erp.merpec.com/Upload/CompanyLogo/3044/';

// Test different product IDs
const PRODUCT_IDS = [
  'IM31110511',    // From previous tests
  'MT300000010020' // Another product ID to try
];

async function testProductDetails() {
  for (const productId of PRODUCT_IDS) {
    console.log(`\n\n===== Testing product details for ID: ${productId} =====\n`);
    
    try {
      // 1. Get product details
      const productDetailsResponse = await getProductDetails(productId);
      
      if (productDetailsResponse.data.success === 1 && 
          Array.isArray(productDetailsResponse.data.row) && 
          productDetailsResponse.data.row.length > 0) {
        
        const productData = productDetailsResponse.data.row[0];
        
        // Print all available fields
        console.log('Product Data Keys:', Object.keys(productData));
        
        // Print essential details
        console.log('\nProduct Details:');
        console.log('- Name:', productData.Item_XName);
        console.log('- Description:', productData.Item_Desc);
        console.log('- Brand:', productData.Brand_XName);
        console.log('- Barcode:', productData.BarCodeNo);
        console.log('- Price (New):', productData.NewPrice);
        console.log('- Price (Old):', productData.OldPrice);
        console.log('- Discount:', productData.Discount);
        console.log('- Image Path:', productData.Item_Image1);
        
        // Construct full image URL
        const imageUrl = productData.Item_Image1 
          ? `${PRODUCT_IMAGE_BASE_URL}${productData.Item_Image1}` 
          : 'No image available';
        console.log('- Full Image URL:', imageUrl);
        
        // 2. Get product special descriptions
        const descriptionResponse = await getSpecialDescriptions(productId);
        
        if (descriptionResponse.data.success === 1 && 
            Array.isArray(descriptionResponse.data.row) && 
            descriptionResponse.data.row.length > 0) {
          
          console.log('\nProduct Special Descriptions:');
          console.log('Total descriptions:', descriptionResponse.data.row.length);
          
          // Print first description item fields
          console.log('Description Item Fields:', Object.keys(descriptionResponse.data.row[0]));
          
          // Print each description
          descriptionResponse.data.row.forEach((desc, index) => {
            console.log(`\nDescription #${index + 1}:`);
            console.log('- SpecialDesc:', desc.SpecialDesc);
            // Print other fields if available
            Object.keys(desc).forEach(key => {
              if (key !== 'SpecialDesc') {
                console.log(`- ${key}:`, desc[key]);
              }
            });
          });
        } else {
          console.log('\nNo special descriptions found for this product');
        }
      } else {
        console.log('Product not found or API error');
      }
    } catch (error) {
      console.error('Error fetching product details:', error.message);
    }
  }
}

async function getProductDetails(itemCode) {
  console.log(`Fetching product details for ${itemCode}...`);
  const query = `[Web].[Sp_Get_SM_Apps] 'Get_ProductDetails_ByItemCode','${itemCode}','304401HO','','','','1','3044',''`;
  
  return await axios.post(`${API_BASE_URL}getData_JSON/`, {
    strQuery: query
  });
}

async function getSpecialDescriptions(itemCode) {
  console.log(`Fetching special descriptions for ${itemCode}...`);
  const query = `[Web].[Sp_Get_SM_Apps] 'Get_Special_Description_List_ByItemCode','${itemCode}','','','','','1','3044',''`;
  
  return await axios.post(`${API_BASE_URL}getData_JSON/`, {
    strQuery: query
  });
}

// Run the test
testProductDetails(); 