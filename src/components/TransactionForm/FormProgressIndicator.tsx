import React, { useState, useEffect } from 'react';
import { Check, X, ChevronRight, AlertTriangle } from 'lucide-react';
import { validateStep } from "@/utils/validation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FormProgressIndicatorProps {
  currentStep: number;
  formData: any;
  onStepClick: (step: number) => void;
  steps: Array<{id: number, label: string, icon?: string}>;
  missingFields?: { step: number, fields: string[] }[];
}

export function FormProgressIndicator({ 
  currentStep, 
  formData, 
  onStepClick,
  steps,
  missingFields = []
}: FormProgressIndicatorProps) {
  const [screenSize, setScreenSize] = useState('large');
  const [showAllSteps, setShowAllSteps] = useState(false);
  
  // Calculate screen size
  useEffect(() => {
    const updateScreenSize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 640) {
        setScreenSize('small');
        setShowAllSteps(false); // Reset expanded view on small screens
      } else if (windowWidth < 1024) {
        setScreenSize('medium');
      } else {
        setScreenSize('large');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);
  
  // Get display steps based on screen size and expanded state
  const getDisplaySteps = () => {
    if (showAllSteps || screenSize !== 'small') return steps;
    
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    
    // For small screens (mobile), show current + previous + next if available
    const displayIndexes = [];
    
    // Add previous step if available
    if (currentStepIndex > 0) {
      displayIndexes.push(currentStepIndex - 1);
    }
    
    // Add current step
    displayIndexes.push(currentStepIndex);
    
    // Add next step if available
    if (currentStepIndex < steps.length - 1) {
      displayIndexes.push(currentStepIndex + 1);
    }
    
    // Always add the first step if not already included
    if (currentStepIndex > 1 && !displayIndexes.includes(0)) {
      displayIndexes.unshift(0);
    }
    
    // Always add the last step if not already included and not too close
    if (currentStepIndex < steps.length - 2 && !displayIndexes.includes(steps.length - 1)) {
      displayIndexes.push(steps.length - 1);
    }
    
    // Remove duplicates and sort
    return [...new Set(displayIndexes)].sort((a, b) => a - b).map(index => steps[index]);
  };
  
  const displaySteps = getDisplaySteps();
  
  // Calculate completion status for each step
  const getStepStatus = (stepId: number) => {
    // Don't validate steps we haven't reached yet
    if (stepId > currentStep) return 'upcoming';
    
    // Check if this step has missing fields
    const hasMissingFields = missingFields.some(item => 
      item.step === stepId && item.fields.length > 0
    );
    
    if (hasMissingFields) return 'incomplete';
    
    // Mark steps as complete
    return 'complete';
  };
  
  // Determine if steps are consecutive
  const areStepsConsecutive = (currentIndex: number, nextIndex: number) => {
    return steps[nextIndex]?.id - steps[currentIndex]?.id === 1;
  };
  
  return (
    <div className="relative w-full mb-6 p-3 md:p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-lg shadow-inner overflow-hidden">
      {screenSize === 'small' && displaySteps.length < steps.length && (
        <button 
          onClick={() => setShowAllSteps(!showAllSteps)}
          className="absolute top-1 right-2 text-white/70 text-xs underline hover:text-white/90"
        >
          {showAllSteps ? "Show fewer" : "Show all steps"}
        </button>
      )}
      
      <div className="flex flex-wrap md:flex-nowrap justify-start md:justify-between items-center gap-y-2 md:gap-y-0 px-1">
        {displaySteps.map((step, index) => {
          const stepIndex = steps.findIndex(s => s.id === step.id);
          const status = getStepStatus(step.id);
          const isActive = currentStep === step.id;
          const nextStepIndex = displaySteps[index + 1] ? steps.findIndex(s => s.id === displaySteps[index + 1].id) : -1;
          const stepsAreConsecutive = nextStepIndex !== -1 ? areStepsConsecutive(stepIndex, nextStepIndex) : true;
          
          return (
            <React.Fragment key={step.id}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center cursor-pointer transition-all",
                  "px-2 py-1 rounded-md",
                  isActive && "bg-blue-800/40",
                  screenSize === 'small' && "mb-1"
                )}
                onClick={() => onStepClick(step.id)}
              >
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full mr-2",
                  isActive ? "bg-blue-600 text-white" : 
                  status === 'complete' ? "bg-green-600 text-white" : 
                  status === 'incomplete' ? "bg-amber-500 text-white" : 
                  "bg-white/20 text-white/70"
                )}>
                  {status === 'complete' && !isActive ? (
                    <Check size={16} />
                  ) : status === 'incomplete' ? (
                    <AlertTriangle size={16} />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                
                <span className={cn(
                  "text-sm whitespace-nowrap",
                  isActive ? "text-white font-semibold" : 
                  status === 'complete' ? "text-green-300" : 
                  status === 'incomplete' ? "text-amber-300" :
                  "text-white/60",
                  screenSize === 'small' && step.label.length > 10 && "hidden",
                  screenSize === 'small' && "text-xs"
                )}>
                  {screenSize === 'small' && step.label.length > 10 
                    ? step.label.substring(0, 10) + "..." 
                    : step.label}
                </span>
              </motion.div>
              
              {index < displaySteps.length - 1 && (
                <>
                  {stepsAreConsecutive ? (
                    <div className={cn(
                      "w-4 mx-0.5 h-px sm:w-6 sm:h-0.5",
                      status === 'complete' && getStepStatus(displaySteps[index + 1].id) !== 'upcoming'
                        ? "bg-green-500" 
                        : status === 'incomplete' 
                        ? "bg-amber-500"
                        : "bg-white/20"
                    )} />
                  ) : (
                    <div className="flex items-center self-center mx-1 sm:mx-2">
                      <span className="text-white/40 text-xs">•••</span>
                    </div>
                  )}
                </>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Mobile progress indicator */}
      <div className="sm:hidden mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          className={cn(
            "h-full rounded-full",
            missingFields.length > 0 
              ? "bg-gradient-to-r from-blue-500 via-amber-400 to-green-500" 
              : "bg-gradient-to-r from-blue-500 to-green-500"
          )}
        />
      </div>
    </div>
  );
}