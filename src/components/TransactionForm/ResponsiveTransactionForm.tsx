import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, ResponsiveWizardContainer } from './ResponsiveContainer';
import { StepWizard } from './StepWizard';
import { MobileNavBar } from './MobileNavBar';
import { useResponsive } from './useResponsive';

// Example steps for the transaction form
const TRANSACTION_STEPS = [
  { id: 1, label: 'Basics' },
  { id: 2, label: 'Property' },
  { id: 3, label: 'Client' },
  { id: 4, label: 'Documents' },
  { id: 5, label: 'Review' },
];

export function ResponsiveTransactionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  // Header content with responsive layout adjustments
  const headerContent = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size={isMobile ? "sm" : "icon"} 
          className="mr-2"
        >
          <ArrowLeft className={cn(
            isMobile ? "h-4 w-4" : "h-5 w-5"
          )} />
          {isMobile && <span className="ml-1.5">Back</span>}
        </Button>
        <h1 className={cn(
          "font-semibold",
          isMobile ? "text-base" : "text-lg"
        )}>
          New Transaction
        </h1>
      </div>
      
      {/* Desktop/Tablet buttons - hidden on mobile */}
      <div className="hidden md:flex space-x-2">
        <Button variant="outline" size={isTablet ? "sm" : "default"}>Save Draft</Button>
        <Button variant="default" size={isTablet ? "sm" : "default"}>Submit</Button>
      </div>
      
      {/* Mobile menu button - only visible on mobile */}
      {isMobile && (
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
  
  // Navigation functions
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleNext = () => {
    if (currentStep < TRANSACTION_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  return (
    <ResponsiveContainer headerContent={headerContent}>
      {/* Responsive Step Wizard */}
      <ResponsiveWizardContainer>
        <StepWizard 
          steps={TRANSACTION_STEPS} 
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
          size={isMobile ? "sm" : isTablet ? "md" : "lg"}
          variant={isMobile ? "dots" : "numbered"}
          verticalOnMobile={isMobile}
        />
      </ResponsiveWizardContainer>
      
      {/* Form content with responsive adjustments */}
      <div className={cn(
        "py-4",
        isMobile ? "px-2" : isTablet ? "px-4" : "px-6"
      )}>
        <div className="mb-4">
          <h2 className={cn(
            "font-semibold", 
            isMobile ? "text-lg" : "text-xl"
          )}>
            {TRANSACTION_STEPS[currentStep - 1].label}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Please complete all required fields below.
          </p>
        </div>
        
        {/* Form fields with responsive grid */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
          <div className="p-4 border border-gray-200 rounded-md">
            Example form field 1
          </div>
          <div className="p-4 border border-gray-200 rounded-md">
            Example form field 2
          </div>
          <div className={cn(
            "p-4 border border-gray-200 rounded-md",
            !isMobile && "col-span-2"
          )}>
            Example form field 3
          </div>
        </div>
        
        {/* Desktop navigation - hidden on mobile */}
        <div className="hidden md:flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            size={isTablet ? "sm" : "default"}
          >
            Previous
          </Button>
          
          <Button
            variant="default"
            onClick={handleNext}
            disabled={currentStep === TRANSACTION_STEPS.length}
            size={isTablet ? "sm" : "default"}
          >
            {currentStep === TRANSACTION_STEPS.length ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation - only appears on mobile */}
      <MobileNavBar
        currentStep={currentStep}
        totalSteps={TRANSACTION_STEPS.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isLastStep={currentStep === TRANSACTION_STEPS.length}
        onSave={() => console.log('Saving draft...')}
        className={!isMobile ? 'hidden' : undefined}
      />
    </ResponsiveContainer>
  );
}