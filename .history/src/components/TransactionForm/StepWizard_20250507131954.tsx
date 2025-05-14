import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

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
  { id: 4, title: "Commission Information", shortTitle: "Commission", icon: "💰" },
  { id: 5, title: "Property & Title Information", shortTitle: "Title", icon: "📄" },
  { id: 6, title: "Required Documents", shortTitle: "Documents", icon: "📋" },
  { id: 7, title: "Additional Information", shortTitle: "Additional", icon: "ℹ️" },
  { id: 8, title: "Sign & Submit", shortTitle: "Submit", icon: "✅" },
];

export function StepWizard({ currentStep, totalSteps, onStepClick, skippedFields = [] }: StepWizardProps) {
  // Calculate visible steps based on screen size and current position
  const getVisibleSteps = () => {
    // On mobile, show fewer steps
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 480;
    
    if (isSmallMobile) {
      // On very small screens, only show current step, first and last
      return steps.filter(step => {
        return step.id === currentStep || step.id === 1 || step.id === steps.length;
      });
    } else if (isMobile) {
      // On regular mobile just show current step, previous and next
      return steps.filter(step => {
        return Math.abs(step.id - currentStep) <= 1 || step.id === 1 || step.id === steps.length;
      });
    } else {
      // On desktop show more steps
      return steps.filter(step => {
        return Math.abs(step.id - currentStep) <= 2 || step.id === 1 || step.id === steps.length;
      });
    }
  };

  const [visibleSteps, setVisibleSteps] = React.useState(getVisibleSteps());
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const progress = (currentStep / totalSteps) * 100;

  // Update visible steps when window resizes or current step changes
  React.useEffect(() => {
    const handleResize = () => {
      setVisibleSteps(getVisibleSteps());
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    setVisibleSteps(getVisibleSteps());
    setIsMobile(window.innerWidth < 768);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentStep]);

  // Check if a step has missing fields
  const hasMissingFields = (stepId: number) => {
    return skippedFields.some(item => item.step === stepId && item.fields.length > 0);
  };

  return (
    <div className="w-full space-y-4 px-2 pt-4 pb-2">      
      <div className="flex overflow-x-auto pb-2 hide-scrollbar justify-center">
        {visibleSteps.sort((a, b) => a.id - b.id).map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isFirst = index === 0;
          const isLast = index === visibleSteps.length - 1;
          const stepHasMissingFields = hasMissingFields(step.id);
          
          return (
            <React.Fragment key={step.id}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStepClick?.(step.id)}
                className={cn(
                  "flex flex-col items-center min-w-0 transition-all duration-300",
                  "px-2 md:px-3 py-1 md:py-2 rounded-lg mx-0.5 md:mx-1",
                  isActive && "bg-white/20 text-white shadow-lg",
                  isCompleted && "text-white/90 hover:bg-white/10",
                  !isActive && !isCompleted && "text-white/60 hover:bg-white/10",
                  stepHasMissingFields && "ring-1 ring-amber-500"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center rounded-full text-sm mb-1 transition-all relative",
                  "w-7 h-7 md:w-8 md:h-8",
                  isActive ? "bg-white text-blue-600 shadow-md" : "",
                  isCompleted && !stepHasMissingFields && "bg-green-500/80 text-white",
                  isCompleted && stepHasMissingFields && "bg-amber-500/80 text-white",
                  !isActive && !isCompleted && "bg-white/20 text-white/70"
                )}>
                  {isCompleted ? (
                    stepHasMissingFields ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      "✓"
                    )
                  ) : (
                    step.icon
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[70px] md:max-w-[120px]",
                  isActive && "border-b border-white pb-1",
                  stepHasMissingFields && "text-amber-300"
                )}>
                  {isMobile ? step.shortTitle : step.title}
                </span>
              </motion.button>
              
              {!isLast && (
                <div className="flex items-center">
                  <div className={cn(
                    "h-0.5 w-2 md:w-4",
                    isCompleted && !hasMissingFields(step.id + 1) ? "bg-green-500/80" : 
                    isCompleted && hasMissingFields(step.id + 1) ? "bg-amber-500/80" : 
                    "bg-white/20"
                  )}></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="h-2 rounded-full overflow-hidden bg-white/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
        />
      </div>
      
      <div className="text-center text-white/70 text-xs">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}
