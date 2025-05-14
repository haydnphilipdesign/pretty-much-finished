// Unified validation service for transaction forms
import { FormData, AgentRole, Client, PropertyData, CommissionData } from '../types/transaction';

export type ValidationState = 'valid' | 'invalid' | 'warning' | 'pristine';

export interface ValidationResult {
  isValid: boolean;
  state: ValidationState;
  errors: Record<string, string>;
  fields?: string[];
  missingRequiredFields?: string[];
};

// Define required fields by section
const requiredFields = {
  propertyData: ['mlsNumber', 'address', 'salePrice', 'county'],
  clients: ['name', 'email', 'phone', 'address', 'maritalStatus', 'type'],
  commissionData: ['totalCommission', 'listingAgentCommission', 'buyersAgentCommission'],
  propertyDetailsData: ['municipality'],
  titleCompanyData: ['titleCompanyName'],
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
    hasWarranty: {
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

export class FormValidationService {
  /**
   * Validates a specific field
   */
  validateField(fieldName: string, value: any, isRequired?: boolean): string | undefined {
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
  }

  /**
   * Validates a client object
   */
  validateClient(client: Client): Record<string, string> {
    const errors: Record<string, string> = {};
    
    // Name validation
    if (!client.name) {
      errors.name = 'Name is required';
    } else {
      const nameRegex = /^[A-Za-z\s'-]{2,}$/;
      if (!nameRegex.test(client.name)) {
        errors.name = 'Name contains invalid characters';
      } else {
        const nameParts = client.name.trim().split(/\s+/);
        if (nameParts.length < 2) {
          errors.name = 'Please enter full name (first and last)';
        }
      }
    }
    
    // Email validation - only validate if provided
    if (client.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(client.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    // Phone validation - only validate if provided
    if (client.phone) {
      const digitsOnly = client.phone.replace(/\D/g, '');
      if (digitsOnly.length !== 10) {
        errors.phone = 'Please enter a valid 10-digit phone number';
      }
    }
    
    // Address validation
    if (!client.address) {
      errors.address = 'Address is required';
    }
    
    // Type validation
    if (!client.type) {
      errors.type = 'Client type is required';
    }
    
    // Marital status validation
    if (!client.maritalStatus) {
      errors.maritalStatus = 'Marital status is required';
    }
    
    return errors;
  }

  /**
   * Validates property data
   */
  validatePropertyData(propertyData: PropertyData): Record<string, string> {
    const errors: Record<string, string> = {};
    
    if (!propertyData.mlsNumber) {
      errors.mlsNumber = 'MLS number is required';
    }
    
    if (!propertyData.address) {
      errors.address = 'Property address is required';
    }
    
    if (!propertyData.salePrice) {
      errors.salePrice = 'Sale price is required';
    } else if (isNaN(Number(propertyData.salePrice.replace(/[^0-9.-]+/g, '')))) {
      errors.salePrice = 'Sale price must be a valid number';
    }
    
    if (!propertyData.county) {
      errors.county = 'County is required';
    }
    
    return errors;
  }

  /**
   * Validates commission data
   */
  validateCommissionData(commissionData: CommissionData): Record<string, string> {
    const errors: Record<string, string> = {};
    
    if (!commissionData.totalCommission) {
      errors.totalCommission = 'Total commission is required';
    } else if (isNaN(Number(commissionData.totalCommission.replace(/[^0-9.-]+/g, '')))) {
      errors.totalCommission = 'Total commission must be a valid number';
    }
    
    if (!commissionData.listingAgentCommission) {
      errors.listingAgentCommission = 'Listing agent commission is required';
    } else if (isNaN(Number(commissionData.listingAgentCommission.replace(/[^0-9.-]+/g, '')))) {
      errors.listingAgentCommission = 'Listing agent commission must be a valid number';
    }
    
    if (!commissionData.buyersAgentCommission) {
      errors.buyersAgentCommission = 'Buyer\'s agent commission is required';
    } else if (isNaN(Number(commissionData.buyersAgentCommission.replace(/[^0-9.-]+/g, '')))) {
      errors.buyersAgentCommission = 'Buyer\'s agent commission must be a valid number';
    }
    
    // Conditional validation for referral fields
    if (commissionData.isReferral) {
      if (!commissionData.referralParty) {
        errors.referralParty = 'Referral party is required when referral is selected';
      }
      
      if (!commissionData.referralFee) {
        errors.referralFee = 'Referral fee is required when referral is selected';
      } else if (isNaN(Number(commissionData.referralFee.replace(/[^0-9.-]+/g, '')))) {
        errors.referralFee = 'Referral fee must be a valid number';
      }
      
      if (!commissionData.brokerEin) {
        errors.brokerEin = 'Broker EIN is required when referral is selected';
      }
    }
    
    return errors;
  }

  /**
   * Check if a field is required based on context
   */
  isFieldRequired(section: string, field: string, formData: Record<string, any>, role?: string): boolean {
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
  }

  /**
   * Validates a specific section of the form
   */
  validateSection(section: string, sectionData: Record<string, any>, formData: FormData, role?: AgentRole): ValidationResult {
    const errors: Record<string, string> = {};
    const missingRequiredFields: string[] = [];
    
    // Handle special validation for specific sections
    if (section === 'propertyData') {
      Object.assign(errors, this.validatePropertyData(sectionData as PropertyData));
    } else if (section === 'commissionData') {
      Object.assign(errors, this.validateCommissionData(sectionData as CommissionData));
    } else if (section === 'clients') {
      // For clients array, validate each client
      const clients = sectionData as Client[];
      clients.forEach((client, index) => {
        const clientErrors = this.validateClient(client);
        
        // Add client errors with index prefix
        Object.entries(clientErrors).forEach(([field, error]) => {
          errors[`client${index}.${field}`] = error;
        });
      });
    } else {
      // Generic validation for other sections
      Object.entries(sectionData).forEach(([field, value]) => {
        // Skip validation for certain fields
        if (field.startsWith('_') || field === 'id') {
          return;
        }
        
        const isRequired = this.isFieldRequired(section, field, formData, role);
        const error = this.validateField(field, value, isRequired);
        
        if (error) {
          errors[field] = error;
          if (isRequired && (value === undefined || value === '')) {
            missingRequiredFields.push(`${section}.${field}`);
          }
        }
      });
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      state: Object.keys(errors).length === 0 ? 'valid' : 'invalid',
      errors,
      missingRequiredFields
    };
  }

  /**
   * Validates the entire form
   */
  validateForm(formData: FormData, role?: AgentRole): ValidationResult {
    const errors: Record<string, string> = {};
    const missingRequiredFields: string[] = [];
    
    // Validate each section
    Object.entries(formData).forEach(([section, sectionData]) => {
      // Skip validation for certain sections
      if (section.startsWith('_') || section === 'id' || section === 'createdAt' || section === 'updatedAt') {
        return;
      }
      
      if (typeof sectionData === 'object' && sectionData !== null) {
        const sectionResult = this.validateSection(section, sectionData, formData, role);
        
        // Merge errors and missing fields
        Object.assign(errors, sectionResult.errors);
        if (sectionResult.missingRequiredFields) {
          missingRequiredFields.push(...sectionResult.missingRequiredFields);
        }
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      state: Object.keys(errors).length === 0 ? 'valid' : 'invalid',
      errors,
      missingRequiredFields
    };
  }
}

// Export a singleton instance for use throughout the application
export const formValidationService = new FormValidationService();

// Hook-compatible validation functions
export function validateField(fieldName: string, value: any, isRequired?: boolean): string | undefined {
  return formValidationService.validateField(fieldName, value, isRequired);
}

export function validateSection(section: string, sectionData: Record<string, any>, formData: FormData, role?: AgentRole): ValidationResult {
  return formValidationService.validateSection(section, sectionData, formData, role);
}

export function validateForm(formData: FormData, role?: AgentRole): ValidationResult {
  return formValidationService.validateForm(formData, role);
}