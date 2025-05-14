import { useState, useCallback } from 'react';
import { useForm } from '../components/TransactionForm/context/FormContext';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  fields: string[];
  missingRequiredFields: string[];
}

// Define required fields by section
const requiredFields = {
  propertyData: ['mlsNumber', 'address', 'salePrice', 'county'],
  clients: ['name', 'email', 'phone', 'address', 'maritalStatus', 'type'],
  commissionData: ['totalCommission', 'listingAgentCommission', 'buyersAgentCommission'],
  propertyDetailsData: ['municipality'],
  titleCompanyData: ['titleCompanyName', 'titleCompanyContact', 'titleCompanyPhone', 'titleCompanyEmail'],
  signatureData: ['date']
};

// Define conditional required fields based on other field values
const conditionalRequiredFields = {
  commissionData: {
    isReferral: {
      true: ['referralParty', 'referralFee', 'brokerEin']
    }
  },
  propertyDetailsData: {
    resaleCertRequired: {
      true: ['hoaName']
    },
    firstRightOfRefusal: {
      true: ['firstRightName']
    },
    attorneyRepresentation: {
      true: ['attorneyName']
    }
  },
  warrantyData: {
    homeWarranty: {
      true: ['warrantyCompany', 'warrantyCost']
    }
  },
  signatureData: {
    // Based on role
    role: {
      'listingAgent': ['listingAgent', 'listingLicense', 'listingBroker'],
      'buyersAgent': ['buyersAgent', 'buyersLicense', 'buyersBroker'],
      'dualAgent': ['listingAgent', 'listingLicense', 'listingBroker', 'buyersAgent', 'buyersLicense', 'buyersBroker']
    }
  }
};

