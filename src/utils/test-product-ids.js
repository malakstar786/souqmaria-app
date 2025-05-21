// Test script to find valid product IDs
const axios = require('axios');

const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';

// Common parameters for API calls
const COMMON_PARAMS = {
  Company: '3044',
  CultureId: '1' // English
};

// Homepage Categories to try (from homepage category API)
const HOMEPAGE_CATEGORIES = [
  { id: 'HC31790001', name: 'Mobile' },
  { id: 'HC31790002', name: 'Tablets' },
  { id: 'HC31790003', name: 'Accessories' },
  { id: 'HC31790004', name: 'Speakers & Headphones' },
  { id: 'HC31790005', name: 'Smartwatches' },
  { id: 'HC31790006', name: 'Electronics Appliances' }
];

// Search terms to try
const SEARCH_TERMS = ['mobile', 'tablet', 'headphone', 'watch', 'phone', 'samsung', 'apple'];

// Sample product IDs from manual testing (if available)
const SAMPLE_PRODUCT_IDS = ['IM31110511', 'MT300000010020'];

async function findValidProductIds() {
  console.log('Searching for valid product IDs...');
  
  // First try sample product IDs if available
  for (const productId of SAMPLE_PRODUCT_IDS) {
    console.log(`\nTrying sample product ID: ${productId}`);
    const detailsFound = await testProductDetails(productId);
    if (detailsFound) {
      console.log(`\nSUCCESS: Found valid product ID: ${productId}`);
      return;
    }
  }
  
  // Try products from each homepage category
  for (const category of HOMEPAGE_CATEGORIES) {
    console.log(`\nTrying homepage category ${category.id} (${category.name})...`);
    const products = await getProductsByHomepageCategory(category.id);
    
    if (products.List && products.List.length > 0) {
      console.log(`Found ${products.List.length} products in category!`);
      console.log('First 5 item codes:');
      
      const validItems = products.List.filter(p => p.ItemCode);
      
      validItems.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.ItemCode}`);
      });
      
      // Test the first valid product
      if (validItems.length > 0) {
        const validId = validItems[0].ItemCode;
        console.log(`\nTesting product with ID: ${validId}`);
        
        const detailsFound = await testProductDetails(validId);
        if (detailsFound) {
          console.log(`\nSUCCESS: Found valid product ID: ${validId}`);
          return;
        }
      }
    } else {
      console.log(`No products found in category ${category.name}`);
    }
  }
  
  // Try different search terms
  for (const term of SEARCH_TERMS) {
    console.log(`\nTrying search for "${term}"...`);
    const searchResults = await searchProducts(term);
    
    if (searchResults.List && searchResults.List.length > 0) {
      console.log(`Found ${searchResults.List.length} products in search!`);
      console.log('First 5 item codes:');
      
      const validItems = searchResults.List.filter(p => p.ItemCode);
      
      validItems.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.ItemCode}`);
      });
      
      // Test the first valid product
      if (validItems.length > 0) {
        const validId = validItems[0].ItemCode;
        console.log(`\nTesting product with ID: ${validId}`);
        
        const detailsFound = await testProductDetails(validId);
        if (detailsFound) {
          console.log(`\nSUCCESS: Found valid product ID: ${validId}`);
          return;
        }
      }
    } else {
      console.log(`No search results found for "${term}"`);
    }
  }
  
  console.log('\nNo valid product IDs found after all attempts.');
}

async function getProductsByHomepageCategory(categoryId) {
  console.log(`Fetching products for homepage category ${categoryId}...`);
  
  try {
    const params = {
      PageCode: 'HPC2',
      HomePageCatSrNo: categoryId,
      Category: '',
      SubCategory: '',
      SearchName: '',
      UserId: '',
      Company: COMMON_PARAMS.Company,
      CultureId: COMMON_PARAMS.CultureId
    };
    
    const response = await axios.get(`${API_BASE_URL}Get_AllProduct_List`, { params });
    console.log('API response status:', response.status);
    console.log('Response code:', response.data.ResponseCode);
    console.log('Message:', response.data.Message);
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error.message);
    return { List: [] };
  }
}

