#!/usr/bin/env node

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

console.log('Fixing environment variables in .env file...');

// Load environment variables
dotenv.config();

// Get path to .env file
const envPath = path.join(process.cwd(), '.env');

// Check if file exists
if (!fs.existsSync(envPath)) {
  console.error('Error: .env file not found at', envPath);
  process.exit(1);
}

// Read the file
let envContent = fs.readFileSync(envPath, 'utf8');

// Add non-VITE versions of Airtable variables if they're missing
if (!envContent.includes('AIRTABLE_API_KEY=') && envContent.includes('VITE_AIRTABLE_API_KEY=')) {
  console.log('Adding AIRTABLE_API_KEY...');
  
  // Extract the VITE version value
  const viteApiKeyMatch = envContent.match(/VITE_AIRTABLE_API_KEY=(.+)(\r?\n|$)/);
  if (viteApiKeyMatch && viteApiKeyMatch[1]) {
    const apiKeyValue = viteApiKeyMatch[1];
    
    // Add the non-VITE version
    const newLine = `AIRTABLE_API_KEY=${apiKeyValue}`;
    envContent = envContent.replace('# VITE_AIRTABLE Configuration', '# Airtable Configuration\n' + newLine + '\n\n# VITE_AIRTABLE Configuration');
  }
}

if (!envContent.includes('AIRTABLE_BASE_ID=') && envContent.includes('VITE_AIRTABLE_BASE_ID=')) {
  console.log('Adding AIRTABLE_BASE_ID...');
  
  // Extract the VITE version value
  const viteBaseIdMatch = envContent.match(/VITE_AIRTABLE_BASE_ID=(.+)(\r?\n|$)/);
  if (viteBaseIdMatch && viteBaseIdMatch[1]) {
    const baseIdValue = viteBaseIdMatch[1];
    
    // Add the non-VITE version
    // Find where to insert the line
    if (envContent.includes('AIRTABLE_API_KEY=')) {
      // Add after AIRTABLE_API_KEY
      envContent = envContent.replace(/AIRTABLE_API_KEY=(.+)(\r?\n|$)/, `AIRTABLE_API_KEY=$1$2AIRTABLE_BASE_ID=${baseIdValue}$2`);
    } else {
      // Add at the top of the file if AIRTABLE_API_KEY doesn't exist
      envContent = `AIRTABLE_BASE_ID=${baseIdValue}\n\n` + envContent;
    }
  }
}

// Write the updated content back to the file
fs.writeFileSync(envPath, envContent);
console.log('Successfully updated .env file!');
console.log('You can now run the test with: npm run test:pdf'); 