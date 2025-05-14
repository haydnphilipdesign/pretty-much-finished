import { TransactionFormData } from "@/types/transaction";

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

  switch (step) {
    case 1:
      if (!data.agentData?.role || !['listingAgent', 'buyersAgent', 'dualAgent', 'buyers-agent'].includes(data.agentData.role)) {
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
      // Changed from propertyStatus to status to match the actual property data structure
      if (!data.propertyData.status) {
        errors.status = ["Property status is required"];
      }
      break;

    case 3:
      if (!data.clients.length) {
        errors.clients = ["At least one client is required"];
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
      // Only validate commission fields if they're required for the role
      if (data.agentData.role !== "buyersAgent" && data.agentData.role !== "buyers-agent") {
        if (!data.commissionData.totalCommission) {
          errors.totalCommission = ["Total commission is required"];
        }
      }
      break;

    case 5:
      // Make sure we're accessing the correct property data fields
      if (data.propertyDetails.resaleCertRequired && !data.propertyDetails.hoaName) {
        errors.hoaName = ["HOA name is required when resale certificate is required"];
      }
      if (data.propertyDetails.coRequired && !data.propertyDetails.municipality) {
        errors.municipality = ["Municipality is required when CO is required"];
      }
      if (data.propertyDetails.firstRightOfRefusal && !data.propertyDetails.firstRightName) {
        errors.firstRightName = ["First right of refusal name is required"];
      }
      if (data.propertyDetails.attorneyRepresentation && !data.propertyDetails.attorneyName) {
        errors.attorneyName = ["Attorney name is required"];
      }
      break;

    case 6:
      if (data.warrantyData.homeWarranty) {
        if (!data.warrantyData.warrantyCompany) {
          errors.warrantyCompany = ["Warranty company is required"];
        }
        if (!data.warrantyData.warrantyCost) {
          errors.warrantyCost = ["Warranty cost is required"];
        }
      }
      break;
      
    case 7:
      if (!data.titleData.titleCompany) {
        errors.titleCompany = ["Title company name is required"];
      }
      break;

    case 10:
      if (!data.signatureData.agentName) {
        errors.agentName = ["Agent name is required"];
      }
      if (!data.signatureData.dateSubmitted) {
        errors.dateSubmitted = ["Date is required"];
      }
      if (!data.signatureData.signature) {
        errors.signature = ["Signature is required"];
      }
      if (!data.signatureData.termsAccepted || !data.signatureData.infoConfirmed) {
        errors.terms = ["You must accept terms and confirm information"];
      }
      break;
  }

  return errors;
};
