#!/usr/bin/env node

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import chalk from 'chalk';
import readline from 'readline';

// Load environment variables
dotenv.config();

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// The main function to generate a cover sheet for an existing transaction
async function generateCoverSheet(transactionId, agentRole = 'DUAL AGENT') {
    console.log(chalk.blue('\n=== GENERATING COVER SHEET ==='));
    console.log(`Transaction ID: ${transactionId}`);
    console.log(`Agent Role: ${agentRole}`);

    try {
        // Directly use the server endpoint for generating cover sheets
        const coverSheetResponse = await fetch('http://localhost:3001/api/generateCoverSheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tableId: 'Transactions', // Table name instead of ID
                recordId: transactionId,
                agentRole: agentRole,
                sendEmail: true,
            }),
        });

        if (!coverSheetResponse.ok) {
            const coverSheetResult = await coverSheetResponse.json();
            throw new Error(coverSheetResult.message || `Failed to generate cover sheet: ${coverSheetResponse.status}`);
        }

        const data = await coverSheetResponse.json();

        console.log(chalk.green('✅ Cover sheet generated successfully!'));
        console.log(`PDF Path: ${data.path || 'Not provided'}`);
        console.log(`Email Sent: ${data.emailSent ? 'Yes' : 'No'}`);
        console.log('Email should be sent to:', process.env.EMAIL_RECIPIENT || 'debbie@parealestatesupport.com');

        return true;
    } catch (error) {
        console.error(chalk.red(`❌ ERROR: ${error.message}`));
        return false;
    }
}

// Function to prompt for transaction ID
function askForTransactionId() {
    return new Promise((resolve) => {
        rl.question('Enter transaction ID (e.g., recXXXXXXXXXXXXXX): ', (answer) => {
            resolve(answer.trim());
        });
    });
}

// Function to prompt for agent role
function askForAgentRole() {
    return new Promise((resolve) => {
        rl.question('Enter agent role (DUAL AGENT, BUYERS AGENT, LISTING AGENT) [DUAL AGENT]: ', (answer) => {
            const role = answer.trim() || 'DUAL AGENT';
            resolve(role);
        });
    });
}

// Main execution
async function main() {
    try {
        // If no transaction ID is provided via command line, ask for it
        const args = process.argv.slice(2);
        let transactionId = args[0];
        let agentRole = args[1];

        if (!transactionId) {
            transactionId = await askForTransactionId();

            if (!transactionId) {
                console.error(chalk.red('No transaction ID provided. Exiting.'));
                process.exit(1);
            }
        }

        if (!agentRole) {
            agentRole = await askForAgentRole();
        }

        const success = await generateCoverSheet(transactionId, agentRole);

        if (success) {
            console.log(chalk.green('\nCover sheet generation completed successfully!'));
        } else {
            console.log(chalk.red('\nCover sheet generation failed.'));
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    } finally {
        rl.close();
    }
}

// Run the main function
main();