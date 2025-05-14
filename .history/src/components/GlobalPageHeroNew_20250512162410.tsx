import React, { useRef } from 'react';
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
  overlayOpacity = 'bg-black/40',
  overlayColor = 'from-black/70 via-black/40 to-black/80',
  solidBackground = false
}) => {
  const location = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <motion.section
      ref={heroRef}
      className={`relative flex items-center justify-center dark-bg-text overflow-hidden max-w-full ${minHeight} ${className}`}
      data-hero-component="true"
      data-hero-container="true"
      style={{ 
        marginTop: 0, 
        paddingTop: 0,
        // No background color needed since we use the persistent background
      }}
    >
      {/* Optional solid background to prevent slideshow from showing through */}
      {solidBackground && (
        <div className="absolute inset-0 bg-white z-0"></div>
      )}
      
      {/* No background image carousel needed - we use the persistent one */}
      
      {/* No additional overlay gradient needed - using the one from persistent background */}

      {/* No animated dots needed here - using the ones from persistent background */}

      {/* Content Container - with padding for header */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 w-full max-w-full overflow-hidden pt-20 md:pt-24">
        {children}
      </div>
    </motion.section>
  );
};

export default GlobalPageHero;