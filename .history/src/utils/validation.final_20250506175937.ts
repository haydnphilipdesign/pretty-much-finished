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

  // Check if user is a listing agent or dual agent
  const isListingOrDualAgent = data.agentData?.role === "listingAgent" || data.agentData?.role === "dualAgent";

  switch (step) {
    case 1:
      if (!data.agentData?.role || !['listingAgent', 'buyersAgent', 'dualAgent'].includes(data.agentData.role)) {
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
      // Check both status and propertyStatus to handle both field names
      if (!(data.propertyData.status || data.propertyData.propertyStatus)) {
        errors.status = ["Property status is required"];
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
      // Only validate commission fields if they're required for the role
      if (data.agentData.role !== "buyersAgent") {
        }
        if (!data.commissionData.totalCommission) {
          errors.totalCommission = ["Total commission is required"];
        }
      }
      break;

    case 5:
      // Only validate conditional fields if they're required
      if (data.propertyDetails.resaleCertRequired && !data.propertyDetails.hoaName) {
        errors.hoaName = ["HOA name is required when resale certificate is required"];
      }
      if (data.propertyDetails.coRequired && !data.propertyDetails.municipality) {
        errors.municipality = ["Municipality is required when CO is required"];
      }
      // Only validate First Right of Refusal Name for listing or dual agents
      if (isListingOrDualAgent && data.propertyDetails.firstRightOfRefusal && !data.propertyDetails.firstRightName) {
        errors.firstRightName = ["First right of refusal name is required"];
      }
      if (data.propertyDetails.attorneyRepresentation && !data.propertyDetails.attorneyName) {
        errors.attorneyName = ["Attorney name is required"];
      }
      break;

    case 6:
      // Only validate warranty fields if warranty is selected
      if (data.warrantyData.homeWarranty) {
        if (!data.warrantyData.warrantyCompany) {
          errors.warrantyCompany = ["Warranty company is required"];
        }
        if (!data.warrantyData.warrantyCost) {
          errors.warrantyCost = ["Warranty cost is required"];
        }
        if (!data.warrantyData.paidBy) {
          errors.paidBy = ["Paid by is required"];
        }
      }
      break;
      
    case 7:
      if (!data.titleData.titleCompany) {
        errors.titleCompany = ["Title company name is required"];
      }
      break;

    case 8:
      // No validation for additional info as all fields are optional
      break;

    case 9:
      // No validation for documents as they're optional
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
      if (!data.signatureData.termsAccepted) {
        errors.termsAccepted = ["You must accept the terms"];
      }
      if (!data.signatureData.infoConfirmed) {
        errors.infoConfirmed = ["You must confirm the information is correct"];
      }
      break;
  }

  return errors;
};
