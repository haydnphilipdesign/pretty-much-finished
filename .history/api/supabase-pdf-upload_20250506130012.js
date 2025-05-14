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
        throw new Error('Missing Supabase credentials');
    }

    return createClient(supabaseUrl, supabaseKey);
}

/**
 * Check if bucket exists, use a fallback if not
 * @param {Object} supabase - Supabase client
 * @param {string} bucketName - Bucket to check
 * @returns {Promise<string>} Name of bucket to use
 */
async function ensureBucket(supabase, bucketName) {
    try {
        // Check if the bucket exists
        const { data, error } = await supabase.storage.getBucket(bucketName);

        if (error) {
            console.log(`Bucket "${bucketName}" not found, trying to use default bucket...`);

            // Try to get a list of all buckets
            const { data: buckets, error: listError } = await supabase.storage.listBuckets();

            if (listError || !buckets || buckets.length === 0) {
                throw new Error('No storage buckets available');
            }

            // Use the first available bucket
            console.log(`Using fallback bucket: ${buckets[0].name}`);
            return buckets[0].name;
        }

        return bucketName;
    } catch (error) {
        console.error('Error checking bucket:', error);
        throw new Error(`Storage bucket error: ${error.message}`);
    }
}

/**
 * Uploads a PDF to Supabase storage and returns a public URL
 * @param {Buffer|string} pdfData - PDF data as Buffer or base64 string
 * @param {string} filename - Original filename
 * @returns {Promise<Object>} Object containing the public URL and success status
 */
