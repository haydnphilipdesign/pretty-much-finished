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
const TRANSACTIONS_TABLE_ID = 'tblHyCJCpQSgjn0md'; // Transactions table ID

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

    // Mock transaction data
    const mockData = {
        fields: {
            // Property details
            'PROPERTY STREET ADDRESS': `123 Test Street #${uniqueId}`,
            'PROPERTY CITY': 'Philadelphia',
            'PROPERTY STATE': 'PA',
            'PROPERTY ZIP': '19103',
            'MLS#': `TEST-${uniqueId}`,
            'SALE PRICE': 450000,
            'SALE STATUS': 'Pending',

            // Client details
            'CLIENT TYPE': 'Buyer',
            'CLIENT FIRST NAME': 'Test',
            'CLIENT LAST NAME': `Client ${uniqueId}`,
            'CLIENT EMAIL': process.env.EMAIL_USER || 'test@example.com', // Send email to self
            'CLIENT PHONE': '215-555-1234',

            // Agent details
            'AGENT NAME': 'Test Agent',
            'AGENT EMAIL': process.env.EMAIL_USER || 'agent@example.com',
            'AGENT PHONE': '215-555-5678',
            'AGENT ROLE': 'DUAL AGENT',

            // Commission details
            'COMMISSION %': 3,
            'BROKER COMMISSION': 1500,

            // Additional fields
            'SPECIAL INSTRUCTIONS': `This is a test submission from automated script at ${timestamp}`,
            'URGENT': false,
            'NOTES': 'Automated test submission - please disregard',
        },
    };

    try {
        console.log(chalk.yellow('Submitting transaction to Airtable...'));
        console.log(`Property Address: ${mockData.fields['PROPERTY STREET ADDRESS']}`);
        console.log(`MLS#: ${mockData.fields['MLS#']}`);
        console.log(`Agent Role: ${mockData.fields['AGENT ROLE']}`);

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
            throw new Error(result.error ? .message || 'Failed to submit to Airtable');
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
                agentRole: mockData.fields['AGENT ROLE'],
                sendEmail: true,
            }),
        });

        const coverSheetResult = await coverSheetResponse.json();

        if (!coverSheetResponse.ok) {
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