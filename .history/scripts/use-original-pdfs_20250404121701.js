#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import fs from 'fs';
import { promises as fs_promises } from 'fs';

// Set up paths
const rootDir = process.cwd();
const pdfMapping = {
  'Buyer': { source: path.join(rootDir, 'Buyers-Agent.pdf'), displayName: "Buyer's Agent" },
  'Seller': { source: path.join(rootDir, 'Listing-Agent.pdf'), displayName: "Listing Agent" },
  'DualAgent': { source: path.join(rootDir, 'Dual-Agent.pdf'), displayName: "Dual Agent" }
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

// Check if original PDFs exist in the root directory
async function checkOriginalPdfs() {
  for (const [role, { source }] of Object.entries(pdfMapping)) {
    try {
      await fs_promises.access(source);
      console.log(`✅ Found original PDF: ${path.basename(source)}`);
    } catch (error) {
      console.error(`❌ Original PDF not found: ${source}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Copy an original PDF to the output directory
 */
async function copyPdf(sourcePath, outputPath) {
  try {
    await fs_promises.copyFile(sourcePath, outputPath);
    console.log(`✅ Copied PDF: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error copying PDF from ${sourcePath} to ${outputPath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('=== COPYING ORIGINAL PDFs TO OUTPUT DIRECTORY ===');
  
  // Ensure output directory exists
  const dirsOk = await ensureDirectories();
  if (!dirsOk) return;
  
  // Check if original PDFs exist
  const pdfsOk = await checkOriginalPdfs();
  if (!pdfsOk) {
    console.error(`\n❌ One or more original PDFs are missing from the root directory`);
    console.log('Please ensure all PDF files (Buyers-Agent.pdf, Listing-Agent.pdf, Dual-Agent.pdf) exist in the project root');
    return;
  }
  
  // Copy PDFs to output directory
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  for (const [role, { source, displayName }] of Object.entries(pdfMapping)) {
    const outputPath = path.join(outputDir, `Original_${role}_${timestamp}.pdf`);
    
    console.log(`\n📋 Copying original PDF for ${displayName}...`);
    await copyPdf(source, outputPath);
  }
  
  // Display results
  console.log('\n=== PDF COPYING COMPLETED ===');
  console.log(`✅ PDFs were copied to: ${outputDir}`);
  console.log(`📂 ${outputDir}`);
  console.log('📋 To view the PDFs, open them in your file explorer:');
  console.log(`   ${path.resolve(outputDir)}`);
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 