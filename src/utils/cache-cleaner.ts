// Cache cleaner utility to safely clear all caches and reset application state
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import { apiCache } from './api-cache';

export interface CacheCleanResult {
  success: boolean;
  cleared: {
    asyncStorage: boolean;
    apiCache: boolean;
    rtlSettings: boolean;
  };
  errors: string[];
}

/**
 * Comprehensive cache clearing utility
 * This will clear ALL cached data and reset the app to fresh state
 */
export class CacheCleaner {
  /**
   * Clear all caches and reset app state
   * This is the nuclear option - use with caution
   */
  static async clearAll(): Promise<CacheCleanResult> {
    const result: CacheCleanResult = {
      success: true,
      cleared: {
        asyncStorage: false,
        apiCache: false,
        rtlSettings: false,
      },
      errors: [],
    };

    console.log('🧹 Starting comprehensive cache clearing...');

    // 1. Clear API cache (both memory and persistent)
    try {
      await apiCache.clearAll();
      result.cleared.apiCache = true;
      console.log('✅ API cache cleared');
    } catch (error) {
      result.errors.push(`API cache clear failed: ${error}`);
      result.success = false;
      console.error('❌ API cache clear failed:', error);
    }

    // 2. Clear ALL AsyncStorage data
    try {
      await AsyncStorage.clear();
      result.cleared.asyncStorage = true;
      console.log('✅ AsyncStorage cleared completely');
    } catch (error) {
      result.errors.push(`AsyncStorage clear failed: ${error}`);
      result.success = false;
      console.error('❌ AsyncStorage clear failed:', error);
    }

    // 3. Reset RTL settings to default (LTR)
    try {
      I18nManager.forceRTL(false);
      result.cleared.rtlSettings = true;
      console.log('✅ RTL settings reset to LTR');
    } catch (error) {
      result.errors.push(`RTL reset failed: ${error}`);
      result.success = false;
      console.error('❌ RTL reset failed:', error);
    }

    if (result.success) {
      console.log('🧹 ✅ All caches cleared successfully - app reset to fresh state');
    } else {
      console.log('🧹 ⚠️ Cache clearing completed with errors:', result.errors);
    }

    return result;
  }

  /**
   * Clear specific cache types
   */
  static async clearSpecific(options: {
    apiCache?: boolean;
    zustandStores?: boolean;
    userPreferences?: boolean;
    rtlSettings?: boolean;
  }): Promise<CacheCleanResult> {
    const result: CacheCleanResult = {
      success: true,
      cleared: {
        asyncStorage: false,
        apiCache: false,
        rtlSettings: false,
      },
      errors: [],
    };

    console.log('🧹 Starting selective cache clearing...', options);

    // Clear API cache
    if (options.apiCache) {
      try {
        await apiCache.clearAll();
        result.cleared.apiCache = true;
        console.log('✅ API cache cleared');
      } catch (error) {
        result.errors.push(`API cache clear failed: ${error}`);
        result.success = false;
      }
    }

    // Clear Zustand store data
    if (options.zustandStores) {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const storeKeys = keys.filter(key => 
          key.includes('auth-storage') ||
          key.includes('cart-store') ||
          key.includes('souq-maria-language') ||
          key.includes('wishlist-store') ||
          key.includes('address-store') ||
          key.includes('checkout-store')
        );
        
        if (storeKeys.length > 0) {
          await AsyncStorage.multiRemove(storeKeys);
          console.log('✅ Zustand stores cleared:', storeKeys.length, 'stores');
        }
        result.cleared.asyncStorage = true;
      } catch (error) {
        result.errors.push(`Zustand stores clear failed: ${error}`);
        result.success = false;
      }
    }

