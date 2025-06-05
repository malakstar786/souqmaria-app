import { Platform } from 'react-native';
import { 
  API_BASE_URL, 
  ENDPOINTS, 
  RESPONSE_CODES, 
  PLATFORM,
  SP_QUERIES,
  COMMON_PARAMS,
  CULTURE_IDS,
} from './api-config';
import axios from 'axios';
import useLanguageStore from '../store/language-store';
import { withCache } from './api-cache';

// Types for API requests and responses
export interface ApiResponse<T = any> {
  StatusCode?: number; // Optional, as it might not always be present
  ResponseCode: string | number; // API seems to return as string sometimes, like "-4"
  Message: string;
  Data?: T;
  TrackId?: string | null; // As seen in the log
  DiscountAmount?: number; // Added for promo code responses
  UserDetails?: {
    UserID: string;
    FullName: string;
    Email: string;
    Mobile: string;
    UserName?: string | null;
    Password?: string;
  };
}

// Common type for address location data (country, state, city)
export interface LocationItem {
  Xcode: string;
  NameE: string;
  NameA?: string; // Optional Arabic name
}

// API response for location data
export interface LocationDataResponse {
  success: number;
  rows: LocationItem[];
}

// API response for checkout location data (different structure)
export interface CheckoutLocationDataResponse {
  success: number;
  row: CheckoutLocationItem[];
  Message: string;
}

// Location item for checkout APIs
export interface CheckoutLocationItem {
  XCode: number;
  XName: string;
}

interface RegisterUserParams {
  FullName: string;
  Email: string;
  Mobile: string;
  Password: string;
  // IpAddress is handled internally
}

// Login User
interface LoginUserParams {
  userName: string; // Email or Mobile No. - lowercase to match API
  password: string; // lowercase to match API
}

// Add interface for UpdateUserDetails payload
interface UpdateUserDetailsPayload {
  FullName: string;
  Email: string;
  Mobile: string;
  Password?: string; // Optional
  UserId: string;
  IpAddress: string;
  CompanyId: number;
}

export interface SaveBillingAddressPayload {
  BillingAddressId: number; // 0 for new
  FullName: string;
  Email: string;
  Mobile: string;
  Address2: string;
  Country: string;
  State: string;
  City: string;
  Block: string;
  Street: string;
  House: string;
  Apartment: string;
  IsDefault: boolean | 0 | 1;
  Command: string; // 'Save'
  UserId: string;
  CompanyId: number; // Not changing CompanyId here since address endpoints expect CompanyId
  IpAddress: string;
}

export interface DeleteBillingAddressPayload {
  BillingAddressId: number;
  UserId: string;
  IpAddress: string;
  CompanyId: number;
  Command: string; // 'Delete'
}

// Shipping Address Payloads
export interface SaveShippingAddressPayload {
  ShippingAddressId: number; // 0 for new
  FullName: string;
  Email: string;
  Mobile: string;
  Address2: string;
  Country: string;
  State: string;
  City: string;
  Block: string;
  Street: string;
  House: string;
  Apartment: string;
  IsDefault: boolean | 0 | 1;
  Command: string; // 'Save'
  UserId: string;
  CompanyId: number;
  IpAddress: string;
}

export interface DeleteShippingAddressPayload {
  ShippingAddressId: number;
  UserId: string;
  IpAddress: string;
  CompanyId: number;
  Command: string; // 'Delete'
}

// Forgot Password Payload
interface ForgotPasswordPayload {
  Email: string;
  CompanyId: number;
}

// Get Data JSON Payload
export interface GetDataJsonPayload {
  strQuery: string;
}

// Add type definitions for location API responses
export interface LocationResponse {
  success: number;
  row: Array<{
    XCode: number;
    XName: string;
  }>;
  Message: string;
}

// Menu Category Interfaces
export interface MenuCategory {
  XCode: string;
  XName: string;
  // Add any other fields that come from the API for main categories
}

export interface MenuSubCategory {
  XCode: string;
  XName: string;
  // Add any other fields that come from the API for subcategories
}

// Search Item Interface
export interface SearchItem {
  XName: string;
  XCode: string;
  // Add any other relevant fields from the search API response, e.g., image, price
}

// Product List Item Interface (from Get_AllProduct_List)
export interface ProductListItem {
  ItemCode: string; // Assuming this is the key field returned
  // Potentially other minimal details if provided by Get_AllProduct_List
  [key: string]: any; // Allow other properties as we don't know the full structure
}

// Product List Item Interface (from Get_AllProduct_List direct HTTP call)
export interface DirectProductListItem {
  Item_XCode: string;        // Product code
  Item_XName: string;        // Product name  
  Item_Image1: string;       // Product image filename
  OldPrice: number;          // Original price
  Discount: number;          // Discount amount
  NewPrice: number;          // Current price
  IsWishListItem: boolean;   // Whether item is in wishlist
  Last_CategoryName: string; // Category name
  StockQty: number;          // NEW: Stock quantity (0 = out of stock)
  IsNewArrival: boolean;     // NEW: Whether item is a new arrival
  [key: string]: any;        // Allow other properties
}

// API response for the direct Get_AllProduct_List HTTP call
export interface AllProductsDirectResponse {
  List: {
    Productlist: DirectProductListItem[];
    li_Brand_List: FilterOption[];
    li_Category_List: FilterOption[];
    li_SubCategory_List: FilterOption[];
    li_SortBy_List: FilterOption[];
    MinPrice: number;
    MaxPrice: number;
  } | null;
  ResponseCode: string; // e.g., "2" for success, "-4" for not found
  Message: string;
}

// Product Detail Interface (from Get_ProductDetails_ByItemCode SP)
export interface ProductDetail {
  ItemCode: string;
  ItemName: string;
  Description: string;
  Image1: string;
  Image2: string;
  Image3: string;
  ProductBrand: string;
  Barcode: string;
  IsWishListItem: boolean;
  StockQty: number;
  OldPrice: number;
  Discount: number;
  NewPrice: number;
  // Add any additional fields or computed properties
  [key: string]: any;
}

// Interface for filter options
export interface FilterOption {
  XCode: string;
  XName: string;
  XMaster?: string;
  XLink?: string | null;
  IsSelected: boolean;
}

// Interface for product filter response
export interface ProductFilterResponse {
  List: {
    Productlist: DirectProductListItem[];
    li_Brand_List: FilterOption[];
    li_Category_List: FilterOption[];
    li_SubCategory_List: FilterOption[];
    li_SortBy_List: FilterOption[];
    MinPrice: number;
    MaxPrice: number;
  };
  ResponseCode: string;
  Message: string;
}

// Interface for product filter request params
export interface ProductFilterParams {
  PageCode: string;
  Category?: string;
  SubCategory?: string;
  SearchName?: string;
  HomePageCatSrNo?: string;
  UserId?: string;
  Company: string | number;
  CultureId: string | number;
  Arry_Category: string[];
  Arry_SubCategory: string[];
  Arry_Brand: string[];
  Arry_Color: string[];
  MinPrice: number;
  MaxPrice: number;
  SortBy: string;
  Value2: string; // Required: location parameter
}

// Interfaces for promo code API requests
export interface PromoCodeParams {
  PromoCode: string;
  UserId: string;
  IpAddress: string;
  UniqueId: string;
  BuyNow: string;
  Company: number;
}

export interface PromoCodeResponse {
  StatusCode?: number;
  ResponseCode: string | number;
  Message: string;
  TrackId?: string | null;
  DiscountAmount?: number; // Added DiscountAmount for promo code responses
}

// Define interface for promo code item
export interface PromoCodeItem {
  XCode: string;
  XName: string;
}

// Define interface for promo codes list response
export interface PromoCodesListResponse {
  success: number;
  row: PromoCodeItem[];
  Message: string;
}

// Guest checkout interfaces
export interface GuestUserRegistrationParams {
  FullName: string;
  Email: string;
  Mobile: string;
  IpAddress?: string; // Will be set by the API service if not provided
  Source?: string; // Will be set by the API service if not provided
  CompanyId?: number; // Will default to 3044
}

export interface GuestUserRegistrationResponse {
  ResponseCode: string;
  Message: string;
  TrackId: string;
}

/**
 * Get device IP address (simplified implementation)
 * In a real app, you would use a more robust method to get the IP
 */
const getDeviceIpAddress = async (): Promise<string> => {
  // Placeholder: In a real app, you would use a library like react-native-device-info
  // or fetch from a service that returns the client IP
  return '192.168.1.1'; // Default placeholder value
};

/**
 * Get platform source identifier
 */
const getPlatformSource = (): string => {
  return Platform.OS === 'ios' ? PLATFORM.IOS : PLATFORM.ANDROID;
};

