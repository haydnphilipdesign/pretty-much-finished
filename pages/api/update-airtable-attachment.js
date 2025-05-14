// API endpoint for attaching PDFs to Airtable records
// This avoids the "Buffer is not defined" error in the browser

// Import required modules
const Airtable = require('airtable');

/**
 * API handler for attaching PDF data to Airtable records
 */
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        console.log('Processing Airtable attachment request...');

        // Get the PDF data, transaction ID, and field ID from the request
        const { pdfData, filename, transactionId, fieldId = 'fldhrYdoFwtNfzdFY' } = req.body;

        // Enhanced validation and logging
        if (!pdfData) {
            console.error('Missing PDF data in request payload');
            return res.status(400).json({ success: false, error: 'Missing attachment data' });
        }

        // Log information about the received data for debugging
        console.log(`Received PDF data type: ${typeof pdfData}`);
        console.log(`PDF data length: ${typeof pdfData === 'string' ? pdfData.length : 'not a string'}`);
        console.log(`PDF data starts with: ${typeof pdfData === 'string' ? pdfData.substring(0, 50) + '...' : 'not a string'}`);

        if (typeof pdfData !== 'string' || pdfData.length < 100) {
            console.error('Invalid PDF data format or too short to be valid');
            return res.status(400).json({ success: false, error: 'Invalid PDF data format' });
        }

        if (!transactionId && !req.body.recordId) {
            return res.status(400).json({ success: false, error: 'No transaction ID or record ID provided' });
        }

        const recordId = transactionId || req.body.recordId;
        console.log(`Processing Airtable attachment for record: ${recordId}`);

        // Get Airtable credentials
        const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
        const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;

        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            console.error('Missing Airtable credentials');
            console.log(`AIRTABLE_API_KEY defined: ${!!AIRTABLE_API_KEY}`);
            console.log(`AIRTABLE_BASE_ID defined: ${!!AIRTABLE_BASE_ID}`);
            return res.status(500).json({ success: false, error: 'Missing Airtable credentials' });
        }

        // Configure Airtable
        try {
            const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
            const base = airtable.base(AIRTABLE_BASE_ID);

            // Ensure the PDF data is in the correct format for Airtable
            // Airtable can accept either a data URL or an external URL
            let attachmentUrl;

            if (pdfData.startsWith('http')) {
                // Already an external URL
                attachmentUrl = pdfData;
                console.log('Using provided URL for attachment');
            } else if (pdfData.startsWith('data:application/pdf;base64,')) {
                // Already has correct data URL format
                attachmentUrl = pdfData;
                console.log('Using existing data URL for attachment');
            } else {
                // Assume it's a base64 string without prefix
                attachmentUrl = `data:application/pdf;base64,${pdfData}`;
                console.log('Added data URL prefix to PDF data');
            }

            // Format for Airtable attachment
            const attachmentData = [{
                url: attachmentUrl,
                filename: filename || 'transaction.pdf'
            }];

            console.log(`Attaching PDF to Airtable field ${fieldId} for record ${recordId}`);
            console.log(`Attachment data: ${JSON.stringify({ 
                filename: attachmentData[0].filename, 
                urlType: typeof attachmentData[0].url,
                urlLength: typeof attachmentData[0].url === 'string' ? attachmentData[0].url.length : 'unknown',
                urlStart: typeof attachmentData[0].url === 'string' ? attachmentData[0].url.substring(0, 30) + '...' : 'unknown'
            })}`);

            // Create update object
            const updateData = {
                [fieldId]: attachmentData
            };

            // Update the record with retry logic
            let updatedRecord = null;
            let retryCount = 0;
            const maxRetries = 3;

            while (retryCount < maxRetries && !updatedRecord) {
                try {
                    if (retryCount > 0) {
                        console.log(`Retry ${retryCount} of ${maxRetries}...`);
                        await new Promise(r => setTimeout(r, 1000)); // Wait 1 second between retries
                    }

                    updatedRecord = await base('Transactions').update(recordId, updateData);

                    if (!updatedRecord) {
                        throw new Error('No record returned from update operation');
                    }

                    console.log(`Successfully attached PDF to record ${recordId}`);
                } catch (updateError) {
                    console.error(`Error on update attempt ${retryCount + 1}:`, updateError);
                    retryCount++;

                    if (retryCount >= maxRetries) {
                        throw updateError; // Rethrow after max retries
                    }
                }
            }

            // Return success
            return res.status(200).json({
                success: true,
                message: 'PDF attached to Airtable successfully',
                recordId: recordId,
                attachmentField: fieldId
            });
        } catch (airtableError) {
            console.error('Error with Airtable operations:', airtableError);
            return res.status(500).json({
                success: false,
                error: `Airtable operation failed: ${airtableError.message || 'Unknown Airtable error'}`
            });
        }
    } catch (error) {
        console.error('Error in Airtable attachment handler:', error);
        return res.status(500).json({
            success: false,
            error: `Failed to update Airtable: ${error.message || 'Unknown error'}`
        });
    }
}