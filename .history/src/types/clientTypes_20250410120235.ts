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
  emailError?: string;
  emailMessageId?: string;
  validationErrors?: ValidationError[];
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

/**
 * Cover sheet section status
 */
export type SectionStatus = {
  completed: boolean;
  date?: string;
  notes?: string;
};

/**
 * Cover sheet common sections
 */
export interface CoverSheetBase {
  // Property Information
  propertyAddress: string;
  mlsNumber?: string;
  salePrice?: number | string;
  propertyStatus?: 'Active' | 'Pending' | 'Closed' | 'Withdrawn';
  isWinterized?: boolean;

  // Agent Information
  agentName: string;
  agentRole: 'BUYERS AGENT' | 'LISTING AGENT' | 'DUAL AGENT';
  agentEmail?: string;
  agentPhone?: string;

  // Commission Details
  totalCommissionPercent?: number;
  listingAgentPercent?: number;
  buyersAgentPercent?: number;
  brokerFee?: number;
  sellersAssist?: number;

  // Dates
  submissionDate: string;
  closingDate?: string;
  mortgageCommitmentDate?: string;

  // Status Tracking
  emailsSent?: SectionStatus;
  depositsReceived?: SectionStatus;
  inspectionsScheduled?: SectionStatus;
  appraisalStatus?: SectionStatus;
  closingConfirmed?: SectionStatus;

  // Additional Information
  specialInstructions?: string;
  urgentIssues?: string;
  notes?: string;
}

/**
 * Buyer's Agent specific fields
 */
export interface BuyerCoverSheet extends CoverSheetBase {
  // AOS Distribution
  aosDistribution?: {
    sentToClient?: boolean;
    sentToBank?: boolean;
    sentToAttorney?: boolean;
    introductionEmailSent?: boolean;
  };

  // Deposits
  deposits?: {
    firstDeposit?: {
      amount?: number;
      received?: boolean;
      date?: string;
    };
    secondDeposit?: {
      amount?: number;
      received?: boolean;
      date?: string;
    };
  };

  // Inspections
  inspections?: {
    scheduled?: boolean;
    types?: {
      general?: boolean;
      termite?: boolean;
      radon?: boolean;
      water?: boolean;
      septic?: boolean;
    };
    reports?: {
      received?: boolean;
      sentToClient?: boolean;
      date?: string;
    };
    brtiStatus?: {
      received?: boolean;
      sent?: boolean;
      signed?: boolean;
    };
  };

  // Mortgage
  mortgage?: {
    type?: string;
    applicationSubmitted?: boolean;
    commitmentReceived?: boolean;
    appraisalOrdered?: boolean;
    appraisalCompleted?: boolean;
    repairsNeeded?: boolean;
    repairsCompleted?: boolean;
  };
}

/**
 * Listing Agent specific fields
 */
export interface SellerCoverSheet extends CoverSheetBase {
  // Seller Attendance
  sellerAttendance?: {
    willAttend?: boolean;
    signedEarly?: boolean;
    mailedDocs?: boolean;
  };

  // Property Documentation
  propertyDocs?: {
    resaleCert?: {
      ordered?: boolean;
      received?: boolean;
      sentToBuyer?: boolean;
      sentToTitle?: boolean;
    };
    certificateOfOccupancy?: {
      ordered?: boolean;
      received?: boolean;
      inspectionDate?: string;
    };
  };

  // Repairs and Warranty
  repairs?: {
    needed?: boolean;
    completed?: boolean;
    receiptsReceived?: boolean;
    receiptsForwarded?: boolean;
  };

  warranty?: {
    included?: boolean;
    company?: string;
    cost?: number;
    paidBy?: 'Seller' | 'Buyer';
    ordered?: boolean;
    received?: boolean;
  };
}

/**
 * Dual Agent specific fields
 */
export interface DualAgentCoverSheet extends BuyerCoverSheet, SellerCoverSheet {
  // Additional dual agent specific fields if needed
  dualAgentDisclosure?: {
    signed?: boolean;
    date?: string;
  };
} 