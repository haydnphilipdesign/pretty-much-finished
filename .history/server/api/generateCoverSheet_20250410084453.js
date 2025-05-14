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

// Prepare template data from Airtable record
function prepareTemplateData(record, role) {
    // Basic template data
    const templateData = {
        role,
        // Default values
        propertyAddress: 'Unknown Address',
        mlsNumber: 'Unknown',
        agentName: 'Unknown Agent',
        salePrice: 'Unknown',
        closingDate: new Date().toLocaleDateString(),
    };

    // Common field IDs
    const fieldMap = {
        propertyAddress: 'fldypnfnHhplWYcCW',
        mlsNumber: 'fld6O2FgIXQU5G27o',
        agentName: 'fldFD4xHD0vxnSOHJ',
        salePrice: 'fldhHjBZJISmnP8SK',
        closingDate: 'fldacjkqtnbdTUUTx',
    };

    // Map fields from record to template data
    if (record && record.fields) {
        for (const [key, fieldId] of Object.entries(fieldMap)) {
            if (record.fields[fieldId]) {
                templateData[key] = record.fields[fieldId];
            }
        }
    }

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
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: EMAIL_SECURE,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        },
        tls: {
            // Do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
};

// Test email configuration
const testEmailConfiguration = async() => {
    try {
        const transporter = configureEmailTransport();
        const verification = await transporter.verify();
        console.log('Email configuration is valid:', verification);
        return true;
    } catch (error) {
        console.error('Email configuration is invalid:', error);
        return false;
    }
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
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        // Verify email configuration early
        const emailValid = await testEmailConfiguration();
        if (!emailValid) {
            console.error('Invalid email configuration detected during startup');
        }

        // Get request parameters
        const {
            tableId,
            recordId,
            agentRole = 'DUAL AGENT',
            sendEmail = true
        } = req.body;

        console.log('Cover sheet request:', {
            tableId,
            recordId,
            agentRole,
            sendEmail
        });

        // Validate required parameters
        if (!tableId || !recordId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: tableId and recordId'
            });
        }

        // Ensure output directory exists
        await ensureOutputDirectory();

        // Standardize role name (to match template naming)
        let role = agentRole.toUpperCase().replace(/\s+/g, '_');
        if (role.includes('BUYER')) {
            role = 'BUYER';
        } else if (role.includes('LISTING') || role.includes('SELLER')) {
            role = 'SELLER';
        } else {
            role = 'DUAL_AGENT';
        }

        // Generate filename with recordId and timestamp for uniqueness
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${role}_CoverSheet_${recordId}_${timestamp}.pdf`;
        const pdfPath = path.join(OUTPUT_DIR, filename);

        // Fetch the record from Airtable
        const record = await fetchAirtableRecord(tableId, recordId);
        console.log('Fetched record:', { id: record.id, fields: Object.keys(record.fields).length });

        // Prepare data for the template
        const templateData = prepareTemplateData(record, role);
        console.log('Template data prepared:', templateData);

        // Determine which template to use based on the role
        let templateName;
        switch (role) {
            case 'BUYER':
                templateName = 'Buyer.html';
                break;
            case 'SELLER':
                templateName = 'Seller.html';
                break;
            default:
                templateName = 'DualAgent.html';
                break;
        }

        // Path to template
        const templatePath = path.join(process.cwd(), 'public', 'templates', templateName);
        console.log('Using template:', templatePath);

        // Check if template exists
        try {
            await fs.access(templatePath);
            console.log('Template found');
        } catch (err) {
            console.error('Template not found:', err);
            return res.status(404).json({
                success: false,
                message: `Template ${templateName} not found`
            });
        }

        // Generate PDF
        await generatePdfFromHtml(templatePath, pdfPath, templateData);
        console.log('PDF generated successfully at:', pdfPath);

        // Send email if requested
        let emailResult = { sent: false, error: null };
        if (sendEmail) {
            try {
                const transporter = configureEmailTransport();
                const info = await transporter.sendMail({
                    from: EMAIL_FROM,
                    to: EMAIL_RECIPIENT,
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

                console.log('Email sent successfully, ID:', info.messageId);
                emailResult.sent = true;
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                emailResult.error = emailError.message;
                // Continue even if email fails, but record the error
            }
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Cover sheet generated successfully',
            filename,
            path: pdfPath,
            emailSent: emailResult.sent,
            emailError: emailResult.error
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