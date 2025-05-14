/**
 * Supabase and Airtable Integration Test Script
 * 
 * This script tests the Supabase storage and Airtable attachment functionality
 * without requiring the local development server.
 */

// Use ES modules for compatibility with the project's module system
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import Airtable from 'airtable';

// Load environment variables
config();

// Get current directory (ESM replacement for __dirname)
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const TEST_RECORD_ID = process.env.TEST_RECORD_ID || 'rec123'; // Airtable test record ID
const TEST_PDF_PATH = path.join(__dirname, 'test-output.pdf'); // Local PDF file to use for testing

// Supabase connection
function getSupabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.log('SUPABASE_URL defined:', !!supabaseUrl);
        console.log('SUPABASE_ANON_KEY defined:', !!supabaseKey);
        throw new Error('Missing Supabase credentials. Please check your .env file.');
    }

    return createClient(supabaseUrl, supabaseKey);
}

// Airtable connection
function getAirtableBase() {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        console.log('AIRTABLE_API_KEY defined:', !!AIRTABLE_API_KEY);
        console.log('AIRTABLE_BASE_ID defined:', !!AIRTABLE_BASE_ID);
        throw new Error('Missing Airtable credentials. Please check your .env file.');
    }

    const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
    return airtable.base(AIRTABLE_BASE_ID);
}

/**
 * 1. Test Supabase bucket availability
 */
async function testSupabaseBuckets() {
    console.log('\n🧪 TESTING SUPABASE STORAGE BUCKETS');

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

            // Try to create a bucket
            try {
                console.log('Attempting to create bucket "transaction-documents"...');
                const { data: newBucket, error: createError } = await supabase.storage.createBucket('transaction-documents', {
                    public: true
                });

                if (createError) {
                    throw new Error(`Failed to create bucket: ${createError.message}`);
                }

                console.log('✅ Successfully created bucket "transaction-documents"');
            } catch (createError) {
                console.error('❌ Failed to create bucket:', createError.message);
            }

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
            console.log(`⚠️ Target bucket '${targetBucket}' not found, trying to create it...`);

            // Try to create the target bucket
            try {
                const { data: newBucket, error: createError } = await supabase.storage.createBucket(targetBucket, {
                    public: true
                });

                if (createError) {
                    throw new Error(`Failed to create bucket: ${createError.message}`);
                }

                console.log(`✅ Successfully created bucket '${targetBucket}'`);
            } catch (createError) {
                console.error('❌ Failed to create bucket:', createError.message);
            }
        }

        return true;
    } catch (error) {
        console.error('❌ Supabase Storage Error:', error);
        return false;
    }
}

/**
 * 2. Test Supabase PDF upload
 */
async function testSupabaseUpload() {
    console.log('\n🧪 TESTING SUPABASE PDF UPLOAD');

    // Create a simple PDF if none exists
    let pdfBuffer;
    try {
        if (fs.existsSync(TEST_PDF_PATH)) {
            pdfBuffer = fs.readFileSync(TEST_PDF_PATH);
            console.log(`Found test PDF at ${TEST_PDF_PATH}`);
        } else {
            console.log('No test PDF found, creating a simple one...');
            // A very simple PDF (not a properly formatted PDF, just for testing)
            pdfBuffer = Buffer.from('%PDF-1.7\n1 0 obj<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>\nendobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>\nendobj\n4 0 obj<</Length 44>>stream\nBT /F1 12 Tf 100 700 Td (Test PDF Content) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\n0000000192 00000 n\ntrailer <</Size 5/Root 1 0 R>>\nstartxref\n291\n%%EOF');
            fs.writeFileSync(TEST_PDF_PATH, pdfBuffer);
            console.log(`Created test PDF at ${TEST_PDF_PATH}`);
        }
    } catch (fileError) {
        console.error('❌ Error preparing test PDF:', fileError);
        return null;
    }

    try {
        const supabase = getSupabaseClient();

        // Generate a unique filename
        const filename = `test-upload-${Date.now()}.pdf`;
        const filePath = `transaction-pdfs/${filename}`;
        const bucketName = 'transaction-documents';

        // Check if bucket exists
        const { data: bucket, error: bucketError } = await supabase.storage.getBucket(bucketName);

        if (bucketError) {
            // Try to create the bucket
            console.log(`Bucket '${bucketName}' not found, creating it...`);
            const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true
            });

            if (createError) {
                throw new Error(`Failed to create bucket: ${createError.message}`);
            }

            console.log(`Created bucket '${bucketName}'`);
        }

        // Upload the file
        console.log(`Uploading file to Supabase: ${filePath}`);
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (error) {
            throw new Error(`Failed to upload: ${error.message}`);
        }

        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        if (!urlData || !urlData.publicUrl) {
            throw new Error('Failed to get public URL for uploaded PDF');
        }

        console.log('✅ Supabase Upload: Success');
        console.log(`File uploaded to: ${urlData.publicUrl}`);

        return {
            success: true,
            url: urlData.publicUrl,
            filePath,
            bucket: bucketName,
            pdfBuffer
        };
    } catch (error) {
        console.error('❌ Supabase Upload Error:', error);
        return null;
    }
}

