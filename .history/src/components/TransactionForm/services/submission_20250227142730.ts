// Define the submission result interface
export interface SubmissionResult {
  success: boolean;
  transactionId?: string;
  errors?: string[];
  timestamp?: string;
}

// Local storage key for saving the last submission
const LAST_SUBMISSION_KEY = 'transaction_form_last_submission';

/**
 * Submit form data to the backend
 * @param formData The form data to submit
 * @param progressCallback Optional callback for progress updates
 * @returns A promise that resolves to the submission result
 */
export const submitForm = async (
  formData: Record<string, any>,
  progressCallback?: (progress: {
    stage: 'validation' | 'processing' | 'uploading' | 'complete';
    progress: number;
    message: string;
  }) => void
): Promise<SubmissionResult> => {
  try {
    // Report initial progress
    if (progressCallback) {
      progressCallback({
        stage: 'validation',
        progress: 10,
        message: 'Validating form data...'
      });
    }

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Report processing progress
    if (progressCallback) {
      progressCallback({
        stage: 'processing',
        progress: 30,
        message: 'Processing transaction data...'
      });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Report upload progress
    if (progressCallback) {
      progressCallback({
        stage: 'uploading',
        progress: 60,
        message: 'Uploading transaction to server...'
      });
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Generate a mock transaction ID
    const transactionId = `TX-${Date.now().toString().slice(-6)}`;
    
    // Create successful result
    const result: SubmissionResult = {
      success: true,
      transactionId,
      timestamp: new Date().toISOString()
    };

    // Save the last submission to local storage
    localStorage.setItem(LAST_SUBMISSION_KEY, JSON.stringify({
      formData,
      result,
      timestamp: new Date().toISOString()
    }));

    // Report completion
    if (progressCallback) {
      progressCallback({
        stage: 'complete',
        progress: 100,
        message: `Transaction ${transactionId} submitted successfully!`
      });
    }

    return result;
  } catch (error) {
    // Create error result
    const errorResult: SubmissionResult = {
      success: false,
      errors: [error instanceof Error ? error.message : 'An unknown error occurred'],
      timestamp: new Date().toISOString()
    };

    // Report error
    if (progressCallback) {
      progressCallback({
        stage: 'complete',
        progress: 100,
        message: `Submission failed: ${errorResult.errors?.[0]}`
      });
    }

    return errorResult;
  }
};

/**
 * Get the last submission from local storage
 * @returns The last submitted form data or null if none exists
 */
export const getLastSubmission = (): Record<string, any> | null => {
  try {
    const savedData = localStorage.getItem(LAST_SUBMISSION_KEY);
    if (!savedData) return null;
    
    const parsed = JSON.parse(savedData);
    return parsed.formData || null;
  } catch (error) {
    console.error('Error retrieving last submission:', error);
    return null;
  }
};

/**
 * Clear the last submission from local storage
 */
export const clearLastSubmission = (): void => {
  try {
    localStorage.removeItem(LAST_SUBMISSION_KEY);
  } catch (error) {
    console.error('Error clearing last submission:', error);
  }
};