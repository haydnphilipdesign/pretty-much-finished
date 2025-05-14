import React, { createContext, useContext, useState, useEffect } from 'react';

// Aggregate all background images from different pages
export const allBackgroundImages = [
  // High-quality optimized nature images
  '/optimized/aaron-burden-xG8IQMqMITM-unsplash.jpg',
  '/optimized/andrea-merovich-SlxrBPYAdAE-unsplash.jpg',
  '/optimized/benjamin-child-GWe0dlVD9e0-unsplash.jpg',
  '/optimized/ben-kusik-018VC2rg7uY-unsplash.jpg',
  '/optimized/bushkill_falls.jpg',
  '/optimized/christopher-lotito-rUnaFS1IaWk-unsplash.jpg',
  '/optimized/david-kovalenko-dnStBR008JM-unsplash.jpg',
  '/optimized/leaf-fall.jpg',
  '/optimized/leaves.jpg',
  '/optimized/nathan-anderson-6GD2iCgeYpA-unsplash.jpg',
  '/optimized/nathan-anderson-EMAOvhLUlDE-unsplash.jpg',
  '/optimized/nathan-anderson-XnLRV_1d078-unsplash.jpg',
  '/optimized/ricardo-gomez-angel-fmJvhyu3zMU-unsplash.jpg',
  '/optimized/tommy-kwak-LfxHb4J35Co-unsplash.jpg',

  // Professional/office images
  '/optimized/desk.jpg',
  '/optimized/laptop.jpg',
  '/optimized/notebooks.jpg',
  '/optimized/writing.jpg',
  '/optimized/clock.jpg',
  '/optimized/donnie-rosie-gzbwP2B4Dxs-unsplash.jpg',
  '/optimized/dylan-gillis-KdeqA3aTnBY-unsplash.jpg',
  '/optimized/jan-kahanek-g3O5ZtRk2E4-unsplash.jpg',
  '/optimized/kelly-sikkema--1_RZL8BGBM-unsplash.jpg',
  '/optimized/marissa-grootes-N9uOrBICcjY-unsplash.jpg',
  '/optimized/patrick-perkins-ETRPjvb0KM0-unsplash.jpg',
  '/optimized/scott-graham-5fNmWej4tAA-unsplash.jpg',
  '/optimized/scott-graham-OQMZwNd3ThU-unsplash.jpg'
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
  const slideshowInterval = 20000; // 20 seconds (much slower for a peaceful experience)
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
