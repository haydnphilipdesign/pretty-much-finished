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
    
    // Forcefully reset scroll position immediately
    window.scrollTo(0, 0);
    
    // Add a tiny delay to ensure scroll is reset
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
      
      // Set a final scroll reset after navigation
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }, 10);
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
