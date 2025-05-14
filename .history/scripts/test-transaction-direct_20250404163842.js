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

// Template field mappings - what the cover sheet expects vs what we have
const templateMap = {
    // Map our fields to the template fields
    propertyAddress: "address",
    mlsNumber: "mlsNumber",
    salePrice: "salePrice",
    agentName: "agentName",
    agentRole: "agentRole",
    totalCommission: "totalCommission",
    listingAgentPercentage: "listingAgentPercentage",
    buyersAgentPercentage: "buyersAgentPercentage",
    brokerFee: "brokerFee",
    sellersAssist: "sellersAssist",
    isWinterized: "winterized",
    propertyStatus: "propertyStatus",
    specialInstructions: "specialInstructions",
    urgentIssues: "urgentIssues",
    additionalNotes: "additionalInfo"
};

// Convert data to template format
function formatDataForTemplate(data) {
    const templateData = {};

    // Add directly mapped fields
    for (const [templateField, dataField] of Object.entries(templateMap)) {
        if (data[dataField]) {
            let value = data[dataField];

            // Format currency values
            if (dataField === 'salePrice' || dataField === 'brokerFee' || dataField === 'sellersAssist') {
                if (typeof value === 'number') {
                    value = value.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2
                    });
                }
            }

            // Format percentages
            if (dataField === 'totalCommission' || dataField === 'listingAgentPercentage' || dataField === 'buyersAgentPercentage') {
                if (typeof value === 'number') {
                    value = `${value}%`;
                }
            }

            templateData[templateField] = value;
        }
    }

    // Add date
    templateData.currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return templateData;
}

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

    // Transaction data - using direct field names not IDs
    const transactionData = {
        address: `123 Test Street #${uniqueId}, Philadelphia, PA 19103`,
        mlsNumber: `TEST-${uniqueId}`,
        salePrice: 450000,
        propertyStatus: 'VACANT',
        winterized: 'NO',
        updateMls: 'YES',

        // Agent details
        agentName: 'Test Agent',
        agentRole: 'DUAL AGENT',

        // Commission details
        totalCommission: 3,
        listingAgentPercentage: 1.5,
        buyersAgentPercentage: 1.5,
        brokerFee: 1500,
        sellersAssist: 5000,

        // Additional fields
        specialInstructions: `This is a test submission from automated script at ${timestamp}`,
        urgentIssues: 'No urgent issues - this is a test',
        additionalInfo: 'Automated test submission - please disregard',
    };

    // Convert to Airtable format for submission
    const mockData = {
        fields: {}
    };

    // Map our data to Airtable field IDs
    for (const [key, value] of Object.entries(transactionData)) {
        if (fieldMap[key]) {
            mockData.fields[fieldMap[key]] = value;
        }
    }

    try {
        console.log(chalk.yellow('Submitting transaction to Airtable...'));
        console.log(`Property Address: ${transactionData.address}`);
        console.log(`MLS#: ${transactionData.mlsNumber}`);
        console.log(`Agent Role: ${transactionData.agentRole}`);

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

        // Format data for the template
        const templateData = formatDataForTemplate(transactionData);

        // Now trigger the cover sheet generation
        console.log(chalk.yellow('\nGenerating cover sheet...'));
        console.log('Using direct data instead of fetching from Airtable');

        // Use the Express server's API endpoint to generate the cover sheet
        const coverSheetResponse = await fetch('http://localhost:3001/api/generateCoverSheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tableId: TRANSACTIONS_TABLE_ID,
                recordId: recordId,
                agentRole: transactionData.agentRole,
                sendEmail: true,
                data: templateData // Pass the formatted data directly
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