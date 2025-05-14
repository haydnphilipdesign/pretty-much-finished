import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GlobalPageHero from './GlobalPageHero';

interface PageHeroWrapperProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  minHeight?: string;
  className?: string;
}

/**
 * A reusable hero component for all pages that connects to the global slideshow
 * Uses the same positioning and width as the Home page hero
 */
const PageHeroWrapper: React.FC<PageHeroWrapperProps> = ({
  title,
  subtitle,
  children,
  minHeight = 'min-h-screen',
  className = ''
}) => {
  // Split title to apply different styling to the last word
  const words = title.split(' ');
  const lastWord = words.pop();
  const firstWords = words.join(' ');

  return (
    <GlobalPageHero minHeight={minHeight} className={className}>
      {/* Using the same grid layout and column spans as the Home hero */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8 items-center py-4 md:py-0">
        <div className="lg:col-span-3">
          <motion.div
            className="max-w-2xl mx-auto lg:mx-0 px-4 md:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ willChange: "opacity" }}
            data-hero-content="container"
          >


            {/* Title */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ willChange: "opacity, transform" }}
              data-hero-content="title"
            >
              {firstWords && <span className="block">{firstWords}</span>}
              {lastWord && <span className="block text-blue-300">{lastWord}</span>}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                className="text-xl md:text-2xl mb-6 md:mb-8 text-blue-100 font-light text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ willChange: "opacity, transform" }}
                data-hero-content="subtitle"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Additional content */}
            {children && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                data-hero-content="cta"
                className="flex justify-center lg:justify-start"
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right side column for potential glass card or other content */}
        <div className="lg:col-span-2 hidden lg:block">
          {/* This space is intentionally left empty to match the Home hero layout */}
          {/* It can be filled with content from child components if needed */}
        </div>
      </div>
    </GlobalPageHero>
  );
};

export default PageHeroWrapper;