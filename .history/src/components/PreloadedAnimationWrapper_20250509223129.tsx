import React, { PropsWithChildren } from 'react';
import { motion, AnimatePresence, Variants, VariantLabels, Target, TargetAndTransition } from 'framer-motion';
import usePreloadedAnimation from '../hooks/usePreloadedAnimation';

interface PreloadedAnimationWrapperProps {
  variants?: Variants;
  initial?: boolean | VariantLabels | Target;
  animate?: boolean | VariantLabels | TargetAndTransition;
  exit?: VariantLabels | TargetAndTransition;
  className?: string;
  style?: React.CSSProperties;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
}

/**
 * A wrapper component that ensures content is preloaded before animating into view
 * This helps prevent animations from running while content is still loading
 */
const PreloadedAnimationWrapper: React.FC<PropsWithChildren<PreloadedAnimationWrapperProps>> = ({
  children,
  variants,
  initial = "hidden",
  animate: animateProp = "visible",
  exit = "exit",
  className = '',
  style = {},
  rootMargin = '200px',
  threshold = 0,
  triggerOnce = true,
  delay = 0
}) => {
  const { ref, isVisible, isReady } = usePreloadedAnimation({
    rootMargin,
    threshold,
    triggerOnce
  });

  // Only animate when both visible and ready (preloaded)
  const animate = isVisible && isReady ? animateProp : initial;

  // Default variants if none provided
  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className} style={style}>
      <AnimatePresence mode="wait">
        <motion.div
          initial={initial}
          animate={animate}
          exit={exit}
          variants={variants || defaultVariants}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PreloadedAnimationWrapper; 