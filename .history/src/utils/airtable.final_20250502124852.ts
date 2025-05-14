import { TransactionFormState } from '@/types/transactionFormState';

// Get environment variables (works in both browser and Node.js)
let API_KEY: string | undefined, 
    BASE_ID: string | undefined, 
    CLIENTS_TABLE_ID: string | undefined;

// For browser environment
if (typeof import.meta !== 'undefined' && import.meta.env) {
  API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
  BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
  CLIENTS_TABLE_ID = import.meta.env.VITE_AIRTABLE_CLIENTS_TABLE_ID;
} 
// For Node.js environment
else if (typeof process !== 'undefined' && process.env) {
  API_KEY = process.env.VITE_AIRTABLE_API_KEY;
  BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;
  CLIENTS_TABLE_ID = process.env.VITE_AIRTABLE_CLIENTS_TABLE_ID;
}

if (!API_KEY || !BASE_ID) {
  throw new Error('Missing required environment variables: VITE_AIRTABLE_API_KEY and/or VITE_AIRTABLE_BASE_ID');
}

// Field mappings from form to Airtable fields
const transactionFieldMap = {
  // Agent information
  agentRole: 'fldOVyoxz38rWwAFy',
  agentName: 'fldFD4xHD0vxnSOHJ',

  // Property data
  mlsNumber: 'fld6O2FgIXQU5G27o',
  propertyAddress: 'fldypnfnHhplWYcCW',
  salePrice: 'fldhHjBZJISmnP8SK',
  propertyStatus: 'fldV2eLxz6w0TpLFU',
  winterizedStatus: 'fldExdgBDgdB1i9jy',
  updateMls: 'fldw3GlfvKtyNfIAW',
  propertyAccessType: 'fld7TTQpaC83ehY7H',
  lockboxAccessCode: 'fldrh8eB5V8TjSZlR',
  propertyType: 'fldzM4oyw2PyKt887',
  builtBefore1978: 'fldZmPfpsSJLOtcYr',
  closingDate: 'fldacjkqtnbdTUUTx',

  // Commission data
  totalCommissionPercentage: 'fldE8INzEorBtx2uN',
  listingAgentPercentage: 'flduuQQT7o6XAGlRe',
  buyersAgentPercentage: 'fld5KRrToAAt5kOLd',
  brokerFeeAmount: 'flddRltdGj05Clzpa',
  sellersAssist: 'fldTvXx96Na0zRh6W',
  referralParty: 'fldzVtmn8uylVxuTF',
  referralFee: 'fldewmjoaJVwiMF46',
  brokerEin: 'fld20VbKbWzdR4Sp7',
  coordinatorFeePaidBy: 'fldrplBqdhDcoy04S',

  // Property Details
  hoaName: 'fld9oG6SMAkh4hvNL',
  municipality: 'fld9Qw4mGeI9kk42F',
  firstRightName: 'fldeHKiUreeDs5n4o',
  attorneyName: 'fld4YZ0qKHvRLK4Xg',
  warrantyCompany: 'fldRtNEH89tNNX52B',
  warrantyCost: 'fldxH1pCpohty1e2b',
  warrantyPaidBy: 'fld61RStU7sCDrG01',

  // Title data
  titleCompany: 'fldqeArDeRkxiYz9u',

  // Additional info
  specialInstructions: 'fldDWN8jU4kdCffzu',
  urgentIssues: 'fldgW16aPdFMdspO6',
  additionalNotes: 'fld30htJ7euVerCLW',

  // Client links
  clients: 'fldmPyBwuOO1dgj1g'
};

// Client field mappings
const clientFieldMap = {
  name: 'fldSqxNOZ9B5PgSab',
  email: 'flddP6a8EG6qTJdIi',
  phone: 'fldBnh8W6iGW014yY',
  address: 'fldz1IpeR1256LhuC',
  maritalStatus: 'fldeK6mjSfxELU0MD',
  type: 'fldSY6vbE1zAhJZqd',
  propertyAddress: 'fldx7IEsPmHTJXDYS'
};

// Helper function to format field value
function formatFieldValue(value: string | number | boolean, fieldType: string): string | number | boolean {
  switch (fieldType) {
    case 'totalCommissionPercentage':
    case 'listingAgentPercentage':
    case 'buyersAgentPercentage':
    case 'referralFee':
      return parseFloat(value.toString());
    case 'brokerFeeAmount':
    case 'sellersAssist':
    case 'salePrice':
    case 'warrantyCost':
      return parseFloat(value.toString());
    case 'winterizedStatus':
      if (typeof value === 'boolean') {
        return value ? 'WINTERIZED' : 'NOT WINTERIZED';
      } else if (value === 'YES') {
        return 'WINTERIZED';
      } else {
        return 'NOT WINTERIZED';
      }
    case 'updateMls':
      if (typeof value === 'boolean') {
        return value ? 'YES' : 'NO';
      }
      return value;
    case 'builtBefore1978':
      if (typeof value === 'boolean') {
        return value ? 'YES' : 'NO';
      }
      return value;
    case 'propertyStatus':
    case 'propertyType':
    case 'propertyAccessType':
    case 'coordinatorFeePaidBy':
      return value.toString().toUpperCase();
    default:
      return value;
  }
}

