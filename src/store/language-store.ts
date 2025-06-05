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

// Android-specific RTL handler - only apply RTL when language is Arabic
const handleAndroidRTL = (language: Language) => {
  if (Platform.OS === 'android') {
    // Only force RTL if language is Arabic, otherwise force LTR
    const shouldApplyRTL = language.code === 'ar';
    
    console.log(`🤖 Android RTL: Setting ${language.code} -> RTL: ${shouldApplyRTL}`);
    
    // Apply immediately and verify with multiple attempts for stubborn Android caching
    I18nManager.forceRTL(shouldApplyRTL);
    
    // Add verification with retry mechanism for Android with stronger forcing
    setTimeout(() => {
      const currentRTLState = I18nManager.isRTL;
      if (currentRTLState !== shouldApplyRTL) {
        console.warn(`🤖 Android RTL mismatch detected! Expected: ${shouldApplyRTL}, Actual: ${currentRTLState}`);
        
        // Force apply again with more aggressive approach
        I18nManager.forceRTL(shouldApplyRTL);
        
        // For English (LTR), try forcing RTL to false multiple times to clear cache
        if (!shouldApplyRTL) {
          console.log('🤖 Attempting to clear Android RTL cache...');
          // Try multiple times to clear stubborn RTL state
          setTimeout(() => I18nManager.forceRTL(false), 10);
          setTimeout(() => I18nManager.forceRTL(false), 50);
          setTimeout(() => I18nManager.forceRTL(false), 100);
        }
        
        // Final check after aggressive clearing
        setTimeout(() => {
          const finalRTLState = I18nManager.isRTL;
          if (finalRTLState !== shouldApplyRTL) {
            console.error(`🤖 Android RTL failed to apply correctly. Final state: ${finalRTLState}, Expected: ${shouldApplyRTL}`);
            // As a last resort, try clearing AsyncStorage RTL state
            AsyncStorage.removeItem('last-rtl-state').then(() => {
              console.log('🤖 Cleared RTL state from storage');
              I18nManager.forceRTL(shouldApplyRTL);
            });
          } else {
            console.log(`🤖 Android RTL corrected: ${language.code} -> RTL: ${shouldApplyRTL}`);
          }
        }, 200);
      } else {
        console.log(`🤖 Android RTL applied correctly: ${language.code} -> RTL: ${shouldApplyRTL}`);
      }
    }, 50);
  }
  // iOS handles RTL naturally, no need to force
};

// Early RTL initialization for Android - only apply RTL for Arabic
const initializeRTLEarly = () => {
  if (Platform.OS !== 'android') return; // Only for Android
  
  try {
    console.log('🤖 Early RTL initialization starting...');
    
    // Get the stored language synchronously (best effort)
    AsyncStorage.getItem('souq-maria-language').then((storedData) => {
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          const storedLanguage = parsedData?.state?.currentLanguage;
          
          if (storedLanguage && LANGUAGES[storedLanguage.code]) {
            // Only apply RTL if the language is Arabic
            const shouldBeRTL = storedLanguage.code === 'ar';
            
            console.log(`🤖 Early init: Stored language ${storedLanguage.code}, setting RTL to ${shouldBeRTL}`);
            
            // Force clear any cached RTL state first for LTR languages
            if (!shouldBeRTL) {
              console.log('🤖 Early init: Clearing RTL cache for LTR language');
              I18nManager.forceRTL(false);
              setTimeout(() => I18nManager.forceRTL(false), 10);
              setTimeout(() => I18nManager.forceRTL(false), 50);
            }
            
            // Then set the correct state
            I18nManager.forceRTL(shouldBeRTL);
            
            // Store the last applied RTL state
            AsyncStorage.setItem('last-rtl-state', JSON.stringify(shouldBeRTL));
            
            console.log(`🤖 Early Android RTL init: ${storedLanguage.code} (RTL: ${shouldBeRTL})`);
          }
        } catch (error) {
          console.warn('🤖 Failed to parse stored language, defaulting to LTR and clearing cache');
          // Clear any potential RTL cache
          I18nManager.forceRTL(false);
          setTimeout(() => I18nManager.forceRTL(false), 10);
          setTimeout(() => I18nManager.forceRTL(false), 50);
          AsyncStorage.setItem('last-rtl-state', JSON.stringify(false));
          AsyncStorage.removeItem('last-rtl-state'); // Clear cached state
        }
      } else {
        // First time user - default to English (LTR) and clear any cache
        console.log('🤖 First time user - defaulting to LTR and clearing cache');
        I18nManager.forceRTL(false);
        setTimeout(() => I18nManager.forceRTL(false), 10);
        setTimeout(() => I18nManager.forceRTL(false), 50);
        AsyncStorage.setItem('last-rtl-state', JSON.stringify(false));
        console.log('🤖 First time user - defaulting to LTR');
      }
    }).catch(() => {
      // Storage error - default to LTR and clear cache
      console.log('🤖 Storage error - defaulting to LTR and clearing cache');
      I18nManager.forceRTL(false);
      setTimeout(() => I18nManager.forceRTL(false), 10);
      setTimeout(() => I18nManager.forceRTL(false), 50);
      AsyncStorage.setItem('last-rtl-state', JSON.stringify(false));
      AsyncStorage.removeItem('last-rtl-state'); // Clear cached state
    });
  } catch (error) {
    console.error('🤖 Early RTL initialization error:', error);
    // Fallback - force LTR and clear cache
    I18nManager.forceRTL(false);
    setTimeout(() => I18nManager.forceRTL(false), 10);
    setTimeout(() => I18nManager.forceRTL(false), 50);
  }
};

