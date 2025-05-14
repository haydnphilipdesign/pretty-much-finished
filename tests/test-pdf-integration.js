/**
 * PDF Integration Test Script
 * 
 * This script tests the full PDF generation, upload, and Airtable attachment process.
 * It verifies:
 * 1. PDF generation via the API
 * 2. Supabase storage integration with bucket fallback
 * 3. Direct Airtable attachment functionality
 * 4. Error handling and fallback mechanisms
 */

import { config } from 'dotenv';
import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { createClient } from '@supabase/supabase-js';
import Airtable from 'airtable';
import { fileURLToPath } from 'url';

// Load environment variables
config();

// Get current directory (ESM replacement for __dirname)
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

// Mock transaction data for testing
const mockTransactionData = {
    agentData: {
        role: "BUYERS AGENT",
        name: "Test Agent",
        email: "test@example.com",
        phone: "123-456-7890"
    },
    propertyData: {
        mlsNumber: "TEST123",
        address: "123 Test Street, Testville, PA 12345",
        salePrice: "500000",
        status: "OCCUPIED",
        propertyType: "RESIDENTIAL",
        closingDate: new Date().toISOString().split('T')[0]
    },
    clients: [{
        name: "Test Client",
        type: "BUYER",
        email: "client@example.com",
        phone: "987-654-3210"
    }],
    signatureData: {
        signature: "Test Signature",
        dateSubmitted: new Date().toISOString().split('T')[0]
    }
};

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const TEST_RECORD_ID = process.env.TEST_RECORD_ID; // Optional: existing Airtable record ID for testing

// Supabase connection
function getSupabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials. Please check your .env file.');
    }

    return createClient(supabaseUrl, supabaseKey);
}

// Airtable connection
function getAirtableBase() {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        throw new Error('Missing Airtable credentials. Please check your .env file.');
    }

    const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
    return airtable.base(AIRTABLE_BASE_ID);
}

/**
 * 1. Test direct PDF generation via API
 */
