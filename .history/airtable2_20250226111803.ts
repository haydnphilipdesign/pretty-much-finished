// ... (Inside the submitToAirtable function)

    // Construct the record object with field names and IDs from the CSV
    const record = {
      fields: {
        [process.env.AIRTABLE_AGENT_ROLE_FIELD_ID || "fldOVyoxz38rWwAFy"]: data.agentRole,
        [process.env.AIRTABLE_CLIENTS_FIELD_ID || "fldmPyBwuOO1dgj1g"]: data.clientId, // Link to client record
        [process.env.AIRTABLE_PROPERTY_ADDRESS_FIELD_ID || "fldypnfnHhplWYcCW"]: data.propertyAddress,
        [process.env.AIRTABLE_SALE_PRICE_FIELD_ID || "fldhHjBZJISmnP8SK"]: data.salePrice,
        [process.env.AIRTABLE_TRANSACTION_STATUS_FIELD_ID || "fldMplTcAn8Fl4NX8"]: data.transactionStatus,
        [process.env.AIRTABLE_DOCUMENTS_FIELD_ID || "fldNIkOPi3mBJGNMZ"]: data.documents.map(doc => ({
          id: doc.id // Assuming documents are already created in Airtable and we have their IDs
        })),
        [process.env.AIRTABLE_DATE_SUBMITTED_FIELD_ID || "fldSSndzSwwzeLSph"]: new Date().toISOString(),
        [process.env.AIRTABLE_AGENT_NAME_FIELD_ID || "fldFD4xHD0vxnSOHJ"]: data.agentName,
        // Add other fields as needed
      },
    };

    // Validate required fields
    if (!data.agentRole) {
      throw new ValidationError("Agent Role is required");
    }
    if (!data.clientId) {
      throw new ValidationError("Client ID is required");
    }
    if (!data.propertyAddress) {
      throw new ValidationError("Property Address is required");
    }

    // ... (rest of the submitToAirtable function) 

function validateSelectOption(option: string, validOptions: string[], fieldName: string) {
  if (!validOptions.includes(option)) {
    throw new ValidationError(
      `Invalid option for ${fieldName}: "${option}". Valid options: ${validOptions.join(
        ", "
      )}`
    );
  }
}

validateSelectOption(data.agentRole, [
  "Listing Agent",
  "Buyer's Agent",
  "Dual Agent",
], "Agent Role");

// You can reuse validateSelectOption for other select fields:
// validateSelectOption(data.transactionType, ["Sale", "Purchase", "Lease"], "Transaction Type");

// ... 

function formatDocuments(documents: string[]): string[] {
  const formattedDocs: string[] = [];
  const documentMap: { [key: string]: string } = {
    "Consumer Notice": "Consumer Notice",
    "KW Wire Fraud Advisory": "Wire Fraud Advisory",
    "KW Affiliate Services Disclosure": "KW Affiliate Services Disclosure",
    "KW Affiliate Services Addendum": "KW Affiliate Services Disclosure", // Correct mapping
    "KW Home Warranty Waiver": "KW Home Warranty Waiver",
    "Agreement of Sale and Addenda": "Agreement of Sale & Addenda",
    "Seller's Property Disclosure": "Seller's Property Disclosure",
    "Lead Based Paint Disclosure": "Lead Based Paint Disclosure",
    "Seller's Estimated Costs": "Estimated Seller Proceeds",
    "Cooperating Broker's Compensation": "Commission Agreement",
  };

  documents.forEach((doc) => {
    const formattedDoc = documentMap[doc];
    if (formattedDoc) {
      formattedDocs.push(formattedDoc);
    } else {
      console.warn(`Document not found: ${doc}`); // Log if a document isn't mapped
    }
  });

  return formattedDocs;
} 