// Helper function to get current culture ID from language store
const getCurrentCultureId = (): string => {
  try {
    const cultureId = useLanguageStore.getState().getCultureId();
    console.log('🌐 getCurrentCultureId() called, returning:', cultureId);
    return cultureId;
  } catch (error) {
    console.warn('🌐 Failed to get culture ID from language store, defaulting to English:', error);
    return CULTURE_IDS.ENGLISH;
  }
};

/**
 * Base API request function with error handling
 */
const apiRequest = async <T>(
  endpoint: string,
  method: 'POST',
  params: Record<string, any> = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Log all API requests
  console.log(`🌐 API REQUEST - ${endpoint}:`, {
    url,
    method,
    params: JSON.stringify(params, null, 2)
  });
  
  try {
    const httpResponse = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: method === 'POST' && Object.keys(params).length > 0 ? JSON.stringify(params) : undefined,
    });
    
    const responseData = await httpResponse.json();
    
    // Log all API responses
    console.log(`🌐 API RESPONSE - ${endpoint}:`, {
      status: httpResponse.status,
      statusText: httpResponse.statusText,
      data: JSON.stringify(responseData, null, 2)
    });
    
    // Additional detailed logging for specific endpoints
    if (endpoint === ENDPOINTS.SAVE_CHECKOUT) {
      console.log('🛒 SAVE CHECKOUT - RAW RESPONSE:', JSON.stringify(responseData, null, 2));
      console.log('🛒 SAVE CHECKOUT - TrackId:', responseData.TrackId);
      console.log('🛒 SAVE CHECKOUT - ResponseCode:', responseData.ResponseCode);
      console.log('🛒 SAVE CHECKOUT - Message:', responseData.Message);
    }
    
    if (endpoint === ENDPOINTS.ORDER_REVIEW_CHECKOUT) {
      console.log('🛒 ORDER REVIEW - RAW RESPONSE:', JSON.stringify(responseData, null, 2));
      console.log('🛒 ORDER REVIEW - ResponseCode:', responseData.ResponseCode);
      console.log('🛒 ORDER REVIEW - Has Data:', !!responseData.li?.length);
      console.log('🛒 ORDER REVIEW - Cart Count:', responseData.li?.[0]?.CartCount || 0);
    }

    if (!httpResponse.ok) {
      console.error(`🌐 API ERROR - ${endpoint}:`, {
        status: httpResponse.status,
        statusText: httpResponse.statusText,
        responseData
      });
      
      // For HTTP errors (4xx, 5xx), try to use the message from the API if available
      return {
        StatusCode: httpResponse.status,
        ResponseCode: String(responseData.ResponseCode || RESPONSE_CODES.GENERAL_ERROR),
        Message: responseData.Message || `Request failed with status ${httpResponse.status}`,
        Data: responseData.Data || responseData, // Include data if present, or the whole body
        TrackId: responseData.TrackId, // Preserve TrackId even in error cases
        UserDetails: responseData.UserDetails,
      };
    }

    // If endpoint is GET_DATA_JSON, the responseData is the actual T (i.e., {success, row, Message})
    // We need to wrap it into an ApiResponse structure.
    if (endpoint === ENDPOINTS.GET_DATA_JSON) {
      return {
        StatusCode: httpResponse.status,
        ResponseCode: RESPONSE_CODES.SUCCESS, // Indicate HTTP success for SP call
        Message: responseData.Message || 'Stored procedure executed.', // SP's message or a generic one
        Data: responseData as T, // responseData is the {success, row, Message} object
      };
    }

    // If endpoint is ORDER_REVIEW_CHECKOUT, the responseData is the actual T (i.e., {li, ResponseCode, Message})
    // We need to wrap it into an ApiResponse structure.
    if (endpoint === ENDPOINTS.ORDER_REVIEW_CHECKOUT) {
      return {
        StatusCode: httpResponse.status,
        ResponseCode: String(responseData.ResponseCode || RESPONSE_CODES.SUCCESS),
        Message: responseData.Message || 'Order review completed',
        Data: responseData as T, // responseData is the {li, ResponseCode, Message} object
      };
    }

    // For other endpoints that are expected to return the full ApiResponse structure
    const apiResponse = {
      StatusCode: httpResponse.status,
      ResponseCode: String(responseData.ResponseCode || RESPONSE_CODES.SUCCESS),
      Message: responseData.Message || 'Request successful',
      Data: responseData.Data as T,
      TrackId: responseData.TrackId, // Preserve TrackId from the API response
      UserDetails: responseData.UserDetails,
    };
    
    // Log the constructed API response for important endpoints
    if (endpoint === ENDPOINTS.SAVE_CHECKOUT) {
      console.log('🛒 SAVE CHECKOUT - CONSTRUCTED RESPONSE:', JSON.stringify(apiResponse, null, 2));
      console.log('🛒 SAVE CHECKOUT - Final TrackId:', apiResponse.TrackId);
    }
    
    return apiResponse;

  } catch (error) {
    console.error(`🌐 API NETWORK ERROR - ${endpoint}:`, error);
    return {
      StatusCode: 503, 
      ResponseCode: String(RESPONSE_CODES.GENERAL_ERROR), 
      Message: 'Network request failed. Please check your connection.',
      // Data can be undefined or null here as per ApiResponse<T> structure
    } as ApiResponse<T>; 
  }
};

/**
 * Register a new user
 */
export const registerUser = async (params: RegisterUserParams): Promise<ApiResponse> => {
  const ipAddress = await getDeviceIpAddress();
  const source = getPlatformSource();
  
  const registrationPayload = {
    ...params,
    IpAddress: ipAddress,
    Source: source,
    CompanyId: 3044, // Registration endpoint expects CompanyId
  };
  
  return apiRequest(ENDPOINTS.REGISTER_USER, 'POST', registrationPayload);
};

/**
 * Log in an existing user
 */
export const loginUser = async (params: LoginUserParams): Promise<ApiResponse> => {
  const loginPayload = {
    userName: params.userName,
    password: params.password, 
    companyId: 3044, // Use lowercase companyId to match API
  };
  
  return apiRequest(ENDPOINTS.LOGIN_USER, 'POST', loginPayload);
};

/**
 * Update user account details
 */
export const updateUserDetailsAPI = async (payload: UpdateUserDetailsPayload): Promise<ApiResponse> => {
  // IpAddress and CompanyId are already in the payload from the store
  // Ensure UserId is present as it's critical
  if (!payload.UserId) {
    console.error('UpdateUserDetailsAPI: UserId is missing in payload');
    return {
      StatusCode: 400, // Bad request
      ResponseCode: '-1', // Custom local error code for missing UserId
      Message: 'User ID is missing. Cannot update details.'
    };
  }
  return apiRequest(ENDPOINTS.UPDATE_USER_DETAILS, 'POST', payload);
};

/**
 * Save a new billing address
 */
export async function saveBillingAddress(payload: SaveBillingAddressPayload): Promise<ApiResponse> {
  return apiRequest(ENDPOINTS.CRUD_BILLING_ADDRESS, 'POST', payload);
}

/**
 * Update an existing billing address
 */
export async function updateBillingAddress(payload: SaveBillingAddressPayload): Promise<ApiResponse> {
  // Same endpoint as save, but with Command: 'Update' and existing BillingAddressId
  return apiRequest(ENDPOINTS.CRUD_BILLING_ADDRESS, 'POST', payload);
}

/**
 * Delete a billing address
 */
export async function deleteBillingAddress(payload: DeleteBillingAddressPayload): Promise<ApiResponse> {
  return apiRequest(ENDPOINTS.CRUD_BILLING_ADDRESS, 'POST', payload);
}

/**
 * Save a new shipping address
 */
export async function saveShippingAddress(payload: SaveShippingAddressPayload): Promise<ApiResponse> {
  return apiRequest(ENDPOINTS.CRUD_SHIPPING_ADDRESS, 'POST', payload);
}

/**
 * Update an existing shipping address
 */
export async function updateShippingAddress(payload: SaveShippingAddressPayload): Promise<ApiResponse> {
  // Same endpoint as save, but with Command: 'Update' and existing ShippingAddressId
  return apiRequest(ENDPOINTS.CRUD_SHIPPING_ADDRESS, 'POST', payload);
}

/**
 * Delete a shipping address
 */
export async function deleteShippingAddress(payload: DeleteShippingAddressPayload): Promise<ApiResponse> {
  return apiRequest(ENDPOINTS.CRUD_SHIPPING_ADDRESS, 'POST', payload);
}

/**
 * Request a password reset
 */
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<ApiResponse> {
  return apiRequest(ENDPOINTS.FORGOT_PASSWORD, 'POST', payload);
}

// Social Media Authentication Interfaces
interface SocialLoginParams {
  SocialId: string;        // Social media ID (200 chars max)
  Email: string;           // Email from social media (72 chars max)
  Mobile: string;          // Mobile number (16 chars max)
  CompanyId: number;       // Fixed: 3044
}

