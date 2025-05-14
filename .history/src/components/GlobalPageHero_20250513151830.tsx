import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uniqueBackgroundImages, calculateNextChangeTime, advanceToNextSlide, useSlideshow } from '../context/GlobalSlideshowContext';
import { useLocation } from 'react-router-dom';

interface GlobalPageHeroProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  overlayOpacity?: string;
  overlayColor?: string;
}

// Define container animations
const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

// Generate a random zoom/motion effect for each slide
const generateRandomEffect = () => {
  const effects = [
    // More pronounced zoom in
    { scale: [1, 1.08], x: [0, 0], y: [0, 0] },
    // Slow pan right with zoom
    { scale: [1, 1.06], x: [0, -30], y: [0, 0] },
    // Slow pan left with zoom
    { scale: [1, 1.06], x: [0, 30], y: [0, 0] },
    // Pan down with zoom
    { scale: [1, 1.05], x: [0, 0], y: [0, -25] },
    // Pan up with zoom
    { scale: [1, 1.05], x: [0, 0], y: [0, 25] },
    // Diagonal pan with zoom
    { scale: [1, 1.07], x: [0, -25], y: [0, 25] },
    // Diagonal pan opposite with zoom
    { scale: [1, 1.07], x: [0, 25], y: [0, -25] },
  ];
  return effects[Math.floor(Math.random() * effects.length)];
};

// Random effect for each image (stable across rerenders)
const imageEffects = uniqueBackgroundImages.map(() => generateRandomEffect());

const GlobalPageHero: React.FC<GlobalPageHeroProps> = ({
  children,
  className = '',
  minHeight = 'h-screen',
  overlayOpacity = 'bg-black/40',
  overlayColor = 'from-blue-900/70 via-blue-900/40 to-blue-900/80'
}) => {
  const location = useLocation();
  const { currentIndex, setCurrentIndex, setCurrentPage } = useSlideshow();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  // Update current page in global state
  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname, setCurrentPage]);

  // Set up the synchronized slideshow
  useEffect(() => {
    if (isFirstLoad) {
      // On first load, sync with the global state
      setCurrentIndex(window.globalSlideshowState.currentIndex);
      setIsFirstLoad(false);
      return;
    }

    // Important: Don't restart the slideshow timer on page change
    // Only establish the slideshow if it isn't already running
    if (!window.slideshowTimerActive) {
      // Calculate how much time has passed since the last update
      const initialDelay = calculateNextChangeTime();
      window.slideshowTimerActive = true;

      // First interval accounts for the time that has passed
      const initialTimerId = setTimeout(() => {
        // Advance to next slide
        advanceToNextSlide(setCurrentIndex);

        // Then continue with regular intervals
        const slideshowInterval = 12000; // 12 seconds for consistent timing with PersistentBackground
        const intervalId = setInterval(() => {
          advanceToNextSlide(setCurrentIndex);
        }, slideshowInterval);

        window.slideshowIntervalId = intervalId as unknown as number;
        return () => {
          clearInterval(intervalId);
          window.slideshowTimerActive = false;
          window.slideshowIntervalId = null;
        };
      }, initialDelay);

      window.slideshowTimerId = initialTimerId as unknown as number;
      return () => {
        clearTimeout(initialTimerId);
        window.slideshowTimerActive = false;
        window.slideshowTimerId = null;
      };
    }
  }, [isFirstLoad, setCurrentIndex]);

  // Scroll restoration effect - attempts to maintain hero position during page transitions
  useEffect(() => {
    // If there's a saved scroll position for this page, and we've just navigated here,
    // try to maintain a similar hero view
    if (window.globalSlideshowState.currentPage === location.pathname &&
        window.globalSlideshowState.scrollPosition > 0 &&
        heroRef.current) {
      // Calculate how far into the hero the user had scrolled (as a percentage)
      const heroHeight = heroRef.current.offsetHeight;
      const savedScrollPosition = window.globalSlideshowState.scrollPosition;
      const scrollPercentage = Math.min(savedScrollPosition / heroHeight, 1);

      // On new page load, scroll to the same relative position in the hero
      if (scrollPercentage > 0) {
        const newScrollTarget = heroHeight * scrollPercentage;
        // Use a slight delay to ensure the page has rendered
        setTimeout(() => {
          window.scrollTo({
            top: newScrollTarget,
            behavior: 'auto' // Use 'auto' to avoid animation
          });
        }, 100);
      }
    }
  }, [location.pathname]);

  // Get the effect for the current slide
  const currentEffect = imageEffects[currentIndex];

  return (
    <motion.section
      ref={heroRef}
      className={`relative flex items-center justify-center dark-bg-text overflow-hidden max-w-full ${minHeight} ${className}`}
      data-hero-component="true"
      data-hero-container="true"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Background Image Carousel - This should NOT transition with page */}
      <div className="absolute inset-0" data-exclude-from-transition="true">
        {/* Use AnimatePresence for slideshow transitions but NOT for page transitions */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: typeof window !== 'undefined' && window.globalSlideshowState?.isTransitioning ? 1 : 0 }}
            transition={{
              duration: typeof window !== 'undefined' && window.globalSlideshowState?.isTransitioning ? 0 : 1.5,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 bg-black/50" />

            {/* Image with ken burns effect */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1, x: 0, y: 0 }}
              animate={typeof window !== 'undefined' && window.globalSlideshowState?.isTransitioning
                ? { scale: 1, x: 0, y: 0 } // No animation during page transitions
                : {
                    scale: currentEffect.scale[1],
                    x: currentEffect.x[1],
                    y: currentEffect.y[1]
                  }
              }
              transition={{
                duration: typeof window !== 'undefined' && window.globalSlideshowState?.isTransitioning ? 0 : 20, // Slower animation for more subtle effect
                ease: "easeInOut"
              }}
            >
              <img
                src={uniqueBackgroundImages[currentIndex]}
                alt="Page hero background"
                className="w-full h-full object-cover"
                style={{
                  transition: 'opacity 1.5s ease-in-out',
                  willChange: 'transform, opacity'
                }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced gradient overlay with animated pattern */}
        <div className={`absolute inset-0 bg-gradient-to-b ${overlayColor}`}>
          <div className="absolute inset-0 opacity-20 pattern-dots" />
        </div>
      </div>

      {/* Animated dots in corner - decorative element */}
      <div className="absolute top-20 right-20 w-32 h-32 hidden lg:block">
        <motion.div
          className="w-2 h-2 rounded-full bg-blue-400 absolute"
          animate={{
            x: [0, 10, 0],
            y: [0, 10, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="w-2 h-2 rounded-full bg-blue-300 absolute left-10"
          animate={{
            x: [0, -10, 0],
            y: [0, 5, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="w-3 h-3 rounded-full bg-blue-200 absolute left-20 top-10"
          animate={{
            x: [0, 15, 0],
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 w-full max-w-full overflow-hidden">
        {/* This container should transition with the page */}
        <motion.div
          data-hero-content-container="true"
          className="overflow-x-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }} // Keep opacity at 1 during exit to prevent premature fade
          transition={{
            duration: 0.8,
            ease: [0.4, 0.0, 0.2, 1.0] // Match the page transition ease
          }}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default GlobalPageHero;