import { submitToAirtable } from './airtable.final';
import { TransactionFormState } from '@/types/transactionFormState';

/**
 * Creates a sample transaction data object and submits it to Airtable
 * This allows testing the Airtable submission without going through the form
 */
const testSubmitTransaction = async () => {
  console.log('Starting test transaction submission...');
  console.log('Environment check:', {
    apiKey: import.meta.env.VITE_AIRTABLE_API_KEY ? 'defined' : 'undefined',
    baseId: import.meta.env.VITE_AIRTABLE_BASE_ID ? 'defined' : 'undefined'
  });
  
  // Create sample transaction data
  const sampleData: TransactionFormState = {
    clients: [
      {
        id: '1',
        name: 'Test Buyer',
        email: 'testbuyer@example.com',
        phone: '(215) 555-1234',
        address: '123 Test Street, Philadelphia, PA 19103',
        maritalStatus: "SINGLE",
        type: "BUYER",
        role: "buyer"
      },
      {
        id: '2',
        name: 'Test Seller',
        email: 'testseller@example.com',
        phone: '(215) 555-5678',
        address: '456 Sample Ave, Philadelphia, PA 19103',
        maritalStatus: "MARRIED",
        type: "SELLER",
        role: "seller"
      }
    ],
    agentData: {
      role: "listingAgent",
      agentName: 'Test Agent',
      name: 'Test Agent',
      email: 'testagent@example.com',
      phone: '(215) 555-9012'
    },
    propertyData: {
      mlsNumber: 'PAPH123456',
      address: '789 Test Property, Philadelphia, PA 19103',
      salePrice: '350000',
      propertyStatus: "vacant",
      isWinterized: "yes",
      updateMLS: "yes",
      resaleCertRequired: false,
      hoaName: 'Test HOA',
      coRequired: false,
      municipality: 'Philadelphia',
      firstRightOfRefusal: false,
      firstRightName: '',
      attorneyRepresentation: false,
      attorneyName: ''
    },
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
    commissionData: {
      totalCommission: '6',
      listingAgentPercentage: '3',
      buyersAgentPercentage: '3',
      buyerPaidPercentage: '',
      brokerFeeAmount: '500',
      sellersAssist: '5000',
      isReferral: false,
      referralParty: '',
      referralFee: '',
      brokerEin: '12-3456789',
      coordinatorFeePaidBy: "client"
    },
    warrantyData: {
      homeWarranty: true,
      warrantyCompany: 'Test Warranty Co',
      warrantyCost: '500',
      paidBy: 'seller'
    },
    titleData: {
      titleCompany: 'Test Title Co'
    },
    additionalInfo: {
      specialInstructions: 'Test special instructions',
      urgentIssues: 'Test urgent issues',
      notes: 'Test additional notes'
    }
  };

  try {
    // Submit to Airtable
    const result = await submitToAirtable(sampleData);
    console.log('Test transaction submission result:', result);
    return result;
  } catch (error) {
    console.error('Error in test transaction submission:', error);
    throw error;
  }
};

const mapCommissionDataToAirtable = (commissionData) => {
  return {
    "Total Commission": commissionData.totalCommission,
    "Listing Agent Commission": commissionData.listingAgentPercentage,
    "Buyers Agent Commission": commissionData.buyersAgentPercentage,
    "Broker Fee": commissionData.brokerFeeAmount,
    "Sellers Assist": commissionData.sellersAssist,
    "Referral Fee": commissionData.referralFee,
    "Broker Ein": commissionData.brokerEin,
    "Coordinator Fee Paid By": commissionData.coordinatorFeePaidBy,
    "Referral Party": commissionData.referralParty,
    "Is Referral": commissionData.isReferral
  };
};

export default testSubmitTransaction;
