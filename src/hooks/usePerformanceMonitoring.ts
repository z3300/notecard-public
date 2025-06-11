import { useEffect, useRef, useCallback } from 'react';
import { PERFORMANCE_CONFIG, logPerformance } from '../config/performance';

interface PerformanceMetrics {
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  totalBlockingTime?: number;
  youtubeEmbedCount?: number;
  facadeClickCount?: number;
}

export const usePerformanceMonitoring = () => {
  const metricsRef = useRef<PerformanceMetrics>({});
  const observerRef = useRef<PerformanceObserver | null>(null);

  const recordYouTubeEmbed = useCallback(() => {
    metricsRef.current.youtubeEmbedCount = (metricsRef.current.youtubeEmbedCount || 0) + 1;
    logPerformance('YouTube Embeds on Page', metricsRef.current.youtubeEmbedCount);
  }, []);

  const recordFacadeClick = useCallback(() => {
    metricsRef.current.facadeClickCount = (metricsRef.current.facadeClickCount || 0) + 1;
    logPerformance('YouTube Facades Clicked', metricsRef.current.facadeClickCount);
  }, []);

  const measureResourceTiming = useCallback(() => {
    if (!PERFORMANCE_CONFIG.enablePerformanceLogging) return;

    // Measure YouTube resource loading
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const youtubeResources = resources.filter(resource => 
      resource.name.includes('youtube.com') || resource.name.includes('ytimg.com')
    );

    if (youtubeResources.length > 0) {
      const totalYouTubeSize = youtubeResources.reduce((total, resource) => {
        return total + (resource.transferSize || 0);
      }, 0);

      const totalYouTubeTime = youtubeResources.reduce((total, resource) => {
        return total + (resource.duration || 0);
      }, 0);

      logPerformance('YouTube Resources Total Size (KB)', Math.round(totalYouTubeSize / 1024));
      logPerformance('YouTube Resources Total Load Time', Math.round(totalYouTubeTime));
    }
  }, []);

  const getPerformanceReport = useCallback(() => {
    if (!PERFORMANCE_CONFIG.enablePerformanceLogging) return null;

    return {
      ...metricsRef.current,
      strategy: PERFORMANCE_CONFIG.youtubeStrategy,
      timestamp: Date.now(),
    };
  }, []);

  useEffect(() => {
    if (!PERFORMANCE_CONFIG.enablePerformanceLogging) return;

    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      observerRef.current = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'paint') {
            const paintEntry = entry as PerformanceEventTiming;
            if (paintEntry.name === 'first-contentful-paint') {
              metricsRef.current.firstContentfulPaint = paintEntry.startTime;
              logPerformance('First Contentful Paint', paintEntry.startTime);
            }
          }

          if (entry.entryType === 'largest-contentful-paint') {
            const lcpEntry = entry as PerformanceEventTiming;
            metricsRef.current.largestContentfulPaint = lcpEntry.startTime;
            logPerformance('Largest Contentful Paint', lcpEntry.startTime);
          }

          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as PerformanceEventTiming & { hadRecentInput?: boolean; value?: number };
            if (!layoutShiftEntry.hadRecentInput) {
              metricsRef.current.cumulativeLayoutShift = 
                (metricsRef.current.cumulativeLayoutShift || 0) + (layoutShiftEntry.value || 0);
            }
          }

          if (entry.entryType === 'first-input') {
            const fidEntry = entry as PerformanceEventTiming;
            metricsRef.current.firstInputDelay = fidEntry.processingStart - fidEntry.startTime;
            logPerformance('First Input Delay', metricsRef.current.firstInputDelay);
          }
        });
      });

      // Observe all performance entry types
      try {
        observerRef.current.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
      } catch (error) {
        console.warn('Some performance metrics not supported:', error);
      }
    }

    // Measure resource timing after page load
    const measureResourcesTimer = setTimeout(measureResourceTiming, 3000);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearTimeout(measureResourcesTimer);
    };
  }, [measureResourceTiming]);

  // Log final performance report on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const report = getPerformanceReport();
      if (report) {
        console.log('🚀 Final Performance Report:', report);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [getPerformanceReport]);

  return {
    recordYouTubeEmbed,
    recordFacadeClick,
    getPerformanceReport,
    measureResourceTiming,
  };
}; 