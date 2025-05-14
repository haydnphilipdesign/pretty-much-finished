
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  className?: string;
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  className = "",
}: FormNavigationProps) {
  return (
    <div className={`flex items-center justify-between mt-8 ${className}`}>
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white border-white/20 px-6 py-2 h-10 rounded-md transition-all shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>
      
      <Button
        onClick={onNext}
        disabled={currentStep === totalSteps}
        className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy px-6 py-2 h-10 rounded-md transition-all shadow-sm"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
