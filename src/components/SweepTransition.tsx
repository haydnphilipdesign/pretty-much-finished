import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SweepTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  duration?: number;
}

/**
 * SweepTransition - A component that provides a lateral sweep transition effect
 * for page changes, creating a seamless sliding animation between pages.
 */
const SweepTransition: React.FC<SweepTransitionProps> = ({
  children,
  direction = 'left',
  duration = 0.5,
}) => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [previousPath, setPreviousPath] = useState('');
  
  // Track path changes for determining transition direction
  useEffect(() => {
    if (location.pathname !== currentPath) {
      setPreviousPath(currentPath);
      setCurrentPath(location.pathname);
    }
  }, [location.pathname, currentPath]);

  // Calculate transition direction based on path change
  const getDirection = (): 'left' | 'right' => {
    if (direction !== 'left') return direction;
    
    // You can add custom logic here to determine direction based on navigation patterns
    return 'left'; // Default direction
  };

  // Define animation variants based on direction
  const getVariants = () => {
    const transitionDirection = getDirection();
    
    return {
      initial: {
        x: transitionDirection === 'left' ? '100%' : '-100%',
        opacity: 0,
      },
      animate: {
        x: 0,
        opacity: 1,
        transition: {
          type: 'tween',
          ease: 'easeInOut',
          duration,
        },
      },
      exit: {
        x: transitionDirection === 'left' ? '-100%' : '100%',
        opacity: 0,
        transition: {
          type: 'tween',
          ease: 'easeInOut',
          duration,
        },
      },
    };
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={getVariants()}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default SweepTransition;