import React, { useState } from 'react';

interface GenerateCoverSheetProps {
  tableId: string;
  recordId: string;
  agentRole?: 'BUYERS AGENT' | 'LISTING AGENT' | 'DUAL AGENT';
  buttonText?: string;
  className?: string;
}

/**
 * A button component that triggers cover sheet generation for a specific Airtable record
 */
const GenerateCoverSheet: React.FC<GenerateCoverSheetProps> = ({
  tableId,
  recordId,
  agentRole,
  buttonText = 'Generate Cover Sheet',
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleGenerateCoverSheet = async () => {
    setIsLoading(true);
    setError(null);
    setIsComplete(false);
    setEmailSent(false);

    try {
      const response = await fetch('/api/generateCoverSheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId,
          recordId,
          agentRole,
          sendEmail: true
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate cover sheet');
      }

      // Update state based on response
      setIsComplete(true);
      setEmailSent(data.emailSent || false);
      
      // In Vercel environment, we may not have a direct path to the file
      // as it's stored in the serverless function's temporary storage
      if (data.path) {
        window.open(data.path, '_blank');
      } else {
        // Show success message if email was sent but no download path
        alert('Cover sheet generated and sent via email successfully.');
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred generating the cover sheet');
      console.error('Error generating cover sheet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cover-sheet-generator">
      <button
        onClick={handleGenerateCoverSheet}
        disabled={isLoading}
        className={`generate-cover-sheet-button ${className}`}
        data-generate-cover-sheet
        data-table-id={tableId}
        data-record-id={recordId}
      >
        {isLoading ? 'Generating...' : buttonText}
      </button>

      {error && (
        <div className="error-message" style={{ color: 'red', marginTop: '8px' }}>
          {error}
        </div>
      )}

      {isComplete && !error && (
        <div className="success-message" style={{ color: 'green', marginTop: '8px' }}>
          {emailSent 
            ? 'Cover sheet has been generated and emailed to administration.' 
            : 'Cover sheet has been generated successfully.'}
        </div>
      )}
    </div>
  );
};

export default GenerateCoverSheet; 