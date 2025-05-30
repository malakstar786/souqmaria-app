import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, Platform, Alert, BackHandler } from 'react-native';
import { apiCache } from '../utils/api-cache';

export interface Language {
  code: 'en' | 'ar';
  name: string;
  cultureId: string;
  isRTL: boolean;
}

export const LANGUAGES: Record<string, Language> = {
  en: {
    code: 'en',
    name: 'English',
    cultureId: '1',
    isRTL: false,
  },
  ar: {
    code: 'ar', 
    name: 'العربية',
    cultureId: '2',
    isRTL: true,
  },
};

// Early RTL initialization for Android - this runs synchronously
const initializeRTLEarly = () => {
  try {
    // Get the stored language synchronously (best effort)
    AsyncStorage.getItem('souq-maria-language').then((storedData) => {
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          const storedLanguage = parsedData?.state?.currentLanguage;
          
          if (storedLanguage && LANGUAGES[storedLanguage.code]) {
            const shouldBeRTL = storedLanguage.isRTL;
            
            // Force RTL state synchronously for Android
            I18nManager.forceRTL(shouldBeRTL);
            
            console.log(`🤖 Early Android RTL init: ${storedLanguage.code} (RTL: ${shouldBeRTL})`);
          }
        } catch (error) {
          console.warn('🤖 Failed to parse stored language, defaulting to LTR');
          I18nManager.forceRTL(false);
        }
      } else {
        // First time user - default to English (LTR)
        I18nManager.forceRTL(false);
        console.log('🤖 First time user - defaulting to LTR');
      }
    }).catch(() => {
      // Storage error - default to LTR
      I18nManager.forceRTL(false);
      console.log('🤖 Storage error - defaulting to LTR');
    });
  } catch (error) {
    console.error('🤖 Early RTL initialization error:', error);
    I18nManager.forceRTL(false);
  }
};

// Initialize RTL early on Android
if (Platform.OS === 'android') {
  initializeRTLEarly();
}

interface LanguageStore {
  currentLanguage: Language;
  isLoading: boolean;
  error: string | null;
  // Add a counter to force re-renders when language changes
  layoutVersion: number;
  
  // Actions
  setLanguage: (languageCode: 'en' | 'ar') => Promise<void>;
  getCultureId: () => string;
  getCurrentLanguage: () => Language;
  clearError: () => void;
  preloadLanguageCache: (languageCode: 'en' | 'ar') => Promise<void>;
  // Force layout update without app restart
  forceLayoutUpdate: () => void;
  // Reset to default language and clear all cache
  resetToDefault: () => Promise<void>;
  // Initialize language on app start
  initializeLanguage: () => Promise<void>;
}

// Function to handle app restart on Android when RTL changes
const handleAndroidRTLChange = () => {
  if (Platform.OS === 'android') {
    Alert.alert(
      'Language Changed',
      'The app will restart to apply the new language layout properly.',
      [
        {
          text: 'Restart Now',
          onPress: () => {
            // Force close the app so user can restart it
            // This is the safest way to ensure RTL changes take effect on Android
            setTimeout(() => {
              BackHandler.exitApp();
            }, 500);
          }
        }
      ],
      { cancelable: false }
    );
  }
};