/**
 * 3. Test Airtable record exists
 */
async function checkAirtableRecord() {
    console.log('\n🧪 CHECKING AIRTABLE TEST RECORD');

    if (!TEST_RECORD_ID || TEST_RECORD_ID === 'rec123') {
        console.log('⚠️ No valid test record ID provided in .env file');
        return null;
    }

    try {
        const base = getAirtableBase();
        console.log(`Looking up record: ${TEST_RECORD_ID}`);

        return new Promise((resolve, reject) => {
            base('Transactions').find(TEST_RECORD_ID, (err, record) => {
                if (err) {
                    console.error('❌ Failed to find Airtable record:', err);
                    reject(err);
                    return;
                }

                if (!record) {
                    console.log('⚠️ Record not found');
                    resolve(null);
                    return;
                }

                console.log(`✅ Found record: ${record.id}`);
                console.log(`Record name: ${record.get('Name') || 'unnamed'}`);
                resolve(record);
            });
        });
    } catch (error) {
        console.error('❌ Airtable Error:', error);
        return null;
    }
}

/**
 * 4. Test Airtable attachment
 */
async function testAirtableAttachment(uploadResult) {
    console.log('\n🧪 TESTING AIRTABLE ATTACHMENT');

    if (!uploadResult || !uploadResult.success) {
        console.log('⚠️ Skipping Airtable test - no successful upload');
        return false;
    }

    if (!TEST_RECORD_ID || TEST_RECORD_ID === 'rec123') {
        console.log('⚠️ No valid test record ID provided in .env file');
        return false;
    }

    try {
        const base = getAirtableBase();

        // The field ID for PDF attachments
        const pdfFieldId = 'fldhrYdoFwtNfzdFY';

        // Format for Airtable attachment
        const attachmentData = [{
            url: uploadResult.url,
            filename: path.basename(uploadResult.filePath)
        }];

        console.log(`Attaching PDF to Airtable field ${pdfFieldId} for record ${TEST_RECORD_ID}`);

        // Create update object
        const updateData = {
            [pdfFieldId]: attachmentData
        };

        return new Promise((resolve, reject) => {
            base('Transactions').update(TEST_RECORD_ID, updateData, (err, record) => {
                if (err) {
                    console.error('❌ Failed to update Airtable record:', err);
                    reject(err);
                    return;
                }

                console.log('✅ Successfully attached PDF to Airtable record');
                resolve(true);
            });
        });
    } catch (error) {
        console.error('❌ Airtable Attachment Error:', error);
        return false;
    }
}

/**
 * Run all tests
 */
async function runTests() {
    console.log('🔍 STARTING SUPABASE & AIRTABLE INTEGRATION TESTS');
    console.log('================================================');

    try {
        // 1. Test Supabase buckets
        await testSupabaseBuckets();

        // 2. Test Supabase upload
        const uploadResult = await testSupabaseUpload();

        // 3. Check Airtable record
        const record = await checkAirtableRecord();

        // 4. Test Airtable attachment if we have both upload result and record
        if (uploadResult && record) {
            await testAirtableAttachment(uploadResult);
        }

        console.log('\n================================================');
        console.log('🎉 TESTS COMPLETED');
    } catch (error) {
        console.error('\n❌ TEST EXECUTION ERROR:', error);
    }
}

// Run tests
runTests();