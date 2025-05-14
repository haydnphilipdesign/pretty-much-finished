/**
 * Production Config Check Script
 * 
 * Diagnoses issues with PDF upload and Airtable attachment in production
 * This script:
 * 1. Checks the Vercel environment variables
 * 2. Tests Supabase bucket availability
 * 3. Tests direct Airtable API access 
 * 4. Tests the key API endpoints
 */

import { config } from 'dotenv';
import fetch from 'node-fetch';
import Airtable from 'airtable';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import fs from 'fs';

// Load environment variables
config();

// Set the production URL
const PROD_URL = process.env.PROD_URL || 'https://pa-real-estate-support-services-6burgzg3f.vercel.app';

// Sample minimal PDF base64 for testing
const MINIMAL_PDF = "JVBERi0xLjcKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1szIDAgUl0+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3ggWzAgMCAzIDNdL1Jlc291cmNlcyA0IDAgUi9Db250ZW50cyA1IDAgUi9QYXJlbnQgMiAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9Gb250PDwvRjEgNiAwIFI+Pj4+CmVuZG9iago1IDAgb2JqCjw8L0xlbmd0aCAzNj4+CnN0cmVhbQpCVCAvRjEgMTIgVGYgMTAgMTAgVGQgKFRlc3QpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKNiAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExMSAwMDAwMCBuIAowMDAwMDAwMjEwIDAwMDAwIG4gCjAwMDAwMDAyNDcgMDAwMDAgbiAKMDAwMDAwMDMzMiAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNy9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjM5OQolJUVPRgo=";

// Required environment variables
const REQUIRED_ENV_VARS = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'AIRTABLE_API_KEY',
    'AIRTABLE_BASE_ID'
];

/**
 * Check environment variables in Vercel
 */
async function checkEnvironmentVariables() {
    console.log('\n🔍 CHECKING ENVIRONMENT VARIABLES');
    console.log('===============================');

    try {
        // Try to get Vercel environment variables
        console.log('Checking Vercel environment variables...');

        try {
            const vercelEnvOutput = execSync('vercel env ls', { encoding: 'utf8' });
            console.log('\nVercel environment variables:');
            console.log(vercelEnvOutput);

            // Check for required variables
            let missingVars = [];
            for (const envVar of REQUIRED_ENV_VARS) {
                if (!vercelEnvOutput.includes(envVar)) {
                    missingVars.push(envVar);
                }
            }

            if (missingVars.length > 0) {
                console.error(`❌ Missing required environment variables in Vercel: ${missingVars.join(', ')}`);
            } else {
                console.log('✅ All required environment variables are set in Vercel');
            }
        } catch (vercelError) {
            console.error('❌ Could not check Vercel environment variables:', vercelError.message);
        }

        // Check local environment variables
        const missingLocalVars = REQUIRED_ENV_VARS.filter(variable => !process.env[variable]);

        if (missingLocalVars.length > 0) {
            console.error(`❌ Missing required environment variables in .env file: ${missingLocalVars.join(', ')}`);
            console.log('Create a .env file with these variables to run local tests');
        } else {
            console.log('✅ All required environment variables are set in local .env file');
        }

        return true;
    } catch (error) {
        console.error('❌ Error checking environment variables:', error);
        return false;
    }
}

/**
 * Test Supabase storage bucket
 */
