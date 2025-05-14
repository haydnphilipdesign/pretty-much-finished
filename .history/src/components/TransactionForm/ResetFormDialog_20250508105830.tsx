import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface ResetFormDialogProps {
  onReset: () => void;
}

export const ResetFormDialog: React.FC<ResetFormDialogProps> = ({ onReset }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    onReset();
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        className="h-10 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        onClick={() => setIsOpen(true)}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset Form
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={handleClose}></div>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative overflow-hidden z-50">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">Reset Form</h2>
              <p className="text-gray-600 mt-2">
                This will clear all form data and cannot be undone. Are you sure you want to reset the form?
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                variant="default"
                onClick={handleReset}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Yes, Reset Form
              </Button>
            </div>
            
            {/* Close button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}; 