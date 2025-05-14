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

    // SMOOTH APPROACH: Use native browser scrolling with smooth behavior
    try {
      // First, try to use the most compatible method with smooth scrolling
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth' // Use 'smooth' for a nicer scrolling experience
      });
    } catch (e) {
      // Fallback for older browsers - use our custom smooth scroll
      smoothScrollTo({
        targetPosition: 0,
        duration: 600, // Longer duration for smoother scrolling
        easingFunction: 'easeOutQuart',
      });
    }

    // Calculate the time needed for smooth scrolling based on current position
    const scrollDistance = window.pageYOffset;
    const scrollTime = Math.min(Math.max(scrollDistance / 2, 300), 800); // Between 300ms and 800ms

    // Wait for the scroll animation to complete before navigating
    setTimeout(() => {
      // Hide the scroll indicator
      hideScrollIndicator();

      // Add a delay to ensure the hero fills the viewport before navigation
      setTimeout(() => {
        // Navigate to new page with scroll reset state
        if (typeof to === 'string') {
          navigate(to, { state: { scrollToTop: true, timestamp: Date.now() } });
        } else {
          navigate(to, { state: { scrollToTop: true, timestamp: Date.now() } });
        }

        // Reset the navigating state after a short delay
        setTimeout(() => {
          setIsNavigating(false);
          document.body.classList.remove('page-transitioning');
          document.body.removeAttribute('data-animating-hero');

          // Reset transition flag
          if (typeof window !== 'undefined' && window.globalSlideshowState) {
            window.globalSlideshowState.isTransitioning = false;
          }
        }, 300); // Longer delay for smoother transition
      }, heroVisibilityDelay); // Added delay for hero visibility
    }, scrollTime); // Dynamic delay based on scroll distance
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