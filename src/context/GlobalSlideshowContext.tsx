import React, { createContext, useContext, useState, useEffect } from 'react';

// Define window interface to extend Window with our global properties
declare global {
  interface Window {
    globalSlideshowState: {
      currentIndex: number;
      lastUpdated: number;
      scrollPosition: number;
      currentPage: string;
      hasInitialized: boolean;
      isTransitioning: boolean;
    };
    slideshowTimerActive: boolean;
    slideshowTimerId: number | null;
    slideshowIntervalId: number | null;
  }
}

// Aggregate all background images from different pages
export const allBackgroundImages = [
  // Slideshow images
  '/slideshow/aaron-burden-xG8IQMqMITM-unsplash.jpg',
  '/slideshow/clock.jpg',
  '/slideshow/home-hero.jpg',
  '/slideshow/jan-kahanek-g3O5ZtRk2E4-unsplash.jpg',
  '/slideshow/laptop.jpg',
  '/slideshow/marissa-grootes-N9uOrBICcjY-unsplash.jpg',
  '/slideshow/notebooks.jpg',
  '/slideshow/patrick-perkins-ETRPjvb0KM0-unsplash.jpg',
  '/slideshow/rasul-kireev-zJ9k4xJyv34-unsplash.jpg',
  '/slideshow/raymond-eichelberger-_6BI9ExFIvY-unsplash.jpg',
  '/slideshow/scott-graham-OQMZwNd3ThU-unsplash.jpg',
  '/slideshow/services.jpg',
  '/slideshow/steve-johnson-Kr8Tc8Rugdk-unsplash.jpg',
  '/slideshow/thomas-lefebvre-gp8BLyaTaA0-unsplash.jpg',
  '/slideshow/work-with-me-hero.jpg',
  '/slideshow/writing.jpg'
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
    hasInitialized: false,
    isTransitioning: false
  };
}

// Global variables for slideshow control - helps maintain across page changes
if (typeof window !== 'undefined') {
  window.slideshowTimerActive = window.slideshowTimerActive || false;
  window.slideshowTimerId = window.slideshowTimerId || null;
  window.slideshowIntervalId = window.slideshowIntervalId || null;
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

  // Update the global state when our context values change
  useEffect(() => {
    updateGlobalSlideshowState({
      currentIndex,
      scrollPosition,
      currentPage
    });
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
  const slideshowInterval = 12000; // 12 seconds for a slightly faster rotation
  const timeSinceLastUpdate = Date.now() - window.globalSlideshowState.lastUpdated;
  return Math.max(0, slideshowInterval - timeSinceLastUpdate);
};

// Utility function to advance to next slideshow image
export const advanceToNextSlide = (setCurrentIndex: (index: number) => void) => {
  const nextIndex = (window.globalSlideshowState.currentIndex + 1) % uniqueBackgroundImages.length;
  window.globalSlideshowState.currentIndex = nextIndex;
  window.globalSlideshowState.lastUpdated = Date.now();
  setCurrentIndex(nextIndex);
};
