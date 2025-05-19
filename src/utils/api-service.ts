import { Platform } from 'react-native';
import { 
  API_BASE_URL, 
  ENDPOINTS, 
  RESPONSE_CODES, 
  PLATFORM,
  SP_QUERIES,
  // COMMON_PARAMS, // No longer needed for all requests here
  // CULTURE_IDS // No longer needed for registration here
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
  CompanyId: number;
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
    CompanyId: 3044, // As per image, CompanyId is an int and fixed
  };
  
  return apiRequest(ENDPOINTS.REGISTER_USER, 'POST', registrationPayload);
};

/**
 * Log in an existing user
 */
export const loginUser = async (params: LoginUserParams): Promise<ApiResponse> => {
  const loginPayload = {
    ...params,
    CompanyId: 3044, // As per image, CompanyId is an int and fixed
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

// Export other API functions here 