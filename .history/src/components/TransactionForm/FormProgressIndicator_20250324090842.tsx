import React from 'react';
import { Check, X } from 'lucide-react';
import { validateStep } from "@/utils/validation";

interface FormProgressIndicatorProps {
  currentStep: number;
  formData: any;
  onStepClick: (step: number) => void;
  steps: Array<{id: number, label: string}>;
}

export function FormProgressIndicator({ 
  currentStep, 
  formData, 
  onStepClick,
  steps
}: FormProgressIndicatorProps) {
  
  // Calculate completion status for each step
  const stepStatus = React.useMemo(() => {
    return steps.map(step => {
      // Don't validate steps we haven't reached yet
      if (step.id > currentStep) return 'upcoming';
      
      // For now, mark current and previous steps as complete (validation to be added)
      return 'complete';
    });
  }, [currentStep, steps]);
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-white/10 rounded-lg">
      {steps.map((step, index) => (
        <div 
          key={step.id}
          className={`flex items-center cursor-pointer mb-2 md:mb-0 ${
            currentStep === step.id ? 'text-white font-semibold' : 
            stepStatus[index] === 'complete' ? 'text-green-300' : 'text-white/60'
          }`}
          onClick={() => onStepClick(step.id)}
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
            currentStep === step.id ? 'bg-blue-600' : 
            stepStatus[index] === 'complete' ? 'bg-green-600' : 
            stepStatus[index] === 'incomplete' ? 'bg-amber-600' : 'bg-gray-600'
          }`}>
            {stepStatus[index] === 'complete' && currentStep !== step.id ? (
              <Check size={16} />
            ) : (
              <span>{step.id}</span>
            )}
          </div>
          <span className="hidden md:inline">{step.label}</span>
          <span className="md:hidden">{index < steps.length - 1 && "→"}</span>
        </div>
      ))}
    </div>
  );
} 