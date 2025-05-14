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
  
  // Get a readable list of missing fields (max 3)
  const missingFieldNames = Object.keys(errors).slice(0, 3).map(field => {
    // Format field name to be readable
    let formattedField = field;
    
    // Handle client array references, e.g., "clients[0].name" → "Client Name"
    if (field.includes('clients[') && field.includes('].')) {
      const clientProperty = field.split('].')[1]; // Get the property after the index
      
      // Format specific client properties
      if (clientProperty === 'name') {
        return 'Client Name';
      } else if (clientProperty === 'email') {
        return 'Client Email';
      } else if (clientProperty === 'phone') {
        return 'Client Phone';
      } else if (clientProperty === 'address') {
        return 'Client Address';
      } else if (clientProperty === 'maritalStatus') {
        return 'Client Marital Status';
      } else {
        return 'Client Information';
      }
    }
    
    // Format regular field names
    return formattedField
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  });
  
  const hasMoreErrors = Object.keys(errors).length > 3;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full relative overflow-hidden">
        {/* Colored header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-amber-500"></div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Some Information is Missing
          </h2>
          
          <p className="text-lg text-gray-700 mb-3">
            You can continue without filling in all fields now.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-lg font-medium text-amber-800 mb-2">
              Missing information:
            </p>
            <ul className="list-disc pl-6 text-amber-700 space-y-1">
              {missingFieldNames.map((field, index) => (
                <li key={index} className="text-base">
                  {field}
                </li>
              ))}
              {hasMoreErrors && (
                <li className="text-base">
                  ...and {Object.keys(errors).length - 3} more
                </li>
              )}
            </ul>
          </div>
          
          <p className="text-base text-gray-600">
            While these fields are helpful, you may proceed with the submission process without completing them now. Any missing information can be collected at a later time.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onContinue}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg font-bold text-lg transition-colors"
          >
            Continue Anyway
          </button>
          <button 
            onClick={() => {
              onFix(firstErrorField);
              onClose();
            }}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg transition-colors"
          >
            Fix Missing Fields
          </button>
        </div>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}; 