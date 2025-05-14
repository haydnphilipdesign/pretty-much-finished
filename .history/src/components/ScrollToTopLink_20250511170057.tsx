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

    // DIRECT APPROACH: Use document.documentElement.scrollTop for more reliable scrolling
    // This directly manipulates the scroll position of the document
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // For Safari compatibility

    // Also use the standard window.scrollTo for broader compatibility
    window.scrollTo(0, 0);

    // Use the scroll method with options for modern browsers
    try {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'auto' // Use 'auto' for immediate scrolling
      });
    } catch (e) {
      // Fallback already handled above
    }

    // Add a tiny delay to ensure scroll is reset before navigation
    setTimeout(() => {
      // Force scroll again right before navigation using all methods
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
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
        // Force scroll again after navigation
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);

        // And again after a short delay
        setTimeout(() => {
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          window.scrollTo(0, 0);
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