const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      // Initial state - default to English for first-time users
      currentLanguage: LANGUAGES.en,
      isLoading: false,
      error: null,
      layoutVersion: 0,

      // Set language and persist the choice
      setLanguage: async (languageCode: 'en' | 'ar') => {
        try {
          set({ isLoading: true, error: null });
          
          const newLanguage = LANGUAGES[languageCode];
          if (!newLanguage) {
            throw new Error(`Unsupported language: ${languageCode}`);
          }

          const currentLanguage = get().currentLanguage;
          const isRTLChanging = currentLanguage.isRTL !== newLanguage.isRTL;

          // Clear cache for the new language to ensure fresh data
          await apiCache.clearByCultureId(newLanguage.cultureId);

          // Update RTL layout direction immediately
          I18nManager.forceRTL(newLanguage.isRTL);

          // Preload cache for the new language to improve performance
          await apiCache.preloadForLanguage(newLanguage.cultureId);

          // Update language and force layout re-render
          set({ 
            currentLanguage: newLanguage,
            isLoading: false,
            layoutVersion: get().layoutVersion + 1 // Force re-render
          });

          console.log(`🌐 Language changed to: ${newLanguage.name} (Culture ID: ${newLanguage.cultureId}, RTL: ${newLanguage.isRTL})`);
          
          // Handle Android RTL change - only if direction actually changed
          if (Platform.OS === 'android' && isRTLChanging) {
            setTimeout(() => {
              handleAndroidRTLChange();
            }, 1000); // Give time for state to update
          }
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to change language';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          console.error('🌐 Language change error:', error);
        }
      },

      // Initialize language on app start - ensures proper RTL state
      initializeLanguage: async () => {
        try {
          const currentLang = get().currentLanguage;
          
          // Force RTL setting to match current language immediately
          I18nManager.forceRTL(currentLang.isRTL);
          
          // On Android, add extra verification and logging
          if (Platform.OS === 'android') {
            // Small delay to ensure I18nManager state is properly set
            setTimeout(() => {
              const i18nState = I18nManager.isRTL;
              const expectedRTL = currentLang.isRTL;
              
              if (i18nState !== expectedRTL) {
                console.warn(`🤖 Android RTL mismatch detected! Expected: ${expectedRTL}, Actual: ${i18nState}`);
                // Force set again
                I18nManager.forceRTL(expectedRTL);
                
                // Force layout update
                set({ layoutVersion: get().layoutVersion + 1 });
              }
            }, 100);
          }
          
          // Increment layout version to force re-render
          set({ layoutVersion: get().layoutVersion + 1 });
          
          console.log(`🌐 Language initialized: ${currentLang.name} (RTL: ${currentLang.isRTL}, I18nManager.isRTL: ${I18nManager.isRTL}, Platform: ${Platform.OS})`);
        } catch (error) {
          console.error('🌐 Language initialization error:', error);
          // Fallback to English if initialization fails
          await get().resetToDefault();
        }
      },

      // Reset to default language and clear all cache
      resetToDefault: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Clear all API cache
          await apiCache.clearAll();
          
          // Reset to English (LTR)
          I18nManager.forceRTL(false);
          
          // Reset state to default
          set({
            currentLanguage: LANGUAGES.en,
            isLoading: false,
            error: null,
            layoutVersion: get().layoutVersion + 1,
          });
          
          console.log('🌐 Language reset to default (English)');
        } catch (error) {
          console.error('🌐 Language reset error:', error);
          set({
            error: 'Failed to reset language',
            isLoading: false,
          });
        }
      },

      // Force layout update without changing language
      forceLayoutUpdate: () => {
        set({ layoutVersion: get().layoutVersion + 1 });
      },

      // Preload cache for a specific language (useful for background preloading)
      preloadLanguageCache: async (languageCode: 'en' | 'ar') => {
        try {
          const language = LANGUAGES[languageCode];
          if (language) {
            await apiCache.preloadForLanguage(language.cultureId);
            console.log(`🔄 Cache preloaded for language: ${language.name}`);
          }
        } catch (error) {
          console.error('🔄 Cache preload error:', error);
        }
      },

      // Get current culture ID for API calls
      getCultureId: () => {
        return get().currentLanguage.cultureId;
      },

      // Get current language object
      getCurrentLanguage: () => {
        return get().currentLanguage;
      },

      // Clear error state
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'souq-maria-language',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the current language, not loading/error states or layoutVersion
      partialize: (state) => ({ currentLanguage: state.currentLanguage }),
      // Add migration to handle any corrupted data
      migrate: (persistedState, version) => {
        // If the persisted state is corrupted or invalid, reset to default
        if (!persistedState || typeof persistedState !== 'object') {
          return { currentLanguage: LANGUAGES.en };
        }
        
        const state = persistedState as any;
        
        // Validate the current language
        if (!state.currentLanguage || !LANGUAGES[state.currentLanguage.code]) {
          return { currentLanguage: LANGUAGES.en };
        }
        
        return state;
      },
    }
  )
);

export default useLanguageStore; 