import { useState, useEffect } from 'react';

// Define breakpoints that match our CSS
export const breakpoints = {
  sm: 640,
  md:768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type Breakpoint = keyof typeof breakpoints;

/**
 * Custom hook for responsive design
 * Tracks the current screen size and returns information about which breakpoints are active
 */
export function useResponsive() {
  // Initialize with default values for SSR
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  // Update window size on resize
  useEffect(() => {
    // Skip if not in browser
    if (typeof window === 'undefined') return undefined;
    
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures this effect runs only on mount and unmount
  
  // Determine which breakpoints are active
  const isActive = {
    sm: windowSize.width >= breakpoints.sm,
    md:windowSize.width >= breakpoints.md,
    lg: windowSize.width >= breakpoints.lg,
    xl: windowSize.width >= breakpoints.xl,
    '2xl': windowSize.width >= breakpoints['2xl'],
  };
  
  // Determine current active breakpoint name
  let activeBreakpoint: Breakpoint | null = null;
  
  // Check from largest to smallest
  if (isActive['2xl']) activeBreakpoint = '2xl';
  else if (isActive.xl) activeBreakpoint = 'xl';
  else if (isActive.lg) activeBreakpoint = 'lg';
  else if (isActive.md) activeBreakpoint = 'md';
  else if (isActive.sm) activeBreakpoint = 'sm';
  
  // Helper functions
  const isMobile = windowSize.width < breakpoints.md;
  const isTablet = windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg;
  const isDesktop = windowSize.width >= breakpoints.lg;
  
  // Helper function to apply different values based on breakpoint
  function value<T>(values: { [key in Breakpoint | 'default']?: T }, defaultValue?: T): T | undefined {
    if (activeBreakpoint && values[activeBreakpoint] !== undefined) {
      return values[activeBreakpoint];
    }
    
    if (values.default !== undefined) {
      return values.default;
    }
    
    return defaultValue;
  }
  
  return {
    width: windowSize.width,
    height: windowSize.height,
    isActive,
    activeBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    value,
  };
}