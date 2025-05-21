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

// Types for API requests and responses
interface ApiResponse<T = any> {
  StatusCode?: number; // Optional, as it might not always be present
  ResponseCode: string | number; // API seems to return as string sometimes, like "-4"
  Message: string;
  Data?: T;
  TrackId?: string | null; // As seen in the log
}

// Common type for address location data (country, state, city)
export interface LocationItem {
  Xcode: string;
  NameE: string;
  NameA?: string; // Optional Arabic name
}

// API response for location data
export interface LocationDataResponse {
  rows: LocationItem[];
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
  UserName: string; // Email or Mobile No.
  Password: string;
}

// Add interface for UpdateUserDetails payload
interface UpdateUserDetailsPayload {
  FullName: string;
  Email: string;
  Mobile: string;
  Password?: string; // Optional
  UserId: string;
  IpAddress: string;
  Company: number;
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
  Company: number;
  IpAddress: string;
}

export interface DeleteBillingAddressPayload {
  BillingAddressId: number;
  UserId: string;
  IpAddress: string;
  Company: number;
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
  Company: number;
  IpAddress: string;
}

export interface DeleteShippingAddressPayload {
  ShippingAddressId: number;
  UserId: string;
  IpAddress: string;
  Company: number;
  Command: string; // 'Delete'
}

// Forgot Password Payload
interface ForgotPasswordPayload {
  Email: string;
  Company: number;
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
  ItemCode: string;
  // Add any other fields directly returned by Get_AllProduct_List endpoint
  [key: string]: any;
}

