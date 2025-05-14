
// Remove the shebang line
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
const sourceDir = path.join(__dirname, '..', '..'); // Go up to the src directory of intake form
const targetDir = path.join(__dirname, '..', '..', '..', '..', 'pa-real-estate-support-services'); // Path to main project

console.log(`${colors.bright}${colors.cyan}PA Real Estate Transaction Form Migration${colors.reset}\n`);
console.log(`Migrating from: ${sourceDir}`);
console.log(`Migrating to: ${targetDir}\n`);

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
function copyDirectory(source, target) {
  ensureDirectoryExists(target);
  
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      copyFile(sourcePath, targetPath);
    }
  }
}

// Create the necessary directories in the main project
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
    path.join(sourceDir, 'components', 'TransactionForm'),
    path.join(componentsDir, 'TransactionForm')
  );
  
  // Copy hooks
  copyDirectory(
    path.join(sourceDir, 'hooks'),
    hooksDir
  );
  
  // Copy utils
  copyDirectory(
    path.join(sourceDir, 'utils'),
    utilsDir
  );
  
  // Copy types
  copyDirectory(
    path.join(sourceDir, 'types'),
    typesDir
  );

  // Copy .env.example if it doesn't exist in target
  const targetEnvExample = path.join(targetDir, '.env.example');
  if (!fs.existsSync(targetEnvExample)) {
    copyFile(
      path.join(sourceDir, '.env.example'),
      targetEnvExample
    );
  }
  
  console.log(`\n${colors.green}✓ Files migrated successfully${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}Error during file migration: ${error.message}${colors.reset}`);
}

// Check if required dependencies are installed in the main project
console.log(`${colors.cyan}Checking dependencies in main project...${colors.reset}`);

const requiredDependencies = [
  '@tanstack/react-query',
  'airtable',
  'framer-motion',
  'lucide-react'
];

// Read the main project's package.json
const mainPackageJson = require(path.join(targetDir, 'package.json'));
const installedDependencies = { ...mainPackageJson.dependencies, ...mainPackageJson.devDependencies };

const missingDependencies = requiredDependencies.filter(dep => !installedDependencies[dep]);

if (missingDependencies.length > 0) {
  console.log(`${colors.yellow}Missing dependencies in main project: ${missingDependencies.join(', ')}${colors.reset}`);
  console.log(`\nInstall them with: cd "${targetDir}" && npm install ${missingDependencies.join(' ')}`);
} else {
  console.log(`${colors.green}✓ All required dependencies are installed in main project${colors.reset}`);
}

// Print migration completion message
console.log(`\n${colors.bright}${colors.cyan}Migration Complete!${colors.reset}`);
console.log(`
1. ${colors.yellow}Environment Variables:${colors.reset}
   Make sure all required environment variables are set in your main project's .env file.

2. ${colors.yellow}Import the form in your main project:${colors.reset}
   import { PortalTransactionForm } from './components/TransactionForm/PortalTransactionForm';

3. ${colors.yellow}Verify the migration:${colors.reset}
   - Check that all components were copied correctly
   - Test the form functionality in your main project
   - Ensure all dependencies are working

${colors.green}Migration completed successfully!${colors.reset}
`);