async function testSupabaseBucket() {
    console.log('\n🔍 CHECKING SUPABASE STORAGE');
    console.log('==========================');

    // Get Supabase credentials
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials in environment');
        return false;
    }

    try {
        // Initialize Supabase client
        const supabase = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client initialized');

        // List buckets
        const { data: buckets, error } = await supabase.storage.listBuckets();

        if (error) {
            console.error('❌ Error listing Supabase buckets:', error.message);
            return false;
        }

        console.log(`Found ${buckets.length} storage buckets:`);
        buckets.forEach(bucket => {
            console.log(`- ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
        });

        // Check for transaction-documents bucket
        const transactionBucket = buckets.find(b => b.name === 'transaction-documents');

        if (!transactionBucket) {
            console.error('❌ Missing required "transaction-documents" bucket');
            console.log('Attempting to create bucket...');

            try {
                const { data, error: createError } = await supabase.storage.createBucket('transaction-documents', {
                    public: true
                });

                if (createError) {
                    console.error('❌ Failed to create bucket:', createError.message);
                } else {
                    console.log('✅ Successfully created "transaction-documents" bucket');
                }
            } catch (createError) {
                console.error('❌ Error creating bucket:', createError);
            }
        } else {
            console.log('✅ "transaction-documents" bucket exists');

            // Test uploading a file
            const testFile = new Uint8Array([0, 1, 2, 3, 4]);
            const { data, error: uploadError } = await supabase.storage
                .from('transaction-documents')
                .upload('test-upload.txt', testFile, { upsert: true });

            if (uploadError) {
                console.error('❌ Test upload failed:', uploadError.message);
            } else {
                console.log('✅ Test upload successful');

                // Clean up test file
                const { error: deleteError } = await supabase.storage
                    .from('transaction-documents')
                    .remove(['test-upload.txt']);

                if (!deleteError) {
                    console.log('✅ Test file cleanup successful');
                }
            }
        }

        return true;
    } catch (error) {
        console.error('❌ Error testing Supabase storage:', error);
        return false;
    }
}

/**
 * Test API endpoint availability
 */
async function checkApiEndpoints() {
    console.log('\n🔍 CHECKING API ENDPOINTS');
    console.log('=======================');

    const endpoints = [
        '/api/generate-pdf',
        '/api/supabase-pdf-upload',
        '/api/update-airtable-attachment'
    ];

    let results = {};

    for (const endpoint of endpoints) {
        try {
            console.log(`Testing ${endpoint}...`);

            // We expect these endpoints to return 405 Method Not Allowed for GET requests,
            // which confirms they exist but only accept POST
            const response = await fetch(`${PROD_URL}${endpoint}`);

            console.log(`Response: ${response.status} ${response.statusText}`);

            if (response.status === 405 || response.status === 400) {
                console.log(`✅ Endpoint ${endpoint} exists and is rejecting GET requests as expected`);
                results[endpoint] = true;
            } else if (response.status === 404) {
                console.error(`❌ Endpoint ${endpoint} does not exist (404)`);
                results[endpoint] = false;
            } else {
                console.warn(`⚠️ Endpoint ${endpoint} returned unexpected status ${response.status}`);
                results[endpoint] = 'warning';
            }

            // Try to read response body
            try {
                const text = await response.text();
                console.log(`Response body: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
            } catch (bodyError) {
                console.log('Could not read response body');
            }
        } catch (error) {
            console.error(`❌ Error testing ${endpoint}:`, error.message);
            results[endpoint] = false;
        }
    }

    // Show summary
    console.log('\nAPI Endpoints Summary:');
    for (const [endpoint, result] of Object.entries(results)) {
        console.log(`${result === true ? '✅' : result === 'warning' ? '⚠️' : '❌'} ${endpoint}`);
    }

    return results;
}

/**
 * Test Airtable API connection
 */