// Function to submit client record to Airtable
async function submitClientToAirtable(client: any, propertyAddress?: string) {
  const clientFields: { [key: string]: any } = {};

  // Map client fields
  if (client.name) clientFields[clientFieldMap.name] = client.name;
  if (client.email) clientFields[clientFieldMap.email] = client.email;
  if (client.phone) clientFields[clientFieldMap.phone] = client.phone;
  if (client.address) clientFields[clientFieldMap.address] = client.address;
  if (client.maritalStatus) clientFields[clientFieldMap.maritalStatus] = client.maritalStatus;
  if (client.type) clientFields[clientFieldMap.type] = client.type;
  if (propertyAddress) clientFields[clientFieldMap.propertyAddress] = propertyAddress;

  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${CLIENTS_TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{
          fields: clientFields
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error creating client record');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating client record:', error);
    throw error;
  }
}

// Main function to submit transaction record to Airtable
export async function submitToAirtable(data: TransactionFormState) {
  const transactionFields: { [key: string]: any } = {};

  try {
    // First attempt to trigger PDF generation and email - this happens in the background
    try {
      if (typeof window !== 'undefined') {
        // Use a timeout to make this truly non-blocking
        setTimeout(() => {
          console.log('Starting background PDF generation process...');
          fetch('/api/pdf/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          .then(response => {
            if (response.ok) {
              console.log('PDF generation triggered successfully');
            } else {
              console.error('PDF generation API returned an error:', response.status);
            }
          })
          .catch(error => {
            console.error('Background PDF generation error:', error);
            // We don't throw here because we want the form submission to continue even if PDF fails
          });
        }, 100);
      }
    } catch (pdfError) {
      console.error('Failed to trigger PDF generation:', pdfError);
      // Continue with form submission even if PDF generation fails
    }
    
    // Create transaction record
    // Agent Role and Name
    if (data.agentData?.role) {
      transactionFields[transactionFieldMap.agentRole] = data.agentData.role;
    }
    
    if (data.agentData?.name) {
      transactionFields[transactionFieldMap.agentName] = data.agentData.name;
    }

    // Property data fields
    if (data.propertyData) {
      if (data.propertyData.mlsNumber) {
        transactionFields[transactionFieldMap.mlsNumber] = data.propertyData.mlsNumber;
      }

      if (data.propertyData.address) {
        transactionFields[transactionFieldMap.propertyAddress] = data.propertyData.address;
      }

      if (data.propertyData.salePrice) {
        transactionFields[transactionFieldMap.salePrice] = formatFieldValue(data.propertyData.salePrice, 'salePrice');
      }

      if (data.propertyData.status) {
        transactionFields[transactionFieldMap.propertyStatus] = formatFieldValue(data.propertyData.status, 'propertyStatus');
      }

      if (data.propertyData.isWinterized) {
        const formattedWinterized = formatFieldValue(data.propertyData.isWinterized, 'winterizedStatus');
        console.log('Debug - isWinterized:', {
          original: data.propertyData.isWinterized,
          type: typeof data.propertyData.isWinterized,
          formatted: formattedWinterized,
          formattedType: typeof formattedWinterized
        });
        transactionFields[transactionFieldMap.winterizedStatus] = formattedWinterized;
      }

      if (data.propertyData.updateMls) {
        const formattedUpdateMls = formatFieldValue(data.propertyData.updateMls, 'updateMls');
        console.log('Debug - updateMls:', {
          original: data.propertyData.updateMls,
          type: typeof data.propertyData.updateMls,
          formatted: formattedUpdateMls,
          formattedType: typeof formattedUpdateMls
        });
        transactionFields[transactionFieldMap.updateMls] = formattedUpdateMls;
      }

      if (data.propertyData.propertyAccessType) {
        transactionFields[transactionFieldMap.propertyAccessType] = data.propertyData.propertyAccessType;
      }

      if (data.propertyData.lockboxAccessCode) {
        transactionFields[transactionFieldMap.lockboxAccessCode] = data.propertyData.lockboxAccessCode;
      }

      if (data.propertyData.propertyType) {
        transactionFields[transactionFieldMap.propertyType] = formatFieldValue(data.propertyData.propertyType, 'propertyType');
      }

      if (data.propertyData.isBuiltBefore1978) {
        const formattedBuiltBefore1978 = formatFieldValue(data.propertyData.isBuiltBefore1978, 'builtBefore1978');
        console.log('Debug - isBuiltBefore1978:', {
          original: data.propertyData.isBuiltBefore1978,
          type: typeof data.propertyData.isBuiltBefore1978,
          formatted: formattedBuiltBefore1978,
          formattedType: typeof formattedBuiltBefore1978
        });
        transactionFields[transactionFieldMap.builtBefore1978] = formattedBuiltBefore1978;
      }

      if (data.propertyData.closingDate) {
        transactionFields[transactionFieldMap.closingDate] = data.propertyData.closingDate;
      }
    }

    // Commission data fields
    if (data.commissionData) {      
      if (data.commissionData.totalCommissionPercentage) {
        transactionFields[transactionFieldMap.totalCommissionPercentage] = formatFieldValue(data.commissionData.totalCommissionPercentage, 'totalCommissionPercentage');
      }
      
      if (data.commissionData.listingAgentPercentage) {
        transactionFields[transactionFieldMap.listingAgentPercentage] = formatFieldValue(data.commissionData.listingAgentPercentage, 'listingAgentPercentage');
      }
      
      if (data.commissionData.buyersAgentPercentage) {
        transactionFields[transactionFieldMap.buyersAgentPercentage] = formatFieldValue(data.commissionData.buyersAgentPercentage, 'buyersAgentPercentage');
      }
      
      if (data.commissionData.hasBrokerFee && data.commissionData.brokerFeeAmount) {
        transactionFields[transactionFieldMap.brokerFeeAmount] = formatFieldValue(data.commissionData.brokerFeeAmount, 'brokerFeeAmount');
      }
      
      if (data.commissionData.hasSellersAssist && data.commissionData.sellersAssist) {
        transactionFields[transactionFieldMap.sellersAssist] = formatFieldValue(data.commissionData.sellersAssist, 'sellersAssist');
      }
      
      if (data.commissionData.isReferral) {
        if (data.commissionData.referralParty) {
          transactionFields[transactionFieldMap.referralParty] = data.commissionData.referralParty;
        }
        
        if (data.commissionData.referralFee) {
          transactionFields[transactionFieldMap.referralFee] = formatFieldValue(data.commissionData.referralFee, 'referralFee');
        }
        
        if (data.commissionData.brokerEin) {
          transactionFields[transactionFieldMap.brokerEin] = data.commissionData.brokerEin;
        }
      }

      if (data.commissionData.coordinatorFeePaidBy) {
        transactionFields[transactionFieldMap.coordinatorFeePaidBy] = data.commissionData.coordinatorFeePaidBy;
      }
    }

    // Property Details fields
    if (data.propertyDetailsData) {
      if (data.propertyDetailsData.resaleCertRequired && data.propertyDetailsData.hoaName) {
        transactionFields[transactionFieldMap.hoaName] = data.propertyDetailsData.hoaName;
      }

      if (data.propertyDetailsData.coRequired && data.propertyDetailsData.municipality) {
        transactionFields[transactionFieldMap.municipality] = data.propertyDetailsData.municipality;
      }

      if (data.propertyDetailsData.firstRightOfRefusal && data.propertyDetailsData.firstRightName) {
        transactionFields[transactionFieldMap.firstRightName] = data.propertyDetailsData.firstRightName;
      }

      if (data.propertyDetailsData.attorneyRepresentation && data.propertyDetailsData.attorneyName) {
        transactionFields[transactionFieldMap.attorneyName] = data.propertyDetailsData.attorneyName;
      }
      
      if (data.propertyDetailsData.homeWarranty) {
        if (data.propertyDetailsData.warrantyCompany) {
          transactionFields[transactionFieldMap.warrantyCompany] = data.propertyDetailsData.warrantyCompany;
        }
        
        if (data.propertyDetailsData.warrantyCost) {
          transactionFields[transactionFieldMap.warrantyCost] = formatFieldValue(data.propertyDetailsData.warrantyCost, 'warrantyCost');
        }
        
        if (data.propertyDetailsData.warrantyPaidBy) {
          transactionFields[transactionFieldMap.warrantyPaidBy] = data.propertyDetailsData.warrantyPaidBy;
        }
      }
    }

    // Title Company field
    if (data.titleData?.titleCompany) {
      transactionFields[transactionFieldMap.titleCompany] = data.titleData.titleCompany;
    }

    // Additional Info fields
    if (data.additionalInfo) {
      if (data.additionalInfo.specialInstructions) {
        transactionFields[transactionFieldMap.specialInstructions] = data.additionalInfo.specialInstructions;
      }
      if (data.additionalInfo.urgentIssues) {
        transactionFields[transactionFieldMap.urgentIssues] = data.additionalInfo.urgentIssues;
      }
      if (data.additionalInfo.notes) {
        transactionFields[transactionFieldMap.additionalNotes] = data.additionalInfo.notes;
      }
    }

    console.log('Submitting transaction to Airtable with fields:', JSON.stringify(transactionFields, null, 2));
    
    // Submit transaction record
    const transactionResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{
          fields: transactionFields
        }]
      })
    });

    if (!transactionResponse.ok) {
      const errorData = await transactionResponse.json();
      throw new Error(errorData.error?.message || 'Error creating transaction record');
    }

    const transactionResult = await transactionResponse.json();
    const transactionId = transactionResult.records[0].id;

    // Now submit each client record independently
    const propertyAddress = data.propertyData?.address;
    const clientPromises = data.clients.map(client => submitClientToAirtable(client, propertyAddress));
    const clientResults = await Promise.all(clientPromises);

    return {
      success: true,
      transactionId: transactionId,
      clientRecords: clientResults.map(result => result.records[0].id)
    };

  } catch (error) {
    console.error('Error in submission process:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
