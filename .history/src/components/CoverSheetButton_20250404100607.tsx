import React, { useState } from 'react';
import { generateCoverSheetForTransaction } from '@/utils/coverSheetGenerator';

interface CoverSheetButtonProps {
  transactionId: string;
  agentRole?: 'BUYERS AGENT' | 'LISTING AGENT' | 'DUAL AGENT';
  buttonText?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * A simple button component to generate cover sheets for transactions
 * and email them to administration
 */
const CoverSheetButton = ({
  transactionId,
  agentRole = 'DUAL AGENT',
  buttonText = 'Generate Cover Sheet',
  className = '',
  onSuccess,
  onError
}: CoverSheetButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleGenerateCoverSheet = async () => {
    if (!transactionId) {
      setError('No transaction ID provided');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsComplete(false);

    try {
      // Generate the cover sheet using the utility function
      // This will email the PDF directly to administration
      const success = await generateCoverSheetForTransaction(transactionId, agentRole);
      
      // Set completion state
      setIsComplete(success);
      
      // Call the success handler if provided
      if (success && onSuccess) {
        onSuccess();
      }
      
      // Show user feedback
      if (success) {
        // You can optionally use a toast notification here instead of alert
        alert('Cover sheet has been generated and emailed to administration.');
      } else {
        throw new Error('Failed to generate and send cover sheet');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'An error occurred while generating the cover sheet');
      
      // Call the error handler if provided
      if (onError) {
        onError(error);
      }
      
      console.error('Error generating cover sheet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cover-sheet-button-container">
      <button
        onClick={handleGenerateCoverSheet}
        disabled={isLoading || isComplete}
        className={`cover-sheet-button ${className}`}
        data-transaction-id={transactionId}
        data-agent-role={agentRole}
      >
        {isLoading ? 'Generating...' : isComplete ? 'Cover Sheet Sent' : buttonText}
      </button>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginTop: '8px' }}>
          {error}
        </div>
      )}
      
      {isComplete && !error && (
        <div className="success-message" style={{ color: 'green', marginTop: '8px' }}>
          Cover sheet has been sent to administration.
        </div>
      )}
    </div>
  );
};

export default CoverSheetButton; 