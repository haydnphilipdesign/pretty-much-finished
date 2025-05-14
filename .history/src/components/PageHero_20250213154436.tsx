import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import ParallaxBackground from './ParallaxBackground';
import { Loader2 } from 'lucide-react';

interface PageHeroProps {
  title: ReactNode;
  subtitle?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  height?: 'small' | 'medium' | 'large' | 'custom';
  customHeight?: string;
  overlay?: 'light' | 'dark' | 'gradient' | 'blue' | 'gold' | 'none';
  overlayOpacity?: number;
  alignment?: 'left' | 'center' | 'right';
  contentAlignment?: 'top' | 'center' | 'bottom';
  loading?: boolean;
  blur?: number;
  disableParallax?: boolean;
  motionVariants?: {
    container?: Variants;
    title?: Variants;
    subtitle?: Variants;
    content?: Variants;
  };
  children?: React.ReactNode;
}

const defaultMotionVariants: Required<NonNullable<PageHeroProps['motionVariants']>> = {
  container: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, delay: 0.2 }
    }
  },
  title: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.4 }
    }
  },
  subtitle: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.6 }
    }
  },
  content: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.8 }
    }
  }
};

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  backgroundVideo,
  height = 'medium',
  customHeight,
  overlay = 'gradient',
  overlayOpacity = 0.5,
  alignment = 'center',
  contentAlignment = 'center',
  loading = false,
  blur = 0,
  disableParallax = false,
  motionVariants = defaultMotionVariants,
  children
}) => {
  // Ensure image path starts with / for public directory
  const processedImageUrl = backgroundImage ? 
    (backgroundImage.startsWith('/') ? backgroundImage : `/${backgroundImage}`) : 
    undefined;

  const heightClasses = {
    small: 'h-[50vh]',
    medium: 'h-[70vh]',
    large: 'h-screen',
    custom: customHeight || 'h-[70vh]'
  };

  const overlayClasses = {
    light: `bg-gradient-to-b from-black/30 via-black/20 to-black/30 opacity-${overlayOpacity * 100}`,
    dark: `bg-gradient-to-b from-black/70 via-black/50 to-black/70 opacity-${overlayOpacity * 100}`,
    gradient: `bg-gradient-to-b from-black/70 via-black/40 to-black/60 opacity-${overlayOpacity * 100}`,
    blue: `bg-gradient-to-br from-brand-blue/90 via-brand-blue/70 to-brand-blue/90 opacity-${overlayOpacity * 100}`,
    gold: `bg-gradient-to-br from-brand-gold/90 via-brand-gold/70 to-brand-gold/90 opacity-${overlayOpacity * 100}`,
    none: ''
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const contentAlignmentClasses = {
    top: 'items-start pt-32',
    center: 'items-center',
    bottom: 'items-end pb-32'
  };

  const variants = {
    container: { ...defaultMotionVariants.container, ...motionVariants?.container },
    title: { ...defaultMotionVariants.title, ...motionVariants?.title },
    subtitle: { ...defaultMotionVariants.subtitle, ...motionVariants?.subtitle },
    content: { ...defaultMotionVariants.content, ...motionVariants?.content }
  };

  return (
    <section 
      className={`relative ${heightClasses[height]} flex ${contentAlignmentClasses[contentAlignment]} justify-center text-white overflow-hidden`}
      role="banner"
      aria-label={`${title}${subtitle ? ` - ${subtitle}` : ''}`}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
          </div>
        ) : backgroundVideo ? (
          <div className="w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
          </div>
        ) : (
          <ParallaxBackground 
            imageUrl={processedImageUrl}
            overlayOpacity={overlayOpacity}
            scale={1.1}
            speed={0.3}
            blur={blur}
            disableParallax={disableParallax}
          />
        )}
      </div>
      <div className={`absolute inset-0 ${overlayClasses[overlay]}`}></div>
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          variants={variants.container}
          initial="hidden"
          animate="visible"
          className={`max-w-4xl mx-auto ${alignmentClasses[alignment]}`}
        >
          <motion.h1 
            variants={variants.title}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              variants={variants.subtitle}
              className="text-lg sm:text-xl md:text-2xl opacity-90 text-[#e9c476]"
            >
              {subtitle}
            </motion.p>
          )}
          {children && (
            <motion.div
              variants={variants.content}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(PageHero);