interface SocialRegistrationParams {
  SocialId: string;                    // Social media ID (200 chars max)
  SocialId_Description: string;        // Social media description - "Google" / "Apple" (50 chars max)
  FullName: string;                    // Full name (128 chars max)
  Email: string;                       // Email ID (72 chars max)
  Mobile: string;                      // Mobile number (16 chars max)
  Password: string;                    // Password (48 chars max)
  IpAddress: string;                   // IP Address (128 chars max)
  Source: string;                      // Source - "Android"/"iOS" (10 chars max)
  CompanyId: number;                   // Company ID - 3044
  IsExist_FullName: boolean;           // Pass true when found else pass false
  IsExist_Mobile: boolean;             // Pass true when found else pass false
  IsExist_EmailId: boolean;            // Pass true when found else pass false
}

// Social Media Login
export const socialMediaLogin = async (params: SocialLoginParams): Promise<ApiResponse> => {
  return apiRequest(ENDPOINTS.SOCIAL_LOGIN, 'POST', params);
};

// Social Media Registration
export const socialMediaRegister = async (params: SocialRegistrationParams): Promise<ApiResponse> => {
  return apiRequest(ENDPOINTS.SOCIAL_REGISTER, 'POST', params);
};

/**
 * Get countries list for address forms
 */
export async function getCountries(): Promise<ApiResponse<LocationDataResponse>> {
  const payload: GetDataJsonPayload = {
    strQuery: SP_QUERIES.GET_COUNTRY_LIST
  };
  return apiRequest<LocationDataResponse>(ENDPOINTS.GET_DATA_JSON, 'POST', payload);
}

/**
 * Get states list for a specific country
 */
export async function getStates(countryXcode: string): Promise<ApiResponse<LocationDataResponse>> {
  const payload: GetDataJsonPayload = {
    strQuery: SP_QUERIES.GET_STATE_LIST(countryXcode)
  };
  return apiRequest<LocationDataResponse>(ENDPOINTS.GET_DATA_JSON, 'POST', payload);
}

/**
 * Get cities list for a specific state
 */
export async function getCities(stateXcode: string): Promise<ApiResponse<LocationDataResponse>> {
  const payload: GetDataJsonPayload = {
    strQuery: SP_QUERIES.GET_CITY_LIST(stateXcode)
  };
  return apiRequest<LocationDataResponse>(ENDPOINTS.GET_DATA_JSON, 'POST', payload);
}

/**
 * Get list of countries
 */
export const getCountryList = async (): Promise<LocationResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/getData_JSON`, {
      strQuery: `[Web].[Sp_Manage_Address_Apps_SM]'Get_Country_List','','','','','',${getCurrentCultureId()},3044`
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching country list:', error);
    throw error;
  }
};

/**
 * Get list of states for a specific country
 * @param countryId - The XCode of the country
 */
export const getStateList = async (countryId: number): Promise<LocationResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/getData_JSON`, {
      strQuery: `[Web].[Sp_Manage_Address_Apps_SM]'Get_State_List','${countryId}','','','','',${getCurrentCultureId()},3044`
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching state list:', error);
    throw error;
  }
};

/**
 * Get list of cities for a specific state
 * @param stateId - The XCode of the state
 */
export const getCityList = async (stateId: number): Promise<LocationResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/getData_JSON`, {
      strQuery: `[Web].[Sp_Manage_Address_Apps_SM]'Get_City_List','${stateId}','','','','',${getCurrentCultureId()},3044`
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching city list:', error);
    throw error;
  }
};

/**
 * Get list of billing addresses for a user
 * @param userId - The user ID 
 */
export const getBillingAddresses = async (userId: string): Promise<ApiResponse<any>> => {
  try {
    const payload: GetDataJsonPayload = {
      strQuery: SP_QUERIES.GET_BILLING_ADDRESSES(userId)
    };
    
    console.log('Fetching billing addresses with query:', payload.strQuery);
    return apiRequest<any>(ENDPOINTS.GET_DATA_JSON, 'POST', payload);
  } catch (error) {
    console.error('Error fetching billing addresses:', error);
    throw error;
  }
};

/**
 * Get list of shipping addresses for a user
 * @param userId - The user ID
 */
export const getShippingAddresses = async (userId: string): Promise<ApiResponse<any>> => {
  try {
    const payload: GetDataJsonPayload = {
      strQuery: SP_QUERIES.GET_SHIPPING_ADDRESSES(userId)
    };
    
    console.log('Fetching shipping addresses with query:', payload.strQuery);
    return apiRequest<any>(ENDPOINTS.GET_DATA_JSON, 'POST', payload);
  } catch (error) {
    console.error('Error fetching shipping addresses:', error);
    throw error;
  }
};

/**
 * Get the list of orders for a user
 * @param userId User ID to get orders for
 * @param cultureId Culture ID (defaults to English)
 * @returns API response with orders data
 */
export const getMyOrders = async (userId: string, cultureId?: string): Promise<ApiResponse<any>> => {
  try {
    const finalCultureId = cultureId || getCurrentCultureId();
    const query = SP_QUERIES.GET_MY_ORDERS(userId, finalCultureId);
    console.log('📋 getMyOrders - Query:', query);
    
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`, {
      strQuery: query
    });
    
    console.log('📋 getMyOrders - Raw response:', JSON.stringify(response.data, null, 2));
    
    const result = {
      StatusCode: 200,
      ResponseCode: response.data.success === 1 ? '2' : '-2',
      Message: response.data.Message || 'Orders retrieved successfully',
      Data: response.data
    };
    
    console.log('📋 getMyOrders - Formatted result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('❌ getMyOrders - Error:', error);
    return {
      StatusCode: 500,
      ResponseCode: '-2',
      Message: 'Failed to fetch orders. Please try again.',
      Data: null
    };
  }
};

/**
 * Get details for a specific order
 * @param userId User ID
 * @param orderNo Order number to get details for
 * @param cultureId Culture ID (defaults to English)
 * @returns API response with order details data
 */
export const getOrderDetails = async (userId: string, orderNo: string, cultureId?: string): Promise<ApiResponse<any>> => {
  try {
    const finalCultureId = cultureId || getCurrentCultureId();
    const query = SP_QUERIES.GET_ORDER_DETAILS(userId, orderNo, finalCultureId);
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`, {
      strQuery: query
    });
    
    return {
      StatusCode: 200,
      ResponseCode: response.data.success === 1 ? '2' : '-2',
      Message: response.data.Message || 'Order details retrieved successfully',
      Data: response.data
    };
  } catch (error) {
    console.error('Error getting order details:', error);
    return {
      StatusCode: 500,
      ResponseCode: '-2',
      Message: 'Failed to fetch order details. Please try again.',
      Data: null
    };
  }
};

/**
 * Search user orders by order ID
 * @param userId User ID
 * @param searchOrderId Order ID to search for
 * @param cultureId Culture ID (defaults to current language)
 * @returns API response with matching orders data
 */
export const searchMyOrders = async (userId: string, searchOrderId: string, cultureId?: string): Promise<ApiResponse<any>> => {
  try {
    const finalCultureId = cultureId || getCurrentCultureId();
    const query = SP_QUERIES.SEARCH_MY_ORDERS(userId, searchOrderId, finalCultureId);
    console.log('📋 searchMyOrders - Query:', query);
    
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`, {
      strQuery: query
    });
    
    console.log('📋 searchMyOrders - Raw response:', JSON.stringify(response.data, null, 2));
    
    const result = {
      StatusCode: 200,
      ResponseCode: response.data.success === 1 ? '2' : '-2',
      Message: response.data.Message || 'Orders search completed',
      Data: response.data
    };
    
    console.log('📋 searchMyOrders - Formatted result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('❌ searchMyOrders - Error:', error);
    return {
      StatusCode: 500,
      ResponseCode: '-2',
      Message: 'Failed to search orders. Please try again.',
      Data: null
    };
  }
};

/**
 * Search order details by order ID
 * @param userId User ID
 * @param searchOrderId Order ID to search for details
 * @param cultureId Culture ID (defaults to current language)
 * @returns API response with matching order details data
 */
