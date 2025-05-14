import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { smoothScrollTo } from '../utils/scrollAnimation';

/**
 * Hook to handle scrolling to top on navigation
 * 
 * This hook ensures that when navigating between pages,
 * the user is always positioned at the top of the new page.
 */
export function useNavigationScroll() {
  const { pathname, state } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Only run this effect when the pathname changes
    if (prevPathRef.current !== pathname) {
      // Aggressively scroll to top immediately
      window.scrollTo(0, 0);
      
      // Use rAF to ensure this happens as soon as the browser is ready
      requestAnimationFrame(() => {
        // Scroll to top again (sometimes the first call can be overridden)
        window.scrollTo(0, 0);
        
        // For extra assurance, use our smooth scroll utility, but with very short duration
        smoothScrollTo({
          targetPosition: 0,
          duration: 50, // Very short duration since we want it to be nearly instant
          easingFunction: 'easeOutQuart',
        });
      });
      
      // Update the ref to the current pathname
      prevPathRef.current = pathname;
    }
  }, [pathname, state]);
  
  // Also add a one-time effect to ensure we start at the top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}

export default useNavigationScroll;
