import React, { createContext, useContext, useState, useEffect } from 'react';

// Aggregate all background images from different pages
export const allBackgroundImages = [
  // Home page
  '/laptop.jpg',
  '/home-hero.jpg',
  '/service-hero.jpg',
  '/work-with-me-hero.jpg',
  // About page
  '/about-hero.jpg',
  // Services page
  '/services-hero.jpg',
  // Work with me page
  '/work-with-me-hero.jpg',
  // Additional images from public folder
  '/bushkill_falls.jpg',
  '/writing.jpg',
  '/notebooks.jpg',
  '/leaves.jpg',
  '/leaf-fall.jpg',
  '/wine.jpg'
];

// Filter out any duplicates
export const uniqueBackgroundImages = [...new Set(allBackgroundImages)];

// Initialize global state on window object if it doesn't exist
if (!window.globalSlideshowState) {
  window.globalSlideshowState = {
    currentIndex: 0,
    lastUpdated: Date.now(),
    scrollPosition: 0,
    currentPage: '',
    hasInitialized: false
  };
}

// Helper function to update the global state
export const updateGlobalSlideshowState = (updates: Partial<typeof window.globalSlideshowState>) => {
  window.globalSlideshowState = {
    ...window.globalSlideshowState,
    ...updates
  };
};

// Context to share state across components
interface SlideshowContextType {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const SlideshowContext = createContext<SlideshowContextType | undefined>(undefined);

export const SlideshowProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(window.globalSlideshowState.currentIndex);
  const [scrollPosition, setScrollPosition] = useState(window.globalSlideshowState.scrollPosition);
  const [currentPage, setCurrentPage] = useState(window.globalSlideshowState.currentPage);

  // Log the initial state
  useEffect(() => {
    console.log('SlideshowProvider initialized with:', {
      currentIndex: window.globalSlideshowState.currentIndex,
      scrollPosition: window.globalSlideshowState.scrollPosition,
      currentPage: window.globalSlideshowState.currentPage,
      hasInitialized: window.globalSlideshowState.hasInitialized
    });
  }, []);

  // Update the global state when our context values change
  useEffect(() => {
    updateGlobalSlideshowState({
      currentIndex,
      scrollPosition,
      currentPage
    });
    console.log(`SlideshowProvider: Updated global state - currentIndex: ${currentIndex}`);
  }, [currentIndex, scrollPosition, currentPage]);

  // Listen for scroll events to track position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      updateGlobalSlideshowState({ scrollPosition: window.scrollY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SlideshowContext.Provider value={{
      currentIndex,
      setCurrentIndex,
      scrollPosition,
      setScrollPosition,
      currentPage,
      setCurrentPage
    }}>
      {children}
    </SlideshowContext.Provider>
  );
};

// Custom hook to use the slideshow context
export const useSlideshow = () => {
  const context = useContext(SlideshowContext);
  if (context === undefined) {
    throw new Error('useSlideshow must be used within a SlideshowProvider');
  }
  return context;
};

// Utility function to calculate next image change timing
export const calculateNextChangeTime = () => {
  const slideshowInterval = 10000; // 10 seconds (slowed down from 7 seconds)
  const timeSinceLastUpdate = Date.now() - window.globalSlideshowState.lastUpdated;
  return Math.max(0, slideshowInterval - timeSinceLastUpdate);
};

// Utility function to advance to next slideshow image
export const advanceToNextSlide = (setCurrentIndex: (index: number) => void) => {
  const nextIndex = (window.globalSlideshowState.currentIndex + 1) % uniqueBackgroundImages.length;
  window.globalSlideshowState.currentIndex = nextIndex;
  window.globalSlideshowState.lastUpdated = Date.now();
  setCurrentIndex(nextIndex);
  console.log(`GlobalSlideshowContext: Advanced to slide ${nextIndex}`);
};
