import React from 'react';
import { motion, MotionProps } from 'framer-motion';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge variant
   * @default "primary"
   */
  variant?: 'primary' | 'secondary';
  
  /**
   * Whether to apply entrance animations
   * @default false
   */
  withAnimation?: boolean;
  
  /**
   * Optional icon to display before the badge text
   */
  icon?: React.ReactNode;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Badge content
   */
  children: React.ReactNode;
}

/**
 * Badge component that follows the design system guidelines
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  withAnimation = false,
  icon,
  className = '',
  children,
  ...props
}) => {
  // Define base class based on variant
  const baseClass = {
    primary: 'paress-badge paress-badge-primary',
    secondary: 'paress-badge paress-badge-secondary',
  }[variant];
  
  // Animation variants for entrance animation
  const motionVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  // Determine if we should use motion.span or regular span
  const Component = withAnimation ? motion.span : 'span';
  
  // Props for motion component if using animation
  const motionProps: MotionProps | {} = withAnimation ? {
    initial: 'hidden',
    animate: 'visible',
    variants: motionVariants
  } : {};

  return (
    <Component 
      className={`${baseClass} ${className}`}
      {...motionProps}
      {...props}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </Component>
  );
};

export default Badge;