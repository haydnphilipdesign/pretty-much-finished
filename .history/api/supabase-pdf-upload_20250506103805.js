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
 * Uploads a PDF to Supabase storage and returns a public URL
 * @param {Buffer|string} pdfData - PDF data as Buffer or base64 string
 * @param {string} filename - Original filename
 * @returns {Promise<Object>} Object containing the public URL and success status
 */
async function uploadPdfToSupabase(pdfData, filename = 'transaction.pdf') {
  try {
    console.log(`Preparing to upload PDF: ${filename}`);
    
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
    
    // Initialize Supabase client
    const supabase = getSupabaseClient();
    
    // Upload file to Supabase storage
    console.log(`Uploading PDF to Supabase storage: ${filePath}`);
    const { data, error } = await supabase.storage
      .from('transaction-documents') // Bucket name
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
      .from('transaction-documents')
      .getPublicUrl(filePath);
    
    if (!urlData || !urlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded PDF');
    }
    
    console.log(`Successfully uploaded PDF to Supabase. Public URL: ${urlData.publicUrl}`);
    
    return {
      success: true,
      url: urlData.publicUrl,
      filename: uniqueFilename,
      path: filePath
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
    return [
      {
        url: result.url,
        filename
      }
    ];
  } catch (error) {
    console.error('Error formatting PDF for Airtable:', error);
    return null;
  }
}

/**
 * API handler for PDF uploads
 */
module.exports = async (req, res) => {
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
    const attachmentData = [
      {
        url: result.url,
        filename
      }
    ];
    
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