import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

export type SubmissionStep = {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'complete' | 'error';
};

interface SubmissionProgressProps {
  isVisible: boolean;
  steps: SubmissionStep[];
  currentStepIndex: number;
  error: string | null;
  onClose?: () => void;
}

export function SubmissionProgress({
  isVisible,
  steps,
  currentStepIndex,
  error,
  onClose
}: SubmissionProgressProps) {
  if (!isVisible) return null;

  // Calculate progress percentage
  const progressPercentage = 
    error ? 100 : // If error, show full bar in red
    Math.min(100, Math.round(((currentStepIndex + (steps[currentStepIndex]?.status === 'loading' ? 0.5 : 0)) / steps.length) * 100));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {error ? "Submission Error" : "Submitting Your Transaction"}
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            {error ? "We encountered an error while processing your submission" : "Please wait while we process your transaction"}
          </p>
          
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className={`h-full rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500'}`}
            />
          </div>
          
          {/* Steps list */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {step.status === 'pending' && (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  {step.status === 'loading' && (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  )}
                  {step.status === 'complete' && (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  )}
                  {step.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
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
              </div>
            ))}
          </div>
          
          {error && (
            <div className="mt-5 p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {error && onClose && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Close
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 