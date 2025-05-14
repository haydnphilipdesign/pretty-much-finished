import React, { useEffect } from 'react';

interface KeyboardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  disabled?: boolean;
}

export function KeyboardNavigation({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious,
  disabled = false
}: KeyboardNavigationProps) {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      
      // Check if we're not in an input, textarea, or select
      const activeElement = document.activeElement;
      const isInput = activeElement instanceof HTMLInputElement || 
                    activeElement instanceof HTMLTextAreaElement ||
                    activeElement instanceof HTMLSelectElement;
      
      if (isInput) return;
      
      // Handle keyboard navigation
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentStep < totalSteps) {
          e.preventDefault();
          onNext();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentStep > 1) {
          e.preventDefault();
          onPrevious();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStep, totalSteps, onNext, onPrevious, disabled]);
  
  // This is a non-rendering component that just adds keyboard handlers
  return null;
} 