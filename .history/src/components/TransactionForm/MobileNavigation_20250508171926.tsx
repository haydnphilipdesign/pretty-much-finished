import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MobileNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext?: boolean;
  isLastStep?: boolean;
  hasMissingFields?: boolean;
  onSave?: () => void;
  className?: string;
}

export function MobileNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  canGoNext = true,
  isLastStep = false,
  hasMissingFields = false,
  onSave,
  className,
}: MobileNavigationProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 shadow-lg",
        hasMissingFields && "border-t-amber-400",
        className
      )}
    >
      {/* Progress bar */}
      <div className="h-1 absolute top-0 left-0 w-full bg-gray-100 -translate-y-1">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className={cn(
            "h-full",
            hasMissingFields
              ? "bg-gradient-to-r from-brand-gold via-amber-400 to-brand-blue"
              : "bg-gradient-to-r from-brand-gold to-brand-blue"
          )}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={currentStep === 1}
          className={cn(
            "flex items-center px-3 h-10 rounded-full",
            "border-gray-200 text-gray-700 hover:text-brand-blue hover:border-brand-gold/20 hover:bg-brand-blue/5"
          )}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Previous
        </Button>
        
        {onSave && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="px-3 h-10 rounded-full border-brand-gold/20 bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save
          </Button>
        )}
        
        <Button
          variant={isLastStep ? "default" : "default"}
          size="sm"
          onClick={onNext}
          disabled={!canGoNext || currentStep === totalSteps}
          className={cn(
            "flex items-center px-3 h-10 rounded-full",
            isLastStep 
              ? "bg-gradient-to-r from-brand-gold to-brand-blue hover:shadow-md text-white" 
              : "bg-gradient-to-r from-brand-gold to-brand-blue hover:shadow-md text-white",
            !canGoNext && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLastStep ? "Submit" : "Next"}
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-2">
        Step {currentStep} of {totalSteps} • {Math.round(progress)}% Complete
        {hasMissingFields && (
          <span className="text-amber-500 ml-1">• Some fields missing</span>
        )}
      </div>
    </motion.div>
  );
}