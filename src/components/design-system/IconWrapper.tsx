import React from 'react';
import { motion, MotionProps } from 'framer-motion';

export interface IconWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon variant
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'ghost';
  
  /**
   * Icon size
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether to apply animations
   * @default false
   */
  withAnimation?: boolean;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Icon component
   */
  icon: React.ReactNode;
}

/**
 * IconWrapper component that follows the design system guidelines
 */
export const IconWrapper: React.FC<IconWrapperProps> = ({
  variant = 'primary',
  size = 'md',
  withAnimation = false,
  className = '',
  icon,
  ...props
}) => {
  // Define base class based on variant
  const baseClass = {
    primary: 'paress-icon-circle paress-icon-circle-primary',
    secondary: 'paress-icon-circle paress-icon-circle-secondary',
    ghost: 'paress-icon-circle paress-icon-circle-ghost',
  }[variant];
  
  // Define size class based on size
  const sizeClass = {
    sm: 'w-10 h-10',
    md:'w-12 h-12',
    lg: 'w-14 h-14',
  }[size];
  
  // Define icon size based on container size
  const iconSizeClass = {
    sm: 'w-5 h-5',
    md:'w-6 h-6',
    lg: 'w-7 h-7',
  }[size];
  
  // Animation variants for entrance and hover animation
  const animation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    hover:{
      scale: 1.1,
      transition: { duration: 0.3 }
    }
  };
  
  // Props for motion component if using animation
  const motionProps: MotionProps | {} = withAnimation ? {
    initial: 'hidden',
    whileInView: 'visible',
    whilehover:'hover',
    viewport: { once: true },
    variants: animation
  } : {};
  
  // Determine if we should use motion.div or regular div
  const Component = withAnimation ? motion.div : 'div';

  return (
    <Component 
      className={`${baseClass} ${sizeClass} ${className}`}
      {...motionProps}
      {...props}
    >
      <div className={iconSizeClass}>
        {icon}
      </div>
    </Component>
  );
};

export default IconWrapper;