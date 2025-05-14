import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MobileNavBarProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
  isLastStep: boolean;
}

export function MobileNavBar({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  canGoNext,
  isLastStep
}: MobileNavBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 md:hidden">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 1}
          className="w-24"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        
        <span className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
        
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="w-24"
        >
          {isLastStep ? "Submit" : "Next"}
          {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
} 