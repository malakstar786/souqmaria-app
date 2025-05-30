import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
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

          // Clear cache for the new language to ensure fresh data
          await apiCache.clearByCultureId(newLanguage.cultureId);

          // Update RTL layout direction
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
          
          // Force RTL setting to match current language
          I18nManager.forceRTL(currentLang.isRTL);
          
          // Increment layout version to force re-render
          set({ layoutVersion: get().layoutVersion + 1 });
          
          console.log(`🌐 Language initialized: ${currentLang.name} (RTL: ${currentLang.isRTL})`);
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