/**
 * Supabase Bucket Check Script
 * 
 * This script verifies your Supabase storage configuration by:
 * 1. Checking if credentials are configured
 * 2. Listing all available buckets
 * 3. Verifying if the required transaction-documents bucket exists
 * 4. Attempting to create the bucket if missing (optional)
 * 
 * Run with: node check-supabase-buckets.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Command line arguments
const args = process.argv.slice(2);
const shouldCreateBucket = args.includes('--create');

async function checkBuckets() {
    console.log('🔍 CHECKING SUPABASE STORAGE CONFIGURATION');
    console.log('=========================================');

    // Get Supabase credentials
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    // Validate credentials
    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials in .env file');
        console.log('\nPlease add the following to your .env file:');
        console.log('SUPABASE_URL=https://your-project-id.supabase.co');
        console.log('SUPABASE_ANON_KEY=your-anon-key');
        return;
    }

    // Create Supabase client
    console.log('Connecting to Supabase...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // List all buckets
        console.log('Fetching storage buckets...');
        const { data: buckets, error } = await supabase.storage.listBuckets();

        if (error) {
            console.error('❌ Error listing buckets:', error.message);

            if (error.message.includes('JWT')) {
                console.log('\nYour Supabase credentials appear to be invalid.');
                console.log('Please check your SUPABASE_URL and SUPABASE_ANON_KEY in the .env file.');
            }

            return;
        }

        // Check if any buckets exist
        if (!buckets || buckets.length === 0) {
            console.log('⚠️ No storage buckets found in your Supabase project');

            if (shouldCreateBucket) {
                await createBucket(supabase, 'transaction-documents');
            } else {
                console.log('\nYou need to create at least one bucket in your Supabase project.');
                console.log('1. Go to your Supabase dashboard');
                console.log('2. Navigate to Storage');
                console.log('3. Click "New Bucket"');
                console.log('4. Name it "transaction-documents"');
                console.log('5. Set appropriate permissions (public read, authenticated write recommended)');
                console.log('\nOr run this script with --create to attempt to create it automatically:');
                console.log('  node check-supabase-buckets.js --create');
            }

            return;
        }

        // List all available buckets
        console.log(`\n✅ Found ${buckets.length} storage ${buckets.length === 1 ? 'bucket' : 'buckets'}:`);
        buckets.forEach(bucket => {
            console.log(` - ${bucket.name} ${bucket.public ? '(public)' : '(private)'}`);
        });

        // Check for our target bucket
        const targetBucket = 'transaction-documents';
        const bucketExists = buckets.some(bucket => bucket.name === targetBucket);

        if (bucketExists) {
            console.log(`\n✅ Target bucket '${targetBucket}' exists`);
        } else {
            console.log(`\n⚠️ Target bucket '${targetBucket}' not found`);

            if (shouldCreateBucket) {
                await createBucket(supabase, targetBucket);
            } else {
                console.log('\nYou should create this bucket for optimal performance:');
                console.log('1. Go to your Supabase dashboard');
                console.log('2. Navigate to Storage');
                console.log('3. Click "New Bucket"');
                console.log('4. Name it "transaction-documents"');
                console.log('5. Set appropriate permissions');
                console.log('\nOr run this script with --create to attempt to create it automatically:');
                console.log('  node check-supabase-buckets.js --create');

                // Show fallback information
                console.log('\nThe application will attempt to use a fallback bucket:');
                console.log(`Possible fallback bucket: ${buckets[0].name}`);
            }
        }

        console.log('\n=========================================');
        console.log('🔍 SUPABASE STORAGE CHECK COMPLETE');

    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

// Create a bucket if it doesn't exist
async function createBucket(supabase, bucketName) {
    console.log(`\nAttempting to create bucket '${bucketName}'...`);

    try {
        const { data, error } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 5242880, // 5MB limit
        });

        if (error) {
            console.error(`❌ Failed to create bucket: ${error.message}`);

            if (error.message.includes('already exists')) {
                console.log('The bucket already exists but may not be visible to your current user.');
            } else if (error.message.includes('permission')) {
                console.log('You may not have permission to create buckets.');
                console.log('Please check your Supabase user role and policies.');
            }

            return false;
        }

        console.log(`✅ Successfully created bucket '${bucketName}'`);
        return true;
    } catch (error) {
        console.error('❌ Unexpected error during bucket creation:', error.message);
        return false;
    }
}

// Run the check
checkBuckets();