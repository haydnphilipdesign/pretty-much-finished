import Airtable from 'airtable';
import { TransactionFormData } from '@/types/transaction';
import { formatAddress } from "@/utils/addressUtils";
import { generateCoverSheetForTransaction } from "@/utils/coverSheetGenerator";

// Get API key and Base ID from appropriate environment source
const apiKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AIRTABLE_API_KEY 
  ? import.meta.env.VITE_AIRTABLE_API_KEY 
  : process.env.AIRTABLE_API_KEY || '';
  
const baseId = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AIRTABLE_BASE_ID 
  ? import.meta.env.VITE_AIRTABLE_BASE_ID 
  : process.env.AIRTABLE_BASE_ID || '';

const airtableBase = new Airtable({
  apiKey,
}).base(baseId);

const TRANSACTIONS_TABLE_ID = 'tblHyCJCpQSgjn0md';
const CLIENTS_TABLE_ID = 'tblvdy7T9Hv4SasdI';

const transactionsTable = airtableBase(TRANSACTIONS_TABLE_ID);
const clientsTable = airtableBase(CLIENTS_TABLE_ID);

// Updated field mappings based on CSV
const transactionFieldMap = {
  address: 'fldypnfnHhplWYcCW',
  agentName: 'fldFD4xHD0vxnSOHJ',
  brokerEin: 'fld20VbKbWzdR4Sp7',
  mlsNumber: 'fld6O2FgIXQU5G27o',
  referralParty: 'fldzVtmn8uylVxuTF',
  buyerPaidPercentage: 'flddRltdGj05Clzpa',
  buyersAgentPercentage: 'fld5KRrToAAt5kOLd',
  listingAgentPercentage: 'flduuQQT7o6XAGlRe',
  referralFee: 'fldewmjoaJVwiMF46',
  totalCommissionPercentage: 'fldE8INzEorBtx2uN',
  fixedCommissionAmount: 'fldNXNV9Yx2LwJPhN',
  salePrice: 'fldhHjBZJISmnP8SK',
  sellersAssist: 'fldTvXx96Na0zRh6W',
  totalCommission: 'fldsOqVJDGYKUjD8L',
  agentRole: 'fldOVyoxz38rWwAFy',
  propertyStatus: 'fldV2eLxz6w0TpLFU',
  isReferral: 'fldLVyXkhqppQ7WpC',
  requiresFollowUp: 'fldIG7LFmo1Sro6Oz',
  updateMls: 'fldw3GlfvKtyNfIAW',
  isWinterized: 'fldExdgBDgdB1i9jy',
  notes: 'fld30htJ7euVerCLW',
  specialInstructions: 'fldDWN8jU4kdCffzu',
  urgentIssues: 'fldgW16aPdFMdspO6'
};

const clientFieldMap = {
  address: 'fldz1IpeR1256LhuC',
  name: 'fldSqxNOZ9B5PgSab',
  email: 'flddP6a8EG6qTJdIi',
  type: 'fldSY6vbE1zAhJZqd',
  maritalStatus: 'fldeK6mjSfxELU0MD',
  phone: 'fldBnh8W6iGW014yY'
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
    
    // Format property address
    const propertyAddress = data.propertyData.address;
    
    // Create client records
    const clientPromises = data.clients.map(async (client) => {
      const fields: Record<string, any> = {
        [clientFieldMap.name]: client.name,
        [clientFieldMap.email]: client.email,
        [clientFieldMap.phone]: client.phone,
        [clientFieldMap.address]: client.address,
        [clientFieldMap.maritalStatus]: client.maritalStatus,
        [clientFieldMap.type]: client.type,
      };

      console.log("Creating client record with fields:", fields);
      const record = await clientsTable.create(fields);
      return record.id;
    });

    // Create transaction record
    const transactionFields: Record<string, any> = {};
    
    // Map agent role
    if (data.agentData?.role) {
      transactionFields[transactionFieldMap.agentRole] = data.agentData.role;
    }
    
    // Map property data
    if (data.propertyData) {
      if (data.propertyData.mlsNumber) {
        transactionFields[transactionFieldMap.mlsNumber] = data.propertyData.mlsNumber;
      }
      
      if (data.propertyData.address) {
        transactionFields[transactionFieldMap.address] = data.propertyData.address;
      }
      
      if (data.propertyData.salePrice) {
        transactionFields[transactionFieldMap.salePrice] = formatFieldValue(data.propertyData.salePrice, 'salePrice');
      }
      if (data.propertyData.status) {
        transactionFields[transactionFieldMap.propertyStatus] = data.propertyData.status;
      }
      if (data.propertyData.isWinterized) {
        transactionFields[transactionFieldMap.isWinterized] = formatFieldValue(data.propertyData.isWinterized, 'isWinterized');
      }
      if (data.propertyData.updateMls) {
        transactionFields[transactionFieldMap.updateMls] = formatFieldValue(data.propertyData.updateMls, 'updateMls');
      }
    }
    
    // Map commission data
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
        transactionFields[transactionFieldMap.buyerPaidPercentage] = formatFieldValue(data.commissionData.brokerFeeAmount, 'buyerPaidPercentage');
      }
      if (data.commissionData.hasSellersAssist && data.commissionData.sellersAssist) {
        transactionFields[transactionFieldMap.sellersAssist] = formatFieldValue(data.commissionData.sellersAssist, 'sellersAssist');
      }
      if (data.commissionData.isReferral) {
        transactionFields[transactionFieldMap.isReferral] = formatFieldValue(data.commissionData.isReferral ? 'YES' : 'NO', 'isReferral');
      }
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
    
    // Map additional info
    if (data.additionalInfo) {
      if (data.additionalInfo.specialInstructions) {
        transactionFields[transactionFieldMap.specialInstructions] = data.additionalInfo.specialInstructions;
      }
      if (data.additionalInfo.urgentIssues) {
        transactionFields[transactionFieldMap.urgentIssues] = data.additionalInfo.urgentIssues;
      }
      if (data.additionalInfo.notes) {
        transactionFields[transactionFieldMap.notes] = data.additionalInfo.notes;
      }
    }
    
    // Map agent name from agent data
    if (data.agentData?.name) {
      transactionFields[transactionFieldMap.agentName] = data.agentData.name;
    }

    // Add client links
    const clientRecords = await Promise.all(clientPromises);
    transactionFields['fldmPyBwuOO1dgj1g'] = clientRecords;

    console.log("Creating transaction record with fields:", transactionFields);
    const transactionRecord = await transactionsTable.create(transactionFields);
    
    // Generate PDF after successful submission (in background)
    try {
      // Generate the cover sheet in the background - no need to await
      generateCoverSheetForTransaction(
        transactionRecord.id, 
        data.agentData?.role || 'DUAL AGENT'
      ).then(success => {
        if (success) {
          console.log('Cover sheet generated and emailed successfully');
        } else {
          console.error('Failed to send cover sheet email');
        }
      }).catch(error => {
        console.error('Error generating cover sheet:', error);
      });
      
      // Log that the process has started
      console.log('Cover sheet generation process started in background');
    } catch (pdfError) {
      // Just log the error, but don't fail the submission
      console.error('Error setting up PDF generation:', pdfError);
    }
    
    // Return success with transaction ID, but no PDF URL since it's emailed directly
    return { 
      success: true,
      transactionId: transactionRecord.id
    };
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    throw error;
  }
};
