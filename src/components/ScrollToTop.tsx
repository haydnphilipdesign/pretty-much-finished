import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopProps {
  /**
   * Threshold in pixels to show the button
   * @default 300
   */
  threshold?: number;
  
  /**
   * Smooth scroll behavior
   * @default true
   */
  smooth?: boolean;
  
  /**
   * Custom CSS class
   */
  className?: string;
  
  /**
   * Position on screen
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  
  /**
   * Whether to show the button on mobile devices
   * @default true
   */
  showOnMobile?: boolean;
  
  /**
   * Custom content for the button
   * If provided, replaces the default icon
   */
  children?: React.ReactNode;
}

/**
 * ScrollToTop component - A button that appears when the user scrolls down
 * and lets them quickly jump back to the top of the page.
 */
const ScrollToTop: React.FC<ScrollToTopProps> = ({
  threshold = 300,
  smooth = true,
  className = '',
  position = 'bottom-right',
  showOnMobile = true,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2'
  };
  
  // Toggle visibility based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    
    // Initial check
    toggleVisibility();
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);
  
  // Scroll to top handler
  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  };
  
  // Hidden on mobile class
  const mobileClass = !showOnMobile ? 'hidden md:flex' : 'flex';
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className={`${mobileClass} fixed ${positionClasses[position]} items-center justify-center p-3 rounded-full bg-blue-600 dark:bg-blue-700 text-white shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors z-50 ${className}`}
        >
          {children || <ChevronUp size={20} />}
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