// Function to verify and restore RTL state if needed (for Android navigation issues)
const verifyAndRestoreRTL = async () => {
  if (Platform.OS !== 'android') return;
  
  try {
    const storedData = await AsyncStorage.getItem('souq-maria-language');
    const lastRTLState = await AsyncStorage.getItem('last-rtl-state');
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const storedLanguage = parsedData?.state?.currentLanguage;
      
      if (storedLanguage && LANGUAGES[storedLanguage.code]) {
        const shouldBeRTL = storedLanguage.code === 'ar';
        const currentRTLState = I18nManager.isRTL;
        const lastRTL = lastRTLState ? JSON.parse(lastRTLState) : false;
        
        // If there's a mismatch between expected and actual RTL state
        if (currentRTLState !== shouldBeRTL || lastRTL !== shouldBeRTL) {
          console.log(`🤖 Restoring Android RTL state: ${storedLanguage.code} (RTL: ${shouldBeRTL})`);
          I18nManager.forceRTL(shouldBeRTL);
          await AsyncStorage.setItem('last-rtl-state', JSON.stringify(shouldBeRTL));
        }
      }
    }
  } catch (error) {
    console.error('🤖 Error verifying RTL state:', error);
  }
};

// Initialize RTL early on Android only
initializeRTLEarly();

interface LanguageStore {
  currentLanguage: Language;
  isLoading: boolean;
  error: string | null;
  layoutVersion: number;
  lastUpdate: number;
  
  // Actions
  setLanguage: (languageCode: 'en' | 'ar') => Promise<boolean>;
  initializeLanguage: () => Promise<void>;
  verifyRTLState: () => Promise<void>;
  getCultureId: () => string;
  getCurrentLanguage: () => Language;
  clearError: () => void;
  forceLayoutUpdate: () => void;
  preloadLanguageCache: (languageCode: 'en' | 'ar') => Promise<void>;
  resetToDefault: () => Promise<void>;
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
      lastUpdate: 0,

