import React, { useCallback, useState, useEffect } from 'react';
import { Link, LinkProps, useNavigate } from 'react-router-dom';
import { useSlideshow } from '../context/GlobalSlideshowContext';
import { smoothScrollTo } from '../utils/scrollAnimation';
import { useScrollIndicator } from '../context/ScrollIndicatorContext';

interface SmoothLinkProps extends LinkProps {
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
   * @default 400
   */
  heroVisibilityDelay?: number;

  /**
   * Duration of fade out animation in milliseconds
   * @default 300
   */
  fadeOutDuration?: number;

  /**
   * Custom className for the link
   */
  className?: string;

  /**
   * Children elements
   */
  children: React.ReactNode;
}

/**
 * SmoothLink - A Link component that smoothly scrolls to the top of the page
 * before navigating to maintain the hero section illusion.
 */
const SmoothLink: React.FC<SmoothLinkProps> = ({
  to,
  scrollDuration = 400,
  alwaysScrollToTop = true,
  scrollThreshold = 50,
  heroVisibilityDelay = 200,
  fadeOutDuration = 250,
  className = '',
  onClick,
  children,
  ...rest
}) => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const { scrollPosition } = useSlideshow();
  const { showScrollIndicator, hideScrollIndicator } = useScrollIndicator();

  // Create cleanup function for navigation
  useEffect(() => {
    if (!isNavigating) return;

    return () => {
      // Reset transition styles when navigation completes
      const heroElements = document.querySelectorAll('[data-hero-content]');
      heroElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.transition = '';
          el.style.opacity = '';
          el.style.transform = '';
        }
      });
    };
  }, [isNavigating]);

  // Handle the click event
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // If already navigating, prevent multiple clicks
    if (isNavigating) {
      e.preventDefault();
      return;
    }

    // Call the original onClick if provided
    if (onClick) {
      onClick(e);
    }

    // If the default was prevented by the onClick handler, respect that
    if (e.defaultPrevented) {
      return;
    }

    // Always prevent default to handle our own navigation
    e.preventDefault();

    // Set navigating state immediately to prevent multiple clicks
    setIsNavigating(true);

    // Show the scroll indicator
    showScrollIndicator();

    // Start the page transition animation
    if (!document.body.hasAttribute('data-animating-hero')) {
      document.body.setAttribute('data-animating-hero', 'true');

      // Preserve slideshow state - mark as transitioning
      if (typeof window !== 'undefined' && window.globalSlideshowState) {
        window.globalSlideshowState.isTransitioning = true;
      }

      // Apply transition class to body for global styles
      document.body.classList.add('page-transitioning');
    }

    // Force scroll to top immediately to start
    window.scrollTo(0, 0);

    // Always scroll to top for consistent behavior
    // Use enhanced scroll animation with custom easing
    smoothScrollTo({
      targetPosition: 0,
      duration: scrollDuration,
      easingFunction: 'easeInOutCubic',
      onComplete: () => {
        // Hide the scroll indicator
        hideScrollIndicator();

        // Force scroll to top again to ensure it's at the top
        window.scrollTo(0, 0);

        // Add a delay to ensure the hero fills the viewport before navigation
        setTimeout(() => {
          // Save current scroll position for cleanup
          const currentScroll = window.pageYOffset;

          // Reset scroll position immediately one more time
          window.scrollTo(0, 0);

          // Navigate to new page with scroll reset state
          if (typeof to === 'string') {
            navigate(to, { state: { scrollToTop: true, fromScroll: currentScroll, timestamp: Date.now() } });
          } else {
            navigate(to, { state: { scrollToTop: true, fromScroll: currentScroll, timestamp: Date.now() } });
          }

          // Reset the navigating state after a short delay
          setTimeout(() => {
            // Force scroll to top one final time after navigation
            window.scrollTo(0, 0);

            setIsNavigating(false);
            document.body.classList.remove('page-transitioning');
            document.body.removeAttribute('data-animating-hero');

            // Reset transition flag
            if (typeof window !== 'undefined' && window.globalSlideshowState) {
              window.globalSlideshowState.isTransitioning = false;
            }
          }, 500); // Ensure smooth transition completion
        }, heroVisibilityDelay); // Added delay for hero visibility
      }
    });
  }, [to, navigate, scrollPosition, scrollThreshold, alwaysScrollToTop, scrollDuration,
      heroVisibilityDelay, fadeOutDuration, onClick, isNavigating, showScrollIndicator, hideScrollIndicator]);

  return (
    <Link
      to={to}
      className={`${className} ${isNavigating ? 'pointer-events-none' : ''}`}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default SmoothLink;