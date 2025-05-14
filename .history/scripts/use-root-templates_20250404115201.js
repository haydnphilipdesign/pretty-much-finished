#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import fs from 'fs';
import { promises as fs_promises } from 'fs';
import puppeteer from 'puppeteer';

// Set up paths - using templates from the root directory instead of public/templates
const rootDir = process.cwd();
const templatesMap = {
  'Buyer': path.join(rootDir, 'Buyer.html'),
  'Seller': path.join(rootDir, 'Seller.html'), 
  'DualAgent': path.join(rootDir, 'DualAgent.html')
};
const outputDir = path.join(rootDir, 'public', 'generated-pdfs');

// Create output directory if it doesn't exist
async function ensureDirectories() {
  try {
    // Only ensure the output directory exists
    await fs_promises.mkdir(outputDir, { recursive: true });
    console.log('✅ Output directory created/verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating output directory:', error);
    return false;
  }
}

// Check if original templates exist in the root directory
async function checkTemplates() {
  for (const [templateKey, templatePath] of Object.entries(templatesMap)) {
    try {
      await fs_promises.access(templatePath);
      console.log(`✅ Found template: ${path.basename(templatePath)}`);
    } catch (error) {
      console.error(`❌ Template not found: ${templatePath}`);
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
  console.log('=== GENERATING PDFs FROM ORIGINAL ROOT TEMPLATES ===');
  
  // Ensure output directory exists
  const dirsOk = await ensureDirectories();
  if (!dirsOk) return;
  
  // Check if templates exist
  const templatesOk = await checkTemplates();
  if (!templatesOk) {
    console.error(`\n❌ One or more template files are missing from the root directory`);
    console.log('Please ensure all template files (Buyer.html, Seller.html, DualAgent.html) exist in the project root');
    return;
  }
  
  // Generate PDFs for each template
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const templates = [
    { name: 'Buyer', label: "Buyer's Agent" },
    { name: 'Seller', label: "Listing Agent" },
    { name: 'DualAgent', label: "Dual Agent" }
  ];
  
  // Sample data to populate the templates
  const templateData = {
    agentName: 'John Test Smith',
    propertyAddress: '123 Test Street, Philadelphia, PA 19123',
    clientNames: 'Test Client, Another Client',
    commissionAmount: '10,500',
    transactionDate: new Date().toLocaleDateString()
  };
  
  for (const template of templates) {
    const templatePath = templatesMap[template.name];
    const outputPath = path.join(outputDir, `Original_${template.name}_${timestamp}.pdf`);
    
    console.log(`\n🧪 Generating PDF for ${template.label}...`);
    await generatePdfFromTemplate(templatePath, outputPath, templateData);
  }
  
  // Display results
  console.log('\n=== PDF GENERATION COMPLETED ===');
  console.log(`✅ PDFs were generated in: ${outputDir}`);
  console.log(`📂 ${outputDir}`);
  console.log('📋 To view the PDFs, open them in your file explorer:');
  console.log(`   ${path.resolve(outputDir)}`);
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 