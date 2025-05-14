import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, RotateCcw } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => Promise<void>;
  onReset: () => void;
  className?: string;
  isSubmitting?: boolean;
  canSubmit?: boolean;
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  className = "",
  isSubmitting = false,
  canSubmit = true
}: FormNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
      onReset();
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;
    await onSubmit();
  };

  return (
    <div className={`flex items-center justify-between mt-8 ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20 px-6 py-2 h-10 rounded-md transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 border-red-500/30 px-4 py-2 h-10 rounded-md transition-all shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>
      
      {isLastStep ? (
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !canSubmit}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 h-10 rounded-md transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={onNext}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20 px-6 py-2 h-10 rounded-md transition-all shadow-sm"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
