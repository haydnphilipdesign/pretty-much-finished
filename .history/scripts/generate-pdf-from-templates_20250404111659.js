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

// Make sure directories exist
async function ensureDirectories() {
  try {
    await fs_promises.mkdir(templatesDir, { recursive: true });
    await fs_promises.mkdir(outputDir, { recursive: true });
    console.log('✅ Directories verified');
    return true;
  } catch (error) {
    console.error('❌ Error checking directories:', error);
    return false;
  }
}

// Check if templates exist
async function checkTemplates() {
  const templates = ['Buyer.html', 'Seller.html', 'DualAgent.html'];
  for (const template of templates) {
    const templatePath = path.join(templatesDir, template);
    try {
      await fs_promises.access(templatePath);
      console.log(`✅ Found template: ${template}`);
    } catch (error) {
      console.error(`❌ Missing template: ${template}`);
      console.log(`Please run "node scripts/create-test-templates.js" first to create the templates.`);
      return false;
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
  console.log('=== PDF GENERATION TEST ===');
  
  // Ensure directories exist
  const dirsOk = await ensureDirectories();
  if (!dirsOk) return;
  
  // Check if templates exist
  const templatesOk = await checkTemplates();
  if (!templatesOk) return;
  
  // Generate PDFs for each template
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const templates = [
    { name: 'Buyer', file: 'Buyer.html' },
    { name: 'Seller', file: 'Seller.html' },
    { name: 'DualAgent', file: 'DualAgent.html' }
  ];
  
  const templateData = {
    agentName: 'John Test Smith',
    propertyAddress: '123 Test Street, Philadelphia, PA 19123',
    clientNames: 'Test Client, Another Client',
    commissionAmount: '10,500',
    transactionDate: new Date().toLocaleDateString()
  };
  
  let success = true;
  
  for (const template of templates) {
    const templatePath = path.join(templatesDir, template.file);
    const outputPath = path.join(outputDir, `Test_${template.name}_${timestamp}.pdf`);
    
    console.log(`\n🧪 Generating test PDF for ${template.name}...`);
    const result = await generatePdfFromTemplate(templatePath, outputPath, templateData);
    if (!result) success = false;
  }
  
  // Display results
  console.log('\n=== TEST COMPLETED ===');
  if (success) {
    console.log(`✅ All PDFs were generated successfully!`);
    console.log(`📂 PDFs are stored in: ${outputDir}`);
    console.log('📋 To view the PDFs, open them in your PDF viewer');
  } else {
    console.error(`❌ Some PDFs failed to generate. Please check the logs for details.`);
  }
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 