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
  const isLastStep = currentStep === totalSteps;
  
  // Check if a specific step has missing fields
  const stepHasMissingFields = (step: number) => {
    return skippedFieldsByStep.some(item => 
      item.step === step && item.fields.length > 0
    );
  };
  
  // Count total missing fields
  const totalMissingFields = skippedFieldsByStep.reduce(
    (count, item) => count + item.fields.length, 0
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 py-4 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* Step Progress */}
            <div className="hidden md:flex items-center space-x-1">
              {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isComplete = currentStep > stepNumber;
                const hasMissingFields = stepHasMissingFields(stepNumber);
                
                return (
                  <button
                    key={`step-${stepNumber}`}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : isComplete && !hasMissingFields
                        ? "bg-green-500 text-white"
                        : isComplete && hasMissingFields
                        ? "bg-amber-500 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                    onClick={() => onStepClick && onStepClick(stepNumber)}
                  >
                    {isComplete ? (
                      hasMissingFields ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        "✓"
                      )
                    ) : (
                      stepNumber
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={currentStep === 1 || isSubmitting}
              className="text-white border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline-block">Previous</span>
            </Button>
            
            {onReset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-slate-400 hover:text-slate-300"
                disabled={isSubmitting}
              >
                Reset
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Show missing fields indicator if any exist */}
            {totalMissingFields > 0 && (
              <div className="hidden md:flex items-center bg-amber-500/20 px-3 py-1 rounded-full text-amber-300 text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                <span>{totalMissingFields} required {totalMissingFields === 1 ? 'field' : 'fields'} missing</span>
              </div>
            )}
            
            {isLastStep ? (
              <Button
                size="sm"
                onClick={onSubmit}
                disabled={isSubmitting || !canSubmit}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-1"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-1" />
                    Submit
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={onNext}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <span className="mr-1">Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
