// Server API for PDF generation - Adapted for Vercel Serverless Functions
import path from 'path';
import fs from 'fs/promises';
import puppeteer from 'puppeteer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define output directory for PDFs - adjust for Vercel
const OUTPUT_DIR = path.join('/tmp', 'generated-pdfs');

// Helper to get environment variables
const getEnvVar = (name, defaultValue = '') => {
    return process.env[name] || defaultValue;
};

// Ensure the output directory exists
async function ensureOutputDirectory() {
    try {
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        return true;
    } catch (error) {
        console.error('Error creating output directory:', error);
        return false;
    }
}

// Configure email for sending PDFs
const configureEmailTransport = () => {
    return nodemailer.createTransport({
        host: getEnvVar('EMAIL_HOST', 'smtp.gmail.com'),
        port: parseInt(getEnvVar('EMAIL_PORT', '587')),
        secure: getEnvVar('EMAIL_SECURE') === 'true',
        auth: {
            user: getEnvVar('EMAIL_USER'),
            pass: getEnvVar('EMAIL_PASSWORD')
        }
    });
};

// Generate PDF from HTML template
async function generatePdfFromHtml(
    templatePath,
    outputPath,
    replacements = {}
) {
    try {
        // Read the template file
        let templateContent = await fs.readFile(templatePath, 'utf-8');

        // Replace placeholders
        for (const [key, value] of Object.entries(replacements)) {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            templateContent = templateContent.replace(regex, value || '');
        }

        // Launch a browser
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            // Create a new page
            const page = await browser.newPage();

            // Set content
            await page.setContent(templateContent, { waitUntil: 'networkidle0' });

            // Generate PDF
            await page.pdf({
                path: outputPath,
                format: 'letter',
                printBackground: true,
                margin: { top: '0.2in', right: '0.2in', bottom: '0.2in', left: '0.2in' },
            });

            return outputPath;
        } finally {
            await browser.close();
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}

// Define the serverless function handler for Vercel
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tableId, recordId, agentRole = 'DUAL AGENT', data } = req.body;

        // Ensure output directory exists
        if (!await ensureOutputDirectory()) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create output directory'
            });
        }

        // Determine which template to use based on agent role
        let templateName;
        switch (agentRole.toUpperCase()) {
            case 'BUYERS AGENT':
                templateName = 'Buyer.html';
                break;
            case 'LISTING AGENT':
                templateName = 'Seller.html';
                break;
            default:
                templateName = 'DualAgent.html';
                break;
        }

        // Set up paths - use /tmp for Vercel functions
        // Note: In Vercel, templates must be in /public to be accessible
        const templatePath = path.join(process.cwd(), 'public', 'templates', templateName);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `Cover_Sheet_${timestamp}.pdf`;
        const outputPath = path.join(OUTPUT_DIR, filename);

        // Generate the PDF
        const pdfPath = await generatePdfFromHtml(templatePath, outputPath, data);

        // Send email if requested
        if (req.body.sendEmail) {
            try {
                const transporter = configureEmailTransport();
                await transporter.sendMail({
                    from: getEnvVar('EMAIL_FROM', 'noreply@parealestatesupport.com'),
                    to: getEnvVar('EMAIL_RECIPIENT', 'debbie@parealestatesupport.com'),
                    subject: `Cover Sheet for ${data?.propertyAddress || 'Property'}`,
                    html: `
            <h2>Cover Sheet Generated</h2>
            <p>Please find attached the cover sheet for property ${data?.propertyAddress || 'Unknown'}.</p>
            <p>Agent: ${data?.agentName || 'Unknown'}</p>
            <p>Role: ${agentRole}</p>
          `,
                    attachments: [{
                        filename: path.basename(pdfPath),
                        path: pdfPath
                    }]
                });

                console.log('Email sent successfully');
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                // Continue even if email fails
            }
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Cover sheet generated successfully',
            filename,
            // Note: In Vercel, files in /tmp are not publicly accessible
            // The email will be sent but the file won't be directly downloadable
            emailSent: req.body.sendEmail || false
        });
    } catch (error) {
        console.error('Error in generateCoverSheet:', error);
        return res.status(500).json({
            success: false,
            message: 'Error generating cover sheet',
            error: error instanceof Error ? error.message : String(error),
        });
    }
}