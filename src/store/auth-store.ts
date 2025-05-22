import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser, loginUser, updateUserDetailsAPI, forgotPassword } from '../utils/api-service';
import { RESPONSE_CODES } from '../utils/api-config';

// User types
interface User {
  id?: string;
  UserID?: string;
  fullName?: string;
  email: string;
  mobile?: string;
  password?: string; // Store password in memory only
}

interface LoginParams {
  userName: string;
  password: string;
}

// API payload for updating user details
interface UpdateUserPayload {
  FullName: string;
  Email: string; 
  Mobile: string;
  Password?: string;
  UserId: string;
  IpAddress: string;
  CompanyId: number;
}

// Types for API requests and responses
interface ApiResponse<T = any> {
  StatusCode?: number;
  ResponseCode: string | number;
  Message: string;
  Data?: T;
  TrackId?: string | null;
  // Add UserDetails for login response
  UserDetails?: {
    UserID: string;
    FullName: string;
    Email: string;
    Mobile: string;
    UserName?: string | null;
    Password?: string;
  };
}

// Authentication state
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isLoadingUpdate: boolean;
  error: string | null;
  errorUpdate: string | null;
  token: string | null;
  
  // Actions
  register: (fullName: string, email: string, mobile: string, password: string) => Promise<boolean>;
  login: (params: LoginParams) => Promise<boolean>;
  logout: () => void;
  updateUserAccount: (payload: UpdateUserPayload) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
  clearUpdateError: () => void;
}

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      isLoadingUpdate: false,
      error: null,
      errorUpdate: null,
      token: null,
      
      // Register a new user
      register: async (fullName, email, mobile, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await registerUser({
            FullName: fullName,
            Email: email,
            Mobile: mobile,
            Password: password,
          });

          console.log('Full API Response (Register) in auth-store:', JSON.stringify(response, null, 2));
          
          const responseCodeStr = String(response.ResponseCode);

          if (responseCodeStr === String(RESPONSE_CODES.CREATED)) {
            // Extract the user ID from the response
            let userId = '';
            if (response.Data?.UserId) {
              userId = response.Data.UserId;
            } else if (response.Data?.UserID) {
              userId = response.Data.UserID;
            } else if (response.UserDetails?.UserID) {
              userId = response.UserDetails.UserID;
            }
            
            console.log(`Registration successful, user ID: ${userId || 'Not provided by API'}`);
            
            set({
              isLoading: false,
              isLoggedIn: true,
              user: {
                fullName,
                email,
                mobile,
                UserID: userId,
                id: userId,
                password, // Store password in memory
              },
              error: null,
            });
            return true;
          } else {
            let errorMessage = response.Message || 'Registration failed. Please try again.';
            
            if (responseCodeStr === String(RESPONSE_CODES.EMAIL_EXISTS)) {
              errorMessage = response.Message || 'This email is already registered. Please try another.';
            } else if (responseCodeStr === String(RESPONSE_CODES.MOBILE_EXISTS)) {
              errorMessage = response.Message || 'This mobile number is already registered. Please try another.';
            } else if (!response.Message && response.ResponseCode) {
                errorMessage = `Registration failed (Code: ${response.ResponseCode}). Please try again.`;
            }
            
            set({ isLoading: false, error: errorMessage });
            return false;
          }
        } catch (error) {
          console.error('Error during registration call in auth-store:', error);
          set({ 
            isLoading: false, 
            error: 'Registration failed due to a network error. Please check your connection and try again.' 
          });
          return false;
        }
      },
      
      // Login user
      login: async ({ userName, password }) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Attempting login with credentials:', { userName, password: '***' });
          // Attempt to login using the API
          const response: ApiResponse<any> = await loginUser({
            userName: userName,
            password: password,
          });

          console.log('Full Login Response:', JSON.stringify(response, null, 2));

          // Check for server validation error
          if (String(response.ResponseCode) === String(RESPONSE_CODES.SERVER_VALIDATION_ERROR_ALT)) {
            set({ 
              isLoading: false, 
              error: 'The login service is currently experiencing difficulties. Please try again later.' 
            });
            return false;
          }

          // Normal flow for successful API response
          const userDetails = response.UserDetails;
          if (String(response.ResponseCode) === String(RESPONSE_CODES.CREATED) && userDetails) {
            // Ensure we have a UserID
            const userId = userDetails.UserID || '';
            
            set({
              isLoading: false,
              isLoggedIn: true,
              user: {
                UserID: userId,        // Store UserID property consistently
                id: userId,            // Store id property for backwards compatibility
                fullName: userDetails.FullName || '',
                email: userDetails.Email || '',
                mobile: userDetails.Mobile || '',
                password, // Store password in memory
              },
              error: null,
            });
            return true;
          } else {
            set({ isLoading: false, error: response.Message || 'Login failed.' });
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false, error: 'Login failed due to a network error.' });
          return false;
        }
      },
      
      // Update user account details
      updateUserAccount: async (payload) => {
        set({ isLoadingUpdate: true, errorUpdate: null });
        try {
          const response = await updateUserDetailsAPI(payload);
          
          console.log('Update user account response:', JSON.stringify(response, null, 2));
          
          // Check for the server validation error code (-6)
          if (String(response.ResponseCode) === String(RESPONSE_CODES.SERVER_VALIDATION_ERROR_ALT)) {
            set({ 
              isLoadingUpdate: false, 
              errorUpdate: 'The server is currently experiencing difficulties. Please try again later.' 
            });
            return false;
          }
          
          if (response.StatusCode === 200 && String(response.ResponseCode) === '2') {
            // Update user in store with new details
            set((state) => ({
              isLoadingUpdate: false,
              user: state.user
                ? {
                    ...state.user,
                    fullName: payload.FullName,
                    email: payload.Email,
                    mobile: payload.Mobile,
                    // Ensure UserID is preserved
                    UserID: state.user.UserID || state.user.id || '',
                    id: state.user.id || state.user.UserID || '',
                  }
                : null,
              errorUpdate: null,
            }));
            return true;
          } else {
            set({ isLoadingUpdate: false, errorUpdate: response.Message || 'Update failed.' });
            return false;
          }
        } catch (error) {
          console.error('Account update error:', error);
          set({
            isLoadingUpdate: false,
            errorUpdate: 'Account update failed due to a network error.',
          });
          return false;
        }
      },
      
      // Logout user
      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          error: null,
          errorUpdate: null,
          isLoading: false,
          isLoadingUpdate: false,
        });
      },
      
      // Clear login/register error
      clearError: () => { 
        set({ error: null });
      },

      // Clear update error
      clearUpdateError: () => {
        set({ errorUpdate: null });
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await forgotPassword({ Email: email, CompanyId: 3044 });
          if (response.StatusCode === 200 && String(response.ResponseCode) === String(RESPONSE_CODES.CREATED)) {
            set({ isLoading: false, error: null });
            return { success: true, message: response.Message };
          }
          set({ isLoading: false, error: response.Message });
          return { success: false, message: response.Message };
        } catch (error) {
          const errorMessage = 'Forgot password request failed due to a network error.';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Exclude password from persisted state
      partialize: (state) => {
        if (!state.user) return { ...state, user: null };
        const { password, ...userWithoutPassword } = state.user;
        return { ...state, user: userWithoutPassword };
      },
    }
  )
);

export default useAuthStore; 