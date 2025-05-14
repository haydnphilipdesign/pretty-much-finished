#!/usr/bin/env node

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

console.log('Checking environment variables...');

// Load environment variables
console.log('Loading .env file...');
const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('.env file loaded successfully');
}

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('.env file exists at:', envPath);
  
  // Read and display the .env file content (excluding sensitive values)
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('\n.env file structure:');
  const lines = envContent.split('\n').map(line => {
    // Hide actual values for security
    if (line.trim() && !line.startsWith('#')) {
      const parts = line.split('=');
      if (parts.length > 1) {
        return `${parts[0]}=<value set>`;
      }
    }
    return line;
  });
  console.log(lines.join('\n'));
} else {
  console.log('.env file does not exist at:', envPath);
}

// Display relevant environment variables
console.log('\nEnvironment variables:');
const relevantVars = [
  'AIRTABLE_API_KEY',
  'AIRTABLE_BASE_ID',
  'VITE_AIRTABLE_API_KEY',
  'VITE_AIRTABLE_BASE_ID',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER'
];

relevantVars.forEach(varName => {
  console.log(`${varName}: ${process.env[varName] ? '<value set>' : 'undefined'}`);
});

// List all environment variables that include certain keywords
console.log('\nAll environment variables containing "AIRTABLE" or "VITE":');
Object.keys(process.env)
  .filter(key => key.includes('AIRTABLE') || key.includes('VITE'))
  .forEach(key => {
    console.log(`${key}: ${process.env[key] ? '<value set>' : 'undefined'}`);
  });

console.log('\nEnvironment check complete.'); 