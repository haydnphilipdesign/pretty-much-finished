import { BuyerCoverSheet, SellerCoverSheet, DualAgentCoverSheet } from '@/types/clientTypes';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Validate required fields
 */
const validateRequiredFields = (data: any, fields: string[]): ValidationError[] => {
  return fields
    .filter(field => !data[field])
    .map(field => ({
      field,
      message: `${field} is required`,
      severity: 'error'
    }));
};

/**
 * Validate numeric fields
 */
const validateNumericFields = (data: any, fields: string[]): ValidationError[] => {
  return fields
    .filter(field => data[field] && isNaN(parseFloat(data[field])))
    .map(field => ({
      field,
      message: `${field} must be a number`,
      severity: 'error'
    }));
};

/**
 * Validate date fields
 */
const validateDateFields = (data: any, fields: string[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  for (const field of fields) {
    // Skip if field doesn't exist
    if (!data[field]) continue;
    
    // Check if it's a valid date
    const date = new Date(data[field]);
    if (isNaN(date.getTime())) {
      errors.push({
        field,
        message: `${field} must be a valid date`,
        severity: 'error'
      });
      continue;
    }
    
    // For closing dates, add extra validation for reasonable ranges
    if (field === 'closingDate') {
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check if date is too far in the future (more than 90 days)
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 90);
      
      if (date > maxDate) {
        errors.push({
          field,
          message: 'Closing date must be within 90 days from today',
          severity: 'error'
        });
      }
    }
  }
  
  return errors;
};

/**
 * Validate phone number format
 */
const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?1?\s*\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

/**
 * Validate MLS number format
 */
const validateMlsNumber = (mls: string): boolean => {
  // Adjust regex based on your MLS number format
  const mlsRegex = /^[A-Z0-9]{5,12}$/i;
  return mlsRegex.test(mls);
};

/**
 * Validate commission percentages
 */
const validateCommissionPercentages = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (data.totalCommissionPercent) {
    const total = parseFloat(data.totalCommissionPercent);
    if (total <= 0 || total > 100) {
      errors.push({
        field: 'totalCommissionPercent',
        message: 'Total commission must be between 0 and 100',
        severity: 'error'
      });
    }
  }

  // For dual agents, validate that percentages add up correctly
  if (data.agentRole === 'DUAL AGENT' && data.listingAgentPercent && data.buyersAgentPercent) {
    const listing = parseFloat(data.listingAgentPercent);
    const buyers = parseFloat(data.buyersAgentPercent);
    const total = parseFloat(data.totalCommissionPercent);

    if (Math.abs((listing + buyers) - total) > 0.01) {
      errors.push({
        field: 'commissionPercentages',
        message: 'Listing and buyer agent percentages must sum to total commission',
        severity: 'error'
      });
    }
  }

  return errors;
};

/**
 * Validate common fields for all cover sheets
 */
const validateCommonFields = (data: any): ValidationError[] => {
  const requiredFields = ['propertyAddress', 'agentName', 'agentRole'];
  const numericFields = ['salePrice', 'totalCommissionPercent', 'brokerFee'];
  const dateFields = ['submissionDate', 'closingDate'];
  const errors = [
    ...validateRequiredFields(data, requiredFields),
    ...validateNumericFields(data, numericFields),
    ...validateDateFields(data, dateFields),
    ...validateCommissionPercentages(data)
  ];

  // Validate phone number if present
  if (data.agentPhone && !validatePhoneNumber(data.agentPhone)) {
    errors.push({
      field: 'agentPhone',
      message: 'Invalid phone number format',
      severity: 'error'
    });
  }

  // Validate MLS number if present
  if (data.mlsNumber && !validateMlsNumber(data.mlsNumber)) {
    errors.push({
      field: 'mlsNumber',
      message: 'Invalid MLS number format',
      severity: 'error'
    });
  }

  return errors;
};

/**
 * Validate Buyer's Agent cover sheet
 */
export const validateBuyerCoverSheet = (data: BuyerCoverSheet): ValidationResult => {
  const errors: ValidationError[] = [
    ...validateCommonFields(data),
    ...validateNumericFields(data, ['buyersAgentPercent'])
  ];

  // Validate deposits if present
  if (data.deposits) {
    if (data.deposits.firstDeposit?.amount && isNaN(data.deposits.firstDeposit.amount)) {
      errors.push({
        field: 'deposits.firstDeposit.amount',
        message: 'First deposit amount must be a number',
        severity: 'error'
      });
    }
    if (data.deposits.secondDeposit?.amount && isNaN(data.deposits.secondDeposit.amount)) {
      errors.push({
        field: 'deposits.secondDeposit.amount',
        message: 'Second deposit amount must be a number',
        severity: 'error'
      });
    }
  }

  // Add warnings for recommended fields
  if (!data.mortgage?.type) {
    errors.push({
      field: 'mortgage.type',
      message: 'Mortgage type is recommended',
      severity: 'warning'
    });
  }

  return {
    isValid: !errors.some(e => e.severity === 'error'),
    errors
  };
};

/**
 * Validate Listing Agent cover sheet
 */
export const validateSellerCoverSheet = (data: SellerCoverSheet): ValidationResult => {
  const errors: ValidationError[] = [
    ...validateCommonFields(data),
    ...validateNumericFields(data, ['listingAgentPercent'])
  ];

  // Validate warranty if present
  if (data.warranty) {
    if (data.warranty.cost && isNaN(data.warranty.cost)) {
      errors.push({
        field: 'warranty.cost',
        message: 'Warranty cost must be a number',
        severity: 'error'
      });
    }
    if (data.warranty.included && !data.warranty.company) {
      errors.push({
        field: 'warranty.company',
        message: 'Warranty company is required when warranty is included',
        severity: 'error'
      });
    }
  }

  // Add warnings for recommended fields
  if (!data.propertyDocs?.certificateOfOccupancy?.inspectionDate) {
    errors.push({
      field: 'propertyDocs.certificateOfOccupancy.inspectionDate',
      message: 'C/O inspection date is recommended',
      severity: 'warning'
    });
  }

  return {
    isValid: !errors.some(e => e.severity === 'error'),
    errors
  };
};

/**
 * Validate Dual Agent cover sheet
 */
export const validateDualAgentCoverSheet = (data: DualAgentCoverSheet): ValidationResult => {
  const buyerValidation = validateBuyerCoverSheet(data);
  const sellerValidation = validateSellerCoverSheet(data);

  // Combine errors from both validations
  const errors = [...buyerValidation.errors, ...sellerValidation.errors];

  // Add dual agent specific validations
  if (!data.dualAgentDisclosure?.signed) {
    errors.push({
      field: 'dualAgentDisclosure.signed',
      message: 'Dual agent disclosure must be signed',
      severity: 'error'
    });
  }

  return {
    isValid: !errors.some(e => e.severity === 'error'),
    errors
  };
};

/**
 * Validate cover sheet data based on agent role
 */
export const validateCoverSheetData = (data: any, role: string): ValidationResult => {
  switch (role.toUpperCase()) {
    case 'BUYERS AGENT':
      return validateBuyerCoverSheet(data as BuyerCoverSheet);
    case 'LISTING AGENT':
      return validateSellerCoverSheet(data as SellerCoverSheet);
    case 'DUAL AGENT':
      return validateDualAgentCoverSheet(data as DualAgentCoverSheet);
    default:
      return {
        isValid: false,
        errors: [{
          field: 'agentRole',
          message: `Invalid agent role: ${role}`,
          severity: 'error'
        }]
      };
  }
}; 