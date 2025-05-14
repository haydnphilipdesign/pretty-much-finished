import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

// StepWizard.module.css
const styles = {
  wizardContainer: `
    /* Custom styles for better integration with page container */
    .wizard-container {
      padding: 1rem 1.5rem;
      background-color: rgba(248, 250, 252, 0.7);
      border-bottom: 1px solid #e2e8f0;
      margin: 0 -1.5rem; /* Negative margin to extend to edges */
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .wizard-container {
        background-color: rgba(17, 24, 39, 0.7);
        border-bottom: 1px solid #374151;
      }
    }

    /* Progress line customization for better integration */
    .progress-line {
      height: 2px;
      background-color: #e2e8f0;
      border-radius: 1px;
      overflow: hidden;
    }

    .progress-line-fill {
      height: 100%;
      background-color: #3b82f6;
      border-radius: 1px;
      transition: width 0.3s ease-in-out;
    }
  `,
};

interface Step {
  id: number;
  label: string;
  completed?: boolean;
  optional?: boolean;
}

interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  className?: string;
  allowSkip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'numbered' | 'dots' | 'pills';
  showLabels?: boolean;
  verticalOnMobile?: boolean;
}

export function StepWizard({
  steps,
  currentStep,
  onStepClick,
  className,
  allowSkip = false,
  size = 'md',
  variant = 'numbered',
  showLabels = true,
  verticalOnMobile = false,
}: StepWizardProps) {
  // Map sizes to actual values
  const sizeClasses = {
    sm: {
      container: 'max-w-xs',
      step: 'w-6 h-6 text-xs',
      separator: 'h-0.5',
      label: 'text-xs',
    },
    md: {
      container: 'max-w-2xl',
      step: 'w-8 h-8 text-sm',
      separator: 'h-1',
      label: 'text-sm',
    },
    lg: {
      container: 'max-w-4xl',
      step: 'w-10 h-10 text-base',
      separator: 'h-1.5',
      label: 'text-base',
    },
  };

  // Generate the correct layout based on screen size and orientation preference
  const containerClass = cn(
    'flex items-center justify-between w-full relative',
    verticalOnMobile && 'md:flex-row flex-col',
    sizeClasses[size].container,
    className
  );

  // Function to determine if a step should be clickable
  const isStepClickable = (stepId: number) => {
    if (!onStepClick) return false;
    if (allowSkip) return true;

    // If not allowing skips, only completed steps or the next available step are clickable
    const isCompleted = steps.find(s => s.id === stepId)?.completed;
    const isNextAvailable = stepId <= currentStep;

    return isCompleted || isNextAvailable;
  };

  // Helper to determine step status
  const getStepStatus = (step: Step) => {
    if (step.completed) return 'completed';
    if (step.id === currentStep) return 'current';
    if (step.id < currentStep) return 'previous';
    return 'upcoming';
  };

  // Render the contents of a step indicator based on variant
  const renderStepContent = (step: Step, status: string) => {
    switch (variant) {
      case 'numbered':
        if (status === 'completed') {
          return <CheckCircle2 className="w-full h-full p-1.5" />;
        }
        return <span>{step.id}</span>;

      case 'dots':
        if (status === 'completed') {
          return <CheckCircle2 className="w-full h-full p-1.5" />;
        }
        return <Circle className={cn(
          "w-full h-full",
          status === 'current' ? 'fill-current p-1.5' : 'p-2'
        )} />;

      case 'pills':
        return <span>{step.id}</span>;

      default:
        return <span>{step.id}</span>;
    }
  };

  return (
    <div className={containerClass}>
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step);
        const isClickable = isStepClickable(step.id);

        // Calculate base colors for each status
        let stepColors = '';
        switch (stepStatus) {
          case 'completed':
            stepColors = 'bg-blue-300 text-blue-900 border-blue-300';
            break;
          case 'current':
            stepColors = 'bg-white text-blue-900 border-white ring-2 ring-white/50';
            break;
          case 'previous':
            stepColors = 'bg-blue-100 text-blue-800 border-blue-200';
            break;
          default:
            stepColors = 'bg-blue-900/30 text-white/70 border-white/20';
            break;
        }

        // Apply different styling for pills variant
        if (variant === 'pills') {
          switch (stepStatus) {
            case 'completed':
              stepColors = 'bg-blue-200 text-blue-800 border-blue-300';
              break;
            case 'current':
              stepColors = 'bg-white text-blue-900 border-white font-medium';
              break;
            default:
              stepColors = 'bg-blue-900/30 text-white/70 border-white/20';
              break;
          }
        }

        return (
          <React.Fragment key={step.id}>
            <div className={cn(
              'flex flex-col items-center',
              verticalOnMobile && 'md:flex-col flex-row w-full pb-2 md:pb-0',
              'relative z-10'
            )}>
              {/* Step indicator */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center justify-center rounded-full border font-medium transition-all',
                  sizeClasses[size].step,
                  stepColors,
                  variant === 'pills' && 'rounded-full px-3 py-1 h-auto',
                  isClickable ? 'cursor-pointer hover:shadow-md' : 'cursor-default',
                  'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300'
                )}
                aria-current={stepStatus === 'current' ? 'step' : undefined}
              >
                {renderStepContent(step, stepStatus)}
              </button>

              {/* Label */}
              {showLabels && (
                <span
                  className={cn(
                    'mt-2 text-center',
                    sizeClasses[size].label,
                    stepStatus === 'current' ? 'text-white font-medium' : 'text-white/80',
                    step.optional && 'italic',
                    verticalOnMobile && 'md:mt-2 mt-0 ml-3 md:ml-0'
                  )}
                >
                  {step.label}
                  {step.optional && <span className="block text-xs italic">(Optional)</span>}
                </span>
              )}
            </div>

            {/* Separator line (not for the last step) */}
            {index < steps.length - 1 && (
              <div className={cn(
                'bg-blue-800/30',
                sizeClasses[size].separator,
                verticalOnMobile ? 'md:w-auto md:h-[1px] h-full w-[1px]' : 'h-[1px]',
                'flex-1 max-w-[100px] relative z-0',
              )}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: stepStatus === 'completed' ? '100%' : stepStatus === 'current' ? '50%' : '0%'
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className={cn(
                    'absolute left-0 top-0 h-full bg-white',
                    sizeClasses[size].separator,
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Add global style for better integration */}
      <style jsx global>{`
        .step-hover-effect {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .step-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        @media (prefers-reduced-motion: reduce) {
          .step-hover-effect {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}