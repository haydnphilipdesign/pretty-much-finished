import { useCallback } from 'react';
import { formatCurrencyForDisplay } from '../utils/airtable';

export function useInputFormat() {
  // Format phone number while typing
  const formatPhoneNumber = useCallback((value: string): string => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  }, []);

  // Format percentage while typing
  const formatPercentage = useCallback((value: string): string => {
    // Remove all non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts[1];
    }
    
    // Add % symbol if not empty
    if (cleaned) {
      return cleaned + '%';
    }
    
    return cleaned;
  }, []);

  // Format currency while typing
  const formatCurrency = useCallback((value: string): string => {
    // Use existing formatCurrencyForDisplay function
    if (!value) return '';
    return formatCurrencyForDisplay(value);
  }, []);

  // Format MLS number while typing
  const formatMLSNumber = useCallback((value: string): string => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^0-9PM-]/g, '');
    
    // Handle PM- prefix
    if (cleaned.startsWith('PM-')) {
      const numbers = cleaned.slice(3);
      return `PM-${numbers.slice(0, 6)}`;
    }
    
    // Handle numeric only
    return cleaned.slice(0, 6);
  }, []);

  return {
    formatPhoneNumber,
    formatPercentage,
    formatCurrency,
    formatMLSNumber
  };
}
