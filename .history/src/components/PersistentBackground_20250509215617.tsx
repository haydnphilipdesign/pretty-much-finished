import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uniqueBackgroundImages, calculateNextChangeTime, advanceToNextSlide } from '../context/GlobalSlideshowContext';

// Generate sophisticated, luxury real estate-appropriate motion effects
const generateRandomEffect = () => {
  const effects = [
    // Elegant, subtle zoom with minimal movement
    { scale: [1, 1.06], x: [0, 0], y: [0, 0], rotate: [0, 0] },
    // Refined horizontal pan with minimal zoom
    { scale: [1, 1.04], x: [0, -25], y: [0, 0], rotate: [0, 0] },
    // Sophisticated vertical pan with subtle zoom
    { scale: [1, 1.05], x: [0, 0], y: [0, -20], rotate: [0, 0] },
    // Elegant diagonal motion
    { scale: [1, 1.05], x: [0, 15], y: [0, 15], rotate: [0, 0] },
    // Subtle zoom with counter-diagonal movement
    { scale: [1, 1.05], x: [0, 15], y: [0, -15], rotate: [0, 0] },
    // Pure, sophisticated zoom
    { scale: [1, 1.08], x: [0, 0], y: [0, 0], rotate: [0, 0] },
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
        const slideshowInterval = 15000; // 15 seconds
        const intervalId = setInterval(() => {
          if (window.globalSlideshowState) {
            advanceToNextSlide(setCurrentIndex);
          } else {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % uniqueBackgroundImages.length);
          }
        }, slideshowInterval);

        window.slideshowIntervalId = intervalId;
        return () => {
          clearInterval(intervalId);
          window.slideshowTimerActive = false;
          delete window.slideshowIntervalId;
        };
      }, initialDelay);

      window.slideshowTimerId = initialTimerId;
      return () => {
        clearTimeout(initialTimerId);
        window.slideshowTimerActive = false;
        delete window.slideshowTimerId;
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
      {/* Background container with blue overlay directly applied */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-brand-blue-dark persistent-background">
        {/* Background Image Carousel - Use mode="sync" to ensure no gap between images */}
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={currentIndex}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.5, // Longer, more elegant transition for luxury feel
              ease: [0.2, 0.0, 0.0, 1.0] // Refined cubic-bezier for luxury real estate
            }}
          >
            <div className="absolute inset-0 bg-black/50" />

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
                duration: 30, // Very slow, elegant motion for luxury real estate
                ease: [0.2, 0.0, 0.0, 1.0] // Refined cubic-bezier
              }}
            >
              <img
                src={uniqueBackgroundImages[currentIndex]}
                alt="Page background"
                className="w-full h-full object-cover"
                style={{ transformOrigin: 'center center' }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Darker overlay with more black tones */}
        <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/75 via-blue-950/70 to-black/80">
          <div className="absolute inset-0 opacity-10 pattern-dots" />
        </div>
      </div>
    </>
  );
};

export default PersistentBackground;