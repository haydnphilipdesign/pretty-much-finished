#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('Fixing environment variables in .env file...');

// Get path to .env file
const envPath = path.join(process.cwd(), '.env');

// Check if file exists
if (!fs.existsSync(envPath)) {
  console.error('Error: .env file not found at', envPath);
  process.exit(1);
}

// Read the file
let envContent = fs.readFileSync(envPath, 'utf8');

// Add our manual entries at the top of the file
const additionalEnvVars = `# Added by fix-env script for Node.js compatibility
AIRTABLE_API_KEY=${process.env.VITE_AIRTABLE_API_KEY || ''}
AIRTABLE_BASE_ID=${process.env.VITE_AIRTABLE_BASE_ID || ''}

`;

// Check if we've already added these lines
if (!envContent.includes('AIRTABLE_API_KEY=')) {
  // Add at the beginning of the file
  envContent = additionalEnvVars + envContent;
  
  // Write the updated content back to the file
  fs.writeFileSync(envPath, envContent);
  console.log('Successfully updated .env file!');
} else {
  console.log('.env file already contains the necessary variables.');
}

console.log('You can now run the test with: npm run test:pdf'); 