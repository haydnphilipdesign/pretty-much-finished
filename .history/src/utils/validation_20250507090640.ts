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
      if (!data.agentData?.role || !['LISTING AGENT', 'BUYERS AGENT', 'DUAL AGENT'].includes(data.agentData.role)) {
        errors.role = ["Please select a valid role to continue"];
      }
      break;

    case 2:
      if (!data.propertyData.mlsNumber) {
        errors.mlsNumber = ["MLS number is required"];
      } else if (!validateMLS(data.propertyData.mlsNumber)) {
        errors.mlsNumber = ["MLS number must be in format: 123456 or PM-123456"];
      }
      if (!data.propertyData.address) {
        errors.address = ["Property address is required"];
      }
      if (!data.propertyData.salePrice) {
        errors.salePrice = ["Sale price is required"];
      }
      // Check status field
      if (!data.propertyData.status) {
        errors.status = ["Property status is required"];
      }
      // Add validation for county field
      if (!data.propertyData.county) {
        errors.county = ["County is required"];
      }
      // Add validation for property type
      if (!data.propertyData.propertyType) {
        errors.propertyType = ["Property type is required"];
      }
      break;

    case 3:
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
      // Validate commission data
      if (isListingOrDualAgent && !data.commissionData?.totalCommissionPercentage) {
        errors.totalCommission = ["Total commission is required"];
      }
      break;

    case 5:
      // ... existing code for step 5
      break;

    case 6:
      // Validate documents confirmation is checked
      if (!data.documentsData?.confirmDocuments) {
        errors.confirmDocuments = ["You must confirm document requirements"];
      }
      break;
      
    case 7:
    case 8:
    case 9:
    case 10:
      // Add empty validation for these steps if needed
      break;

    default:
      console.log("Validating step:", step);
      // Default validation - no errors
      break;
  }

  return errors;
};