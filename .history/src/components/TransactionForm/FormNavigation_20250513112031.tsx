import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Send, AlertTriangle } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onReset?: () => void;
  isSubmitting?: boolean;
  canSubmit?: boolean;
  onStepClick?: (step: number) => void;
  skippedFieldsByStep?: { step: number, fields: string[] }[];
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  onReset,
  isSubmitting = false,
  canSubmit = false,
  onStepClick,
  skippedFieldsByStep = []
}: FormNavigationProps) {
  // Generate steps array
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  // Check if a step has missing fields
  const stepHasMissingFields = (step: number) => {
    return skippedFieldsByStep?.some(item => item.step === step && item.fields.length > 0);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Step indicators */}
      <div className="flex justify-between w-full mb-2">
        {steps.map((step) => (
          <div 
            key={step}
            className="flex flex-col items-center"
          >
            <button
              onClick={() => onStepClick?.(step)}
              disabled={!onStepClick}
              className={`
                relative flex items-center justify-center 
                w-8 h-8 md:w-10 md:h-10 rounded-full 
                text-sm md:text-base font-medium transition-all
                ${currentStep === step
                  ? "bg-gradient-to-r from-blue-600 to-brand-blue text-white" 
                  : currentStep > step
                  ? "bg-blue-200 text-blue-800"
                  : "bg-gray-200 text-gray-500"}
                ${onStepClick ? "cursor-pointer hover:ring-2 hover:ring-blue-300/50" : "cursor-default"}
              `}
            >
              {step}
              
              {/* Missing fields indicator */}
              {stepHasMissingFields(step) && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[9px] items-center justify-center">
                    <AlertTriangle className="h-2.5 w-2.5" />
                  </span>
                </span>
              )}
            </button>
            
            {/* Show connection line between steps */}
            {step < totalSteps && (
              <div 
                className={`hidden md:block h-0.5 w-full mt-5 ${
                  currentStep > step ? "bg-blue-200" : "bg-gray-200"
                }`}
                style={{ 
                  width: '100%',
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '20px'
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between w-full mt-2">
        {/* Back button - only show when not on first step */}
        <Button
          variant="outline"
          className={`${currentStep === 1 ? 'opacity-0' : 'opacity-100'} transition-opacity`}
          onClick={onPrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {/* Center area - optional reset button */}
        <div>
          {onReset && (
            <Button
              variant="ghost"
              onClick={onReset}
              className="text-gray-500 hover:text-gray-700"
              type="button"
            >
              Reset
            </Button>
          )}
        </div>
        
        {/* Next/Submit button */}
        {currentStep < totalSteps ? (
          <Button onClick={onNext} className="bg-gradient-to-r from-blue-600 to-brand-blue hover:shadow-md text-white">
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting || !canSubmit}
            className="bg-gradient-to-r from-blue-600 to-brand-blue hover:shadow-md text-white"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
