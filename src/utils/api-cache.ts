// Simple API cache utility to improve performance
// This helps reduce redundant API calls when switching between languages or navigating

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  cultureId: string;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for better performance
  private readonly CRITICAL_CACHE_DURATION = 60 * 60 * 1000; // 1 hour for categories/banners

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

  // Check if cache entry is valid
  private isValid<T>(entry: CacheEntry<T>, cultureId: string, isCritical = false): boolean {
    const now = Date.now();
    const duration = isCritical ? this.CRITICAL_CACHE_DURATION : this.CACHE_DURATION;
    const isNotExpired = (now - entry.timestamp) < duration;
    const isSameCulture = entry.cultureId === cultureId;
    
    return isNotExpired && isSameCulture;
  }

  // Get cached data if available and valid
  get<T>(endpoint: string, params: Record<string, any>, cultureId: string, isCritical = false): T | null {
    const key = this.generateKey(endpoint, params);
    const entry = this.cache.get(key);
    
    if (entry && this.isValid(entry, cultureId, isCritical)) {
      console.log('📦 Cache HIT for:', endpoint, 'CultureId:', cultureId);
      return entry.data as T;
    }
    
    console.log('📦 Cache MISS for:', endpoint, 'CultureId:', cultureId);
    return null;
  }

  // Store data in cache
  set<T>(endpoint: string, params: Record<string, any>, data: T, cultureId: string): void {
    const key = this.generateKey(endpoint, params);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      cultureId,
    };
    
    this.cache.set(key, entry);
    console.log('📦 Cache SET for:', endpoint, 'CultureId:', cultureId);
  }

  // Clear cache for specific culture ID (useful when language changes)
  clearByCultureId(cultureId: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (entry.cultureId === cultureId) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log('📦 Cache CLEARED for CultureId:', cultureId, 'Entries removed:', keysToDelete.length);
  }

  // Clear all cache
  clearAll(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log('📦 Cache CLEARED ALL. Entries removed:', size);
  }

  // Get cache statistics
  getStats(): { size: number; entries: Array<{ key: string; cultureId: string; age: number }> } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      cultureId: entry.cultureId,
      age: now - entry.timestamp,
    }));
    
    return {
      size: this.cache.size,
      entries,
    };
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
  // Try to get from cache first
  const cached = apiCache.get<T>(endpoint, params, cultureId, isCritical);
  if (cached) {
    return cached;
  }

  // If not in cache, make API call
  const result = await apiCall();
  
  // Store in cache
  apiCache.set(endpoint, params, result, cultureId);
  
  return result;
} 