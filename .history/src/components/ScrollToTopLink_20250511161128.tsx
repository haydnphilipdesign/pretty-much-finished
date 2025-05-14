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

    // Function to forcefully scroll to top multiple times
    const forceScrollToTop = () => {
      // First, scroll immediately
      window.scrollTo(0, 0);

      // Then schedule multiple scroll resets with increasing delays
      setTimeout(() => window.scrollTo(0, 0), 10);
      setTimeout(() => window.scrollTo(0, 0), 50);
      setTimeout(() => window.scrollTo(0, 0), 100);
    };

    // Execute immediately
    forceScrollToTop();

    // Add a tiny delay to ensure scroll is reset before navigation
    setTimeout(() => {
      // Force scroll again right before navigation
      window.scrollTo(0, 0);

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

      // Set multiple scroll resets after navigation
      requestAnimationFrame(() => {
        forceScrollToTop();

        // And again after a short delay
        setTimeout(() => {
          forceScrollToTop();
        }, 100);
      });
    }, 50);
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
