import React, { useEffect } from 'react';
import { motion, useAnimation, Variants, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useOptimizedAnimation, fadeConfig, slideConfig, scaleConfig, depthConfig } from '../hooks/useOptimizedAnimation';

// Enhanced scroll animation hook with parallax and mask effects
export const useScrollAnimation = (threshold: number = 0.1, once: boolean = true) => {
  const { elementRef, animate, getTransitionConfig } = useOptimizedAnimation(0.2, 0.6, true);
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: threshold,
    rootMargin: '50px 0px',
  });

  const controls = useAnimation();

  useEffect(() => {
    if (inView && animate) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [controls, inView, once, animate]);

  return { ref, elementRef, controls, variants: fadeConfig, transition: getTransitionConfig() };
};

// Enhanced parallax scroll component
export const ParallaxScroll: React.FC<{
  children: React.ReactNode;
  direction?: 'up' | 'down';
  intensity?: number;
}> = ({ children, direction = 'up', intensity = 0.2 }) => {
  const { elementRef, intensity: adjustedIntensity } = useOptimizedAnimation({
    intensity,
    duration: 0.6,
    shouldAnimate: true
  });
  const { scrollYProgress } = useScroll();
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, direction === 'up' ? -100 * adjustedIntensity : 100 * adjustedIntensity]
  );

  return (
    <motion.div ref={elementRef} style={{ y }}>
      {children}
    </motion.div>
  );
};

// Enhanced depth effect component
export const DepthEffect: React.FC<{
  children: React.ReactNode;
  className?: string;
  depth?: 'shallow' | 'medium' | 'deep';
}> = ({ children, className = '', depth = 'medium' }) => {
  const { elementRef, animate } = useOptimizedAnimation(0.2, 0.6, true);
  const variants = depthConfig(depth);

  return (
    <motion.div
      ref={elementRef}
      className={`${className} perspective-1000`}
      variants={variants}
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
      style={{ 
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced scroll mask component
export const ScrollMask: React.FC<{
  children: React.ReactNode;
  direction?: 'top' | 'bottom' | 'both';
}> = ({ children, direction = 'both' }) => {
  const { elementRef } = useOptimizedAnimation(0.2, 0.6, true);
  const maskClasses = {
    top: 'before:absolute before:inset-x-0 before:top-0 before:h-20 before:bg-gradient-to-b before:from-white before:to-transparent before:z-10',
    bottom: 'after:absolute after:inset-x-0 after:bottom-0 after:h-20 after:bg-gradient-to-t after:from-white after:to-transparent after:z-10',
    both: 'before:absolute before:inset-x-0 before:top-0 before:h-20 before:bg-gradient-to-b before:from-white before:to-transparent before:z-10 after:absolute after:inset-x-0 after:bottom-0 after:h-20 after:bg-gradient-to-t after:from-white after:to-transparent after:z-10'
  };

  return (
    <div ref={elementRef} className={`relative ${maskClasses[direction]}`}>
      {children}
    </div>
  );
};

// Enhanced stagger container with depth
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0.1 }) => {
  const { elementRef, animate, getTransitionConfig } = useOptimizedAnimation(0.2, 0.6, true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        ...getTransitionConfig('tween')
      }
    }
  };

  return (
    <motion.div
      ref={(el) => {
        // @ts-ignore - combining refs
        elementRef.current = el;
        ref(el);
      }}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={inView && animate ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
};

// Enhanced stagger item with 3D effects
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  index?: number;
}> = ({ children, className = '', index = 0 }) => {
  const { elementRef, animate, getTransitionConfig } = useOptimizedAnimation(0.2, 0.6, true);

  const itemVariants = {
    hidden: { opacity: 0, y: 20, rotateX: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: index * 0.1,
        ...getTransitionConfig()
      }
    }
  };

  return (
    <motion.div
      ref={elementRef}
      className={`transform-gpu perspective-1000 ${className}`}
      variants={itemVariants}
    >
      {children}
    </motion.div>
  );
};

// Enhanced reveal section with mask
export const RevealSection: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const { elementRef, animate, getTransitionConfig } = useOptimizedAnimation(0.2, 0.6, true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const revealVariants = {
    hidden: {
      opacity: 0,
      clipPath: 'inset(0% 0% 100% 0%)',
      y: 50
    },
    visible: {
      opacity: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
      y: 0,
      transition: getTransitionConfig('tween')
    }
  };

  return (
    <motion.div
      ref={elementRef}
      className={className}
      variants={revealVariants}
      initial="hidden"
      animate={inView && animate ? "visible" : "hidden"}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  );
};

// Enhanced hover scale with depth
export const HoverScale: React.FC<{
  children: React.ReactNode;
  className?: string;
  scale?: number;
}> = ({ children, className = '', scale = 1.05 }) => {
  const { elementRef } = useOptimizedAnimation(0.2, 0.6, true);

  return (
    <motion.div
      ref={elementRef}
      className={`transform-gpu ${className}`}
      whileHover={{ scale, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};

// Smooth scroll utility
export const smoothScroll = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  height?: 'small' | 'medium' | 'large';
  overlay?: 'light' | 'dark' | 'none';
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  height = 'medium',
  overlay = 'dark'
}) => {
  const heightClasses = {
    small: 'h-[40vh]',
    medium: 'h-[60vh]',
    large: 'h-[80vh]'
  };

  const overlayClasses = {
    light: 'bg-black/20',
    dark: 'bg-black/50',
    none: ''
  };

  return (
    <div className={`relative w-full ${heightClasses[height]} overflow-hidden`}>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold text-center mb-4"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-center max-w-2xl px-4"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
};
