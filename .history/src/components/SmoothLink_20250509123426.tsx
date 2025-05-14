import React, { useCallback, useState } from 'react';
import { Link, LinkProps, useNavigate } from 'react-router-dom';
import { useSlideshow } from '../context/GlobalSlideshowContext';

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
   * @default 300
   */
  heroVisibilityDelay?: number;

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
  scrollDuration = 500,
  alwaysScrollToTop = false,
  scrollThreshold = 100,
  heroVisibilityDelay = 300,
  className = '',
  onClick,
  children,
  ...rest
}) => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const { scrollPosition } = useSlideshow();

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

      // Scroll to top with smooth animation
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Wait for the scroll animation to complete before navigating
      setTimeout(() => {
        // Add a pause to ensure the hero is fully visible
        // This creates a moment where the user can see the hero before navigation
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
          }, 100);
        }, heroVisibilityDelay);
      }, scrollDuration);
    }
    // If we don't need to scroll, the link will work normally
  }, [to, navigate, scrollPosition, scrollThreshold, alwaysScrollToTop, scrollDuration, onClick, isNavigating]);

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
