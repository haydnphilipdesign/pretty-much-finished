import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

/**
 * Simple loading spinner with configurable size and color
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md:'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3'
  };
  
  const colorClasses = {
    primary: 'border-blue-500 border-t-transparent',
    secondary: 'border-amber-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent'
  };
  
  return (
    <div className={`inline-block ${className}`} role="status" aria-label="Loading">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1,
          repeat: Infinity, 
          ease: "linear" 
        }}
        className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface LoadingScreenProps {
  message?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
  spinnerColor?: 'primary' | 'secondary' | 'white' | 'gray';
  fullScreen?: boolean;
  transparent?: boolean;
  className?: string;
}

/**
 * Full screen or container loading overlay
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  spinnerSize = 'lg',
  spinnerColor = 'primary',
  fullScreen = false,
  transparent = false,
  className = ''
}) => {
  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50' 
    : 'absolute inset-0 z-10';
  
  const bgClasses = transparent
    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
    : 'bg-white dark:bg-gray-900';
  
  return (
    <div className={`${containerClasses} ${bgClasses} flex flex-col items-center justify-center ${className}`}>
      <LoadingSpinner size={spinnerSize} color={spinnerColor} />
      {message && (
        <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium text-center max-w-xs">
          {message}
        </p>
      )}
    </div>
  );
};

interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  animate?: boolean;
}

/**
 * Skeleton loading placeholder
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className = '',
  animate = true
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md:'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };
  
  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 ${animate ? 'animate-pulse' : ''} ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading"
    />
  );
};

interface CardSkeletonProps {
  lines?: number;
  hasTitle?: boolean;
  hasImage?: boolean;
  hasAction?: boolean;
  className?: string;
}

/**
 * Skeleton for a card with configurable content
 */
export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  lines = 3,
  hasTitle = true,
  hasImage = false,
  hasAction = false,
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow ${className}`}>
      {hasImage && (
        <LoadingSkeleton 
          height="12rem" 
          rounded="md" 
          className="mb-4" 
        />
      )}
      
      {hasTitle && (
        <LoadingSkeleton 
          height="1.75rem" 
          width="70%" 
          className="mb-4" 
        />
      )}
      
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <LoadingSkeleton 
            key={i}
            height="1rem"
            width={`${Math.random() * 40 + 60}%`}
          />
        ))}
      </div>
      
      {hasAction && (
        <div className="mt-6 flex justify-end">
          <LoadingSkeleton 
            height="2.5rem"
            width="8rem"
            rounded="md"
          />
        </div>
      )}
    </div>
  );
};

interface TextSkeletonProps {
  lines?: number;
  width?: number | string;
  lineHeight?: string;
  className?: string;
}

/**
 * Skeleton for paragraph text
 */
export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 4,
  width = '100%',
  lineHeight = '1rem',
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton 
          key={i}
          height={lineHeight}
          width={typeof width === 'number' 
            ? `${Math.random() * (100 - width) + width}%` 
            : width
          }
        />
      ))}
    </div>
  );
};

/**
 * Create loading placeholders in a table layout
 */
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  className?: string;
}> = ({
  rows = 5,
  columns = 4,
  hasHeader = true,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {hasHeader && (
            <div className="bg-gray-100 dark:bg-gray-800">
              <div className="grid grid-cols-12 gap-2 px-4 py-3">
                {Array.from({ length: columns }).map((_, i) => (
                  <div 
                    key={`header-${i}`}
                    className={`col-span-${Math.floor(12 / columns)}`}
                  >
                    <LoadingSkeleton 
                      height="1.25rem"
                      width="80%"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div 
                key={`row-${rowIndex}`}
                className="grid grid-cols-12 gap-2 px-4 py-4"
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div 
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`col-span-${Math.floor(12 / columns)}`}
                  >
                    <LoadingSkeleton 
                      height="1rem"
                      width={`${Math.random() * 50 + 50}%`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Shimmer effect that can be applied to any content
 */
export const ShimmerEffect: React.FC<{
  children: React.ReactNode;
  width?: string;
  height?: string;
  className?: string;
}> = ({
  children,
  width = 'auto',
  height = 'auto',
  className = ''
}) => {
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {children}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};
