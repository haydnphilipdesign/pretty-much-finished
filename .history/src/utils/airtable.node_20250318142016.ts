import Airtable from 'airtable';
import { TransactionFormData } from '@/types/transaction';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.warn(`No .env file found at ${envPath}`);
}

// Get environment variables from process.env instead of import.meta.env
const API_KEY = process.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;
const TRANSACTIONS_TABLE_ID = process.env.VITE_AIRTABLE_TRANSACTIONS_TABLE_ID || 'tblHyCJCpQSgjn0md';
const CLIENTS_TABLE_ID = process.env.VITE_AIRTABLE_CLIENTS_TABLE_ID || 'tblvdy7T9Hv4SasdI';

// Check if API key and base ID are set
if (!API_KEY) {
  console.error('Airtable API key is not set. Please check your environment variables.');
}

if (!BASE_ID) {
  console.error('Airtable base ID is not set. Please check your environment variables.');
}

// Log environment variables status
console.log('Airtable API key:', API_KEY ? `Set (${API_KEY.substring(0, 5)}...)` : 'Not set');
console.log('Airtable base ID:', BASE_ID ? `Set (${BASE_ID})` : 'Not set');
console.log('Transactions table ID:', TRANSACTIONS_TABLE_ID);
console.log('Clients table ID:', CLIENTS_TABLE_ID);

const airtableBase = new Airtable({
  apiKey: API_KEY,
}).base(BASE_ID);

const transactionsTable = airtableBase(TRANSACTIONS_TABLE_ID);
const clientsTable = airtableBase(CLIENTS_TABLE_ID);

// Field mappings based on Fields.csv
const transactionFieldMap = {
  // Property data fields
  mlsNumber: 'fld6O2FgIXQU5G27o',         // MLS Number
  address: 'fldypnfnHhplWYcCW',           // Address
  propertyStatus: 'fldV2eLxz6w0TpLFU',    // Property Status
  salePrice: 'fldhHjBZJISmnP8SK',         // Sale Price
  isWinterized: 'fldExdgBDgdB1i9jy',      // Winterized
  updateMls: 'fldw3GlfvKtyNfIAW',         // Update MLS
  
  // Commission data fields
  sellersAssist: 'fldTvXx96Na0zRh6W',     // Sellers Assist
  totalCommission: 'fldsOqVJDGYKUjD8L',   // Total Commission
  totalCommissionPercentage: 'fldE8INzEorBtx2uN', // Total Commission Percentage
  listingAgentPercentage: 'flduuQQT7o6XAGlRe', // Listing Agent Percentage
  buyersAgentPercentage: 'fld5KRrToAAt5kOLd', // Buyer's Agent Percentage
  isReferral: 'fldLVyXkhqppQ7WpC',        // Referral
  referralParty: 'fldzVtmn8uylVxuTF',     // Referral Party
  referralFee: 'fldewmjoaJVwiMF46',       // Referral Fee
  brokerEin: 'fld20VbKbWzdR4Sp7',         // Broker EIN
  
  // Additional info fields
  specialInstructions: 'fldDWN8jU4kdCffzu', // Special Instructions
  urgentIssues: 'fldgW16aPdFMdspO6',      // Urgent Issues
  notes: 'fld30htJ7euVerCLW',             // Additional Information
  requiresFollowUp: 'fldIG7LFmo1Sro6Oz',  // Requires Follow Up
  
  // Signature data fields
  agentName: 'fldFD4xHD0vxnSOHJ',         // Agent Name
  dateSubmitted: 'fldSSndzSwwzeLSph',     // Date Submitted
  termsAccepted: 'fldgBdQYZLx6IRdSn',     // Terms Accepted
  infoConfirmed: 'fldlFelkiiGDrSCqe',     // Info Confirmed
  
  // Other fields
  agentRole: 'fldOVyoxz38rWwAFy',         // Agent Role
  clients: 'fldmPyBwuOO1dgj1g'            // Clients
};

// Client fields based on Fields.csv
const clientFieldMap = {
  name: 'fldSqxNOZ9B5PgSab',              // Client Name
  email: 'flddP6a8EG6qTJdIi',             // Client Email
  phone: 'fldBnh8W6iGW014yY',             // Client Phone
  address: 'fldz1IpeR1256LhuC',           // Client Address
  type: 'fldSY6vbE1zAhJZqd',              // Client Type
  maritalStatus: 'fldeK6mjSfxELU0MD'      // Marital Status
};

