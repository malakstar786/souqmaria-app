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
  method: 'POST', // Corrected method type
  params: Record<string, any> = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Only stringify params if it's a POST request and params exist
      body: method === 'POST' && Object.keys(params).length > 0 ? JSON.stringify(params) : undefined,
    });
    
    const data = await response.json();
    // Ensure ResponseCode is consistently a string or number for easier comparison later
    if (data.ResponseCode && typeof data.ResponseCode !== 'number') {
        data.ResponseCode = String(data.ResponseCode);
    }
    // Add StatusCode to the response if it's not present but HTTP status is OK
    if (!data.StatusCode && response.status) {
      data.StatusCode = response.status;
    }
    return data as ApiResponse<T>;
  } catch (error) {
    console.error('API request failed:', endpoint, error);
    return {
      StatusCode: 503, // Service Unavailable for network/fetch errors
      ResponseCode: String(RESPONSE_CODES.GENERAL_ERROR), // Ensure string for consistency
      Message: 'Network request failed. Please check your connection.',
    } as ApiResponse<T>; // Cast to ensure type compatibility
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

// Export other API functions here 