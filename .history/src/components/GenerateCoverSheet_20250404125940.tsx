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
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleGenerateCoverSheet = async () => {
    setIsLoading(true);
    setError(null);
    setDownloadUrl(null);

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

      // Set the download URL
      setDownloadUrl(data.path);
      
      // Open in a new tab
      if (data.path) {
        window.open(data.path, '_blank');
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

      {downloadUrl && (
        <div className="download-link" style={{ marginTop: '8px' }}>
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            Download Cover Sheet
          </a>
        </div>
      )}
    </div>
  );
};

export default GenerateCoverSheet; 