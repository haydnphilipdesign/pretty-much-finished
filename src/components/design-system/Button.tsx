import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Link } from 'react-router-dom';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'ghost';
  
  /**
   * Button size
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the button is rounded
   * @default false
   */
  rounded?: boolean;
  
  /**
   * Optional icon to display before the button text
   */
  iconStart?: React.ReactNode;
  
  /**
   * Optional icon to display after the button text
   */
  iconEnd?: React.ReactNode;
  
  /**
   * Whether to apply animations
   * @default false
   */
  withAnimation?: boolean;
  
  /**
   * URL for link buttons
   */
  to?: string;
  
  /**
   * Whether the link opens in a new tab
   * @default false
   */
  external?: boolean;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Button content
   */
  children: React.ReactNode;
}

/**
 * Button component that follows the design system guidelines
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  rounded = false,
  iconStart,
  iconEnd,
  withAnimation = false,
  to,
  external = false,
  className = '',
  children,
  ...props
}) => {
  // Define base class based on variant
  const baseClass = {
    primary: 'paress-button paress-button-primary',
    secondary: 'paress-button paress-button-secondary',
    ghost: 'paress-button paress-button-ghost',
  }[variant];
  
  // Define size class based on size
  const sizeClass = {
    sm: 'text-sm py-2 px-4',
    md:'text-base py-2.5 px-5',
    lg: 'text-lg py-3 px-6',
  }[size];
  
  // Define rounded class if rounded
  const roundedClass = rounded ? 'paress-button-rounded' : '';
  
  // Animation variants for hover animation
  const hoverAnimation = {
    rest: { scale: 1 },
    hover:{ 
      scale: 1.05,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };
  
  // Props for motion component if using animation
  const motionProps: MotionProps | {} = withAnimation ? {
    initial: 'rest',
    whilehover:'hover',
    whileTap: 'tap',
    variants: hoverAnimation
  } : {};
  
  // If to prop is provided, render a Link component
  if (to) {
    // For external links
    if (external) {
      return (
        <motion.a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseClass} ${sizeClass} ${roundedClass} ${className} inline-flex items-center justify-center gap-2`}
          {...motionProps}
        >
          {iconStart && <span className="flex-shrink-0">{iconStart}</span>}
          <span>{children}</span>
          {iconEnd && <span className="flex-shrink-0">{iconEnd}</span>}
        </motion.a>
      );
    }
    
    // For internal links
    return (
      <motion.div {...motionProps}>
        <Link
          to={to}
          className={`${baseClass} ${sizeClass} ${roundedClass} ${className} inline-flex items-center justify-center gap-2`}
        >
          {iconStart && <span className="flex-shrink-0">{iconStart}</span>}
          <span>{children}</span>
          {iconEnd && <span className="flex-shrink-0">{iconEnd}</span>}
        </Link>
      </motion.div>
    );
  }
  
  // For regular buttons
  return (
    <motion.button
      className={`${baseClass} ${sizeClass} ${roundedClass} ${className} inline-flex items-center justify-center gap-2`}
      type="button"
      {...motionProps}
      {...props}
    >
      {iconStart && <span className="flex-shrink-0">{iconStart}</span>}
      <span>{children}</span>
      {iconEnd && <span className="flex-shrink-0">{iconEnd}</span>}
    </motion.button>
  );
};

export default Button;