// API configuration constants

export const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi/';

// Common parameters used across all API requests
export const COMMON_PARAMS = {
  CompanyId: '3044',
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
  // Data fetching
  GET_DATA_JSON: '/getData_JSON/',
  // Add other endpoints here
};

// Response codes
export const RESPONSE_CODES = {
  SUCCESS: '2',
  SUCCESS_ALT: 2,
  CREATED: '2',
  UPDATED_SUCCESS: '2',
  SHIPPING_ADDRESS_UPDATE_SUCCESS: '4',
  DELETED_SUCCESS: '6',
  INVALID_CREDENTIALS: '-2',
  EMAIL_EXISTS: '-4',
  MOBILE_EXISTS: '-6',
  USER_NOT_FOUND: '-4',
  UPDATE_NOT_SUCCESSFUL: '-2',
  SAVE_NOT_SUCCESSFUL: '-2',
  DELETE_NOT_SUCCESSFUL: '-2',
  COMMAND_NOT_PASSED: '-12',
  SERVER_VALIDATION_ERROR: '-8',
  GENERAL_ERROR: '-10',
  SERVER_ERROR: '-2',
  EMAIL_NOT_MATCHED_PROFILE: '-2',
  // Used for checking API responses in lowercase format as well
  success: '2',
  success_alt: 2,
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
    `[Web].[Sp_Manage_Address_Apps_SM] 'Get_BillingAddress_List','${userId}','','','','',1,3044`,
  GET_SHIPPING_ADDRESSES: (userId: string) => 
    `[Web].[Sp_Manage_Address_Apps_SM] 'Get_ShippingAddress_List','${userId}','','','','',1,3044`,
  
  // Order queries
  GET_MY_ORDERS: (userId: string, cultureId: string = '1') => 
    `[Web].[Sp_Template1_Get_MyOrders_Apps] 'Get_MyOrders_Parent','${userId}','','','CurrencyXName','CurrencyXCode',3044,${cultureId}`,
  GET_ORDER_DETAILS: (userId: string, orderNo: string, cultureId: string = '1') => 
    `[Web].[Sp_Template1_Get_MyOrders_Apps] 'Get_MyOrders_Child','${userId}','${orderNo}','','CurrencyXName','CurrencyXCode',3044,${cultureId}`,
    
  // Category queries
  GET_CATEGORY_LIST: (cultureId: string = '1', userId: string = '') => 
    `[Web].[Sp_Get_SM_Apps] 'Get_HomePage_Category_List','','','','','',${cultureId},3044,'${userId}'`,
}; 