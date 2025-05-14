import React, { useState } from 'react';

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
      // Use the API endpoint instead of directly importing util functions
      const response = await fetch('/api/generateCoverSheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId: 'tblHyCJCpQSgjn0md', // Transactions table ID
          recordId: transactionId,
          agentRole,
          sendEmail: true
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate cover sheet');
      }
      
      // Set completion state
      setIsComplete(true);
      
      // Call the success handler if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Display appropriate message based on where the app is running
      if (data.emailSent || !data.path) {
        // For Vercel deployment or if email was sent
        alert('Cover sheet has been generated and emailed to administration.');
      } else if (data.path) {
        // For local development where files can be downloaded
        alert('Cover sheet has been generated and emailed to administration. You can also download it directly.');
        window.open(data.path, '_blank');
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