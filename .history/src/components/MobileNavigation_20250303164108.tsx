import React from 'react';

interface MobileNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentStep, onStepClick }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => onStepClick(Math.max(1, currentStep - 1))}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <span className="text-sm font-medium text-gray-500">
          Step {currentStep}
        </span>
        <button
          onClick={() => onStepClick(currentStep + 1)}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Next
        </button>
      </div>
    </nav>
  );
};