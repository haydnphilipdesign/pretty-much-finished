// Import libraries
const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const Airtable = require('airtable');

// Helper to get environment variables
const getEnvVar = (name, defaultValue = '') => {
  const value = process.env[name];
  if (!value && defaultValue === '') {
    console.warn(`Warning: Environment variable ${name} is not set and no default provided`);
  }
  return value || defaultValue;
};

/**
 * Generate a PDF from an HTML template
 */
async function generatePdfFromTemplate(templatePath, templateData, outputPath) {
  try {
    // Read the template file
    let templateHtml = await fs.readFile(templatePath, 'utf-8');
    console.log('Template loaded successfully, length:', templateHtml.length);

    // Replace placeholders in the template
    Object.entries(templateData).forEach(([key, value]) => {
      // Skip null or undefined values
      if (value === null || value === undefined) return;
      
      const strValue = String(value);
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      templateHtml = templateHtml.replace(placeholder, strValue);
      
      // Also handle Handlebars-style conditionals
      const conditionalPlaceholder = new RegExp(`{{#if ${key}}}(.*?){{/if}}`, 'g');
      templateHtml = templateHtml.replace(conditionalPlaceholder, strValue ? '$1' : '');
    });

    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Set content to the populated HTML
      await page.setContent(templateHtml, { waitUntil: 'networkidle0' });
      
      // Generate PDF
      console.log('Generating PDF to path:', outputPath);
      await page.pdf({
        path: outputPath,
        format: 'letter',
        printBackground: true,
        margin: { top: '0.25in', right: '0.25in', bottom: '0.25in', left: '0.25in' },
      });
      
      // Verify the PDF was created
      const fileStats = await fs.stat(outputPath);
      console.log('PDF generated successfully. File size:', fileStats.size, 'bytes');
      
      return outputPath;
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Update Airtable record with PDF attachment
 */
async function updateAirtableWithPdf(transactionId, pdfUrl, pdfFilename) {
  if (!transactionId) {
    console.log('No transaction ID provided, skipping Airtable update');
    return null;
  }
  
  try {
    // Get Airtable credentials from environment variables
    const apiKey = process.env.VITE_AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY;
    const baseId = process.env.VITE_AIRTABLE_BASE_ID || process.env.AIRTABLE_BASE_ID;
    
    if (!apiKey || !baseId) {
      throw new Error('Missing Airtable API credentials');
    }
    
    // Initialize Airtable client
    const airtable = new Airtable({ apiKey });
    const base = airtable.base(baseId);
    
    // Update the transaction record with the PDF attachment
    const updatedRecord = await base('Transactions').update(transactionId, {
      // Field ID for PDF attachment from the implementation guide
      'fldhrYdoFwtNfzdFY': [
        {
          url: pdfUrl,
          filename: pdfFilename
        }
      ]
    });
    
    console.log(`Updated Airtable record ${transactionId} with PDF attachment`);
    return updatedRecord;
  } catch (error) {
    console.error('Error updating Airtable record with PDF:', error);
    return null;
  }
}
async function sendEmailWithPdf(pdfPath, templateData, emailTo, emailSubject, emailBody) {
  try {
    console.log('Preparing to send email to:', emailTo);
    
    // Configure email transport
    const emailConfig = {
      host: getEnvVar('EMAIL_HOST', 'smtp.gmail.com'),
      port: parseInt(getEnvVar('EMAIL_PORT', '587')),
      secure: getEnvVar('EMAIL_SECURE', 'false') === 'true',
      auth: {
        user: getEnvVar('EMAIL_USER'),
        pass: getEnvVar('EMAIL_PASSWORD')
      }
    };
    
    console.log('Email configuration:', {
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: { user: emailConfig.auth.user ? '(set)' : '(not set)' }
    });
    
    const transporter = nodemailer.createTransport(emailConfig);
    
    // Verify connection configuration
    await transporter.verify();
    console.log('Email transport verified successfully');
    
    // Get the filename from the path
    const filename = path.basename(pdfPath);
    
    // Send email with PDF attachment
    const mailOptions = {
      from: getEnvVar('EMAIL_FROM', getEnvVar('EMAIL_USER')),
      to: emailTo,
      subject: emailSubject || 'Transaction Form Submission',
      html: emailBody || '<p>Please find attached the transaction form submission.</p>',
      attachments: [{
        filename: filename,
        path: pdfPath
      }]
    };
    
    console.log('Sending email with attachment:', filename);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully. Message ID:', info.messageId);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { sent: false, error: error.message };
  }
}

/**
 * API handler for generating PDFs
 */
module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const {
      templatePath,
      templateData,
      filename,
      sendEmail = true,
      emailTo = 'debbie@parealestatesupport.com',
      emailSubject,
      emailBody,
      transactionId // Added transaction ID for Airtable update
    } = req.body;

    // Validate required parameters
    if (!templatePath || !templateData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: templatePath and templateData'
      });
    }

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (mkdirError) {
      console.error('Error creating output directory:', mkdirError);
    }

    // Generate unique filename if not provided
    const outputFilename = filename || `transaction_${Date.now()}.pdf`;
    const outputPath = path.join(outputDir, outputFilename);
    const publicPath = `/generated-pdfs/${outputFilename}`;

    // Get the full path to the template
    const fullTemplatePath = path.join(process.cwd(), 'public', templatePath);
    console.log('Template path:', fullTemplatePath);

    // Generate the PDF
    await generatePdfFromTemplate(fullTemplatePath, templateData, outputPath);

    // Update Airtable with PDF attachment if transaction ID is provided
    let airtableUpdateResult = null;
    if (transactionId) {
      console.log('Updating Airtable record with PDF attachment');
      // Use the server's public URL + path for Airtable
      const serverBaseUrl = process.env.SERVER_BASE_URL || `http://${req.headers.host || 'localhost:3001'}`;
      const pdfUrl = `${serverBaseUrl}${publicPath}`;
      airtableUpdateResult = await updateAirtableWithPdf(transactionId, pdfUrl, outputFilename);
    }

    // Send email if requested
    let emailResult = { sent: false, error: null };
    if (sendEmail) {
      emailResult = await sendEmailWithPdf(
        outputPath,
        templateData,
        emailTo,
        emailSubject,
        emailBody
      );
    }

    return res.status(200).json({
      success: true,
      message: 'PDF generated successfully',
      pdfPath: publicPath,
      emailSent: emailResult.sent,
      airtableUpdated: !!airtableUpdateResult,
      error: emailResult.error
    });
  } catch (error) {
    console.error('Error in generatePdf API:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  }
};