export const searchOrderDetails = async (userId: string, searchOrderId: string, cultureId?: string): Promise<ApiResponse<any>> => {
  try {
    const finalCultureId = cultureId || getCurrentCultureId();
    const query = SP_QUERIES.SEARCH_ORDER_DETAILS(userId, searchOrderId, finalCultureId);
    console.log('📋 searchOrderDetails - Query:', query);
    
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`, {
      strQuery: query
    });
    
    console.log('📋 searchOrderDetails - Raw response:', JSON.stringify(response.data, null, 2));
    
    return {
      StatusCode: 200,
      ResponseCode: response.data.success === 1 ? '2' : '-2',
      Message: response.data.Message || 'Order details search completed',
      Data: response.data
    };
  } catch (error) {
    console.error('❌ searchOrderDetails - Error:', error);
    return {
      StatusCode: 500,
      ResponseCode: '-2',
      Message: 'Failed to search order details. Please try again.',
      Data: null
    };
  }
};

/**
 * Get list of product categories
 * @param cultureId Culture ID (defaults to English)
 * @param userId User ID (optional, pass empty string if not logged in)
 * @returns API response with categories data
 */
export const getCategories = async (cultureId?: string, userId: string = ''): Promise<ApiResponse<any>> => {
  const finalCultureId = cultureId || getCurrentCultureId();
  
  try {
    const query = SP_QUERIES.GET_CATEGORY_LIST(finalCultureId, userId); // This is Get_HomePage_Category_List
    // Use the updated apiRequest directly
    return apiRequest<any>(ENDPOINTS.GET_DATA_JSON, 'POST', { strQuery: query });
  } catch (error) {
    console.error('Error getting categories (homepage):', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: 'Failed to fetch homepage categories. Please try again.',
      Data: null // Or { success: 0, row: [], Message: '...' }
    };
  }
};

/**
 * Get all category list for Categories tab
 * @param cultureId Culture ID (defaults to English)
 * @param userId User ID (optional, pass empty string if not logged in)
 * @returns API response with all categories data
 */
export const getAllCategories = async (cultureId?: string, userId: string = ''): Promise<ApiResponse<any>> => {
  const finalCultureId = cultureId || getCurrentCultureId();
  
  try {
    const query = SP_QUERIES.GET_ALL_CATEGORY_LIST(finalCultureId, userId); // This is Get_All_HomePage_Category_List
    // Use the updated apiRequest directly
    return apiRequest<any>(ENDPOINTS.GET_DATA_JSON, 'POST', { strQuery: query });
  } catch (error) {
    console.error('Error getting all categories:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: 'Failed to fetch all categories. Please try again.',
      Data: null // Or { success: 0, row: [], Message: '...' }
    };
  }
};

/**
 * Get list of promotional banners
 * @param cultureId Culture ID (defaults to English)
 * @param userId User ID (optional, pass empty string if not logged in)
 * @returns API response with banner data
 */
export const getBanners = async (cultureId?: string, userId: string = ''): Promise<ApiResponse<any>> => {
  const finalCultureId = cultureId || getCurrentCultureId();
  
  try {
    const query = SP_QUERIES.GET_BANNER_LIST(finalCultureId, userId);
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`, {
      strQuery: query
    });
    
    return {
      StatusCode: 200,
      ResponseCode: response.data.success === 1 ? '2' : '-2',
      Message: response.data.Message || 'Banners retrieved successfully',
      Data: response.data
    };
  } catch (error) {
    console.error('Error getting banners:', error);
    return {
      StatusCode: 500,
      ResponseCode: '-2',
      Message: 'Failed to fetch banners. Please try again.',
      Data: null
    };
  }
};

/**
 * Get list of advertisements
 * @param cultureId Culture ID (defaults to English)
 * @param userId User ID (optional, pass empty string if not logged in)
 * @returns API response with advertisement data
 */
export const getAdvertisements = async (cultureId?: string, userId: string = ''): Promise<ApiResponse<any>> => {
  const finalCultureId = cultureId || getCurrentCultureId();
  
  try {
    const query = SP_QUERIES.GET_ADVERTISEMENT_LIST(finalCultureId, userId);
    const axiosResponse = await axios.post(`${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`, {
      strQuery: query
    });

    // The data from axiosResponse.data IS the { success, row, Message } object from the SP call.
    // This entire object should be passed as the .Data property of our standard ApiResponse.
    // The ResponseCode of our ApiResponse should reflect the success of the HTTP call to getData_JSON itself.
    return {
      StatusCode: axiosResponse.status, // HTTP status from the getData_JSON endpoint call
      ResponseCode: RESPONSE_CODES.SUCCESS, // If axios.post succeeded, this wrapper considers it a success at HTTP level
      // Message for the ApiResponse can be generic or use the SP message if appropriate for overall status.
      // Let's use the SP message as it's more specific to the data operation.
      Message: axiosResponse.data.Message || (axiosResponse.data.success === 1 ? 'Advertisements retrieved' : 'No advertisements found'),
      Data: axiosResponse.data // This is the direct payload: { success: number, row: Ad[], Message: string }
    };
  } catch (error) {
    console.error('Error getting advertisements:', error);
    let statusCode = 500;
    let message = 'Failed to fetch advertisements due to a server or network error. Please try again.';
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        statusCode = error.response.status;
        // Try to get a message from the error response data if available
        message = error.response.data?.Message || error.message || message;
      } else {
        // Network error or other non-response Axios error
        message = error.message || message;
      }
    }
    
    return {
      StatusCode: statusCode,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR, // Or a more specific error code if derivable
      Message: message,
      Data: null // No data in case of such an error
    };
  }
};

/**
 * Get Menu Categories for Browse Drawer
 */
export const getMenuCategories = async (
  cultureId?: string,
  userId: string = '' 
): Promise<ApiResponse<{ success: number; row: MenuCategory[]; Message: string }>> => {
  const finalCultureId = cultureId || getCurrentCultureId();
  
  const strQuery = SP_QUERIES.GET_MENU_CATEGORY_LIST(finalCultureId, userId);
  const payload: GetDataJsonPayload = { strQuery };
  
  // apiRequest will now correctly wrap the SP result {success, row, Message} into its Data field.
  return apiRequest<{ success: number; row: MenuCategory[]; Message: string }>(
    ENDPOINTS.GET_DATA_JSON,
    'POST',
    payload
  );
};

/**
 * Get Menu SubCategories by Main Category for Browse Drawer
 */
export const getMenuSubCategories = async (
  categoryXcode: string,
  cultureId?: string,
  userId: string = '' // Optional: Pass userId if available
): Promise<ApiResponse<{ success: number; row: MenuSubCategory[]; Message: string }>> => {
  if (!categoryXcode) {
    // Handle this validation within the calling component or store if preferred,
    // or return a specific error structure if the API layer must handle it.
    return {
      StatusCode: 400, // Bad Request
      ResponseCode: RESPONSE_CODES.GENERAL_ERROR, // Or a more specific client-side error code if defined
      Message: 'Category Xcode is required to fetch subcategories.',
      Data: { success: 0, row: [], Message: 'Category Xcode is required.' },
    };
  }
  
  const finalCultureId = cultureId || getCurrentCultureId();
  const strQuery = SP_QUERIES.GET_MENU_SUBCATEGORY_LIST(categoryXcode, finalCultureId, userId);
  const payload: GetDataJsonPayload = { strQuery };

  const response = await apiRequest<{ success: number; row: MenuSubCategory[]; Message: string }>(
    ENDPOINTS.GET_DATA_JSON,
    'POST',
    payload
  );

  if (response.Data && response.Data.success === 1 && Array.isArray(response.Data.row)) {
    return {
      ...response,
      Data: {
        success: response.Data.success,
        row: response.Data.row,
        Message: response.Data.Message,
      },
    };
  } else if (response.Data && response.Data.success === 0) {
    return {
      ...response,
      Data: {
        success: 0,
        row: [],
        Message: response.Data.Message || 'No subcategories found for this category.',
      },
    };
  }
  
  return {
    StatusCode: response.StatusCode || 500,
    ResponseCode: response.ResponseCode || RESPONSE_CODES.GENERAL_ERROR,
    Message: response.Message || 'Failed to fetch subcategories.',
    Data: { success: 0, row: [], Message: response.Message || 'Failed to fetch subcategories.' },
  };
};

/**
 * Search for items by text
 */
export const searchItems = async (
  searchText: string,
  cultureId?: string,
  userId: string = '' // Optional: Pass userId if available for personalized search or history
): Promise<ApiResponse<{ success: number; row: SearchItem[]; Message: string }>> => {
  if (!searchText || searchText.trim().length === 0) {
    // Handle empty search text - return empty results
    return {
      StatusCode: 200,
      ResponseCode: '2',
      Message: 'Search text is required.',
      Data: { success: 0, row: [], Message: 'Search text is required.' },
    };
  }

  const finalCultureId = cultureId || getCurrentCultureId();
  
  try {
    const strQuery = SP_QUERIES.GET_ITEM_NAME_LIST_BY_SEARCH(searchText.trim(), finalCultureId, userId);
    const payload: GetDataJsonPayload = { strQuery };

    const response = await apiRequest<{ success: number; row: SearchItem[]; Message: string }>(
      ENDPOINTS.GET_DATA_JSON,
      'POST',
      payload
    );

    if (response.Data && response.Data.success === 1 && Array.isArray(response.Data.row)) {
      return {
        ...response,
        Data: {
          success: response.Data.success,
          row: response.Data.row,
          Message: response.Data.Message,
        },
      };
    } else {
      // No search results found or API returned an error
      return {
        ...response,
        Data: {
          success: 0,
          row: [],
          Message: response.Data?.Message || 'No search results found.',
        },
      };
    }
  } catch (error) {
    console.error('Error searching items:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: 'Failed to search items. Please try again.',
      Data: { success: 0, row: [], Message: 'Search failed due to a server error.' },
    };
  }
};

