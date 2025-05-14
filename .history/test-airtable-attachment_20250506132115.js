/**
 * Airtable Attachment Test Script
 * 
 * This script tests the Airtable PDF attachment functionality
 * by generating a test PDF and attaching it to an Airtable record.
 */

import { config } from 'dotenv';
import Airtable from 'airtable';
import fetch from 'node-fetch';

// Load environment variables
config();

// Production URL for API testing
const API_URL = process.env.API_URL || 'https://pa-real-estate-support-services-6burgzg3f.vercel.app';

// Sample minimal PDF base64 for testing
const MINIMAL_PDF = "JVBERi0xLjcKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1szIDAgUl0+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3ggWzAgMCAzIDNdL1Jlc291cmNlcyA0IDAgUi9Db250ZW50cyA1IDAgUi9QYXJlbnQgMiAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9Gb250PDwvRjEgNiAwIFI+Pj4+CmVuZG9iago1IDAgb2JqCjw8L0xlbmd0aCAzNj4+CnN0cmVhbQpCVCAvRjEgMTIgVGYgMTAgMTAgVGQgKFRlc3QpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKNiAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExMSAwMDAwMCBuIAowMDAwMDAwMjEwIDAwMDAwIG4gCjAwMDAwMDAyNDcgMDAwMDAgbiAKMDAwMDAwMDMzMiAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNy9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjM5OQolJUVPRgo=";

/**
 * Test direct Airtable connection
 */
async function testAirtableDirectly() {
    console.log('\n🔍 TESTING DIRECT AIRTABLE CONNECTION');
    console.log('====================================');

    // Get Airtable credentials
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        console.error('❌ Missing Airtable credentials in .env file');
        console.log('Please create a .env file with AIRTABLE_API_KEY and AIRTABLE_BASE_ID');
        return false;
    }

    try {
        // Initialize Airtable
        const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
        const base = airtable.base(AIRTABLE_BASE_ID);

        // Get first record in Transactions table
        console.log('Fetching a sample record from Transactions table...');
        const records = await base('Transactions').select({ maxRecords: 1 }).firstPage();

        if (!records || records.length === 0) {
            console.error('❌ No records found in Transactions table');
            return false;
        }

        const sampleRecord = records[0];
        console.log(`✅ Found record: ${sampleRecord.getId()}`);

        // Try direct attachment
        const fieldId = 'fldhrYdoFwtNfzdFY'; // PDF attachments field
        const attachmentUrl = 'https://example.com/test.pdf'; // Example URL for testing

        console.log(`Attaching test PDF to record ${sampleRecord.getId()}...`);

        const updateData = {
            [fieldId]: [{
                url: attachmentUrl,
                filename: 'direct-test.pdf'
            }]
        };

        const updatedRecord = await base('Transactions').update(sampleRecord.getId(), updateData);

        if (!updatedRecord) {
            console.error('❌ Failed to update record with attachment');
            return false;
        }

        console.log('✅ Successfully attached PDF to Airtable record directly');

        // Clean up - remove test attachment
        try {
            await base('Transactions').update(sampleRecord.getId(), {
                [fieldId]: [] });
            console.log('✅ Test attachment removed');
        } catch (cleanupError) {
            console.warn('⚠️ Could not remove test attachment:', cleanupError.message);
        }

        return true;
    } catch (error) {
        console.error('❌ Error in direct Airtable test:', error);
        return false;
    }
}

/**
 * Test Airtable attachment via the API
 */
async function testAirtableViaAPI() {
    console.log('\n🔍 TESTING AIRTABLE ATTACHMENT VIA API');
    console.log('=====================================');

    try {
        // First, get a record ID we can use
        const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
        const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;

        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            console.error('❌ Missing Airtable credentials for record lookup');
            return false;
        }

        // Initialize Airtable to get a record ID
        const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
        const base = airtable.base(AIRTABLE_BASE_ID);

        console.log('Fetching a sample transaction record...');
        const records = await base('Transactions').select({ maxRecords: 1 }).firstPage();

        if (!records || records.length === 0) {
            console.error('❌ No records found to test with');
            return false;
        }

        const testRecordId = records[0].getId();
        console.log(`Using record ID for test: ${testRecordId}`);

        // Now test the API
        console.log('Sending test PDF to Airtable attachment API...');
        console.log(`API endpoint: ${API_URL}/api/update-airtable-attachment`);

        const response = await fetch(`${API_URL}/api/update-airtable-attachment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pdfData: MINIMAL_PDF,
                filename: 'api-test.pdf',
                transactionId: testRecordId
            })
        });

        console.log(`API response status: ${response.status} ${response.statusText}`);

        const responseText = await response.text();
        console.log('API response:', responseText);

        try {
            const jsonResult = JSON.parse(responseText);

            if (jsonResult.success) {
                console.log('✅ Airtable attachment API succeeded!');
                console.log(`Record ID: ${jsonResult.recordId}`);

                // Verify attachment exists
                const record = await base('Transactions').find(testRecordId);
                const attachments = record.get('fldhrYdoFwtNfzdFY') || [];

                if (attachments.length > 0) {
                    console.log(`✅ Verified ${attachments.length} attachments on record`);

                    // Clean up
                    try {
                        await base('Transactions').update(testRecordId, { 'fldhrYdoFwtNfzdFY': [] });
                        console.log('✅ Test attachment removed');
                    } catch (cleanupError) {
                        console.warn('⚠️ Could not remove test attachment:', cleanupError.message);
                    }
                } else {
                    console.error('❌ API reported success but no attachments found');
                }

                return true;
            } else {
                console.error('❌ Airtable attachment API failed:', jsonResult.error);
                return false;
            }
        } catch (parseError) {
            console.error('❌ Could not parse API response as JSON:', parseError);
            return false;
        }
    } catch (error) {
        console.error('❌ Error in Airtable API test:', error);
        return false;
    }
}

/**
 * Check API response content
 */
async function checkAPIResponse() {
    console.log('\n🔍 INSPECTING API ENDPOINTS');
    console.log('=========================');

    // Check update-airtable-attachment API
    console.log('Testing update-airtable-attachment API with empty request...');

    try {
        const response = await fetch(`${API_URL}/api/update-airtable-attachment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}) // Empty request to see error handling
        });

        console.log(`API response status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log('Error response:', text);

        return true;
    } catch (error) {
        console.error('❌ Error testing API endpoint:', error);
        return false;
    }
}

/**
 * Run all tests
 */
async function runTests() {
    console.log('🔍 STARTING AIRTABLE ATTACHMENT TESTS');
    console.log('====================================');

    // First inspect API response format
    await checkAPIResponse();

    // Test direct Airtable connection
    const directResult = await testAirtableDirectly();

    // Test via API
    const apiResult = await testAirtableViaAPI();

    console.log('\n====================================');
    console.log('🔍 TEST RESULTS SUMMARY');
    console.log(`Direct Airtable attachment: ${directResult ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`API-based Airtable attachment: ${apiResult ? '✅ SUCCESS' : '❌ FAILED'}`);

    if (!apiResult) {
        console.log('\nTROUBLESHOOTING RECOMMENDATIONS:');
        console.log('1. Check Airtable API key and Base ID in Vercel environment variables');
        console.log('2. Verify the PDF field ID in update-airtable-attachment.js (should be fldhrYdoFwtNfzdFY)');
        console.log('3. Ensure PDF data is being properly formatted before sending to Airtable');
        console.log('4. Check Vercel logs for more detailed errors from the serverless functions');
    }
}

// Run the tests
runTests();