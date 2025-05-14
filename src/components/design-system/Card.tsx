import React from 'react';
import { motion, MotionProps } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant
   * @default "default"
   */
  variant?: 'default' | 'glass' | 'hero';
  
  /**
   * Whether to apply hover animations
   * @default true
   */
  withHoverEffect?: boolean;
  
  /**
   * Whether to apply entrance animations
   * @default false
   */
  withAnimation?: boolean;
  
  /**
   * Card title
   */
  title?: string;
  
  /**
   * Card subtitle
   */
  subtitle?: string;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Card content
   */
  children: React.ReactNode;
}

/**
 * Card component that follows the design system guidelines
 */
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  withHoverEffect = true,
  withAnimation = false,
  title,
  subtitle,
  className = '',
  children,
  ...props
}) => {
  // Define base class based on variant
  const baseClass = {
    default: 'paress-card',
    glass: 'paress-card-glass',
    hero: 'paress-hero-card',
  }[variant];
  
  // Define hover class if hover animation is enabled
  const hoverClass = withHoverEffect ? 'hover:shadow-lg hover:-translate-y-1' : '';
  
  // Animation variants for entrance animation
  const motionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  // Determine if we should use motion.div or regular div
  const Component = withAnimation ? motion.div : 'div';
  
  // Props for motion component if using animation
  const motionProps: MotionProps | {} = withAnimation ? {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true },
    variants: motionVariants
  } : {};
  
  // Title styling based on variant
  const titleClass = {
    default: 'text-xl font-bold text-brand-blue mb-3',
    glass: 'text-xl font-bold text-white mb-3',
    hero: 'text-xl font-bold text-white mb-3',
  }[variant];
  
  // Subtitle styling based on variant
  const subtitleClass = {
    default: 'text-sm text-gray-600 mb-4',
    glass: 'text-sm text-blue-200 mb-4',
    hero: 'text-sm text-blue-200 mb-4',
  }[variant];

  return (
    <Component 
      className={`${baseClass} ${hoverClass} ${className} transition-all duration-300`}
      {...motionProps}
      {...props}
    >
      {title && <h3 className={titleClass}>{title}</h3>}
      {subtitle && <p className={subtitleClass}>{subtitle}</p>}
      {children}
    </Component>
  );
};

export default Card;