// --- Product Listing and Details Functions ---

// Interface for the parameters of getAllProductsDirectly function
interface GetAllProductsDirectParams {
  PageCode: string;
  Category?: string;
  SubCategory?: string;
  SearchName?: string;
  HomePageCatSrNo?: string;
  CultureId?: string;
  UserId?: string;
  Company?: string;
  Value2: string; // Required: location parameter
}

/**
 * Get list of products using the direct Get_AllProduct_List HTTP GET endpoint.
 */
export const getAllProductsDirectly = async (
  params: GetAllProductsDirectParams
): Promise<AllProductsDirectResponse> => {
  const queryParams = new URLSearchParams({
    Company: params.Company || COMMON_PARAMS.Company,
    CultureId: params.CultureId || CULTURE_IDS.ENGLISH,
    PageCode: params.PageCode,
    Category: params.Category || '',
    SubCategory: params.SubCategory || '',
    SearchName: params.SearchName || '',
    HomePageCatSrNo: params.HomePageCatSrNo || '',
    UserId: params.UserId || '',
    Value2: params.Value2, // Required: location parameter
  }).toString();

  const url = `${API_BASE_URL}${ENDPOINTS.GET_ALL_PRODUCT_LIST_DIRECT}?${queryParams}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    const data: AllProductsDirectResponse = await response.json();
    if (!response.ok) {
      // Even if not ok, the body might contain ResponseCode and Message
      console.error(`Error fetching all products directly: ${response.status}`, data);
      return { 
        List: data.List || null,
        ResponseCode: data.ResponseCode || String(response.status),
        Message: data.Message || `HTTP error ${response.status}`
      };
    }
    return data;
  } catch (error) {
    console.error('Network error in getAllProductsDirectly:', error);
    return {
      List: null,
      ResponseCode: String(RESPONSE_CODES.SERVER_ERROR),
      Message: 'Network request failed. Please check your connection.',
    };
  }
};

/**
 * Get detailed information for a specific product by its item code using SP_QUERIES.
 */
export const getProductDetailsByItemCode = async (
  itemCode: string,
  location: string, // e.g., COMMON_PARAMS.Location
  cultureId?: string,
  userId: string = ''
): Promise<ApiResponse<{ success: number; row: ProductDetail[]; Message: string }>> => {
  // Note: SP for details usually returns a single item in the 'row' array.
  const finalCultureId = cultureId || getCurrentCultureId();
  const strQuery = SP_QUERIES.GET_PRODUCT_DETAILS_BY_ITEM_CODE(
    itemCode,
    location,
    finalCultureId,
    userId
  );
  const payload: GetDataJsonPayload = { strQuery };
  return apiRequest<{ success: number; row: ProductDetail[]; Message: string }>(
    ENDPOINTS.GET_DATA_JSON,
    'POST',
    payload
  );
};

/**
 * Get special description details for a product
 */
export const getSpecialDescriptionListByItemCode = async (
  itemCode: string,
  cultureId?: string,
  userId: string = ''
): Promise<ApiResponse<{ success: number; row: any[]; Message: string }>> => {
  const finalCultureId = cultureId || getCurrentCultureId();
  const strQuery = SP_QUERIES.GET_SPECIAL_DESCRIPTION_LIST_BY_ITEM_CODE(
    itemCode,
    finalCultureId,
    userId
  );
  const payload: GetDataJsonPayload = { strQuery };
  return apiRequest<{ success: number; row: any[]; Message: string }>(
    ENDPOINTS.GET_DATA_JSON,
    'POST',
    payload
  );
};

/**
 * Get related products for a product
 */
export const getRelatedProductsListByItemCode = async (
  itemCode: string,
  cultureId?: string,
  userId: string = ''
): Promise<ApiResponse<{ success: number; row: any[]; Message: string }>> => {
  const finalCultureId = cultureId || getCurrentCultureId();
  const strQuery = SP_QUERIES.GET_RELATED_PRODUCTS_LIST_BY_ITEM_CODE(
    itemCode,
    finalCultureId,
    userId
  );
  const payload: GetDataJsonPayload = { strQuery };
  return apiRequest<{ success: number; row: any[]; Message: string }>(
    ENDPOINTS.GET_DATA_JSON,
    'POST',
    payload
  );
};

// Define interface for AddToCart request parameters
export interface AddToCartParams {
  ItemCode: string;
  NewPrice: number;
  OldPrice: number;
  Discount: number;
  UserId: string;
  UniqueId: string;
  IpAddress: string;
  Company: string; // Cart endpoints expect Company, not CompanyId
  Location: string;
  Qty: number;
}

// Define interface for AddToCart response
export interface AddToCartResponse {
  StatusCode?: number;
  ResponseCode: string | number;
  Message: string;
  TrackId?: string | null;
}

// Implementation of the AddToCart API function
export const addToCart = async (params: AddToCartParams): Promise<ApiResponse<AddToCartResponse | null>> => {
  console.log('🛒 AddToCart - Request:', JSON.stringify(params, null, 2));
  
  try {
    const url = `${API_BASE_URL}AddToCart`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const responseData = await response.json();
    const apiResponse = {
      StatusCode: response.status,
      ResponseCode: responseData.ResponseCode || RESPONSE_CODES.GENERAL_ERROR,
      Message: responseData.Message || 'Unknown response from server',
      Data: responseData as AddToCartResponse,
    };
    
    console.log('🛒 AddToCart - Response:', JSON.stringify({
      statusCode: apiResponse.StatusCode,
      responseCode: apiResponse.ResponseCode,
      message: apiResponse.Message,
      success: apiResponse.StatusCode === 200 && 
               (apiResponse.ResponseCode === RESPONSE_CODES.CART_ADDED || 
                apiResponse.ResponseCode === RESPONSE_CODES.CART_UPDATED)
    }, null, 2));
    
    return apiResponse;
  } catch (error: any) {
    console.error('❌ Error in addToCart:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: error.message || 'An error occurred while adding to cart',
      Data: null,
    };
  }
};

// Define interface for cart items response
export interface CartItemsResponse {
  success: number;
  row: CartItem[];
  Message: string;
}

// Define interface for cart item
export interface CartItem {
  CartId: number;
  ItemCode: string;
  ItemName: string;
  Image: string;
  Qty: number;
  Price: number;
  OldPrice: number;
  Discount: number;
  // Add any other fields returned by the API
  [key: string]: any;
}

// Define interface for UpdateCartQty request parameters
export interface UpdateCartQtyParams {
  CartId: number;
  Qty: number;
  Company: string; // Cart endpoints expect Company, not CompanyId
  Location: string;
}

// Define interface for DeleteCartItem request parameters
export interface DeleteCartItemParams {
  CartId: number;
  Company: string; // Cart endpoints expect Company, not CompanyId
}

/**
 * Get all items in user's cart
 */
export const getCartItems = async (
  userId: string = '',
  uniqueId: string,
  ipAddress: string,
  cultureId?: string
): Promise<ApiResponse<CartItemsResponse | null>> => {
  try {
    const finalCultureId = cultureId || getCurrentCultureId();
    const strQuery = SP_QUERIES.GET_CART_PRODUCTS(userId, ipAddress, uniqueId, finalCultureId);
    console.log('🛒 GetCartItems - Request:', JSON.stringify({
      endpoint: ENDPOINTS.GET_DATA_JSON,
      method: 'POST',
      userId: userId || 'Guest',
      uniqueId,
      ipAddress,
      strQuery
    }, null, 2));
    
    // Make the API request to get cart items
    const response = await apiRequest<CartItemsResponse>(
      ENDPOINTS.GET_DATA_JSON,
      'POST',
      { strQuery }
    );
    
    console.log('🛒 GetCartItems - Response:', JSON.stringify({
      statusCode: response.StatusCode,
      success: response.Data?.success === 1,
      message: response.Message,
      itemCount: response.Data?.row?.length || 0,
      hasItems: response.Data?.row && response.Data.row.length > 0
    }, null, 2));
    
    return response;
  } catch (error) {
    console.error('❌ Error getting cart items:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: 'Failed to fetch cart items. Please try again.',
      Data: null
    };
  }
};

/**
 * Update the quantity of an item in the cart
 */
export const updateCartQty = async (params: UpdateCartQtyParams): Promise<ApiResponse<any>> => {
  console.log('🛒 UpdateCartQty - Request:', JSON.stringify(params, null, 2));
  
  try {
    const url = `${API_BASE_URL}UpdateCartQty`;
    
    // Make the API request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const responseData = await response.json();
    const apiResponse = {
      StatusCode: response.status,
      ResponseCode: responseData.ResponseCode,
      Message: responseData.Message || 'Cart item quantity updated',
      Data: responseData
    };
    
    console.log('🛒 UpdateCartQty - Response:', JSON.stringify({
      statusCode: apiResponse.StatusCode,
      responseCode: apiResponse.ResponseCode,
      message: apiResponse.Message,
      success: apiResponse.StatusCode === 200 && 
              (String(apiResponse.ResponseCode) === '2' || 
               apiResponse.ResponseCode === 2)
    }, null, 2));
    
    return apiResponse;
  } catch (error: any) {
    console.error('❌ Error updating cart quantity:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: error.message || 'Failed to update cart. Please try again.',
      Data: null
    };
  }
};

/**
 * Delete an item from the cart
 */
export const deleteCartItem = async (params: DeleteCartItemParams): Promise<ApiResponse<any>> => {
  console.log('🛒 DeleteCartItem - Request:', JSON.stringify(params, null, 2));
  
  try {
    const url = `${API_BASE_URL}DeleteCartItem`;
    
    // Make the API request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const responseData = await response.json();
    const apiResponse = {
      StatusCode: response.status,
      ResponseCode: responseData.ResponseCode,
      Message: responseData.Message || 'Cart item removed',
      Data: responseData
    };
    
    console.log('🛒 DeleteCartItem - Response:', JSON.stringify({
      statusCode: apiResponse.StatusCode,
      responseCode: apiResponse.ResponseCode,
      message: apiResponse.Message,
      success: apiResponse.StatusCode === 200 && 
              (String(apiResponse.ResponseCode) === '2' || 
               apiResponse.ResponseCode === 2)
    }, null, 2));
    
    return apiResponse;
  } catch (error: any) {
    console.error('❌ Error deleting cart item:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: error.message || 'Failed to remove item from cart. Please try again.',
      Data: null
    };
  }
};

/**
 * Get the stored procedure query for getting wishlist items for a user
 */
export const getWishlistItems = async (userId: string): Promise<ApiResponse<any>> => {
  try {
    const strQuery = `[Web].[Sp_Templete1_Get_MyWishlist_Apps]'Get_MyWishlist','${userId}','','','','',${getCurrentCultureId()},3044`;
    console.log('🧡 GetWishlistItems - Request:', JSON.stringify({ strQuery }, null, 2));
    
    const response = await apiRequest(
      ENDPOINTS.GET_DATA_JSON,
      'POST',
      { strQuery }
    );
    
    console.log('🧡 GetWishlistItems - Response:', JSON.stringify({
      success: response.Data,
      itemCount: response.Data,
      message: response.Message
    }, null, 2));
    
    return response;
  } catch (error: any) {
    console.error('❌ Error getting wishlist items:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: error.message || 'Failed to fetch wishlist items. Please try again.',
      Data: null
    };
  }
};

/**
 * Add an item to the wishlist
 */
export const addWishlistItem = async (itemCode: string, userId: string): Promise<ApiResponse<any>> => {
  if (!userId) {
    return {
      StatusCode: 400,
      ResponseCode: '-1',
      Message: 'User ID is required to add item to wishlist'
    };
  }

  const payload = {
    ItemCode: itemCode,
    UserId: userId,
    IpAddress: await getDeviceIpAddress(), // Use the internal function that already exists
    CompanyId: 3044, // Wishlist endpoints expect CompanyId
    Command: 'Save'
  };

  return apiRequest(ENDPOINTS.CRUD_WISHLIST, 'POST', payload);
};

/**
 * Delete an item from the wishlist
 */
export const deleteWishlistItem = async (itemCode: string, userId: string): Promise<ApiResponse<any>> => {
  if (!userId) {
    return {
      StatusCode: 400,
      ResponseCode: '-1',
      Message: 'User ID is required to remove item from wishlist'
    };
  }

  const payload = {
    ItemCode: itemCode,
    UserId: userId,
    IpAddress: '127.0.0.1', // Simplified for mobile
    CompanyId: 3044, // Wishlist endpoints expect CompanyId
    Command: 'Delete'
  };

  return apiRequest(ENDPOINTS.CRUD_WISHLIST, 'POST', payload);
};

/**
 * Apply a promo code to the user's cart
 */
export const applyPromoCode = async (params: PromoCodeParams): Promise<ApiResponse<PromoCodeResponse>> => {
  try {
    const ip = await getDeviceIpAddress();
    const payload = {
      ...params,
      IpAddress: params.IpAddress || ip
    };

    console.log('Apply promo code payload:', JSON.stringify(payload, null, 2));
    
    try {
      const response = await axios({
        method: 'POST',
        url: `${API_BASE_URL}${ENDPOINTS.APPLY_PROMO_CODE}`,
        data: payload
      });

      console.log('Apply promo code response:', JSON.stringify(response.data, null, 2));
      
      // Normalize response structure
      return {
        StatusCode: response.status,
        ResponseCode: response.data.ResponseCode,
        Message: response.data.Message,
        Data: response.data,
        TrackId: response.data.TrackId,
        DiscountAmount: response.data.DiscountAmount || 0
      };
    } catch (axiosError: any) {
      // Handle Axios errors (like 404, 500, etc.)
      console.log('Promo code API error response:', JSON.stringify(axiosError.response?.data || {}, null, 2));
      
      if (axiosError.response?.data) {
        // Return the error from the API if available
        return {
          StatusCode: axiosError.response.status,
          ResponseCode: axiosError.response.data.ResponseCode || '-2',
          Message: axiosError.response.data.Message || 'Failed to apply promo code',
          TrackId: axiosError.response.data.TrackId || null,
          DiscountAmount: 0
        };
      }
      
      // Handle network errors or other issues
      return {
        StatusCode: 500,
        ResponseCode: RESPONSE_CODES.SERVER_ERROR_STR,
        Message: axiosError.message || 'Failed to connect to server',
        TrackId: null,
        DiscountAmount: 0
      };
    }
  } catch (error: any) {
    console.error('Error applying promo code:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR_STR,
      Message: error.message || 'Failed to apply promo code',
      TrackId: null,
      DiscountAmount: 0
    };
  }
};

/**
 * Remove a previously applied promo code from the user's cart
 */
export const removePromoCode = async (params: PromoCodeParams): Promise<ApiResponse<PromoCodeResponse>> => {
  try {
    const ip = await getDeviceIpAddress();
    const payload = {
      ...params,
      IpAddress: params.IpAddress || ip
    };

    console.log('Remove promo code payload:', JSON.stringify(payload, null, 2));
    
    try {
      const response = await axios({
        method: 'POST',
        url: `${API_BASE_URL}${ENDPOINTS.REMOVE_PROMO_CODE}`,
        data: payload
      });

      console.log('Remove promo code response:', JSON.stringify(response.data, null, 2));
      
      // Normalize response structure
      return {
        StatusCode: response.status,
        ResponseCode: response.data.ResponseCode,
        Message: response.data.Message,
        Data: response.data,
        TrackId: response.data.TrackId,
        DiscountAmount: 0 // When removing, reset discount amount
      };
    } catch (axiosError: any) {
      // Handle Axios errors (like 404, 500, etc.)
      console.log('Remove promo code API error response:', JSON.stringify(axiosError.response?.data || {}, null, 2));
      
      if (axiosError.response?.data) {
        // Return the error from the API if available
        return {
          StatusCode: axiosError.response.status,
          ResponseCode: axiosError.response.data.ResponseCode || '-2',
          Message: axiosError.response.data.Message || 'Failed to remove promo code',
          TrackId: axiosError.response.data.TrackId || null,
          DiscountAmount: 0
        };
      }
      
      // Handle network errors or other issues
      return {
        StatusCode: 500,
        ResponseCode: RESPONSE_CODES.SERVER_ERROR_STR,
        Message: axiosError.message || 'Failed to connect to server',
        TrackId: null,
        DiscountAmount: 0
      };
    }
  } catch (error: any) {
    console.error('Error removing promo code:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR_STR,
      Message: error.message || 'Failed to remove promo code',
      TrackId: null,
      DiscountAmount: 0
    };
  }
};

/**
 * Get list of available promo codes
 */
export const getPromoCodes = async (
  cultureId?: string
): Promise<ApiResponse<PromoCodesListResponse>> => {
  try {
    const finalCultureId = cultureId || getCurrentCultureId();
    const strQuery = SP_QUERIES.GET_PROMO_CODES_LIST(finalCultureId);
    console.log('Get promo codes - Request:', JSON.stringify({ strQuery }, null, 2));
    
    const response = await apiRequest<PromoCodesListResponse>(
      ENDPOINTS.GET_DATA_JSON,
      'POST',
      { strQuery }
    );
    
    console.log('Get promo codes - Response:', JSON.stringify({
      statusCode: response.StatusCode,
      success: response.Data?.success === 1,
      message: response.Message,
      promoCount: response.Data?.row?.length || 0,
    }, null, 2));
    
    return response;
  } catch (error) {
    console.error('Error getting promo codes:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: 'Failed to fetch promo codes. Please try again.',
      Data: { success: 0, row: [], Message: 'An error occurred' } as PromoCodesListResponse
    };
  }
};

/**
 * Get list of products using the filter API endpoint.
 */
export const getFilteredProducts = async (
  params: ProductFilterParams
): Promise<ProductFilterResponse> => {
  const cacheKey = 'getFilteredProducts';
  const cultureId = String(params.CultureId);
  
  return withCache(
    cacheKey,
    params,
    cultureId,
    async () => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS.GET_ALL_PRODUCT_LIST_FILTER}`;
    console.log('Filter API request:', JSON.stringify(params, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      console.error(`Error fetching filtered products: ${response.status}`);
      return {
        List: {
          Productlist: [],
          li_Brand_List: [],
          li_Category_List: [],
          li_SubCategory_List: [],
          li_SortBy_List: [],
          MinPrice: 0,
          MaxPrice: 0,
        },
        ResponseCode: String(response.status),
        Message: `HTTP error ${response.status}`,
      };
    }

    const data: ProductFilterResponse = await response.json();
    console.log('Filter API response:', {
      responseCode: data.ResponseCode,
      message: data.Message,
      productsCount: data.List?.Productlist?.length || 0,
      brandsCount: data.List?.li_Brand_List?.length || 0,
      categoriesCount: data.List?.li_Category_List?.length || 0,
    });

    return data;
  } catch (error) {
    console.error('Network error in getFilteredProducts:', error);
    return {
      List: {
        Productlist: [],
        li_Brand_List: [],
        li_Category_List: [],
        li_SubCategory_List: [],
        li_SortBy_List: [],
        MinPrice: 0,
        MaxPrice: 0,
      },
      ResponseCode: String(RESPONSE_CODES.SERVER_ERROR),
      Message: 'Network request failed. Please check your connection.',
    };
  }
    }
  );
};

