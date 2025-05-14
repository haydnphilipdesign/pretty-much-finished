import { TransactionFormData, CommissionBase, TCFeePaidBy, AccessType } from "./types";

// Custom error types for better error handling
export class AirtableError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'AirtableError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Helper functions
const boolToYesNo = (value: boolean): string => value ? "Yes" : "No";

const AIRTABLE_BASE = import.meta.env.VITE_AIRTABLE_BASE_ID || "appdhCDgPMTngmtNk";
const AIRTABLE_TABLE = "tblHyCJCpQSgjn0md";

// Format currency values for Airtable submission
const formatCurrencyForAirtable = (value: string | number | undefined): number => {
  if (!value) return 0;
  
  // Remove any non-numeric characters except decimal point
  const cleanValue = typeof value === "string" 
    ? value.replace(/[^0-9.]/g, "")
    : value.toString();
    
  const num = parseFloat(cleanValue);
  return isNaN(num) ? 0 : num;
};

// Format currency values for display
export const formatCurrencyForDisplay = (value: string | number | undefined): string => {
  if (!value) return "";
  
  const num = formatCurrencyForAirtable(value);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Format percentage values for Airtable submission
const formatPercentageForAirtable = (value: string | number | undefined): number => {
  if (!value) return 0;
  
  const cleanValue = typeof value === "string" 
    ? value.replace(/[^0-9.]/g, "")
    : value.toString();
    
  const num = parseFloat(cleanValue);
  return isNaN(num) ? 0 : num;
};

// Format date for Airtable submission (M/D/YYYY)
const formatDateForAirtable = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Validate Airtable response
const validateAirtableResponse = (response: any) => {
  if (!response?.records?.[0]?.id) {
    throw new ValidationError('Invalid Airtable response: missing record ID');
  }
  return response;
};

// Retry mechanism for transient failures
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry if it's a validation error or if we've hit rate limits
      if (error instanceof ValidationError || error?.statusCode === 429) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
};

// Format documents for Airtable submission
const formatDocumentsForAirtable = (documents: string[]): string[] => {
  // Map of any variations in document names to their exact Airtable field options
  const documentNameMap: Record<string, string> = {
    // Exact matches from Airtable select options
    "Agreement of Sale & Addenda": "Agreement of Sale & Addenda",
    "Agreement of Sale": "Agreement of Sale",
    "Attorney Review Clause": "Attorney Review Clause",
    "Deposit Money Notice": "Deposit Money Notice",
    "Buyer's Agency Contract": "Buyer's Agency Contract",
    "Estimated Closing Costs": "Estimated Closing Costs",
    "KW Affiliate Services Disclosure": "KW Affiliate Services Disclosure",
    "Consumer Notice": "Consumer Notice",
    "Seller's Property Disclosure": "Seller's Property Disclosure",
    "Prequalification Letter": "Prequalification Letter",
    "Proof of Funds": "Proof of Funds",
    "Commission Agreement": "Commission Agreement",
    "Wire Fraud Advisory": "Wire Fraud Advisory",
    "KW Home Warranty Waiver": "KW Home Warranty Waiver",
    "Listing Agreement": "Listing Agreement",
    "Estimated Seller Proceeds": "Estimated Seller Proceeds",
    "Title Documents": "Title Documents",
    "Dual Agency Disclosure": "Dual Agency Disclosure",
    "Buyer's Estimated Costs": "Buyer's Estimated Costs"
  };

  // If documents is null, undefined, or not an array, return empty array
  if (!Array.isArray(documents)) {
    return [];
  }

  // Log incoming documents for debugging
  console.log("Incoming documents:", documents);

  // Filter out any empty strings and map to correct names
  const formattedDocs = documents
    // First filter out any null, undefined, or empty strings
    .filter(doc => doc && typeof doc === 'string' && doc.trim() !== '')
    // Remove file extensions and clean up document names
    .map(doc => {
      // Remove file extensions (e.g., .pdf, .doc, etc.)
      const cleanDoc = doc.replace(/\.[^/.]+$/, "").trim();
      // Skip any documents that start with "test-"
      if (cleanDoc.toLowerCase().startsWith("test-")) {
        return null;
      }
      const mappedName = documentNameMap[cleanDoc];
      if (!mappedName) {
        console.warn(`Document name not found in mapping: "${cleanDoc}"`);
        return null;
      }
      return mappedName;
    })
    .filter(doc => doc !== null && doc !== "") as string[]; // Remove any null values or empty strings

  // Log the final formatted documents
  console.log("Formatted documents:", formattedDocs);
  
  return formattedDocs;
};

