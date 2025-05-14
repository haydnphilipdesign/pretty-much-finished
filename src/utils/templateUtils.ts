import { BuyerCoverSheet, SellerCoverSheet, DualAgentCoverSheet } from '@/types/clientTypes';

/**
 * Format currency value
 */
export const formatCurrency = (value?: number | string): string => {
  if (!value) return '';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numValue);
};

/**
 * Format percentage value
 */
export const formatPercentage = (value?: number | string): string => {
  if (!value) return '';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${numValue}%`;
};

/**
 * Format date value
 */
export const formatDate = (value?: string | Date): string => {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Process Airtable record for Buyer's Agent cover sheet
 */
export const processBuyerCoverSheet = (record: any): BuyerCoverSheet => {
  return {
    // Property Information
    propertyAddress: record.fields?.['PROPERTY STREET ADDRESS'] || '',
    mlsNumber: record.fields?.['MLS#'] || '',
    salePrice: formatCurrency(record.fields?.['SALE PRICE']),
    propertyStatus: record.fields?.['SALE STATUS'] || 'Pending',
    
    // Agent Information
    agentName: record.fields?.['AGENT NAME'] || '',
    agentRole: 'BUYERS AGENT',
    agentEmail: record.fields?.['AGENT EMAIL'] || '',
    agentPhone: record.fields?.['AGENT PHONE'] || '',
    
    // Commission Details
    totalCommissionPercent: record.fields?.['COMMISSION %'] || 0,
    buyersAgentPercent: record.fields?.['BUYERS AGENT %'] || 0,
    brokerFee: record.fields?.['BROKER COMMISSION'] || 0,
    
    // Dates
    submissionDate: formatDate(record.fields?.['DATE SUBMITTED']),
    closingDate: formatDate(record.fields?.['CLOSING DATE']),
    
    // Additional Information
    specialInstructions: record.fields?.['SPECIAL INSTRUCTIONS'] || '',
    urgentIssues: record.fields?.['URGENT'] ? 'Yes' : 'No',
    notes: record.fields?.['NOTES'] || '',
    
    // Template specific fields initialized
    aosDistribution: {},
    deposits: {},
    inspections: {},
    mortgage: {}
  };
};

/**
 * Process Airtable record for Listing Agent cover sheet
 */
export const processSellerCoverSheet = (record: any): SellerCoverSheet => {
  return {
    // Property Information
    propertyAddress: record.fields?.['PROPERTY STREET ADDRESS'] || '',
    mlsNumber: record.fields?.['MLS#'] || '',
    salePrice: formatCurrency(record.fields?.['SALE PRICE']),
    propertyStatus: record.fields?.['SALE STATUS'] || 'Pending',
    
    // Agent Information
    agentName: record.fields?.['AGENT NAME'] || '',
    agentRole: 'LISTING AGENT',
    agentEmail: record.fields?.['AGENT EMAIL'] || '',
    agentPhone: record.fields?.['AGENT PHONE'] || '',
    
    // Commission Details
    totalCommissionPercent: record.fields?.['COMMISSION %'] || 0,
    listingAgentPercent: record.fields?.['LISTING AGENT %'] || 0,
    brokerFee: record.fields?.['BROKER COMMISSION'] || 0,
    
    // Dates
    submissionDate: formatDate(record.fields?.['DATE SUBMITTED']),
    closingDate: formatDate(record.fields?.['CLOSING DATE']),
    
    // Additional Information
    specialInstructions: record.fields?.['SPECIAL INSTRUCTIONS'] || '',
    urgentIssues: record.fields?.['URGENT'] ? 'Yes' : 'No',
    notes: record.fields?.['NOTES'] || '',
    
    // Template specific fields initialized
    sellerAttendance: {},
    propertyDocs: {},
    repairs: {},
    warranty: {}
  };
};

/**
 * Process Airtable record for Dual Agent cover sheet
 */
export const processDualAgentCoverSheet = (record: any): DualAgentCoverSheet => {
  const buyerData = processBuyerCoverSheet(record);
  const sellerData = processSellerCoverSheet(record);
  
  return {
    ...buyerData,
    ...sellerData,
    agentRole: 'DUAL AGENT',
    dualAgentDisclosure: {
      signed: record.fields?.['DUAL AGENT DISCLOSURE SIGNED'] || false,
      date: formatDate(record.fields?.['DUAL AGENT DISCLOSURE DATE'])
    }
  };
};

/**
 * Process Airtable record based on agent role
 */
export const processCoverSheetData = (record: any, role: string) => {
  switch (role.toUpperCase()) {
    case 'BUYERS AGENT':
      return processBuyerCoverSheet(record);
    case 'LISTING AGENT':
      return processSellerCoverSheet(record);
    case 'DUAL AGENT':
      return processDualAgentCoverSheet(record);
    default:
      throw new Error(`Invalid agent role: ${role}`);
  }
}; 