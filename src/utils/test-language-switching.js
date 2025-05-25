// Test script to verify language switching functionality
// Run this with: node test-language-switching.js

const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';

async function testLanguageSwitching() {
  console.log('🧪 Testing Language Switching Functionality\n');
  
  // Test 1: English Categories (CultureId = 1)
  console.log('📋 Test 1: Fetching categories in English (CultureId = 1)');
  try {
    const englishResponse = await fetch(`${API_BASE_URL}getData_JSON/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        strQuery: "[Web].[Sp_Get_SM_Apps]'Get_HomePage_Category_List','','','','','',1,3044,''"
      })
    });
    
    const englishData = await englishResponse.json();
    console.log('✅ English Categories:');
    englishData.row.slice(0, 3).forEach(cat => {
      console.log(`   - ${cat.CategoryName || cat.CategoryNameEN}`);
    });
  } catch (error) {
    console.log('❌ Error fetching English categories:', error.message);
  }
  
  console.log('');
  
  // Test 2: Arabic Categories (CultureId = 2)
  console.log('📋 Test 2: Fetching categories in Arabic (CultureId = 2)');
  try {
    const arabicResponse = await fetch(`${API_BASE_URL}getData_JSON/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        strQuery: "[Web].[Sp_Get_SM_Apps]'Get_HomePage_Category_List','','','','','',2,'3044',''"
      })
    });
    
    const arabicData = await arabicResponse.json();
    console.log('✅ Arabic Categories:');
    arabicData.row.slice(0, 3).forEach(cat => {
      console.log(`   - ${cat.CategoryName || cat.CategoryNameAR}`);
    });
  } catch (error) {
    console.log('❌ Error fetching Arabic categories:', error.message);
  }
  
  console.log('');
  
  // Test 3: Product Details in English
  console.log('📱 Test 3: Fetching product details in English (CultureId = 1)');
  try {
    const englishProductResponse = await fetch(`${API_BASE_URL}getData_JSON/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        strQuery: "[Web].[Sp_Get_SM_Apps]'Get_ProductDetails_ByItemCode','IM31790066','304401HO','','','',1,'3044',''"
      })
    });
    
    const englishProductData = await englishProductResponse.json();
    if (englishProductData.row && englishProductData.row.length > 0) {
      console.log('✅ English Product:', englishProductData.row[0].ItemName);
    } else {
      console.log('⚠️  No English product data found');
    }
  } catch (error) {
    console.log('❌ Error fetching English product:', error.message);
  }
  
  console.log('');
  
  // Test 4: Product Details in Arabic
  console.log('📱 Test 4: Fetching product details in Arabic (CultureId = 2)');
  try {
    const arabicProductResponse = await fetch(`${API_BASE_URL}getData_JSON/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        strQuery: "[Web].[Sp_Get_SM_Apps]'Get_ProductDetails_ByItemCode','IM31790066','304401HO','','','',2,'3044',''"
      })
    });
    
    const arabicProductData = await arabicProductResponse.json();
    if (arabicProductData.row && arabicProductData.row.length > 0) {
      console.log('✅ Arabic Product:', arabicProductData.row[0].ItemName);
    } else {
      console.log('⚠️  No Arabic product data found');
    }
  } catch (error) {
    console.log('❌ Error fetching Arabic product:', error.message);
  }
  
  console.log('\n🎯 Summary:');
  console.log('If you see different content for English vs Arabic above, the API is working correctly.');
  console.log('The mobile app should now use dynamic CultureId based on language selection.');
  console.log('\n📝 Next Steps:');
  console.log('1. Test the app by switching language from Account > Language');
  console.log('2. Verify that categories, products, and other content change language');
  console.log('3. Check the console logs to see CultureId values in API calls');
}

testLanguageSwitching().catch(console.error); 