      // Set language and persist the choice
      setLanguage: async (languageCode: 'en' | 'ar'): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });
          
          const newLanguage = LANGUAGES[languageCode];
          if (!newLanguage) {
            throw new Error(`Unsupported language: ${languageCode}`);
          }
          
          const previousLanguage = get().currentLanguage;
          
          // For Android: Check if we're switching between Arabic and non-Arabic
          // For iOS: Check if RTL property is changing
          let isRTLChanging = false;
          if (Platform.OS === 'android') {
            const currentIsArabic = previousLanguage.code === 'ar';
            const newIsArabic = newLanguage.code === 'ar';
            isRTLChanging = currentIsArabic !== newIsArabic;
          } else {
            // iOS - use natural RTL property
            isRTLChanging = previousLanguage.isRTL !== newLanguage.isRTL;
          }
          
          console.log(`🌐 Language change: ${previousLanguage.code} -> ${newLanguage.code}, RTL changing: ${isRTLChanging}`);
          
          // Update state first
          set({ 
            currentLanguage: newLanguage,
            isLoading: false,
            lastUpdate: Date.now(),
            layoutVersion: get().layoutVersion + 1
          });
          
          // For Android with RTL changes: aggressive cache clearing
          if (Platform.OS === 'android' && isRTLChanging) {
            console.log('🤖 Clearing Android RTL cache before language change');
            
            // Clear any stored RTL state first
            await AsyncStorage.removeItem('last-rtl-state');
            
            // Aggressive RTL cache clearing for Android
            const shouldApplyRTL = newLanguage.code === 'ar';
            
            if (!shouldApplyRTL) {
              // For switching to English (LTR), force clear multiple times
              console.log('🤖 Aggressively clearing RTL cache for LTR');
              I18nManager.forceRTL(false);
              await new Promise(resolve => setTimeout(resolve, 10));
              I18nManager.forceRTL(false);
              await new Promise(resolve => setTimeout(resolve, 10));
              I18nManager.forceRTL(false);
              await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            // Now apply the correct RTL state
            I18nManager.forceRTL(shouldApplyRTL);
            
            // Store the new RTL state
            AsyncStorage.setItem('last-rtl-state', JSON.stringify(shouldApplyRTL));
            
            console.log(`🤖 Applied RTL state: ${newLanguage.code} -> ${shouldApplyRTL}`);
          } else {
            // Handle Android-specific RTL logic
            handleAndroidRTL(newLanguage);
          }
          
          // Log state update
          const currentState = {
            language: newLanguage.code,
            isRTL: Platform.OS === 'android' ? newLanguage.code === 'ar' : newLanguage.isRTL,
            I18nManagerRTL: I18nManager.isRTL,
            platform: Platform.OS,
            layoutVersion: get().layoutVersion
          };
          console.log('🔄 RTL state updated:', currentState);
          
          return true;
        } catch (error) {
          console.error('🔴 Language setting error:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to set language' 
          });
          return false;
        }
      },

      // Initialize language on app start - ensures proper RTL state
      initializeLanguage: async () => {
        try {
          const currentLang = get().currentLanguage;
          
          // For Android: verify and restore RTL state first
          if (Platform.OS === 'android') {
            await verifyAndRestoreRTL();
          }
          
          // Apply Android-specific RTL logic
          handleAndroidRTL(currentLang);
          
          // On Android, add extra verification and logging
          if (Platform.OS === 'android') {
            // Small delay to ensure I18nManager state is properly set
            setTimeout(async () => {
              const i18nState = I18nManager.isRTL;
              const expectedRTL = currentLang.code === 'ar';
              
              if (i18nState !== expectedRTL) {
                console.warn(`🤖 Android RTL mismatch during init! Expected: ${expectedRTL}, Actual: ${i18nState}`);
                // Force set again with storage update
                I18nManager.forceRTL(expectedRTL);
                await AsyncStorage.setItem('last-rtl-state', JSON.stringify(expectedRTL));
                
                // Force layout update
                set({ layoutVersion: get().layoutVersion + 1 });
              } else {
                console.log(`🤖 Android RTL state verified correctly: ${currentLang.code} (RTL: ${expectedRTL})`);
              }
            }, 100);
          }
          
          // Increment layout version to force re-render
          set({ layoutVersion: get().layoutVersion + 1 });

          console.log(`🌐 Language initialized: ${currentLang.name} (RTL: ${currentLang.isRTL})`);
        } catch (error) {
          console.error('🌐 Language initialization error:', error);
        }
      },

      // Reset to default English language
      resetToDefault: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Clear all cache
          await apiCache.clearAll();
          
          // Reset to English
          const defaultLanguage = LANGUAGES.en;
          
          // Apply Android-specific RTL logic
          handleAndroidRTL(defaultLanguage);
          
          set({ 
            currentLanguage: defaultLanguage,
            isLoading: false,
            layoutVersion: get().layoutVersion + 1
          });
          
          console.log('🌐 Language reset to default (English)');
        } catch (error) {
          set({ 
            error: 'Failed to reset language',
            isLoading: false 
          });
          console.error('🌐 Language reset error:', error);
        }
      },

      // Get culture ID for API calls
      getCultureId: () => {
        return get().currentLanguage.cultureId;
      },

      // Get current language
      getCurrentLanguage: () => {
        return get().currentLanguage;
      },

      // Clear error state
      clearError: () => {
        set({ error: null });
      },

      // Force layout update (useful for triggering re-renders)
      forceLayoutUpdate: () => {
        set({ layoutVersion: get().layoutVersion + 1 });
      },

      // Preload cache for a specific language
      preloadLanguageCache: async (languageCode: 'en' | 'ar') => {
        try {
          const language = LANGUAGES[languageCode];
          if (language) {
            await apiCache.preloadForLanguage(language.cultureId);
            console.log(`🌐 Cache preloaded for language: ${language.name}`);
          }
        } catch (error) {
          console.error('🌐 Cache preload error:', error);
        }
      },

      // Add method to verify RTL state during navigation
      verifyRTLState: async () => {
        try {
          const currentLang = get().currentLanguage;
          
          // For Android: verify and restore RTL state first
          if (Platform.OS === 'android') {
            await verifyAndRestoreRTL();
          }
          
          // Apply Android-specific RTL logic
          handleAndroidRTL(currentLang);
          
          // On Android, add extra verification and logging
          if (Platform.OS === 'android') {
            // Small delay to ensure I18nManager state is properly set
            setTimeout(async () => {
              const i18nState = I18nManager.isRTL;
              const expectedRTL = currentLang.code === 'ar';
              
              if (i18nState !== expectedRTL) {
                console.warn(`🤖 Android RTL mismatch during verifyRTLState! Expected: ${expectedRTL}, Actual: ${i18nState}`);
                // Force set again with storage update
                I18nManager.forceRTL(expectedRTL);
                await AsyncStorage.setItem('last-rtl-state', JSON.stringify(expectedRTL));
                
                // Force layout update
                set({ layoutVersion: get().layoutVersion + 1 });
              } else {
                console.log(`🤖 Android RTL state verified correctly: ${currentLang.code} (RTL: ${expectedRTL})`);
              }
            }, 100);
          }
          
          // Increment layout version to force re-render
          set({ layoutVersion: get().layoutVersion + 1 });

          console.log(`🌐 RTL state verified: ${currentLang.name} (RTL: ${currentLang.isRTL})`);
        } catch (error) {
          console.error('🌐 RTL state verification error:', error);
        }
      },
    }),
    {
      name: 'souq-maria-language',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the language choice, not loading states
      partialize: (state) => ({ 
        currentLanguage: state.currentLanguage,
        layoutVersion: state.layoutVersion
      }),
    }
  )
);

export default useLanguageStore; 