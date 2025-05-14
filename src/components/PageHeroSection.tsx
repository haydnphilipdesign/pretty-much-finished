import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface PageHeroSectionProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
}

/**
 * PageHeroSection - A hero section that uses the persistent background
 */
const PageHeroSection: React.FC<PageHeroSectionProps> = ({
  children,
  className = '',
  minHeight = 'h-screen',
}) => {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={heroRef}
      className={`relative flex items-center justify-center text-white overflow-hidden max-w-full ${minHeight} ${className}`}
      data-hero-component="true"
      data-hero-container="true"
      style={{ 
        marginTop: 0, 
        paddingTop: 0,
      }}
    >
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 w-full max-w-full overflow-hidden">
        {children}
      </div>
    </section>
  );
};

export default PageHeroSection;