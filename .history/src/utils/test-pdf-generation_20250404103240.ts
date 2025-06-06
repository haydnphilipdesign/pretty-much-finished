import { submitToAirtable } from './airtable';
import { TransactionFormData, AgentRole, Client } from '@/types/transaction';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config();

// Check environment and print debug info
const checkEnvironment = () => {
  console.log('=== Environment Check ===');
  
  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️ No .env file found at:', envPath);
    console.log('Creating a test .env file with placeholder values...');
    
    // If no .env exists, create a complete one for testing
    const testEnv = `# Test environment created by test-pdf-generation.ts
# IMPORTANT: This file contains placeholder values - replace with real credentials before testing!

# Airtable Configuration
AIRTABLE_API_KEY=test_api_key_placeholder
AIRTABLE_BASE_ID=test_base_id_placeholder

# Vite compatible variables
VITE_AIRTABLE_API_KEY=\${AIRTABLE_API_KEY}
VITE_AIRTABLE_BASE_ID=\${AIRTABLE_BASE_ID}

# Email Configuration (minimal setup for testing)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=user@example.com
EMAIL_PASSWORD=password
EMAIL_SECURE=false
EMAIL_FROM=noreply@parealestatesupport.com
EMAIL_RECIPIENT=debbie@parealestatesupport.com
`;
    
    try {
      // Create the directory if it doesn't exist
      const envDir = path.dirname(envPath);
      fs.mkdirSync(envDir, { recursive: true });
      
      // Write the file
      fs.writeFileSync(envPath, testEnv);
      console.log('✅ Created test .env file with placeholder values.');
      console.log('⚠️ ACTION REQUIRED: You must edit the .env file with real API keys before testing.');
      console.log(`   Edit the file at: ${envPath}`);
      
      // Reload environment variables
      dotenv.config();
      
      // This will exit after creating the file to ensure user edits it first
      console.log('\n❌ Test stopped: Please edit the .env file with real credentials and run again.');
      process.exit(1);
    } catch (error) {
      console.error('❌ Failed to create .env file:', error);
    }
  } else {
    console.log('✅ .env file found at:', envPath);
    
    // Read the file contents to check for placeholder values
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('test_api_key_placeholder') || 
        envContent.includes('your_api_key_here') ||
        envContent.includes('AIRTABLE_API_KEY=') && !envContent.match(/AIRTABLE_API_KEY=\S+/)) {
      console.log('⚠️ The .env file contains placeholder API keys.');
      console.log('   Please edit the file with your actual Airtable API key and Base ID.');
      process.exit(1);
    }
  }
  
  // Check for required environment variables
  const airtableKey = process.env.AIRTABLE_API_KEY || '';
  const airtableBase = process.env.AIRTABLE_BASE_ID || '';
  
  console.log('Airtable API Key:', airtableKey ? '✅ Found' : '❌ Missing');
  console.log('Airtable Base ID:', airtableBase ? '✅ Found' : '❌ Missing');
  
  // Check email configuration
  const emailHost = process.env.EMAIL_HOST || '';
  const emailUser = process.env.EMAIL_USER || '';
  
  console.log('Email Host:', emailHost ? '✅ Found' : '❌ Missing');
  console.log('Email User:', emailUser ? '✅ Found' : '❌ Missing');
  
  console.log('==========================\n');
  
  // Only return true if we have actual values (not placeholders)
  if (!airtableKey || airtableKey === 'test_api_key_placeholder' || airtableKey === 'your_api_key_here') {
    console.error('❌ Missing or invalid Airtable API key! Please update your .env file.');
    return false;
  }
  
  if (!airtableBase || airtableBase === 'test_base_id_placeholder' || airtableBase === 'your_base_id_here') {
    console.error('❌ Missing or invalid Airtable Base ID! Please update your .env file.');
    return false;
  }
  
  return true;
};

