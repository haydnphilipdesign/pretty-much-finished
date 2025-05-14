/**
 * Supabase Buckets Check Tool
 * 
 * This script verifies the Supabase storage bucket configuration.
 */

// Import required modules
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Check if Supabase credentials are available
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Supabase credentials are missing. Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set.');
    process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration
const BUCKET_NAME = 'transaction-documents';
const TEST_FILE_PATH = path.join(process.cwd(), 'test-output.pdf');
const TEST_FILE_NAME = 'check-bucket-test.pdf';

/**
 * Create a bucket if it doesn't exist
 */
async function createBucketIfNotExists(bucketName) {
    console.log(`\n🔍 Checking for bucket: ${bucketName}`);

    try {
        // Check if bucket exists
        const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();

        if (getBucketsError) {
            throw new Error(`Failed to list buckets: ${getBucketsError.message}`);
        }

        // Check if our target bucket exists
        const bucketExists = buckets.some(bucket => bucket.name === bucketName);

        if (bucketExists) {
            console.log(`✅ Bucket '${bucketName}' already exists.`);
        } else {
            console.log(`⚠️ Bucket '${bucketName}' not found. Creating it now...`);

            // Create the bucket
            const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
                public: false, // Set to true if files should be publicly accessible
                fileSizeLimit: 52428800, // 50MB
            });

            if (createBucketError) {
                throw new Error(`Failed to create bucket: ${createBucketError.message}`);
            }

            console.log(`✅ Successfully created bucket '${bucketName}'.`);
        }

        return true;
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        return false;
    }
}

/**
 * Test uploading a file to the bucket
 */
async function testFileUpload(bucketName, filePath, fileName) {
    console.log(`\n🔍 Testing file upload to bucket: ${bucketName}`);

    // Check if test file exists
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ Test file not found at ${filePath}. Creating a dummy test file...`);

        // Create a dummy test file if it doesn't exist
        fs.writeFileSync(filePath, 'This is a test PDF file for Supabase bucket testing.');
        console.log(`✅ Created dummy test file at ${filePath}`);
    }

    try {
        // Read the file
        const fileBuffer = fs.readFileSync(filePath);

        // Upload the file to Supabase
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, fileBuffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }

        console.log(`✅ Successfully uploaded test file to '${bucketName}' bucket.`);

        // Get file URL
        const { data: urlData } = await supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        console.log(`🔗 File URL: ${urlData.publicUrl}`);

        return true;
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        return false;
    }
}

/**
 * Test downloading a file from the bucket
 */
async function testFileDownload(bucketName, fileName) {
    console.log(`\n🔍 Testing file download from bucket: ${bucketName}`);

    try {
        // Get file URL
        const { data: urlData } = await supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        // Download the file
        const { data, error } = await supabase.storage
            .from(bucketName)
            .download(fileName);

        if (error) {
            throw new Error(`Failed to download file: ${error.message}`);
        }

        console.log(`✅ Successfully downloaded test file from '${bucketName}' bucket.`);

        return true;
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        return false;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('🔍 CHECKING SUPABASE STORAGE CONFIGURATION');
    console.log('=========================================');
    console.log(`Supabase URL: ${supabaseUrl}`);

    // Check for bucket and create it if it doesn't exist
    const bucketCreated = await createBucketIfNotExists(BUCKET_NAME);

    if (!bucketCreated) {
        console.error('❌ Failed to verify or create bucket. Exiting.');
        process.exit(1);
    }

    // Test file upload
    const uploadSuccess = await testFileUpload(BUCKET_NAME, TEST_FILE_PATH, TEST_FILE_NAME);

    if (!uploadSuccess) {
        console.error('❌ Failed to upload test file. Exiting.');
        process.exit(1);
    }

    // Test file download
    const downloadSuccess = await testFileDownload(BUCKET_NAME, TEST_FILE_NAME);

    if (!downloadSuccess) {
        console.error('❌ Failed to download test file. Exiting.');
        process.exit(1);
    }

    console.log('\n✅ ALL TESTS PASSED! Supabase storage is properly configured.');
}

// Run the main function
main().catch(error => {
    console.error(`❌ Unhandled error: ${error.message}`);
    process.exit(1);
});