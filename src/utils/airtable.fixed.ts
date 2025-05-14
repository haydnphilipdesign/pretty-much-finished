import Airtable from 'airtable';
import { TransactionFormData } from '@/types/transaction';

const airtableBase = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID);

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
  commissionBase: 'fldwx7zlKIGGIAxfq',
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
    
    // Create client records first
    const clientRecords = await Promise.all(
      data.clients.map(async (client) => {
        const fields = Object.entries(clientFieldMap).reduce((acc, [key, fieldId]) => ({
          ...acc,
          [fieldId]: formatFieldValue(client[key as keyof typeof client], key)
        }), {});

        console.log("Creating client record with fields:", fields);
        const record = await clientsTable.create({ fields });
        return record.getId();
      })
    );

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
      if (data.commissionData.totalCommission) {
        transactionFields[transactionFieldMap.totalCommissionPercentage] = formatFieldValue(data.commissionData.totalCommission, 'totalCommissionPercentage');
      }
      if (data.commissionData.listingAgentCommission) {
        transactionFields[transactionFieldMap.listingAgentPercentage] = formatFieldValue(data.commissionData.listingAgentCommission, 'listingAgentPercentage');
      }
      if (data.commissionData.buyersAgentCommission) {
        transactionFields[transactionFieldMap.buyersAgentPercentage] = formatFieldValue(data.commissionData.buyersAgentCommission, 'buyersAgentPercentage');
      }
      if (data.commissionData.buyerPaidCommission) {
        transactionFields[transactionFieldMap.buyerPaidPercentage] = formatFieldValue(data.commissionData.buyerPaidCommission, 'buyerPaidPercentage');
      }
      if (data.commissionData.sellersAssist) {
        transactionFields[transactionFieldMap.sellersAssist] = formatFieldValue(data.commissionData.sellersAssist, 'sellersAssist');
      }
      if (data.commissionData.isReferral) {
        transactionFields[transactionFieldMap.isReferral] = formatFieldValue(data.commissionData.isReferral, 'isReferral');
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
      if (data.additionalInfo.requiresFollowUp) {
        transactionFields[transactionFieldMap.requiresFollowUp] = formatFieldValue(data.additionalInfo.requiresFollowUp, 'requiresFollowUp');
      }
    }
    
    // Map signature data
    if (data.signatureData?.agentName) {
      transactionFields[transactionFieldMap.agentName] = data.signatureData.agentName;
    }

    // Add client links
    transactionFields['fldmPyBwuOO1dgj1g'] = clientRecords;

    console.log("Creating transaction record with fields:", transactionFields);
    await transactionsTable.create({ fields: transactionFields });

    return { success: true };
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    throw error;
  }
};
