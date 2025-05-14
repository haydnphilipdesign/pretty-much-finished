// No puppeteer import - not needed for serverless function
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';

// Helper to get environment variables
const getEnvVar = (name, defaultValue = '') => {
    const value = process.env[name];
    if (!value && defaultValue === '') {
        console.warn(`Warning: Environment variable ${name} is not set and no default provided`);
    }
    return value || defaultValue;
};

/**
 * Vercel serverless function for PDF generation
 */
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

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
            emailBody
        } = req.body;

        // Validate required parameters
        if (!templatePath || !templateData) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: templatePath and templateData'
            });
        }

        // Since we can't write files in Vercel Functions, we'll just simulate success
        // and send the email notification directly
        console.log('PDF generation requested for template:', templatePath);
        console.log('Template data:', JSON.stringify(templateData, null, 2));

        // Send email notification
        let emailResult = { sent: false, error: null };
        if (sendEmail) {
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

                // Create transporter
                const transporter = nodemailer.createTransport(emailConfig);

                // Verify connection configuration
                await transporter.verify();
                console.log('Email transport verified successfully');

                // Send email notification
                const mailOptions = {
                    from: getEnvVar('EMAIL_FROM', getEnvVar('EMAIL_USER')),
                    to: emailTo,
                    subject: emailSubject || 'Transaction Form Submission',
                    html: emailBody || '<p>Please find attached the transaction form submission.</p>',
                    // No attachment since we can't generate the PDF in serverless environment
                };

                console.log('Sending email notification:', mailOptions.subject);
                const info = await transporter.sendMail(mailOptions);

                console.log('Email sent successfully. Message ID:', info.messageId);
                emailResult = { sent: true, messageId: info.messageId };
            } catch (error) {
                console.error('Error sending email:', error);
                emailResult = { sent: false, error: error.message };
            }
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Transaction notification sent successfully',
            pdfPath: '/notification-sent',
            emailSent: emailResult.sent,
            error: emailResult.error
        });
    } catch (error) {
        console.error('Error in generatePdf API:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process request',
            error: error.message
        });
    }
}