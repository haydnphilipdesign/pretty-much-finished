import dotenv from 'dotenv';
dotenv.config();

import { submitToAirtable } from './airtable';
import { TransactionFormData, AgentRole, Client } from '@/types/transaction';
import path from 'path';
import fs from 'fs';
import { promises as fs_promises } from 'fs';

// Function to create sample template files if they don't exist
async function createSampleTemplates() {
  const templatesDir = path.join(process.cwd(), 'public', 'templates');
  
  // Create templates directory if it doesn't exist
  try {
    await fs_promises.mkdir(templatesDir, { recursive: true });
  } catch (error) {
    console.error('Error creating templates directory:', error);
    return false;
  }
  
  const templates = {
    'Buyer.html': `
<!DOCTYPE html>
<html>
<head>
  <title>Buyer's Agent Cover Sheet</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #2c3e50; text-align: center; }
    .info { margin-bottom: 20px; }
    .field { margin-bottom: 10px; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Buyer's Agent Cover Sheet</h1>
  <div class="info">
    <div class="field"><span class="label">Agent:</span> \{\{agentName\}\}</div>
    <div class="field"><span class="label">Property:</span> \{\{propertyAddress\}\}</div>
    <div class="field"><span class="label">Clients:</span> \{\{clientNames\}\}</div>
    <div class="field"><span class="label">Commission:</span> $\{\{commissionAmount\}\}</div>
    <div class="field"><span class="label">Transaction Date:</span> \{\{transactionDate\}\}</div>
  </div>
  <div>This is a test template for Buyer's Agent</div>
</body>
</html>`,
    'Seller.html': `
<!DOCTYPE html>
<html>
<head>
  <title>Listing Agent Cover Sheet</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #2c3e50; text-align: center; }
    .info { margin-bottom: 20px; }
    .field { margin-bottom: 10px; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Listing Agent Cover Sheet</h1>
  <div class="info">
    <div class="field"><span class="label">Agent:</span> \{\{agentName\}\}</div>
    <div class="field"><span class="label">Property:</span> \{\{propertyAddress\}\}</div>
    <div class="field"><span class="label">Clients:</span> \{\{clientNames\}\}</div>
    <div class="field"><span class="label">Commission:</span> $\{\{commissionAmount\}\}</div>
    <div class="field"><span class="label">Transaction Date:</span> \{\{transactionDate\}\}</div>
  </div>
  <div>This is a test template for Listing Agent</div>
</body>
</html>`,
    'DualAgent.html': `
<!DOCTYPE html>
<html>
<head>
  <title>Dual Agent Cover Sheet</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #2c3e50; text-align: center; }
    .info { margin-bottom: 20px; }
    .field { margin-bottom: 10px; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Dual Agent Cover Sheet</h1>
  <div class="info">
    <div class="field"><span class="label">Agent:</span> \{\{agentName\}\}</div>
    <div class="field"><span class="label">Property:</span> \{\{propertyAddress\}\}</div>
    <div class="field"><span class="label">Clients:</span> \{\{clientNames\}\}</div>
    <div class="field"><span class="label">Commission:</span> $\{\{commissionAmount\}\}</div>
    <div class="field"><span class="label">Transaction Date:</span> \{\{transactionDate\}\}</div>
  </div>
  <div>This is a test template for Dual Agent</div>
</body>
</html>`
  };
  
  // Create each template file if it doesn't exist
  for (const [filename, content] of Object.entries(templates)) {
    const filePath = path.join(templatesDir, filename);
    if (!fs.existsSync(filePath)) {
      try {
        fs.writeFileSync(filePath, content);
        console.log(`Created sample template: ${filename}`);
      } catch (error) {
        console.error(`Error creating template ${filename}:`, error);
      }
    }
  }
  
  return true;
}

