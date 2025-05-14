import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="mt-8 flex justify-between items-center">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="text-sm text-gray-500">
        Step {currentStep} of {totalSteps}
      </div>

      <Button
        onClick={onNext}
        className="flex items-center gap-2"
      >
        {currentStep === totalSteps ? 'Submit' : 'Next'}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};