// Run environment check before starting tests
const envOk = checkEnvironment();
if (!envOk) {
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

/**
 * Creates test transaction data for different agent roles
 */
function createTestData(agentRole: AgentRole): TransactionFormData {
  // Create clients based on role
  const clients: Client[] = [
    {
      id: '1',
      name: 'Buyer TestClient',
      email: 'buyer@example.com',
      phone: '215-555-6789',
      address: '100 Buyer Ave, Philadelphia, PA 19123',
      maritalStatus: 'SINGLE',
      type: 'BUYER'
    }
  ];

  // Add additional client based on role
  if (agentRole === 'BUYERS AGENT') {
    clients.push({
      id: '2',
      name: 'Seller OtherParty',
      email: 'seller@example.com',
      phone: '215-555-4321',
      address: '200 Seller St, Philadelphia, PA 19123',
      maritalStatus: 'MARRIED',
      type: 'SELLER'
    });
  } else if (agentRole === 'LISTING AGENT') {
    clients.push({
      id: '2',
      name: 'Buyer OtherParty',
      email: 'otherbuyer@example.com',
      phone: '215-555-8765',
      address: '300 Other Buyer St, Philadelphia, PA 19123',
      maritalStatus: 'SINGLE',
      type: 'BUYER'
    });
  } else if (agentRole === 'DUAL AGENT') {
    clients.push({
      id: '2',
      name: 'Seller DualClient',
      email: 'dualseller@example.com',
      phone: '215-555-9999',
      address: '400 Dual Client St, Philadelphia, PA 19123',
      maritalStatus: 'MARRIED',
      type: 'SELLER'
    });
  }

  // Create the transaction data
  const data: TransactionFormData = {
    agentData: {
      role: agentRole,
      name: 'John Test Smith',
      email: 'test@example.com',
      phone: '215-555-1234',
    },
    propertyData: {
      address: '123 Test Street, Philadelphia, PA 19123',
      mlsNumber: agentRole === 'LISTING AGENT' ? 'MLS12345' : '',
      salePrice: '350000',
      status: 'OCCUPIED',
      isWinterized: 'NO',
      updateMls: 'YES',
      propertyAccessType: 'ELECTRONIC LOCKBOX',
      lockboxAccessCode: '1234',
      county: 'Philadelphia',
      propertyType: 'RESIDENTIAL',
      isBuiltBefore1978: 'NO',
      closingDate: '2023-12-31'
    },
    propertyDetailsData: {
      resaleCertRequired: false,
      hoaName: 'Test HOA',
      coRequired: false,
      municipality: 'Philadelphia',
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
      titleCompany: 'Test Title Co.'
    },
    clients: clients,
    commissionData: {
      totalCommissionPercentage: '6',
      listingAgentPercentage: '3',
      buyersAgentPercentage: '3',
      hasBrokerFee: false,
      brokerFeeAmount: '',
      hasSellersAssist: true,
      sellersAssist: '4000',
      isReferral: agentRole === 'DUAL AGENT',
      referralParty: agentRole === 'DUAL AGENT' ? 'Jane Referral' : '',
      brokerEin: '',
      referralFee: agentRole === 'DUAL AGENT' ? '500' : '',
      coordinatorFeePaidBy: 'agent'
    },
    additionalInfo: {
      specialInstructions: 'Test special instructions',
      urgentIssues: '',
      notes: 'This is a test transaction for PDF generation'
    },
    signatureData: {
      signature: 'Test Agent',
      confirmAccuracy: true
    },
    documentsData: {
      documents: [
        { name: 'Agreement of Sale', required: true, selected: true },
        { name: 'Seller Disclosure', required: true, selected: true }
      ],
      confirmDocuments: true
    }
  };

  return data;
}

/**
 * Runs a test submission with the specified agent role
 */
async function runTest(role: AgentRole): Promise<void> {
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
      console.error(`❌ Test failed for ${role} with unknown error`);
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