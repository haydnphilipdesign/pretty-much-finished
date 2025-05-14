import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOptimizedAnimation } from '../hooks/useOptimizedAnimation';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  objectFit = 'cover'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { elementRef, animate } = useOptimizedAnimation({ 
    intensity: 1, 
    duration: 0.3, 
    shouldAnimate: true 
  });
  const [blurDataUrl, setBlurDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate a tiny placeholder
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 10;
    canvas.height = 10;
    if (ctx) {
      ctx.fillStyle = '#f3f4f6'; // Light gray
      ctx.fillRect(0, 0, 10, 10);
      setBlurDataUrl(canvas.toDataURL());
    }
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1, filter: 'blur(20px)' },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: 'blur(0px)',
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400">Failed to load image</span>
      </div>
    );
  }

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {!priority && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${blurDataUrl})`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
        />
      )}
      
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        variants={imageVariants}
        initial="hidden"
        animate={isLoaded && animate ? "visible" : "hidden"}
        className={`w-full h-full transform-gpu ${
          objectFit === 'contain' ? 'object-contain' :
          objectFit === 'cover' ? 'object-cover' :
          objectFit === 'fill' ? 'object-fill' :
          objectFit === 'none' ? 'object-none' :
          'object-scale-down'
        }`}
      />
    </div>
  );
};

export default OptimizedImage;
