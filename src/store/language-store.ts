import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, Platform } from 'react-native';

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
          
          // Update state
          set({ 
            currentLanguage: newLanguage,
            isLoading: false,
          });
          
          // Apply RTL for Arabic only
          const shouldBeRTL = languageCode === 'ar';
          I18nManager.forceRTL(shouldBeRTL);
          
          console.log(`🌐 Language changed to: ${newLanguage.name} (RTL: ${shouldBeRTL})`);
          
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
          const currentLang = get().currentLanguage;
          
          // Apply RTL for Arabic only
          const shouldBeRTL = currentLang.code === 'ar';
          I18nManager.forceRTL(shouldBeRTL);
          
          console.log(`🌐 Language initialized: ${currentLang.name} (RTL: ${shouldBeRTL})`);
        } catch (error) {
          console.error('Language initialization error:', error);
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