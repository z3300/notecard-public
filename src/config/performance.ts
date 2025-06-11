// Performance configuration for YouTube embeds and other optimizations
export const PERFORMANCE_CONFIG = {
  // YouTube embed strategy
  // 'immediate' - Load iframe immediately (original behavior, worst performance)
  // 'facade' - Show thumbnail with play button, load iframe on click (good performance)
  // 'lazy-facade' - Show skeleton loader, then thumbnail when in view, load iframe on click (best performance)
  youtubeStrategy: 'facade' as 'immediate' | 'facade' | 'lazy-facade',
  
  // Image loading optimizations
  lazyLoadImages: true,
  
  // Preload strategy for critical resources
  preloadCriticalImages: true,
  
  // Enable/disable intersection observer for viewport-based loading
  useIntersectionObserver: true,
  
  // Skeleton loading animations
  showSkeletonLoaders: true,
  
  // Performance monitoring
  enablePerformanceLogging: process.env.NODE_ENV === 'development',
};

// Utility function to log performance metrics in development
export const logPerformance = (metric: string, value: number) => {
  if (PERFORMANCE_CONFIG.enablePerformanceLogging) {
    console.log(`🚀 Performance: ${metric} = ${value}ms`);
  }
};

// Utility to measure and log component render times
export const measureRenderTime = (componentName: string) => {
  if (!PERFORMANCE_CONFIG.enablePerformanceLogging) return () => {};
  
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    logPerformance(`${componentName} render time`, endTime - startTime);
  };
}; 