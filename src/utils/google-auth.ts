import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Google OAuth configuration
export const GOOGLE_CONFIG = {
  iosClientId: '202494615598-td9rqr8jf425leb6busf2r4andi7n7aa.apps.googleusercontent.com',
  androidClientId: '202494615598-7ejmn8pob2deak2uvfs67cev1rtu5ac1.apps.googleusercontent.com',
  webClientId: '202494615598-gn9b681ks85kgjlsrsmnmqglbtcdcp5n.apps.googleusercontent.com', 
};

// Google user info interface
export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  verified_email?: boolean;
}

// Google auth response interface
export interface GoogleAuthResponse {
  success: boolean;
  userInfo?: GoogleUserInfo;
  accessToken?: string;
  error?: string;
}

// Check if we're running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Initialize Google Sign-In (only for production builds)
export const initializeGoogleSignIn = async () => {
  if (isExpoGo) {
    console.log('🔧 Running in Expo Go - Google Sign-In not available');
    return false;
  }

  try {
    // Dynamically import Google Sign-In only when not in Expo Go
    const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
    
    console.log('🔧 Initializing Google Sign-In...');
    console.log('Platform:', Platform.OS);
    console.log('iOS Client ID:', GOOGLE_CONFIG.iosClientId);
    console.log('Android Client ID:', GOOGLE_CONFIG.androidClientId);
    console.log('Web Client ID:', GOOGLE_CONFIG.webClientId);

    GoogleSignin.configure({
      iosClientId: GOOGLE_CONFIG.iosClientId,
      webClientId: GOOGLE_CONFIG.webClientId,
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
      accountName: '',
      googleServicePlistPath: '',
      profileImageSize: 120,
    });

    console.log('✅ Google Sign-In initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Google Sign-In:', error);
    return false;
  }
};

// Hook replacement for useGoogleAuth (for compatibility)
export const useGoogleAuth = () => {
  // Initialize Google Sign-In when the hook is used
  initializeGoogleSignIn();

  // Return empty objects for compatibility with existing code
  return {
    request: null,
    response: null,
    promptAsync: null,
  };
};

// Fallback implementation for Expo Go
const authenticateWithExpoGo = async (): Promise<GoogleAuthResponse> => {
  console.log('⚠️ Google Sign-In not available in Expo Go');
  return {
    success: false,
    error: 'Google Sign-In is not available in Expo Go. Please use a development build or production app.',
  };
};

// Native Google Sign-In implementation
const authenticateWithNativeGoogleSignIn = async (): Promise<GoogleAuthResponse> => {
  try {
    const { GoogleSignin, statusCodes } = await import('@react-native-google-signin/google-signin');
    
    console.log('🚀 Starting Google authentication with native sign-in...');
    
    // Initialize Google Sign-In
    await initializeGoogleSignIn();

    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    console.log('✅ Google Play Services available');

    // Sign in
    const result = await GoogleSignin.signIn();
    console.log('📋 Google Sign-In Result:', JSON.stringify(result, null, 2));

    // Check for user data in the response structure
    let user = null;
    if (result && (result as any).data && (result as any).data.user) {
      // User data is in result.data.user
      user = (result as any).data.user;
      console.log('✅ Found user data in result.data.user');
    } else if (result && (result as any).user) {
      // User data is directly in result.user
      user = (result as any).user;
      console.log('✅ Found user data in result.user');
    }

    if (user) {
      // Get access token
      const tokens = await GoogleSignin.getTokens();
      console.log('🔑 Access Token received:', tokens.accessToken?.substring(0, 20) + '...');

      // Map the response to our interface
      const mappedUserInfo: GoogleUserInfo = {
        id: user.id,
        email: user.email,
        name: user.name || '',
        given_name: user.givenName || undefined,
        family_name: user.familyName || undefined,
        picture: user.photo || undefined,
        verified_email: true, // Google Sign-In always provides verified emails
      };

      console.log('✅ Google authentication successful:', {
        id: mappedUserInfo.id,
        email: mappedUserInfo.email,
        name: mappedUserInfo.name,
      });

      return {
        success: true,
        userInfo: mappedUserInfo,
        accessToken: tokens.accessToken,
      };
    } else {
      console.error('❌ No user info received from Google Sign-In');
      console.error('❌ Result structure:', JSON.stringify(result, null, 2));
      return {
        success: false,
        error: 'No user information received from Google',
      };
    }
  } catch (error: any) {
    console.error('❌ Google authentication error:', error);
    
    // Import status codes dynamically
    try {
      const { statusCodes } = await import('@react-native-google-signin/google-signin');
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('⚠️ User cancelled Google authentication');
        return {
          success: false,
          error: 'User cancelled Google authentication',
        };
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('⚠️ Google sign-in already in progress');
        return {
          success: false,
          error: 'Google sign-in already in progress',
        };
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error('❌ Google Play Services not available');
        return {
          success: false,
          error: 'Google Play Services not available',
        };
      }
    } catch (importError) {
      console.error('❌ Failed to import status codes:', importError);
    }
    
    const errorMessage = error.message || 'Unknown error';
    console.error('❌ Unknown Google authentication error:', errorMessage);
    return {
      success: false,
      error: `Google authentication failed: ${errorMessage}`,
    };
  }
};

// Main Google authentication function
export const authenticateWithGoogle = async (): Promise<GoogleAuthResponse> => {
  if (isExpoGo) {
    return authenticateWithExpoGo();
  } else {
    return authenticateWithNativeGoogleSignIn();
  }
};

// Sign out function
export const signOutFromGoogle = async (): Promise<boolean> => {
  if (isExpoGo) {
    console.log('⚠️ Google Sign-Out not available in Expo Go');
    return false;
  }

  try {
    const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
    console.log('🚪 Signing out from Google...');
    await GoogleSignin.signOut();
    console.log('✅ Successfully signed out from Google');
    return true;
  } catch (error) {
    console.error('❌ Error signing out from Google:', error);
    return false;
  }
};

// Check if user is signed in
export const isGoogleSignedIn = async (): Promise<boolean> => {
  if (isExpoGo) {
    return false;
  }

  try {
    const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
    const currentUser = await GoogleSignin.getCurrentUser();
    console.log('🔍 Google sign-in status:', !!currentUser);
    return !!currentUser;
  } catch (error) {
    console.error('❌ Error checking Google sign-in status:', error);
    return false;
  }
};

// Get current user info
export const getCurrentGoogleUser = async (): Promise<GoogleUserInfo | null> => {
  if (isExpoGo) {
    return null;
  }

  try {
    const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser && (currentUser as any).user) {
      const user = (currentUser as any).user;
      return {
        id: user.id,
        email: user.email,
        name: user.name || '',
        given_name: user.givenName || undefined,
        family_name: user.familyName || undefined,
        picture: user.photo || undefined,
        verified_email: true,
      };
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting current Google user:', error);
    return null;
  }
};