import { useEffect } from 'react';

interface KeyboardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
}

export function KeyboardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious
}: KeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if no form inputs are focused
      const activeElement = document.activeElement;
      if (activeElement &&
        (activeElement.tagName === 'INPUT' ||
         activeElement.tagName === 'TEXTAREA' ||
         activeElement.tagName === 'SELECT' ||
         activeElement.getAttribute('contenteditable') === 'true')) {
        return;
      }

      // Arrow keys for navigation
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
    
    // Clean up event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStep, totalSteps, onNext, onPrevious]);

  // This is a non-visual component that just adds keyboard event handlers
  return null;
} 