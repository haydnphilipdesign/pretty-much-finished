import { submitToAirtable } from './airtable';
import { TransactionFormData } from '@/types/transaction';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Creates test transaction data for different agent roles
 */
function createTestData(agentRole: 'BUYERS AGENT' | 'LISTING AGENT' | 'DUAL AGENT'): TransactionFormData {
  // Common data for all roles
  const baseData: Partial<TransactionFormData> = {
    agentData: {
      agentName: 'John Test Smith',
      agentEmail: 'test@example.com',
      agentPhone: '215-555-1234',
      agentRole: agentRole, 
      referralAgentName: agentRole === 'DUAL AGENT' ? 'Jane Referral' : '',
      referralAgentEmail: agentRole === 'DUAL AGENT' ? 'referral@example.com' : '',
      referralAgentPhone: agentRole === 'DUAL AGENT' ? '267-555-9876' : '',
      referralAmount: agentRole === 'DUAL AGENT' ? '500' : '',
    },
    propertyData: {
      propertyAddress: '123 Test Street',
      propertyCity: 'Philadelphia',
      propertyState: 'PA',
      propertyZip: '19123',
      propertyType: 'Single Family',
      mlsNumber: agentRole === 'LISTING AGENT' ? 'MLS12345' : '', 
      settlementDate: '2023-12-31',
      settlementCompany: 'Test Title Co.',
      settlementAddress: '999 Settlement Ave',
    },
    clients: [
      {
        clientId: '1',
        clientName: 'Buyer TestClient',
        clientEmail: 'buyer@example.com',
        clientPhone: '215-555-6789',
        clientType: 'Buyer',
      }
    ],
    commissionData: {
      salePrice: '350000',
      commissionPercent: '3',
      bonusAmount: '1000',
      processingFee: '395',
      transactionCoordinator: agentRole === 'LISTING AGENT' ? true : false,
    }
  };

  // Add role-specific data
  switch (agentRole) {
    case 'BUYERS AGENT':
      // Add seller info for buyer's agent
      baseData.clients?.push({
        clientId: '2',
        clientName: 'Seller OtherParty',
        clientEmail: 'seller@example.com',
        clientPhone: '215-555-4321',
        clientType: 'Seller',
      });
      break;
    case 'LISTING AGENT':
      // Add buyer info for listing agent
      baseData.clients?.push({
        clientId: '2',
        clientName: 'Buyer OtherParty',
        clientEmail: 'otherbuyer@example.com',
        clientPhone: '215-555-8765',
        clientType: 'Buyer',
      });
      break;
    case 'DUAL AGENT':
      // Add additional client for dual agent
      baseData.clients?.push({
        clientId: '2',
        clientName: 'Seller DualClient',
        clientEmail: 'dualseller@example.com',
        clientPhone: '215-555-9999',
        clientType: 'Seller',
      });
      break;
  }

  return baseData as TransactionFormData;
}

/**
 * Runs a test submission with the specified agent role
 */
async function runTest(role: 'BUYERS AGENT' | 'LISTING AGENT' | 'DUAL AGENT'): Promise<void> {
  console.log(`\n🧪 Testing PDF generation for ${role}...`);
  
  try {
    // Generate test data
    const testData = createTestData(role);
    
    // Submit to Airtable (which now triggers PDF generation)
    console.log(`Submitting test data for ${role}...`);
    const result = await submitToAirtable(testData);
    
    if (result.success) {
      console.log(`✅ Test successful for ${role}!`);
      console.log(`Transaction ID: ${result.transactionId}`);
      console.log(`Cover sheet generation triggered in the background`);
      // Wait a moment for any async operations to complete
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.error(`❌ Test failed for ${role}: ${result.error}`);
    }
  } catch (error) {
    console.error(`❌ Error during test for ${role}:`, error);
  }
}

/**
 * Main function to run all tests
 */
async function main() {
  console.log('🚀 Starting PDF Generation Tests');
  console.log('===============================');

  // Check if we have the required environment variables
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.error(`
❌ Missing required environment variables!
   Please make sure your .env file contains:
   AIRTABLE_API_KEY=your_api_key
   AIRTABLE_BASE_ID=your_base_id
   
   For email functionality, also ensure you have:
   EMAIL_HOST=your_smtp_host
   EMAIL_PORT=your_smtp_port
   EMAIL_USER=your_email_user
   EMAIL_PASSWORD=your_email_password
   EMAIL_SECURE=true_or_false
   EMAIL_FROM=sender_email
   EMAIL_RECIPIENT=recipient_email

   You can run 'npm run setup:email' to configure email settings.
    `);
    process.exit(1);
  }

  try {
    // Test for all three agent roles
    await runTest('BUYERS AGENT');
    await runTest('LISTING AGENT');
    await runTest('DUAL AGENT');
    
    console.log('\n✅ All tests completed!');
    console.log('Please check your email for the generated PDFs.');
    console.log('Generated PDFs are also saved locally in the public/generated-pdfs directory.');
  } catch (error) {
    console.error('❌ Error running tests:', error);
    process.exit(1);
  }
}

// Run the tests
main(); 