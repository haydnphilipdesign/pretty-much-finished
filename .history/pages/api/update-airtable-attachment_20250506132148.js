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

        console.log(`Received PDF data type: ${typeof pdfData}, length: ${(typeof pdfData === 'string') ? pdfData.length : 'not a string'}`);

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
            return res.status(500).json({ success: false, error: 'Missing Airtable credentials' });
        }

        // Configure Airtable
        const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
        const base = airtable.base(AIRTABLE_BASE_ID);

        // Convert base64 data if it includes a data URL prefix
        let base64Data = pdfData;
        if (pdfData.startsWith('data:application/pdf;base64,')) {
            base64Data = pdfData.split('base64,')[1];
            console.log('Extracted base64 data from data URL format');
        }

        // Format for Airtable attachment
        const attachmentData = [{
            url: base64Data.startsWith('data:application/pdf;base64,') ?
                base64Data :
                `data:application/pdf;base64,${base64Data}`,
            filename: filename || 'transaction.pdf'
        }];

        console.log(`Attaching PDF to Airtable field ${fieldId} for record ${recordId}`);
        console.log(`Attachment data: ${JSON.stringify({ 
            filename: attachmentData[0].filename, 
            urlLength: attachmentData[0].url.length 
        })}`);

        // Create update object
        const updateData = {
            [fieldId]: attachmentData
        };

        // Update the record
        const updatedRecord = await base('Transactions').update(recordId, updateData);

        if (!updatedRecord) {
            throw new Error('Failed to update Airtable record');
        }

        console.log(`Successfully attached PDF to record ${recordId}`);

        // Return success
        return res.status(200).json({
            success: true,
            message: 'PDF attached to Airtable successfully',
            recordId: recordId
        });
    } catch (error) {
        console.error('Error in Airtable attachment handler:', error);
        return res.status(500).json({
            success: false,
            error: `Failed to update Airtable: ${error.message}`
        });
    }
}