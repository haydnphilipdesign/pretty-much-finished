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
}

/**
 * ContentCard - A reusable card component with consistent styling
 * that matches the aesthetic of the hero cards
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
}) => {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Wrapper component - either motion.div or regular div based on animation flag
  const CardWrapper = withAnimation ? motion.div : 'div';

  // Determine card styling based on props
  const cardStyle = heroStyle
    ? 'hero-card'
    : dark
    ? 'content-card-dark'
    : 'content-card';

  // Additional inline styles for backdrop-filter
  const cardInlineStyle = heroStyle ? { backdropFilter: 'blur(8px)' } : {};

  // Determine title styling based on props
  const titleStyle = heroStyle
    ? 'hero-card-title'
    : 'text-xl font-bold text-brand-blue mb-2';

  // Determine subtitle styling based on props
  const subtitleStyle = heroStyle
    ? 'text-sm text-blue-200 mb-4'
    : 'text-sm text-gray-500 mb-4';

  return (
    <CardWrapper
      className={`${cardStyle} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      {...(withAnimation && {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-50px' },
        variants: cardVariants,
      })}
      {...(withAnimation && onClick && {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
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
        {title && <h3 className={titleStyle}>{title}</h3>}
        {subtitle && <p className={subtitleStyle}>{subtitle}</p>}
        {children}
      </div>
    </CardWrapper>
  );
};

export default ContentCard;
