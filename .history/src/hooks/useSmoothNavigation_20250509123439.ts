import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSlideshow } from '../context/GlobalSlideshowContext';

interface SmoothNavigationOptions {
  /**
   * Duration of the scroll animation in milliseconds
   * @default 500
   */
  scrollDuration?: number;

  /**
   * Whether to always scroll to top before navigation, even if already at top
   * @default false
   */
  alwaysScrollToTop?: boolean;

  /**
   * Threshold in pixels to determine if user is "scrolled down"
   * @default 100
   */
  scrollThreshold?: number;

  /**
   * Delay in milliseconds to pause after scrolling to top before navigation
   * This ensures the hero is fully visible before navigating
   * @default 300
   */
  heroVisibilityDelay?: number;
}

/**
 * Hook for smooth navigation that preserves the hero slideshow illusion
 * by scrolling to the top of the page before navigating
 */
const useSmoothNavigation = (options: SmoothNavigationOptions = {}) => {
  const navigate = useNavigate();
  const { scrollPosition } = useSlideshow();

  const {
    scrollDuration = 500,
    alwaysScrollToTop = false,
    scrollThreshold = 100
  } = options;

  /**
   * Navigate to a new route with smooth scrolling to top first
   */
  const smoothNavigate = useCallback((
    to: string,
    options?: { replace?: boolean; state?: any }
  ) => {
    // Check if we need to scroll to top first
    const needsScroll = alwaysScrollToTop || scrollPosition > scrollThreshold;

    if (needsScroll) {
      // Scroll to top with smooth animation
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Wait for the scroll animation to complete before navigating
      setTimeout(() => {
        // Add a brief pause to ensure the hero is fully visible
        const heroVisibilityDelay = 300; // 300ms pause to see the hero

        setTimeout(() => {
          navigate(to, options);
        }, heroVisibilityDelay);
      }, scrollDuration);
    } else {
      // If we don't need to scroll, navigate immediately
      navigate(to, options);
    }
  }, [navigate, scrollPosition, scrollThreshold, alwaysScrollToTop, scrollDuration]);

  return { smoothNavigate };
};

export default useSmoothNavigation;
