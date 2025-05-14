import { useEffect, useState, useCallback } from 'react';

// Performance monitoring
export const usePerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const metrics = {
            name: entry.name,
            duration: entry.duration,
            type: entry.entryType,
            timestamp: new Date().toISOString(),
            value: entry.entryType === 'layout-shift' ? (entry as any).value : entry.duration,
            url: window.location.href
          };

          // Store metrics in localStorage for persistence
          const storedMetrics = JSON.parse(localStorage.getItem('performance_metrics') || '[]');
          storedMetrics.push(metrics);
          localStorage.setItem('performance_metrics', JSON.stringify(storedMetrics.slice(-100))); // Keep last 100 entries

          // Send to analytics if available
          if (window.gtag) {
            window.gtag('event', 'performance_metric', {
              metric_name: entry.name,
              metric_value: metrics.value,
              metric_type: entry.entryType
            });
          }

          console.log('Performance Entry:', metrics);
        });
      });

      // Observe core web vitals and other important metrics
      observer.observe({
        entryTypes: [
          'largest-contentful-paint',
          'first-input',
          'layout-shift',
          'longtask',
          'paint',
          'navigation'
        ]
      });

      return () => observer.disconnect();
    }
  }, []);
};

// Image lazy loading with blur placeholder
export const useImageLoader = (src: string, placeholder: string) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return { currentSrc, isLoaded };
};

// Intersection observer for lazy loading
export const useIntersectionLoader = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<HTMLElement | null>(null);

  const observer = useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        const io = new IntersectionObserver(([entry]) => {
          setIsVisible(entry.isIntersecting);
        }, options);
        io.observe(node);
        setElement(node);
        return () => io.disconnect();
      }
    },
    [options]
  );

  return [observer, isVisible, element] as const;
};