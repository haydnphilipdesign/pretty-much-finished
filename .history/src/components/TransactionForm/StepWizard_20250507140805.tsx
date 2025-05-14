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
  { id: 7, title: "Additional Info", shortTitle: "Additional", icon: "ℹ️" },
  { id: 8, title: "Sign & Submit", shortTitle: "Submit", icon: "✅" },
];

export function StepWizard({ currentStep, totalSteps, onStepClick, skippedFields = [] }: StepWizardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(steps);
  const progress = (currentStep / totalSteps) * 100;

  // Calculate visible steps based on screen size
  useEffect(() => {
    const updateVisibleSteps = () => {
      const windowWidth = window.innerWidth;
      setIsMobile(windowWidth < 768);
      
      if (windowWidth < 480) {
        // Very small screens - show current, previous, next, first, and last
        setVisibleSteps(steps.filter(step => 
          Math.abs(step.id - currentStep) <= 1 || 
          step.id === 1 || 
          step.id === steps.length
        ));
      } else if (windowWidth < 768) {
        // Mobile - show more steps
        setVisibleSteps(steps.filter(step => 
          Math.abs(step.id - currentStep) <= 2 || 
          step.id === 1 || 
          step.id === steps.length
        ));
      } else {
        // Desktop - show all steps
        setVisibleSteps(steps);
      }
    };

    updateVisibleSteps();
    window.addEventListener('resize', updateVisibleSteps);
    
    return () => {
      window.removeEventListener('resize', updateVisibleSteps);
    };
  }, [currentStep]);

  // Check if a step has missing fields
  const hasMissingFields = (stepId: number) => {
    return skippedFields?.some(item => item.step === stepId && item.fields.length > 0) || false;
  };

  return (
    <div className="w-full px-2 pt-4 pb-2">      
      <div className="flex overflow-x-auto pb-4 hide-scrollbar justify-center">
        {visibleSteps
          .sort((a, b) => a.id - b.id)
          .map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isFirst = index === 0;
            const isLast = index === visibleSteps.length - 1;
            const stepHasMissingFields = hasMissingFields(step.id);
            
            return (
              <React.Fragment key={step.id}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onStepClick?.(step.id)}
                  className={cn(
                    "flex flex-col items-center cursor-pointer transition-all duration-300",
                    "px-3 md:px-4 py-2 rounded-lg mx-1 md:mx-2",
                    isActive && "bg-white text-blue-600 shadow-lg transform scale-105",
                    isCompleted && !stepHasMissingFields && "text-white hover:bg-white/20",
                    isCompleted && stepHasMissingFields && "text-amber-300 hover:bg-white/20",
                    !isActive && !isCompleted && "text-white/80 hover:bg-white/20",
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center rounded-full mb-2 relative",
                    "w-10 h-10 md:w-12 md:h-12 text-xl md:text-2xl",
                    isActive ? "bg-blue-600 text-white" : "",
                    isCompleted && !stepHasMissingFields ? "bg-green-500 text-white" : "",
                    isCompleted && stepHasMissingFields ? "bg-amber-500 text-white" : "",
                    !isActive && !isCompleted ? "bg-white/20 text-white" : ""
                  )}>
                    {isCompleted ? (
                      stepHasMissingFields ? (
                        <AlertTriangle className="w-6 h-6" />
                      ) : (
                        <CheckCircle className="w-6 h-6" />
                      )
                    ) : isActive ? (
                      <span className="font-bold">{step.id}</span>
                    ) : (
                      <span className="font-bold opacity-70">{step.id}</span>
                    )}
                  </div>
                  <span className={cn(
                    "text-sm md:text-base font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis w-full",
                    isActive && "font-bold"
                  )}>
                    {isMobile ? step.shortTitle : step.title}
                  </span>
                </motion.div>
                
                {!isLast && (
                  <div className="flex items-center self-center h-10">
                    <div className={cn(
                      "h-1 w-4 md:w-6 mt-5",
                      isCompleted && !hasMissingFields(step.id + 1) ? "bg-green-500" : 
                      isCompleted && hasMissingFields(step.id + 1) ? "bg-amber-500" : 
                      "bg-white/30"
                    )}></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
      </div>
      
      <div className="h-3 rounded-full overflow-hidden bg-white/20 mt-2">
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
      
      <div className="text-center text-white text-sm mt-2 font-medium">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}
