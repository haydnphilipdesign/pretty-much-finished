import { useRef, useState, useEffect } from 'react';

/**
 * Custom hook to handle preloaded animations
 * This ensures content is fully loaded before animating to prevent background elements from showing through
 */
export const usePreloadedAnimation = (p0: { intensity?: number; duration?: number; preloadDelay?: number; }) => {
  const { intensity = 0.2, duration = 0.6, preloadDelay = 100 } = p0;
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    // Check if window is available (for SSR compatibility)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      // Add listener for changes
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
      // Older browsers
      else if ('addListener' in mediaQuery) {
        // @ts-ignore - For older browser compatibility
        mediaQuery.addListener(handleChange);
        return () => {
          // @ts-ignore - For older browser compatibility
          mediaQuery.removeListener(handleChange);
        };
      }
    }
  }, []);

  // Set loaded state after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, preloadDelay);

    return () => clearTimeout(timer);
  }, [preloadDelay]);

  const getTransitionConfig = (type: 'tween' | 'spring' = 'spring') => {
    const config = {
      tween: { type: 'tween', duration },
      spring: { type: 'spring', stiffness: 100, damping: 20 }
    };
    return config[type];
  };

  // Fade-only animation config - no slide movements
  const getFadeConfig = () => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: getTransitionConfig('tween')
    }
  });

  return {
    elementRef,
    isLoaded,
    animate: !prefersReducedMotion && isLoaded,
    getTransitionConfig,
    fadeConfig: getFadeConfig()
  };
};

export default usePreloadedAnimation; 