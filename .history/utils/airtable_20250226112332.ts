import Airtable from 'airtable';

const AIRTABLE_API_KEY = process.env.VITE_AIRTABLE_API_KEY || 'patTmLTvKhZ0hs6ZB.3644ac279f9828df981ce7921b05d5c996f5f2e82d9c51daee4604a06c4f9e2d';
const AIRTABLE_BASE_ID = process.env.VITE_AIRTABLE_BASE_ID || 'appfzBPCBvZeW9QTl';

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

function formatMlsNumber(mlsNumber: string): string {
  // Remove any whitespace and non-digit characters
  let cleaned = mlsNumber.replace(/[^\d]/g, '');
  
  // Limit to 6 digits
  cleaned = cleaned.slice(0, 6);
  
  // Pad with leading zeros if needed
  cleaned = cleaned.padStart(6, '0');
  
  return cleaned;
}

function validateSelectOption(option: string, validOptions: string[], fieldName: string) {
  if (!validOptions.includes(option)) {
    throw new Error(
      `Invalid option for ${fieldName}: "${option}". Valid options: ${validOptions.join(", ")}`
    );
  }
}

export const submitToAirtable = async (formData: any) => {
  try {
    // Validate required fields
    if (!formData.agentRole) {
      throw new Error("Agent Role is required");
    }
    if (!formData.propertyData?.address) {
      throw new Error("Property Address is required");
    }

    // Validate agent role
    validateSelectOption(formData.agentRole, [
      "Listing Agent",
      "Buyer's Agent",
      "Dual Agent"
    ], "Agent Role");

    // Format the MLS number before creating records
    const formattedMlsNumber = formatMlsNumber(formData.propertyData.mlsNumber);

    // Construct records using field IDs from environment variables
    const clientRecords = formData.clients.map((client: any) => ({
      fields: {
        [process.env.AIRTABLE_AGENT_ROLE_FIELD_ID || "fldOVyoxz38rWwAFy"]: formData.agentRole,
        [process.env.AIRTABLE_PROPERTY_ADDRESS_FIELD_ID || "fldypnfnHhplWYcCW"]: formData.propertyData.address,
        [process.env.AIRTABLE_SALE_PRICE_FIELD_ID || "fldhHjBZJISmnP8SK"]: formData.propertyData.salePrice,
        [process.env.AIRTABLE_TRANSACTION_STATUS_FIELD_ID || "fldMplTcAn8Fl4NX8"]: formData.propertyData.status,
        [process.env.AIRTABLE_DOCUMENTS_FIELD_ID || "fldNIkOPi3mBJGNMZ"]: formData.documents?.map((doc: any) => ({
          id: doc.id
        })) || [],
        [process.env.AIRTABLE_DATE_SUBMITTED_FIELD_ID || "fldSSndzSwwzeLSph"]: new Date().toISOString(),
        [process.env.AIRTABLE_AGENT_NAME_FIELD_ID || "fldFD4xHD0vxnSOHJ"]: formData.signatureData.agentName,
        
        // Existing fields
        'MLS Number': formattedMlsNumber,
        'Is Winterized': formData.propertyData.isWinterized,
        'Update MLS': formData.propertyData.updateMls,
        'Commission Base': formData.commissionData.commissionBase,
        'Sellers Assist': formData.commissionData.sellersAssist,
        'Total Commission': formData.commissionData.totalCommission,
        'Listing Agent Commission': formData.commissionData.listingAgentCommission,
        'Buyers Agent Commission': formData.commissionData.buyersAgentCommission,
        'Buyer Paid Commission': formData.commissionData.buyerPaidCommission,
        'Is Referral': formData.commissionData.isReferral,
        'Referral Party': formData.commissionData.referralParty,
        'Broker EIN': formData.commissionData.brokerEin,
        'Referral Fee': formData.commissionData.referralFee,
        'Client Name': client.name,
        'Client Email': client.email,
        'Client Phone': client.phone,
        'Client Address': client.address,
        'Client Type': client.type,
        'Marital Status': client.maritalStatus,
        'Special Instructions': formData.additionalInfo.specialInstructions,
        'Urgent Issues': formData.additionalInfo.urgentIssues,
        'Notes': formData.additionalInfo.notes,
        'Requires Follow Up': formData.additionalInfo.requiresFollowUp,
        'Terms Accepted': formData.signatureData.termsAccepted,
        'Info Confirmed': formData.signatureData.infoConfirmed,
        'Signature': formData.signatureData.signature,
      }
    }));

    // Create records for each client
    const records = await base('Transactions').create(clientRecords);
    return records;
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    throw error;
  }
};

