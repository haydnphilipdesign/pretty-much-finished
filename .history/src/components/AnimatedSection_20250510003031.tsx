import React, { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeConfig, slideConfig, scaleConfig, depthConfig } from '../hooks/useOptimizedAnimation';
import usePreloadedAnimation from '../hooks/usePreloadedAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade' | 'slide' | 'scale' | 'mask';
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  parallax?: boolean;
  parallaxIntensity?: number;
  mask?: 'top' | 'bottom' | 'both' | 'none';
  depth?: 'none' | 'shallow' | 'medium' | 'deep';
  bg?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fade',
  direction = 'up',
  delay = 0,
  duration = 0.6,
  parallax = false,
  parallaxIntensity = 0.2,
  mask = 'none',
  depth = 'none',
  bg = 'bg-white'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px 0px'
  });

  const { isLoaded, getTransitionConfig } = usePreloadedAnimation({
    duration,
    preloadDelay: 100
  });

  const { scrollYProgress } = useScroll();

  // Parallax effect with optimized intensity
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, parallax ? (direction === 'up' ? -100 : 100) * parallaxIntensity : 0]
  );

  // Get the appropriate animation config with NO y-axis movement
  const getAnimationConfig = () => {
    switch (animation) {
      case 'slide':
        // For slide, we only use opacity fade now
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
      case 'scale':
        return scaleConfig;
      case 'mask':
        return {
          ...fadeConfig,
          visible: {
            ...fadeConfig.visible,
            clipPath: 'inset(0%)',
            transition: getTransitionConfig('tween')
          },
          hidden: {
            ...fadeConfig.hidden,
            clipPath: mask === 'both' ? 'inset(0% 0% 100% 0%)' : 
                     mask === 'top' ? 'inset(100% 0% 0% 0%)' :
                     'inset(0% 0% 100% 0%)'
          }
        };
      default:
        return fadeConfig;
    }
  };

  // Combine with depth effect if specified
  const variants = depth !== 'none'
    ? { ...getAnimationConfig(), ...depthConfig(depth as 'shallow' | 'medium' | 'deep') }
    : getAnimationConfig();

  return (
    <motion.div
      className={`${className} ${bg} relative z-10 overflow-hidden`}
      style={{ y: parallax ? y : 0 }}
      initial="hidden"
      animate={(inView && isLoaded) ? "visible" : "hidden"}
      variants={variants}
      transition={getTransitionConfig()}
    >
      <div 
        ref={ref}
        className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      >
        {children}
      </div>
    </motion.div>
  );
};

// Preset configurations for common use cases
export const FadeInSection = (props: Omit<AnimatedSectionProps, 'animation'>) => (
  <AnimatedSection {...props} animation="fade" />
);

export const SlideInSection = (props: Omit<AnimatedSectionProps, 'animation'>) => (
  <AnimatedSection {...props} animation="slide" />
);

export const ScaleInSection = (props: Omit<AnimatedSectionProps, 'animation'>) => (
  <AnimatedSection {...props} animation="scale" />
);

export const ParallaxSection = (props: Omit<AnimatedSectionProps, 'parallax'>) => (
  <AnimatedSection {...props} parallax={true} />
);

export const MaskedSection = (props: Omit<AnimatedSectionProps, 'animation' | 'mask'>) => (
  <AnimatedSection {...props} animation="mask" mask="both" />
);

export default AnimatedSection;