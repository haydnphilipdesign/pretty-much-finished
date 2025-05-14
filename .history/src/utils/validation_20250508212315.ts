import { TransactionFormData } from "@/types/transaction";
import { formatAddress } from "@/utils/addressUtils";

// Add a new function to allow flexible validation
export const validateStepFlexible = (
  step: number,
  data: TransactionFormData
): { errors: { [key: string]: string[] }, missingFields: string[] } => {
  // Get standard validation errors
  const errors = validateStep(step, data);
  
  // Extract the field names from the errors object
  const missingFields = Object.keys(errors);
  
  // Return both the errors and the list of missing fields
  return { errors, missingFields };
};

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

  const validateClosingDate = (dateStr: string): boolean => {
    if (!dateStr) return false;
    
    const selectedDate = new Date(dateStr);
    if (isNaN(selectedDate.getTime())) return false;
    
    // Check if date is within reasonable range (up to 90 days in the future)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    
    return selectedDate <= maxDate;
  };

  // Check if user is a listing agent or dual agent
  const isListingOrDualAgent = 
    data.agentData?.role === 'LISTING AGENT' || 
    data.agentData?.role === 'DUAL AGENT';

  const validateRequired = (value: any, fieldName: string, label: string) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      if (!errors[fieldName]) {
        errors[fieldName] = [];
      }
      errors[fieldName].push(`${label} is required`);
      return false;
    }
    return true;
  };

  const validateRequiredBool = (value: boolean | undefined, fieldName: string, label: string) => {
    if (value !== true) {
      if (!errors[fieldName]) {
        errors[fieldName] = [];
      }
      errors[fieldName].push(`${label} is required`);
      return false;
    }
    return true;
  };

  switch (step) {
    // Agent Information
    case 1:
      validateRequired(data.agentData?.role, "role", "Agent role");
      // Agent name is not required at this step - it will be validated in the signature section
      
      if (data.agentData?.email && !validateEmail(data.agentData.email)) {
        errors.email = ["Invalid email format"];
      }
      
      if (data.agentData?.phone && !validatePhone(data.agentData.phone)) {
        errors.phone = ["Invalid phone number format"];
      }
      break;

    // Property Information
    case 2:
      validateRequired(data.propertyData?.address, "address", "Property address");
      validateRequired(data.propertyData?.county, "county", "County");
      validateRequired(data.propertyData?.propertyType, "propertyType", "Property type");
      validateRequired(data.propertyData?.closingDate, "closingDate", "Closing date");
      
      // Validate closing date is in reasonable range
      if (data.propertyData?.closingDate && !validateClosingDate(data.propertyData.closingDate)) {
        if (!errors.closingDate) {
          errors.closingDate = [];
        }
        errors.closingDate.push("Closing date must be within a reasonable range (up to 90 days in the future)");
      }
      
      if (data.propertyData?.mlsNumber && !validateMLS(data.propertyData.mlsNumber)) {
        errors.mlsNumber = ["Invalid MLS format. Expected format: PM-123456 or 123456"];
      }
      
      // Numeric field validation
      if (data.propertyData?.salePrice && isNaN(Number(data.propertyData.salePrice))) {
        errors.salePrice = ["Sale price must be a valid number"];
      }
      break;

    // Client Information
    case 3:
      if (!data.clients || data.clients.length === 0) {
        errors.clients = ["At least one client is required"];
      } else {
        data.clients.forEach((client, index) => {
          validateRequired(client.name, `clients[${index}].name`, "Client name");
          
          if (client.email && !validateEmail(client.email)) {
            if (!errors[`clients[${index}].email`]) {
              errors[`clients[${index}].email`] = [];
            }
            errors[`clients[${index}].email`].push("Invalid email format");
          }
          
          if (client.phone && !validatePhone(client.phone)) {
            if (!errors[`clients[${index}].phone`]) {
              errors[`clients[${index}].phone`] = [];
            }
            errors[`clients[${index}].phone`].push("Invalid phone number format");
          }
        });
      }
      break;

    // Commission
    case 4:
      if (isListingOrDualAgent) {
        validateRequired(data.commissionData?.totalCommissionPercentage, "totalCommissionPercentage", "Total commission percentage");
        validateRequired(data.commissionData?.listingAgentPercentage, "listingAgentPercentage", "Listing agent commission percentage");
        
        if (data.commissionData?.hasSellersAssist) {
          validateRequired(data.commissionData?.sellersAssist, "sellersAssist", "Seller's assist amount");
        }
      } else {
        validateRequired(data.commissionData?.buyersAgentPercentage, "buyersAgentPercentage", "Buyer's agent commission percentage");
      }
      
      if (data.commissionData?.hasBrokerFee) {
        validateRequired(data.commissionData?.brokerFeeAmount, "brokerFeeAmount", "Broker fee amount");
      }
      break;

    // Property Details
    case 5:
      // Property details validation
      if (data.propertyDetailsData?.resaleCertRequired && !data.propertyDetailsData?.hoaName) {
        errors.hoaName = ["HOA name is required when resale certificate is required"];
      }
      
      if (data.propertyDetailsData?.firstRightOfRefusal && !data.propertyDetailsData?.firstRightName) {
        errors.firstRightName = ["First right of refusal name is required when enabled"];
      }
      
      if (data.propertyDetailsData?.attorneyRepresentation && !data.propertyDetailsData?.attorneyName) {
        errors.attorneyName = ["Attorney name is required when attorney representation is enabled"];
      }
      
      if (data.propertyDetailsData?.homeWarranty) {
        validateRequired(data.propertyDetailsData.warrantyCompany, "warrantyCompany", "Warranty company");
        validateRequired(data.propertyDetailsData.warrantyCost, "warrantyCost", "Warranty cost");
      }
      break;

    // Documents
    case 6:
      validateRequiredBool(data.documentsData?.confirmDocuments, "confirmDocuments", "Document confirmation");
      break;

    // Additional Information
    case 7:
      // No required fields typically, but can be added if needed
      break;

    // Review
    case 8:
      // Review step should not validate signature fields
      // These will be validated in step 9 (Signature)
      break;
      
    // Sign & Submit
    case 9:
      // Validate name in the signature field
      validateRequired(data.signatureData?.agentName, "agentName", "Agent name");
      validateRequiredBool(data.signatureData?.infoConfirmed, "infoConfirmed", "Information confirmation");
      validateRequiredBool(data.signatureData?.termsAccepted, "termsAccepted", "Terms acceptance");
      validateRequired(data.signatureData?.signature, "signature", "Digital signature");
      break;

    default:
      break;
  }

  return errors;
};