async function searchProducts(searchTerm) {
  console.log(`Searching for products with term "${searchTerm}"...`);
  
  try {
    const params = {
      PageCode: 'Srch',
      HomePageCatSrNo: '',
      Category: '',
      SubCategory: '',
      SearchName: searchTerm,
      UserId: '',
      Company: COMMON_PARAMS.Company,
      CultureId: COMMON_PARAMS.CultureId
    };
    
    const response = await axios.get(`${API_BASE_URL}Get_AllProduct_List`, { params });
    console.log('API response status:', response.status);
    console.log('Response code:', response.data.ResponseCode);
    console.log('Message:', response.data.Message);
    
    return response.data;
  } catch (error) {
    console.error(`Error searching for "${searchTerm}":`, error.message);
    return { List: [] };
  }
}

async function testProductDetails(itemCode) {
  console.log(`Fetching product details for ${itemCode}...`);
  const query = `[Web].[Sp_Get_SM_Apps] 'Get_ProductDetails_ByItemCode','${itemCode}','304401HO','','','','1','3044',''`;
  
  try {
    const response = await axios.post(`${API_BASE_URL}getData_JSON/`, {
      strQuery: query
    });
    
    if (response.data.success === 1 && 
        Array.isArray(response.data.row) && 
        response.data.row.length > 0) {
      
      const productData = response.data.row[0];
      
      // Print all available fields
      console.log('\nProduct Data Keys:', Object.keys(productData).sort());
      
      // Print essential details
      console.log('\nProduct Details:');
      console.log('- Name:', productData.Item_XName);
      console.log('- Description:', productData.Item_Desc);
      console.log('- Small Description:', productData.Small_Desc);
      console.log('- Brand:', productData.Brand_XName);
      console.log('- Barcode:', productData.BarCodeNo);
      console.log('- Price (New):', productData.NewPrice);
      console.log('- Price (Old):', productData.OldPrice);
      console.log('- Discount:', productData.Discount);
      console.log('- Image Path:', productData.Item_Image1);
      
      // Get special description
      await getSpecialDescriptions(itemCode);
      
      return true; // Product details found successfully
    } else {
      console.log('Product details not found or API error');
      if (response.data) {
        console.log('Response success:', response.data.success);
        console.log('Response message:', response.data.Message);
      }
      return false;
    }
  } catch (error) {
    console.error('Error fetching product details:', error.message);
    return false;
  }
}

async function getSpecialDescriptions(itemCode) {
  console.log(`\nFetching special descriptions for ${itemCode}...`);
  const query = `[Web].[Sp_Get_SM_Apps] 'Get_Special_Description_List_ByItemCode','${itemCode}','','','','','1','3044',''`;
  
  try {
    const response = await axios.post(`${API_BASE_URL}getData_JSON/`, {
      strQuery: query
    });
    
    if (response.data.success === 1 && 
        Array.isArray(response.data.row) && 
        response.data.row.length > 0) {
      
      console.log('\nProduct Special Descriptions:');
      console.log('Total descriptions:', response.data.row.length);
      
      // Print first description item fields
      console.log('Description Item Fields:', Object.keys(response.data.row[0]).sort());
      
      // Print each description
      response.data.row.forEach((desc, index) => {
        console.log(`\nDescription #${index + 1}:`);
        console.log('- SpecialDesc:', desc.SpecialDesc);
        // Print other fields if available
        Object.keys(desc).forEach(key => {
          if (key !== 'SpecialDesc') {
            console.log(`- ${key}:`, desc[key]);
          }
        });
      });
      
      return true;
    } else {
      console.log('\nNo special descriptions found for this product');
      if (response.data) {
        console.log('Response success:', response.data.success);
        console.log('Response message:', response.data.Message);
      }
      return false;
    }
  } catch (error) {
    console.error('Error fetching special descriptions:', error.message);
    return false;
  }
}

// Run the test
findValidProductIds(); 