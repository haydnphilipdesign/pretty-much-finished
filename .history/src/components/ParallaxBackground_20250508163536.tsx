import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxBackgroundProps {
  imageUrl?: string;
  overlayOpacity?: number;
  scale?: number;
  speed?: number;
  blur?: number;
  disableParallax?: boolean;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  imageUrl = '/hero-bg.jpg',
  overlayOpacity = 0.5,
  scale = 1.1,
  speed = 0.3,
  blur = 0,
  disableParallax = false
}) => {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `${speed * 100}%`]
  );
  
  // If parallax is disabled, just use a static background
  if (disableParallax) {
    return (
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          filter: blur > 0 ? `blur(${blur}px)` : 'none'
        }}
      />
    );
  }
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          y: y,
          scale: scale,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: blur > 0 ? `blur(${blur}px)` : 'none'
        }}
      />
      
      {/* Optional animated overlay patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.03)_100%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.01] bg-[length:32px_32px]" />
      
      {/* Subtle animated dots */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <motion.div 
          className="w-3 h-3 rounded-full bg-white/50 absolute top-1/4 left-1/4"
          animate={{ 
            x: [0, 20, 0], 
            y: [0, 15, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div 
          className="w-2 h-2 rounded-full bg-white/50 absolute top-2/3 right-1/3"
          animate={{ 
            x: [0, -15, 0], 
            y: [0, 10, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="w-4 h-4 rounded-full bg-white/30 absolute bottom-1/4 right-1/4"
          animate={{ 
            x: [0, 25, 0], 
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 9, repeat: Infinity, delay: 2 }}
        />
      </div>
    </div>
  );
};

export default ParallaxBackground;