// Performance monitoring utility for tracking app performance
import { LOGGING } from '../config/app-config';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private isEnabled: boolean = LOGGING.enableConsoleLogging;

  // Start tracking a performance metric
  startMetric(name: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      startTime: Date.now(),
      metadata,
    };

    this.metrics.set(name, metric);
    console.log(`⏱️ Performance: Started tracking "${name}"`);
  }

  // End tracking a performance metric
  endMetric(name: string): number | null {
    if (!this.isEnabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`⚠️ Performance: Metric "${name}" not found`);
      return null;
    }

    const endTime = Date.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    console.log(`✅ Performance: "${name}" completed in ${duration}ms`, metric.metadata);

    // Log slow operations
    if (duration > 3000) {
      console.warn(`🐌 Performance: Slow operation detected - "${name}" took ${duration}ms`);
    }

    return duration;
  }

  // Track API call performance
  trackApiCall(endpoint: string, method: string = 'GET'): {
    start: () => void;
    end: () => number | null;
  } {
    const metricName = `api_${method}_${endpoint}`;
    
    return {
      start: () => this.startMetric(metricName, { endpoint, method }),
      end: () => this.endMetric(metricName),
    };
  }

  // Track screen navigation performance
  trackScreenLoad(screenName: string): {
    start: () => void;
    end: () => number | null;
  } {
    const metricName = `screen_load_${screenName}`;
    
    return {
      start: () => this.startMetric(metricName, { screenName }),
      end: () => this.endMetric(metricName),
    };
  }

  // Track image loading performance
  trackImageLoad(imageUrl: string): {
    start: () => void;
    end: () => number | null;
  } {
    const metricName = `image_load_${Date.now()}`;
    
    return {
      start: () => this.startMetric(metricName, { imageUrl }),
      end: () => this.endMetric(metricName),
    };
  }

  // Get all metrics
  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  // Get metrics summary
  getMetricsSummary(): Record<string, { count: number; avgDuration: number; totalDuration: number }> {
    const summary: Record<string, { count: number; avgDuration: number; totalDuration: number }> = {};
    
    this.metrics.forEach((metric) => {
      if (!metric.duration) return;
      
      const category = metric.name.split('_')[0];
      
      if (!summary[category]) {
        summary[category] = { count: 0, avgDuration: 0, totalDuration: 0 };
      }
      
      summary[category].count++;
      summary[category].totalDuration += metric.duration;
      summary[category].avgDuration = summary[category].totalDuration / summary[category].count;
    });
    
    return summary;
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics.clear();
    console.log('🧹 Performance: Cleared all metrics');
  }

  // Log performance summary
  logSummary(): void {
    if (!this.isEnabled) return;
    
    const summary = this.getMetricsSummary();
    console.log('📊 Performance Summary:', summary);
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Helper functions for common use cases
export const trackApiPerformance = (endpoint: string, method: string = 'GET') => 
  performanceMonitor.trackApiCall(endpoint, method);

export const trackScreenPerformance = (screenName: string) => 
  performanceMonitor.trackScreenLoad(screenName);

export const trackImagePerformance = (imageUrl: string) => 
  performanceMonitor.trackImageLoad(imageUrl);

// Memory usage monitoring
export const logMemoryUsage = () => {
  if (!LOGGING.enableConsoleLogging) return;
  
  // Note: React Native doesn't have direct memory API access
  // This is a placeholder for future implementation with native modules
  console.log('💾 Memory monitoring not available in React Native');
};

// App startup performance
export const trackAppStartup = () => {
  const startup = performanceMonitor.trackScreenLoad('app_startup');
  startup.start();
  
  // Return function to end tracking
  return startup.end;
};

export default performanceMonitor; 