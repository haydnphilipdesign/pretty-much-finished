import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda'; // Correct import for Vercel

// Helper function to get environment variables (recommended for Vercel)
const getEnvVar = (name, defaultValue = '') => {
    return process.env[name] || defaultValue;
};

// Function to replace placeholders in HTML content
// IMPORTANT: Assumes placeholders are like {{fieldName}}
const populateTemplate = (htmlContent, data) => {
    let populatedHtml = htmlContent;
    for (const key in data) {
        // Simple replacement - might need adjustment based on actual placeholder format
        const regex = new RegExp(`{{\s*${key}\s*}}`, 'g');
        populatedHtml = populatedHtml.replace(regex, data[key] || ''); // Replace with value or empty string
    }
    // Replace any remaining placeholders with empty string
    populatedHtml = populatedHtml.replace(/{{\s*.*?\s*}}/g, '');
    return populatedHtml;
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    let browser = null; // Define browser outside try block for finally

    try {
        // ONLY expect formData now
        const { formData } = req.body;

        // Basic validation
        if (!formData) {
            return res.status(400).json({ message: 'Missing required data: formData' });
        }
        if (!formData.agentData ? .role) {
            return res.status(400).json({ message: 'Missing agent role in formData' });
        }

        // --- Determine Template --- // TODO: Check file existence?
        const agentRole = formData.agentData.role;
        let templateFileName;
        if (agentRole === 'LISTING AGENT') {
            templateFileName = 'Seller.html';
        } else if (agentRole === 'BUYERS AGENT') {
            templateFileName = 'Buyer.html';
        } else if (agentRole === 'DUAL AGENT') {
            templateFileName = 'DualAgent.html';
        } else {
            return res.status(400).json({ message: `Invalid agent role: ${agentRole}` });
        }
        // Construct the full path relative to the project root
        const templatePath = path.resolve(process.cwd(), 'public', 'templates', templateFileName);
        console.log(`Using template: ${templatePath}`);

        // --- Read and Populate Template --- // TODO: Error handling for file read
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        // Prepare data for template population (flatten or select necessary fields)
        const templateData = {
            // Simple example - you'll need to map ALL required fields from formData
            mlsNumber: formData.propertyData ? .mlsNumber || 'N/A',
            address: formData.propertyData ? .address || 'N/A',
            agentName: formData.agentData ? .name || 'N/A',
            agentRole: formData.agentData ? .role || 'N/A',
            submissionDate: new Date().toLocaleString(),
            // ... Add ALL OTHER fields expected by your HTML templates
            // Example: client1Name: formData.clients?.[0]?.name || 'N/A',
            //          client1Email: formData.clients?.[0]?.email || 'N/A',
        };
        const populatedHtml = populateTemplate(templateHtml, templateData);

        // --- Generate PDF using Puppeteer --- 
        console.log('Launching Puppeteer...');
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless, // Use chromium setting
            ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage();
        console.log('Setting page content...');
        await page.setContent(populatedHtml, { waitUntil: 'networkidle0' }); // Wait for network activity to settle
        console.log('Generating PDF buffer...');
        const pdfBuffer = await page.pdf({ format: 'Letter', printBackground: true });
        console.log('PDF buffer generated successfully.');

        // --- Nodemailer Configuration (remains the same) ---
        const host = getEnvVar('EMAIL_HOST');
        const port = parseInt(getEnvVar('EMAIL_PORT', '587'));
        const secure = getEnvVar('EMAIL_SECURE') === 'true';
        const user = getEnvVar('EMAIL_USER');
        const password = getEnvVar('EMAIL_PASSWORD');
        const from = getEnvVar('EMAIL_FROM', user);
        const recipient = getEnvVar('EMAIL_RECIPIENT');

        if (!host || !user || !password || !recipient) {
            console.error('Missing required email environment variables');
            return res.status(500).json({ message: 'Email server configuration error.' });
        }

        const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass: password } });

        // --- Prepare Email Content (remains similar) ---
        const mlsNumber = formData.propertyData ? .mlsNumber || 'unknown';
        const address = formData.propertyData ? .address || 'New Property';

        const emailSubject = `Transaction Form Submitted: ${address} (MLS# ${mlsNumber})`;
        const emailHtmlBody = `
            <h1>Transaction Submission Received</h1>
            <p><strong>Property:</strong> ${address}</p>
            <p><strong>MLS#:</strong> ${mlsNumber}</p>
            <p><strong>Agent:</strong> ${templateData.agentName} (${agentRole})</p>
            <p>Please find the transaction details attached as a PDF.</p>
            <hr>
            <p><em>This is an automated notification.</em></p>
        `;

        // Create filename for attachment
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `Transaction_${mlsNumber}_${timestamp}.pdf`;

        const mailOptions = {
            from: from,
            to: recipient,
            subject: emailSubject,
            html: emailHtmlBody,
            attachments: [{
                filename: fileName,
                content: pdfBuffer, // Use the generated buffer directly
                contentType: 'application/pdf'
            }]
        };

        // --- Send Email ---
        console.log(`Attempting to send email to ${recipient} via ${host}...`);
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');

        return res.status(200).json({ message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ message: 'Failed to process request', error: error.message });
    } finally {
        if (browser !== null) {
            console.log('Closing browser...');
            await browser.close();
        }
    }
}