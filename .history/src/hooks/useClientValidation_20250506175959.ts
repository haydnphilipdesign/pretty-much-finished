import { useCallback } from 'react';

type ValidationState = 'valid' | 'invalid' | 'warning';

interface TransactionFormData {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  maritalStatus?: string;
  secondClientName?: string;
  secondClientEmail?: string;
  secondClientPhone?: string;
  secondClientAddress?: string;
  secondClientMaritalStatus?: string;
  propertyData?: any;
  clients?: any[];
  commissionData?: any;
}

interface ValidationResult {
  isValid: boolean;
  state: ValidationState;
  error?: string;
}

export function useClientValidation() {
  const validateEmail = useCallback((email: string): ValidationResult => {
    // If email is empty, it's valid since it's optional
    if (!email) {
      return { isValid: true, state: 'valid' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, state: 'invalid', error: 'Please enter a valid email address' };
    }

    return { isValid: true, state: 'valid' };
  }, []);

  const validatePhone = useCallback((phone: string): ValidationResult => {
    // If phone is empty, it's valid since it's optional
    if (!phone) {
      return { isValid: true, state: 'valid' };
    }

    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return { isValid: false, state: 'invalid', error: 'Phone number must be in format (XXX) XXX-XXXX' };
    }

    return { isValid: true, state: 'valid' };
  }, []);

  const validateName = useCallback((name: string): ValidationResult => {
    if (!name) {
      return { isValid: false, state: 'invalid', error: 'Name is required' };
    }

    const nameRegex = /^[A-Za-z\s'-]{2,}$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, state: 'warning', error: 'Name contains invalid characters' };
    }

    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      return { isValid: false, state: 'warning', error: 'Please enter full name (first and last)' };
    }

    return { isValid: true, state: 'valid' };
  }, []);

  const validateAddress = useCallback((address: string): ValidationResult => {
    if (!address) {
      return { isValid: false, state: 'invalid', error: 'Address is required' };
    }

    // Basic address format validation
    const hasStreetNumber = /\d+/.test(address);
    const hasStreetName = /\s[A-Za-z]+/.test(address);
    const hasStateZip = /[A-Z]{2}\s+\d{5}(-\d{4})?$/.test(address);

    if (!hasStreetNumber || !hasStreetName) {
      return { isValid: false, state: 'warning', error: 'Please enter a complete street address' };
    }

    if (!hasStateZip) {
      return { isValid: false, state: 'warning', error: 'Please include state and ZIP code' };
    }

    return { isValid: true, state: 'valid' };
  }, []);

  const validateSecondClient = useCallback((formData: TransactionFormData): ValidationResult => {
    // If any second client field is filled, name becomes required
    const hasAnySecondClientInfo = !!(
      formData.secondClientName ||
      formData.secondClientEmail ||
      formData.secondClientPhone ||
      formData.secondClientAddress ||
      formData.secondClientMaritalStatus
    );

    if (!hasAnySecondClientInfo) {
      return { isValid: true, state: 'valid' };
    }

    // Validate required fields for second client
    if (!formData.secondClientName) {
      return { isValid: false, state: 'invalid', error: 'Second client name is required when any second client information is provided' };
    }

    // Email and phone are now optional, don't validate if missing
    
    if (!formData.secondClientMaritalStatus) {
      return { isValid: false, state: 'invalid', error: 'Second client marital status is required when any second client information is provided' };
    }

    // Cross-validate marital statuses
    if (formData.maritalStatus === 'Married' && formData.secondClientMaritalStatus !== 'Married') {
      return { isValid: false, state: 'warning', error: 'Marital status must be consistent between clients if married to each other' };
    }

    // Validate different addresses
    if (formData.secondClientAddress && formData.secondClientAddress !== formData.clientAddress) {
      return { isValid: true, state: 'warning', error: 'Different addresses require explanation in notes' };
    }

    return { isValid: true, state: 'valid' };
  }, []);

  return {
    validateEmail,
    validatePhone,
    validateName,
    validateAddress,
    validateSecondClient
  };
}
