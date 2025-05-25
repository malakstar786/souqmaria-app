import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

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
  getCultureId: () => string;
  getCurrentLanguage: () => Language;
  clearError: () => void;
}

const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      // Initial state - default to English for first-time users
      currentLanguage: LANGUAGES.en,
      isLoading: false,
      error: null,

      // Set language and persist the choice
      setLanguage: async (languageCode: 'en' | 'ar') => {
        try {
          set({ isLoading: true, error: null });
          
          const newLanguage = LANGUAGES[languageCode];
          if (!newLanguage) {
            throw new Error(`Unsupported language: ${languageCode}`);
          }

          // Update RTL layout direction
          I18nManager.forceRTL(newLanguage.isRTL);

          set({ 
            currentLanguage: newLanguage,
            isLoading: false 
          });

          console.log(`🌐 Language changed to: ${newLanguage.name} (Culture ID: ${newLanguage.cultureId}, RTL: ${newLanguage.isRTL})`);
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to change language';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          console.error('🌐 Language change error:', error);
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
      // Only persist the current language, not loading/error states
      partialize: (state) => ({ currentLanguage: state.currentLanguage }),
    }
  )
);

export default useLanguageStore; 