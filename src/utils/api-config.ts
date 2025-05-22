// API configuration constants

export const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';

// Product Image Base URL
export const PRODUCT_IMAGE_BASE_URL = 'https://erp.merpec.com/Upload/CompanyLogo/3044/';

// Common parameters used across all API requests
export const COMMON_PARAMS = {
  Company: '3044',
  Location: '304401HO',
  Salesman: '3044SMOL',
};

// Culture IDs for language selection
export const CULTURE_IDS = {
  ENGLISH: '1',
  ARABIC: '2',
};

// API endpoints
export const ENDPOINTS = {
  // Authentication endpoints
  REGISTER_USER: '/SaveUserRegistration/',
  LOGIN_USER: '/UserLogin/',
  UPDATE_USER_DETAILS: '/Update_Account_Info/',
  FORGOT_PASSWORD: '/ForgetPassword/',
  // Billing Address
  CRUD_BILLING_ADDRESS: '/CRUD_Billing_Manage_Address/',
  // Shipping Address
  CRUD_SHIPPING_ADDRESS: '/CRUD_Shipping_Manage_Address/',
  // Wishlist
  CRUD_WISHLIST: '/CRUD_Wishlist/',
  // Promo Code 
  APPLY_PROMO_CODE: '/Apply_PromoCode/',
  REMOVE_PROMO_CODE: '/Remove_PromoCode/',
  // Data fetching
  GET_DATA_JSON: '/getData_JSON/',
  GET_ALL_PRODUCT_LIST_DIRECT: 'Get_AllProduct_List',
  GET_ALL_PRODUCT_LIST_FILTER: 'Get_AllProduct_List_FilterApply',
  // Add other endpoints here
  GET_MENU_SUB_CATEGORIES: 'Get_Menu_SubCategory_List_ByCategory',
  SEARCH_ITEMS: 'getData_JSON/',
};

// Response codes
export const RESPONSE_CODES = {
  SUCCESS: 200,
  SUCCESS_ALT: 2,       // Success code returned from some endpoints like AddToCart
  FAILURE: 400,
  SERVER_ERROR: 500,
  GENERAL_ERROR: -1000,

  // API-specific string response codes
  CREATED: '2',
  UPDATED_SUCCESS: '2',
  DELETED_SUCCESS: '2',
  NOT_FOUND: '0',
  DUPLICATE_USER: '-1',
  VALIDATION_FAILED: '-3',
  COMMAND_NOT_PASSED: '-12',
  SERVER_VALIDATION_ERROR: '-8',
  SERVER_VALIDATION_ERROR_ALT: '-6', // Alternative validation error code
  GENERAL_ERROR_STR: '-10',
  SERVER_ERROR_STR: '-2',
  EMAIL_NOT_MATCHED_PROFILE: '-2',
  
  // AddToCart response codes
  CART_ADDED: 2,           // Item added to cart successfully
  CART_UPDATED: 4,         // Item already in cart, quantity updated
  CART_OUT_OF_STOCK: -4,   // Stock not available
  CART_ERROR: -10,         // General error in add to cart
  
  // Promo Code response codes
  PROMO_APPLY_SUCCESS: '2',             // Promo code applied successfully
  PROMO_APPLY_FAILURE: '-2',           // Promo code not applied
  PROMO_INVALID_DISCOUNT: '-4',        // Invalid discount code
  PROMO_INVALID_DISCOUNT_ALT: '-6',    // Invalid discount code (alternative)
  PROMO_MIN_CART_VALUE: '-8',          // Minimum cart value requirement not met
  PROMO_ITEMS_NOT_IN_CART: '-10',      // Promo items not available in cart
  PROMO_INVALID_CODE: '-12',           // Invalid promo code
  PROMO_INVALID_CODE_ALT: '-14',       // Invalid promo code (alternative)
  PROMO_LOGIN_REQUIRED: '-16',         // Login required to use promo code
  PROMO_CART_ITEM_INVALID: '-18',      // Cart item is not valid
  PROMO_GENERAL_ERROR: '-20',          // General error in promo code application
  
  // Promo Code Remove response codes
  PROMO_REMOVE_SUCCESS: '2',           // Promo code removed successfully
  PROMO_REMOVE_FAILURE: '-2',          // Promo code not removed
  PROMO_REMOVE_ERROR: '-10',           // General error in promo code removal

  // Other API-specific codes can be added here
  INVALID_CREDENTIALS: '-2',
  EMAIL_EXISTS: '-4',
  MOBILE_EXISTS: '-6',
  USER_NOT_FOUND: '-4',
  LIST_NOT_FOUND: '-4',
  UPDATE_NOT_SUCCESSFUL: '-2',
  SAVE_NOT_SUCCESSFUL: '-2',
  DELETE_NOT_SUCCESSFUL: '-2',
  AUTH_FAILED: 401,
  VALIDATION_ERROR: 422,
  success: '2',
  success_alt: 2,
  SHIPPING_ADDRESS_UPDATE_SUCCESS: '4',

  // Cart update response codes
  CART_UPDATED_SUCCESS: 2,      // Item quantity updated successfully
  CART_UPDATE_FAILED: -2,       // Item quantity update failed
  CART_STOCK_UNAVAILABLE: -4,   // Stock not available for requested quantity
  CART_UPDATE_ERROR: -10,       // Something went wrong during update
  CART_SERVER_ERROR: -6,        // Server-side validation error
  
  // Cart delete response codes
  CART_DELETED_SUCCESS: 2,      // Item deleted successfully
  CART_DELETE_FAILED: -2,       // Item delete failed
  CART_ITEM_NOT_FOUND: -4,      // Item not found in cart
  CART_DELETE_ERROR: -10,       // Something went wrong during delete
};

