import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple API cache utility to improve performance
// This helps reduce redundant API calls when switching between languages or navigating

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  cultureId: string;
}

interface PersistentCacheEntry<T> {
  data: T;
  timestamp: number;
  cultureId: string;
  version: string; // For cache invalidation when app updates
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for better performance
  private readonly CRITICAL_CACHE_DURATION = 60 * 60 * 1000; // 1 hour for categories/banners
  private readonly PERSISTENT_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for persistent cache
  private readonly CACHE_VERSION = '1.0.0'; // Update this when cache structure changes
  private readonly CACHE_PREFIX = 'souq_maria_cache_';

  // Generate cache key from parameters
  private generateKey(endpoint: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as Record<string, any>);
    
    return `${endpoint}:${JSON.stringify(sortedParams)}`;
  }

  // Generate persistent cache key with language
  private generatePersistentKey(endpoint: string, params: Record<string, any>, cultureId: string): string {
    const baseKey = this.generateKey(endpoint, params);
    return `${this.CACHE_PREFIX}${cultureId}_${baseKey}`;
  }

  // Check if cache entry is valid
  private isValid<T>(entry: CacheEntry<T>, cultureId: string, isCritical = false): boolean {
    const now = Date.now();
    const duration = isCritical ? this.CRITICAL_CACHE_DURATION : this.CACHE_DURATION;
    const isNotExpired = (now - entry.timestamp) < duration;
    const isSameCulture = entry.cultureId === cultureId;
    
    return isNotExpired && isSameCulture;
  }

  // Check if persistent cache entry is valid
  private isPersistentValid<T>(entry: PersistentCacheEntry<T>, cultureId: string): boolean {
    const now = Date.now();
    const isNotExpired = (now - entry.timestamp) < this.PERSISTENT_CACHE_DURATION;
    const isSameCulture = entry.cultureId === cultureId;
    const isSameVersion = entry.version === this.CACHE_VERSION;
    
    return isNotExpired && isSameCulture && isSameVersion;
  }

  // Get from persistent cache (AsyncStorage)
  private async getPersistent<T>(endpoint: string, params: Record<string, any>, cultureId: string): Promise<T | null> {
    try {
      const key = this.generatePersistentKey(endpoint, params, cultureId);
      const cached = await AsyncStorage.getItem(key);
      
      if (cached) {
        const entry: PersistentCacheEntry<T> = JSON.parse(cached);
        
        if (this.isPersistentValid(entry, cultureId)) {
          console.log('💾 Persistent Cache HIT for:', endpoint, 'CultureId:', cultureId);
          return entry.data;
        } else {
          // Remove expired cache
          await AsyncStorage.removeItem(key);
          console.log('💾 Persistent Cache EXPIRED for:', endpoint, 'CultureId:', cultureId);
        }
      }
    } catch (error) {
      console.error('💾 Persistent Cache GET error:', error);
    }
    
    return null;
  }

  // Set persistent cache (AsyncStorage)
  private async setPersistent<T>(endpoint: string, params: Record<string, any>, data: T, cultureId: string): Promise<void> {
    try {
      const key = this.generatePersistentKey(endpoint, params, cultureId);
      const entry: PersistentCacheEntry<T> = {
        data,
        timestamp: Date.now(),
        cultureId,
        version: this.CACHE_VERSION,
      };
      
      await AsyncStorage.setItem(key, JSON.stringify(entry));
      console.log('💾 Persistent Cache SET for:', endpoint, 'CultureId:', cultureId);
    } catch (error) {
      console.error('💾 Persistent Cache SET error:', error);
    }
  }

  // Get cached data if available and valid (checks both memory and persistent cache)
  async get<T>(endpoint: string, params: Record<string, any>, cultureId: string, isCritical = false): Promise<T | null> {
    // First check memory cache for immediate access
    const key = this.generateKey(endpoint, params);
    const memoryEntry = this.cache.get(key);
    
    if (memoryEntry && this.isValid(memoryEntry, cultureId, isCritical)) {
      console.log('📦 Memory Cache HIT for:', endpoint, 'CultureId:', cultureId);
      return memoryEntry.data as T;
    }
    
    // If not in memory cache, check persistent cache
    const persistentData = await this.getPersistent<T>(endpoint, params, cultureId);
    if (persistentData) {
      // Also store in memory cache for faster subsequent access
      this.set(endpoint, params, persistentData, cultureId);
      return persistentData;
    }
    
    console.log('📦 Cache MISS for:', endpoint, 'CultureId:', cultureId);
    return null;
  }

  // Store data in both memory and persistent cache
  set<T>(endpoint: string, params: Record<string, any>, data: T, cultureId: string): void {
    const key = this.generateKey(endpoint, params);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      cultureId,
    };
    
    // Store in memory cache
    this.cache.set(key, entry);
    console.log('📦 Memory Cache SET for:', endpoint, 'CultureId:', cultureId);
    
    // Store in persistent cache (async, don't wait)
    this.setPersistent(endpoint, params, data, cultureId);
  }

  // Clear cache for specific culture ID (both memory and persistent)
  async clearByCultureId(cultureId: string): Promise<void> {
    // Clear memory cache
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (entry.cultureId === cultureId) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log('📦 Memory Cache CLEARED for CultureId:', cultureId, 'Entries removed:', keysToDelete.length);
    
    // Clear persistent cache
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cultureKeys = allKeys.filter(key => 
        key.startsWith(this.CACHE_PREFIX) && key.includes(`${cultureId}_`)
      );
      
      if (cultureKeys.length > 0) {
        await AsyncStorage.multiRemove(cultureKeys);
        console.log('💾 Persistent Cache CLEARED for CultureId:', cultureId, 'Entries removed:', cultureKeys.length);
      }
    } catch (error) {
      console.error('💾 Persistent Cache CLEAR error:', error);
    }
  }

  // Clear all cache (both memory and persistent)
  async clearAll(): Promise<void> {
    // Clear memory cache
    const memorySize = this.cache.size;
    this.cache.clear();
    console.log('📦 Memory Cache CLEARED ALL. Entries removed:', memorySize);
    
    // Clear persistent cache
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
        console.log('💾 Persistent Cache CLEARED ALL. Entries removed:', cacheKeys.length);
      }
    } catch (error) {
      console.error('💾 Persistent Cache CLEAR ALL error:', error);
    }
  }

  // Get cache statistics
  async getStats(): Promise<{ 
    memory: { size: number; entries: Array<{ key: string; cultureId: string; age: number }> };
    persistent: { size: number; totalSize: string };
  }> {
    const now = Date.now();
    
    // Memory cache stats
    const memoryEntries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      cultureId: entry.cultureId,
      age: now - entry.timestamp,
    }));
    
    // Persistent cache stats
    let persistentSize = 0;
    let totalSizeStr = '0 KB';
    
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      persistentSize = cacheKeys.length;
      
      // Estimate total size (rough calculation)
      let totalBytes = 0;
      for (const key of cacheKeys.slice(0, 10)) { // Sample first 10 for estimation
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalBytes += value.length;
        }
      }
      
      if (cacheKeys.length > 0) {
        const avgSize = totalBytes / Math.min(10, cacheKeys.length);
        const estimatedTotal = avgSize * cacheKeys.length;
        totalSizeStr = `${(estimatedTotal / 1024).toFixed(1)} KB`;
      }
    } catch (error) {
      console.error('💾 Persistent Cache STATS error:', error);
    }
    
    return {
      memory: {
        size: this.cache.size,
        entries: memoryEntries,
      },
      persistent: {
        size: persistentSize,
        totalSize: totalSizeStr,
      },
    };
  }

  // Preload cache for a specific language (useful when switching languages)
  async preloadForLanguage(cultureId: string): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cultureKeys = allKeys.filter(key => 
        key.startsWith(this.CACHE_PREFIX) && key.includes(`${cultureId}_`)
      );
      
      console.log(`🔄 Preloading ${cultureKeys.length} cache entries for CultureId:`, cultureId);
      
      // Load a few key entries into memory cache
      const keyEntries = cultureKeys.slice(0, 5); // Limit to avoid blocking
      for (const key of keyEntries) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          try {
            const entry: PersistentCacheEntry<any> = JSON.parse(cached);
            if (this.isPersistentValid(entry, cultureId)) {
              // Extract endpoint and params from key for memory cache
              const cleanKey = key.replace(`${this.CACHE_PREFIX}${cultureId}_`, '');
              const memoryEntry: CacheEntry<any> = {
                data: entry.data,
                timestamp: entry.timestamp,
                cultureId: entry.cultureId,
              };
              this.cache.set(cleanKey, memoryEntry);
            }
          } catch (parseError) {
            console.error('🔄 Preload parse error for key:', key, parseError);
          }
        }
      }
    } catch (error) {
      console.error('🔄 Preload error:', error);
    }
  }
}

// Export singleton instance
export const apiCache = new ApiCache();

// Helper function to wrap API calls with caching
export async function withCache<T>(
  endpoint: string,
  params: Record<string, any>,
  cultureId: string,
  apiCall: () => Promise<T>,
  isCritical = false
): Promise<T> {
  // Try to get from cache first (checks both memory and persistent)
  const cached = await apiCache.get<T>(endpoint, params, cultureId, isCritical);
  if (cached) {
    return cached;
  }

  // If not in cache, make API call
  const result = await apiCall();
  
  // Store in cache (both memory and persistent)
  apiCache.set(endpoint, params, result, cultureId);
  
  return result;
} 