export function useFormValidation() {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: {},
    fields: [],
    missingRequiredFields: []
  });

  const { state } = useForm();

  // Validate a specific field
  const validateField = useCallback((fieldName: string, value: any, isRequired?: boolean): string | undefined => {
    // Convert null to undefined for consistent handling
    if (value === null) {
      value = undefined;
    }

    // Only check for empty value if field is required
    if (isRequired && (value === undefined || value === '')) {
      return 'This field is required';
    }
    // Skip validation for empty non-required fields
    if (!isRequired && (value === undefined || value === '')) {
      return undefined;
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
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length !== 10) {
        return 'Please enter a valid 10-digit phone number';
      }
    }
    // Price/monetary validation
    if ((fieldName.includes('price') || fieldName.includes('cost') || fieldName.includes('commission') ||
         fieldName.includes('assist')) && typeof value === 'string') {
      const priceRegex = /^\$?[0-9,]+(\.[0-9]{1,2})?$/;
      if (!priceRegex.test(value.toString().replace(/,/g, ''))) {
        return 'Please enter a valid amount';
      }
    }
    return undefined;
  }, []);

  // Check if a field is required based on context
  const isFieldRequired = useCallback((section: string, field: string, formData: Record<string, any>, role?: string): boolean => {
    // Check base required fields
    if (requiredFields[section as keyof typeof requiredFields]?.includes(field)) {
      return true;
    }

    // Check conditional required fields
    const conditionalSection = conditionalRequiredFields[section as keyof typeof conditionalRequiredFields];
    if (conditionalSection) {
      for (const [conditionField, conditions] of Object.entries(conditionalSection)) {
        if (conditionField === 'role' && role) {
          const roleConditions = conditions as Record<string, string[]>;
          if (roleConditions[role]?.includes(field)) {
            return true;
          }
        } else {
          const fieldValue = formData[conditionField];
          const fieldConditions = conditions as Record<string, string[]>;
          
          if (fieldValue !== undefined &&
              fieldConditions[String(fieldValue)]?.includes(field)) {
            return true;
          }
        }
      }
    }

    return false;
  }, []);

  // Validate the entire form
  const validateForm = useCallback((): ValidationResult => {
    const errors: Record<string, string> = {};
    const fields: string[] = [];
    const missingRequiredFields: string[] = [];
    
    // Get all fields that need validation
    Object.entries(state.formData).forEach(([section, sectionData]) => {
      // Skip validation for certain fields
      if (section.startsWith('_') || section === 'id' || section === 'createdAt' || section === 'updatedAt') {
        return;
      }
      
      if (typeof sectionData === 'object' && sectionData !== null) {
        // Handle nested objects
        Object.entries(sectionData as Record<string, any>).forEach(([field, value]) => {
          const fullFieldName = `${section}.${field}`;
          fields.push(fullFieldName);
          
          // Check if field is required
          const isRequired = isFieldRequired(section, field, sectionData as Record<string, any>, state.selectedRole || undefined);
          
          if (isRequired && (value === undefined || value === null || value === '')) {
            errors[fullFieldName] = 'This field is required';
            missingRequiredFields.push(fullFieldName);
          } else if (value !== undefined && value !== null && value !== '') {
            const error = validateField(field, value, isRequired);
            if (error) {
              errors[fullFieldName] = error;
            }
          }
        });
      } else if (Array.isArray(sectionData)) {
        // Handle arrays (like clients)
        sectionData.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            Object.entries(item).forEach(([field, value]) => {
              const fullFieldName = `${section}[${index}].${field}`;
              fields.push(fullFieldName);
              
              // Check if field is required
              const isRequired = isFieldRequired(section, field, item, state.selectedRole || undefined);
              
              if (isRequired && (value === undefined || value === null || value === '')) {
                errors[fullFieldName] = 'This field is required';
                missingRequiredFields.push(fullFieldName);
              } else if (value !== undefined && value !== null && value !== '') {
                const error = validateField(field, value, item);
                if (error) {
                  errors[fullFieldName] = error;
                }
              }
            });
          }
        });
      }
    });

    const result = {
      isValid: Object.keys(errors).length === 0,
      errors,
      fields,
      missingRequiredFields
    };

    setValidationResult(result);
    return result;
  }, [state.formData, state.selectedRole, validateField, isFieldRequired]);

  // Validate a specific section of the form
  const validateSection = useCallback((sectionName: string): ValidationResult => {
    const errors: Record<string, string> = {};
    const fields: string[] = [];
    const missingRequiredFields: string[] = [];
    
    const sectionData = state.formData[sectionName];
    
    if (typeof sectionData === 'object' && sectionData !== null) {
      if (Array.isArray(sectionData)) {
        // Handle arrays (like clients)
        sectionData.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            Object.entries(item).forEach(([field, value]) => {
              const fullFieldName = `${sectionName}[${index}].${field}`;
              fields.push(fullFieldName);
              
              // Check if field is required
              const isRequired = isFieldRequired(sectionName, field, item, state.selectedRole || undefined);
              
              if (isRequired && (value === undefined || value === null || value === '')) {
                errors[fullFieldName] = 'This field is required';
                missingRequiredFields.push(fullFieldName);
              } else if (value !== undefined && value !== null && value !== '') {
                const error = validateField(field, value, item);
                if (error) {
                  errors[fullFieldName] = error;
                }
              }
            });
          }
        });
      } else {
        // Handle nested objects
        Object.entries(sectionData as Record<string, any>).forEach(([field, value]) => {
          const fullFieldName = `${sectionName}.${field}`;
          fields.push(fullFieldName);
          
          // Check if field is required
          const isRequired = isFieldRequired(sectionName, field, sectionData as Record<string, any>, state.selectedRole || undefined);
          
          if (isRequired && (value === undefined || value === null || value === '')) {
            errors[fullFieldName] = 'This field is required';
            missingRequiredFields.push(fullFieldName);
          } else if (value !== undefined && value !== null && value !== '') {
            const error = validateField(field, value, sectionData as Record<string, any>);
            if (error) {
              errors[fullFieldName] = error;
            }
          }
        });
      }
    }

    const result = {
      isValid: Object.keys(errors).length === 0,
      errors,
      fields,
      missingRequiredFields
    };

    setValidationResult(result);
    return result;
  }, [state.formData, state.selectedRole, validateField, isFieldRequired]);

  return {
    validationResult,
    validateField,
    validateForm,
    validateSection,
    isFieldRequired
  };
}