async function testAirtableConnection() {
    console.log('\n🔍 CHECKING AIRTABLE CONNECTION');
    console.log('============================');

    // Get Airtable credentials
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        console.error('❌ Missing Airtable credentials in environment');
        return false;
    }

    try {
        // Initialize Airtable
        const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
        const base = airtable.base(AIRTABLE_BASE_ID);

        // Get tables
        console.log('Fetching Airtable tables...');

        // Try to get the "Transactions" table specifically
        try {
            const records = await base('Transactions').select({ maxRecords: 1 }).firstPage();

            if (records && records.length > 0) {
                console.log(`✅ Successfully connected to Airtable and found ${records.length} records in Transactions table`);

                // Check for attachment field
                const record = records[0];
                const fieldNames = Object.keys(record.fields);

                console.log(`First record has fields: ${fieldNames.join(', ')}`);

                // Look for attachment field - usually named 'PDF' or 'Attachments'
                const attachmentFields = fieldNames.filter(field =>
                    field.includes('PDF') ||
                    field.includes('Attachment') ||
                    record.fields[field] && Array.isArray(record.fields[field]) &&
                    record.fields[field][0] && record.fields[field][0].url
                );

                if (attachmentFields.length > 0) {
                    console.log(`✅ Found possible attachment fields: ${attachmentFields.join(', ')}`);
                } else {
                    console.warn('⚠️ Could not identify attachment fields in the Transactions table');
                }

                return true;
            } else {
                console.warn('⚠️ Connected to Airtable but found no records in Transactions table');
                return true;
            }
        } catch (tableError) {
            console.error('❌ Error accessing Transactions table:', tableError.message);

            // Try listing all tables instead
            try {
                const tables = await base.tables();
                console.log(`Connected to Airtable. Available tables: ${tables.map(t => t.name).join(', ')}`);

                if (!tables.find(t => t.name === 'Transactions')) {
                    console.error('❌ No "Transactions" table found in this Airtable base');
                }

                return true;
            } catch (listError) {
                console.error('❌ Error listing tables:', listError.message);
                return false;
            }
        }
    } catch (error) {
        console.error('❌ Error connecting to Airtable:', error.message);
        return false;
    }
}

/**
 * Run diagnostics and print summary
 */
async function runDiagnostics() {
    console.log('🔍 STARTING PRODUCTION CONFIG DIAGNOSTICS');
    console.log('======================================');

    const envResult = await checkEnvironmentVariables();
    const supabaseResult = await testSupabaseBucket();
    const apiResults = await checkApiEndpoints();
    const airtableResult = await testAirtableConnection();

    console.log('\n====================================');
    console.log('🔍 DIAGNOSTICS SUMMARY');
    console.log('------------------------------------');
    console.log(`Environment Variables: ${envResult ? '✅ Configured' : '❌ Issues Found'}`);
    console.log(`Supabase Storage: ${supabaseResult ? '✅ Working' : '❌ Issues Found'}`);
    console.log(`API Endpoints: ${Object.values(apiResults).every(r => r === true) ? '✅ All Available' : '⚠️ Some Issues'}`);
    console.log(`Airtable Connection: ${airtableResult ? '✅ Connected' : '❌ Connection Failed'}`);
    console.log('====================================');

    if (!supabaseResult) {
        console.log('\nSUPABASE FIX RECOMMENDATIONS:');
        console.log('1. Ensure your Supabase project is set up correctly');
        console.log('2. Verify SUPABASE_URL and SUPABASE_ANON_KEY in Vercel environment');
        console.log('3. Create a "transaction-documents" bucket in Supabase storage');
        console.log('4. Make sure the bucket permissions allow uploads');
    }

    if (!airtableResult) {
        console.log('\nAIRTABLE FIX RECOMMENDATIONS:');
        console.log('1. Check AIRTABLE_API_KEY and AIRTABLE_BASE_ID in Vercel environment');
        console.log('2. Ensure your Airtable base has a "Transactions" table');
        console.log('3. Verify that the API key has access to the base');
    }

    const apiIssues = Object.entries(apiResults).filter(([_, result]) => result !== true);
    if (apiIssues.length > 0) {
        console.log('\nAPI ENDPOINT FIX RECOMMENDATIONS:');
        console.log('1. Check that your .vercelignore file is not excluding needed API files');
        console.log('2. Verify that your deployment completed successfully');
        console.log('3. Check Vercel logs for serverless function errors');

        for (const [endpoint, _] of apiIssues) {
            console.log(`4. For ${endpoint}: Check that this file exists and is properly formatted`);
        }
    }
}

// Run the diagnostics
runDiagnostics();