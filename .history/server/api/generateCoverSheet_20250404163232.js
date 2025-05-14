// Server API for PDF generation - Adapted for Vercel Serverless Functions
import path from 'path';
import fs from 'fs/promises';
import puppeteer from 'puppeteer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

// Define output directory for PDFs - adjust for Vercel
const OUTPUT_DIR = path.join('/tmp', 'generated-pdfs');

// Helper to get environment variables
const getEnvVar = (name, defaultValue = '') => {
    return process.env[name] || defaultValue;
};

// Airtable API key and base ID from environment
const AIRTABLE_API_KEY = getEnvVar('AIRTABLE_API_KEY');
const AIRTABLE_BASE_ID = getEnvVar('AIRTABLE_BASE_ID');

// Airtable field mappings
const fieldMap = {
    // Property Section
    mlsNumber: { id: 'fld6O2FgIXQU5G27o', template: 'mlsNumber' },
    address: { id: 'fldypnfnHhplWYcCW', template: 'propertyAddress' },
    propertyStatus: { id: 'fldV2eLxz6w0TpLFU', template: 'propertyStatus' },
    salePrice: { id: 'fldhHjBZJISmnP8SK', template: 'salePrice' },
    winterized: { id: 'fldExdgBDgdB1i9jy', template: 'isWinterized' },

    // Agent Section
    agentRole: { id: 'fldOVyoxz38rWwAFy', template: 'agentRole' },
    agentName: { id: 'fldFD4xHD0vxnSOHJ', template: 'agentName' },

    // Commission Section
    totalCommission: { id: 'fldE8INzEorBtx2uN', template: 'totalCommission' },
    listingAgentPercentage: { id: 'flduuQQT7o6XAGlRe', template: 'listingAgentPercentage' },
    buyersAgentPercentage: { id: 'fld5KRrToAAt5kOLd', template: 'buyersAgentPercentage' },
    brokerFee: { id: 'flddRltdGj05Clzpa', template: 'brokerFee' },
    sellersAssist: { id: 'fldTvXx96Na0zRh6W', template: 'sellersAssist' },

    // Special instructions
    specialInstructions: { id: 'fldDWN8jU4kdCffzu', template: 'specialInstructions' },
    urgentIssues: { id: 'fldgW16aPdFMdspO6', template: 'urgentIssues' },
    additionalInfo: { id: 'fld30htJ7euVerCLW', template: 'additionalNotes' },
};

// Fetch Airtable record 
async function fetchAirtableRecord(tableId, recordId) {
    console.log(`Fetching Airtable record: ${tableId}/${recordId}`);
    try {
        // Make request to Airtable API
        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}/${recordId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error ? .message || `Failed to fetch Airtable record: ${response.status}`);
        }

        const data = await response.json();
        console.log('Successfully fetched Airtable record');
        return data;
    } catch (error) {
        console.error('Error fetching Airtable record:', error);
        throw error;
    }
}

// Format data from Airtable for the template
function formatDataForTemplate(record) {
    const templateData = {};

    // Map each field from the record to the template
    for (const [key, mapping] of Object.entries(fieldMap)) {
        // Check if the record has this field
        if (record.fields[mapping.id] !== undefined) {
            // Format the value appropriately
            let value = record.fields[mapping.id];

            // Format currency values
            if (key === 'salePrice' || key === 'brokerFee' || key === 'sellersAssist') {
                if (typeof value === 'number') {
                    value = value.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2
                    });
                }
            }

            // Format percentages
            if (key === 'totalCommission' || key === 'listingAgentPercentage' || key === 'buyersAgentPercentage') {
                if (typeof value === 'number') {
                    value = `${value}%`;
                }
            }

            // Add to template data
            templateData[mapping.template] = value;
        }
    }

    // Add date
    templateData.currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return templateData;
}

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
        const { tableId, recordId, agentRole = 'DUAL AGENT', data: providedData, sendEmail = true } = req.body;

        // Validate required parameters
        if (!tableId || !recordId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: tableId and recordId'
            });
        }

        // Ensure output directory exists
        if (!await ensureOutputDirectory()) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create output directory'
            });
        }

        // Use provided data or fetch from Airtable
        let templateData;
        if (providedData && Object.keys(providedData).length > 0) {
            console.log('Using provided data for cover sheet');
            templateData = providedData;
        } else {
            console.log('Fetching data from Airtable for cover sheet');
            // Fetch the record from Airtable
            const record = await fetchAirtableRecord(tableId, recordId);

            // Format the data for the template
            templateData = formatDataForTemplate(record);

            // Override agent role if specified in the request
            if (agentRole && agentRole !== templateData.agentRole) {
                templateData.agentRole = agentRole;
            }
        }

        // Determine which template to use based on agent role
        let templateName;
        const role = (templateData.agentRole || agentRole).toUpperCase();

        switch (role) {
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

        console.log(`Using template: ${templateName}`);
        console.log(`Output path: ${outputPath}`);

        // Generate the PDF
        const pdfPath = await generatePdfFromHtml(templatePath, outputPath, templateData);

        // Send email if requested
        if (sendEmail) {
            try {
                const transporter = configureEmailTransport();
                await transporter.sendMail({
                    from: getEnvVar('EMAIL_FROM', 'noreply@parealestatesupport.com'),
                    to: getEnvVar('EMAIL_RECIPIENT', 'debbie@parealestatesupport.com'),
                    subject: `Cover Sheet for ${templateData.propertyAddress || 'Property'}`,
                    html: `
            <h2>Cover Sheet Generated</h2>
            <p>Please find attached the cover sheet for property ${templateData.propertyAddress || 'Unknown'}.</p>
            <p>Agent: ${templateData.agentName || 'Unknown'}</p>
            <p>Role: ${role}</p>
            <p>MLS #: ${templateData.mlsNumber || 'N/A'}</p>
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
            path: pdfPath,
            emailSent: sendEmail
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