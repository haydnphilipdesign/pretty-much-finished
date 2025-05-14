// ... (Inside the submitToAirtable function)

    // Construct the record object with field names that should match your Airtable base.
    // ***VERIFY THESE FIELD NAMES AGAINST YOUR AIRTABLE BASE***
    const record = {
      fields: {
        "Agent Role": data.agentRole, // Confirmed: "Agent Role"
        "Client Name": data.clientName, // Example: Check if it's "Client Name" or "ClientName" or something else
        "Client Email": data.clientEmail, // Example
        "Property Address": data.propertyAddress, // Example
        "Transaction Type": data.transactionType, // Example
        "Documents": data.documents, // Confirmed: "Documents"
        "Date": data.date,  //Check this
        // Add other fields as needed, matching Airtable column names *exactly*
      },
    };

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