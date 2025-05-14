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
    const value = process.env[name];
    if (!value && defaultValue === '') {
        console.warn(`Warning: Environment variable ${name} is not set and no default provided`);
    }
    return value || defaultValue;
};

// Airtable Configuration
const AIRTABLE_API_KEY = getEnvVar('AIRTABLE_API_KEY') || getEnvVar('VITE_AIRTABLE_API_KEY');
const AIRTABLE_BASE_ID = getEnvVar('AIRTABLE_BASE_ID') || getEnvVar('VITE_AIRTABLE_BASE_ID');

// Ensure we have the Airtable credentials
if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error('Missing required Airtable environment variables. PDF generation and email sending will not work.');
}

// Email Configuration
const EMAIL_HOST = getEnvVar('EMAIL_HOST', 'smtp.gmail.com');
const EMAIL_PORT = parseInt(getEnvVar('EMAIL_PORT', '587'));
const EMAIL_SECURE = getEnvVar('EMAIL_SECURE', 'false') === 'true';
const EMAIL_USER = getEnvVar('EMAIL_USER', '');
const EMAIL_PASSWORD = getEnvVar('EMAIL_PASSWORD', '');
const EMAIL_FROM = getEnvVar('EMAIL_FROM', 'noreply@parealestatesupport.com');
const EMAIL_RECIPIENT = getEnvVar('EMAIL_RECIPIENT', 'debbie@parealestatesupport.com');

// Validate email configuration
if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.error('Missing required email environment variables. Email sending will not work.');
}

