import React from 'react';
import { motion, MotionProps } from 'framer-motion';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Section variant
   * @default "white"
   */
  variant?: 'white' | 'light' | 'blue';
  
  /**
   * Whether to apply entrance animations
   * @default false
   */
  withAnimation?: boolean;
  
  /**
   * Whether content should be centered
   * @default false
   */
  centered?: boolean;
  
  /**
   * Whether the section should take full width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Section title
   */
  title?: string;
  
  /**
   * Section subtitle
   */
  subtitle?: string;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Section content
   */
  children: React.ReactNode;
}

/**
 * Section component that follows the design system guidelines
 */
export const Section: React.FC<SectionProps> = ({
  variant = 'white',
  withAnimation = false,
  centered = false,
  fullWidth = false,
  title,
  subtitle,
  className = '',
  children,
  ...props
}) => {
  // Define base class based on variant
  const baseClass = {
    white: 'paress-section-white',
    light: 'paress-section-light',
    blue: 'paress-section-blue',
  }[variant];
  
  // Define container class
  const containerClass = fullWidth ? 'w-full px-4' : 'paress-container';
  
  // Define content alignment class
  const alignmentClass = centered ? 'text-center' : '';
  
  // Animation variants for entrance animation
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
  
  // Determine if we should use motion.section or regular section
  const Section = withAnimation ? motion.section : 'section';
  const ContentWrapper = withAnimation ? motion.div : 'div';
  
  // Props for motion component if using animation
  const motionProps: MotionProps | {} = withAnimation ? {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-100px' },
    variants: containerVariants,
  } : {};
  
  // Text color based on variant
  const textColorClass = {
    white: 'text-brand-blue',
    light: 'text-brand-blue',
    blue: 'text-white',
  }[variant];
  
  // Subtitle color based on variant
  const subtitleColorClass = {
    white: 'text-gray-600',
    light: 'text-gray-600',
    blue: 'text-blue-100',
  }[variant];

  return (
    <Section 
      className={`py-16 ${baseClass} ${className}`}
      {...motionProps}
      {...props}
    >
      <div className={`${containerClass}`}>
        {(title || subtitle) && (
          <div className={`mb-12 ${alignmentClass}`}>
            {title && (
              <ContentWrapper
                className={`text-3xl md:text-4xl font-bold ${textColorClass} mb-4`}
                {...(withAnimation && { variants: itemVariants })}
              >
                {title}
              </ContentWrapper>
            )}
            {subtitle && (
              <ContentWrapper
                className={`text-xl ${subtitleColorClass} max-w-3xl ${centered ? 'mx-auto' : ''}`}
                {...(withAnimation && { variants: itemVariants })}
              >
                {subtitle}
              </ContentWrapper>
            )}
          </div>
        )}
        <ContentWrapper
          className={alignmentClass}
          {...(withAnimation && { variants: itemVariants })}
        >
          {children}
        </ContentWrapper>
      </div>
    </Section>
  );
};

export default Section;