/**
 * Airtable integration - Transaction First Approach
 * 
 * This implementation creates the transaction record first, then links client records to it.
 * This approach simplifies the relationship management in Airtable.
 */

import { TransactionFormData } from '../types/transaction';

// Field IDs for the Transactions table
const transactionFieldMap = {
  mlsNumber: 'fld6O2FgIXQU5G27o',           // MLS Number
  address: 'fldypnfnHhplWYcCW',             // Address
  propertyStatus: 'fldV2eLxz6w0TpLFU',      // Property Status
  salePrice: 'fldhHjBZJISmnP8SK',           // Sale Price
  isWinterized: 'fldExdgBDgdB1i9jy',        // Winterized
  updateMls: 'fldw3GlfvKtyNfIAW',           // Update MLS
  sellersAssist: 'fldTvXx96Na0zRh6W',       // Sellers Assist
  totalCommission: 'fldsOqVJDGYKUjD8L',     // Total Commission
  listingAgentPercentage: 'flduuQQT7o6XAGlRe', // Listing Agent Percentage
  buyersAgentPercentage: 'fld5KRrToAAt5kOLd', // Buyer's Agent Percentage
  buyerPaidPercentage: 'flddRltdGj05Clzpa',  // Buyer Paid Percentage
  isReferral: 'fldLVyXkhqppQ7WpC',          // Referral
  referralParty: 'fldzVtmn8uylVxuTF',       // Referral Party
  referralFee: 'fldewmjoaJVwiMF46',         // Referral Fee
  brokerEin: 'fld20VbKbWzdR4Sp7',           // Broker EIN
  specialInstructions: 'fldDWN8jU4kdCffzu',  // Special Instructions
  urgentIssues: 'fldgW16aPdFMdspO6',        // Urgent Issues
  notes: 'fld30htJ7euVerCLW',               // Additional Information
  requiresFollowUp: 'fldIG7LFmo1Sro6Oz',    // Requires Follow Up
  agentName: 'fldFD4xHD0vxnSOHJ',           // Agent Name
  agentRole: 'fldOVyoxz38rWwAFy',           // Agent Role
  clients: 'fldi0fN0dFhllMEp1',             // Linked Clients (relationship field)
  pdf: 'fldhrYdoFwtNfzdFY',                 // PDF Attachment field
};

// Field IDs for the Clients table
const clientFieldMap = {
  name: 'fldSqxNOZ9B5PgSab',                // Client Name
  email: 'flddP6a8EG6qTJdIi',               // Client Email
  phone: 'fldBnh8W6iGW014yY',               // Client Phone
  address: 'fldz1IpeR1256LhuC',             // Client Address
  type: 'fldSY6vbE1zAhJZqd',                // Client Type
  maritalStatus: 'fldeK6mjSfxELU0MD',       // Marital Status
  // Field that links clients to transactions
  relatedTransaction: 'fldYsIpMRHmvRjpUd',  // Related Transactions (relationship field)
};

/**
 * Format field value based on field type
 */
function formatFieldValue(value: any, fieldName: string): any {
  if (value === undefined || value === null) {
    return null;
  }

  switch (fieldName) {
    case 'salePrice':
    case 'sellersAssist':
    case 'totalCommission':
    case 'referralFee':
      // Convert string numbers to actual numbers
      return typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
    
    case 'listingAgentPercentage':
    case 'buyersAgentPercentage':
    case 'buyerPaidPercentage':
      // Convert percentage strings to numbers
      if (typeof value === 'string') {
        return parseFloat(value.replace(/[^0-9.-]+/g, ''));
      }
      return value;
    
    case 'isReferral':
    case 'requiresFollowUp':
    case 'updateMls':
    case 'isWinterized':
      // For YES/NO fields, Airtable expects the string value
      if (typeof value === 'string') {
        return value.toUpperCase(); // Ensure uppercase
      }
      return value === true ? 'YES' : 'NO';
    
    default:
      return value;
  }
}

/**
 * Create a transaction record in Airtable
 */
