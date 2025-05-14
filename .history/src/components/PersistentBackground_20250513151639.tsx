import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uniqueBackgroundImages, calculateNextChangeTime, advanceToNextSlide } from '../context/GlobalSlideshowContext';

// Generate sophisticated, luxury real estate-appropriate motion effects
const generateRandomEffect = () => {
  const effects = [
    // Elegant, subtle zoom with minimal movement
    { scale: [1, 1.06], x: [0, 0], y: [0, 0], rotate: [0, 0] },
    // Refined horizontal pan with minimal zoom
    { scale: [1, 1.04], x: [0, -20], y: [0, 0], rotate: [0, 0] },
    // Sophisticated vertical pan with subtle zoom
    { scale: [1, 1.05], x: [0, 0], y: [0, -15], rotate: [0, 0] },
    // Elegant diagonal motion
    { scale: [1, 1.05], x: [0, 10], y: [0, 10], rotate: [0, 0] },
    // Subtle zoom with counter-diagonal movement
    { scale: [1, 1.05], x: [0, 12], y: [0, -12], rotate: [0, 0] },
    // Pure, sophisticated zoom
    { scale: [1, 1.08], x: [0, 0], y: [0, 0], rotate: [0, 0] },
    // Gentle pan right to left
    { scale: [1, 1.03], x: [10, -10], y: [0, 0], rotate: [0, 0] },
    // Gentle pan top to bottom
    { scale: [1, 1.03], x: [0, 0], y: [10, -10], rotate: [0, 0] },
  ];
  return effects[Math.floor(Math.random() * effects.length)];
};

// Random effect for each image (stable across rerenders)
const imageEffects = uniqueBackgroundImages.map(() => generateRandomEffect());

/**
 * PersistentBackground - A background slideshow component that persists across page transitions
 * This component is designed to be mounted at the root level and stay fixed in the background
 */
const PersistentBackground: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Set up the synchronized slideshow
  useEffect(() => {
    if (isFirstLoad) {
      // On first load, sync with the global state if available
      if (window.globalSlideshowState && typeof window.globalSlideshowState.currentIndex === 'number') {
        setCurrentIndex(window.globalSlideshowState.currentIndex);
      }
      setIsFirstLoad(false);
      return;
    }

    // Start the slideshow if it isn't already running
    if (!window.slideshowTimerActive) {
      // Calculate how much time has passed since the last update or use default interval
      const initialDelay = window.globalSlideshowState ? calculateNextChangeTime() : 15000;
      window.slideshowTimerActive = true;

      // First interval accounts for the time that has passed
      const initialTimerId = setTimeout(() => {
        // Advance to next slide
        if (window.globalSlideshowState) {
          advanceToNextSlide(setCurrentIndex);
        } else {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % uniqueBackgroundImages.length);
        }

        // Then continue with regular intervals
        const slideshowInterval = 12000; // 12 seconds for a slightly faster rotation
        const intervalId = setInterval(() => {
          if (window.globalSlideshowState) {
            advanceToNextSlide(setCurrentIndex);
          } else {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % uniqueBackgroundImages.length);
          }
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
  }, [isFirstLoad]);

  // Update global state when currentIndex changes
  useEffect(() => {
    if (window.globalSlideshowState) {
      window.globalSlideshowState.currentIndex = currentIndex;
      window.globalSlideshowState.lastUpdated = Date.now();
    }
  }, [currentIndex]);

  // Get the effect for the current slide
  const currentEffect = imageEffects[currentIndex];

  return (
    <>
      {/* Background container with black overlay directly applied */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-black persistent-background">
        {/* Background Image Carousel - Use mode="sync" to ensure no gap between images */}
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={currentIndex}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2, // Slightly faster transition for better flow
              ease: [0.2, 0.0, 0.0, 1.0] // Refined cubic-bezier for luxury real estate
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/35 to-black/45" />

            {/* Image with enhanced ken burns effect */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1, x: 0, y: 0, rotate: 0 }}
              animate={{
                scale: currentEffect.scale[1],
                x: currentEffect.x[1],
                y: currentEffect.y[1],
                rotate: currentEffect.rotate[1]
              }}
              transition={{
                duration: 25, // Slightly faster motion for better engagement
                ease: [0.2, 0.0, 0.0, 1.0] // Refined cubic-bezier
              }}
            >
              <img
                src={uniqueBackgroundImages[currentIndex]}
                alt="Page background"
                className="w-full h-full object-cover"
                style={{
                  transformOrigin: 'center center',
                  filter: 'saturate(1.1) brightness(0.9) contrast(1.1)'
                }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced black overlay */}
        <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/55 via-black/45 to-black/60">
          <div className="absolute inset-0 opacity-15 pattern-dots" />
        </div>

        {/* Additional overlay layer */}
        <div className="absolute inset-0 z-4 bg-black/20 mix-blend-overlay"></div>
      </div>
    </>
  );
};

export default PersistentBackground;