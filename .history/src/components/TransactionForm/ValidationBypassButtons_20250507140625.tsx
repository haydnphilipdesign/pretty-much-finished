import React, { useEffect } from 'react';

interface ValidationBypassButtonsProps {
  errorCount: number;
  onContinue: () => void;
  onFix: (field: string) => void;
  errors: Record<string, string[]>;
  onClose: () => void;
}

export const ValidationBypassButtons: React.FC<ValidationBypassButtonsProps> = ({
  errorCount,
  onContinue,
  onFix,
  errors,
  onClose
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);
  
  // Get the first error field
  const firstErrorField = Object.keys(errors)[0];
  
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/25" onClick={onClose}></div>
      <div className="relative z-10 bg-white rounded-t-xl sm:rounded-xl shadow-lg p-4 m-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">
            Missing Information
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            {errorCount} field{errorCount !== 1 ? 's' : ''} need{errorCount === 1 ? 's' : ''} to be filled in.
          </p>
          <p className="text-gray-500 text-sm">
            You can continue without filling them in now, but you'll need to complete them before final submission.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button 
            onClick={onContinue}
            className="w-full sm:w-1/2 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md font-medium"
          >
            Continue Anyway
          </button>
          <button 
            onClick={() => onFix(firstErrorField)}
            className="w-full sm:w-1/2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium"
          >
            Fix Missing Fields
          </button>
        </div>
      </div>
    </div>
  );
}; 