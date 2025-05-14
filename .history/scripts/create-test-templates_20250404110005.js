#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

const templatesDir = path.join(process.cwd(), 'public', 'templates');
const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(templatesDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });
    console.log('✅ Directories created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating directories:', error);
    return false;
  }
}

// Create sample templates
async function createTemplates() {
  const buyerTemplateContent = `
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
</html>`;

  const sellerTemplateContent = `
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
</html>`;

  const dualAgentTemplateContent = `
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
</html>`;

  try {
    await fs.writeFile(path.join(templatesDir, 'Buyer.html'), buyerTemplateContent);
    console.log('✅ Created Buyer.html template');
    
    await fs.writeFile(path.join(templatesDir, 'Seller.html'), sellerTemplateContent);
    console.log('✅ Created Seller.html template');
    
    await fs.writeFile(path.join(templatesDir, 'DualAgent.html'), dualAgentTemplateContent);
    console.log('✅ Created DualAgent.html template');
    
    return true;
  } catch (error) {
    console.error('❌ Error creating templates:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('=== Creating PDF Templates ===');
  
  // Ensure directories exist
  await ensureDirectories();
  
  // Create templates
  const result = await createTemplates();
  
  if (result) {
    console.log('\n✅ All templates created successfully!');
    console.log(`Templates are stored in: ${templatesDir}`);
  } else {
    console.error('\n❌ Failed to create templates');
  }
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 