import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser, loginUser, updateUserDetailsAPI, forgotPassword, socialMediaLogin, socialMediaRegister, registerGuestUser, ApiResponse } from '../utils/api-service';
import { RESPONSE_CODES } from '../utils/api-config';
import { GoogleUserInfo } from '../utils/google-auth';
import { getDeviceIP } from '../utils/ip-utils';
import { Platform } from 'react-native';

// User types
interface User {
  id?: string;
  UserID?: string;
  fullName?: string;
  email: string;
  mobile?: string;
  password?: string; // Store password in memory only
  isGuest?: boolean; // NEW: Flag to indicate if user is a guest
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

// Remove local ApiResponse interface - using the one from api-service.ts

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
  registerGuest: (fullName: string, email: string, mobile: string) => Promise<boolean>; // NEW: Guest registration
  login: (params: LoginParams) => Promise<boolean>;
  googleLogin: (googleUserInfo: GoogleUserInfo) => Promise<boolean>;
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
            // NEW: Extract user data directly from response (not nested in Data field)
            const userId = response.UserId || '';
            const userFullName = response.FullName || fullName;
            const userEmail = response.Email || email;
            const userMobile = response.Mobile || mobile;
            const userPassword = response.Password || password;
            
            console.log(`✅ Registration successful - Auto-login enabled`);
            console.log(`📋 User data extracted: UserId=${userId}, FullName=${userFullName}, Email=${userEmail}`);
            
            if (!userId) {
              console.error('⚠️ WARNING: No UserId received from registration API!');
              console.error('Full response received:', JSON.stringify(response, null, 2));
            }
            
            const userData = {
              fullName: userFullName,
              email: userEmail,
              mobile: userMobile,
              UserID: userId,
              id: userId,
              password: userPassword, // Store password in memory
            };
            
            console.log(`📦 Setting user data in store:`, userData);
            
