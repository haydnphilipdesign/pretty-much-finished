import React, { useState } from 'react';
import { PageContainer, WizardContainer, FormSection } from './PageContainer';
import { MobileNavBar } from './MobileNavBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// This is a placeholder for the StepWizard component that will be created in the next task
interface StepWizardProps {
  steps: Array<{ id: number; label: string }>;
  currentStep: number;
  onStepClick: (step: number) => void;
}

function StepWizard({ steps, currentStep, onStepClick }: StepWizardProps) {
  // Placeholder until we implement the actual component
  return (
    <div className="flex justify-between">
      {steps.map(step => (
        <button 
          key={step.id}
          onClick={() => onStepClick(step.id)}
          className={`px-3 py-2 ${currentStep === step.id ? 'font-bold text-blue-600' : 'text-gray-500'}`}
        >
          {step.label}
        </button>
      ))}
    </div>
  );
}

export function TransactionFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // Example steps for demonstration
  const steps = [
    { id: 1, label: 'Basics' },
    { id: 2, label: 'Property' },
    { id: 3, label: 'Client' },
    { id: 4, label: 'Documents' },
    { id: 5, label: 'Review' },
  ];
  
  // Header content with back button and title
  const headerContent = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">New Transaction</h1>
      </div>
      <div className="hidden md:flex space-x-2">
        <Button variant="outline" size="sm">Save Draft</Button>
        <Button variant="default" size="sm">Submit</Button>
      </div>
    </div>
  );
  
  // Navigation functions
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  return (
    <PageContainer headerContent={headerContent}>
      {/* Step Wizard integrated with the page container */}
      <WizardContainer>
        <StepWizard 
          steps={steps} 
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
        />
      </WizardContainer>
      
      {/* Form content */}
      <div className="py-4 px-2 md:px-6">
        {/* Step content would go here */}
        <FormSection 
          title={`Step ${currentStep}: ${steps[currentStep - 1].label}`}
          description="Please complete all required fields below."
          seamless
        >
          {/* Form fields would go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-md">
              Example form field 1
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              Example form field 2
            </div>
            <div className="p-4 border border-gray-200 rounded-md md:col-span-2">
              Example form field 3
            </div>
          </div>
        </FormSection>
        
        {/* Desktop navigation - hidden on mobile */}
        <div className="hidden md:flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            variant="default"
            onClick={handleNext}
            disabled={currentStep === totalSteps}
          >
            {currentStep === totalSteps ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation bar - integrated with page container */}
      <MobileNavBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isLastStep={currentStep === totalSteps}
        onSave={() => console.log('Saving draft...')}
      />
    </PageContainer>
  );
}