// Debugging for environment variables
console.log('Environment configuration:', {
    airtableKey: AIRTABLE_API_KEY ? 'Set (truncated for security)' : 'Not set',
    airtableBaseId: AIRTABLE_BASE_ID ? 'Set' : 'Not set',
    emailHost: EMAIL_HOST,
    emailPort: EMAIL_PORT,
    emailSecure: EMAIL_SECURE,
    emailUser: EMAIL_USER ? 'Set' : 'Not set',
    emailPassword: EMAIL_PASSWORD ? 'Set (hidden)' : 'Not set',
    emailFrom: EMAIL_FROM,
    emailRecipient: EMAIL_RECIPIENT,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV
});

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
            const errorMessage = errorData.error && errorData.error.message ?
                errorData.error.message :
                `Failed to fetch Airtable record: ${response.status}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Successfully fetched Airtable record');
        return data;
    } catch (error) {
        console.error('Error fetching Airtable record:', error);
        throw error;
    }
}

// Define template roles
const TEMPLATE_ROLES = {
    BUYER: 'BUYERS AGENT',
    SELLER: 'LISTING AGENT',
    DUAL: 'DUAL AGENT'
};

// Validate template role
const validateTemplateRole = (role) => {
    const normalizedRole = role.toUpperCase().replace(/[^A-Z]/g, '');
    if (normalizedRole.includes('BUYER')) return TEMPLATE_ROLES.BUYER;
    if (normalizedRole.includes('SELLER') || normalizedRole.includes('LISTING')) return TEMPLATE_ROLES.SELLER;
    return TEMPLATE_ROLES.DUAL;
};

// Process template data with validation
const processTemplateData = async(record, role) => {
    try {
        // Import the template utilities and validation utilities dynamically
        const { processCoverSheetData } = await
        import ('../../src/utils/templateUtils.js');
        const { validateCoverSheetData } = await
        import ('../../src/utils/validationUtils.js');

        // Process the data
        const processedData = processCoverSheetData(record, role);

        // Validate the processed data
        const validationResult = validateCoverSheetData(processedData, role);

        if (!validationResult.isValid) {
            const errorMessages = validationResult.errors
                .filter(e => e.severity === 'error')
                .map(e => `${e.field}: ${e.message}`)
                .join(', ');
            throw new Error(`Validation failed: ${errorMessages}`);
        }

        // Log warnings if any
        const warnings = validationResult.errors.filter(e => e.severity === 'warning');
        if (warnings.length > 0) {
            console.warn('Cover sheet warnings:', warnings);
        }

        return processedData;
    } catch (error) {
        console.error('Error processing template data:', error);
        throw error;
    }
};

// Generate PDF from template
async function generatePdfFromTemplate(templatePath, data, outputPath) {
    try {
        // Read the template
        let templateContent = await fs.readFile(templatePath, 'utf-8');

        // Replace placeholders with data
        Object.entries(data).forEach(([key, value]) => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            templateContent = templateContent.replace(regex, value || '');
        });

        // Launch browser
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();
            await page.setContent(templateContent, { waitUntil: 'networkidle0' });

            // Generate PDF with proper formatting
            await page.pdf({
                path: outputPath,
                format: 'letter',
                printBackground: true,
                margin: { top: '0.2in', right: '0.2in', bottom: '0.2in', left: '0.2in' },
                displayHeaderFooter: true,
                headerTemplate: '<div></div>',
                footerTemplate: `
                    <div style="font-size: 8px; text-align: center; width: 100%;">
                        Generated on ${new Date().toLocaleString()} - Page <span class="pageNumber"></span> of <span class="totalPages"></span>
                    </div>
                `
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

// Send email with PDF
async function sendEmailWithPdf(pdfPath, data, role) {
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
        throw new Error('Email configuration is incomplete');
    }

    const transporter = nodemailer.createTransport(emailConfig);
    await transporter.verify();

    const emailBody = `
        <h2>Cover Sheet Generated</h2>
        <p>A new cover sheet has been generated for:</p>
        <ul>
            <li><strong>Property:</strong> ${data.propertyAddress}</li>
            <li><strong>MLS#:</strong> ${data.mlsNumber}</li>
            <li><strong>Agent:</strong> ${data.agentName}</li>
            <li><strong>Role:</strong> ${role}</li>
            <li><strong>Generated:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        ${data.urgentIssues ? '<p><strong>⚠️ URGENT ISSUES NOTED</strong></p>' : ''}
        ${data.specialInstructions ? `<p><strong>Special Instructions:</strong> ${data.specialInstructions}</p>` : ''}
    `;

    const info = await transporter.sendMail({
        from: EMAIL_FROM,
        to: EMAIL_RECIPIENT,
        subject: `Cover Sheet - ${data.propertyAddress} (${role})`,
        html: emailBody,
        attachments: [{
            filename: path.basename(pdfPath),
            path: pdfPath
        }]
    });

    return info;
}

// Main handler function
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const { tableId, recordId, agentRole = 'DUAL AGENT', sendEmail = true } = req.body;

        // Validate required parameters
        if (!tableId || !recordId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: tableId and recordId'
            });
        }

        // Ensure output directory exists
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        // Validate and normalize role
        const role = validateTemplateRole(agentRole);
        
        // Generate unique filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${role.replace(/\s+/g, '')}_${recordId}_${timestamp}.pdf`;
        const pdfPath = path.join(OUTPUT_DIR, filename);

        // Fetch record from Airtable
        const record = await fetchAirtableRecord(tableId, recordId);
        
        // Process data for template
        const templateData = await processTemplateData(record, role);

        // Determine template path
        const templateName = role.includes('BUYER') ? 'Buyer' : 
                            role.includes('LISTING') ? 'Seller' : 'DualAgent';
        const templatePath = path.join(process.cwd(), 'public', 'templates', `${templateName}.html`);

        // Verify template exists
        await fs.access(templatePath);

        // Generate PDF
        await generatePdfFromTemplate(templatePath, templateData, pdfPath);

        // Send email if requested
        let emailResult = { sent: false, error: null };
        if (sendEmail) {
            try {
                const info = await sendEmailWithPdf(pdfPath, templateData, role);
                emailResult = { sent: true, messageId: info.messageId };
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                emailResult.error = emailError.message;
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Cover sheet generated successfully',
            filename,
            path: pdfPath,
            emailSent: emailResult.sent,
            emailError: emailResult.error,
            templateData
        });
    } catch (error) {
        console.error('Error in generateCoverSheet:', error);
        return res.status(500).json({
            success: false,
            message: 'Error generating cover sheet',
            error: error.message
        });
    }
}