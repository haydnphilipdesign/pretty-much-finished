import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSlideshow } from '../context/GlobalSlideshowContext';
import { smoothScrollTo } from '../utils/scrollAnimation';
import { useScrollIndicator } from '../context/ScrollIndicatorContext';

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
  const { showScrollIndicator, hideScrollIndicator } = useScrollIndicator();

  const {
    scrollDuration = 500,
    alwaysScrollToTop = false,
    scrollThreshold = 100,
    heroVisibilityDelay = 300
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
      // Log the delay values to help with debugging
      console.log(`useSmoothNavigation with delays: scrollDuration=${scrollDuration}ms, heroVisibilityDelay=${heroVisibilityDelay}ms`);

      // Show the scroll indicator
      showScrollIndicator();

      // Use enhanced scroll animation with custom easing
      smoothScrollTo({
        targetPosition: 0,
        duration: scrollDuration,
        easingFunction: 'easeInOutCubic',
        onComplete: () => {
          console.log(`Scroll animation completed, waiting ${heroVisibilityDelay}ms before navigation`);

          // Hide the scroll indicator
          hideScrollIndicator();

          // Add a pause to ensure the hero is fully visible
          setTimeout(() => {
            console.log(`Hero visibility delay completed, navigating to ${to}`);
            navigate(to, options);
          }, heroVisibilityDelay);
        }
      });
    } else {
      console.log(`Direct navigation (no scroll needed) to ${to}`);
      // If we don't need to scroll, navigate immediately
      navigate(to, options);
    }
  }, [navigate, scrollPosition, scrollThreshold, alwaysScrollToTop, scrollDuration, heroVisibilityDelay, showScrollIndicator, hideScrollIndicator]);

  return { smoothNavigate };
};

export default useSmoothNavigation;
