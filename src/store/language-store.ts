import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, Platform } from 'react-native';
import * as Updates from 'expo-updates';

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

interface LanguageStore {
  currentLanguage: Language;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setLanguage: (languageCode: 'en' | 'ar') => Promise<void>;
  initializeLanguage: () => Promise<void>;
  getCultureId: () => string;
  getCurrentLanguage: () => Language;
  clearError: () => void;
}

const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      // Initial state - default to English
      currentLanguage: LANGUAGES.en,
      isLoading: false,
      error: null,

      // Set language and apply RTL if needed
      setLanguage: async (languageCode: 'en' | 'ar'): Promise<void> => {
        try {
          set({ isLoading: true, error: null });
          
          const newLanguage = LANGUAGES[languageCode];
          if (!newLanguage) {
            throw new Error(`Unsupported language: ${languageCode}`);
          }
          
          // Check if RTL direction is changing
          const currentRTL = I18nManager.isRTL;
          const shouldBeRTL = languageCode === 'ar';
          
          // Update state immediately for UI updates before potential reload
          set({ 
            currentLanguage: newLanguage,
            isLoading: false,
          });
          
          // Only force RTL and reload if the direction is actually changing
          if (currentRTL !== shouldBeRTL) {
            console.log(`🌐 RTL direction changing from ${currentRTL} to ${shouldBeRTL}. Reloading app...`);
            
            // Apply RTL for Arabic
            I18nManager.forceRTL(shouldBeRTL);
            
            // Reload the app to apply the native RTL layout changes
            // Wait a moment to ensure RTL changes and state updates are processed
            setTimeout(async () => {
              try {
                await Updates.reloadAsync();
              } catch (error) {
                console.error('Failed to reload app:', error);
                // App will continue with the new language but may have layout issues
              }
            }, 100);
          } else {
            console.log(`🌐 Language changed to: ${newLanguage.name} (RTL: ${shouldBeRTL})`);
          }
        } catch (error) {
          console.error('Language setting error:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to set language' 
          });
        }
      },

      // Initialize language on app start
      initializeLanguage: async () => {
        try {
          set({ isLoading: true });
          
          // Get the persisted language (AsyncStorage access is handled by the persist middleware)
          const currentLang = get().currentLanguage;
          
          // Double check if the language is valid, use English as fallback
          const validLang = LANGUAGES[currentLang?.code] || LANGUAGES.en;
          
          // Update state if needed (if fallback was used)
          if (currentLang?.code !== validLang.code) {
            set({ currentLanguage: validLang });
          }
          
          // Note: We don't apply I18nManager.forceRTL here
          // That is now managed in the _layout.tsx to avoid duplication
          
          console.log(`🌐 Language initialized: ${validLang.name} (code: ${validLang.code})`);
          set({ isLoading: false });
          
          // Return the initialized language for immediate use by caller
          return;
        } catch (error) {
          console.error('Language initialization error:', error);
          set({ isLoading: false, error: 'Failed to initialize language' });
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
    }),
    {
      name: 'souq-maria-language',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the language choice
      partialize: (state) => ({ 
        currentLanguage: state.currentLanguage,
      }),
    }
  )
);

export default useLanguageStore; 