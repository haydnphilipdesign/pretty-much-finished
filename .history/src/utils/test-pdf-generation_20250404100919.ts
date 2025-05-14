import { submitToAirtable } from './airtable';
import { TransactionFormData } from '@/types/transaction';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create test data
const createTestData = (agentRole: 'BUYERS AGENT' | 'LISTING AGENT' | 'DUAL AGENT'): TransactionFormData => {
  return {
    agentData: {
      role: agentRole,
      name: 'Test Agent Name',
      email: 'test@example.com',
      phone: '555-123-4567'
    },
    propertyData: {
      address: '789 Test Property Ave, Testville, PA 19123',
      mlsNumber: 'MLS-TEST-12345',
      salePrice: '425000',
      status: 'OCCUPIED',
      isWinterized: 'NO',
      updateMls: 'YES',
      propertyAccessType: 'ELECTRONIC LOCKBOX',
      lockboxAccessCode: '1234',
      county: 'Test County',
      propertyType: 'RESIDENTIAL',
      isBuiltBefore1978: 'NO',
      closingDate: '2023-12-31'
    },
    propertyDetailsData: {
      resaleCertRequired: false,
      hoaName: 'Test HOA',
      coRequired: false,
      municipality: 'Test Township',
      firstRightOfRefusal: false,
      firstRightName: '',
      attorneyRepresentation: true,
      attorneyName: 'Test Attorney',
      homeWarranty: true,
      warrantyCompany: 'Test Warranty Company',
      warrantyCost: '550',
      warrantyPaidBy: 'SELLER'
    },
    titleData: {
      titleCompany: 'Test Title Company'
    },
    signatureData: {
      signature: 'Test Signature',
      confirmAccuracy: true
    },
    documentsData: {
      documents: [
        { name: 'Agreement of Sale', required: true, selected: true },
        { name: 'Seller Disclosure', required: true, selected: true },
        { name: 'Lead-Based Paint Disclosure', required: false, selected: false }
      ],
      confirmDocuments: true
    },
    clients: [
      {
        id: 'test-buyer-1',
        name: 'Test Buyer',
        email: 'buyer@example.com',
        phone: '555-111-2222',
        address: '123 Buyer St, Buyertown, PA 19111',
        maritalStatus: 'MARRIED',
        type: 'BUYER'
      },
      {
        id: 'test-seller-1',
        name: 'Test Seller',
        email: 'seller@example.com',
        phone: '555-333-4444',
        address: '456 Seller Ave, Sellersville, PA 19222',
        maritalStatus: 'SINGLE',
        type: 'SELLER'
      }
    ],
    commissionData: {
      totalCommissionPercentage: '6',
      listingAgentPercentage: '3',
      buyersAgentPercentage: '3',
      hasBrokerFee: false,
      brokerFeeAmount: '',
      hasSellersAssist: true,
      sellersAssist: '4000',
      isReferral: false,
      referralParty: '',
      brokerEin: '',
      referralFee: '',
      coordinatorFeePaidBy: 'agent'
    },
    additionalInfo: {
      specialInstructions: 'Test special instructions',
      urgentIssues: 'Test urgent issues',
      notes: 'Test notes'
    }
  };
};

// Run the test for a specific agent role
const runTest = async (agentRole: 'BUYERS AGENT' | 'LISTING AGENT' | 'DUAL AGENT') => {
  console.log(`\n===== Testing PDF Generation for ${agentRole} =====`);
  
  try {
    console.log(`Creating test data for ${agentRole}...`);
    const testData = createTestData(agentRole);
    
    console.log('Submitting test data to Airtable...');
    console.log(`Property: ${testData.propertyData.address}`);
    console.log(`MLS: ${testData.propertyData.mlsNumber}`);
    console.log(`Agent: ${testData.agentData.name} (${testData.agentData.role})`);
    
    const result = await submitToAirtable(testData);
    
    console.log('✅ Form submitted successfully!');
    console.log(`Transaction ID: ${result.transactionId}`);
    console.log('Cover sheet generation started in the background');
    console.log('Check your email (debbie@parealestatesupport.com) for the PDF');
    
    return result;
  } catch (error) {
    console.error(`❌ Test failed for ${agentRole}:`, error);
    throw error;
  }
};

// Main function to run all tests
const main = async () => {
  console.log('===== PDF GENERATION TEST =====');
  console.log('Testing PDF generation with dummy form data');
  
  try {
    // Test for Buyer's Agent
    await runTest('BUYERS AGENT');
    
    // Test for Listing Agent
    await runTest('LISTING AGENT');
    
    // Test for Dual Agent
    await runTest('DUAL AGENT');
    
    console.log('\n✅ All tests completed successfully!');
    console.log('Check your email for the generated PDFs.');
  } catch (error) {
    console.error('\n❌ Tests failed:', error);
    process.exit(1);
  }
};

// Run the tests
main(); 