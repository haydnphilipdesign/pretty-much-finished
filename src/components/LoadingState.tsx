import React, { memo } from 'react';

interface LoadingStateProps {
  rows?: number;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = memo(function LoadingState({ 
  rows = 5,  // Default value
  className = '' 
}) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${className}`}>
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 rounded animate-pulse"
            style={{
              width: `${Math.random() * (100 - 60) + 60}%`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    </div>
  );
});

export default LoadingState;