/**
 * Register a guest user during checkout
 */
export const registerGuestUser = async (params: GuestUserRegistrationParams): Promise<ApiResponse<GuestUserRegistrationResponse>> => {
  const ipAddress = await getDeviceIpAddress();
  const source = getPlatformSource();
  
  const registrationPayload = {
    ...params,
    IpAddress: params.IpAddress || ipAddress,
    Source: params.Source || source,
    CompanyId: params.CompanyId || 3044,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GUEST_SAVE_USER_REGISTRATION}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(registrationPayload),
    });
    
    const responseData: GuestUserRegistrationResponse = await response.json();
    
    return {
      StatusCode: response.status,
      ResponseCode: responseData.ResponseCode,
      Message: responseData.Message,
      Data: responseData,
      TrackId: responseData.TrackId,
    };
  } catch (error) {
    console.error('Error registering guest user:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.GUEST_REGISTRATION_ERROR,
      Message: 'Failed to register guest user. Please try again.',
      TrackId: null,
    };
  }
};

/**
 * Get countries list for checkout
 */
export async function getCheckoutCountries(): Promise<ApiResponse<CheckoutLocationDataResponse>> {
  try {
    const data = {
      strQuery: `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Country_List','','','','','',${getCurrentCultureId()},3044,''`
    };
    return apiRequest<CheckoutLocationDataResponse>(ENDPOINTS.GET_DATA_JSON, 'POST', data);
  } catch (error) {
    console.error('Error fetching checkout countries:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: 'Failed to fetch countries'
    };
  }
}

