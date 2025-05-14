// CommonJS version for Vercel serverless functions
const Airtable = require('airtable');

/**
 * Handler to update an Airtable record with a PDF attachment
 * This is used as a fallback when the PDF generation API can't directly attach to Airtable
 */
module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    // Extract parameters from request body
    const { transactionId, attachment, fieldId } = req.body;
    
    // Validate required fields
    if (!transactionId) {
      return res.status(400).json({ success: false, error: 'Missing transaction ID' });
    }
    
    if (!attachment) {
      return res.status(400).json({ success: false, error: 'Missing attachment data' });
    }
    
    // Log the request
    console.log(`Updating Airtable record ${transactionId} with attachment`);
    console.log('Attachment:', JSON.stringify(attachment));
    
    // Get Airtable credentials
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
    
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.error('Missing Airtable credentials');
      return res.status(500).json({ success: false, error: 'Missing Airtable credentials' });
    }
    
    // Initialize Airtable client
    const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
    const base = airtable.base(AIRTABLE_BASE_ID);
    
    // Default field ID for PDF attachments if not provided
    const pdfFieldId = fieldId || 'fldhrYdoFwtNfzdFY';
    
    // Create update object
    const updateData = {
      [pdfFieldId]: attachment
    };
    
    console.log('Sending attachment data to Airtable:', JSON.stringify(updateData));
    
    try {
      // Update the record
      const record = await base('Transactions').update(transactionId, updateData);
      console.log('Successfully updated Airtable record with attachment');
      
      return res.status(200).json({
        success: true,
        message: 'Successfully attached PDF to Airtable record',
        recordId: record.id
      });
    } catch (airtableError) {
      console.error('Error updating Airtable record:', airtableError);
      return res.status(500).json({
        success: false,
        error: `Airtable API error: ${airtableError.message || 'Unknown error'}`
      });
    }
  } catch (error) {
    console.error('Error in update-airtable-attachment handler:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error occurred'
    });
  }
};