// Check environment and print debug info
const checkEnvironment = async () => {
  console.log('=== Environment Check ===');
  
  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found at:', envPath);
    console.log('Creating a basic .env file with placeholders for testing...');
    
    // Create a basic .env file
    try {
      // Content for a basic .env file
      const basicEnvContent = `# Basic environment configuration for testing
# Replace these placeholder values with your actual values

# Airtable Configuration
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=your_base_id_here

# Vite compatible variables
VITE_AIRTABLE_API_KEY=\${AIRTABLE_API_KEY}
VITE_AIRTABLE_BASE_ID=\${AIRTABLE_BASE_ID}

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@example.com
EMAIL_RECIPIENT=test@example.com
`;
      
      await fs_promises.writeFile(envPath, basicEnvContent);
      console.log('✅ Created .env file with placeholder values');
      console.log('⚠️ Please edit the .env file with your actual API keys and try again.');
      return false;
    } catch (error) {
      console.error('❌ Error creating .env file:', error);
      return false;
    }
  } else {
    console.log('✅ .env file found');
  }
  
  // Check for required environment variables
  // Airtable configuration
  const airtableApiKey = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
  
  // Display environment info
  console.log(`Airtable API Key: ${airtableApiKey ? '✅ Found' : '❌ Missing'}`);
  console.log(`Airtable Base ID: ${airtableBaseId ? '✅ Found' : '❌ Missing'}`);
  
  // Check email configuration
  const emailHost = process.env.EMAIL_HOST;
  const emailUser = process.env.EMAIL_USER;
  console.log(`Email Host: ${emailHost ? '✅ Found' : '⚠️ Missing (email will not be sent)'}`);
  console.log(`Email User: ${emailUser ? '✅ Found' : '⚠️ Missing (email will not be sent)'}`);
  
  // Check for placeholder values
  if (airtableApiKey === 'your_api_key_here' || airtableBaseId === 'your_base_id_here') {
    console.log('\n⚠️ You are using placeholder values for Airtable. Please update your .env file with real credentials.');
    
    console.error(`
❌ Test cannot proceed with placeholder values!

Please follow these steps to set up your environment:
1. Create a basic .env template: npm run setup:env
2. Edit the .env file with your ACTUAL API keys for Airtable
3. Optionally configure email settings: npm run setup:email
4. Run the test again: npm run test:pdf

For more information, see the PDF_TESTING_GUIDE.md
`);
    return false;
  }
  
  // Check if required environment variables are present
  if (!airtableApiKey || !airtableBaseId) {
    console.error(`
❌ Missing required environment variables!

Please follow these steps to set up your environment:
1. Create a basic .env template: npm run setup:env
2. Edit the .env file with your ACTUAL API keys for Airtable
3. Optionally configure email settings: npm run setup:email
4. Run the test again: npm run test:pdf

For more information, see the PDF_TESTING_GUIDE.md
`);
    return false;
  }
  
  // Create sample template files if needed
  await createSampleTemplates();
  
  return true;
};

// Run environment check before starting tests
const envOk = checkEnvironment();
if (!envOk) {
  console.error(`
❌ Missing or invalid required environment variables!

Quick setup instructions:
1. Create a basic .env template:
   npm run setup:env

2. Edit the .env file with your actual API keys:
   - AIRTABLE_API_KEY=your_actual_api_key
   - AIRTABLE_BASE_ID=your_actual_base_id

3. Configure email settings (optional):
   npm run setup:email

4. Run the test again:
   npm run test:pdf

For more information, see the PDF_TESTING_GUIDE.md file.
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

// Main function
async function main() {
  console.log('=== PA REAL ESTATE SUPPORT SERVICES PDF GENERATION TEST ===\n');
  
  // Check environment
  const isEnvironmentValid = await checkEnvironment();
  if (!isEnvironmentValid) {
    return;
  }
  
  // Create sample templates
  console.log('\n=== Creating Sample Templates ===');
  await createSampleTemplates();
  
  let allTestsSuccessful = true;
  
  // Test with Buyer's Agent
  console.log('\n=== Testing Buyer\'s Agent ===');
  try {
    await runTest('BUYERS AGENT');
  } catch (error) {
    console.error('❌ Buyer\'s Agent test failed:', error);
    allTestsSuccessful = false;
  }
  
  // Test with Listing Agent
  console.log('\n=== Testing Listing Agent ===');
  try {
    await runTest('LISTING AGENT');
  } catch (error) {
    console.error('❌ Listing Agent test failed:', error);
    allTestsSuccessful = false;
  }
  
  // Test with Dual Agent
  console.log('\n=== Testing Dual Agent ===');
  try {
    await runTest('DUAL AGENT');
  } catch (error) {
    console.error('❌ Dual Agent test failed:', error);
    allTestsSuccessful = false;
  }
  
  // Final status
  console.log('\n=== Test Summary ===');
  if (allTestsSuccessful) {
    console.log('✅ All tests completed successfully!');
    console.log('📧 Check your email for the generated PDFs.');
    console.log('💾 Generated PDFs are saved in the public/generated-pdfs directory.');
  } else {
    console.log('❌ Some tests failed. Please check the logs above for details.');
  }
}

// Execute the main function
main().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
}); 