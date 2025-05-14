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

    // Check if we need to scroll to top first
    const needsScroll = alwaysScrollToTop || scrollPosition > scrollThreshold;

    if (needsScroll) {
      e.preventDefault();
      setIsNavigating(true);

      // Show the scroll indicator
      showScrollIndicator();

      // Start the fade-out animation for hero content
      // Use a data attribute to track if we're already animating to prevent duplicate animations
      if (!document.body.hasAttribute('data-animating-hero')) {
        document.body.setAttribute('data-animating-hero', 'true');
        const heroElements = document.querySelectorAll('[data-hero-content]');
        heroElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.transitionDuration = `${fadeOutDuration}ms`;
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
          }
        });
      }

      // Apply page-transitioning class to body for additional effects
      document.body.classList.add('page-transitioning');

      // Use enhanced scroll animation with custom easing
      smoothScrollTo({
        targetPosition: 0,
        duration: scrollDuration,
        easingFunction: 'easeInOutCubic',
        onComplete: () => {
          // Hide the scroll indicator
          hideScrollIndicator();

          // Delay navigation slightly to allow fade-out animation to complete
          setTimeout(() => {
            // Navigate programmatically after scroll and pause
            if (typeof to === 'string') {
              navigate(to);
            } else {
              navigate(to);
            }

            // Reset the navigating state after a short delay
            setTimeout(() => {
              setIsNavigating(false);
              document.body.classList.remove('page-transitioning');
            }, 100);
          }, heroVisibilityDelay);
        }
      });
    } else {
      // For direct navigation without scrolling, still do the fade-out animation
      e.preventDefault();
      setIsNavigating(true);

      // Start the fade-out animation for hero content
      // Use a data attribute to track if we're already animating to prevent duplicate animations
      if (!document.body.hasAttribute('data-animating-hero')) {
        document.body.setAttribute('data-animating-hero', 'true');
        const heroElements = document.querySelectorAll('[data-hero-content]');
        heroElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.transitionDuration = `${fadeOutDuration}ms`;
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
          }
        });
      }

      // Apply page-transitioning class to body for additional effects
      document.body.classList.add('page-transitioning');

      // Delay navigation to allow fade-out animation to complete
      setTimeout(() => {
        // Navigate programmatically
        if (typeof to === 'string') {
          navigate(to);
        } else {
          navigate(to);
        }

        // Reset the navigating state after a short delay
        setTimeout(() => {
          setIsNavigating(false);
          document.body.classList.remove('page-transitioning');
        }, 100);
      }, fadeOutDuration);
    }
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