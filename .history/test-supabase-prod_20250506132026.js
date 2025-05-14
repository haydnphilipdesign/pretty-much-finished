/**
 * Production Supabase Test Script
 * This script tests Supabase connectivity and storage bucket access
 * specifically for the production environment
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Load environment variables
config();

// Production URL for API testing
const PROD_URL = 'https://pa-real-estate-support-services-6burgzg3f.vercel.app';

async function testSupabaseDirectly() {
    console.log('🔍 TESTING DIRECT SUPABASE CONNECTION');
    console.log('=====================================');

    // Get Supabase credentials
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials in .env file');
        console.log('Please create a .env file with SUPABASE_URL and SUPABASE_ANON_KEY');
        return false;
    }

    console.log(`Using Supabase URL: ${supabaseUrl.substring(0, 15)}...`);
    console.log(`Supabase Key is defined: ${supabaseKey ? 'Yes' : 'No'}`);

    try {
        // Create Supabase client
        console.log('Connecting to Supabase...');
        const supabase = createClient(supabaseUrl, supabaseKey);

        // List all buckets
        console.log('Fetching storage buckets...');
        const { data: buckets, error } = await supabase.storage.listBuckets();

        if (error) {
            console.error('❌ Error listing buckets:', error.message);
            return false;
        }

        if (!buckets || buckets.length === 0) {
            console.error('❌ No storage buckets found!');
            return false;
        }

        console.log(`✅ Found ${buckets.length} storage buckets:`);
        buckets.forEach(bucket => {
            console.log(` - ${bucket.name} ${bucket.public ? '(public)' : '(private)'}`);
        });

        // Test file upload to each bucket
        for (const bucket of buckets) {
            await testBucketUpload(supabase, bucket.name);
        }

        return true;
    } catch (error) {
        console.error('❌ Unexpected error during Supabase test:', error);
        return false;
    }
}

async function testBucketUpload(supabase, bucketName) {
    console.log(`\nTesting upload to bucket: ${bucketName}`);

    try {
        // Create a simple test file (just text for simplicity)
        const testContent = 'Test file content ' + new Date().toISOString();
        const testBuffer = Buffer.from(testContent);
        const testPath = `test-${Date.now()}.txt`;

        // Try uploading to the bucket
        console.log(`Uploading test file to ${bucketName}/${testPath}...`);
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(testPath, testBuffer, {
                contentType: 'text/plain',
                upsert: true
            });

        if (error) {
            console.error(`❌ Upload failed for bucket ${bucketName}:`, error.message);
            return false;
        }

        console.log(`✅ Successfully uploaded test file to ${bucketName}`);

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(testPath);

        if (!urlData || !urlData.publicUrl) {
            console.error(`❌ Failed to get public URL for uploaded file in ${bucketName}`);
            return false;
        }

        console.log(`✅ Got public URL: ${urlData.publicUrl}`);

        // Clean up - remove test file
        try {
            await supabase.storage.from(bucketName).remove([testPath]);
            console.log(`✅ Test file removed from ${bucketName}`);
        } catch (cleanupError) {
            console.warn(`⚠️ Could not remove test file: ${cleanupError.message}`);
        }

        return true;
    } catch (error) {
        console.error(`❌ Error testing bucket ${bucketName}:`, error);
        return false;
    }
}

async function testSupabaseViaAPI() {
    console.log('\n🔍 TESTING SUPABASE VIA PRODUCTION API');
    console.log('=====================================');

    try {
        // Generate tiny test PDF as base64 (this is just a minimal valid PDF)
        const minimalPdf = "JVBERi0xLjcKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1szIDAgUl0+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3ggWzAgMCAzIDNdL1Jlc291cmNlcyA0IDAgUi9Db250ZW50cyA1IDAgUi9QYXJlbnQgMiAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9Gb250PDwvRjEgNiAwIFI+Pj4+CmVuZG9iago1IDAgb2JqCjw8L0xlbmd0aCAzNj4+CnN0cmVhbQpCVCAvRjEgMTIgVGYgMTAgMTAgVGQgKFRlc3QpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKNiAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExMSAwMDAwMCBuIAowMDAwMDAwMjEwIDAwMDAwIG4gCjAwMDAwMDAyNDcgMDAwMDAgbiAKMDAwMDAwMDMzMiAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNy9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjM5OQolJUVPRgo=";

        console.log('Sending test PDF to production API...');
        console.log(`API endpoint: ${PROD_URL}/api/supabase-pdf-upload`);

        const response = await fetch(`${PROD_URL}/api/supabase-pdf-upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pdfData: minimalPdf,
                filename: 'test-pdf-prod.pdf',
                // We're not including a transaction ID since we don't need Airtable attachment
            })
        });

        console.log(`API response status: ${response.status} ${response.statusText}`);

        const result = await response.text();
        console.log('API response body:', result);

        try {
            // Try to parse the JSON response
            const jsonResult = JSON.parse(result);
            if (jsonResult.success) {
                console.log('✅ Supabase API upload succeeded!');
                console.log(`File URL: ${jsonResult.url}`);
                console.log(`Bucket used: ${jsonResult.bucket || 'unknown'}`);
                return true;
            } else {
                console.error('❌ Supabase API upload failed:', jsonResult.error);
                return false;
            }
        } catch (parseError) {
            console.error('❌ Could not parse API response as JSON:', parseError);
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing Supabase via API:', error);
        return false;
    }
}

async function runTests() {
    console.log('🔍 SUPABASE PRODUCTION TROUBLESHOOTING');
    console.log('=====================================');

    // First test direct Supabase connection
    const directResult = await testSupabaseDirectly();

    // Then test through the API
    const apiResult = await testSupabaseViaAPI();

    console.log('\n=====================================');
    console.log('🔍 TEST RESULTS SUMMARY');
    console.log(`Direct Supabase connection: ${directResult ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`API-based Supabase upload: ${apiResult ? '✅ SUCCESS' : '❌ FAILED'}`);

    if (!directResult && !apiResult) {
        console.log('\nTROUBLESHOOTING RECOMMENDATIONS:');
        console.log('1. Check that Supabase URL and key are correct in both local .env and Vercel env vars');
        console.log('2. Verify that Supabase storage is enabled and has at least one bucket');
        console.log('3. Ensure Supabase storage policies allow uploads from your application');
        console.log('4. Check Vercel logs for more detailed errors from the serverless functions');
    }
}

// Run the tests
runTests();