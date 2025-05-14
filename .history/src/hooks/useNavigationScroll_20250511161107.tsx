import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { smoothScrollTo } from '../utils/scrollAnimation';

/**
 * Hook to handle scrolling to top on navigation
 *
 * This hook ensures that when navigating between pages,
 * the user is always positioned at the top of the new page.
 * Uses an extremely aggressive approach with multiple scroll attempts.
 */
export function useNavigationScroll() {
  const { pathname, state } = useLocation();
  const prevPathRef = useRef(pathname);

  // Function to forcefully scroll to top multiple times
  const forceScrollToTop = () => {
    // First, scroll immediately
    window.scrollTo(0, 0);

    // Then schedule multiple scroll resets with increasing delays
    setTimeout(() => window.scrollTo(0, 0), 10);
    setTimeout(() => window.scrollTo(0, 0), 50);
    setTimeout(() => window.scrollTo(0, 0), 100);
    setTimeout(() => window.scrollTo(0, 0), 200);
    setTimeout(() => window.scrollTo(0, 0), 500);

    // For extra assurance, use our smooth scroll utility with very short duration
    smoothScrollTo({
      targetPosition: 0,
      duration: 50, // Very short duration since we want it to be nearly instant
      easingFunction: 'easeOutQuart',
    });
  };

  useEffect(() => {
    // Run this effect on every pathname change
    // Aggressively scroll to top immediately
    forceScrollToTop();

    // Use rAF to ensure this happens as soon as the browser is ready
    requestAnimationFrame(() => {
      // Scroll to top again (sometimes the first call can be overridden)
      window.scrollTo(0, 0);

      // Schedule another round of scroll resets
      forceScrollToTop();
    });

    // Update the ref to the current pathname
    prevPathRef.current = pathname;
  }, [pathname, state]);

  // Also add a one-time effect to ensure we start at the top on initial load
  useEffect(() => {
    forceScrollToTop();

    // Add event listener for when the page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        forceScrollToTop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}

export default useNavigationScroll;
