#!/usr/bin/env node

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

// Airtable API key and base ID from environment
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';
const TRANSACTIONS_TABLE_ID = 'Transactions'; // Table name instead of ID

// Airtable field mappings from AIRTABLE_FORM_FIELDS.csv
const fieldMap = {
    // Role Section
    agentRole: 'fldOVyoxz38rWwAFy', // Agent Role

    // Property Section
    mlsNumber: 'fld6O2FgIXQU5G27o', // MLS Number
    address: 'fldypnfnHhplWYcCW', // Address
    propertyStatus: 'fldV2eLxz6w0TpLFU', // Property Status
    salePrice: 'fldhHjBZJISmnP8SK', // Sale Price
    winterized: 'fldExdgBDgdB1i9jy', // Winterized
    updateMls: 'fldw3GlfvKtyNfIAW', // Update MLS

    // Commission Section
    totalCommission: 'fldE8INzEorBtx2uN', // Total Commission %
    listingAgentPercentage: 'flduuQQT7o6XAGlRe', // Listing Agent %
    buyersAgentPercentage: 'fld5KRrToAAt5kOLd', // Buyers Agent %
    brokerFee: 'flddRltdGj05Clzpa', // Broker Fee
    sellersAssist: 'fldTvXx96Na0zRh6W', // Sellers Assist
    referralParty: 'fldzVtmn8uylVxuTF', // Referral Party
    brokerEin: 'fld20VbKbWzdR4Sp7', // Broker EIN
    referralFee: 'fldewmjoaJVwiMF46', // Referral Fee

    // Additional Info Section
    specialInstructions: 'fldDWN8jU4kdCffzu', // Special Instructions
    urgentIssues: 'fldgW16aPdFMdspO6', // Urgent Issues
    additionalInfo: 'fld30htJ7euVerCLW', // Additional Information

    // Signature Section
    agentName: 'fldFD4xHD0vxnSOHJ', // Agent Name
};

async function submitTestTransaction() {
    console.log(chalk.blue('\n=== SUBMITTING TEST TRANSACTION ==='));

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        console.error(chalk.red('❌ ERROR: Missing Airtable credentials'));
        console.error('Please ensure AIRTABLE_API_KEY and AIRTABLE_BASE_ID are set in your .env file');
        return false;
    }

    // Generate unique identifiers for test data
    const uniqueId = uuidv4().substring(0, 8);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Mock transaction data using field IDs
    const mockData = {
        fields: {
            // Property details
            [fieldMap.address]: `123 Test Street #${uniqueId}, Philadelphia, PA 19103`,
            [fieldMap.mlsNumber]: `TEST-${uniqueId}`,
            [fieldMap.salePrice]: 450000,
            [fieldMap.propertyStatus]: 'VACANT',
            [fieldMap.winterized]: 'NO',
            [fieldMap.updateMls]: 'YES',

            // Agent details
            [fieldMap.agentName]: 'Test Agent',
            [fieldMap.agentRole]: 'DUAL AGENT',

            // Commission details
            [fieldMap.totalCommission]: 3,
            [fieldMap.listingAgentPercentage]: 1.5,
            [fieldMap.buyersAgentPercentage]: 1.5,
            [fieldMap.brokerFee]: 1500,
            [fieldMap.sellersAssist]: 5000,

            // Additional fields
            [fieldMap.specialInstructions]: `This is a test submission from automated script at ${timestamp}`,
            [fieldMap.urgentIssues]: 'No urgent issues - this is a test',
            [fieldMap.additionalInfo]: 'Automated test submission - please disregard',
        },
    };

    try {
        console.log(chalk.yellow('Submitting transaction to Airtable...'));
        console.log(`Property Address: ${mockData.fields[fieldMap.address]}`);
        console.log(`MLS#: ${mockData.fields[fieldMap.mlsNumber]}`);
        console.log(`Agent Role: ${mockData.fields[fieldMap.agentRole]}`);

        // Submit to Airtable
        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TRANSACTIONS_TABLE_ID}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error((result.error && result.error.message) || 'Failed to submit to Airtable');
        }

        // Get the created record ID
        const recordId = result.id;
        console.log(chalk.green('✅ Successfully submitted to Airtable!'));
        console.log(`Record ID: ${recordId}`);

        // Now trigger the cover sheet generation
        console.log(chalk.yellow('\nGenerating cover sheet...'));

        // Use the Express server's API endpoint to generate the cover sheet
        const coverSheetResponse = await fetch('http://localhost:3001/api/generateCoverSheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tableId: TRANSACTIONS_TABLE_ID,
                recordId: recordId,
                agentRole: mockData.fields[fieldMap.agentRole],
                sendEmail: true,
            }),
        });

        if (!coverSheetResponse.ok) {
            const coverSheetResult = await coverSheetResponse.json();
            throw new Error(coverSheetResult.message || 'Failed to generate cover sheet');
        }

        console.log(chalk.green('✅ Cover sheet generated successfully!'));
        console.log('Email should be sent to:', process.env.EMAIL_RECIPIENT || 'debbie@parealestatesupport.com');

        return true;
    } catch (error) {
        console.error(chalk.red(`❌ ERROR: ${error.message}`));
        return false;
    }
}

// Run the test
submitTestTransaction()
    .then(success => {
        if (success) {
            console.log(chalk.green('\nTest transaction submitted successfully!'));
            console.log('Please check your email for the cover sheet.');
        } else {
            console.log(chalk.red('\nTest transaction submission failed.'));
        }
    })
    .catch(err => {
        console.error('Unexpected error:', err);
        process.exit(1);
    });