async function testPdfGeneration() {
    console.log('\n🧪 TESTING PDF GENERATION');
    console.log('Generating test PDF via API...');

    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-pdf?returnPdf=true`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockTransactionData)
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(`PDF generation failed: ${result.error || 'Unknown error'}`);
        }

        console.log('✅ PDF Generation: Success');

        // Save the PDF for further testing
        const pdfData = result.pdfData || result.pdfBase64;
        if (pdfData) {
            const pdfBuffer = Buffer.from(pdfData, 'base64');
            await fs.writeFile(join(__dirname, 'test-output.pdf'), pdfBuffer);
            console.log('✅ Saved test PDF to test-output.pdf');
            return pdfData;
        } else {
            throw new Error('No PDF data in response');
        }
    } catch (error) {
        console.error('❌ PDF Generation Error:', error);
        return null;
    }
}

/**
 * 2. Test Supabase bucket availability
 */
async function testSupabaseBuckets() {
    console.log('\n🧪 TESTING SUPABASE STORAGE');

    try {
        const supabase = getSupabaseClient();
        console.log('Connected to Supabase successfully');

        // Check for available buckets
        const { data: buckets, error } = await supabase.storage.listBuckets();

        if (error) {
            throw new Error(`Failed to list buckets: ${error.message}`);
        }

        if (!buckets || buckets.length === 0) {
            console.log('⚠️ No buckets found in Supabase project');
            return false;
        }

        console.log('Available buckets:');
        buckets.forEach(bucket => console.log(` - ${bucket.name}`));

        // Check for target bucket
        const targetBucket = 'transaction-documents';
        const bucketExists = buckets.some(bucket => bucket.name === targetBucket);

        if (bucketExists) {
            console.log(`✅ Target bucket '${targetBucket}' exists`);
        } else {
            console.log(`⚠️ Target bucket '${targetBucket}' not found, but fallback available`);
        }

        return true;
    } catch (error) {
        console.error('❌ Supabase Storage Error:', error);
        return false;
    }
}

/**
 * 3. Test Supabase PDF upload
 */
async function testSupabaseUpload(pdfData) {
    console.log('\n🧪 TESTING SUPABASE PDF UPLOAD');

    if (!pdfData) {
        console.log('⚠️ Skipping upload test - no PDF data available');
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/supabase-pdf-upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pdfData,
                filename: 'integration-test.pdf',
                transactionId: TEST_RECORD_ID
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(`Upload failed: ${result.error || 'Unknown error'}`);
        }

        console.log('✅ Supabase Upload: Success');
        console.log(`File URL: ${result.url}`);
        console.log(`Bucket used: ${result.bucket || 'unknown'}`);
        console.log(`Airtable updated: ${result.airtableUpdated ? 'Yes' : 'No'}`);

        return result;
    } catch (error) {
        console.error('❌ Supabase Upload Error:', error);
        return null;
    }
}

/**
 * 4. Test direct Airtable attachment
 */
async function testAirtableAttachment(pdfData) {
    console.log('\n🧪 TESTING DIRECT AIRTABLE ATTACHMENT');

    if (!pdfData) {
        console.log('⚠️ Skipping Airtable test - no PDF data available');
        return null;
    }

    if (!TEST_RECORD_ID) {
        console.log('⚠️ Skipping Airtable test - no test record ID provided in .env');
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/update-airtable-attachment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pdfData,
                filename: 'direct-attachment-test.pdf',
                transactionId: TEST_RECORD_ID
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(`Attachment failed: ${result.error || 'Unknown error'}`);
        }

        console.log('✅ Airtable Attachment: Success');
        console.log(`Record ID: ${result.recordId}`);

        return result;
    } catch (error) {
        console.error('❌ Airtable Attachment Error:', error);
        return null;
    }
}

/**
 * 5. Verify Airtable record has attachments
 */
async function verifyAirtableAttachments() {
    console.log('\n🧪 VERIFYING AIRTABLE ATTACHMENTS');

    if (!TEST_RECORD_ID) {
        console.log('⚠️ Skipping verification - no test record ID provided in .env');
        return false;
    }

    try {
        const base = getAirtableBase();
        const record = await base('Transactions').find(TEST_RECORD_ID);

        if (!record) {
            throw new Error(`Record not found: ${TEST_RECORD_ID}`);
        }

        console.log('Found Airtable record:', record.id);

        // Check for PDF attachment field
        const pdfFieldId = 'fldhrYdoFwtNfzdFY';
        const attachments = record.get(pdfFieldId);

        if (!attachments || attachments.length === 0) {
            console.log('⚠️ No attachments found on record');
            return false;
        }

        console.log(`✅ Found ${attachments.length} attachments:`);
        attachments.forEach((attachment, i) => {
            console.log(` ${i+1}. ${attachment.filename} (${attachment.url.substring(0, 50)}...)`);
        });

        return true;
    } catch (error) {
        console.error('❌ Airtable Verification Error:', error);
        return false;
    }
}

// Run all tests sequentially
async function runTests() {
    console.log('🔍 STARTING PDF INTEGRATION TESTS');
    console.log('================================');

    try {
        // Generate a test PDF
        const pdfData = await testPdfGeneration();

        // Check Supabase buckets
        await testSupabaseBuckets();

        // Test uploads
        if (pdfData) {
            // Try Supabase upload first
            const supabaseResult = await testSupabaseUpload(pdfData);

            // Then try direct Airtable attachment regardless of Supabase result
            const airtableResult = await testAirtableAttachment(pdfData);

            // Verify the attachments in Airtable
            await verifyAirtableAttachments();
        }

        console.log('\n================================');
        console.log('🎉 TESTS COMPLETED');
    } catch (error) {
        console.error('\n❌ TEST SUITE ERROR:', error);
    }
}

// Execute the tests
runTests();