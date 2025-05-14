
import { cn } from "@/lib/utils";

interface StepWizardProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const steps = [
  { id: 1, title: "Role Selection" },
  { id: 2, title: "Property Information" },
  { id: 3, title: "Client Information" },
  { id: 4, title: "Commission" },
  { id: 5, title: "Property & Title" },
  { id: 6, title: "Warranty" },
  { id: 7, title: "Documents" },
  { id: 8, title: "Additional Info" },
  { id: 9, title: "Signature" },
];

export function StepWizard({ currentStep, totalSteps, onStepClick }: StepWizardProps) {
  // Calculate visible steps (previous, current, and next steps only)
  const getVisibleSteps = () => {
    // Only show previous, current, and next step
    return steps.filter(step => {
      return Math.abs(step.id - currentStep) <= 1;
    }).sort((a, b) => a.id - b.id);
  };

  const visibleSteps = getVisibleSteps();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full space-y-4 px-2 pt-4 pb-2">      
      <div className="flex overflow-x-auto pb-2 hide-scrollbar justify-center">
        {visibleSteps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isFirst = index === 0;
          const isLast = index === visibleSteps.length - 1;
          
          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              className={cn(
                "flex flex-col items-center min-w-0 transition-colors whitespace-nowrap px-4 py-1 rounded-lg",
                isActive && "text-white",
                isCompleted && "text-white/80",
                !isActive && !isCompleted && "text-white/60"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-7 h-7 rounded-full text-sm mb-1 transition-all",
                isActive ? "text-white" : "",
                isCompleted && "text-white/80",
                !isActive && !isCompleted && "text-white/70"
              )}>
                {step.id}
              </div>
              <span className={cn(
                "text-xs font-medium",
                isActive && "border-b border-white pb-1"
              )}>
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
      
      <div className="h-1 rounded-full overflow-hidden bg-white/10">
        <div 
          className="h-full border-b-2 border-white transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
