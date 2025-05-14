import { renderHook, act } from '@testing-library/react-hooks';
import { useFormSubmission } from '../useFormSubmission';
import { FormProvider } from '../../components/TransactionForm/context/FormContext';
import { useFormValidation } from '../useFormValidation';
import { useToast } from '../use-toast';
import { mockTransactionData } from '../../components/TransactionForm/__mocks__/mockData';
import { submitForm, getLastSubmission, clearLastSubmission } from '../../components/TransactionForm/services/submission';
import { vi } from 'vitest';
import React from 'react';

// Define mock functions
const mockSetFormData = vi.fn();
const mockResetForm = vi.fn();
const mockValidateForm = vi.fn();
const mockToast = vi.fn();

// Mock dependencies
vi.mock('../useFormValidation', () => ({
  useFormValidation: () => ({
    validateForm: mockValidateForm
  })
}));

vi.mock('../use-toast', () => ({
  useToast: () => ({
    toast: mockToast
  })
}));

vi.mock('../../components/TransactionForm/services/submission');

// Mock FormContext
vi.mock('../../components/TransactionForm/context/FormContext', () => ({
  FormProvider: ({ children }: { children: React.ReactNode }) => children,
  useForm: () => ({
    state: { formData: mockTransactionData },
    setFormData: mockSetFormData,
    resetForm: mockResetForm
  })
}));

// Mock router
const mockRouter = { push: vi.fn() };
vi.mock('next/router', () => ({
  useRouter: () => mockRouter
}));

describe('useFormSubmission', () => {
  // Create a wrapper component
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFormSubmission(), { wrapper });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.lastSubmission).toBeNull();
    expect(result.current.hasRecoveredData).toBe(false);
  });

  describe('form submission', () => {
    it('should handle successful submission', async () => {
      mockValidateForm.mockReturnValue({ isValid: true });
      const transactionId = 'TX-TEST-123';
      (submitForm as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        transactionId
      });

      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      await act(async () => {
        await result.current.submit();
      });

      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Success!'
      }));
      expect(mockRouter.push).toHaveBeenCalledWith(`/transactions/${transactionId}`);
    });

    it('should handle validation failure', async () => {
      mockValidateForm.mockReturnValue({ isValid: false, errors: ['Invalid data'] });

      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      await act(async () => {
        await result.current.submit();
      });

      expect(submitForm).not.toHaveBeenCalled();
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should handle submission failure', async () => {
      mockValidateForm.mockReturnValue({ isValid: true });
      (submitForm as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: false,
        errors: ['API Error']
      });

      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      await act(async () => {
        await result.current.submit();
      });

      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Submission Failed',
        variant: 'destructive'
      }));
    });

    it('should handle unexpected errors', async () => {
      mockValidateForm.mockReturnValue({ isValid: true });
      (submitForm as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Unexpected error'));

      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      await act(async () => {
        await result.current.submit();
      });

      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error',
        variant: 'destructive'
      }));
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('progress tracking', () => {
    it('should track submission progress', async () => {
      mockValidateForm.mockReturnValue({ isValid: true });
      (submitForm as unknown as ReturnType<typeof vi.fn>).mockImplementation(async (_, progressCallback) => {
        progressCallback?.({
          stage: 'validation',
          progress: 0,
          message: 'Validating...'
        });
        progressCallback?.({
          stage: 'processing',
          progress: 50,
          message: 'Processing...'
        });
        progressCallback?.({
          stage: 'uploading',
          progress: 75,
          message: 'Uploading...'
        });
        progressCallback?.({
          stage: 'complete',
          progress: 100,
          message: 'Complete'
        });
        return { success: true };
      });

      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      await act(async () => {
        await result.current.submit();
      });

      expect(result.current.progress).toEqual({
        stage: 'complete',
        progress: 100,
        message: 'Complete'
      });
    });

    it('should show retry progress', async () => {
      mockValidateForm.mockReturnValue({ isValid: true });
      (submitForm as unknown as ReturnType<typeof vi.fn>).mockImplementation(async (_, progressCallback) => {
        progressCallback?.({
          stage: 'uploading',
          progress: 33,
          message: 'Attempt 1 of 3...'
        });
        progressCallback?.({
          stage: 'uploading',
          progress: 66,
          message: 'Attempt 2 of 3...'
        });
        return { success: true };
      });

      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      await act(async () => {
        await result.current.submit();
      });

      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Retrying Submission',
        description: 'Attempt 1 of 3...'
      }));
    });
  });

  describe('error handling', () => {
    it('should handle validation errors with progress', async () => {
      mockValidateForm.mockReturnValue({ isValid: false, errors: ['Invalid data'] });

      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      await act(async () => {
        await result.current.submit();
      });

      expect(result.current.error).toBe('Validation failed');
      expect(result.current.progress).toBeNull();
    });

    it('should handle API errors with progress', async () => {
      mockValidateForm.mockReturnValue({ isValid: true });
      (submitForm as unknown as ReturnType<typeof vi.fn>).mockImplementation(async (_, progressCallback) => {
        progressCallback?.({
          stage: 'uploading',
          progress: 50,
          message: 'Uploading...'
        });
        progressCallback?.({
          stage: 'complete',
          progress: 100,
          message: 'Submission failed'
        });
        return { success: false, errors: ['API Error'] };
      });

      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      await act(async () => {
        await result.current.submit();
      });

      expect(result.current.error).toBe('API Error');
      expect(result.current.progress?.stage).toBe('complete');
    });
  });

  describe('data recovery', () => {
    it('should recover last submission', () => {
      (getLastSubmission as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockTransactionData);

      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      act(() => {
        result.current.recoverLastSubmission();
      });

      expect(result.current.hasRecoveredData).toBe(true);
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Data Recovered'
      }));
    });

    it('should handle missing recovery data', () => {
      (getLastSubmission as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      act(() => {
        result.current.recoverLastSubmission();
      });

      expect(result.current.hasRecoveredData).toBe(false);
    });

    it('should clear recovered data', () => {
      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      act(() => {
        result.current.clearRecoveredData();
      });

      expect(clearLastSubmission).toHaveBeenCalled();
      expect(mockResetForm).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Data Cleared'
      }));
      expect(result.current.hasRecoveredData).toBe(false);
    });
  });

  describe('data recovery with progress', () => {
    it('should track progress during data recovery', () => {
      (getLastSubmission as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockTransactionData);

      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      act(() => {
        result.current.recoverLastSubmission();
      });

      expect(mockSetFormData).toHaveBeenCalledWith(mockTransactionData);
      expect(result.current.progress).toEqual({
        stage: 'complete',
        progress: 100,
        message: 'Data recovered successfully'
      });
    });

    it('should handle recovery errors with progress', () => {
      (getLastSubmission as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      act(() => {
        result.current.recoverLastSubmission();
      });

      expect(result.current.error).toBe('No data to recover');
      expect(result.current.progress).toBeNull();
    });

    it('should track progress during data clearing', () => {
      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      act(() => {
        result.current.clearRecoveredData();
      });

      expect(result.current.progress).toEqual({
        stage: 'complete',
        progress: 100,
        message: 'Data cleared successfully'
      });
    });

    it('should handle clearing errors with progress', () => {
      (clearLastSubmission as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Clear error');
      });

      const { result } = renderHook(() => useFormSubmission(), { wrapper });

      act(() => {
        result.current.clearRecoveredData();
      });

      expect(result.current.error).toBe('Failed to clear data');
      expect(result.current.progress).toBeNull();
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error',
        description: 'Failed to clear recovered data.'
      }));
    });
  });
}); 