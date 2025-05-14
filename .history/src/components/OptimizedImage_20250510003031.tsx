import React, { useState, useEffect, useRef } from 'react';
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
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Generate a tiny placeholder
  useEffect(() => {
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

  // Preload image when component mounts for priority images
  // or when it's about to enter viewport for non-priority images
  useEffect(() => {
    // For priority images, load immediately
    if (priority) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError(true);
      return;
    }

    // For non-priority images, set up intersection observer
    // with a margin to start loading before they enter viewport
    if (!observerRef.current && typeof IntersectionObserver !== 'undefined') {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          setIsIntersecting(entry.isIntersecting);
        },
        {
          // Start loading images when they're 200px away from entering viewport
          rootMargin: '200px',
          threshold: 0
        }
      );

      if (elementRef.current) {
        observerRef.current.observe(elementRef.current);
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, src, elementRef]);

  // Load image when it's about to enter viewport
  useEffect(() => {
    if (isIntersecting && !isLoaded && !priority) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError(true);
    }
  }, [isIntersecting, isLoaded, priority, src]);

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
      {/* Always show placeholder until the image is loaded */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${blurDataUrl})`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
            backgroundColor: '#f3f4f6' // Ensure there's a solid background
          }}
        />
      )}
      
      <motion.img
        ref={imgRef}
        src={isIntersecting || priority ? src : ''} // Only set src when in view or priority
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

      {/* Add a hidden preloader image for better control */}
      {(isIntersecting || priority) && !isLoaded && (
        <img 
          src={src} 
          alt=""
          aria-hidden="true" 
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
