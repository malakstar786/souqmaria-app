// Data preloader utility to improve app performance
// This preloads critical data for both languages in the background

import { getCategories, getAllCategories, getBanners, getAllProductsDirectly } from './api-service';
import { apiCache } from './api-cache';
import useLanguageStore from '../store/language-store';
import { COMMON_PARAMS, CULTURE_IDS } from './api-config';

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
      // Preload core UI data in parallel for better performance
      await Promise.allSettled([
        getCategories(cultureId, userId),
        getAllCategories(cultureId, userId),
        getBanners(cultureId, userId),
      ]);

      // Preload popular product categories after core data
      await this.preloadPopularProducts(cultureId, userId);

      this.preloadedLanguages.add(cultureId);
      console.log('✅ Preloading completed for culture:', cultureId);
    } catch (error) {
      console.error('❌ Preloading failed for culture:', cultureId, error);
    } finally {
      this.isPreloading = false;
    }
  }

  // Preload popular product categories for faster initial product loading
  private async preloadPopularProducts(cultureId: string, userId = ''): Promise<void> {
    console.log('📦 Preloading popular products for culture:', cultureId);
    
    // Popular homepage categories to preload
    const popularCategories = [
      { PageCode: 'HPC2', HomePageCatSrNo: 'HC31790006' }, // Mobile
      { PageCode: 'HPC2', HomePageCatSrNo: 'HC31790007' }, // Tablet  
      { PageCode: 'HPC2', HomePageCatSrNo: 'HC31790008' }, // Accessories
      { PageCode: 'HPC2', HomePageCatSrNo: 'HC31790009' }, // Speakers & Headphones
      { PageCode: 'HPC2', HomePageCatSrNo: 'HC31790010' }, // Smart Watches
    ];

    // Preload each category in the background
    const preloadPromises = popularCategories.map(async (category) => {
      try {
        const params = {
          PageCode: category.PageCode,
          HomePageCatSrNo: category.HomePageCatSrNo,
          Category: '',
          SubCategory: '',
          SearchName: '',
          CultureId: cultureId,
          UserId: userId,
          Company: COMMON_PARAMS.Company,
          Value2: COMMON_PARAMS.Location,
        };
        
        await getAllProductsDirectly(params);
        console.log(`📦 Preloaded products for category: ${category.HomePageCatSrNo}`);
      } catch (error) {
        console.warn(`📦 Failed to preload category ${category.HomePageCatSrNo}:`, error);
      }
    });

    // Execute all preloads in parallel with a timeout
    await Promise.allSettled(preloadPromises);
    console.log('✅ Product preloading completed for culture:', cultureId);
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