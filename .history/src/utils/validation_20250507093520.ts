import { TransactionFormData } from "@/types/transaction";
import { formatAddress } from "@/utils/addressUtils";

export const validateStep = (
  step: number,
  data: TransactionFormData
): { [key: string]: string[] } => {
  const errors: { [key: string]: string[] } = {};

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^\+?[\d\s-]{10,}$/.test(phone);
  };

  const validateMLS = (mls: string): boolean => {
    return /^(PM-)?[0-9]{6}$/.test(mls);
  };

  // Check if user is a listing agent or dual agent
  const isListingOrDualAgent = 
    data.agentData?.role === "LISTING AGENT" || 
    data.agentData?.role === "DUAL AGENT";

  switch (step) {
    case 1:
      // Agent Role validation
      if (!data.agentData?.role || !['LISTING AGENT', 'BUYERS AGENT', 'DUAL AGENT'].includes(data.agentData.role)) {
        errors.role = ["Please select a valid role to continue"];
      }
      break;

    case 2:
      // Property Information validations
      if (!data.propertyData.mlsNumber && isListingOrDualAgent) {
        errors.mlsNumber = ["MLS number is required for listing and dual agents"];
      } else if (data.propertyData.mlsNumber && !validateMLS(data.propertyData.mlsNumber)) {
        errors.mlsNumber = ["MLS number must be in format: 123456 or PM-123456"];
      }
      
      if (!data.propertyData.address) {
        errors.address = ["Property address is required"];
      }
      
      if (!data.propertyData.salePrice) {
        errors.salePrice = ["Sale price is required"];
      }
      
      if (!data.propertyData.status) {
        errors.status = ["Property status is required"];
      }
      
      if (!data.propertyData.county) {
        errors.county = ["County is required"];
      }
      
      if (!data.propertyData.propertyType) {
        errors.propertyType = ["Property type is required"];
      }
      
      if (!data.propertyData.closingDate) {
        errors.closingDate = ["Closing date is required"];
      }
      
      if (data.propertyData.propertyType === "RESIDENTIAL" && !data.propertyData.propertyAccessType) {
        errors.propertyAccessType = ["Property access type is required for residential properties"];
      }
      break;

    case 3:
      // Client validation
      if (!data.clients || data.clients.length === 0) {
        errors.clients = ["At least one client is required"];
        break;
      }
      
      data.clients.forEach((client, index) => {
        if (!client.name) {
          errors[`client${index}Name`] = ["Client name is required"];
        }
        // Only validate email if provided
        if (client.email && !validateEmail(client.email)) {
          errors[`client${index}Email`] = ["Invalid email format"];
        }
        // Only validate phone if provided
        if (client.phone && !validatePhone(client.phone)) {
          errors[`client${index}Phone`] = ["Invalid phone format"];
        }
        if (!client.address) {
          errors[`client${index}Address`] = ["Client address is required"];
        }
        if (!client.maritalStatus) {
          errors[`client${index}MaritalStatus`] = ["Marital status is required"];
        }
        if (!client.type) {
          errors[`client${index}Type`] = ["Client type is required"];
        }
      });
      break;

    case 4:
      // Commission validation
      if (isListingOrDualAgent && !data.commissionData?.totalCommissionPercentage) {
        errors.totalCommission = ["Total commission is required"];
      }
      
      if (!data.commissionData?.buyersAgentPercentage) {
        errors.buyersAgentPercentage = ["Buyer's agent commission is required"];
      }
      
      if (isListingOrDualAgent && !data.commissionData?.listingAgentPercentage) {
        errors.listingAgentPercentage = ["Listing agent commission is required"];
      }
      
      if (data.commissionData?.hasSellersAssist && !data.commissionData?.sellersAssist) {
        errors.sellersAssist = ["Seller's assist amount is required when enabled"];
      }
      
      if (data.commissionData?.isReferral) {
        if (!data.commissionData.referralParty) {
          errors.referralParty = ["Referral party is required when referral is enabled"];
        }
        if (!data.commissionData.referralFee) {
          errors.referralFee = ["Referral fee is required when referral is enabled"];
        }
        if (!data.commissionData.brokerEin) {
          errors.brokerEin = ["Broker EIN is required when referral is enabled"];
        }
      }
      break;

    case 5:
      // Property details validation
      if (data.propertyDetails?.resaleCertRequired && !data.propertyDetails?.hoaName) {
        errors.hoaName = ["HOA name is required when resale certificate is required"];
      }
      
      if (data.propertyDetails?.firstRightOfRefusal && !data.propertyDetails?.firstRightName) {
        errors.firstRightName = ["First right of refusal name is required when enabled"];
      }
      
      if (data.propertyDetails?.attorneyRepresentation && !data.propertyDetails?.attorneyName) {
        errors.attorneyName = ["Attorney name is required when attorney representation is enabled"];
      }
      
      if (data.propertyDetails?.homeWarranty) {
        if (!data.propertyDetails.warrantyCompany) {
          errors.warrantyCompany = ["Warranty company is required when home warranty is enabled"];
        }
        if (!data.propertyDetails.warrantyCost) {
          errors.warrantyCost = ["Warranty cost is required when home warranty is enabled"];
        }
        if (!data.propertyDetails.warrantyPaidBy) {
          errors.warrantyPaidBy = ["Warranty paid by is required when home warranty is enabled"];
        }
      }
      break;

    case 6:
      // Validate documents confirmation is checked
      if (!data.documentsData?.confirmDocuments) {
        errors.confirmDocuments = ["You must confirm document requirements to proceed"];
      }
      break;
      
    case 7:
      // Title company validation
      if (!data.titleData?.titleCompany) {
        errors.titleCompany = ["Title company is required"];
      }
      break;
      
    case 8:
      // Signature validation
      if (!data.signatureData?.signature) {
        errors.signature = ["Signature is required"];
      }
      
      if (!data.signatureData?.infoConfirmed) {
        errors.infoConfirmed = ["You must confirm the information is correct"];
      }
      
      if (!data.signatureData?.termsAccepted) {
        errors.termsAccepted = ["You must accept the terms and conditions"];
      }
      break;

    default:
      console.log("Validating step:", step);
      // Default validation - no errors
      break;
  }

  return errors;
};