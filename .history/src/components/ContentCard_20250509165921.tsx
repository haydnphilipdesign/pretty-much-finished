import React from 'react';
import { motion } from 'framer-motion';

interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  dark?: boolean;
  withAnimation?: boolean;
  heroStyle?: boolean;
  onClick?: () => void;
  hoverEffect?: 'scale' | 'lift' | 'glow' | 'gradient' | 'none';
  iconContent?: React.ReactNode;
}

/**
 * ContentCard - A reusable card component with consistent styling
 * that matches the established design system
 */
const ContentCard: React.FC<ContentCardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  dark = false,
  withAnimation = true,
  heroStyle = false,
  onClick,
  hoverEffect = 'scale',
  iconContent,
}) => {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Hover animations based on the hoverEffect prop
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case 'scale':
        return { scale: 1.02, transition: { duration: 0.2 } };
      case 'lift':
        return { y: -8, transition: { duration: 0.2 } };
      case 'glow':
        return { boxShadow: '0 10px 25px -5px rgba(0, 102, 204, 0.15)' };
      case 'gradient':
        // No animation here as the gradient effect is handled with CSS
        return { y: -5, transition: { duration: 0.2 } };
      case 'none':
      default:
        return {};
    }
  };

  // Wrapper component - either motion.div or regular div based on animation flag
  const CardWrapper = withAnimation ? motion.div : 'div';

  // Determine gradient border class based on hover effect
  const gradientBorderClass = hoverEffect === 'gradient'
    ? 'before:absolute before:-inset-0.5 before:bg-gradient-to-r before:from-brand-gold before:to-brand-blue before:rounded-xl before:blur-sm before:opacity-0 before:group-hover:opacity-100 before:transition before:duration-300 before:-z-10'
    : '';

  // Determine base card styling based on props
  let baseCardStyle = 'rounded-xl overflow-hidden transition-all duration-300 max-w-full relative w-full';

  // Add more specific styling based on card type
  if (heroStyle) {
    baseCardStyle += ' bg-white/10 backdrop-blur-sm border border-white/20 p-4 sm:p-6 shadow-lg';
  } else if (dark) {
    baseCardStyle += ' bg-brand-blue/10 backdrop-blur-sm border border-brand-blue/20 p-4 sm:p-6 shadow-md hover:shadow-lg';
  } else {
    baseCardStyle += ' bg-white border border-gray-100 p-6 shadow-md hover:shadow-lg';
  }

  // Additional inline styles for backdrop-filter
  const cardInlineStyle = heroStyle ? { backdropFilter: 'blur(8px)' } : {};

  // Determine title styling based on props
  const titleStyle = heroStyle
    ? 'text-xl font-bold text-white mb-4 break-words'
    : 'text-xl font-bold text-brand-blue mb-4 break-words';

  // Determine subtitle styling based on props
  const subtitleStyle = heroStyle
    ? 'text-sm text-blue-200 mb-4'
    : 'text-sm text-gray-600 mb-4 italic';

  return (
    <div className={`relative group ${gradientBorderClass} ${onClick ? 'cursor-pointer' : ''}`}>
      <CardWrapper
        className={`${baseCardStyle} ${className} z-10 relative`}
        style={cardInlineStyle}
        {...(withAnimation && {
          initial: 'hidden',
          whileInView: 'visible',
          viewport: { once: true, margin: '-50px' },
          variants: cardVariants,
        })}
        {...(withAnimation && hoverEffect !== 'none' && {
          whileHover: getHoverAnimation()
        })}
        onClick={onClick}
      >
        {/* Decorative elements for hero style cards */}
        {heroStyle && (
          <>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-50"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-blue-300 rounded-full opacity-30"></div>
          </>
        )}

        <div className="relative">
          {/* Icon content if provided */}
          {iconContent && (
            <div className="mb-6 flex justify-center">
              {iconContent}
            </div>
          )}

          {title && <h3 className={titleStyle}>{title}</h3>}
          {subtitle && <p className={subtitleStyle}>{subtitle}</p>}
          {children}
        </div>
      </CardWrapper>
    </div>
  );
};

export default ContentCard;