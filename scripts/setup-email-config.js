#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Get current directory equivalent to __dirname in CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

// Start with a welcome message
console.log(`
${colors.bright}${colors.blue}===== PA Real Estate Support Services =====
${colors.green}Email Configuration Setup${colors.reset}

This script will help you set up your email configuration for testing the PDF generation functionality.
It will create or update your .env file with the email settings needed to send PDFs via email.

You can use services like:
- Gmail SMTP (requires app password for 2FA accounts)
- Mailtrap.io (for testing without sending real emails)
- Your own SMTP server
`);

// Function to prompt for input
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${question}${colors.reset}`, (answer) => {
      resolve(answer);
    });
  });
};

// Function to read existing .env file
const readEnvFile = () => {
  const envPath = path.join(process.cwd(), '.env');
  try {
    if (fs.existsSync(envPath)) {
      return fs.readFileSync(envPath, 'utf8');
    }
    return '';
  } catch (error) {
    console.error(`${colors.red}Error reading .env file:${colors.reset}`, error);
    return '';
  }
};

// Function to update or create .env file
const updateEnvFile = (content) => {
  const envPath = path.join(process.cwd(), '.env');
  try {
    fs.writeFileSync(envPath, content);
    console.log(`${colors.green}Successfully updated .env file at:${colors.reset} ${envPath}`);
  } catch (error) {
    console.error(`${colors.red}Error writing .env file:${colors.reset}`, error);
  }
};

// Main function
const main = async () => {
  // Email configuration template
  const emailConfig = {
    EMAIL_HOST: '',
    EMAIL_PORT: '',
    EMAIL_SECURE: '',
    EMAIL_USER: '',
    EMAIL_PASSWORD: '',
    EMAIL_FROM: '',
    EMAIL_RECIPIENT: 'debbie@parealestatesupport.com'
  };
  
  // Read existing .env file
  let envContent = readEnvFile();
  
  // Service selection
  console.log(`${colors.bright}Select an email service:${colors.reset}`);
  console.log('1. Gmail');
  console.log('2. Mailtrap');
  console.log('3. Custom SMTP');
  
  const serviceChoice = await prompt('Enter your choice (1-3): ');
  
  // Set defaults based on service
  switch (serviceChoice) {
    case '1': // Gmail
      emailConfig.EMAIL_HOST = 'smtp.gmail.com';
      emailConfig.EMAIL_PORT = '587';
      emailConfig.EMAIL_SECURE = 'false';
      console.log(`\n${colors.yellow}Note for Gmail:${colors.reset} You'll need to use an App Password if you have 2FA enabled.`);
      console.log('Create one at: https://myaccount.google.com/apppasswords\n');
      break;
    case '2': // Mailtrap
      emailConfig.EMAIL_HOST = 'sandbox.smtp.mailtrap.io';
      emailConfig.EMAIL_PORT = '2525';
      emailConfig.EMAIL_SECURE = 'false';
      console.log(`\n${colors.yellow}Note for Mailtrap:${colors.reset} You'll need to sign up at https://mailtrap.io/ and get your credentials.\n`);
      break;
    case '3': // Custom
      emailConfig.EMAIL_HOST = await prompt('Enter SMTP host (e.g., smtp.example.com): ');
      emailConfig.EMAIL_PORT = await prompt('Enter SMTP port (e.g., 587): ');
      emailConfig.EMAIL_SECURE = (await prompt('Use secure connection? (yes/no): ')).toLowerCase() === 'yes' ? 'true' : 'false';
      break;
    default:
      console.log(`${colors.red}Invalid choice. Using custom configuration.${colors.reset}`);
      emailConfig.EMAIL_HOST = await prompt('Enter SMTP host (e.g., smtp.example.com): ');
      emailConfig.EMAIL_PORT = await prompt('Enter SMTP port (e.g., 587): ');
      emailConfig.EMAIL_SECURE = (await prompt('Use secure connection? (yes/no): ')).toLowerCase() === 'yes' ? 'true' : 'false';
  }
  
  // Get credentials
  emailConfig.EMAIL_USER = await prompt('Enter email username/address: ');
  emailConfig.EMAIL_PASSWORD = await prompt('Enter email password/API key: ');
  emailConfig.EMAIL_FROM = await prompt(`Enter sender email address (default: ${emailConfig.EMAIL_USER}): `) || emailConfig.EMAIL_USER;
  
  // Check if existing email config exists
  const emailConfigExists = envContent.includes('EMAIL_HOST') || 
                            envContent.includes('EMAIL_PORT') || 
                            envContent.includes('EMAIL_USER');
  
  // Update .env content
  if (emailConfigExists) {
    // Replace existing email configuration
    Object.entries(emailConfig).forEach(([key, value]) => {
      const regex = new RegExp(`${key}=.*`, 'g');
      if (envContent.match(regex)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    });
  } else {
    // Add email configuration
    envContent += '\n\n# Email Configuration';
    Object.entries(emailConfig).forEach(([key, value]) => {
      envContent += `\n${key}=${value}`;
    });
  }
  
  // Update or create .env file
  updateEnvFile(envContent);
  
  console.log(`\n${colors.green}${colors.bright}Email configuration complete!${colors.reset}`);
  console.log(`\nYou can now run the PDF generation test with: ${colors.yellow}npm run test:pdf${colors.reset}`);
  console.log(`\nThe test will generate PDFs and send them to: ${colors.yellow}${emailConfig.EMAIL_RECIPIENT}${colors.reset}`);
  
  rl.close();
};

// Run the main function
main(); 