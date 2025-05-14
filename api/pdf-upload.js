// PDF upload handler for Airtable attachments
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Airtable = require('airtable');

/**
 * Handles PDF upload and attachment to Airtable
 * This function creates a publicly accessible URL for the PDF attachment
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
    
    // Create a unique filename
    const uniqueId = uuidv4();
    const uniqueFilename = `${uniqueId}-${filename}`;
    
    // Convert base64 to buffer
    let pdfBuffer;
    try {
      pdfBuffer = Buffer.from(pdfData, 'base64');
      console.log(`Converted PDF data to buffer, size: ${pdfBuffer.length} bytes`);
    } catch (error) {
      console.error('Error converting PDF data to buffer:', error);
      return res.status(400).json({ success: false, error: 'Invalid PDF data' });
    }
    
    // Save the PDF to the public directory
    const publicDir = path.join(process.cwd(), 'public', 'generated-pdfs');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const filePath = path.join(publicDir, uniqueFilename);
    
    // Write the file
    fs.writeFileSync(filePath, pdfBuffer);
    console.log(`Saved PDF to: ${filePath}`);
    
    // Generate public URL for the file
    // In Vercel, we use the VERCEL_URL environment variable to construct public URLs
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.PUBLIC_URL || 'https://www.parealestatesupport.com');
    
    const pdfUrl = `${baseUrl}/generated-pdfs/${uniqueFilename}`;
    console.log(`Generated public URL for PDF: ${pdfUrl}`);
    
    // Update Airtable with the PDF URL
    const result = await attachPdfToAirtable(transactionId, pdfUrl, filename);
    
    return res.status(200).json({
      success: true,
      message: result ? 'PDF uploaded and attached to Airtable' : 'PDF uploaded but Airtable update failed',
      url: pdfUrl,
      airtableUpdated: result
    });
  } catch (error) {
    console.error('Error in PDF upload handler:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unknown error occurred'
    });
  }
};

/**
 * Attaches a PDF URL to an Airtable record
 * @param {string} transactionId - Airtable record ID
 * @param {string} pdfUrl - Publicly accessible URL to the PDF
 * @param {string} filename - PDF filename
 * @returns {Promise<boolean>} - Success status
 */
async function attachPdfToAirtable(transactionId, pdfUrl, filename) {
  if (!transactionId) {
    console.log('No transaction ID provided, skipping Airtable update');
    return false;
  }
  
  try {
    console.log(`Attaching PDF to Airtable record: ${transactionId}`);
    console.log(`Using PDF URL: ${pdfUrl}`);
    
    // Get Airtable credentials
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
    
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.error('Missing Airtable credentials');
      return false;
    }
    
    // Configure Airtable
    const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
    const base = airtable.base(AIRTABLE_BASE_ID);
    
    // The field ID for PDF attachments
    const pdfFieldId = 'fldhrYdoFwtNfzdFY';
    
    // Create attachment object using URL method
    // This is crucial - Airtable needs a URL, not a file
    const attachmentObject = [
      {
        url: pdfUrl,
        filename: filename
      }
    ];
    
    // Create update object
    const updateData = {
      [pdfFieldId]: attachmentObject
    };
    
    console.log('Sending attachment data to Airtable:', JSON.stringify(updateData));
    
    // Update the record
    await base('Transactions').update(transactionId, updateData);
    console.log('Successfully attached PDF to Airtable record');
    
    return true;
  } catch (error) {
    console.error('Error attaching PDF to Airtable:', error);
    return false;
  }
}