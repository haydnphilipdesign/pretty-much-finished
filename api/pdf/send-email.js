// CommonJS version for Vercel serverless functions
const nodemailer = require('nodemailer');

/**
 * API handler for sending emails with PDF attachments
 */
module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Get data from request body
    const { formData, pdfBase64 } = req.body;

    if (!formData || !pdfBase64) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required data: formData or pdfBase64' 
      });
    }

    console.log('Processing email with PDF attachment');
    
    // Create address slug for filename
    const addressSlug = formData.propertyData?.address 
      ? formData.propertyData.address
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_+/g, '_')
          .substring(0, 30) 
      : 'unknown_address';
    
    // Get formatted date
    const formattedDate = new Date().toISOString().split('T')[0];
    
    // Generate a descriptive filename
    const pdfFilename = `Transaction_${addressSlug}_${formattedDate}.pdf`;
    
    // Determine client type based on agent role
    let clientType = 'Client';
    let clientName = 'N/A';
    
    if (formData.agentData?.role === 'listingAgent' || formData.agentData?.role === 'LISTING AGENT') {
      clientType = 'Seller';
      // Try to find a seller client
      const seller = formData.clients?.find(c => 
        c.type?.toLowerCase() === 'seller' || c.type?.toLowerCase() === 'sellers');
      if (seller) {
        clientName = seller.name;
      }
    } else if (formData.agentData?.role === 'buyersAgent' || formData.agentData?.role === 'BUYERS AGENT') {
      clientType = 'Buyer';
      // Try to find a buyer client
      const buyer = formData.clients?.find(c => 
        c.type?.toLowerCase() === 'buyer' || c.type?.toLowerCase() === 'buyers');
      if (buyer) {
        clientName = buyer.name;
      }
    } else if (formData.clients?.[0]) {
      // Default to first client if role doesn't indicate type
      clientName = formData.clients[0].name;
    }
    
    // Get agent name from multiple possible sources
    const agentName = formData.agentData?.name || 
                    formData.agentData?.agentName || 
                    formData.signatureData?.agentName ||
                    formData.signatureData?.signature || 
                    'Unknown Agent';
    
    // Create transporter with SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    console.log('Email configuration:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE,
      user: process.env.EMAIL_USER ? '(set)' : '(not set)'
    });
    
    // Convert base64 PDF back to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    
    // Prepare email content with more details
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_RECIPIENT || 'debbie@parealestatesupport.com',
      subject: `New Transaction - ${formData.propertyData?.address || 'Property'} - ${agentName}`,
      text: `
A new transaction form has been submitted with the following details:

PROPERTY INFORMATION
-------------------
Address: ${formData.propertyData?.address || 'Not provided'}
MLS Number: ${formData.propertyData?.mlsNumber || 'Not provided'}
Sale Price: $${formData.propertyData?.salePrice || 'Not provided'}
Closing Date: ${formData.propertyData?.closingDate || 'Not provided'}
Property Status: ${formData.propertyData?.status || 'Not provided'}

AGENT INFORMATION
----------------
Name: ${agentName}
Role: ${formData.agentData?.role || 'Not provided'}

CLIENT INFORMATION
----------------
${clientType}: ${clientName || 'Not provided'}

TRANSACTION DETAILS
-----------------
Total Commission: ${formData.commissionData?.totalCommission || formData.commissionData?.totalCommissionPercentage || 'Not provided'}%
${formData.additionalInfo?.urgentIssues ? `
URGENT ISSUES: ${formData.additionalInfo.urgentIssues}
` : ''}

The completed transaction form is attached to this email.
This email was automatically generated from a transaction form submission.
      `,
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer
        }
      ]
    };
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Email with PDF sent successfully'
    });
  } catch (error) {
    console.error('Error sending email with PDF:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'An unknown error occurred sending the email' 
    });
  }
};
