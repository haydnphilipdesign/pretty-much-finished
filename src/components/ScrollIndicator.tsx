import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

interface ScrollIndicatorProps {
  /** Whether the indicator is visible */
  isVisible: boolean;
}

/**
 * A visual indicator that appears during scroll-to-top animations
 */
const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 right-8 z-50 flex flex-col items-center"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut"
            }}
            className="bg-brand-blue text-white rounded-full p-3 shadow-lg"
          >
            <ChevronUp size={24} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 bg-white/90 backdrop-blur-sm text-brand-blue text-sm font-medium px-3 py-1 rounded-full shadow-md"
          >
            Scrolling up...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollIndicator;
