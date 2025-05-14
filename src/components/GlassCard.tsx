import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant
   * @default "default"
   */
  variant?: 'default' | 'light' | 'dark' | 'blue';
  
  /**
   * Whether to apply hover animations
   * @default true
   */
  withHoverEffect?: boolean;
  
  /**
   * Type of hover effect to apply
   * @default "lift"
   */
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'none';
  
  /**
   * Whether to apply entrance animations
   * @default false
   */
  withAnimation?: boolean;
  
  /**
   * Whether to add decorative elements
   * @default false
   */
  withDecorations?: boolean;
  
  /**
   * Card title
   */
  title?: string;
  
  /**
   * Card subtitle
   */
  subtitle?: string;
  
  /**
   * Icon to display at the top of the card
   */
  icon?: React.ReactNode;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Card content
   */
  children: React.ReactNode;
  
  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * GlassCard - A reusable frosted glass card component that matches the login page style
 */
const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  withHoverEffect = true,
  hoverEffect = 'lift',
  withAnimation = false,
  withDecorations = false,
  title,
  subtitle,
  icon,
  className = '',
  children,
  onClick,
  ...props
}) => {
  // Animation variants for entrance animation
  const motionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  // Hover animation based on selected effect
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case 'lift':
        return { y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' };
      case 'scale':
        return { scale: 1.02 };
      case 'glow':
        return { boxShadow: '0 0 15px 2px rgba(59, 130, 246, 0.3)' };
      case 'none':
      default:
        return {};
    }
  };
  
  // Base card styling
  let baseCardStyle = 'rounded-2xl overflow-hidden transition-all duration-300 p-6 relative';
  
  // Variant-specific styling
  switch (variant) {
    case 'light':
      baseCardStyle += ' bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl';
      break;
    case 'dark':
      baseCardStyle += ' bg-black/10 backdrop-blur-md border border-white/10 text-white shadow-2xl';
      break;
    case 'blue':
      baseCardStyle += ' bg-blue-900/20 backdrop-blur-md border border-blue-300/20 text-white shadow-2xl';
      break;
    case 'default':
    default:
      baseCardStyle += ' bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl';
      break;
  }
  
  // Add cursor pointer if onClick is provided
  if (onClick) {
    baseCardStyle += ' cursor-pointer';
  }
  
  // Determine title styling based on variant
  const titleStyle = 'text-xl font-bold mb-3 break-words';
  
  // Determine subtitle styling based on variant
  const subtitleStyle = 'text-sm mb-4 text-blue-200';

  return (
    <motion.div
      className={`${baseCardStyle} ${className}`}
      style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      initial={withAnimation ? 'hidden' : undefined}
      whileInView={withAnimation ? 'visible' : undefined}
      viewport={withAnimation ? { once: true, margin: '-50px' } : undefined}
      variants={withAnimation ? motionVariants : undefined}
      whileHover={withHoverEffect ? getHoverAnimation() : undefined}
      onClick={onClick}
      {...props}
    >
      {/* Decorative elements */}
      {withDecorations && (
        <>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-50"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-blue-300 rounded-full opacity-30"></div>
        </>
      )}

      <div className="relative">
        {/* Icon if provided */}
        {icon && (
          <div className="mb-6 flex justify-center">
            {icon}
          </div>
        )}

        {/* Title and subtitle */}
        {title && <h3 className={titleStyle}>{title}</h3>}
        {subtitle && <p className={subtitleStyle}>{subtitle}</p>}
        
        {/* Main content */}
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
