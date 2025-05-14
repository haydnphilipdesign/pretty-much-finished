import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll restoration on page change - smooth approach
  useEffect(() => {
    // Function to smoothly scroll to top
    const smoothScrollToTop = () => {
      // Use the modern scroll API with smooth behavior
      try {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth' // Use 'smooth' for a nicer scrolling experience
        });
      } catch (e) {
        // Fallback for older browsers - use a simple animation
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > 0) {
          const scrollStep = Math.PI / (600 / 15); // 600ms duration
          const cosParameter = scrollTop / 2;

          let scrollCount = 0;
          let scrollMargin;

          const scrollInterval = setInterval(() => {
            if (window.scrollY === 0) {
              clearInterval(scrollInterval);
            }
            scrollCount += 1;
            scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
            window.scrollTo(0, scrollTop - scrollMargin);
          }, 15);
        }
      }
    };

    // Only scroll to top if we're not already at the top
    if (window.scrollY > 0) {
      // Execute smooth scroll on page change
      smoothScrollToTop();
    }

    // Set up a MutationObserver to detect when hero content changes
    // This helps ensure the hero is properly displayed after navigation
    const observer = new MutationObserver((mutations) => {
      // Check if any of the mutations involve hero content
      const heroContentChanged = mutations.some(mutation => {
        // Type assertion to HTMLElement to use closest and querySelector
        const target = mutation.target as HTMLElement;
        return target.hasAttribute?.('data-hero-content') ||
               target.closest?.('[data-hero-content]') ||
               target.querySelector?.('[data-hero-content]');
      });

      if (heroContentChanged && window.scrollY > 0) {
        // If hero content changed and we're not at the top, scroll smoothly
        smoothScrollToTop();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-hero-content']
      });
    }

    // Add event listener for when the page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && window.scrollY > 0) {
        smoothScrollToTop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Remove event listeners
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
  // Optimized for seamless hero transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 1.0, // No scaling to ensure perfect hero alignment
      filter: 'brightness(1)', // No brightness change to ensure consistent hero appearance
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
        ease: [0.4, 0.0, 0.2, 1.0], // Smoother cubic-bezier for seamless transitions
        duration: 1.2, // Longer duration for smoother transitions
      }
    },
    exit: {
      opacity: 0,
      scale: 1.0, // No scaling to ensure perfect hero alignment
      filter: 'brightness(1)', // No brightness change to ensure consistent hero appearance
      zIndex: 9,
      backgroundColor: 'transparent',
      x: 0, // Ensure no horizontal movement
      transition: {
        type: 'tween',
        ease: [0.4, 0.0, 0.2, 1.0], // Smoother cubic-bezier
        duration: 1.2, // Longer duration for smoother transitions
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