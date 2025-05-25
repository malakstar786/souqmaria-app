// App configuration for different environments
import Constants from 'expo-constants';

export interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
  enableLogging: boolean;
  enableCrashReporting: boolean;
  enableAnalytics: boolean;
  cacheTimeout: number;
  appVersion: string;
  buildNumber: string;
}

const isDevelopment = __DEV__;
const isProduction = !__DEV__;

const config: AppConfig = {
  apiBaseUrl: 'https://api.souqmaria.com/api/MerpecWebApi/',
  environment: isDevelopment ? 'development' : 'production',
  enableLogging: isDevelopment,
  enableCrashReporting: isProduction,
  enableAnalytics: isProduction,
  cacheTimeout: isDevelopment ? 5 * 60 * 1000 : 30 * 60 * 1000, // 5 min dev, 30 min prod
  appVersion: Constants.expoConfig?.version || '1.0.0',
  buildNumber: Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode?.toString() || '1',
};

// App metadata
export const APP_METADATA = {
  name: 'SouqMaria',
  displayName: 'SouqMaria - سوق ماريا',
  description: 'Your trusted mobile and electronics marketplace in Kuwait',
  keywords: ['mobile', 'electronics', 'kuwait', 'shopping', 'souq'],
  supportEmail: 'support@souqmaria.com',
  websiteUrl: 'https://souqmaria.com',
  privacyPolicyUrl: 'https://souqmaria.com/privacy-policy',
  termsOfServiceUrl: 'https://souqmaria.com/terms-of-service',
  whatsappNumber: '+96598900952',
  socialMedia: {
    instagram: 'https://instagram.com/souqmaria',
    facebook: 'https://facebook.com/souqmaria',
    twitter: 'https://twitter.com/souqmaria',
  },
};

// Feature flags
export const FEATURES = {
  enableBiometricAuth: true,
  enablePushNotifications: true,
  enableOfflineMode: true,
  enableAnalytics: config.enableAnalytics,
  enableCrashReporting: config.enableCrashReporting,
  enableDeepLinking: true,
  enableShareProduct: true,
  enableWishlist: true,
  enableGuestCheckout: true,
};

// Performance settings
export const PERFORMANCE = {
  imageQuality: 0.8,
  maxImageSize: 1024,
  enableImageCaching: true,
  enableApiCaching: true,
  maxCacheSize: 50 * 1024 * 1024, // 50MB
  enableLazyLoading: true,
};

// Security settings
export const SECURITY = {
  enableSSLPinning: isProduction,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxLoginAttempts: 5,
  enableBiometricAuth: true,
  enableAutoLogout: true,
};

// Logging configuration
export const LOGGING = {
  enableConsoleLogging: config.enableLogging,
  enableRemoteLogging: config.enableCrashReporting,
  logLevel: isDevelopment ? 'debug' : 'error',
  maxLogSize: 10 * 1024 * 1024, // 10MB
};

export default config; 