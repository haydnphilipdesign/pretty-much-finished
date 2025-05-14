import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Helper function for getting environment variables with defaults
const getEnvVar = (name, defaultValue = '') => {
    return process.env[name] || defaultValue;
};

/**
 * Send email API endpoint
 * This handles email sending requests from the client
 */
export const sendEmail = async(req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { to, subject, body, attachments = [] } = req.body;

        // Validate required fields
        if (!to || !subject || !body) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: to, subject, and body are required',
            });
        }

        console.log('Email request received:', { to, subject, attachmentsCount: attachments.length });

        // Create transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: getEnvVar('EMAIL_HOST', 'smtp.gmail.com'),
            port: parseInt(getEnvVar('EMAIL_PORT', '587')),
            secure: getEnvVar('EMAIL_SECURE', 'false') === 'true',
            auth: {
                user: getEnvVar('EMAIL_USER'),
                pass: getEnvVar('EMAIL_PASSWORD')
            }
        });

        console.log('Attempting to send email with config:', {
            host: getEnvVar('EMAIL_HOST'),
            port: getEnvVar('EMAIL_PORT'),
            secure: getEnvVar('EMAIL_SECURE') === 'true',
            user: getEnvVar('EMAIL_USER'),
            // Password is excluded for security reasons
        });

        // Send the email
        const info = await transporter.sendMail({
            from: getEnvVar('EMAIL_FROM', 'noreply@parealestatesupport.com'),
            to,
            subject,
            html: body,
            attachments
        });

        console.log('Email sent successfully:', info.messageId);

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId
        });
    } catch (error) {
        console.error('Error sending email:', error);

        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to send email',
            error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
        });
    }
};

export default sendEmail;