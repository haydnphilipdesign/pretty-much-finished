import React, { createContext, useContext } from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
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
            // Navigate programmatically
            window.location.href = typeof to === 'string' ? to : to.pathname || '';
          }, heroVisibilityDelay);
        }, scrollDuration);
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
