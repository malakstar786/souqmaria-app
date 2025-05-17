import { Platform } from 'react-native';
import { 
  API_BASE_URL, 
  ENDPOINTS, 
  RESPONSE_CODES, 
  PLATFORM,
  // COMMON_PARAMS, // No longer needed for all requests here
  // CULTURE_IDS // No longer needed for registration here
} from './api-config';

// Types for API requests and responses
interface ApiResponse<T = any> {
  StatusCode?: number; // Optional, as it might not always be present
  ResponseCode: string | number; // API seems to return as string sometimes, like "-4"
  Message: string;
  Data?: T;
  TrackId?: string | null; // As seen in the log
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

// Export other API functions here 