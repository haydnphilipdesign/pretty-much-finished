import { useRef, useState, useEffect } from 'react';

export const useOptimizedAnimation = (p0: { intensity: number; duration: number; shouldAnimate: boolean; }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
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

  const getTransitionConfig = (type: 'tween' | 'spring' = 'spring') => {
    const config = {
      tween: { type: 'tween', duration: 0.3 },
      spring: { type: 'spring', stiffness: 100, damping: 20 }
    };
    return config[type];
  };

  return {
    elementRef,
    animate: !prefersReducedMotion,
    getTransitionConfig
  };
};

export const fadeConfig = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

// Updated slideConfig that doesn't use y-axis movement to prevent background showing through
export const slideConfig = (direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
  // We now only use opacity for all directions to prevent background issues
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
};

export const scaleConfig = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

export const depthConfig = (depth: 'shallow' | 'medium' | 'deep' = 'medium') => {
  const depthValues = {
    shallow: { z: -20, rotateX: 2, rotateY: 2 },
    medium: { z: -40, rotateX: 4, rotateY: 4 },
    deep: { z: -60, rotateX: 6, rotateY: 6 }
  };

  return {
    hidden: { 
      opacity: 0, 
      z: depthValues[depth].z,
      rotateX: depthValues[depth].rotateX,
      rotateY: depthValues[depth].rotateY
    },
    visible: { 
      opacity: 1, 
      z: 0,
      rotateX: 0,
      rotateY: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100
      }
    }
  };
};
