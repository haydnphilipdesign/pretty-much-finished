import React, { useState } from 'react';
import { generateCoverSheetForTransaction } from '@/utils/coverSheetGenerator';

interface CoverSheetButtonProps {
  transactionId: string;
  agentRole?: 'BUYERS AGENT' | 'LISTING AGENT' | 'DUAL AGENT';
  buttonText?: string;
  className?: string;
  onSuccess?: (pdfUrl: string) => void;
  onError?: (error: Error) => void;
}

/**
 * A simple button component to generate cover sheets for transactions
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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGenerateCoverSheet = async () => {
    if (!transactionId) {
      setError('No transaction ID provided');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate the cover sheet using the utility function
      const url = await generateCoverSheetForTransaction(transactionId, agentRole);
      
      // Set the PDF URL
      setPdfUrl(url);
      
      // Call the success handler if provided
      if (onSuccess) {
        onSuccess(url);
      }
      
      // Open the PDF in a new tab
      window.open(url, '_blank');
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
        disabled={isLoading}
        className={`cover-sheet-button ${className}`}
        data-transaction-id={transactionId}
        data-agent-role={agentRole}
      >
        {isLoading ? 'Generating...' : buttonText}
      </button>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginTop: '8px' }}>
          {error}
        </div>
      )}
      
      {pdfUrl && !error && (
        <div className="success-message" style={{ marginTop: '8px' }}>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            View Cover Sheet
          </a>
        </div>
      )}
    </div>
  );
};

export default CoverSheetButton; 