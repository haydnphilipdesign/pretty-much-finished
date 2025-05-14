import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";

interface StepWizardProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  skippedFields?: { step: number, fields: string[] }[];
  onNext?: () => void;  // Optional callback for next step
  onPrevious?: () => void;  // Optional callback for previous step
}

// Enhanced step data with SVG icons for better visual impact
const steps = [
  { 
    id: 1, 
    title: "Role Selection", 
    shortTitle: "Role", 
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    )
  },
  { 
    id: 2, 
    title: "Property Information", 
    shortTitle: "Property", 
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    )
  },
  { 
    id: 3, 
    title: "Client Information", 
    shortTitle: "Client", 
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )
  },
  { 
    id: 4, 
    title: "Commission", 
    shortTitle: "Commission", 
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
    )
  },
  { 
    id: 5, 
    title: "Property & Title", 
    shortTitle: "Title", 
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    )
  },
  { 
    id: 6, 
    title: "Documents", 
    shortTitle: "Documents", 
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        <line x1="12" y1="11" x2="12" y2="17"></line>
        <line x1="9" y1="14" x2="15" y2="14"></line>
      </svg>
    )
  },
  { 
    id: 7, 
    title: "Additional Info", 
    shortTitle: "Info", 
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    )
  },
  { 
    id: 8, 
    title: "Review Transaction", 
    shortTitle: "Review", 
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    )
  },
  { 
    id: 9, 
    title: "Sign & Submit", 
    shortTitle: "Submit", 
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13"></path>
        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
      </svg>
    )
  },
];

export function StepWizard({ 
  currentStep, 
  totalSteps, 
  onStepClick, 
  skippedFields = [],
  onNext,
  onPrevious 
}: StepWizardProps) {
  const [screenSize, setScreenSize] = useState('large');
  const [showAllSteps, setShowAllSteps] = useState(false);
  const progress = (currentStep / totalSteps) * 100;

  // Swipe handlers for mobile navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => onNext && currentStep < totalSteps && onNext(),
    onSwipedRight: () => onPrevious && currentStep > 1 && onPrevious(),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 50,
  });

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

  // Check if a step has missing fields
  const hasMissingFields = (stepId: number) => {
    return skippedFields?.some(item => item.step === stepId && item.fields.length > 0) || false;
  };

  // Get display steps based on screen size and expanded state
  const getDisplaySteps = () => {
    if (showAllSteps) return steps;
    
    const currentStepIndex = currentStep - 1;
    
    if (screenSize === 'small') {
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
    }
    
    if (screenSize === 'medium') {
      // For medium screens (tablets), show all steps
      return steps;
    }
    
    // For large screens, show all steps
    return steps;
  };

  const displaySteps = getDisplaySteps();
  
  // Determine if we should show separator lines
  const shouldShowSeparator = (index: number, stepId: number, nextStepId: number) => {
    // If steps are consecutive, show normal separator
    if (nextStepId - stepId === 1) {
      return true;
    }
    
    // If steps are not consecutive, show ellipsis indicator
    return index < displaySteps.length - 1;
  };
  
  // Check if steps are consecutive
  const areStepsConsecutive = (currentId: number, nextId: number) => {
    return nextId - currentId === 1;
  };

  return (
    <div className="w-full px-1 py-2" {...swipeHandlers}>      
      <div className="relative flex items-center justify-center flex-nowrap overflow-x-auto hide-scrollbar">
        {screenSize === 'small' && displaySteps.length < steps.length && (
          <button 
            onClick={() => setShowAllSteps(!showAllSteps)}
            className="absolute -top-6 right-0 text-white text-xs underline opacity-70 hover:opacity-100"
          >
            {showAllSteps ? "Show fewer" : "Show all steps"}
          </button>
        )}
        
        {/* Progress bar under the steps */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-600 to-brand-blue"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Steps */}
        <div className="flex items-center space-x-1 px-1 min-w-full justify-between">
          {displaySteps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const hasIssues = hasMissingFields(step.id);
            const isClickable = !!onStepClick;
            
            // Determine if we should show a separator after this step
            const showSeparator = index < displaySteps.length - 1;
            const nextStep = displaySteps[index + 1];
            const isConsecutive = nextStep ? areStepsConsecutive(step.id, nextStep.id) : true;
            
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "flex flex-col items-center justify-center relative transition-all duration-300",
                    isClickable ? "cursor-pointer" : "cursor-default",
                    isActive ? "scale-110" : "hover:scale-105"
                  )}
                >
                  {/* Step circle */}
                  <div
                    className={cn(
                      "relative flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-brand-blue text-white shadow-md"
                        : isCompleted
                        ? "bg-brand-blue/20 text-brand-blue"
                        : "bg-gray-200 text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <span className="text-xs font-medium">{step.id}</span>
                    )}
                    
                    {/* Missing fields indicator */}
                    {hasIssues && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white">
                        <AlertTriangle className="w-1.5 h-1.5 text-white" />
                      </span>
                    )}
                  </div>
                  
                  {/* Step label - only show on medium+ screens */}
                  <span 
                    className={cn(
                      "text-[0.6rem] mt-0.5 font-medium hidden md:block whitespace-nowrap",
                      isActive 
                        ? "text-brand-blue" 
                        : isCompleted 
                        ? "text-gray-600" 
                        : "text-gray-400"
                    )}
                  >
                    {screenSize === 'large' ? step.shortTitle : step.shortTitle}
                  </span>
                </button>
                
                {/* Separator between steps */}
                {showSeparator && (
                  <div className="flex items-center">
                    {isConsecutive ? (
                      <div className={cn(
                        "h-[1px] w-3 md:w-4",
                        isCompleted && currentStep > nextStep.id 
                          ? "bg-brand-blue/20" 
                          : "bg-gray-200"
                      )} />
                    ) : (
                      <div className="flex items-center space-x-0.5">
                        <div className={cn(
                          "h-[1px] w-1.5 md:w-2",
                          isCompleted ? "bg-brand-blue/20" : "bg-gray-200"
                        )} />
                        <div className="flex space-x-[1px]">
                          <Circle className="w-0.5 h-0.5 text-gray-300" />
                          <Circle className="w-0.5 h-0.5 text-gray-300" />
                          <Circle className="w-0.5 h-0.5 text-gray-300" />
                        </div>
                        <div className={cn(
                          "h-[1px] w-1.5 md:w-2",
                          currentStep > nextStep.id ? "bg-brand-blue/20" : "bg-gray-200"
                        )} />
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Mobile navigation indicators - make more compact */}
      {screenSize === 'small' && (
        <div className="flex justify-center mt-1 space-x-1 text-xs">
          <button 
            onClick={() => onPrevious && currentStep > 1 && onPrevious()}
            disabled={currentStep === 1 || !onPrevious}
            className={cn(
              "p-0.5 rounded-full transition-colors",
              currentStep > 1 ? "text-brand-blue hover:bg-brand-blue/10" : "text-gray-300"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-xs text-gray-500 flex items-center">
            {currentStep}/{totalSteps}
          </div>
          <button 
            onClick={() => onNext && currentStep < totalSteps && onNext()}
            disabled={currentStep === totalSteps || !onNext}
            className={cn(
              "p-0.5 rounded-full transition-colors",
              currentStep < totalSteps ? "text-brand-blue hover:bg-brand-blue/10" : "text-gray-300"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
