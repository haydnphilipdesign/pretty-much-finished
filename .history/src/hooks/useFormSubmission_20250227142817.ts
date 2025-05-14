import { useState, useCallback } from 'react';
import { useForm } from '../components/TransactionForm/context/FormContext';
import { submitForm, SubmissionResult, getLastSubmission, clearLastSubmission } from '../components/TransactionForm/services/submission';
import { useFormValidation } from './useFormValidation';
import { useToast } from './use-toast';

interface SubmissionState {
  isSubmitting: boolean;
  lastSubmission: SubmissionResult | null;
  hasRecoveredData: boolean;
  progress: {
    stage: 'validation' | 'processing' | 'uploading' | 'complete';
    progress: number;
    message: string;
  } | null;
  error: string | null;
}

export function useFormSubmission() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    lastSubmission: null,
    hasRecoveredData: false,
    progress: null,
    error: null
  });
  
  const { state: { formData }, resetForm, setFormData } = useForm();
  const { validateForm } = useFormValidation();
  const { toast } = useToast();

  // Handle progress updates
  const handleProgress = useCallback((progress: SubmissionState['progress']) => {
    setSubmissionState(prev => ({
      ...prev,
      progress
    }));

    // Show toast for important stages
    if (progress) {
      switch (progress.stage) {
        case 'uploading':
          if (progress.message.includes('Attempt')) {
            toast({
              title: 'Retrying Submission',
              description: progress.message,
              variant: 'default'
            });
          }
          break;
        case 'complete':
          if (!progress.message.includes('failed')) {
            toast({
              title: 'Progress Update',
              description: progress.message,
              variant: 'default'
            });
          }
          break;
      }
    }
  }, [toast]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    setSubmissionState(prev => ({
      ...prev,
      isSubmitting: true,
      error: null,
      progress: null
    }));

    try {
      // Validate entire form
      const validation = validateForm();
      if (!validation.isValid) {
        setSubmissionState(prev => ({
          ...prev,
          isSubmitting: false,
          error: 'Validation failed'
        }));
        return;
      }

      // Submit form with progress tracking
      const result = await submitForm(formData, handleProgress);
      
      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false,
        lastSubmission: result,
        error: result.success ? null : result.errors?.[0] || 'Submission failed'
      }));

      if (result.success) {
        toast({
          title: "Success!",
          description: `Transaction ${result.transactionId} has been submitted successfully.`,
          variant: "default"
        });

        // Clear form
        resetForm();
        
        // Navigate to success page (using window.location instead of Next.js router)
        if (result.transactionId) {
          window.location.href = `/transactions/${result.transactionId}`;
        }
      } else {
        toast({
          title: "Submission Failed",
          description: result.errors?.[0] || "An unexpected error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  }, [formData, validateForm, toast, resetForm, handleProgress]);

  // Handle data recovery
  const recoverLastSubmission = useCallback(() => {
    const lastSubmission = getLastSubmission();
    if (lastSubmission) {
      setFormData(lastSubmission);
      setSubmissionState(prev => ({
        ...prev,
        hasRecoveredData: true,
        progress: {
          stage: 'complete',
          progress: 100,
          message: 'Data recovered successfully'
        }
      }));
      toast({
        title: 'Data Recovered',
        description: 'Previous form data has been restored.',
        variant: 'default'
      });
    } else {
      setSubmissionState(prev => ({
        ...prev,
        error: 'No data to recover',
        progress: null
      }));
    }
  }, [setFormData, toast]);

  // Handle clearing recovered data
  const clearRecoveredData = useCallback(() => {
    try {
      clearLastSubmission();
      resetForm();
      setSubmissionState(prev => ({
        ...prev,
        hasRecoveredData: false,
        progress: {
          stage: 'complete',
          progress: 100,
          message: 'Data cleared successfully'
        }
      }));
      toast({
        title: 'Data Cleared',
        description: 'Recovered data has been cleared.',
        variant: 'default'
      });
    } catch (error) {
      setSubmissionState(prev => ({
        ...prev,
        error: 'Failed to clear data',
        progress: null
      }));
      toast({
        title: 'Error',
        description: 'Failed to clear recovered data.',
        variant: 'destructive'
      });
    }
  }, [resetForm, toast]);

  return {
    ...submissionState,
    submit: handleSubmit,
    recoverLastSubmission,
    clearRecoveredData
  };
}