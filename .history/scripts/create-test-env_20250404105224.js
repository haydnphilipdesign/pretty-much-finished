#!/usr/bin/env node

/**
 * This script creates a test .env file with placeholder values
 * for testing the PDF generation functionality.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get path to .env file
const envPath = path.join(process.cwd(), '.env');

// Check if file already exists
if (fs.existsSync(envPath)) {
  console.log(`⚠️ Warning: .env file already exists at ${envPath}`);
  console.log('To overwrite it, delete the file first and then run this script again.');
  process.exit(0);
}

// Create a test .env file
const testEnv = `# Test environment configuration
# This file was generated automatically by create-test-env.js
# Replace these placeholder values with your actual values

# Airtable Configuration
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=your_base_id_here

# Vite compatible environment variables (will be used in the app)
VITE_AIRTABLE_API_KEY=\${AIRTABLE_API_KEY}
VITE_AIRTABLE_BASE_ID=\${AIRTABLE_BASE_ID}

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email_user@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@parealestatesupport.com
EMAIL_RECIPIENT=debbie@parealestatesupport.com

# For test purposes, you can use mailtrap.io (a testing email service)
# EMAIL_HOST=sandbox.smtp.mailtrap.io
# EMAIL_PORT=2525
# EMAIL_SECURE=false
# EMAIL_USER=your_mailtrap_username
# EMAIL_PASSWORD=your_mailtrap_password
`;

try {
  // Write the .env file
  fs.writeFileSync(envPath, testEnv);
  console.log(`✅ Created test .env file at ${envPath}`);
  console.log('Please update the file with your actual API keys and configuration.');
} catch (error) {
  console.error('❌ Error creating .env file:', error);
  process.exit(1);
} 