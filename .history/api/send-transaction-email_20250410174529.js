import nodemailer from 'nodemailer';

// Helper function to get environment variables (recommended for Vercel)
const getEnvVar = (name, defaultValue = '') => {
    return process.env[name] || defaultValue;
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { formData, pdfBase64, fileName } = req.body;

        // Basic validation
        if (!formData || !pdfBase64 || !fileName) {
            return res.status(400).json({ message: 'Missing required data: formData, pdfBase64, or fileName' });
        }

        // --- Nodemailer Configuration ---
        const host = getEnvVar('EMAIL_HOST');
        const port = parseInt(getEnvVar('EMAIL_PORT', '587'));
        const secure = getEnvVar('EMAIL_SECURE') === 'true'; // Vercel env vars are strings
        const user = getEnvVar('EMAIL_USER');
        const password = getEnvVar('EMAIL_PASSWORD'); // Use App Password for Gmail
        const from = getEnvVar('EMAIL_FROM', user);
        const recipient = getEnvVar('EMAIL_RECIPIENT'); // Email address to send to

        if (!host || !user || !password || !recipient) {
            console.error('Missing required email environment variables');
            // Don't expose detailed config errors to the client
            return res.status(500).json({ message: 'Email server configuration error.' });
        }

        const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: secure, // true for 465, false for other ports
            auth: {
                user: user,
                pass: password,
            },
            // Optional: Add debugging
            // logger: true,
            // debug: true,
        });

        // --- Prepare Email Content ---
        const mlsNumber = formData.propertyData ? .mlsNumber || 'unknown';
        const address = formData.propertyData ? .address || 'New Property';
        const agentName = formData.agentData ? .name || 'N/A';
        const agentRole = formData.agentData ? .role || 'N/A';
        // Extract other needed fields from formData similarly...
        // const clientNames = ...
        // const specialInstructions = ...
        // etc.

        // Construct a suitable email body (HTML recommended)
        // This should match the structure from your test script or requirements
        const emailSubject = `Transaction Form Submitted: ${address} (MLS# ${mlsNumber})`;
        const emailHtmlBody = `
            <h1>Transaction Submission Received</h1>
            <p><strong>Property:</strong> ${address}</p>
            <p><strong>MLS#:</strong> ${mlsNumber}</p>
            <p><strong>Agent:</strong> ${agentName} (${agentRole})</p>
            <p>Please find the transaction details attached as a PDF.</p>
            <hr>
            <p><em>This is an automated notification.</em></p>
        `; // Customize this HTML as needed

        const mailOptions = {
            from: from,
            to: recipient,
            subject: emailSubject,
            html: emailHtmlBody,
            attachments: [{
                filename: fileName, // e.g., "Transaction_12345_timestamp.pdf"
                content: pdfBase64, // The base64 string
                encoding: 'base64',
                contentType: 'application/pdf'
            }]
        };

        // --- Send Email ---
        console.log(`Attempting to send email to ${recipient} via ${host}...`);
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');

        return res.status(200).json({ message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        // Check for specific Nodemailer errors if needed
        // e.g., error.code === 'EAUTH' for authentication issues
        return res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
}