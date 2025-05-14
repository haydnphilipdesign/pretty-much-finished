import React from 'react';
import { motion } from 'framer-motion';

interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  dark?: boolean;
  centered?: boolean;
  fullWidth?: boolean;
  withAnimation?: boolean;
  id?: string;
}

/**
 * ContentSection - A reusable section component with consistent styling
 * that matches the aesthetic of the hero sections
 */
const ContentSection: React.FC<ContentSectionProps> = ({
  children,
  className = '',
  title,
  subtitle,
  dark = false,
  centered = false,
  fullWidth = false,
  withAnimation = true,
  id,
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // Wrapper component - either motion.div or regular div based on animation flag
  const SectionWrapper = withAnimation ? motion.section : 'section';
  const ContentWrapper = withAnimation ? motion.div : 'div';

  return (
    <SectionWrapper
      id={id}
      className={`${dark ? 'bg-brand-blue/5' : 'bg-white'} ${className} overflow-x-hidden max-w-full`}
      {...(withAnimation && {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-100px' },
        variants: containerVariants,
      })}
    >
      <div className={`content-section px-4 sm:px-6 lg:px-8 ${fullWidth ? 'max-w-none' : ''}`}>
        {(title || subtitle) && (
          <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
            {title && (
              <ContentWrapper
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-blue mb-4"
                {...(withAnimation && { variants: itemVariants })}
              >
                {title}
              </ContentWrapper>
            )}
            {subtitle && (
              <ContentWrapper
                className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto"
                {...(withAnimation && { variants: itemVariants })}
              >
                {subtitle}
              </ContentWrapper>
            )}
          </div>
        )}
        <ContentWrapper
          className={centered ? 'text-center' : ''}
          {...(withAnimation && { variants: itemVariants })}
        >
          {children}
        </ContentWrapper>
      </div>
    </SectionWrapper>
  );
};

export default ContentSection;