/**
 * Get states list for checkout for a specific country
 */
export async function getCheckoutStates(countryXcode: string): Promise<ApiResponse<CheckoutLocationDataResponse>> {
  try {
    const data = {
      strQuery: `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_State_List','${countryXcode}','','','','',${getCurrentCultureId()},3044,''`
    };
    return apiRequest<CheckoutLocationDataResponse>(ENDPOINTS.GET_DATA_JSON, 'POST', data);
  } catch (error) {
    console.error('Error fetching checkout states:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: 'Failed to fetch states'
    };
  }
}

/**
 * Get cities list for checkout for a specific state
 */
export async function getCheckoutCities(stateXcode: string): Promise<ApiResponse<CheckoutLocationDataResponse>> {
  try {
    const data = {
      strQuery: `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_City_List','${stateXcode}','','','','',${getCurrentCultureId()},3044,''`
    };
    return apiRequest<CheckoutLocationDataResponse>(ENDPOINTS.GET_DATA_JSON, 'POST', data);
  } catch (error) {
    console.error('Error fetching checkout cities:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: 'Failed to fetch cities'
    };
  }
}

// Payment Mode interface
export interface PaymentModeItem {
  XCode: string;
  XName: string;
}

export interface PaymentModeResponse {
  success: number;
  row: PaymentModeItem[];
  Message: string;
}