// API response for the direct Get_AllProduct_List HTTP call
export interface AllProductsDirectResponse {
  List: DirectProductListItem[] | null;
  ResponseCode: string; // e.g., "2" for success, "-4" for not found
  Message: string;
  // Include other fields if the direct API returns them at the top level
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

/**
 * Base API request function with error handling
 */
const apiRequest = async <T>(
  endpoint: string,
  method: 'POST',
  params: Record<string, any> = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
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

    if (!httpResponse.ok) {
      // For HTTP errors (4xx, 5xx), try to use the message from the API if available
      return {
        StatusCode: httpResponse.status,
        ResponseCode: String(responseData.ResponseCode || RESPONSE_CODES.GENERAL_ERROR),
        Message: responseData.Message || `Request failed with status ${httpResponse.status}`,
        Data: responseData.Data || responseData, // Include data if present, or the whole body
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

    // For other endpoints that are expected to return the full ApiResponse structure
    return {
      StatusCode: httpResponse.status,
      ResponseCode: String(responseData.ResponseCode || RESPONSE_CODES.SUCCESS),
      Message: responseData.Message || 'Request successful',
      Data: responseData.Data as T,
    };

  } catch (error) {
    console.error('API request failed:', endpoint, error);
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
    Company: 3044, // As per image, Company is an int and fixed
  };
  
  return apiRequest(ENDPOINTS.REGISTER_USER, 'POST', registrationPayload);
};

/**
 * Log in an existing user
 */
export const loginUser = async (params: LoginUserParams): Promise<ApiResponse> => {
  const loginPayload = {
    ...params,
    Company: 3044, // As per image, Company is an int and fixed
  };
  
  return apiRequest(ENDPOINTS.LOGIN_USER, 'POST', loginPayload);
};

/**
 * Update user account details
 */
export const updateUserDetailsAPI = async (payload: UpdateUserDetailsPayload): Promise<ApiResponse> => {
  // IpAddress and Company are already in the payload from the store
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
      strQuery: "[Web].[Sp_Manage_Address_Apps_SM] 'Get_Country_List','','','','','',1,3044"
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
      strQuery: `[Web].[Sp_Manage_Address_Apps_SM] 'Get_State_List','${countryId}','','','','',1,3044`
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
      strQuery: `[Web].[Sp_Manage_Address_Apps_SM] 'Get_City_List','${stateId}','','','','',1,3044`
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
export const getMyOrders = async (userId: string, cultureId: string = '1'): Promise<ApiResponse<any>> => {
  try {
    const query = SP_QUERIES.GET_MY_ORDERS(userId, cultureId);
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.GET_DATA_JSON}`, {
      strQuery: query
    });
    
    return {
      StatusCode: 200,
      ResponseCode: response.data.success === 1 ? '2' : '-2',
      Message: response.data.Message || 'Orders retrieved successfully',
      Data: response.data
    };
  } catch (error) {
    console.error('Error getting orders:', error);
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
export const getOrderDetails = async (userId: string, orderNo: string, cultureId: string = '1'): Promise<ApiResponse<any>> => {
  try {
    const query = SP_QUERIES.GET_ORDER_DETAILS(userId, orderNo, cultureId);
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
 * Get list of product categories
 * @param cultureId Culture ID (defaults to English)
 * @param userId User ID (optional, pass empty string if not logged in)
 * @returns API response with categories data
 */
export const getCategories = async (cultureId: string = '1', userId: string = ''): Promise<ApiResponse<any>> => {
  // This also uses GET_DATA_JSON, so it will benefit from the apiRequest update
  try {
    const query = SP_QUERIES.GET_CATEGORY_LIST(cultureId, userId); // This is Get_HomePage_Category_List
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
export const getAllCategories = async (cultureId: string = '1', userId: string = ''): Promise<ApiResponse<any>> => {
  // This also uses GET_DATA_JSON, so it will benefit from the apiRequest update
  try {
    const query = SP_QUERIES.GET_ALL_CATEGORY_LIST(cultureId, userId); // This is Get_All_HomePage_Category_List
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
export const getBanners = async (cultureId: string = '1', userId: string = ''): Promise<ApiResponse<any>> => {
  try {
    const query = SP_QUERIES.GET_BANNER_LIST(cultureId, userId);
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
export const getAdvertisements = async (cultureId: string = '1', userId: string = ''): Promise<ApiResponse<any>> => {
  try {
    const query = SP_QUERIES.GET_ADVERTISEMENT_LIST(cultureId, userId);
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
  cultureId: string = '1',
  userId: string = '' 
): Promise<ApiResponse<{ success: number; row: MenuCategory[]; Message: string }>> => {
  const strQuery = SP_QUERIES.GET_MENU_CATEGORY_LIST(cultureId, userId);
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
  cultureId: string = '1',
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
  
  const strQuery = SP_QUERIES.GET_MENU_SUBCATEGORY_LIST(categoryXcode, cultureId, userId);
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
 * Search for items by name.
 */
export const searchItems = async (
  searchText: string,
  cultureId: string = '1',
  userId: string = '' // Optional: Pass userId if available for personalized search or history
): Promise<ApiResponse<{ success: number; row: SearchItem[]; Message: string }>> => {
  const strQuery = SP_QUERIES.GET_ITEM_NAME_LIST_BY_SEARCH(searchText, cultureId, userId);
  const payload: GetDataJsonPayload = { strQuery };

  try {
    const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.SEARCH_ITEMS}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // The getData_JSON endpoint returns the SP result directly in response.data
    const spResponse = response.data;

    return {
      StatusCode: response.status,
      ResponseCode: response.status === 200 ? RESPONSE_CODES.SUCCESS : String(response.status),
      Message: spResponse.Message || (response.status === 200 ? 'Search successful' : 'Search failed'),
      Data: spResponse, // This will be { success, row, Message }
    };
  } catch (error) {
    console.error('API request failed for searchItems:', error);
    let errorMessage = 'Network request failed. Please check your connection.';
    let statusCode = 503; // Service Unavailable
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.Message || error.message;
      statusCode = error.response.status;
    }
    return {
      StatusCode: statusCode,
      ResponseCode: RESPONSE_CODES.GENERAL_ERROR,
      Message: errorMessage,
      Data: { success: 0, row: [], Message: errorMessage },
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
  cultureId: string = '1',
  userId: string = ''
): Promise<ApiResponse<{ success: number; row: ProductDetail[]; Message: string }>> => {
  // Note: SP for details usually returns a single item in the 'row' array.
  const strQuery = SP_QUERIES.GET_PRODUCT_DETAILS_BY_ITEM_CODE(
    itemCode,
    location,
    cultureId,
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
 * Get special description list for a specific product by its item code.
 */
export const getSpecialDescriptionListByItemCode = async (
  itemCode: string,
  cultureId: string = '1',
  userId: string = ''
): Promise<ApiResponse<{ success: number; row: any[]; Message: string }>> => {
  const strQuery = SP_QUERIES.GET_SPECIAL_DESCRIPTION_LIST_BY_ITEM_CODE(
    itemCode,
    cultureId,
    userId
  );
  const payload: GetDataJsonPayload = { strQuery };
  return apiRequest<{ success: number; row: any[]; Message: string }>(
    ENDPOINTS.GET_DATA_JSON,
    'POST',
    payload
  );
};

// Commented out or removed the old getProductList that used SP_QUERIES.GET_ALL_PRODUCT_LIST
/*
export const getProductList = async (
  params: GetProductListParams
): Promise<ApiResponse<{ success: number; row: ProductListItem[]; Message: string }>> => {
  const { 
    pageCode, 
    category = '', 
    subCategory = '', 
    searchName = '', 
    homePageCatSrNo = '', 
    cultureId = '1', 
    userId = '' 
  } = params;

  // This SP_QUERY might not exist anymore or was incorrectly named.
  // const strQuery = SP_QUERIES.GET_ALL_PRODUCT_LIST(
  //   pageCode,
  //   category,
  //   subCategory,
  //   searchName,
  //   homePageCatSrNo,
  //   cultureId,
  //   userId
  // );
  // const payload: GetDataJsonPayload = { strQuery };
  // return apiRequest<{ success: number; row: ProductListItem[]; Message: string }>(
  //   ENDPOINTS.GET_DATA_JSON,
  //   'POST',
  //   payload
  // );
};
*/

// Define interface for AddToCart request parameters
export interface AddToCartParams {
  ItemCode: string;
  NewPrice: number;
  OldPrice: number;
  Discount: number;
  UserId: string;
  UniqueId: string;
  IpAddress: string;
  Company: string;
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
    return {
      StatusCode: response.status,
      ResponseCode: responseData.ResponseCode || RESPONSE_CODES.GENERAL_ERROR,
      Message: responseData.Message || 'Unknown response from server',
      Data: responseData as AddToCartResponse,
    };
  } catch (error: any) {
    console.error('Error in addToCart:', error);
    return {
      StatusCode: 500,
      ResponseCode: RESPONSE_CODES.SERVER_ERROR,
      Message: error.message || 'An error occurred while adding to cart',
      Data: null,
    };
  }
};

// Export other API functions here 