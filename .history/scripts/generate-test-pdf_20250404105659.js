#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import fs from 'fs';
import { promises as fs_promises } from 'fs';
import puppeteer from 'puppeteer';

// Set up paths
const templatesDir = path.join(process.cwd(), 'public', 'templates');
const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');

// Create directories if they don't exist
async function ensureDirectories() {
  try {
    await fs_promises.mkdir(templatesDir, { recursive: true });
    await fs_promises.mkdir(outputDir, { recursive: true });
    console.log('✅ Directories created/verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating directories:', error);
    return false;
  }
}

// Create sample template files if needed
async function createSampleTemplates() {
  const templates = {
    'Buyer.html': `
<!DOCTYPE html>
<html>
<head>
  <title>Buyer's Agent Cover Sheet</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #2c3e50; text-align: center; }
    .info { margin-bottom: 20px; }
    .field { margin-bottom: 10px; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Buyer's Agent Cover Sheet</h1>
  <div class="info">
    <div class="field"><span class="label">Agent:</span> {{agentName}}</div>
    <div class="field"><span class="label">Property:</span> {{propertyAddress}}</div>
    <div class="field"><span class="label">Clients:</span> {{clientNames}}</div>
    <div class="field"><span class="label">Commission:</span> ${{commissionAmount}}</div>
    <div class="field"><span class="label">Transaction Date:</span> {{transactionDate}}</div>
  </div>
  <div>This is a test template for Buyer's Agent</div>
</body>
</html>`,
    'Seller.html': `
<!DOCTYPE html>
<html>
<head>
  <title>Listing Agent Cover Sheet</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #2c3e50; text-align: center; }
    .info { margin-bottom: 20px; }
    .field { margin-bottom: 10px; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Listing Agent Cover Sheet</h1>
  <div class="info">
    <div class="field"><span class="label">Agent:</span> {{agentName}}</div>
    <div class="field"><span class="label">Property:</span> {{propertyAddress}}</div>
    <div class="field"><span class="label">Clients:</span> {{clientNames}}</div>
    <div class="field"><span class="label">Commission:</span> ${{commissionAmount}}</div>
    <div class="field"><span class="label">Transaction Date:</span> {{transactionDate}}</div>
  </div>
  <div>This is a test template for Listing Agent</div>
</body>
</html>`,
    'DualAgent.html': `
<!DOCTYPE html>
<html>
<head>
  <title>Dual Agent Cover Sheet</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #2c3e50; text-align: center; }
    .info { margin-bottom: 20px; }
    .field { margin-bottom: 10px; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Dual Agent Cover Sheet</h1>
  <div class="info">
    <div class="field"><span class="label">Agent:</span> {{agentName}}</div>
    <div class="field"><span class="label">Property:</span> {{propertyAddress}}</div>
    <div class="field"><span class="label">Clients:</span> {{clientNames}}</div>
    <div class="field"><span class="label">Commission:</span> ${{commissionAmount}}</div>
    <div class="field"><span class="label">Transaction Date:</span> {{transactionDate}}</div>
  </div>
  <div>This is a test template for Dual Agent</div>
</body>
</html>`
  };

  for (const [filename, content] of Object.entries(templates)) {
    const filePath = path.join(templatesDir, filename);
    if (!fs.existsSync(filePath)) {
      try {
        await fs_promises.writeFile(filePath, content);
        console.log(`✅ Created sample template: ${filename}`);
      } catch (error) {
        console.error(`❌ Error creating template ${filename}:`, error);
        return false;
      }
    } else {
      console.log(`✓ Template already exists: ${filename}`);
    }
  }
  
  return true;
}

/**
 * Generate a PDF from an HTML template
 */
async function generatePdfFromTemplate(templatePath, outputPath, replacements) {
  try {
    // Read the template file
    let templateContent = await fs_promises.readFile(templatePath, 'utf-8');
    
    // Replace placeholders
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      templateContent = templateContent.replace(regex, value);
    }
    
    // Launch a browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Set content
      await page.setContent(templateContent, { waitUntil: 'networkidle0' });
      
      // Generate PDF
      await page.pdf({
        path: outputPath,
        format: 'letter',
        printBackground: true,
        margin: { top: '0.2in', right: '0.2in', bottom: '0.2in', left: '0.2in' },
      });
      
      console.log(`✅ Generated PDF: ${outputPath}`);
      return true;
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error(`❌ Error generating PDF from template ${templatePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('=== TEST PDF GENERATION ===');
  
  // Ensure directories exist
  const dirsOk = await ensureDirectories();
  if (!dirsOk) return;
  
  // Create sample templates
  const templatesOk = await createSampleTemplates();
  if (!templatesOk) return;
  
  // Generate PDFs for each template
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const templates = ['Buyer', 'Seller', 'DualAgent'];
  const templateData = {
    agentName: 'John Test Smith',
    propertyAddress: '123 Test Street, Philadelphia, PA 19123',
    clientNames: 'Test Client, Another Client',
    commissionAmount: '10,500',
    transactionDate: new Date().toLocaleDateString()
  };
  
  for (const template of templates) {
    const templatePath = path.join(templatesDir, `${template}.html`);
    const outputPath = path.join(outputDir, `Test_${template}_${timestamp}.pdf`);
    
    console.log(`\n🧪 Generating test PDF for ${template}...`);
    await generatePdfFromTemplate(templatePath, outputPath, templateData);
  }
  
  // Display results
  console.log('\n=== TEST COMPLETED ===');
  console.log(`✅ PDFs were generated in: ${outputDir}`);
  console.log('📋 To view the PDFs, open them in your PDF viewer');
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 