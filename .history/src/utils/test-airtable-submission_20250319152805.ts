import { submitToAirtable } from './airtable.final';
import { TransactionFormState } from '../types/transactionFormState';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = Object.fromEntries(
  envContent
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('='))
    .map(([key, value]) => [key, value?.trim()])
);

// Set environment variables
Object.entries(envVars).forEach(([key, value]) => {
  if (value) process.env[key] = value;
});

const testData: TransactionFormState = {
  agentData: {
    role: "LISTING AGENT",
    name: "Test Agent",
    email: "test@example.com",
    phone: "123-456-7890"
  },
  propertyData: {
    mlsNumber: "123456",
    address: "123 Test Street, Test City, PA 12345",
    salePrice: "350000",
    status: "OCCUPIED",
    isWinterized: false,
    updateMls: true,
    propertyAccessType: "ELECTRONIC LOCKBOX",
    lockboxAccessCode: "1234",
    county: "Test County",
    isBuiltBefore1978: true,
    propertyType: "Single Family",
    closingDate: "2024-04-30"
  },
  clients: [
    {
      id: "1",
      name: "Test Client",
      email: "client@example.com",
      phone: "987-654-3210",
      address: "456 Client Street, Client City, PA 12345",
      maritalStatus: "SINGLE",
      type: "SELLER"
    }
  ],
  commissionData: {
    totalCommissionPercentage: "6",
    listingAgentPercentage: "3",
    buyersAgentPercentage: "3",
    hasBrokerFee: true,
    brokerFeeAmount: "500",
    hasSellersAssist: true,
    sellersAssist: "5000",
    brokerSplit: "70",
    isReferral: true,
    referralParty: "Test Referral",
    brokerEin: "12-3456789",
    referralFee: "25",
    coordinatorFeePaidBy: "client"
  },
  propertyDetailsData: {
    resaleCertRequired: true,
    hoaName: "Test HOA",
    coRequired: true,
    municipality: "Test Municipality",
    firstRightOfRefusal: true,
    firstRightName: "Test First Right",
    attorneyRepresentation: true,
    attorneyName: "Test Attorney",
    homeWarranty: true,
    warrantyCompany: "Test Warranty Co",
    warrantyCost: "500",
    warrantyPaidBy: "SELLER"
  },
  titleData: {
    titleCompany: "Test Title Company"
  },
  additionalInfo: {
    specialInstructions: "Test special instructions",
    urgentIssues: "Test urgent issues",
    notes: "Test additional notes"
  },
  signatureData: {
    signature: "Test Agent Signature",
    confirmAccuracy: true
  }
};

// Function to run the test
async function runTest() {
  try {
    console.log('Starting test submission...');
    console.log('Environment variables loaded:', {
      apiKey: process.env.VITE_AIRTABLE_API_KEY ? 'Found' : 'Missing',
      baseId: process.env.VITE_AIRTABLE_BASE_ID ? 'Found' : 'Missing',
      clientsTableId: process.env.VITE_AIRTABLE_CLIENTS_TABLE_ID ? 'Found' : 'Missing'
    });
    const result = await submitToAirtable(testData);
    console.log('Submission result:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
runTest(); 