// Get payment modes for checkout
export async function getPaymentModes(countryXcode: string = '69'): Promise<ApiResponse<PaymentModeResponse>> {
  try {
    const data = {
      strQuery: SP_QUERIES.GET_PAYMENT_MODE_LIST(countryXcode)
    };
    const response = await apiRequest<PaymentModeResponse>(ENDPOINTS.GET_DATA_JSON, 'POST', data);
    return response;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
}

// Save Checkout Order
export interface SaveCheckoutParams {
  UserID: string;  // Use TrackId for guest users
  IpAddress: string;
  UniqueId: string;
  Company: number | string;
  CultureId: number | string;
  BuyNow: string;
  Location: string;
  DifferentAddress: boolean;
  BillingAddressId: number;
  ShippingAddressId: number;  // Always required
  SCountry: string;    // Shipping Country Xcode - Always required
  SState: string;      // Shipping State Xcode - Always required  
  SCity: string;       // Shipping City Xcode - Always required
  PaymentMode: string;
  Source: string;
  OrderNote: string;   // Always required (can be empty string)
  Salesman: string;    // Always required
}

export interface SaveCheckoutResponse {
  StatusCode: number;
  ResponseCode: string | number;
  Message: string;
  TrackId?: string;
}

export async function saveCheckout(params: SaveCheckoutParams): Promise<ApiResponse<SaveCheckoutResponse>> {
  try {
    console.log('Saving checkout with params:', JSON.stringify(params, null, 2));
    
    // Construct the complete payload with all required parameters
    const payload = {
      UserID: params.UserID,
      IpAddress: params.IpAddress || '127.0.0.1',
      UniqueId: params.UniqueId,
      Company: params.Company || 3044,
      CultureId: params.CultureId || parseInt(getCurrentCultureId()),
      BuyNow: params.BuyNow || '',
      Location: params.Location || '304401HO',
      DifferentAddress: params.DifferentAddress,
      BillingAddressId: params.BillingAddressId,
      ShippingAddressId: params.ShippingAddressId,
      SCountry: params.SCountry,
      SState: params.SState,
      SCity: params.SCity,
      PaymentMode: params.PaymentMode,
      Source: params.Source || (Platform.OS === 'ios' ? 'iOS' : 'Android'),
      OrderNote: params.OrderNote || '',
      Salesman: params.Salesman || '3044SMOL',
    };
    
    const response = await apiRequest<SaveCheckoutResponse>(ENDPOINTS.SAVE_CHECKOUT, 'POST', payload);
    
    // Log the response for debugging
    console.log('Save checkout response:', JSON.stringify(response, null, 2));
    
    return response;
  } catch (error) {
    console.error('Error saving checkout:', error);
    return {
      StatusCode: 500,
      ResponseCode: '-2',
      Message: error instanceof Error ? error.message : 'Unknown error saving checkout',
    };
  }
}

// Add functions for getting default and all addresses for logged-in users
export interface CheckoutAddressResponse {
  success: number;
  row: ApiAddress[];
  Message: string;
}

export interface ApiAddress {
  BillingAddressId?: number;
  ShippingAddressId?: number;
  FullName: string;
  Email: string;
  Mobile: string;
  Address: string;
  Address2?: string;
  Country: string;
  State: string;
  City: string;
  CountryId?: number;  // Add CountryId for location codes
  StateId?: number;    // Add StateId for location codes
  CityId?: number;     // Add CityId for location codes
  Block?: string;
  Street?: string;
  House?: string;
  Apartment?: string;
  IsDefault: boolean | number;
}

export interface Address {
  BillingAddressId?: number;
  ShippingAddressId?: number;
  FullName: string;
  Email: string;
  Mobile: string;
  Address2: string;
  Country: string;
  State: string;
  City: string;
  Block: string;
  Street: string;
  House: string;
  Apartment: string;
  IsDefault: boolean | number;
}

// Get default billing address for logged-in user
export async function getDefaultBillingAddressByUserId(userId: string): Promise<ApiResponse<CheckoutAddressResponse>> {
  try {
    const data = {
      strQuery: `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Default_BillingAddress_ByUserid','','','','','',${getCurrentCultureId()},3044,'${userId}'`
    };
    const response = await apiRequest<CheckoutAddressResponse>(ENDPOINTS.GET_DATA_JSON, 'POST', data);
    return response;
  } catch (error) {
    console.error('Error fetching default billing address:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: 'Failed to fetch default billing address'
    };
  }
}

// Get default shipping address for logged-in user
export async function getDefaultShippingAddressByUserId(userId: string): Promise<ApiResponse<CheckoutAddressResponse>> {
  try {
    const data = {
      strQuery: `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Default_ShippingAddress_ByUserid','','','','','',${getCurrentCultureId()},3044,'${userId}'`
    };
    const response = await apiRequest<CheckoutAddressResponse>(ENDPOINTS.GET_DATA_JSON, 'POST', data);
    return response;
  } catch (error) {
    console.error('Error fetching default shipping address:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: 'Failed to fetch default shipping address'
    };
  }
}

// Get all billing addresses for logged-in user
export async function getAllBillingAddressesByUserId(userId: string): Promise<ApiResponse<CheckoutAddressResponse>> {
  try {
    const data = {
      strQuery: `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_All_BillingAddress_ByUserId','','','','','',${getCurrentCultureId()},3044,'${userId}'`
    };
    const response = await apiRequest<CheckoutAddressResponse>(ENDPOINTS.GET_DATA_JSON, 'POST', data);
    return response;
  } catch (error) {
    console.error('Error fetching all billing addresses:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: 'Failed to fetch billing addresses'
    };
  }
}

// Get all shipping addresses for logged-in user
export async function getAllShippingAddressesByUserId(userId: string): Promise<ApiResponse<CheckoutAddressResponse>> {
  try {
    const data = {
      strQuery: `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_All_ShippingAddress_ByUserId','','','','','',${getCurrentCultureId()},3044,'${userId}'`
    };
    const response = await apiRequest<CheckoutAddressResponse>(ENDPOINTS.GET_DATA_JSON, 'POST', data);
    return response;
  } catch (error) {
    console.error('Error fetching all shipping addresses:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: 'Failed to fetch shipping addresses'
    };
  }
}

/**
 * Get order details for thank you page using TrackId
 */
export async function getOrderDetailsForThankYou(trackId: string): Promise<ApiResponse<any>> {
  try {
    // Use the correct stored procedure from the user's documentation
    const strQuery = `[Web].[Sp_Template1_Get_OrderDetails_ThankYou_Apps] '${trackId}',3044`;
    console.log('🎉 Fetching order details for thank you with TrackId:', trackId);
    console.log('🎉 Using correct query:', strQuery);
    
    const response = await apiRequest<any>(
      ENDPOINTS.GET_DATA_JSON,
      'POST',
      { strQuery }
    );
    
    console.log('🎉 Thank you order details response:', JSON.stringify(response, null, 2));
    
    return response;
  } catch (error) {
    console.error('❌ Error getting order details for thank you:', error);
    throw error;
  }
}

/**
 * ORDER REVIEW CHECKOUT API
 * 
 * This API calculates cart totals, shipping charges, and discounts based on delivery location.
 * 
 * GUEST CHECKOUT FLOW:
 * 1. Initial call without location codes (Country="", State="", City="")
 *    - Allows checkout page to load with basic cart information
 *    - May return cart items without accurate shipping calculations
 * 
 * 2. Second call with location codes after guest adds address
 *    - Returns complete pricing with shipping charges and discounts
 *    - Used to update checkout page with accurate totals
 * 
 * LOGGED-IN USER FLOW:
 * - Called with default address location codes immediately
 * - Returns complete pricing information on first call
 * 
 * API Response Structure:
 * Success: { li: [OrderReviewData], ResponseCode: "2", Message: "Success message" }
 * Error: { li: null, ResponseCode: "-2", Message: "Cart is empty!!!" or other error }
 * 
 * Example Response Data:
 * {
 *   "li": [{
 *     "CartItemsList": [...],
 *     "CartCount": 2,
 *     "SubTotal": 25.000,
 *     "Discount": 2.000,
 *     "ShippingCharge": 4.000,
 *     "GrandTotal": 27.000,
 *     "PromoCode": "SAVE10",
 *     "PromoName": "10% Off",
 *     "Percentage": "10"
 *   }],
 *   "ResponseCode": "2",
 *   "Message": "Success"
 * }
 */

// Order Review Checkout API interfaces and function
export interface OrderReviewCheckoutParams {
  Country: string;      // Country code (e.g., "69") - empty string for initial guest call
  State: string;        // State code (e.g., "238") - empty string for initial guest call
  City: string;         // City code (e.g., "1997") - empty string for initial guest call
  UniqueId: string;     // Cart unique ID
  IpAddress: string;    // Client IP address
  CultureId: number;    // Culture ID (1 for English, 2 for Arabic)
  Company: number;      // Company ID (3044)
  UserId: string;       // User ID or empty string for guest
  BuyNow: string;       // Buy now item code or empty string
}

export interface OrderReviewCartItem {
  Sr: number;
  CartId: number;
  ItemCode: string;
  ItemName: string;
  Image1: string;
  NewPrice: number;
  Quantity: number;
  SubTotal: number;
}

export interface OrderReviewData {
  CartItemsList: OrderReviewCartItem[];
  CartCount: number;
  SubTotal: number;
  Discount: number;
  ShippingCharge: number;
  GrandTotal: number;
  PromoCode: string;
  PromoName: string;
  Percentage: string;
}

export interface OrderReviewCheckoutResponse {
  li: OrderReviewData[];
  ResponseCode: string;
  Message: string;
}

export async function getOrderReviewCheckout(params: OrderReviewCheckoutParams): Promise<ApiResponse<OrderReviewCheckoutResponse>> {
  try {
    console.log('🛒 ORDER REVIEW CHECKOUT - Starting API call with params:', JSON.stringify(params, null, 2));
    
    // Validate required parameters
    if (!params.UniqueId) {
      console.error('🛒 ORDER REVIEW CHECKOUT - Missing required UniqueId parameter');
      return {
        StatusCode: 400,
        ResponseCode: '-1',
        Message: 'UniqueId is required for order review',
        Data: { li: [], ResponseCode: '-1', Message: 'UniqueId is required' }
      };
    }
    
    // Log the call type based on location parameters
    const hasLocationData = params.Country && params.State && params.City;
    console.log('🛒 ORDER REVIEW CHECKOUT - Call type:', hasLocationData ? 'WITH LOCATION DATA' : 'WITHOUT LOCATION DATA (Initial/Guest call)');
    
    if (hasLocationData) {
      console.log('🛒 ORDER REVIEW CHECKOUT - Location codes:', {
        Country: params.Country,
        State: params.State,
        City: params.City
      });
    } else {
      console.log('🛒 ORDER REVIEW CHECKOUT - No location codes provided - this is expected for initial guest checkout calls');
    }
    
    const response = await apiRequest<OrderReviewCheckoutResponse>(
      ENDPOINTS.ORDER_REVIEW_CHECKOUT,
      'POST',
      params
    );
    
    console.log('🛒 ORDER REVIEW CHECKOUT - API Response:', JSON.stringify(response, null, 2));
    
    // Log order data details if available
    if (response.Data && response.Data.li && response.Data.li.length > 0) {
      const orderData = response.Data.li[0];
      console.log('🛒 ORDER REVIEW CHECKOUT - Order Data Details:', {
        cartCount: orderData.CartCount,
        cartItemsListLength: orderData.CartItemsList?.length || 0,
        subTotal: orderData.SubTotal,
        discount: orderData.Discount,
        shippingCharge: orderData.ShippingCharge,
        grandTotal: orderData.GrandTotal,
        promoCode: orderData.PromoCode || 'None'
      });
    } else {
      console.log('🛒 ORDER REVIEW CHECKOUT - No order data in response');
    }
    
    return response;
  } catch (error) {
    console.error('❌ ORDER REVIEW CHECKOUT - Error occurred:', error);
    throw error;
  }
}