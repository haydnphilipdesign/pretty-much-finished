import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface GlobalPageHeroProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  overlayOpacity?: string;
  overlayColor?: string;
  solidBackground?: boolean;
}

/**
 * GlobalPageHero - A hero section that uses the persistent background
 * This version doesn't contain its own slideshow, as it relies on the PersistentBackground
 */
const GlobalPageHero: React.FC<GlobalPageHeroProps> = ({
  children,
  className = '',
  minHeight = 'h-screen',
  overlayOpacity = 'bg-black/85',
  overlayColor = 'from-black/90 via-black/80 to-black/90',
  solidBackground = false
}) => {
  const location = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Reset any lingering data attributes when component mounts
  useEffect(() => {
    document.body.removeAttribute('data-scrolling');
    
    // Initialize heroRef with a blank dataset to prevent attribute conflicts
    if (heroRef.current) {
      Object.keys(heroRef.current.dataset).forEach(key => {
        if (key !== 'heroComponent' && key !== 'heroContainer') {
          delete heroRef.current.dataset[key];
        }
      });
    }
  }, []);

  return (
    <motion.section
      ref={heroRef}
      className={`relative flex items-center justify-center dark-bg-text overflow-hidden max-w-full ${minHeight} ${className} use-standard-animations framer-entrance-override`}
      data-hero-component="true"
      data-hero-container="true"
      style={{ 
        marginTop: 0, 
        paddingTop: 0,
        height: '100vh',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.7,
          ease: [0.22, 0.03, 0.36, 1.0],
          delay: 0.1
        }
      }}
      exit={{ 
        opacity: 0,
        y: -20,
        transition: {
          duration: 0.7,
          ease: [0.22, 0.03, 0.36, 1.0],
          delay: 0
        }
      }}
    >
      {/* Optional solid background to prevent slideshow from showing through */}
      {solidBackground && (
        <div className="absolute inset-0 bg-white z-0"></div>
      )}
      
      {/* Content Container - centered in viewport */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 w-full max-w-full flex items-center justify-center">
        <div className="py-4">
          {children}
        </div>
      </div>
    </motion.section>
  );
};

export default GlobalPageHero;