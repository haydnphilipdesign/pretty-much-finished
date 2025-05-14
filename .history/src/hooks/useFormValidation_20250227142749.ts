import { useState, useCallback } from 'react';
import { useForm } from '../components/TransactionForm/context/FormContext';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  fields: string[];
}

export function useFormValidation() {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: {},
    fields: []
  });

  const { state } = useForm();

  // Validate a specific field
  const validateField = useCallback((fieldName: string, value: any): string | null => {
    // Basic validation rules - expand as needed
    if (value === undefined || value === null || value === '') {
      return 'This field is required';
    }

    // Email validation
    if (fieldName.includes('email') && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (fieldName.includes('phone') && typeof value === 'string') {
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number';
      }
    }

    // Price/monetary validation
    if ((fieldName.includes('price') || fieldName.includes('cost') || fieldName.includes('commission')) && 
        typeof value === 'string') {
      const priceRegex = /^\$?[0-9]+(\.[0-9]{1,2})?$/;
      if (!priceRegex.test(value.toString().replace(/,/g, ''))) {
        return 'Please enter a valid amount';
      }
    }

    return null;
  }, []);

  // Validate the entire form
  const validateForm = useCallback((): ValidationResult => {
    const errors: Record<string, string> = {};
    const fields: string[] = [];
    
    // Get all fields that need validation
    Object.entries(state.formData).forEach(([key, value]) => {
      // Skip validation for certain fields
      if (key.startsWith('_') || key === 'id' || key === 'createdAt' || key === 'updatedAt') {
        return;
      }
      
      fields.push(key);
      const error = validateField(key, value);
      if (error) {
        errors[key] = error;
      }
    });

    const result = {
      isValid: Object.keys(errors).length === 0,
      errors,
      fields
    };

    setValidationResult(result);
    return result;
  }, [state.formData, validateField]);

  // Validate a specific section of the form
  const validateSection = useCallback((sectionFields: string[]): ValidationResult => {
    const errors: Record<string, string> = {};
    
    sectionFields.forEach(field => {
      const value = state.formData[field];
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
      }
    });

    const result = {
      isValid: Object.keys(errors).length === 0,
      errors,
      fields: sectionFields
    };

    setValidationResult(result);
    return result;
  }, [state.formData, validateField]);

  return {
    validationResult,
    validateField,
    validateForm,
    validateSection
  };
}