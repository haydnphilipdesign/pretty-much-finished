import { submitToAirtable } from './airtable.final';
import { TransactionFormData } from '@/types/transaction';

/**
 * Creates a sample transaction data object and submits it to Airtable
 * This allows testing the Airtable submission without going through the form
 * This debug version includes additional error handling and logging
 */
const testSubmitTransaction = async () => {
  console.log('Starting test transaction submission with debug logging...');
  
  // Check environment variables
  const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
  const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const TRANSACTIONS_TABLE_ID = import.meta.env.VITE_AIRTABLE_TRANSACTIONS_TABLE_ID;
  const CLIENTS_TABLE_ID = import.meta.env.VITE_AIRTABLE_CLIENTS_TABLE_ID;

  console.log('Environment variables:');
  console.log('- API_KEY:', API_KEY ? `Set (${API_KEY.substring(0, 5)}...)` : 'Not set');
  console.log('- BASE_ID:', BASE_ID ? `Set (${BASE_ID})` : 'Not set');
  console.log('- TRANSACTIONS_TABLE_ID:', TRANSACTIONS_TABLE_ID || 'Not set');
  console.log('- CLIENTS_TABLE_ID:', CLIENTS_TABLE_ID || 'Not set');

  if (!API_KEY) {
    throw new Error('Airtable API key is not set. Please check your environment variables.');
  }

  if (!BASE_ID) {
    throw new Error('Airtable base ID is not set. Please check your environment variables.');
  }

  // Create sample transaction data
  const sampleData: any = {
    clients: [
      {
        id: '1',
        name: 'Test Buyer',
        email: 'testbuyer@example.com',
        phone: '(215) 555-1234',
        address: '123 Test Street, Philadelphia, PA 19103',
        type: 'BUYER',
        maritalStatus: 'SINGLE'
      },
      {
        id: '2',
        name: 'Test Seller',
        email: 'testseller@example.com',
        phone: '(215) 555-5678',
        address: '456 Sample Ave, Philadelphia, PA 19103',
        type: 'SELLER',
        maritalStatus: 'MARRIED'
      }
    ],
    agentData: {
      role: 'listingAgent',
      agentName: 'Test Agent'
    },
    propertyData: {
      mlsNumber: 'PAPH123456',
      address: '789 Test Property, Philadelphia, PA 19103',
      salePrice: '350000',
      propertyStatus: 'VACANT', // Changed from status to propertyStatus with valid value
      isWinterized: 'NO',
      updateMls: 'YES',
      // Adding required fields from PropertyData
      resaleCertRequired: false,
      hoaName: 'Test HOA',
      coRequired: false,
      municipality: 'Philadelphia',
      firstRightOfRefusal: false,
      firstRightName: '',
      attorneyRepresentation: false,
      attorneyName: ''
    },
    commissionData: {
      commissionBase: 'SALE PRICE', // Fixed space in SALE PRICE
      totalCommission: '6',
      totalCommissionPercentage: '6', // Added required field
      fixedCommissionAmount: '', // Added required field
      listingAgentPercentage: '3', // Changed from listingAgentCommission
      buyersAgentPercentage: '3', // Changed from buyersAgentCommission
      buyerPaidPercentage: '0', // Changed from buyerPaidCommission
      sellersAssist: '5000',
      isReferral: 'NO',
      referralParty: '',
      referralFee: '',
      brokerEin: '12-3456789'
    },
    // Added required propertyDetailsData
    propertyDetailsData: {
      resaleCertRequired: false,
      hoaName: 'Test HOA',
      coRequired: false,
      municipality: 'Philadelphia',
      firstRightOfRefusal: false,
      firstRightName: '',
      attorneyRepresentation: false,
      attorneyName: ''
    },
    // Added required warrantyData
    warrantyData: {
      homeWarranty: false,
      warrantyCompany: '',
      warrantyCost: '',
      paidBy: 'SELLER'
    },
    // Added required titleData
    titleData: {
      titleCompany: 'Test Title Company'
    },
    additionalInfo: {
      specialInstructions: 'This is a test submission',
      urgentIssues: 'None - this is just a test',
      notes: 'Sample transaction for testing Airtable integration',
      requiresFollowUp: 'NO'
    },
    signatureData: {
      agentName: 'Test Agent',
      dateSubmitted: new Date().toISOString(),
      termsAccepted: true,
      infoConfirmed: true,
      signature: 'Test Agent' // Changed from signatureDataUrl to signature
    }
  };

  console.log('Sample data prepared:', JSON.stringify(sampleData, null, 2));

  try {
    // Submit to Airtable
    console.log('Calling submitToAirtable...');
    const result = await submitToAirtable(sampleData);
    console.log('Test transaction submission result:', result);
    return result;
  } catch (error: any) {
    console.error('Error in test transaction submission:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Try to get more details if it's an Airtable error
    if (error.error) {
      console.error('Airtable error details:', error.error);
    }
    
    throw error;
  }
};

export default testSubmitTransaction;