async function uploadPdfToSupabase(pdfData, filename = 'transaction.pdf') {
    try {
        console.log(`Preparing to upload PDF: ${filename}`);

        // Initialize Supabase client first to catch any credential issues early
        let supabase;
        try {
            supabase = getSupabaseClient();
            console.log('Supabase client initialized successfully');
        } catch (supabaseInitError) {
            console.error('Failed to initialize Supabase client:', supabaseInitError);
            // Log environment variables (without showing full values for security)
            const supabaseUrl = process.env.SUPABASE_URL;
            const supabaseKey = process.env.SUPABASE_ANON_KEY;
            console.log(`Supabase URL defined: ${!!supabaseUrl}`);
            console.log(`Supabase Key defined: ${!!supabaseKey}`);

            throw new Error(`Supabase client initialization failed: ${supabaseInitError.message}`);
        }

        // Convert base64 to buffer if needed
        let pdfBuffer = pdfData;
        if (typeof pdfData === 'string') {
            try {
                pdfBuffer = Buffer.from(pdfData, 'base64');
                console.log(`Converted PDF data to buffer, size: ${pdfBuffer.length} bytes`);
            } catch (error) {
                console.error('Error converting PDF data to buffer:', error);
                throw new Error('Invalid PDF data format');
            }
        }

        // Generate a unique filename to prevent collisions
        const uniqueId = uuidv4();
        const uniqueFilename = `${uniqueId}-${filename}`;
        const filePath = `transaction-pdfs/${uniqueFilename}`;

        // Get a valid bucket to use (desired or fallback)
        let bucketToUse;
        try {
            const desiredBucket = 'transaction-documents';
            bucketToUse = await ensureBucket(supabase, desiredBucket);
            console.log(`Selected bucket for upload: ${bucketToUse}`);
        } catch (bucketError) {
            console.error('Bucket selection failed:', bucketError);

            // Log available buckets for debugging
            try {
                const { data: buckets } = await supabase.storage.listBuckets();
                if (buckets && buckets.length > 0) {
                    console.log('Available buckets:');
                    buckets.forEach(bucket => console.log(` - ${bucket.name}`));
                } else {
                    console.log('No buckets available in Supabase project');
                }
            } catch (listError) {
                console.error('Error listing buckets:', listError);
            }

            throw bucketError;
        }

        // Upload file to Supabase storage
        console.log(`Uploading PDF to Supabase storage bucket "${bucketToUse}": ${filePath}`);
        const { data, error } = await supabase.storage
            .from(bucketToUse)
            .upload(filePath, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (error) {
            console.error('Error uploading PDF to Supabase:', error);
            throw new Error(`Failed to upload PDF: ${error.message}`);
        }

        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
            .from(bucketToUse)
            .getPublicUrl(filePath);

        if (!urlData || !urlData.publicUrl) {
            throw new Error('Failed to get public URL for uploaded PDF');
        }

        console.log(`Successfully uploaded PDF to Supabase. Public URL: ${urlData.publicUrl}`);

        return {
            success: true,
            url: urlData.publicUrl,
            filename: uniqueFilename,
            path: filePath,
            bucket: bucketToUse
        };
    } catch (error) {
        console.error('Error in uploadPdfToSupabase:', error);
        return {
            success: false,
            error: error.message || 'An unknown error occurred'
        };
    }
}

/**
 * Formats PDF data for Airtable attachment
 * @param {string} pdfData - Base64 encoded PDF data
 * @param {string} filename - Original filename
 * @returns {Promise<Array|null>} Airtable attachment format or null on error
 */
async function formatPdfForAirtable(pdfData, filename = 'transaction.pdf') {
    try {
        console.log(`Formatting PDF for Airtable attachment: ${filename}`);

        // Upload to Supabase and get public URL
        const result = await uploadPdfToSupabase(pdfData, filename);

        if (!result.success || !result.url) {
            throw new Error('Failed to get URL for PDF');
        }

        // Return properly formatted Airtable attachment
        return [{
            url: result.url,
            filename
        }];
    } catch (error) {
        console.error('Error formatting PDF for Airtable:', error);
        return null;
    }
}

/**
 * API handler for PDF uploads
 */
module.exports = async(req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        // Get the PDF data and transaction ID from the request
        const { pdfData, transactionId, filename = 'transaction.pdf' } = req.body;

        if (!pdfData) {
            return res.status(400).json({ success: false, error: 'No PDF data provided' });
        }

        if (!transactionId) {
            return res.status(400).json({ success: false, error: 'No transaction ID provided' });
        }

        console.log(`Processing PDF upload for transaction: ${transactionId}`);

        // Upload PDF to Supabase and get formatted Airtable attachment
        const result = await uploadPdfToSupabase(pdfData, filename);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: result.error || 'Failed to upload PDF'
            });
        }

        // Format for Airtable attachment
        const attachmentData = [{
            url: result.url,
            filename
        }];

        // Get Airtable credentials
        const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
        const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;

        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            console.error('Missing Airtable credentials');
            // Still return success with the URL since the upload worked
            return res.status(200).json({
                success: true,
                message: 'PDF uploaded to Supabase but Airtable credentials missing',
                url: result.url,
                airtableUpdated: false
            });
        }

        // Configure Airtable
        const Airtable = require('airtable');
        const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
        const base = airtable.base(AIRTABLE_BASE_ID);

        // The field ID for PDF attachments
        const pdfFieldId = 'fldhrYdoFwtNfzdFY';

        // Create update object
        const updateData = {
            [pdfFieldId]: attachmentData
        };

        console.log('Sending attachment data to Airtable:', JSON.stringify(updateData));

        // Update the record
        await base('Transactions').update(transactionId, updateData);
        console.log('Successfully attached PDF to Airtable record');

        return res.status(200).json({
            success: true,
            message: 'PDF uploaded and attached to Airtable',
            url: result.url,
            airtableUpdated: true
        });
    } catch (error) {
        console.error('Error in PDF upload handler:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'An unknown error occurred'
        });
    }
};

// Export utility functions for use in other parts of the application
module.exports.uploadPdfToSupabase = uploadPdfToSupabase;
module.exports.formatPdfForAirtable = formatPdfForAirtable;