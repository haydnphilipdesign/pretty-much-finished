import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ReviewMissingFieldsIndicatorProps {
  skippedFields: any[];
  onFixClick?: (field: string) => void;
  className?: string;
}

export const ReviewMissingFieldsIndicator: React.FC<ReviewMissingFieldsIndicatorProps> = ({
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
    if (typeof field !== 'string') {
      return 'Unknown Field';
    }
    
    try {
      const lastPartMatch = field.match(/\.([^.]+)$/);
      const fieldName = lastPartMatch ? lastPartMatch[1] : field;
      let formatted = fieldName.replace(/\[\d+\]/g, '');
      formatted = formatted.replace(/([A-Z])/g, ' $1').trim();
      formatted = formatted.replace(/\./g, ' ');
      formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
      return formatted;
    } catch (error) {
      return String(field);
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
      "bg-amber-50 border border-amber-200 rounded-md p-3 mb-3 shadow-sm",
      className
    )}>
      <div className="flex items-start">
        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium text-amber-900 text-sm">Missing Required Information</h3>
            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
              {validSkippedFields.length} {validSkippedFields.length === 1 ? 'field' : 'fields'}
            </span>
          </div>
          
          {/* Compact categorized fields - shown in both mobile and desktop */}
          <div className="grid grid-cols-1 gap-y-2">
            {Object.entries(groupedFields).map(([category, fields]) => (
              <div key={category} className="last:mb-0">
                <div className="text-amber-800 font-medium text-xs mb-1 flex items-center">
                  {category} <span className="text-xs ml-1 text-amber-700">({fields.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {fields.map((field, index) => (
                    <div key={index} className="inline-flex items-center bg-amber-100/70 px-2 py-0.5 rounded text-xs">
                      <span className="text-amber-800">{formatFieldName(field)}</span>
                      {onFixClick && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onFixClick(field)}
                          className="h-5 w-5 p-0 ml-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-full"
                          aria-label={`Fix ${formatFieldName(field)}`}
                          title={`Fix ${formatFieldName(field)}`}
                        >
                          <ArrowRight className="h-3 w-3" />
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