import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll restoration on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  // Handle hero background elements
  useEffect(() => {
    if (!containerRef.current) return;

    // When a new page comes in, we need to prepare for the transition
    const prepareTransition = () => {
      // Find hero elements that should be excluded from the page transition
      const excludedElements = document.querySelectorAll('[data-exclude-from-transition="true"]');
      
      // Handle special positioning for excluded elements
      excludedElements.forEach(element => {
        if (element instanceof HTMLElement) {
          // Save original position for restoration
          const originalPosition = element.style.position;
          const originalZIndex = element.style.zIndex;

          // Fix the position of excluded elements
          element.style.position = 'fixed';
          element.style.zIndex = '1'; // Above the background, below the content
          
          // Restore original properties after transition
          setTimeout(() => {
            element.style.position = originalPosition;
            element.style.zIndex = originalZIndex;
          }, 600); // Slightly longer than animation to ensure completion
        }
      });
    };

    prepareTransition();

    // Clean up function
    return () => {
      const excludedElements = document.querySelectorAll('[data-exclude-from-transition="true"]');
      excludedElements.forEach(element => {
        if (element instanceof HTMLElement) {
          // Reset any styles we might have set
          element.style.position = '';
          element.style.zIndex = '';
        }
      });
    };
  }, [location.pathname]);

  // Define elegant, high-end real estate style transitions
  // More subtle, sophisticated transitions suitable for luxury real estate
  // Reduced scaling to prevent overflow
  const pageVariants = {
    initial: { 
      opacity: 0,
      scale: 1.01, // Reduced scale to prevent overflow
      filter: 'brightness(1.05)', // Slightly brighter entry
      zIndex: 10,
      backgroundColor: 'transparent',
      x: 0, // Ensure no horizontal movement
    },
    animate: { 
      opacity: 1,
      scale: 1,
      filter: 'brightness(1)',
      zIndex: 10,
      backgroundColor: 'transparent',
      x: 0, // Ensure no horizontal movement
      transition: {
        type: 'tween',
        ease: [0.2, 0.0, 0.0, 1.0], // Refined cubic-bezier for luxurious feel
        duration: 0.8,
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.99, // Reduced scale to prevent overflow
      filter: 'brightness(0.98)', // Slightly dimmer exit
      zIndex: 9,
      backgroundColor: 'transparent',
      x: 0, // Ensure no horizontal movement
      transition: {
        type: 'tween',
        ease: [0.2, 0.0, 0.0, 1.0], // Refined cubic-bezier
        duration: 0.8,
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="page-transition-container relative w-full flex-grow overflow-hidden"
      style={{ zIndex: 10 }}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="page-content-wrapper w-full flex-grow overflow-hidden"
          style={{ zIndex: 15 }} /* Higher than both background and overlay */
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;