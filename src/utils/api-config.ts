// API configuration constants

export const API_BASE_URL = 'https://api.souqmaria.com/api/MerpecWebApi';

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
  // Add more endpoints as needed
};

// Response codes
export const RESPONSE_CODES = {
  SUCCESS: 2,
  GENERAL_ERROR: -2,
  INVALID_CREDENTIALS: -2,
  EMAIL_EXISTS: -4,
  MOBILE_EXISTS: -6,
  VALIDATION_ERROR: -8,
  LOGIN_VALIDATION_ERROR: -6,
};

// Platform identifiers for the Source parameter
export const PLATFORM = {
  ANDROID: 'Android',
  IOS: 'iOS',
}; 