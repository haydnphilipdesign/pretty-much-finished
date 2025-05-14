import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../providers/SmoothNavigationProvider';

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'inverted';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  to?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

/**
 * GlassButton - A frosted glass styled button component
 */
const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
  to,
  type = 'button',
  onClick,
}) => {
  const { Link } = useNavigation();

  // Base button styles
  const baseStyles = `
    inline-flex 
    items-center 
    justify-center 
    font-medium 
    transition-all 
    duration-300 
    rounded-full 
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
  `;

  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20',
    outline: 'bg-transparent hover:bg-white/10 text-white border border-white/30',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
    inverted: 'bg-white hover:bg-white/90 text-blue-600',
  };

  // Size styles
  const sizeStyles = {
    sm: 'text-sm px-4 py-1.5',
    md:'px-6 py-2.5',
    lg: 'text-lg px-8 py-3',
  };

  // Combined classes
  const buttonClasses = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${className}
  `;

  // Loading spinner
  const loadingSpinner = (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // Button content
  const buttonContent = (
    <>
      {loading ? loadingSpinner : iconPosition === 'left' && icon}
      <span>{children}</span>
      {!loading && iconPosition === 'right' && icon}
    </>
  );

  // If it's a link
  if (to) {
    return (
      <Link to={to} className={buttonClasses}>
        <motion.div
          className="flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {buttonContent}
        </motion.div>
      </Link>
    );
  }

  // Regular button
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
    >
      {buttonContent}
    </motion.button>
  );
};

export default GlassButton;
