/**
 * Script to prepare API files for Vercel deployment
 * This script copies necessary files to ensure they're available in the serverless environment
 */
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const apiDir = path.join(__dirname, '..', 'api');
const apiPublicDir = path.join(apiDir, 'public');

if (!fs.existsSync(apiPublicDir)) {
  console.log('Creating directory:', apiPublicDir);
  fs.mkdirSync(apiPublicDir, { recursive: true });
}

// Copy PDF template
const sourcePdfPath = path.join(__dirname, '..', 'public', 'mergedTC.pdf');
const destPdfPath = path.join(apiPublicDir, 'mergedTC.pdf');

try {
  console.log(`Copying PDF template from ${sourcePdfPath} to ${destPdfPath}`);
  fs.copyFileSync(sourcePdfPath, destPdfPath);
  console.log('PDF template copied successfully');
} catch (error) {
  console.error('Error copying PDF template:', error);
}

console.log('API files prepared for Vercel deployment');
