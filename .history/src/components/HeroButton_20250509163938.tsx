import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../providers/SmoothNavigationProvider';

interface HeroButtonProps {
  children: React.ReactNode;
  className?: string;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'inverted';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  withAnimation?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * HeroButton - A reusable button component with consistent styling
 * that matches the aesthetic of the hero buttons
 */
const HeroButton: React.FC<HeroButtonProps> = ({
  children,
  className = '',
  to,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  withAnimation = true,
  disabled = false,
  type = 'button',
}) => {
  const { Link } = useNavigation();

  // Animation variants
  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  // Determine button styling based on variant
  const variantStyles = {
    primary: 'hero-button',
    secondary: 'bg-brand-gold hover:bg-brand-gold/90 text-brand-blue py-2 rounded-full',
    outline: 'bg-transparent border border-white/30 text-white hover:bg-white/10 py-2 rounded-full',
    ghost: 'bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 py-2 rounded-full',
  };

  // Determine button size
  const sizeStyles = {
    sm: 'px-4 py-1 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-3 text-lg',
  };

  // Combine all styles
  const buttonStyle = `
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    inline-flex items-center justify-center
    font-medium transition-all duration-300
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  // Wrapper component - either motion.div or regular div based on animation flag
  const ButtonWrapper = withAnimation ? motion.div : 'div';

  // If it's a link
  if (to) {
    return (
      <ButtonWrapper
        {...(withAnimation && {
          initial: 'hidden',
          animate: 'visible',
          variants: buttonVariants,
        })}
      >
        <Link
          to={to}
          className={buttonStyle}
          onClick={onClick}
          aria-disabled={disabled}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </Link>
      </ButtonWrapper>
    );
  }

  // If it's a button
  return (
    <ButtonWrapper
      {...(withAnimation && {
        initial: 'hidden',
        animate: 'visible',
        variants: buttonVariants,
        whileHover: disabled ? {} : { scale: 1.02 },
        whileTap: disabled ? {} : { scale: 0.98 },
      })}
    >
      <button
        type={type}
        className={buttonStyle}
        onClick={onClick}
        disabled={disabled}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    </ButtonWrapper>
  );
};

export default HeroButton;