// Platform identifiers for the Source parameter
export const PLATFORM = {
  ANDROID: 'Android',
  IOS: 'iOS',
};

// Stored procedure queries
export const SP_QUERIES = {
  // Location data queries
  GET_COUNTRY_LIST: "[Web].[Sp_Manage_Address_Apps_SM] 'Get_Country_List','','','','','',1,3044",
  GET_STATE_LIST: (countryXcode: string) => `[Web].[Sp_Manage_Address_Apps_SM] 'Get_State_List','${countryXcode}','','','','',1,3044`,
  GET_CITY_LIST: (stateXcode: string) => `[Web].[Sp_Manage_Address_Apps_SM] 'Get_City_List','${stateXcode}','','','','',1,3044`,
  
  // Address listing queries
  GET_BILLING_ADDRESSES: (userId: string) => 
    `[Web].[Sp_Manage_Address_Apps_SM]'Get_BillingAddress_List','${userId}','','','','',1,3044`,
  GET_SHIPPING_ADDRESSES: (userId: string) => 
    `[Web].[Sp_Manage_Address_Apps_SM]'Get_ShippingAddress_List','${userId}','','','','',1,3044`,
  
  // Order queries
  GET_MY_ORDERS: (userId: string, cultureId: string = '1') => 
    `[Web].[Sp_Template1_Get_MyOrders_Apps]'Get_MyOrders_Parent','${userId}','','','CurrencyXName','CurrencyXCode',${COMMON_PARAMS.Company},${cultureId}`,
  GET_ORDER_DETAILS: (userId: string, orderNo: string, cultureId: string = '1') => 
    `[Web].[Sp_Template1_Get_MyOrders_Apps]'Get_MyOrders_Child','${userId}','${orderNo}','','CurrencyXName','CurrencyXCode',${COMMON_PARAMS.Company},${cultureId}`,
    
  // Promo code queries
  GET_PROMO_CODES_LIST: (cultureId: string = '1') =>
    `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Promo_Coupons_List','','','','','',${cultureId},${COMMON_PARAMS.Company},'',''`,
  
  // Category queries
  GET_CATEGORY_LIST: (cultureId: string = '1', userId: string = '') => 
    `[Web].[Sp_Get_SM_Apps]'Get_HomePage_Category_List','','','','','',${cultureId},${COMMON_PARAMS.Company},'${userId}'`,
  
  GET_ALL_CATEGORY_LIST: (cultureId: string = '1', userId: string = '') => 
    `[Web].[Sp_Get_SM_Apps]'Get_All_HomePage_Category_List','','','','','',${cultureId},${COMMON_PARAMS.Company},'${userId}'`,
  
  // Banner queries
  GET_BANNER_LIST: (cultureId: string = '1', userId: string = '') =>
    `[Web].[Sp_Get_SM_Apps]'Get_Banner_List','','','','','',${cultureId},${COMMON_PARAMS.Company},'${userId}'`,
  
  // Advertisement queries
  GET_ADVERTISEMENT_LIST: (cultureId: string = '1', userId: string = '') =>
    `[Web].[Sp_Get_SM_Apps]'Get_Ads_List','','','','','',${cultureId},${COMMON_PARAMS.Company},'${userId}'`,

  // Menu / Browse Drawer queries
  GET_MENU_CATEGORY_LIST: (cultureId: string = '1', userId: string = '') =>
    `[Web].[Sp_Get_SM_Apps]'Get_Menu_Category_List','','','','','',${cultureId},${COMMON_PARAMS.Company},'${userId}'`,
  GET_MENU_SUBCATEGORY_LIST: (categoryXcode: string, cultureId: string = '1', userId: string = '') =>
    `[Web].[Sp_Get_SM_Apps]'Get_Menu_SubCategory_List_ByCategory','${categoryXcode}','','','','','${cultureId}','${COMMON_PARAMS.Company}','${userId}'`,

  // Search query
  GET_ITEM_NAME_LIST_BY_SEARCH: (searchText: string, cultureId: string = '1', userId: string = '') =>
    `[Web].[Sp_Get_SM_Apps]'Get_ItemName_List_BySearch','${searchText}','','','','',${cultureId},${COMMON_PARAMS.Company},'${userId}'`,

  // Product Listing and Details (SP based, for details)
  GET_PRODUCT_DETAILS_BY_ITEM_CODE: (
    itemCode: string, 
    location: string, 
    cultureId: string = '1', 
    userId: string = ''
  ) => 
    `[Web].[Sp_Get_SM_Apps]'Get_ProductDetails_ByItemCode','${itemCode}','${location}','','','',${cultureId},${COMMON_PARAMS.Company},'${userId}'`,
    
  // Product Special Description
  GET_SPECIAL_DESCRIPTION_LIST_BY_ITEM_CODE: (
    itemCode: string,
    cultureId: string = '1',
    userId: string = ''
  ) =>
    `[Web].[Sp_Get_SM_Apps]'Get_Special_Description_List_ByItemCode','${itemCode}','','','','',${cultureId},${COMMON_PARAMS.Company},'${userId}'`,

  // Related Products
  GET_RELATED_PRODUCTS_LIST_BY_ITEM_CODE: (
    itemCode: string,
    cultureId: string = '1',
    userId: string = ''
  ) =>
    `[Web].[Sp_Get_SM_Apps]'Get_Related_Products_List_ByItemCode','${itemCode}','','','','',${cultureId},${COMMON_PARAMS.Company},'${userId}'`,

  // Cart queries
  GET_CART_PRODUCTS: (userId: string = '', uniqueId: string, cultureId: string = '1') => 
    `[Web].[SP_Template1_Get_CartProductsDetails_Apps]'${userId}','127.0.0.1','${uniqueId}',${COMMON_PARAMS.Company},${cultureId}`,
}; 