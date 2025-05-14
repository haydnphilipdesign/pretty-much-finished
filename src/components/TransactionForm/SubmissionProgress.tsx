import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, AlertCircle, PartyPopper } from "lucide-react";

export type SubmissionStep = {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'complete' | 'error';
};

interface SubmissionProgressProps {
  isOpen: boolean;
  steps: SubmissionStep[];
  currentStep: number;
  error: string | null;
  onClose: () => void;
}

export function SubmissionProgress({
  isOpen,
  steps,
  currentStep,
  error,
  onClose
}: SubmissionProgressProps) {
  const [isAllComplete, setIsAllComplete] = useState(false);
  
  // Check if all steps are complete
  useEffect(() => {
    if (steps.every(step => step.status === 'complete')) {
      setIsAllComplete(true);
    } else {
      setIsAllComplete(false);
    }
  }, [steps]);

  if (!isOpen) return null;

  // Calculate progress percentage
  const progressPercentage = 
    error ? 100 : // If error, show full bar in red
    isAllComplete ? 100 : // If all complete, show full bar
    Math.min(100, Math.round(((currentStep + (steps[currentStep]?.status === 'loading' ? 0.5 : 0)) / steps.length) * 100));

  // Check if the last step was just completed (for celebration animation)
  const isJustCompleted = 
    steps.length > 0 && 
    steps[steps.length - 1].status === 'complete' && 
    !error;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {error ? "Submission Error" : 
               isAllComplete ? "Transaction Submitted Successfully!" : 
               "Processing Your Transaction"}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              {error 
                ? "We encountered an error while processing your submission" 
                : isAllComplete
                  ? "Your transaction has been processed and saved"
                  : "Please wait while we process your information"
              }
            </p>
            
            {/* Confetti animation for completion */}
            {isAllComplete && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4"
              >
                <PartyPopper className="h-8 w-8 text-green-500" />
              </motion.div>
            )}
            
            {/* Progress bar */}
            <div className="w-full h-3 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                className={`h-full rounded-full ${
                  error ? 'bg-red-500' : 
                  isAllComplete ? 'bg-emerald-500' : 
                  'bg-emerald-500'
                }`}
              />
            </div>
            
            {/* Steps list */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.id} 
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    step.status === 'complete' ? 'bg-green-50' :
                    step.status === 'loading' ? 'bg-blue-50' :
                    step.status === 'error' ? 'bg-red-50' :
                    'bg-gray-50'
                  }`}
                  initial={{ opacity: 0.8, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: step.status === 'loading' ? 1.02 : 1
                  }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <div className="flex-shrink-0">
                    {step.status === 'pending' && (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                    )}
                    {step.status === 'loading' && (
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    )}
                    {step.status === 'complete' && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      </motion.div>
                    )}
                    {step.status === 'error' && (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className={`text-sm font-medium ${
                      step.status === 'error' ? 'text-red-700' :
                      step.status === 'complete' ? 'text-emerald-700' :
                      step.status === 'loading' ? 'text-blue-700' :
                      'text-gray-500'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {error && (
              <div className="mt-5 p-4 bg-red-50 border border-red-100 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {/* Only show close button for errors or after full completion */}
            {(error || isAllComplete) && onClose && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className={`mt-4 w-full py-3 font-medium transition-colors rounded-lg ${
                  error ? 
                  "bg-gray-100 hover:bg-gray-200 text-gray-800" : 
                  "bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                }`}
              >
                {error ? "Close" : "Done"}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}