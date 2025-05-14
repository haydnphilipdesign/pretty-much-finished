import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useOptimizedAnimation } from '../hooks/useOptimizedAnimation';
import OptimizedImage from './OptimizedImage';

interface ParallaxBackgroundProps {
  imageUrl?: string;
  videoUrl?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  scale?: number;
  speed?: number;
  blur?: number;
  className?: string;
  fallbackColor?: string;
  disableParallax?: boolean;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  imageUrl = '/background.jpg',
  videoUrl,
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  overlayOpacity = 0.5,
  scale = 1.2,
  speed = 0.5,
  blur = 0,
  className = '',
  fallbackColor = '#1a1a1a',
  disableParallax = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { animate } = useOptimizedAnimation({ 
    intensity: 1, 
    duration: 0.3, 
    shouldAnimate: true 
  });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const handleLoadSuccess = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleLoadError = useCallback(() => {
    setHasError(true);
    console.error('Failed to load background media:', videoUrl || imageUrl);
  }, [videoUrl, imageUrl]);

  const adjustedSpeed = speed * 0.5; // Default intensity
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], ['0%', `${adjustedSpeed * 100}%`]),
    springConfig
  );

  const backgroundStyle = {
    filter: `blur(${blur}px)`,
    transform: disableParallax ? undefined : `scale(${scale})`,
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ backgroundColor: fallbackColor }}
    >
      {!hasError ? (
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ ...backgroundStyle, y: disableParallax ? 0 : y }}
        >
          {videoUrl ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full"
              onLoadedData={handleLoadSuccess}
              onError={handleLoadError}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : (
            <OptimizedImage
              src={imageUrl}
              alt="Background"
              className="object-cover w-full h-full"
              priority={true}
            />
          )}
        </motion.div>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-800 to-gray-900" />
      )}
      
      {/* Overlay */}
      {overlayColor !== 'none' && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}
    </div>
  );
};

export default React.memo(ParallaxBackground);