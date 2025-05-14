import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface MissingFieldsIndicatorProps {
  skippedFields: string[];
  onFixClick?: (field: string) => void;
}

export const MissingFieldsIndicator: React.FC<MissingFieldsIndicatorProps> = ({
  skippedFields,
  onFixClick
}) => {
  if (!skippedFields || skippedFields.length === 0) {
    return null;
  }

  // Format field names for display
  const formatFieldName = (field: string) => {
    // Remove brackets and indices (for array fields)
    let formatted = field.replace(/\[\d+\]/g, '');
    // Convert camelCase to spaces
    formatted = formatted.replace(/([A-Z])/g, ' $1').trim();
    // Capitalize first letter
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    return formatted;
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-900">Missing Required Information</h3>
          <p className="text-amber-700 text-sm mb-2">
            The following required fields were skipped:
          </p>
          <ul className="list-disc list-inside text-amber-800 space-y-1 text-sm">
            {skippedFields.map((field, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{formatFieldName(field)}</span>
                {onFixClick && (
                  <button 
                    onClick={() => onFixClick(field)}
                    className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded-md ml-2"
                  >
                    Fix
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}; 