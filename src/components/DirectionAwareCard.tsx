import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface DirectionAwareCardProps {
  children: React.ReactNode;
}

const DirectionAwareCard: React.FC<DirectionAwareCardProps> = ({ children }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [hoverDirection, setHoverDirection] = useState('');

  const calculateDirection = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { width, height, top, left } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    const angle = Math.atan2(y, x);
    const direction = Math.round((angle * (180 / Math.PI) + 180) / 90) % 4;
    return ['top', 'right', 'bottom', 'left'][direction];
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const direction = calculateDirection(e) || '';
    setHoverDirection(direction);
  };

  const handleMouseLeave = () => {
    setHoverDirection('');
  };

  const variants = {
    initial: { scale: 1, rotateY: 0, rotateX: 0 },
    hover:{
      scale: 1.05,
      rotateY: hoverDirection === 'left' ? -5 : hoverDirection === 'right' ? 5 : 0,
      rotateX: hoverDirection === 'top' ? 5 : hoverDirection === 'bottom' ? -5 : 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      className="card"
      variants={variants}
      initial="initial"
      whileHover="hover"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
};

export default DirectionAwareCard;
