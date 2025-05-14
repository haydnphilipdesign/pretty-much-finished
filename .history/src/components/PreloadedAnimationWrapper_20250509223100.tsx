import React, { PropsWithChildren } from 'react';
import { motion, AnimatePresence, Variant, Variants, HTMLMotionProps } from 'framer-motion';
import usePreloadedAnimation from '../hooks/usePreloadedAnimation';

interface PreloadedAnimationWrapperProps {
  variants?: Variants;
  initial?: string | Variant;
  animate?: string | Variant;
  exit?: string | Variant;
  className?: string;
  style?: React.CSSProperties;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
  tag?: 'div' | 'section' | 'span' | 'li' | 'ul' | 'ol' | 'article' | 'header' | 'footer';
  delay?: number;
}

/**
 * A wrapper component that ensures content is preloaded before animating into view
 * This helps prevent animations from running while content is still loading
 */
const PreloadedAnimationWrapper: React.FC<PropsWithChildren<PreloadedAnimationWrapperProps>> = ({
  children,
  variants,
  initial = 'hidden',
  animate: animateProp = 'visible',
  exit = 'exit',
  className = '',
  style = {},
  rootMargin = '200px',
  threshold = 0,
  triggerOnce = true,
  tag = 'div',
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

  // Use provided variants or defaults
  const animationVariants = variants || defaultVariants;

  // Create the motion component based on tag
  const MotionComponent = React.createElement(motion[tag], {
    initial,
    animate,
    exit,
    variants: animationVariants,
  }, children);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className} style={style}>
      <AnimatePresence mode="wait">
        {MotionComponent}
      </AnimatePresence>
    </div>
  );
};

export default PreloadedAnimationWrapper; 