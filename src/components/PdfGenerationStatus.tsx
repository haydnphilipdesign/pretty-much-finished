import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Loader } from 'lucide-react';

/**
 * Component to display PDF generation and email status
 */
interface PdfGenerationStatusProps {
  isGenerating: boolean;
  error: string | null;
  emailSent: boolean;
  emailError: string | null;
  pdfGenerated: boolean;
  onRetry: () => void;
}

const PdfGenerationStatus: React.FC<PdfGenerationStatusProps> = ({
  isGenerating,
  error,
  emailSent,
  emailError,
  pdfGenerated,
  onRetry
}) => {
  if (isGenerating) {
    return (
      <div className="flex items-center p-4 space-x-4 bg-blue-50 border border-blue-200 rounded-md">
        <Loader className="w-6 h-6 text-blue-500 animate-spin" />
        <div className="flex-1">
          <h3 className="font-medium text-blue-800">Processing</h3>
          <p className="text-sm text-blue-600">Generating PDF and sending email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>PDF Generation Failed</AlertTitle>
        <AlertDescription className="whitespace-pre-wrap">
          {error}
          <div className="mt-3">
            <Button variant="destructive" size="sm" onClick={onRetry}>
              Retry PDF Generation
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (pdfGenerated) {
    return (
      <Alert variant={emailSent ? "default" : "warning"} className="mb-4">
        <AlertTitle>
          {emailSent ? "PDF Generated Successfully" : "PDF Generated, Email Not Sent"}
        </AlertTitle>
        <AlertDescription>
          {emailSent ? (
            "The PDF was generated and sent successfully."
          ) : (
            <>
              <p>The PDF was generated but could not be emailed.</p>
              {emailError && (
                <p className="text-sm text-orange-700 mt-1">
                  <strong>Email Error:</strong> {emailError}
                </p>
              )}
              <div className="mt-3">
                <Button variant="outline" size="sm" onClick={onRetry}>
                  Retry Sending Email
                </Button>
              </div>
            </>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default PdfGenerationStatus;