import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSlideshow } from '../context/GlobalSlideshowContext';

/**
 * ScrollRestoration component that works with the global slideshow
 * to maintain the illusion of continuous hero backgrounds during navigation.
 *
 * This component doesn't force scrolling to top on every navigation,
 * as that's now handled by the SmoothLink component.
 */
const ScrollRestoration = () => {
  const { pathname } = useLocation();
  const { scrollPosition } = useSlideshow();

  // Only scroll to top on initial page load or when explicitly needed
  // (SmoothLink handles scroll during navigation)
  useEffect(() => {
    // Check if this is the initial page load
    if (!window.globalSlideshowState.hasInitialized) {
      window.scrollTo(0, 0);
      window.globalSlideshowState.hasInitialized = true;
    }
  }, []);

  // Update the current scroll position in the global state
  useEffect(() => {
    const handleScroll = () => {
      window.globalSlideshowState.scrollPosition = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
};

export default ScrollRestoration;