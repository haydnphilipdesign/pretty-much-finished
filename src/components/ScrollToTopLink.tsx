import React, { useCallback } from 'react';
import { Link, LinkProps, useNavigate } from 'react-router-dom';

/**
 * A special Link component for header navigation
 * This component forcefully resets scroll position when navigating
 */
const ScrollToTopLink: React.FC<LinkProps> = ({
  to,
  children,
  onClick,
  ...rest
}) => {
  const navigate = useNavigate();

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }

    // SMOOTH APPROACH: Use smooth scrolling for a better user experience

    // Use the scroll method with smooth behavior for modern browsers
    try {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth' // Use 'smooth' for a nicer scrolling experience
      });
    } catch (e) {
      // Fallback for older browsers - use a simple animation
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollStep = Math.PI / (600 / 15); // 600ms duration
      const cosParameter = scrollTop / 2;

      let scrollCount = 0;
      let scrollMargin;

      const scrollInterval = setInterval(() => {
        if (window.pageYOffset === 0) {
          clearInterval(scrollInterval);
        }
        scrollCount += 1;
        scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
        window.scrollTo(0, scrollTop - scrollMargin);
      }, 15);
    }

    // Calculate the time needed for smooth scrolling based on current position
    const scrollDistance = window.pageYOffset;
    const scrollTime = Math.min(Math.max(scrollDistance / 2, 300), 800); // Between 300ms and 800ms

    // Wait for the scroll animation to complete before navigating
    setTimeout(() => {
      // Navigate with a special flag to ensure scroll to top
      if (typeof to === 'string') {
        navigate(to, {
          state: {
            scrollToTop: true,
            forceScroll: true,
            timestamp: Date.now() // Add timestamp to ensure unique state
          }
        });
      } else {
        navigate(to, {
          state: {
            scrollToTop: true,
            forceScroll: true,
            timestamp: Date.now()
          }
        });
      }

      // Ensure smooth transition after navigation
      requestAnimationFrame(() => {
        // No need to force scroll here as the page will be at the top after navigation
        // Just ensure the transition is smooth

        // Add a subtle delay to allow the hero to be fully visible
        setTimeout(() => {
          // This is intentionally left empty to allow the hero to be visible
          // without forcing additional scrolls
        }, 300);
      });
    }, scrollTime); // Dynamic delay based on scroll distance
  }, [to, navigate, onClick]);

  return (
    <Link
      to={to}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default ScrollToTopLink;