            // Auto-login: Set user as logged in immediately after registration
            set({
              isLoading: false,
              isLoggedIn: true,
              user: userData,
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
      
      // Register a guest user (auto-login)
      registerGuest: async (fullName, email, mobile) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await registerGuestUser({
            FullName: fullName,
            Email: email,
            Mobile: mobile,
          });

          console.log('Full API Response (Guest Register) in auth-store:', JSON.stringify(response, null, 2));
          
          const responseCodeStr = String(response.ResponseCode);

          if (responseCodeStr === String(RESPONSE_CODES.CREATED)) {
            // NEW: Extract guest user data directly from response 
            const userId = response.UserId || '';
            const userFullName = response.FullName || fullName;
            const userEmail = response.Email || email;
            const userMobile = response.Mobile || mobile;
            const userPassword = response.Password || ''; // Auto-generated password
            
            console.log(`✅ Guest registration successful - Auto-session enabled`);
            console.log(`📋 Guest data extracted: UserId=${userId}, FullName=${userFullName}, Email=${userEmail}`);
            
            if (!userId) {
              console.error('⚠️ WARNING: No UserId received from guest registration API!');
              console.error('Full response received:', JSON.stringify(response, null, 2));
            }
            
            const userData = {
              fullName: userFullName,
              email: userEmail,
              mobile: userMobile,
              UserID: userId,
              id: userId,
              password: userPassword, // Store auto-generated password in memory
              isGuest: true, // Mark as guest user
            };
            
            console.log(`📦 Setting guest user data in store:`, userData);
            
            // Auto-session: Set guest user as logged in immediately after registration
            set({
              isLoading: false,
              isLoggedIn: true,
              user: userData,
              error: null,
            });
            return true;
          } else {
            let errorMessage = response.Message || 'Guest registration failed. Please try again.';
            
            if (responseCodeStr === String(RESPONSE_CODES.EMAIL_EXISTS)) {
              errorMessage = response.Message || 'This email is already registered.';
            } else if (responseCodeStr === String(RESPONSE_CODES.MOBILE_EXISTS)) {
              errorMessage = response.Message || 'This mobile number is already registered.';
            } else if (!response.Message && response.ResponseCode) {
                errorMessage = `Guest registration failed (Code: ${response.ResponseCode}). Please try again.`;
            }
            
            set({ isLoading: false, error: errorMessage });
            return false;
          }
        } catch (error) {
          console.error('Error during guest registration call in auth-store:', error);
          set({ 
            isLoading: false, 
            error: 'Guest registration failed due to a network error. Please check your connection and try again.' 
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
      
      // Google Login - Always try login first, auto-register if user doesn't exist
      googleLogin: async (googleUserInfo: GoogleUserInfo) => {
        set({ isLoading: true, error: null });
        try {
          console.log('🔵 Starting Google authentication flow...');
          console.log('User info:', { 
            id: googleUserInfo.id, 
            email: googleUserInfo.email, 
            name: googleUserInfo.name 
          });
          
          // Step 1: Always try to login first using UserLogin_ForSocialMedia
          console.log('📱 Step 1: Attempting social media login...');
          const loginResponse: ApiResponse<any> = await socialMediaLogin({
            SocialId: googleUserInfo.id,
            Email: googleUserInfo.email,
            Mobile: '', // Mobile is not provided by Google, leave empty
            CompanyId: 3044,
          });

          console.log('🔍 Social Login Response:', JSON.stringify(loginResponse, null, 2));

          // Check if login was successful (StatusCode 200 and ResponseCode 2)
          if (loginResponse.StatusCode === 200 && String(loginResponse.ResponseCode) === '2') {
            console.log('✅ User exists and logged in successfully');
            const userDetails = loginResponse.Data || loginResponse.UserDetails;
            if (userDetails) {
              const userId = userDetails.UserID || userDetails.UserId || '';
              
              set({
                isLoading: false,
                isLoggedIn: true,
                user: {
                  UserID: userId,
                  id: userId,
                  fullName: userDetails.FullName || googleUserInfo.name,
                  email: userDetails.Email || googleUserInfo.email,
                  mobile: userDetails.Mobile || '',
                },
                error: null,
              });
              return true;
            } else {
              console.error('❌ Login successful but no user details returned');
              set({ 
                isLoading: false, 
                error: 'Login successful but user details not found.' 
              });
              return false;
            }
          } 
          // Check if user doesn't exist (StatusCode 200 and ResponseCode -4)
          else if (loginResponse.StatusCode === 200 && String(loginResponse.ResponseCode) === '-4') {
            console.log('👤 User does not exist, proceeding with auto-registration...');
            
            // Step 2: Auto-register the user using SaveUserRegistration_ForSocialMedia
            const ipAddress = await getDeviceIP();
            const source = Platform.OS === 'ios' ? 'iOS' : 'Android';
            
            console.log('📝 Step 2: Attempting social media registration...');
            const registerResponse = await socialMediaRegister({
              SocialId: googleUserInfo.id,
              SocialId_Description: 'Google',
              FullName: googleUserInfo.name,
              Email: googleUserInfo.email,
              Mobile: '', // Mobile is optional for Google signup
              Password: '', // Empty password for social registration
              IpAddress: ipAddress,
              Source: source,
              CompanyId: 3044,
              IsExist_FullName: !!googleUserInfo.name,
              IsExist_Mobile: false, // No mobile provided
              IsExist_EmailId: !!googleUserInfo.email,
            });

            console.log('🔍 Social Register Response:', JSON.stringify(registerResponse, null, 2));
            
            // Check if registration was successful (StatusCode 200 and ResponseCode 2)
            if (registerResponse.StatusCode === 200 && String(registerResponse.ResponseCode) === '2') {
              console.log('✅ User registered and logged in successfully');
              
              // Extract the user ID from the response (now directly available due to apiRequest fix)
              const userId = registerResponse.UserId || '';
              const userFullName = registerResponse.FullName || googleUserInfo.name;
              const userEmail = registerResponse.Email || googleUserInfo.email;
              const userMobile = registerResponse.Mobile || '';
              
              console.log(`📋 Social registration successful, user ID: ${userId || 'Not provided by API'}`);
              
              if (!userId) {
                console.error('⚠️ WARNING: No UserId received from social registration API!');
                console.error('Full response received:', JSON.stringify(registerResponse, null, 2));
              }
              
              set({
                isLoading: false,
                isLoggedIn: true,
                user: {
                  fullName: userFullName,
                  email: userEmail,
                  mobile: userMobile,
                  UserID: userId,
                  id: userId,
                },
                error: null,
              });
              return true;
            } else {
              console.error('❌ Registration failed:', registerResponse.Message);
              let errorMessage = registerResponse.Message || 'Registration failed. Please try again.';
              
              // Handle specific registration error codes
              if (String(registerResponse.ResponseCode) === '-2') {
                errorMessage = 'Registration was not successful. Please try again.';
              } else if (String(registerResponse.ResponseCode) === '-4') {
                errorMessage = 'User already registered. Please try logging in.';
              } else if (String(registerResponse.ResponseCode) === '-8') {
                errorMessage = 'Server validation error. Please try again later.';
              } else if (String(registerResponse.ResponseCode) === '-10') {
                errorMessage = 'Something went wrong during registration. Please try again.';
              }
              
              set({ 
                isLoading: false, 
                error: errorMessage 
              });
              return false;
            }
          } 
          // Handle other login response codes
          else if (loginResponse.StatusCode === 200 && String(loginResponse.ResponseCode) === '-6') {
            console.error('❌ Server validation error during login');
            set({ 
              isLoading: false, 
              error: 'Server validation error. Please try again later.' 
            });
            return false;
          } else if (loginResponse.StatusCode === 200 && String(loginResponse.ResponseCode) === '-2') {
            console.error('❌ General error during login');
            set({ 
              isLoading: false, 
              error: 'Something went wrong during login. Please try again.' 
            });
            return false;
          } else {
            console.error('❌ Unexpected login response:', loginResponse);
            set({ 
              isLoading: false, 
              error: loginResponse.Message || 'Google authentication failed.' 
            });
            return false;
          }
        } catch (error) {
          console.error('❌ Google authentication error:', error);
          set({ isLoading: false, error: 'Google authentication failed due to a network error.' });
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
      // Exclude password from persisted state but preserve UserID
      partialize: (state) => {
        if (!state.user) return { ...state, user: null };
        const { password, ...userWithoutPassword } = state.user;
        // Ensure UserID and id are preserved during persistence
        const persistedUser = {
          ...userWithoutPassword,
          UserID: state.user.UserID || state.user.id || '',
          id: state.user.id || state.user.UserID || '',
        };
        console.log('📦 Persisting user data:', persistedUser);
        return { ...state, user: persistedUser };
      },
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          console.log('💧 Hydrated user data from storage:', state.user);
          // Ensure both UserID and id are set after hydration
          if (state.user.UserID && !state.user.id) {
            state.user.id = state.user.UserID;
            console.log('🔧 Fixed missing id field after hydration');
          } else if (state.user.id && !state.user.UserID) {
            state.user.UserID = state.user.id;
            console.log('🔧 Fixed missing UserID field after hydration');
          } else if (!state.user.UserID && !state.user.id) {
            console.error('⚠️ WARNING: Both UserID and id are missing after hydration!');
          }
        } else {
          console.log('💧 No user data found during hydration');
        }
      },
    }
  )
);

export default useAuthStore; 