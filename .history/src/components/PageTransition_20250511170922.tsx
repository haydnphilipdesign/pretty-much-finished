import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll restoration on page change - extremely aggressive approach
  useEffect(() => {
    // Function to forcefully scroll to top using all available methods
    const forceScrollToTop = () => {
      // 1. Direct manipulation of scroll properties
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0; // For Safari compatibility

      // 2. Standard scrollTo method
      window.scrollTo(0, 0);

      // 3. Modern scroll API with options
      try {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'auto' // Use 'auto' for immediate scrolling
        });
      } catch (e) {
        // Fallback already handled above
      }

      // 4. Try to scroll the html and body elements directly
      try {
        const htmlElement = document.querySelector('html');
        const bodyElement = document.querySelector('body');

        if (htmlElement) htmlElement.scrollTop = 0;
        if (bodyElement) bodyElement.scrollTop = 0;
      } catch (e) {
        // Ignore errors
      }
    };

    // Execute immediately on page change
    forceScrollToTop();

    // Schedule multiple scroll attempts with increasing delays
    const scrollTimeouts = [
      setTimeout(() => forceScrollToTop(), 10),
      setTimeout(() => forceScrollToTop(), 50),
      setTimeout(() => forceScrollToTop(), 100),
      setTimeout(() => forceScrollToTop(), 200),
      setTimeout(() => forceScrollToTop(), 500),
      setTimeout(() => forceScrollToTop(), 1000)
    ];

    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      forceScrollToTop();

      // Schedule another round in the next frame
      requestAnimationFrame(() => {
        forceScrollToTop();
      });
    });

    // Set up a MutationObserver to detect DOM changes and scroll to top again
    const observer = new MutationObserver(() => {
      forceScrollToTop();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }

    // Add event listener for when the page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        forceScrollToTop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Add scroll event listener to force scroll to top if user tries to scroll
    const handleScroll = () => {
      // Only force scroll to top if we're very close to the top already
      // This prevents fighting with the user if they're intentionally scrolling down
      if (window.scrollY < 50) {
        forceScrollToTop();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      // Clean up all timeouts
      scrollTimeouts.forEach(timeout => clearTimeout(timeout));

      // Remove event listeners
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', handleScroll);
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