import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Circle } from "lucide-react";

interface StepWizardProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  skippedFields?: { step: number, fields: string[] }[];
}

const steps = [
  { id: 1, title: "Role Selection", shortTitle: "Role", icon: "👤" },
  { id: 2, title: "Property Information", shortTitle: "Property", icon: "🏠" },
  { id: 3, title: "Client Information", shortTitle: "Client", icon: "👥" },
  { id: 4, title: "Commission", shortTitle: "Commission", icon: "💰" },
  { id: 5, title: "Property & Title", shortTitle: "Title", icon: "📄" },
  { id: 6, title: "Documents", shortTitle: "Documents", icon: "📋" },
  { id: 7, title: "Additional Info", shortTitle: "Info", icon: "ℹ️" },
  { id: 8, title: "Sign & Submit", shortTitle: "Submit", icon: "✅" },
];

export function StepWizard({ currentStep, totalSteps, onStepClick, skippedFields = [] }: StepWizardProps) {
  const [screenSize, setScreenSize] = useState('large');
  const progress = (currentStep / totalSteps) * 100;

  // Calculate screen size
  useEffect(() => {
    const updateScreenSize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 640) {
        setScreenSize('small');
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

  // Check if a step has missing fields
  const hasMissingFields = (stepId: number) => {
    return skippedFields?.some(item => item.step === stepId && item.fields.length > 0) || false;
  };

  // Get display steps based on screen size
  const getDisplaySteps = () => {
    const currentStepIndex = currentStep - 1;
    
    if (screenSize === 'small') {
      // For small screens (mobile), show current + previous + next + first/last if different
      const displayIndexes = [Math.max(0, currentStepIndex - 1), currentStepIndex, Math.min(steps.length - 1, currentStepIndex + 1)];
      
      // Always add the first and last step if they're not already included
      if (!displayIndexes.includes(0)) displayIndexes.unshift(0);
      if (!displayIndexes.includes(steps.length - 1)) displayIndexes.push(steps.length - 1);
      
      // Remove duplicates and sort
      return [...new Set(displayIndexes)].sort((a, b) => a - b).map(index => steps[index]);
    }
    
    if (screenSize === 'medium') {
      // For medium screens (tablets), show more steps
      return steps;
    }
    
    // For large screens, show all steps
    return steps;
  };

  const displaySteps = getDisplaySteps();
  
  // Determine if we should show separator lines
  const shouldShowSeparator = (index: number) => {
    return index < displaySteps.length - 1;
  };

  return (
    <div className="w-full px-1 py-3">      
      <div className="flex items-center justify-center">
        {displaySteps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const stepHasMissingFields = hasMissingFields(step.id);
          
          return (
            <React.Fragment key={step.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStepClick?.(step.id)}
                className={cn(
                  "flex flex-col items-center cursor-pointer transition-all duration-300",
                  "px-1.5 sm:px-2 md:px-3 py-1.5 rounded-lg",
                  isActive && "bg-white text-blue-600 shadow-lg transform scale-105",
                  isCompleted && !stepHasMissingFields && "text-white hover:bg-white/20",
                  isCompleted && stepHasMissingFields && "text-amber-300 hover:bg-white/20",
                  !isActive && !isCompleted && "text-white/80 hover:bg-white/20",
                )}
                style={{ flex: screenSize === 'small' ? '0 0 auto' : '1 1 0' }}
              >
                <div className={cn(
                  "flex items-center justify-center rounded-full mb-1 relative",
                  "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-lg sm:text-xl md:text-2xl",
                  isActive ? "bg-blue-600 text-white" : "",
                  isCompleted && !stepHasMissingFields ? "bg-green-500 text-white" : "",
                  isCompleted && stepHasMissingFields ? "bg-amber-500 text-white" : "",
                  !isActive && !isCompleted ? "bg-white/20 text-white" : ""
                )}>
                  {isCompleted ? (
                    stepHasMissingFields ? (
                      <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    )
                  ) : isActive ? (
                    <span className="font-bold">{step.id}</span>
                  ) : (
                    <span className="font-bold opacity-70">{step.id}</span>
                  )}
                </div>
                <span className={cn(
                  "text-xs sm:text-sm font-medium text-center w-full",
                  "max-w-[70px] sm:max-w-none overflow-hidden text-ellipsis",
                  isActive && "font-bold"
                )}>
                  {screenSize === 'small' ? step.shortTitle : 
                   screenSize === 'medium' ? step.shortTitle : step.title}
                </span>
              </motion.div>
              
              {shouldShowSeparator(index) && (
                <div 
                  className={cn(
                    "h-px w-3 sm:w-4 md:w-6 mx-0.5 sm:mx-1",
                    "self-center mt-0 flex-shrink-1",
                    isCompleted && !hasMissingFields(displaySteps[index + 1].id) ? "bg-green-500" : 
                    isCompleted && hasMissingFields(displaySteps[index + 1].id) ? "bg-amber-500" : 
                    "bg-white/30"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="h-3 rounded-full overflow-hidden bg-white/20 mt-3 mx-3">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={cn(
            "h-full rounded-full",
            skippedFields && skippedFields.length > 0 
              ? "bg-gradient-to-r from-blue-500 via-amber-500 to-green-500" 
              : "bg-gradient-to-r from-blue-500 to-green-500"
          )}
        />
      </div>
      
      <div className="text-center text-white text-sm mt-1 font-medium">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}
