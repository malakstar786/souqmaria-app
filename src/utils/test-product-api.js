// Test script to debug product fetching from the API
// This script tests different parameter combinations for the product API

const apiUrl = 'https://api.souqmaria.com/api/MerpecWebApi/Get_AllProduct_List';

// Test cases - different parameters to test
const testCases = [
  {
    name: 'Search Term (search bar)',
    params: {
      Company: '3044',
      CultureId: '1',
      PageCode: 'Srch',
      Category: '',
      SubCategory: '',
      SearchName: 'mobile',
      HomePageCatSrNo: '',
      UserId: '',
    }
  },
  {
    name: 'Homepage Category (Mobile)',
    params: {
      Company: '3044',
      CultureId: '1',
      PageCode: 'HPC2',
      Category: '',
      SubCategory: '',
      SearchName: '',
      HomePageCatSrNo: 'HC31790001',
      UserId: '',
    }
  },
  {
    name: 'Homepage Category (Electronics)',
    params: {
      Company: '3044',
      CultureId: '1',
      PageCode: 'HPC2',
      Category: '',
      SubCategory: '',
      SearchName: '',
      HomePageCatSrNo: 'HC31790002', // Example, replace with actual category SrNo
      UserId: '',
    }
  },
  {
    name: 'Menu Category (from browse drawer)',
    params: {
      Company: '3044',
      CultureId: '1',
      PageCode: 'MN',
      Category: 'C001', // Example, replace with actual category code
      SubCategory: '',
      SearchName: '',
      HomePageCatSrNo: '',
      UserId: '',
    }
  }
];

// Function to test a specific case
async function runTest(testCase) {
  console.log(`\n=== Testing: ${testCase.name} ===`);
  
  const queryParams = new URLSearchParams(testCase.params).toString();
  const url = `${apiUrl}?${queryParams}`;
  
  console.log('URL:', url);
  console.log('Params:', testCase.params);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('HTTP Error:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('Response Code:', data.ResponseCode);
    console.log('Message:', data.Message);
    
    // Handle different response structures
    let products = [];
    
    if (data.List && Array.isArray(data.List)) {
      products = data.List;
    } else if (
      data.List && 
      typeof data.List === 'object' && 
      data.List !== null && 
      'Productlist' in data.List && 
      Array.isArray(data.List.Productlist)
    ) {
      products = data.List.Productlist;
    }
    
    if (products.length > 0) {
      console.log(`Found ${products.length} products`);
      console.log('First 3 products:');
      products.slice(0, 3).forEach(product => {
        console.log(`- ${product.Item_XName || 'Unnamed'} (${product.Item_XCode || 'No Code'})`);
      });
    } else {
      console.log('No products found or empty list');
      console.log('Response structure:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run all test cases sequentially
(async () => {
  console.log('=== PRODUCT API TEST SCRIPT ===');
  console.log(`Testing ${testCases.length} cases...\n`);
  
  for (const testCase of testCases) {
    await runTest(testCase);
  }
  
  console.log('\n=== TEST COMPLETED ===');
})(); 