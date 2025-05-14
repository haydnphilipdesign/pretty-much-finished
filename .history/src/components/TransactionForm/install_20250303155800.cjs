#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Configuration
const sourceDir = path.join(__dirname);
const targetDir = process.cwd();

console.log(`${colors.bright}${colors.cyan}PA Real Estate Transaction Form Installer${colors.reset}\n`);
console.log(`Installing from: ${sourceDir}`);
console.log(`Installing to: ${targetDir}\n`);

// Function to create directory if it doesn't exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`${colors.green}Created directory: ${dir}${colors.reset}`);
  }
}

// Function to copy a file
function copyFile(source, target) {
  try {
    const content = fs.readFileSync(source, 'utf-8');
    fs.writeFileSync(target, content, 'utf-8');
    console.log(`${colors.green}Copied: ${path.relative(targetDir, target)}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error copying ${source} to ${target}: ${error.message}${colors.reset}`);
  }
}

// Function to copy a directory recursively
function copyDirectory(source, target, depth = 0) {
  // Prevent infinite recursion by limiting depth
  if (depth > 5) {
    console.error(`${colors.red}Maximum directory depth exceeded. Skipping: ${source}${colors.reset}`);
    return;
  }

  ensureDirectoryExists(target);
  
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      copyDirectory(sourcePath, targetPath, depth + 1);
    } else {
      copyFile(sourcePath, targetPath);
    }
  }
}

// Create the necessary directories
const componentsDir = path.join(targetDir, 'src', 'components');
const hooksDir = path.join(targetDir, 'src', 'hooks');
const utilsDir = path.join(targetDir, 'src', 'utils');
const typesDir = path.join(targetDir, 'src', 'types');

ensureDirectoryExists(componentsDir);
ensureDirectoryExists(hooksDir);
ensureDirectoryExists(utilsDir);
ensureDirectoryExists(typesDir);

// Copy the component files
try {
  // Copy TransactionForm components
  copyDirectory(
    path.join(sourceDir, 'src', 'components'),
    path.join(componentsDir, 'TransactionForm')
  );
  
  // Copy hooks
  copyDirectory(
    path.join(sourceDir, 'src', 'hooks'),
    hooksDir
  );
  
  // Copy utils
  copyDirectory(
    path.join(sourceDir, 'src', 'utils'),
    utilsDir
  );
  
  // Copy types
  copyDirectory(
    path.join(sourceDir, 'src', 'types'),
    typesDir
  );

  // Copy .env.example
  copyFile(
    path.join(sourceDir, '.env.example'),
    path.join(targetDir, '.env.example')
  );
  
  // Copy main TransactionForm component
  copyFile(
    path.join(sourceDir, 'TransactionForm.tsx'),
    path.join(componentsDir, 'TransactionForm.tsx')
  );
  
  // Copy PortalTransactionForm component
  copyFile(
    path.join(sourceDir, 'PortalTransactionForm.tsx'),
    path.join(componentsDir, 'PortalTransactionForm.tsx')
  );
  
  console.log(`\n${colors.green}✓ Files copied successfully${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}Error during file copy: ${error.message}${colors.reset}`);
}

// Check if required dependencies are installed
console.log(`${colors.cyan}Checking dependencies...${colors.reset}`);

// Function to check if a package is installed
function isPackageInstalled(packageName) {
  try {
    require.resolve(packageName, { paths: [targetDir] });
    return true;
  } catch (err) {
    return false;
  }
}

const requiredDependencies = [
  '@tanstack/react-query',
  'airtable',
  'framer-motion',
  'lucide-react',
  'react',
  'react-dom'
];

const missingDependencies = requiredDependencies.filter(dep => !isPackageInstalled(dep));

if (missingDependencies.length > 0) {
  console.log(`${colors.yellow}Missing dependencies: ${missingDependencies.join(', ')}${colors.reset}`);
  console.log(`\nInstall them with: npm install ${missingDependencies.join(' ')}`);
} else {
  console.log(`${colors.green}✓ All required dependencies are installed${colors.reset}`);
}

// Print setup instructions
console.log(`\n${colors.bright}${colors.cyan}Setup Instructions:${colors.reset}`);
console.log(`
1. ${colors.yellow}Set up environment variables:${colors.reset}
   Copy the variables from .env.example to your project's .env file and fill in the values.

2. ${colors.yellow}Import and use the form:${colors.reset}
   a) As a standalone form:
      import { TransactionForm } from './components/TransactionForm';
      
      function YourComponent() {
        return <TransactionForm />;
      }
      
   b) Within an agent portal:
      import { PortalTransactionForm } from './components/PortalTransactionForm';
      
      function AgentPortalPage() {
        return <PortalTransactionForm />;
      }

3. ${colors.yellow}Configure Airtable:${colors.reset}
   Make sure your Airtable base has tables for:
   - Transactions
   - Clients
   
   Update the field mappings in src/utils/airtable.ts if your Airtable field IDs differ.

${colors.green}Installation completed successfully!${colors.reset}
`);