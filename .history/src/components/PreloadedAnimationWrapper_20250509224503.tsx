import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import usePreloadedAnimation from '../hooks/usePreloadedAnimation';

interface PreloadedAnimationWrapperProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  preloadDelay?: number;
  once?: boolean;
  bg?: string;
}

/**
 * Wrapper component that ensures content is fully loaded before animating in
 * Prevents background elements from showing through during animation
 */
const PreloadedAnimationWrapper: React.FC<PreloadedAnimationWrapperProps> = ({
  children,
  className = '',
  duration = 0.6,
  preloadDelay = 100,
  once = true,
  bg = 'bg-white'
}) => {
  const { elementRef, isLoaded, fadeConfig } = usePreloadedAnimation({
    duration,
    preloadDelay
  });

  return (
    <motion.div
      ref={elementRef}
      className={`${className} ${bg} relative z-10 overflow-hidden`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={fadeConfig}
    >
      <div 
        className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default PreloadedAnimationWrapper; 