    // Clear user preferences only
    if (options.userPreferences) {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const prefKeys = keys.filter(key => 
          key.includes('souq-maria-language') ||
          key.includes('user-preferences')
        );
        
        if (prefKeys.length > 0) {
          await AsyncStorage.multiRemove(prefKeys);
          console.log('✅ User preferences cleared:', prefKeys.length, 'keys');
        }
      } catch (error) {
        result.errors.push(`User preferences clear failed: ${error}`);
        result.success = false;
      }
    }

    // Reset RTL settings
    if (options.rtlSettings) {
      try {
        I18nManager.forceRTL(false);
        result.cleared.rtlSettings = true;
        console.log('✅ RTL settings reset to LTR');
      } catch (error) {
        result.errors.push(`RTL reset failed: ${error}`);
        result.success = false;
      }
    }

    return result;
  }

  /**
   * Clear only language-related cache while preserving user data
   */
  static async clearLanguageCache(): Promise<CacheCleanResult> {
    const result: CacheCleanResult = {
      success: true,
      cleared: {
        asyncStorage: false,
        apiCache: false,
        rtlSettings: true,
      },
      errors: [],
    };

    console.log('🌐 Clearing language-specific cache...');

    try {
      // Clear API cache for both languages
      await apiCache.clearByCultureId('1'); // English
      await apiCache.clearByCultureId('2'); // Arabic
      
      // Clear language store in AsyncStorage
      await AsyncStorage.removeItem('souq-maria-language');
      
      // Reset RTL to default
      I18nManager.forceRTL(false);
      
      result.cleared.apiCache = true;
      result.cleared.asyncStorage = true;
      result.cleared.rtlSettings = true;
      
      console.log('✅ Language cache cleared successfully');
    } catch (error) {
      result.errors.push(`Language cache clear failed: ${error}`);
      result.success = false;
      console.error('❌ Language cache clear failed:', error);
    }

    return result;
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    asyncStorage: { keys: number; totalSize: string };
    apiCache: any;
  }> {
    try {
      // AsyncStorage stats
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      // Sample first 10 keys to estimate size
      for (const key of keys.slice(0, 10)) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
      
      const avgSize = keys.length > 0 ? totalSize / Math.min(10, keys.length) : 0;
      const estimatedTotal = avgSize * keys.length;
      
      // API cache stats
      const apiCacheStats = await apiCache.getStats();
      
      return {
        asyncStorage: {
          keys: keys.length,
          totalSize: `${(estimatedTotal / 1024).toFixed(1)} KB`,
        },
        apiCache: apiCacheStats,
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        asyncStorage: { keys: 0, totalSize: '0 KB' },
        apiCache: { memory: { size: 0, entries: [] }, persistent: { size: 0, totalSize: '0 KB' } },
      };
    }
  }

  /**
   * Diagnose cache issues
   */
  static async diagnoseCacheIssues(): Promise<{
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // Check AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      const languageKeys = keys.filter(key => key.includes('souq-maria-language'));
      
      if (languageKeys.length > 1) {
        issues.push('Multiple language storage keys found');
        recommendations.push('Clear language cache to resolve conflicts');
      }

      // Check RTL state
      const isRTLEnabled = I18nManager.isRTL;
      if (isRTLEnabled) {
        issues.push('RTL mode is currently enabled');
        recommendations.push('Reset RTL settings if experiencing layout issues');
      }

      // Check cache size
      const stats = await this.getCacheStats();
      if (stats.asyncStorage.keys > 50) {
        issues.push('Large number of cached items detected');
        recommendations.push('Consider clearing old cache entries');
      }

      if (issues.length === 0) {
        recommendations.push('Cache state appears healthy');
      }

    } catch (error) {
      issues.push(`Cache diagnosis failed: ${error}`);
      recommendations.push('Try clearing all caches');
    }

    return { issues, recommendations };
  }
}

// Export convenience functions
export const clearAllCaches = CacheCleaner.clearAll;
export const clearLanguageCache = CacheCleaner.clearLanguageCache;
export const diagnoseCacheIssues = CacheCleaner.diagnoseCacheIssues;
export const getCacheStats = CacheCleaner.getCacheStats; 