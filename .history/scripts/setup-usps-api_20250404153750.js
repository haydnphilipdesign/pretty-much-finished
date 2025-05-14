#!/usr/bin/env node

/**
 * This script helps users set up and configure the USPS Address Verification API
 * It guides them through the registration process and updates the .env file
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get the directory name using ES modules compatible approach
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt function
const prompt = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

// Check if .env file exists
const envPath = path.join(rootDir, '.env');
if (!fs.existsSync(envPath)) {
    console.error('\n❌ .env file not found. Please create a .env file in the project root first.\n');
    process.exit(1);
}

// Load current .env file
dotenv.config({ path: envPath });

// Update the .env file with new values
const updateEnvFile = (userId, useManual = false) => {
    const envContent = fs.readFileSync(envPath, 'utf8');

    // Check if USPS API keys already exist
    let newContent = envContent;

    if (envContent.includes('VITE_USPS_USER_ID=')) {
        // Replace existing values
        newContent = newContent.replace(
            /VITE_USPS_USER_ID=.*/,
            `VITE_USPS_USER_ID=${userId}`
        );
    } else {
        // Add new values
        newContent += `\n# USPS Address Verification API\nVITE_USPS_USER_ID=${userId}\nVITE_USPS_API_URL=https://secure.shippingapis.com/ShippingAPI.dll\n`;
    }

    // Update manual validation flag
    if (envContent.includes('VITE_USE_MANUAL_ADDRESS_VALIDATION=')) {
        newContent = newContent.replace(
            /VITE_USE_MANUAL_ADDRESS_VALIDATION=.*/,
            `VITE_USE_MANUAL_ADDRESS_VALIDATION=${useManual ? 'true' : 'false'}`
        );
    } else {
        newContent += `\n# Enable manual address validation (skip API calls)\nVITE_USE_MANUAL_ADDRESS_VALIDATION=${useManual ? 'true' : 'false'}\n`;
    }

    fs.writeFileSync(envPath, newContent);
    return newContent;
};

// Test the configuration with a simple address verification
const testUspsApi = async(userId) => {
    try {
        const address = {
            street1: '1600 Pennsylvania Ave',
            city: 'Washington',
            state: 'DC',
            zip: '20500'
        };

        const xml = `
      <AddressValidateRequest USERID="${userId}">
        <Revision>1</Revision>
        <Address ID="0">
          <Address1></Address1>
          <Address2>${address.street1}</Address2>
          <City>${address.city}</City>
          <State>${address.state}</State>
          <Zip5>${address.zip}</Zip5>
          <Zip4></Zip4>
        </Address>
      </AddressValidateRequest>
    `;

        console.log('\n🔍 Testing USPS API with sample address...');

        const response = await fetch(`https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=${encodeURIComponent(xml)}`);
        const data = await response.text();

        if (data.includes('<Error>')) {
            const errorMatch = data.match(/<Description>(.*?)<\/Description>/);
            console.error(`\n❌ API Test Failed: ${errorMatch ? errorMatch[1] : 'Unknown error'}`);
            return false;
        }

        console.log('\n✅ API Test Successful! The White House address was verified.');
        return true;
    } catch (error) {
        console.error('\n❌ API Test Failed:', error.message);
        return false;
    }
};

// Main function
const main = async() => {
    console.log('\n=== USPS Address Verification API Setup ===\n');
    console.log('This script will help you configure the USPS Address Verification API.');
    console.log('To use USPS address verification, you need to register for a USPS Web Tools account.');

    console.log('\n📝 REGISTRATION STEPS:');
    console.log('1. Visit https://www.usps.com/business/web-tools-apis/');
    console.log('2. Click on "Get Access to USPS Web Tools API"');
    console.log('3. Complete the registration form and request access to "Address Information API"');
    console.log('4. USPS will email you with your User ID (typically within 2-5 business days)');

    const hasRegistered = await prompt('\nHave you already registered for a USPS Web Tools account? (y/n): ');

    if (hasRegistered.toLowerCase() === 'n') {
        console.log('\nPlease register for a USPS Web Tools account first.');
        console.log('Run this script again after receiving your USPS User ID.');

        const useManual = await prompt('\nWould you like to enable manual address validation for now (no API calls)? (y/n): ');

        if (useManual.toLowerCase() === 'y') {
            updateEnvFile('YOUR_USPS_USER_ID_HERE', true);
            console.log('\n✅ Manual address validation has been enabled.');
            console.log('The application will validate addresses locally without calling the USPS API.');
        }

        rl.close();
        return;
    }

    const hasUserId = await prompt('\nDo you have your USPS User ID? (y/n): ');

    if (hasUserId.toLowerCase() === 'n') {
        console.log('\nPlease wait for the USPS to email you your User ID.');
        const useManual = await prompt('\nWould you like to enable manual address validation for now (no API calls)? (y/n): ');

        if (useManual.toLowerCase() === 'y') {
            updateEnvFile('YOUR_USPS_USER_ID_HERE', true);
            console.log('\n✅ Manual address validation has been enabled.');
            console.log('The application will validate addresses locally without calling the USPS API.');
        }

        rl.close();
        return;
    }

    const userId = await prompt('\nPlease enter your USPS User ID: ');

    if (!userId.trim()) {
        console.error('\n❌ User ID cannot be empty.');
        rl.close();
        return;
    }

    // Test the API connection
    const testSuccessful = await testUspsApi(userId);

    // Update the .env file
    updateEnvFile(userId, !testSuccessful);

    if (testSuccessful) {
        console.log('\n✅ USPS API configuration has been successfully updated in your .env file.');
        console.log('The application will now use the USPS API for address verification.');
    } else {
        console.log('\n⚠️ Using manual address validation due to API test failure.');
        console.log('The application will validate addresses locally without calling the USPS API.');
        console.log('To troubleshoot, please check:');
        console.log('1. Your USPS User ID is correct');
        console.log('2. The API service is available');
        console.log('3. Your internet connection is working');
    }

    rl.close();
};

// Run the main function
main().catch(error => {
    console.error('\n❌ Error:', error);
    rl.close();
});