// Helper function to format data according to field types
const formatFieldValue = (value: any, fieldName: string): any => {
  switch (fieldName) {
    case 'salePrice':
    case 'sellersAssist':
    case 'totalCommission':
    case 'fixedCommissionAmount':
    case 'referralFee':
      // Convert to number and ensure 2 decimal places
      return typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
    
    case 'buyerPaidPercentage':
    case 'buyersAgentPercentage':
    case 'listingAgentPercentage':
    case 'totalCommissionPercentage':
      // Convert to number and ensure 2 decimal places
      return typeof value === 'string' ? parseFloat(value) : value;
    
    case 'phone':
      // Format phone number
      return value?.replace(/[^0-9]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    
    case 'isReferral':
    case 'requiresFollowUp':
    case 'updateMls':
    case 'isWinterized':
      // Ensure YES/NO format
      return value?.toUpperCase() === 'YES' ? true : false;
    
    default:
      return value;
  }
};

export const submitToAirtable = async (data: TransactionFormData) => {
  try {
    console.log("Submitting form data to Airtable:", JSON.stringify(data, null, 2));
    
    // Create client records first - only include fields from Fields.csv
    const clientRecords = await Promise.all(
      data.clients.map(async (client) => {
        try {
          // Only include fields that are in the Fields.csv file
          const fields: Record<string, any> = {};
          
          // Client Name (fldSqxNOZ9B5PgSab)
          if (client.name) {
            fields[clientFieldMap.name] = client.name;
          }
          
          // Client Email (flddP6a8EG6qTJdIi)
          if (client.email) {
            fields[clientFieldMap.email] = client.email;
          }
          
          // Client Phone (fldBnh8W6iGW014yY)
          if (client.phone) {
            fields[clientFieldMap.phone] = formatFieldValue(client.phone, 'phone');
          }
          
          // Client Address (fldz1IpeR1256LhuC)
          if (client.address) {
            fields[clientFieldMap.address] = client.address;
          }
          
          // Client Type (fldSY6vbE1zAhJZqd)
          if (client.type) {
            fields[clientFieldMap.type] = client.type.toUpperCase();
          }
          
          // Marital Status (fldeK6mjSfxELU0MD)
          if (client.maritalStatus) {
            fields[clientFieldMap.maritalStatus] = client.maritalStatus.toUpperCase();
          }

          console.log("Creating client record with fields:", fields);
          
          // Airtable expects the fields property
          const record = await clientsTable.create({
            fields: fields
          });
          return record.getId();
        } catch (clientError: any) {
          console.error("Error creating client record:", clientError);
          throw new Error(`Failed to create client record: ${clientError.message}`);
        }
      })
    );

    // Create transaction record - only include fields from Fields.csv
    const transactionFields: Record<string, any> = {};
    
    // Agent Role (fldOVyoxz38rWwAFy)
    if (data.agentData?.role) {
      transactionFields[transactionFieldMap.agentRole] = data.agentData.role;
    }
    
    // Property data fields from Fields.csv
    if (data.propertyData) {
      // MLS Number (fld6O2FgIXQU5G27o)
      if (data.propertyData.mlsNumber) {
        transactionFields[transactionFieldMap.mlsNumber] = data.propertyData.mlsNumber;
      }
      
      // Address (fldypnfnHhplWYcCW)
      if (data.propertyData.address) {
        transactionFields[transactionFieldMap.address] = data.propertyData.address;
      }
      
      // Sale Price (fldhHjBZJISmnP8SK)
      if (data.propertyData.salePrice) {
        transactionFields[transactionFieldMap.salePrice] = formatFieldValue(data.propertyData.salePrice, 'salePrice');
      }
      
      // Property Status (fldV2eLxz6w0TpLFU)
      if (data.propertyData.propertyStatus) {
        transactionFields[transactionFieldMap.propertyStatus] = data.propertyData.propertyStatus;
      }
      
      // Winterized (fldExdgBDgdB1i9jy)
      if (data.propertyData.isWinterized) {
        transactionFields[transactionFieldMap.isWinterized] = formatFieldValue(data.propertyData.isWinterized, 'isWinterized');
      }
      
      // Update MLS (fldw3GlfvKtyNfIAW)
      if (data.propertyData.updateMls) {
        transactionFields[transactionFieldMap.updateMls] = formatFieldValue(data.propertyData.updateMls, 'updateMls');
      }
    }
    
    // Commission data fields from Fields.csv
    if (data.commissionData) {
      // Total Commission Percentage (fldE8INzEorBtx2uN)
      if (data.commissionData.totalCommission) {
        transactionFields[transactionFieldMap.totalCommissionPercentage] = formatFieldValue(data.commissionData.totalCommission, 'totalCommissionPercentage');
      }
      
      // Listing Agent Percentage (flduuQQT7o6XAGlRe)
      if (data.commissionData.listingAgentPercentage) {
        transactionFields[transactionFieldMap.listingAgentPercentage] = formatFieldValue(data.commissionData.listingAgentPercentage, 'listingAgentPercentage');
      }
      
      // Buyer's Agent Percentage (fld5KRrToAAt5kOLd)
      if (data.commissionData.buyersAgentPercentage) {
        transactionFields[transactionFieldMap.buyersAgentPercentage] = formatFieldValue(data.commissionData.buyersAgentPercentage, 'buyersAgentPercentage');
      }
      
      // Buyer Paid Percentage (flddRltdGj05Clzpa)
      if (data.commissionData.buyerPaidPercentage) {
        transactionFields[transactionFieldMap.buyerPaidPercentage] = formatFieldValue(data.commissionData.buyerPaidPercentage, 'buyerPaidPercentage');
      }
      
      // Sellers Assist (fldTvXx96Na0zRh6W)
      if (data.commissionData.sellersAssist) {
        transactionFields[transactionFieldMap.sellersAssist] = formatFieldValue(data.commissionData.sellersAssist, 'sellersAssist');
      }
      
      // Referral (fldLVyXkhqppQ7WpC)
      if (data.commissionData.isReferral) {
        transactionFields[transactionFieldMap.isReferral] = formatFieldValue(data.commissionData.isReferral, 'isReferral');
      }
      
      // Referral Party (fldzVtmn8uylVxuTF)
      if (data.commissionData.referralParty) {
        transactionFields[transactionFieldMap.referralParty] = data.commissionData.referralParty;
      }
      
      // Referral Fee (fldewmjoaJVwiMF46)
      if (data.commissionData.referralFee) {
        transactionFields[transactionFieldMap.referralFee] = formatFieldValue(data.commissionData.referralFee, 'referralFee');
      }
      
      // Broker EIN (fld20VbKbWzdR4Sp7)
      if (data.commissionData.brokerEin) {
        transactionFields[transactionFieldMap.brokerEin] = data.commissionData.brokerEin;
      }
    }
    
    // Additional info fields from Fields.csv
    if (data.additionalInfo) {
      // Special Instructions (fldDWN8jU4kdCffzu)
      if (data.additionalInfo.specialInstructions) {
        transactionFields[transactionFieldMap.specialInstructions] = data.additionalInfo.specialInstructions;
      }
      
      // Urgent Issues (fldgW16aPdFMdspO6)
      if (data.additionalInfo.urgentIssues) {
        transactionFields[transactionFieldMap.urgentIssues] = data.additionalInfo.urgentIssues;
      }
      
      // Additional Information (fld30htJ7euVerCLW)
      if (data.additionalInfo.notes) {
        transactionFields[transactionFieldMap.notes] = data.additionalInfo.notes;
      }
      
      // Requires Follow Up (fldIG7LFmo1Sro6Oz)
      if (data.additionalInfo.requiresFollowUp) {
        transactionFields[transactionFieldMap.requiresFollowUp] = formatFieldValue(data.additionalInfo.requiresFollowUp, 'requiresFollowUp');
      }
    }
    
    // Signature data fields from Fields.csv
    if (data.signatureData) {
      // Agent Name (fldFD4xHD0vxnSOHJ)
      if (data.signatureData.agentName) {
        transactionFields[transactionFieldMap.agentName] = data.signatureData.agentName;
      }
      
      // Date Submitted (fldSSndzSwwzeLSph)
      if (data.signatureData.dateSubmitted) {
        transactionFields[transactionFieldMap.dateSubmitted] = data.signatureData.dateSubmitted;
      }
      
      // Terms Accepted (fldgBdQYZLx6IRdSn)
      if (data.signatureData.termsAccepted) {
        transactionFields[transactionFieldMap.termsAccepted] = data.signatureData.termsAccepted;
      }
      
      // Info Confirmed (fldlFelkiiGDrSCqe)
      if (data.signatureData.infoConfirmed) {
        transactionFields[transactionFieldMap.infoConfirmed] = data.signatureData.infoConfirmed;
      }
    }

    // Add client links (fldmPyBwuOO1dgj1g)
    transactionFields[transactionFieldMap.clients] = clientRecords;

    console.log("Creating transaction record with fields:", transactionFields);
    
    try {
      // Airtable expects the fields property
      const record = await transactionsTable.create({
        fields: transactionFields
      });
      console.log("Transaction record created successfully:", record.getId());
      return { success: true };
    } catch (transactionError: any) {
      console.error("Error creating transaction record:", transactionError);
      throw new Error(`Failed to create transaction record: ${transactionError.message}`);
    }
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    throw error;
  }
};