export async function createTransaction(formData: TransactionFormData, airtableBase: any) {
  try {
    const transactionsTable = airtableBase(import.meta.env.VITE_AIRTABLE_TRANSACTIONS_TABLE_ID);
    
    // Prepare transaction data
    const transactionFields: Record<string, any> = {
      [transactionFieldMap.mlsNumber]: formData.mlsNumber,
      [transactionFieldMap.address]: formData.address,
      [transactionFieldMap.propertyStatus]: formData.propertyStatus,
      [transactionFieldMap.salePrice]: formatFieldValue(formData.salePrice, 'salePrice'),
      [transactionFieldMap.isWinterized]: formatFieldValue(formData.isWinterized, 'isWinterized'),
      [transactionFieldMap.updateMls]: formatFieldValue(formData.updateMls, 'updateMls'),
    };

    // Handle PDF attachment if present
    if (formData.pdfData) {
      transactionFields[transactionFieldMap.pdf] = [
        {
          url: formData.pdfData,
          filename: `transaction_${formData.mlsNumber || 'new'}.pdf`
        }
      ];
    }
    
    // Add optional fields if they exist
    if (formData.sellersAssist) {
      transactionFields[transactionFieldMap.sellersAssist] = formatFieldValue(formData.sellersAssist, 'sellersAssist');
    }
    
    if (formData.totalCommission) {
      transactionFields[transactionFieldMap.totalCommission] = formatFieldValue(formData.totalCommission, 'totalCommission');
    }
    
    if (formData.totalCommissionPercentage) {
      transactionFields[transactionFieldMap.totalCommissionPercentage] = formatFieldValue(formData.totalCommissionPercentage, 'totalCommissionPercentage');
    }
    
    if (formData.listingAgentPercentage) {
      transactionFields[transactionFieldMap.listingAgentPercentage] = formatFieldValue(formData.listingAgentPercentage, 'listingAgentPercentage');
    }
    
    if (formData.buyersAgentPercentage) {
      transactionFields[transactionFieldMap.buyersAgentPercentage] = formatFieldValue(formData.buyersAgentPercentage, 'buyersAgentPercentage');
    }
    
    if (formData.buyerPaidPercentage) {
      transactionFields[transactionFieldMap.buyerPaidPercentage] = formatFieldValue(formData.buyerPaidPercentage, 'buyerPaidPercentage');
    }
    
    if (formData.isReferral) {
      transactionFields[transactionFieldMap.isReferral] = formatFieldValue(formData.isReferral, 'isReferral');
    }
    
    if (formData.referralParty) {
      transactionFields[transactionFieldMap.referralParty] = formData.referralParty;
    }
    
    if (formData.referralFee) {
      transactionFields[transactionFieldMap.referralFee] = formatFieldValue(formData.referralFee, 'referralFee');
    }
    
    if (formData.brokerEin) {
      transactionFields[transactionFieldMap.brokerEin] = formData.brokerEin;
    }
    
    if (formData.specialInstructions) {
      transactionFields[transactionFieldMap.specialInstructions] = formData.specialInstructions;
    }
    
    if (formData.urgentIssues) {
      transactionFields[transactionFieldMap.urgentIssues] = formData.urgentIssues;
    }
    
    if (formData.notes) {
      transactionFields[transactionFieldMap.notes] = formData.notes;
    }
    
    if (formData.requiresFollowUp) {
      transactionFields[transactionFieldMap.requiresFollowUp] = formatFieldValue(formData.requiresFollowUp, 'requiresFollowUp');
    }
    
    if (formData.agentName) {
      transactionFields[transactionFieldMap.agentName] = formData.agentName;
    }
    
    if (formData.agentRole) {
      transactionFields[transactionFieldMap.agentRole] = formData.agentRole;
    }
    
    console.log('Creating transaction with fields:', transactionFields);
    
    // Create the transaction record
    const transactionRecord = await transactionsTable.create(transactionFields);
    
    console.log(`Transaction created with ID: ${transactionRecord.id}`);
    
    return transactionRecord.id;
  } catch (error) {
    console.error('Error creating transaction record:', error);
    throw error;
  }
}

/**
 * Create client records and link them to the transaction
 */
export async function createClientsForTransaction(
  transactionId: string,
  clients: any[],
  propertyAddress: string,
  airtableBase: any
) {
  const clientIds: string[] = [];
  
  try {
    const clientsTable = airtableBase(import.meta.env.VITE_AIRTABLE_CLIENTS_TABLE_ID);
    
    // Create each client record
    for (const client of clients) {
      // Prepare client data
      const clientFields: Record<string, any> = {
        [clientFieldMap.name]: client.name,
        [clientFieldMap.email]: client.email,
        [clientFieldMap.phone]: client.phone,
        [clientFieldMap.address]: client.address || propertyAddress, // Use client address or property address
        [clientFieldMap.type]: client.type,
        [clientFieldMap.maritalStatus]: client.maritalStatus,
        [clientFieldMap.relatedTransaction]: [transactionId], // Link to the transaction
      };
      
      console.log(`Creating client record for ${client.name}:`, clientFields);
      
      // Create the client record
      const clientRecord = await clientsTable.create(clientFields);
      
      console.log(`Client ${client.name} created with ID: ${clientRecord.id}`);
      
      clientIds.push(clientRecord.id);
    }
    
    return clientIds;
  } catch (error) {
    console.error('Error creating client records:', error);
    throw error;
  }
}

/**
 * Update transaction with client IDs
 * This step may not be necessary if Airtable automatically handles reciprocal relationships
 */
export async function updateTransactionWithClients(
  transactionId: string,
  clientIds: string[],
  airtableBase: any
) {
  try {
    const transactionsTable = airtableBase(import.meta.env.VITE_AIRTABLE_TRANSACTIONS_TABLE_ID);
    
    // Update the transaction record with client IDs
    await transactionsTable.update(transactionId, {
      [transactionFieldMap.clients]: clientIds,
    });
    
    console.log('Updated transaction with client links');
  } catch (error) {
    console.error('Error updating transaction with clients:', error);
    throw error;
  }
}

/**
 * Submit transaction data to Airtable
 * This is the main function that orchestrates the entire process
 */
export async function submitTransactionToAirtable(formData: TransactionFormData, airtableBase: any) {
  try {
    // Step 1: Create the transaction record
    const transactionId = await createTransaction(formData, airtableBase);
    
    // Step 2: Create client records and link them to the transaction
    const clientIds = await createClientsForTransaction(
      transactionId,
      formData.clients || [],
      formData.address,
      airtableBase
    );
    
    // Step 3: Update the transaction with client IDs (may not be necessary)
    // Only do this if Airtable doesn't automatically handle the reciprocal relationship
    await updateTransactionWithClients(transactionId, clientIds, airtableBase);
    
    return {
      success: true,
      transactionId,
      clientIds,
    };
  } catch (error) {
    console.error('Error submitting transaction to Airtable:', error);
    throw error;
  }
}

/**
 * Initialize Airtable base
 */
export function initializeAirtable(Airtable: any) {
  const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
  
  if (!apiKey) {
    throw new Error('Airtable API key is not set. Please check your environment variables.');
  }
  
  if (!baseId) {
    throw new Error('Airtable base ID is not set. Please check your environment variables.');
  }
  
  return new Airtable({ apiKey }).base(baseId);
}
