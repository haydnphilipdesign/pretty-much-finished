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
  cardStyle?: 'default' | 'glass' | 'glass-navy' | 'glass-blue' | 'glass-dark' | 'glass-gold' | 'glass-frost' | 'glass-login';
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
  cardStyle = 'default',
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
  const gradientBorderClass = hoverEffect === 'gradient' && cardStyle === 'default'
    ? 'before:absolute before:-inset-0.5 before:bg-gradient-to-r before:from-brand-gold before:to-brand-blue before:rounded-xl before:blur-sm before:opacity-0 before:group-hover:opacity-100 before:transition before:duration-300 before:-z-10'
    : '';

  // Determine base card styling based on props and cardStyle
  let baseCardStyle = 'relative w-full';

  // Determine card style based on cardStyle prop
  if (cardStyle !== 'default') {
    switch (cardStyle) {
      case 'glass':
        baseCardStyle += ' glass-card';
        break;
      case 'glass-navy':
        baseCardStyle += ' glass-card-navy';
        break;
      case 'glass-blue':
        baseCardStyle += ' glass-card-blue';
        break;
      case 'glass-dark':
        baseCardStyle += ' glass-card-dark';
        break;
      case 'glass-gold':
        baseCardStyle += ' glass-card-gold';
        break;
      case 'glass-frost':
        baseCardStyle += ' glass-card-frost';
        break;
      case 'glass-login':
        baseCardStyle += ' glass-card-login';
        break;
    }
  } else {
    // Legacy styling if not using glass card system
    if (heroStyle) {
      baseCardStyle += ' glass-card';
    } else if (dark) {
      baseCardStyle += ' glass-card-dark';
    } else {
      baseCardStyle += ' bg-white border border-gray-100 p-4 sm:p-6 shadow-md hover:shadow-lg rounded-2xl';
    }
  }

  // Determine title styling based on whether using a glass card
  const isGlassCard = cardStyle !== 'default' || heroStyle || dark;
  const titleStyle = isGlassCard
    ? 'glass-card-title'
    : 'text-lg sm:text-xl font-bold text-brand-blue mb-3 sm:mb-4 break-words';

  // Determine subtitle styling based on props
  const subtitleStyle = isGlassCard
    ? 'glass-card-subtitle'
    : 'text-xs sm:text-sm text-gray-800 mb-3 sm:mb-4 italic';

  return (
    <div className={`relative group ${gradientBorderClass} ${onClick ? 'cursor-pointer' : ''}`}>
      <CardWrapper
        className={`${baseCardStyle} ${className} z-10`}
        {...(withAnimation && {
          initial: 'hidden',
          whileInView: 'visible',
          viewport: { once: true, margin: '-50px' },
          variants: cardVariants,
        })}
        {...(withAnimation && hoverEffect !== 'none' && {
          whilehover:getHoverAnimation()
        })}
        onClick={onClick}
      >
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