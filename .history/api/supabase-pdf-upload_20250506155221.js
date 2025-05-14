// Supabase PDF upload handler for Airtable attachments
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

/**
 * Initialize Supabase client
 * @returns {Object} Supabase client instance
 */
function getSupabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase credentials');
        console.log('SUPABASE_URL defined:', !!supabaseUrl);
        console.log('SUPABASE_ANON_KEY defined:', !!supabaseKey);
        throw new Error('Missing Supabase credentials');
    }

    return createClient(supabaseUrl, supabaseKey);
}

/**
 * Check if bucket exists, create if not, use a fallback if creation fails
 * @param {Object} supabase - Supabase client
 * @param {string} bucketName - Bucket to check
 * @returns {Promise<string>} Name of bucket to use
 */
async function ensureBucket(supabase, bucketName) {
    try {
        // Try to get the bucket
        const { data: bucket, error: getBucketError } = await supabase.storage.getBucket(bucketName);

        if (getBucketError) {
            console.log(`Bucket '${bucketName}' not found, trying to create...`);

            // Try to create the bucket
            const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true // Make sure files will be publicly accessible
            });

            if (createError) {
                console.error(`Failed to create bucket '${bucketName}':`, createError.message);
                // Check if any other buckets exist
                const { data: buckets } = await supabase.storage.listBuckets();

                if (buckets && buckets.length > 0) {
                    const fallbackBucket = buckets[0].name;
                    console.log(`Using fallback bucket: ${fallbackBucket}`);
                    return fallbackBucket;
                } else {
                    throw new Error('No storage buckets available and could not create one');
                }
            }

            console.log(`Created bucket: ${bucketName}`);
            return bucketName;
        }

        return bucketName;
    } catch (error) {
        console.error('Error checking/creating bucket:', error);
        throw error;
    }
}

/**
 * Handle Supabase PDF upload
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 */
module.exports = async(req, res) => {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        console.log('Processing Supabase PDF upload request...');

        // Request body validation
        const { pdfData, filename = 'transaction.pdf', transactionId } = req.body;

        if (!pdfData) {
            console.error('Missing PDF data in request');
            return res.status(400).json({ success: false, error: 'Missing PDF data' });
        }

        console.log(`Received PDF data type: ${typeof pdfData}`);
        console.log(`PDF data length: ${typeof pdfData === 'string' ? pdfData.length : 'not a string'}`);
        console.log(`PDF data starts with: ${typeof pdfData === 'string' ? pdfData.substring(0, 30) + '...' : 'not a string'}`);

        if (typeof pdfData !== 'string' || pdfData.length < 100) {
            console.error('Invalid PDF data format or too short to be valid');
            return res.status(400).json({ success: false, error: 'Invalid PDF data format' });
        }

        // Get Supabase client
        const supabase = getSupabaseClient();

        // Determine bucket to use with fallback options
        const primaryBucketName = 'transaction-documents';
        const bucketToUse = await ensureBucket(supabase, primaryBucketName);

        // Convert base64 data if it includes a data URL prefix
        let base64Data = pdfData;
        if (pdfData.startsWith('data:application/pdf;base64,')) {
            base64Data = pdfData.split('base64,')[1];
            console.log('Extracted base64 data from data URL format');
        }

        // Generate a unique filename if not provided
        const uniqueFilename = filename || `transaction-${transactionId || uuidv4()}.pdf`;
        const filePath = `transaction-pdfs/${uniqueFilename}`;

        // Convert base64 string to Buffer
        const fileBuffer = Buffer.from(base64Data, 'base64');

        // Upload file to Supabase
        console.log(`Uploading PDF to bucket ${bucketToUse}, path: ${filePath}`);
        const { data, error } = await supabase.storage
            .from(bucketToUse)
            .upload(filePath, fileBuffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return res.status(500).json({
                success: false,
                error: `Storage upload failed: ${error.message}`,
                bucket: bucketToUse
            });
        }

        // Get public URL for the file
        const { data: urlData } = supabase.storage
            .from(bucketToUse)
            .getPublicUrl(filePath);

        if (!urlData || !urlData.publicUrl) {
            console.error('Failed to get public URL');
            return res.status(500).json({
                success: false,
                error: 'Failed to get public URL for uploaded file'
            });
        }

        console.log(`PDF uploaded successfully. URL: ${urlData.publicUrl}`);

        // If transaction ID was provided, try to update Airtable directly
        let airtableUpdated = false;
        if (transactionId) {
            try {
                console.log(`Updating Airtable record ${transactionId} with PDF URL...`);
                // Call the API endpoint for updating Airtable
                const airtableUpdateUrl = process.env.NEXT_PUBLIC_HOST_URL ?
                    `${process.env.NEXT_PUBLIC_HOST_URL}/api/update-airtable-attachment` :
                    '/api/update-airtable-attachment';

                const airtableResponse = await fetch(airtableUpdateUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        pdfData: urlData.publicUrl,
                        filename: uniqueFilename,
                        transactionId
                    })
                });

                if (airtableResponse.ok) {
                    const airtableResult = await airtableResponse.json();
                    airtableUpdated = airtableResult.success;
                    console.log('Airtable update successful');
                } else {
                    console.error('Airtable update failed:', await airtableResponse.text());
                }
            } catch (airtableError) {
                console.error('Error updating Airtable:', airtableError);
            }
        }

        // Return response
        return res.status(200).json({
            success: true,
            url: urlData.publicUrl,
            bucket: bucketToUse,
            filePath,
            airtableUpdated
        });
    } catch (error) {
        console.error('Supabase PDF upload error:', error);
        return res.status(500).json({
            success: false,
            error: `Storage bucket error: ${error.message || 'Unknown error'}`
        });
    }
};