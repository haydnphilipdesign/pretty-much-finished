const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda'); // Correct import for Vercel

// Helper function to get environment variables (recommended for Vercel)
const getEnvVar = (name, defaultValue = '') => {
    return process.env[name] || defaultValue;
};

// Function to replace placeholders in HTML content
// IMPORTANT: Handles both {{fieldName}} and Handlebars-style conditionals {{#if fieldName}}...{{/if}}
const populateTemplate = (htmlContent, data) => {
    let populatedHtml = htmlContent;

    // Log the data we're using to populate the template
    console.log('Template data:', JSON.stringify(data, null, 2));

    // First, handle conditional blocks like {{#if fieldName}}...{{/if}}
    // This is a simplified version of Handlebars-style conditionals
    const conditionalRegex = /{{#if\s+([\w]+)\s*}}([\s\S]*?){{\/if}}/g;
    populatedHtml = populatedHtml.replace(conditionalRegex, (match, condition, content) => {
        console.log(`Processing conditional: {{#if ${condition}}}`);
        // If the condition is truthy in our data, return the content, otherwise empty string
        return data[condition] ? content : '';
    });

    // Handle unless conditionals {{#unless fieldName}}...{{/unless}}
    const unlessRegex = /{{#unless\s+([\w]+)\s*}}([\s\S]*?){{\/unless}}/g;
    populatedHtml = populatedHtml.replace(unlessRegex, (match, condition, content) => {
        console.log(`Processing unless: {{#unless ${condition}}}`);
        // If the condition is falsy in our data, return the content, otherwise empty string
        return !data[condition] ? content : '';
    });

    // Then handle simple variable replacements {{fieldName}}
    for (const key in data) {
        if (data[key] !== undefined) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            const replacements = populatedHtml.match(regex);
            if (replacements && replacements.length > 0) {
                console.log(`Replacing ${replacements.length} occurrences of {{${key}}}`);
            }
            populatedHtml = populatedHtml.replace(regex, data[key] || ''); // Replace with value or empty string
        }
    }

    // Replace any remaining placeholders with empty string
    const remainingPlaceholders = populatedHtml.match(/{{[^}]*}}/g);
    if (remainingPlaceholders && remainingPlaceholders.length > 0) {
        console.log(`Removing ${remainingPlaceholders.length} remaining placeholders:`, remainingPlaceholders);
    }
    populatedHtml = populatedHtml.replace(/{{[^}]*}}/g, '');

    return populatedHtml;
};

// Use module.exports for CommonJS
module.exports = async(req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    let browser = null; // Define browser outside try block for finally
    let tempFilePath = null; // Define tempFilePath for cleanup in finally block

    try {
        // ONLY expect formData now
        const { formData } = req.body;

        // Basic validation
        if (!formData) {
            return res.status(400).json({ message: 'Missing required data: formData' });
        }
        if (!(formData.agentData && formData.agentData.role)) {
            return res.status(400).json({ message: 'Missing agent role in formData' });
        }

        // --- Determine Template ---
        const agentRole = formData.agentData.role;
        let templateFileName;

        // Match the same logic from templateSelector.ts
        const normalizedRole = agentRole.trim().toUpperCase();
        if (normalizedRole.includes('LISTING') || normalizedRole.includes('SELLER')) {
            templateFileName = 'Seller.html';
        } else if (normalizedRole.includes('BUYER')) {
            templateFileName = 'Buyer.html';
        } else if (normalizedRole.includes('DUAL')) {
            templateFileName = 'DualAgent.html';
        } else {
            // Default to Buyer template if role is unknown
            templateFileName = 'Buyer.html';
        }
        console.log(`Selected template: ${templateFileName} for role: ${agentRole}`);

        // Try multiple possible paths for the templates
        let templatePath;
        const possiblePaths = [
            // Direct path (most likely to work)
            path.join(process.cwd(), 'public', 'templates', templateFileName),
            // Relative path from the api directory
            path.join(path.dirname(__dirname), 'public', 'templates', templateFileName),
            // Fallback paths
            path.resolve('public/templates', templateFileName),
            `./public/templates/${templateFileName}`,
            // Path for Vercel deployment
            path.join(process.cwd(), 'templates', templateFileName),
            // Last resort paths
            path.resolve('./templates', templateFileName),
            path.resolve('../templates', templateFileName),
            path.resolve('../public/templates', templateFileName),
            // Vercel specific paths
            '/var/task/templates/' + templateFileName,
            '/var/task/public/templates/' + templateFileName,
            './.next/templates/' + templateFileName,
            './.next/public/templates/' + templateFileName,
            './templates/' + templateFileName
        ];

        // Try each path until we find one that exists
        let templateFound = false;
        for (const possiblePath of possiblePaths) {
            console.log(`Trying template path: ${possiblePath}`);
            try {
                if (fs.existsSync(possiblePath)) {
                    templatePath = possiblePath;
                    templateFound = true;
                    console.log(`✅ Template found at: ${templatePath}`);
                    // Log directory contents to help debug
                    const templateDir = path.dirname(possiblePath);
                    console.log(`Template directory contents (${templateDir}):`);
                    const dirContents = fs.readdirSync(templateDir);
                    console.log(dirContents);
                    break;
                }
            } catch (err) {
                console.log(`Error checking path ${possiblePath}: ${err.message}`);
            }
        }

        // If no template is found, return an error
        if (!templateFound) {
            console.error(`❌ Template file not found. Tried paths: ${JSON.stringify(possiblePaths, null, 2)}`);
            // List current directory for debugging
            console.log('Current directory contents:');
            try {
                const currentDirContents = fs.readdirSync(process.cwd());
                console.log(currentDirContents);

                // Check if public folder exists and list its contents
                const publicPath = path.join(process.cwd(), 'public');
                if (fs.existsSync(publicPath)) {
                    console.log('Public directory contents:');
                    console.log(fs.readdirSync(publicPath));

                    // Check if templates folder exists and list its contents
                    const templatesPath = path.join(publicPath, 'templates');
                    if (fs.existsSync(templatesPath)) {
                        console.log('Templates directory contents:');
                        console.log(fs.readdirSync(templatesPath));
                    }
                }
            } catch (err) {
                console.error(`Error listing directory: ${err.message}`);
            }

            return res.status(500).json({ message: 'Server error: Template file not found.' });
        }

        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        console.log(`Template loaded, size: ${templateHtml.length} bytes`);

        // Map form data to template placeholders based on the actual template structure
        const templateData = {
            // --- Property Data ---
            propertyAddress: (formData.propertyData && formData.propertyData.address) || 'N/A',
            mlsNumber: (formData.propertyData && formData.propertyData.mlsNumber) || 'N/A',

            // --- Agent Data ---
            agentName: (formData.agentData && formData.agentData.name) || 'N/A',
            agentPhone: (formData.agentData && formData.agentData.phone) || 'N/A',
            agentEmail: (formData.agentData && formData.agentData.email) || 'N/A',

            // --- Client Data ---
            // For Seller template
            sellerName: (formData.clients && formData.clients.filter(c => c.type === 'SELLER')[0] && formData.clients.filter(c => c.type === 'SELLER')[0].name) ||
                (formData.clients && formData.clients[0] && formData.clients[0].name) || 'N/A',
            sellerAddress: (formData.clients && formData.clients.filter(c => c.type === 'SELLER')[0] && formData.clients.filter(c => c.type === 'SELLER')[0].address) ||
                (formData.clients && formData.clients[0] && formData.clients[0].address) || 'N/A',
            sellerPhone: (formData.clients && formData.clients.filter(c => c.type === 'SELLER')[0] && formData.clients.filter(c => c.type === 'SELLER')[0].phone) ||
                (formData.clients && formData.clients[0] && formData.clients[0].phone) || 'N/A',
            sellerEmail: (formData.clients && formData.clients.filter(c => c.type === 'SELLER')[0] && formData.clients.filter(c => c.type === 'SELLER')[0].email) ||
                (formData.clients && formData.clients[0] && formData.clients[0].email) || 'N/A',

            // For Buyer template
            buyerName: (formData.clients && formData.clients.filter(c => c.type === 'BUYER')[0] && formData.clients.filter(c => c.type === 'BUYER')[0].name) ||
                (formData.clients && formData.clients[1] && formData.clients[1].name) || 'N/A',
            buyerAddress: (formData.clients && formData.clients.filter(c => c.type === 'BUYER')[0] && formData.clients.filter(c => c.type === 'BUYER')[0].address) ||
                (formData.clients && formData.clients[1] && formData.clients[1].address) || 'N/A',
            buyerPhone: (formData.clients && formData.clients.filter(c => c.type === 'BUYER')[0] && formData.clients.filter(c => c.type === 'BUYER')[0].phone) ||
                (formData.clients && formData.clients[1] && formData.clients[1].phone) || 'N/A',
            buyerEmail: (formData.clients && formData.clients.filter(c => c.type === 'BUYER')[0] && formData.clients.filter(c => c.type === 'BUYER')[0].email) ||
                (formData.clients && formData.clients[1] && formData.clients[1].email) || 'N/A',

            // --- Commission Data ---
            totalCommissionPercent: (formData.commissionData && formData.commissionData.totalCommissionPercentage) || 'N/A',
            listingAgentPercent: (formData.commissionData && formData.commissionData.listingAgentPercentage) || 'N/A',
            buyersAgentPercent: (formData.commissionData && formData.commissionData.buyersAgentPercentage) || 'N/A',

            // Set conditional values for checkboxes
            referralYes: (formData.commissionData && formData.commissionData.isReferral) ? true : undefined,

            // --- Property Details Data ---
            hoaYes: (formData.propertyDetailsData && formData.propertyDetailsData.hoaName) ? true : undefined,
            hoaAssociation: (formData.propertyDetailsData && formData.propertyDetailsData.hoaName) || 'N/A',
            coYes: (formData.propertyDetailsData && formData.propertyDetailsData.coRequired) ? true : undefined,
            municipality: (formData.propertyDetailsData && formData.propertyDetailsData.municipality) || 'N/A',
            rofr: (formData.propertyDetailsData && formData.propertyDetailsData.firstRightOfRefusal) ? true : undefined,

            // --- Attorney Data ---
            attorneyName: (formData.propertyDetailsData && formData.propertyDetailsData.attorneyName) || 'N/A',

            // --- Warranty Data ---
            warrantyYes: (formData.propertyDetailsData && formData.propertyDetailsData.homeWarranty) ? true : undefined,
            warrantyNo: !(formData.propertyDetailsData && formData.propertyDetailsData.homeWarranty) ? true : undefined,
            warrantyCompany: (formData.propertyDetailsData && formData.propertyDetailsData.warrantyCompany) || 'N/A',
            warrantyCost: (formData.propertyDetailsData && formData.propertyDetailsData.warrantyCost) || 'N/A',

            // --- Title Company Data ---
            titleCompany: (formData.titleData && formData.titleData.titleCompany) || 'N/A',
            titlePhone: (formData.titleData && formData.titleData.titlePhone) || 'N/A',
            titleEmail: (formData.titleData && formData.titleData.titleEmail) || 'N/A',

            // --- Additional Info ---
            specialInstructions: (formData.additionalInfo && formData.additionalInfo.specialInstructions) || '',
            urgentIssues: (formData.additionalInfo && formData.additionalInfo.urgentIssues) || '',
            notes: (formData.additionalInfo && formData.additionalInfo.notes) || '',

            // --- Other ---
            submissionDate: new Date().toLocaleString(),
        };

        const populatedHtml = populateTemplate(templateHtml, templateData);
        console.log(`Template populated, size: ${populatedHtml.length} bytes`);

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
        await page.close(); // Close the page after use

        // --- Initialize Nodemailer with SMTP ---
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
        const emailMlsNumber = (formData.propertyData && formData.propertyData.mlsNumber) || 'unknown';
        const emailAddress = (formData.propertyData && formData.propertyData.address) || 'New Property';
        const recipient = getEnvVar('EMAIL_RECIPIENT', 'debbie@parealestatesupport.com');
        const fromEmail = getEnvVar('EMAIL_FROM', 'transactions@parealestatesupport.com');

        const emailSubject = `Transaction Form Submitted: ${emailAddress} (MLS# ${emailMlsNumber})`;
        const emailHtmlBody = `
            <h1>Transaction Submission Received</h1>
            <p><strong>Property:</strong> ${emailAddress}</p>
            <p><strong>MLS#:</strong> ${emailMlsNumber}</p>
            <p><strong>Agent:</strong> ${templateData.agentName} (${(formData.agentData && formData.agentData.role) || 'N/A'})</p>
            <p>Please find the transaction details attached as a PDF.</p>
            <hr>
            <p><em>This is an automated notification.</em></p>
        `;

        // Create filename for attachment
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `Transaction_${emailMlsNumber}_${timestamp}.pdf`;

        // --- Send Email using Nodemailer ---
        console.log(`Attempting to send email to ${recipient} via Nodemailer SMTP...`);

        // Create a temporary file to store the PDF
        let tempFilePath;
        try {
            // Try the main temp directory first
            const tempDir = path.resolve(process.cwd(), 'temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
                console.log(`Created temp directory at: ${tempDir}`);
            }
            tempFilePath = path.join(tempDir, fileName);
        } catch (tempDirError) {
            console.warn(`Warning: Could not use main temp directory: ${tempDirError.message}`);
            // Try fallback: use /tmp if available (works on Vercel)
            try {
                const fallbackDir = '/tmp';
                if (fs.existsSync(fallbackDir)) {
                    tempFilePath = path.join(fallbackDir, fileName);
                    console.log(`Using fallback temp directory: ${fallbackDir}`);
                } else {
                    // Last resort: use current directory
                    tempFilePath = path.join(process.cwd(), fileName);
                    console.log(`Using current directory for temp file: ${process.cwd()}`);
                }
            } catch (fallbackError) {
                console.error(`Error setting up fallback temp path: ${fallbackError.message}`);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create temporary file storage',
                    error: fallbackError.message
                });
            }
        }

        console.log(`Writing temporary PDF to: ${tempFilePath}`);
        fs.writeFileSync(tempFilePath, pdfBuffer);
        console.log(`Temporary PDF saved to: ${tempFilePath}`);

        // Configure email options
        const mailOptions = {
            from: fromEmail,
            to: recipient,
            subject: emailSubject,
            html: emailHtmlBody,
            attachments: [{
                filename: fileName,
                path: tempFilePath
            }]
        };

        console.log('Sending email with attachment...');
        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully with Nodemailer! ID:', info.messageId);

        // Clean up the temporary file
        try {
            fs.unlinkSync(tempFilePath);
            console.log(`Temporary file removed: ${tempFilePath}`);
        } catch (cleanupError) {
            console.warn(`Warning: Could not remove temporary file: ${cleanupError.message}`);
        }

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            emailId: info.messageId
        });

    } catch (error) {
        console.error('Error processing request:', error);

        // Clean up any temporary file if it exists
        if (typeof tempFilePath !== 'undefined' && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath);
                console.log(`Temporary file removed during error handling: ${tempFilePath}`);
            } catch (cleanupError) {
                console.warn(`Warning: Could not remove temporary file: ${cleanupError.message}`);
            }
        }

        // Log the specific step that failed if possible (e.g., add more specific catches)
        return res.status(500).json({
            success: false,
            message: 'Failed to process request',
            error: error.message
        });
    } finally {
        // Clean up resources
        if (browser !== null) {
            console.log('Closing browser...');
            await browser.close(); // Ensure browser is closed
        }

        // Clean up any temporary file that might still exist
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath);
                console.log(`Temporary file removed in finally block: ${tempFilePath}`);
            } catch (cleanupError) {
                console.warn(`Warning: Could not remove temporary file in finally: ${cleanupError.message}`);
            }
        }
    }
};