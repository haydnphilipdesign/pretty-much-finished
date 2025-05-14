import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import SmoothLink from '../components/SmoothLink';

// Create a context to provide the custom Link component
export const NavigationContext = React.createContext<{
  Link: React.ComponentType<LinkProps>;
}>({
  Link: Link,
});

interface SmoothNavigationProviderProps {
  children: React.ReactNode;
  scrollDuration?: number;
  scrollThreshold?: number;
  alwaysScrollToTop?: boolean;
}

/**
 * SmoothNavigationProvider - Provides a custom Link component that smoothly scrolls
 * to the top of the page before navigation to maintain the hero section illusion.
 */
const SmoothNavigationProvider: React.FC<SmoothNavigationProviderProps> = ({
  children,
  scrollDuration = 500,
  scrollThreshold = 100,
  alwaysScrollToTop = false,
}) => {
  // Create a custom Link component with the smooth scroll behavior
  const CustomLink: React.FC<LinkProps> = (props) => (
    <SmoothLink
      {...props}
      scrollDuration={scrollDuration}
      scrollThreshold={scrollThreshold}
      alwaysScrollToTop={alwaysScrollToTop}
    />
  );

  return (
    <NavigationContext.Provider value={{ Link: CustomLink }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook to use the navigation context
export const useNavigation = () => {
  return React.useContext(NavigationContext);
};

export default SmoothNavigationProvider;
