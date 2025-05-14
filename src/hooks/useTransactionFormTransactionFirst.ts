/**
 * Custom hook for handling transaction form submissions using the transaction-first approach
 * 
 * This hook implements the recommended approach of creating the transaction record first,
 * then linking client records to it. This simplifies relationship management in Airtable.
 */

import { useState } from 'react';
import Airtable from 'airtable';
import { TransactionFormData } from '../types/transaction';
import { 
  submitTransactionToAirtable, 
  initializeAirtable 
} from '../utils/airtable.transaction-first';

export function useTransactionFormTransactionFirst() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<{
    transactionId: string;
    clientIds: string[];
  } | null>(null);

  /**
   * Initialize Airtable base
   */
  const getAirtableBase = () => {
    try {
      return initializeAirtable(Airtable);
    } catch (error) {
      console.error('Error initializing Airtable:', error);
      throw error;
    }
  };

  /**
   * Submit transaction data to Airtable
   */
  const submitTransaction = async (formData: TransactionFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    setResult(null);

    try {
      // Get Airtable base
      const airtableBase = getAirtableBase();

      // Submit transaction data
      const submissionResult = await submitTransactionToAirtable(formData, airtableBase);

      // Update state with result
      setSuccess(true);
      setResult({
        transactionId: submissionResult.transactionId,
        clientIds: submissionResult.clientIds,
      });

      return submissionResult;
    } catch (error: any) {
      console.error('Error submitting transaction:', error);
      setError(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitTransaction,
    isSubmitting,
    error,
    success,
    result,
  };
}

export default useTransactionFormTransactionFirst;
