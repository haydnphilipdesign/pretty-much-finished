const nodemailer = require('nodemailer');

// Helper function to get environment variables
const getEnvVar = (name, defaultValue = '') => {
    return process.env[name] || defaultValue;
};

// Use module.exports for CommonJS
module.exports = async(req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Extract form data
        const { formData } = req.body;

        // Basic validation
        if (!formData) {
            return res.status(400).json({ message: 'Missing required data: formData' });
        }

        // Get Resend API key for email
        const resendApiKey = getEnvVar('RESEND_API_KEY');
        if (!resendApiKey) {
            console.error('Missing Resend API key');
            return res.status(500).json({ message: 'Email service configuration error.' });
        }

        // Create a Nodemailer transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.resend.com',
            secure: true,
            port: 465,
            auth: {
                user: 'resend',
                pass: resendApiKey,
            },
        });

        // --- Prepare Email Content ---
        const propertyAddress = formData.propertyData ? .address || 'New Property';
        const mlsNumber = formData.propertyData ? .mlsNumber || 'unknown';
        const agentName = formData.agentData ? .name || 'N/A';
        const agentRole = formData.agentData ? .role || 'N/A';

        const recipient = getEnvVar('EMAIL_RECIPIENT', 'debbie@parealestatesupport.com');
        const fromEmail = getEnvVar('EMAIL_FROM', 'transactions@parealestatesupport.com');

        const emailSubject = `Transaction Form Submitted: ${propertyAddress} (MLS# ${mlsNumber})`;

        // Create HTML for form data
        const emailHtmlBody = `
            <h1>Transaction Submission Received</h1>
            <p><strong>Property:</strong> ${propertyAddress}</p>
            <p><strong>MLS#:</strong> ${mlsNumber}</p>
            <p><strong>Agent:</strong> ${agentName} (${agentRole})</p>
            <h2>Form Data:</h2>
            <pre>${JSON.stringify(formData, null, 2)}</pre>
            <hr>
            <p><em>This is an automated notification.</em></p>
        `;

        // Configure email options
        const mailOptions = {
            from: fromEmail,
            to: recipient,
            subject: emailSubject,
            html: emailHtmlBody
        };

        console.log('Sending email...');
        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully with Nodemailer! ID:', info.messageId);

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            emailId: info.messageId
        });

    } catch (error) {
        console.error('Error processing request:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to process request',
            error: error.message
        });
    }
};