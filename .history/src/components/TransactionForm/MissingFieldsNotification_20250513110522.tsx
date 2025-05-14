import React from 'react';
import { Button } from "@/components/ui/button";

interface MissingFieldsNotificationProps {
  errorCount: number;
  onContinueAnyway: () => void;
  onFixFields: () => void;
}

export const MissingFieldsNotification: React.FC<MissingFieldsNotificationProps> = ({
  errorCount,
  onContinueAnyway,
  onFixFields
}) => {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">
        {errorCount} required field{errorCount !== 1 ? 's' : ''} {errorCount !== 1 ? 'are' : 'is'} missing. You can:
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={onContinueAnyway} 
          className="bg-amber-500 hover:bg-amber-600 text-gray-900"
          variant="default"
          size="sm"
        >
          Continue Anyway
        </Button>
        <Button 
          onClick={onFixFields} 
          className="bg-blue-500 hover:bg-blue-600 text-white"
          variant="default"
          size="sm"
        >
          Fix Missing Fields
        </Button>
      </div>
    </div>
  );
}; 