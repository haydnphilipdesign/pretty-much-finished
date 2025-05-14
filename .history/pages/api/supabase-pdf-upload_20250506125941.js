// API endpoint for uploading PDFs to Supabase storage
// This endpoint receives PDF data, uploads it to Supabase, and returns the public URL

// Import the Supabase PDF upload utility
const { uploadPdfToSupabase, formatPdfForAirtable } = require('../../api/supabase-pdf-upload');

/**
 * API handler for PDF uploads to Supabase
 */
export default async function handler(req, res) {
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

        console.log(`Processing PDF upload for transaction: ${transactionId || 'unknown'}`);

        // Upload PDF to Supabase
        const result = await uploadPdfToSupabase(pdfData, filename);

        if (!result.success) {
            console.error('Supabase upload failed:', result.error);
            return res.status(500).json({
                success: false,
                error: result.error || 'Failed to upload PDF'
            });
        }

        console.log(`Supabase upload successful. URL: ${result.url}, Bucket: ${result.bucket || 'unknown'}`);

        // If a transaction ID is provided, update the Airtable record with the PDF attachment
        if (transactionId) {
            try {
                // Format for Airtable attachment
                const attachmentData = await formatPdfForAirtable(pdfData, filename);

                if (attachmentData) {
                    // Get Airtable credentials
                    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
                    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;

                    if (AIRTABLE_API_KEY && AIRTABLE_BASE_ID) {
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
                            bucket: result.bucket,
                            airtableUpdated: true
                        });
                    }
                }
            } catch (airtableError) {
                console.error('Error updating Airtable with PDF:', airtableError);
                // Continue with success response since the upload worked
            }
        }

        // Return success with the URL
        return res.status(200).json({
            success: true,
            message: 'PDF uploaded to Supabase successfully',
            url: result.url,
            bucket: result.bucket,
            airtableUpdated: false
        });
    } catch (error) {
        console.error('Error in PDF upload handler:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'An unknown error occurred'
        });
    }
}