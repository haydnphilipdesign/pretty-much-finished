const { Resend } = require('resend');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda'); // Correct import for Vercel

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

// Use module.exports for CommonJS
module.exports = async(req, res) => {
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
        // Check if file exists before reading
        if (!fs.existsSync(templatePath)) {
            console.error(`Template file not found: ${templatePath}`);
            return res.status(500).json({ message: 'Server error: Template file not found.' });
        }
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        // Prepare data for template population (ensure all fields are mapped)
        const templateData = {
            // --- Agent Data ---
            agentName: formData.agentData ? .name || 'N/A',
            agentRole: formData.agentData ? .role || 'N/A',
            agentEmail: formData.agentData ? .email || 'N/A',
            agentPhone: formData.agentData ? .phone || 'N/A',

            // --- Property Data ---
            mlsNumber: formData.propertyData ? .mlsNumber || 'N/A',
            address: formData.propertyData ? .address || 'N/A',
            salePrice: formData.propertyData ? .salePrice || 'N/A',
            propertyStatus: formData.propertyData ? .status || 'N/A',
            isWinterized: formData.propertyData ? .isWinterized || 'N/A',
            updateMls: formData.propertyData ? .updateMls || 'N/A',
            propertyAccessType: formData.propertyData ? .propertyAccessType || 'N/A',
            lockboxAccessCode: formData.propertyData ? .lockboxAccessCode || 'N/A',
            county: formData.propertyData ? .county || 'N/A',
            propertyType: formData.propertyData ? .propertyType || 'N/A',
            isBuiltBefore1978: formData.propertyData ? .isBuiltBefore1978 || 'N/A',
            closingDate: formData.propertyData ? .closingDate || 'N/A',

            // --- Client Data ---
            // First client
            client1Name: formData.clients ? .[0] ? .name || 'N/A',
            client1Email: formData.clients ? .[0] ? .email || 'N/A',
            client1Phone: formData.clients ? .[0] ? .phone || 'N/A',
            client1Address: formData.clients ? .[0] ? .address || 'N/A',
            client1MaritalStatus: formData.clients ? .[0] ? .maritalStatus || 'N/A',
            client1Type: formData.clients ? .[0] ? .type || 'N/A',

            // Second client (if exists)
            client2Name: formData.clients ? .[1] ? .name || '',
            client2Email: formData.clients ? .[1] ? .email || '',
            client2Phone: formData.clients ? .[1] ? .phone || '',
            client2Address: formData.clients ? .[1] ? .address || '',
            client2MaritalStatus: formData.clients ? .[1] ? .maritalStatus || '',
            client2Type: formData.clients ? .[1] ? .type || '',

            // For convenience, create a combined client names field
            clientNames: formData.clients ? .map(client => client.name).filter(Boolean).join(', ') || 'N/A',

            // --- Commission Data ---
            totalCommissionPercentage: formData.commissionData ? .totalCommissionPercentage || 'N/A',
            listingAgentPercentage: formData.commissionData ? .listingAgentPercentage || 'N/A',
            buyersAgentPercentage: formData.commissionData ? .buyersAgentPercentage || 'N/A',
            hasBrokerFee: formData.commissionData ? .hasBrokerFee ? 'YES' : 'NO',
            brokerFeeAmount: formData.commissionData ? .brokerFeeAmount || 'N/A',
            hasSellersAssist: formData.commissionData ? .hasSellersAssist ? 'YES' : 'NO',
            sellersAssist: formData.commissionData ? .sellersAssist || 'N/A',
            isReferral: formData.commissionData ? .isReferral ? 'YES' : 'NO',
            referralParty: formData.commissionData ? .referralParty || 'N/A',
            referralFee: formData.commissionData ? .referralFee || 'N/A',
            brokerEin: formData.commissionData ? .brokerEin || 'N/A',
            coordinatorFeePaidBy: formData.commissionData ? .coordinatorFeePaidBy || 'N/A',

            // --- Property Details Data ---
            resaleCertRequired: formData.propertyDetailsData ? .resaleCertRequired ? 'YES' : 'NO',
            hoaName: formData.propertyDetailsData ? .hoaName || 'N/A',
            coRequired: formData.propertyDetailsData ? .coRequired ? 'YES' : 'NO',
            municipality: formData.propertyDetailsData ? .municipality || 'N/A',
            firstRightOfRefusal: formData.propertyDetailsData ? .firstRightOfRefusal ? 'YES' : 'NO',
            firstRightName: formData.propertyDetailsData ? .firstRightName || 'N/A',
            attorneyRepresentation: formData.propertyDetailsData ? .attorneyRepresentation ? 'YES' : 'NO',
            attorneyName: formData.propertyDetailsData ? .attorneyName || 'N/A',
            homeWarranty: formData.propertyDetailsData ? .homeWarranty ? 'YES' : 'NO',
            warrantyCompany: formData.propertyDetailsData ? .warrantyCompany || 'N/A',
            warrantyCost: formData.propertyDetailsData ? .warrantyCost || 'N/A',
            warrantyPaidBy: formData.propertyDetailsData ? .warrantyPaidBy || 'N/A',

            // --- Title Company Data ---
            titleCompany: formData.titleData ? .titleCompany || 'N/A',

            // --- Additional Info ---
            specialInstructions: formData.additionalInfo ? .specialInstructions || '',
            urgentIssues: formData.additionalInfo ? .urgentIssues || '',
            notes: formData.additionalInfo ? .notes || '',

            // --- Documents Data ---
            documentsConfirmed: formData.documentsData ? .confirmDocuments ? 'YES' : 'NO',
            documentsSelected: formData.documentsData ? .documents ?
                .filter(doc => doc.selected) ?
                .map(doc => doc.name) ?
                .join(', ') || 'None',

            // --- Signature Data ---
            signature: formData.signatureData ? .signature || 'N/A',
            confirmAccuracy: formData.signatureData ? .confirmAccuracy ? 'YES' : 'NO',

            // --- Other ---
            submissionDate: new Date().toLocaleString(),
            formattedDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            // Format currency values
            formattedSalePrice: formData.propertyData ? .salePrice ?
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(formData.propertyData.salePrice) :
                'N/A',
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
        await page.close(); // Close the page after use

        // --- Initialize Resend ---
        const resendApiKey = getEnvVar('RESEND_API_KEY');
        if (!resendApiKey) {
            console.error('Missing Resend API key');
            return res.status(500).json({ message: 'Email service configuration error.' });
        }

        const resend = new Resend(resendApiKey);

        // --- Prepare Email Content ---
        const emailMlsNumber = formData.propertyData ? .mlsNumber || 'unknown';
        const emailAddress = formData.propertyData ? .address || 'New Property';
        const recipient = getEnvVar('EMAIL_RECIPIENT', 'debbie@parealestatesupport.com');
        const fromEmail = getEnvVar('EMAIL_FROM', 'transactions@parealestatesupport.com');

        const emailSubject = `Transaction Form Submitted: ${emailAddress} (MLS# ${emailMlsNumber})`;
        const emailHtmlBody = `
            <h1>Transaction Submission Received</h1>
            <p><strong>Property:</strong> ${emailAddress}</p>
            <p><strong>MLS#:</strong> ${emailMlsNumber}</p>
            <p><strong>Agent:</strong> ${templateData.agentName} (${templateData.agentRole})</p>
            <p>Please find the transaction details attached as a PDF.</p>
            <hr>
            <p><em>This is an automated notification.</em></p>
        `;

        // Create filename for attachment
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `Transaction_${emailMlsNumber}_${timestamp}.pdf`;

        // --- Send Email using Resend ---
        console.log(`Attempting to send email to ${recipient} via Resend...`);

        // Create a temporary file to store the PDF
        const tempDir = path.resolve(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempFilePath = path.join(tempDir, fileName);
        fs.writeFileSync(tempFilePath, pdfBuffer);
        console.log(`Temporary PDF saved to: ${tempFilePath}`);

        const emailData = {
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
        const { data, error } = await resend.emails.send(emailData);

        if (error) {
            console.error('Error sending email with Resend:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to send email',
                error: error.message
            });
        }

        console.log('Email sent successfully with Resend! ID:', data.id);
        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            emailId: data.id
        });

    } catch (error) {
        console.error('Error processing request:', error);
        // Log the specific step that failed if possible (e.g., add more specific catches)
        return res.status(500).json({
            success: false,
            message: 'Failed to process request',
            error: error.message
        });
    } finally {
        if (browser !== null) {
            console.log('Closing browser...');
            await browser.close(); // Ensure browser is closed
        }
    }
};