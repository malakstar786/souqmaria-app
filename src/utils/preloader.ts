// Data preloader utility to improve app performance
// This preloads critical data for both languages in the background

import { getCategories, getAllCategories, getBanners } from './api-service';
import { apiCache } from './api-cache';
import useLanguageStore from '../store/language-store';

class DataPreloader {
  private isPreloading = false;
  private preloadedLanguages = new Set<string>();

  // Preload critical data for a specific language
  async preloadForLanguage(cultureId: string, userId = ''): Promise<void> {
    if (this.preloadedLanguages.has(cultureId) || this.isPreloading) {
      return;
    }

    this.isPreloading = true;
    console.log('🚀 Preloading data for culture:', cultureId);

    try {
      // Preload in parallel for better performance
      await Promise.allSettled([
        getCategories(cultureId, userId),
        getAllCategories(cultureId, userId),
        getBanners(cultureId, userId),
      ]);

      this.preloadedLanguages.add(cultureId);
      console.log('✅ Preloading completed for culture:', cultureId);
    } catch (error) {
      console.error('❌ Preloading failed for culture:', cultureId, error);
    } finally {
      this.isPreloading = false;
    }
  }

  // Preload data for both languages
  async preloadBothLanguages(userId = ''): Promise<void> {
    const englishCultureId = '1';
    const arabicCultureId = '2';

    // Get current language first, then preload the other
    const currentCultureId = useLanguageStore.getState().getCultureId();
    const otherCultureId = currentCultureId === englishCultureId ? arabicCultureId : englishCultureId;

    // Preload current language first (higher priority)
    await this.preloadForLanguage(currentCultureId, userId);
    
    // Then preload the other language in background
    setTimeout(() => {
      this.preloadForLanguage(otherCultureId, userId);
    }, 1000); // Delay to not interfere with current language loading
  }

  // Check if data is preloaded for a language
  isPreloadedForLanguage(cultureId: string): boolean {
    return this.preloadedLanguages.has(cultureId);
  }

  // Clear preload status (useful when cache is cleared)
  clearPreloadStatus(): void {
    this.preloadedLanguages.clear();
  }
}

// Export singleton instance
export const dataPreloader = new DataPreloader();

// Helper function to start preloading
export function startDataPreloading(userId = ''): void {
  // Start preloading after a short delay to not block initial app load
  setTimeout(() => {
    dataPreloader.preloadBothLanguages(userId);
  }, 500);
}

// Background refresh function to keep data fresh
export function startBackgroundRefresh(userId = ''): void {
  // Refresh data every 10 minutes in background
  setInterval(() => {
    const currentCultureId = useLanguageStore.getState().getCultureId();
    console.log('🔄 Background refresh for culture:', currentCultureId);
    
    // Clear cache and reload for current language
    apiCache.clearByCultureId(currentCultureId);
    dataPreloader.preloadForLanguage(currentCultureId, userId);
  }, 10 * 60 * 1000); // 10 minutes
} 