/**
 * Client-side type definitions
 * These types are safe to use in browser code
 */

/**
 * Cover sheet generation options
 */
export interface CoverSheetOptions {
  tableId: string;
  recordId: string;
  agentRole?: 'BUYERS AGENT' | 'LISTING AGENT' | 'DUAL AGENT';
  sendEmail?: boolean;
  data?: Record<string, any>;
}

/**
 * Cover sheet generation response
 */
export interface CoverSheetResponse {
  success: boolean;
  message: string;
  filename?: string;
  path?: string;
  emailSent?: boolean;
  error?: string;
}

/**
 * Email attachment metadata
 */
export interface EmailAttachment {
  filename: string;
  path: string;
  contentType?: string;
}

/**
 * Email options
 */
export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
}

/**
 * Generate PDF options
 */
export interface GeneratePdfOptions {
  template: string;
  data: Record<string, any>;
  filename: string;
}

/**
 * Property data structure
 */
export interface PropertyData {
  address: string;
  mlsNumber?: string;
  salePrice?: number | string;
  status?: string;
  isWinterized?: boolean;
  updateMls?: boolean;
}

/**
 * Client data structure
 */
export interface ClientData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  type: 'BUYER' | 'SELLER';
  maritalStatus?: string;
}

/**
 * Commission data structure
 */
export interface CommissionData {
  totalCommissionPercentage?: number | string;
  listingAgentPercentage?: number | string;
  buyersAgentPercentage?: number | string;
  hasBrokerFee?: boolean;
  brokerFeeAmount?: number | string;
  hasSellersAssist?: boolean;
  sellersAssist?: number | string;
  isReferral?: boolean;
  referralParty?: string;
  referralFee?: number | string;
  brokerEin?: string;
}

/**
 * Additional information structure
 */
export interface AdditionalInfo {
  specialInstructions?: string;
  urgentIssues?: string;
  notes?: string;
} 