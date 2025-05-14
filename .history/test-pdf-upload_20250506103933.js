// Test script for Supabase PDF upload functionality
const fs = require('fs');
const path = require('path');
const { uploadPdfToSupabase, formatPdfForAirtable } = require('./api/supabase-pdf-upload');

// Load environment variables
require('dotenv').config();

/**
 * Test the PDF upload functionality
 */
async function testPdfUpload() {
  try {
    console.log('Starting PDF upload test...');
    
    // Path to a test PDF file
    const testPdfPath = path.join(__dirname, 'test-files', 'test.pdf');
    
    // Create test-files directory if it doesn't exist
    const testFilesDir = path.join(__dirname, 'test-files');
    if (!fs.existsSync(testFilesDir)) {
      console.log('Creating test-files directory...');
      fs.mkdirSync(testFilesDir, { recursive: true });
    }
    
    // Check if test PDF exists, if not create a simple one
    if (!fs.existsSync(testPdfPath)) {
      console.log('Test PDF not found, creating a sample PDF...');
      // This is a minimal valid PDF file
      const minimalPdf = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF';
      fs.writeFileSync(testPdfPath, minimalPdf);
    }
    
    // Read the test PDF file
    console.log(`Reading test PDF from: ${testPdfPath}`);
    const pdfBuffer = fs.readFileSync(testPdfPath);
    const pdfBase64 = pdfBuffer.toString('base64');
    
    console.log(`PDF loaded, size: ${pdfBuffer.length} bytes`);
    
    // Test direct upload to Supabase
    console.log('Testing direct upload to Supabase...');
    const uploadResult = await uploadPdfToSupabase(pdfBase64, 'test-upload.pdf');
    
    if (uploadResult.success) {
      console.log('✅ PDF upload to Supabase successful!');
      console.log(`Public URL: ${uploadResult.url}`);
      console.log(`Storage path: ${uploadResult.path}`);
    } else {
      console.error('❌ PDF upload to Supabase failed:', uploadResult.error);
    }
    
    // Test formatting for Airtable
    console.log('\nTesting Airtable formatting...');
    const airtableFormat = await formatPdfForAirtable(pdfBase64, 'test-airtable.pdf');
    
    if (airtableFormat) {
      console.log('✅ Airtable formatting successful!');
      console.log('Airtable attachment format:', JSON.stringify(airtableFormat, null, 2));
    } else {
      console.error('❌ Airtable formatting failed');
    }
    
    console.log('\nTest completed!');
  } catch (error) {
    console.error('Error in test:', error);
  }
}

// Run the test
testPdfUpload();

/*
 * To run this test:
 * 1. Make sure you have set up the Supabase storage bucket as described in supabase-setup-guide.md
 * 2. Ensure your .env file contains valid SUPABASE_URL and SUPABASE_ANON_KEY values
 * 3. Run: node test-pdf-upload.js
 */