// For all singleSelect fields, ensure valid options are sent
const validOptions: Record<string, string[]> = {
  "Agent Role": ["Listing Agent", "Buyer's Agent", "Dual Agent"],
  "Commission Base": ["Sale Price", "Net Proceeds (After Seller's Assistance)"],
  "Listing Agent Commission Type": ["Fixed", "Percentage"],
  "Buyers Agent Commission Type": ["Fixed", "Percentage"],
  "First Client Marital Status": ["Single", "Married", "Divorce", "Widowed", ""],
  "Second Client Marital Status": ["Single", "Married", "Divorce", "Widowed", ""],
  "Third Client Marital Status": ["Single", "Married", "Divorce", "Widowed", ""],
  "Fourth Client Marital Status": ["Single", "Married", "Divorce", "Widowed", ""],

  "TC Fee Paid By": ["Client", "Agent"],
  "Warranty Paid By": ["Seller", "Buyer", "Agent"],
  "Property Status": ["Vacant", "Occupied"],
  "Access Type": ["Combo Lockbox", "Electronic Lockbox", "Keypad", "Appointment Only"]
};

// Update the validation error message to show available options
const validateSelectOption = (value: string | undefined, fieldName: string) => {
  const options = validOptions[fieldName] || [];
  if (!value) return null;
  if (!options.includes(value)) {
    throw new ValidationError(
      `Invalid option for ${fieldName}: "${value}". ` +
      `Valid options: ${options.join(', ')}`
    );
  }
  return value;
};

