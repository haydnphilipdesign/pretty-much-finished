/**
 * Test script to generate a PDF with the final position mapping
 * This script tests only the PDF generation without sending an email
 */

import 'dotenv/config';
import { fillPdfForm } from '../utils/pdfUtils.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive mock data for testing
const mockFormData = {
  agentData: {
    role: 'listingAgent',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@realestate.com',
    phone: '(215) 555-7890'
  },
  propertyData: {
    mlsNumber: 'MLS-87654321',
    address: '1234 Maple Avenue, Philadelphia, PA 19128',
    salePrice: '575000',
    status: 'Occupied',
    isWinterized: 'NO',
    updateMls: 'YES',
    closingDate: '2023-08-15',
    propertyType: 'Single Family',
    propertyAccessType: 'Lockbox'
  },
  clients: [
    {
      id: '1',
      name: 'Robert & Maria Thompson',
      email: 'thompson.family@example.com',
      phone: '(215) 555-1234',
      address: '1234 Maple Avenue, Philadelphia, PA 19128',
      maritalStatus: 'MARRIED',
      type: 'SELLER'
    },
    {
      id: '2',
      name: 'David & Emily Wilson',
      email: 'wilsons@example.com',
      phone: '(215) 555-5678',
      address: '987 Oak Street, Philadelphia, PA 19106',
      maritalStatus: 'MARRIED',
      type: 'BUYER'
    }
  ],
  commissionData: {
    totalCommissionPercentage: '6',
    listingAgentPercentage: '3',
    buyersAgentPercentage: '3',
    hasBrokerFee: true,
    brokerFeeAmount: '2500',
    buyerPaidAmount: '1500',
    hasSellersAssist: true,
    sellersAssist: '5000',
    isReferral: false,
    referralParty: '',
    brokerEin: '',
    referralFee: '',
    coordinatorFeePaidBy: 'agent'
  },
  propertyDetails: {
    resaleCertRequired: true,
    hoaName: 'Maple Avenue Community Association',
    coRequired: true,
    municipality: 'Philadelphia County',
    firstRightOfRefusal: false,
    attorneyRepresentation: true,
    attorneyName: 'James Smith, Esq.',
    homeWarranty: true,
    warrantyCompany: 'American Home Shield',
    warrantyCost: '550',
    warrantyPaidBy: 'SELLER'
  },
  titleData: {
    titleCompany: 'First American Title Insurance Company'
  },
  additionalInfo: {
    specialInstructions: 'Sellers are requesting a 45-day close with a 2-week post-settlement occupancy agreement. Please ensure this is clearly documented in all agreements.',
    urgentIssues: 'Repair credit of $2,500 for roof repairs needed to be included in agreement.',
    notes: 'Buyers are first-time homebuyers and will need extra guidance throughout the process. They have been pre-approved with ABC Mortgage with John Doe as their loan officer.'
  },
  signatureData: {
    dateSubmitted: new Date().toISOString().split('T')[0],
    signature: 'Sarah Johnson',
    termsAccepted: true,
    infoConfirmed: true
  }
};

async function runTest() {
  try {
    console.log('Starting PDF generation test (no email)...');
    
    // Generate filled PDF
    const pdfBuffer = await fillPdfForm(mockFormData);
    
    // Save the PDF to disk for inspection
    const outputPath = path.resolve(__dirname, '..', 'final-test-output-no-email.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`PDF generated and saved to: ${outputPath}`);
    
    // Try to open the PDF for viewing
    try {
      if (process.platform === 'win32') {
        // Windows
        exec(`start ${outputPath}`);
      } else if (process.platform === 'darwin') {
        // macOS
        exec(`open ${outputPath}`);
      } else {
        // Linux and others
        exec(`xdg-open ${outputPath}`);
      }
      console.log('Attempting to open the PDF file...');
    } catch (openError) {
      console.log('Could not automatically open the PDF. Please open it manually to inspect.');
    }
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest().catch(console.error);