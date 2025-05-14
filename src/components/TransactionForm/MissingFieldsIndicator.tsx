import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MissingFieldsIndicatorProps {
  skippedFields: any[];
  onFixClick?: (field: string) => void;
  className?: string;
}

export const MissingFieldsIndicator: React.FC<MissingFieldsIndicatorProps> = ({
  skippedFields,
  onFixClick,
  className
}) => {
  if (!skippedFields || skippedFields.length === 0) {
    return null;
  }

  // Ensure all fields are strings
  const validSkippedFields = skippedFields.filter(field => field != null)
    .map(field => typeof field === 'string' ? field : String(field));

  // Format field names for display
  const formatFieldName = (field: any) => {
    // Check if field is a string
    if (typeof field !== 'string') {
      console.warn('Non-string field in skippedFields:', field);
      return 'Unknown Field';
    }
    
    try {
      // Handle potential nested paths, like client.name
      const lastPartMatch = field.match(/\.([^.]+)$/);
      const fieldName = lastPartMatch ? lastPartMatch[1] : field;
      
      // Remove brackets and indices (for array fields)
      let formatted = fieldName.replace(/\[\d+\]/g, '');
      
      // Convert camelCase to spaces
      formatted = formatted.replace(/([A-Z])/g, ' $1').trim();
      
      // Replace dots with spaces
      formatted = formatted.replace(/\./g, ' ');
      
      // Capitalize first letter
      formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
      return formatted;
    } catch (error) {
      console.error('Error formatting field name:', field, error);
      return String(field);
    }
  };

  // Create a human-readable summary
  const getMissingSummary = () => {
    if (validSkippedFields.length <= 3) {
      return validSkippedFields.map(formatFieldName).join(', ');
    } else {
      return `${validSkippedFields.length} required fields`;
    }
  };

  // Group fields by their general category for better organization
  const groupedFields = validSkippedFields.reduce((acc, field) => {
    let category = 'Other';
    
    if (field.includes('client') || field.includes('Client')) category = 'Client Information';
    else if (field.includes('property') || field.includes('Property')) category = 'Property Details';
    else if (field.includes('commission') || field.includes('Commission') || field.includes('fee')) category = 'Commission';
    else if (field.includes('document') || field.includes('Document')) category = 'Documents';
    else if (field.includes('signature') || field.includes('confirm') || field.includes('Confirm')) category = 'Signature';
    
    if (!acc[category]) acc[category] = [];
    acc[category].push(field);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className={cn(
      "bg-amber-50 border border-amber-200 rounded-md p-4 mb-4 animate-fadeIn shadow-sm",
      className
    )}>
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
        <div className="w-full">
          <h3 className="font-semibold text-amber-900">Missing Required Information</h3>
          <p className="text-amber-700 text-sm mb-3">
            Please complete the following required fields: {getMissingSummary()}
          </p>
          
          {/* Mobile view - simplified list */}
          <div className="block sm:hidden">
            <div className="flex flex-col space-y-2">
              {validSkippedFields.slice(0, 5).map((field, index) => (
                <div key={index} className="flex items-center justify-between bg-amber-100/70 px-3 py-2 rounded-md">
                  <span className="text-amber-800 text-sm font-medium">{formatFieldName(field)}</span>
                  {onFixClick && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFixClick(field)}
                      className="h-8 px-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      Fix <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              
              {validSkippedFields.length > 5 && (
                <p className="text-xs text-amber-600 italic text-center mt-1">
                  + {validSkippedFields.length - 5} more missing fields
                </p>
              )}
            </div>
          </div>
          
          {/* Desktop view - categorized fields */}
          <div className="hidden sm:block">
            {Object.entries(groupedFields).map(([category, fields]) => (
              <div key={category} className="mb-3 last:mb-0">
                <h4 className="text-amber-800 font-medium text-sm mb-1">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1">
                  {fields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between bg-amber-100/50 pl-2 pr-1 py-1 rounded">
                      <span className="text-amber-800 text-sm">{formatFieldName(field)}</span>
                      {onFixClick && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onFixClick(field)}
                          className="h-7 px-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                          Fix
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};