export const submitToAirtable = async (formData: TransactionFormData, apiKey: string) => {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`;
  
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "User-Agent": "AirtableTransactionForm/1.0",
    "Accept": "application/json"
  };

  // Log the API key format and configuration (without revealing the actual key)
  console.log("Airtable configuration:", {
    startsWithPat: apiKey.startsWith('pat'),
    length: apiKey.length,
    baseId: AIRTABLE_BASE,
    tableId: AIRTABLE_TABLE,
    url
  });

  // Format documents before creating the record
  const formattedDocuments = Array.isArray(formData.requiredDocuments) 
    ? formatDocumentsForAirtable(formData.requiredDocuments)
    : [];

  // Create the base record without the documents field
  const record: any = {
    fields: {
      // Basic Information
      "Agent Role": validateSelectOption(formData.role, "Agent Role"),
      "MLS Number": formData.mlsNumber || "",
      "Update MLS": boolToYesNo(formData.updateMLS),
      "Property Address": formData.propertyAddress || "",
      "Sale Price": formatCurrencyForAirtable(formData.salePrice),
      "Date Submitted": formatDateForAirtable(new Date()),
      
      // First Client
      "First Client Name": formData.clients[0]?.name || "",
      "First Client Address": formData.clients[0]?.address || "",
      "First Client Email": formData.clients[0]?.email || "",
      "First Client Phone": formData.clients[0]?.phone || "",
      "First Client Marital Status": validateSelectOption(formData.clients[0]?.maritalStatus, "First Client Marital Status"),

      // Second Client
      "Second Client Name": formData.clients[1]?.name || "",
      "Second Client Address": formData.clients[1]?.address || "",
      "Second Client Email": formData.clients[1]?.email || "",
      "Second Client Phone": formData.clients[1]?.phone || "",
      "Second Client Marital Status": validateSelectOption(formData.clients[1]?.maritalStatus, "Second Client Marital Status"),

      // Third Client
      "Third Client Name": formData.clients[2]?.name || "",
      "Third Client Address": formData.clients[2]?.address || "",
      "Third Client Email": formData.clients[2]?.email || "",
      "Third Client Phone": formData.clients[2]?.phone || "",
      "Third Client Marital Status": validateSelectOption(formData.clients[2]?.maritalStatus, "Third Client Marital Status"),

      // Fourth Client
      "Fourth Client Name": formData.clients[3]?.name || "",
      "Fourth Client Address": formData.clients[3]?.address || "",
      "Fourth Client Email": formData.clients[3]?.email || "",
      "Fourth Client Phone": formData.clients[3]?.phone || "",
      "Fourth Client Marital Status": validateSelectOption(formData.clients[3]?.maritalStatus, "Fourth Client Marital Status"),
      
      // Commission Details
      "Commission Base": validateSelectOption(formData.commissionBase, "Commission Base"),
      "Total Commission": formatCurrencyForAirtable(formData.totalCommission),
      "Listing Agent Commission": formData.listingAgentCommissionType === "Percentage" 
        ? formatPercentageForAirtable(formData.listingAgentCommission)
        : formatCurrencyForAirtable(formData.listingAgentCommission),
      "Listing Agent Commission Type": validateSelectOption(formData.listingAgentCommissionType, "Listing Agent Commission Type"),
      "Buyers Agent Commission": formData.buyersAgentCommissionType === "Percentage"
        ? formatPercentageForAirtable(formData.buyersAgentCommission)
        : formatCurrencyForAirtable(formData.buyersAgentCommission),
      "Buyers Agent Commission Type": validateSelectOption(formData.buyersAgentCommissionType, "Buyers Agent Commission Type"),
      "Buyer Paid Commission": formatCurrencyForAirtable(formData.buyerPaidCommission),
      
      // Referral Information
      "Referral Party": formData.referralParty || "",
      "Broker EIN": formData.brokerEIN || "",
      "Referral Fee": formatCurrencyForAirtable(formData.referralFee),
      
      // Property Details
      "Resale Cert Required": boolToYesNo(formData.resaleCertRequired),
      "HOA": formData.hoa || "",
      "CO Required": boolToYesNo(formData.coRequired),
      "Municipality/Township": formData.municipalityTownship || "",
      "First Right Of Refusal": boolToYesNo(formData.firstRightOfRefusal),
      "First Right Of Refusal Name": formData.firstRightOfRefusalName || "",
      "Attorney Representation": boolToYesNo(formData.attorneyRepresentation),
      "Attorney Name": formData.attorneyName || "",
      "Home Warranty": boolToYesNo(formData.homeWarrantyPurchased),
      "Home Warranty Company": formData.homeWarrantyCompany || "",
      "Warranty Cost": formatCurrencyForAirtable(formData.warrantyCost),
      "Warranty Paid By": validateSelectOption(formData.warrantyPaidBy, "Warranty Paid By"),
      
      // Title and Access
      "Title Company": formData.titleCompany || "",
      "TC Fee Paid By": validateSelectOption(formData.tcFeePaidBy, "TC Fee Paid By"),
      "Property Status": validateSelectOption(formData.propertyStatus, "Property Status"),
      "Access Type": validateSelectOption(formData.accessType, "Access Type"),
      "Access Code": formData.accessCode || "",
      
      // Documents and Notes
      "Special Instructions": formData.specialInstructions || "",
      "Urgent Issues": formData.urgentIssues || "",
      "Additional Notes": formData.additionalNotes || "",
      "Required Documents": formattedDocuments,
    }
  };

  const requestBody = {
    records: [record]
  };

  return retryOperation(async () => {
    try {
      // Log the request details
      console.log("Submitting to Airtable:", {
        url,
        headers: { ...headers, Authorization: "Bearer [REDACTED]" },
        requestBody: JSON.stringify(requestBody, null, 2)
      });

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();
      console.log("Raw Airtable response:", responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse Airtable response:", e);
        throw new AirtableError('Invalid response format from Airtable', response.status, responseText);
      }

      if (!response.ok) {
        console.error("Airtable error response:", {
          status: response.status,
          statusText: response.statusText,
          error: responseData,
          url,
          baseId: AIRTABLE_BASE,
          tableId: AIRTABLE_TABLE
        });
        
        // Handle specific error cases
        if (response.status === 429) {
          throw new AirtableError('Rate limit exceeded. Please try again later.', response.status, responseData);
        }
        
        if (response.status === 422) {
          throw new ValidationError(responseData.error?.message || 'Invalid data format');
        }

        if (response.status === 403) {
          throw new AirtableError('Invalid API key or insufficient permissions', response.status, responseData);
        }

        if (response.status === 404) {
          throw new AirtableError('Base or table not found. Please check your configuration.', response.status, responseData);
        }
        
        throw new AirtableError(
          responseData.error?.message || response.statusText,
          response.status,
          responseData
        );
      }

      console.log("Airtable success response:", responseData);
      return validateAirtableResponse(responseData);

    } catch (error: any) {
      console.error("Error submitting to Airtable:", {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
        url,
        baseId: AIRTABLE_BASE,
        tableId: AIRTABLE_TABLE
      });
      
      if (error instanceof AirtableError || error instanceof ValidationError) {
        throw error;
      }
      
      throw new AirtableError('Failed to submit form data', undefined, error);
    }
  });
};