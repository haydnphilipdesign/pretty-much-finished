import React from 'react';
import { motion } from 'framer-motion';

interface HeroBadgeProps {
  children: React.ReactNode;
  className?: string;
  withDot?: boolean;
  dotColor?: string;
  withAnimation?: boolean;
}

/**
 * HeroBadge - A reusable badge component with consistent styling
 * that matches the aesthetic of the hero badges
 */
const HeroBadge: React.FC<HeroBadgeProps> = ({
  children,
  className = '',
  withDot = true,
  dotColor = 'bg-blue-400',
  withAnimation = true,
}) => {
  // Animation variants
  const badgeVariants = {
    hidden: { opacity: 0, y: -20 },
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
  const BadgeWrapper = withAnimation ? motion.div : 'div';

  return (
    <BadgeWrapper
      className={`hero-badge ${className}`}
      {...(withAnimation && {
        initial: 'hidden',
        animate: 'visible',
        variants: badgeVariants,
      })}
    >
      {withDot && <span className={`flex h-2 w-2 rounded-full ${dotColor} mr-2`}></span>}
      {children}
    </BadgeWrapper>
  );
};

export default HeroBadge;
