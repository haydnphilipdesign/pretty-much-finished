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
  return fields
    .filter(field => data[field] && isNaN(Date.parse(data[field])))
    .map(field => ({
      field,
      message: `${field} must be a valid date`,
      severity: 'error'
    }));
};

/**
 * Validate common fields for all cover sheets
 */
const validateCommonFields = (data: any): ValidationError[] => {
  const requiredFields = ['propertyAddress', 'agentName', 'agentRole'];
  const numericFields = ['salePrice', 'totalCommissionPercent', 'brokerFee'];
  const dateFields = ['submissionDate', 'closingDate'];

  return [
    ...validateRequiredFields(data, requiredFields),
    ...validateNumericFields(data, numericFields),
    ...validateDateFields(data, dateFields)
  ];
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