import React, { createContext, useContext } from 'react';
import { Link as RouterLink, LinkProps, useNavigate } from 'react-router-dom';
import { useSlideshow } from '../context/GlobalSlideshowContext';

// Create a context for the global link component
export const GlobalLinkContext = createContext<React.ComponentType<LinkProps>>(RouterLink);

// Custom hook to use the global link
export const useGlobalLink = () => useContext(GlobalLinkContext);

interface GlobalLinkProviderProps {
  children: React.ReactNode;
  scrollDuration?: number;
  heroVisibilityDelay?: number;
}

/**
 * A global provider for the Link component that adds smooth scrolling
 * This is a simpler alternative to the SmoothNavigationProvider
 */
export const GlobalLinkProvider: React.FC<GlobalLinkProviderProps> = ({
  children,
  scrollDuration = 400,
  heroVisibilityDelay = 200,
}) => {
  // Create a custom Link component with smooth scrolling
  const SmoothLink: React.FC<LinkProps> = ({ to, onClick, ...rest }) => {
    const { scrollPosition } = useSlideshow();
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Call the original onClick if provided
      if (onClick) {
        onClick(e);
      }

      // If the default was prevented by the onClick handler, respect that
      if (e.defaultPrevented) {
        return;
      }

      // Only scroll if we're not already at the top
      if (scrollPosition > 100) {
        e.preventDefault();

        console.log(`GlobalLink: Scrolling to top with duration=${scrollDuration}ms, then waiting ${heroVisibilityDelay}ms`);

        // Scroll to top with smooth animation
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

        // Wait for the scroll animation to complete
        setTimeout(() => {
          // Add a pause to ensure the hero is fully visible
          setTimeout(() => {
            // Navigate programmatically using React Router's navigate
            // This preserves the SPA behavior and doesn't cause a full page reload
            if (typeof to === 'string') {
              navigate(to);
            } else {
              navigate(to.pathname || '', {
                state: to.state,
                replace: to.replace
              });
            }
          }, heroVisibilityDelay);
        }, scrollDuration);
      } else {
        // If we're already at the top, just prevent default and navigate
        e.preventDefault();

        // Add a minimal delay to ensure consistent behavior
        setTimeout(() => {
          if (typeof to === 'string') {
            navigate(to);
          } else {
            navigate(to.pathname || '', {
              state: to.state,
              replace: to.replace
            });
          }
        }, 10);
      }
    };

    return <RouterLink to={to} onClick={handleClick} {...rest} />;
  };

  return (
    <GlobalLinkContext.Provider value={SmoothLink}>
      {children}
    </GlobalLinkContext.Provider>
  );
};

// Export a Link component that uses the global link
export const Link: React.FC<LinkProps> = (props) => {
  const GlobalLink = useGlobalLink();
  return <GlobalLink {...props} />;
};

export default GlobalLinkProvider;
