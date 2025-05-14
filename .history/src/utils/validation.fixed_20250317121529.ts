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
      if (!data.propertyData.propertyStatus) {
        errors.propertyStatus = ["Property status is required"];
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
        if (!client.email) {
          errors[`client${index}Email`] = ["Client email is required"];
        } else if (!validateEmail(client.email)) {
          errors[`client${index}Email`] = ["Invalid email format"];
        }
        if (!client.phone) {
          errors[`client${index}Phone`] = ["Client phone is required"];
        } else if (!validatePhone(client.phone)) {
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
      if (!data.commissionData.totalCommission) {
        errors.totalCommission = ["Total commission is required"];
      }
      break;

    case 5:
      if (data.propertyData.resaleCertRequired && !data.propertyData.hoaName) {
        errors.hoaName = ["HOA name is required when resale certificate is required"];
      }
      if (data.propertyData.coRequired && !data.propertyData.municipality) {
        errors.municipality = ["Municipality is required when CO is required"];
      }
      if (data.propertyData.firstRightOfRefusal && !data.propertyData.firstRightName) {
        errors.firstRightName = ["First right of refusal name is required"];
      }
      if (data.propertyData.attorneyRepresentation && !data.propertyData.attorneyName) {
        errors.attorneyName = ["Attorney name is required"];
      }
      break;

    case 6:
      // Use optional chaining and type assertion to handle potentially missing warrantyData
      const warranty = (data as any).warrantyData;
      if (warranty?.homeWarranty) {
        if (!warranty.warrantyCompany) {
          errors.warrantyCompany = ["Warranty company is required"];
        }
        if (!warranty.warrantyCost) {
          errors.warrantyCost = ["Warranty cost is required"];
        }
      }
      break;
    case 7:
      // Use optional chaining and type assertion to handle potentially missing titleData
      const title = (data as any).titleData;
      if (!title?.titleCompany) {
        errors.titleCompany = ["Title company name is required"];
      }
      break;

    case 10:
      // Use optional chaining and type assertion to handle potentially missing signatureData
      const signature = (data as any).signatureData;
      if (!signature?.agentName) {
        errors.agentName = ["Agent name is required"];
      }
      if (!signature?.dateSubmitted) {
        errors.dateSubmitted = ["Date is required"];
      }
      if (!signature?.signature) {
        errors.signature = ["Signature is required"];
      }
      if (!signature?.termsAccepted || !signature?.infoConfirmed) {
        errors.terms = ["You must accept terms and confirm information"];
      }
      break;
  }

  return errors;
};
