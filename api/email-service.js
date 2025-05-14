/**
 * Email service with multiple provider support
 * This service handles email sending with fallbacks between different providers
 */
const nodemailer = require('nodemailer');

/**
 * Send an email using the primary email service (nodemailer)
 * @param {Object} options Email options (to, subject, html, attachments)
 * @returns {Promise<boolean>} Success status
 */
async function sendEmailWithNodemailer(options) {
  try {
    console.log('Sending email with nodemailer...');
    
    // Create email transporter with environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      // Add timeout to prevent hanging connections
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 15000
    });
    
    // Log transporter configuration (without credentials)
    console.log('Nodemailer configuration:', {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      user: process.env.EMAIL_USER ? '(provided)' : '(missing)',
      pass: process.env.EMAIL_PASSWORD ? '(provided)' : '(missing)'
    });
    
    // Verify transporter connection
    try {
      await transporter.verify();
      console.log('Nodemailer connection verified successfully');
    } catch (verifyError) {
      console.error('Nodemailer connection verification failed:', verifyError);
      throw new Error(`Failed to connect to email server: ${verifyError.message}`);
    }
    
    // Email options
    const mailOptions = {
      from: options.from || process.env.EMAIL_FROM || 'noreply@parealestatesupport.com',
      to: options.to || process.env.EMAIL_RECIPIENT || 'debbie@parealestatesupport.com',
      subject: options.subject || 'New Transaction Form',
      html: options.html || '<p>Transaction form submission</p>',
      attachments: options.attachments || []
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return true;
  } catch (error) {
    console.error('Error sending email with nodemailer:', error);
    throw error;
  }
}

/**
 * Send an email using Resend API (fallback)
 * @param {Object} options Email options (to, subject, html, attachments)
 * @returns {Promise<boolean>} Success status
 */
async function sendEmailWithResend(options) {
  try {
    console.log('Sending email with Resend API...');
    
    // Check if Resend API key is available
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('Resend API key not found in environment variables');
      throw new Error('Resend API key is missing');
    }
    
    // Import node-fetch for API requests
    const fetch = require('node-fetch');
    
    // Prepare attachments if any
    const attachments = [];
    if (options.attachments && options.attachments.length > 0) {
      for (const attachment of options.attachments) {
        // Convert Buffer to base64
        const content = attachment.content.toString('base64');
        attachments.push({
          filename: attachment.filename,
          content: content
        });
      }
    }
    
    // Prepare request body
    const requestBody = {
      from: options.from || process.env.EMAIL_FROM || 'transactions@parealestatesupport.com',
      to: options.to || process.env.EMAIL_RECIPIENT || 'debbie@parealestatesupport.com',
      subject: options.subject || 'New Transaction Form',
      html: options.html || '<p>Transaction form submission</p>',
      attachments: attachments.map(att => ({
        filename: att.filename,
        content: att.content
      }))
    };
    
    // Send request to Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    // Check response
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', response.status, errorText);
      throw new Error(`Resend API error: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Resend email sent successfully:', responseData.id);
    
    return true;
  } catch (error) {
    console.error('Error sending email with Resend:', error);
    throw error;
  }
}

/**
 * Send an email with fallback mechanism
 * @param {Object} options Email options (to, subject, html, attachments)
 * @returns {Promise<{success: boolean, provider: string, error: string | null}>} Result with provider used
 */
async function sendEmail(options) {
  // Try with primary email service first
  try {
    await sendEmailWithNodemailer(options);
    return {
      success: true,
      provider: 'nodemailer',
      error: null
    };
  } catch (nodemailerError) {
    console.warn('Primary email service failed, trying fallback...', nodemailerError.message);
    
    // Try with Resend API as fallback
    try {
      await sendEmailWithResend(options);
      return {
        success: true,
        provider: 'resend',
        error: null
      };
    } catch (resendError) {
      console.error('All email services failed', resendError.message);
      return {
        success: false,
        provider: 'none',
        error: `Primary error: ${nodemailerError.message}. Fallback error: ${resendError.message}`
      };
    }
  }
}

module.exports = {
  sendEmail,
  sendEmailWithNodemailer,
  sendEmailWithResend
};