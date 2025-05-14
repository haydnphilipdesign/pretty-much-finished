import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Email configuration
const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
};

// Validate email configuration
if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    console.warn('Warning: Email configuration is incomplete. Email features will not work.');
}

// Parse JSON bodies
app.use(express.json());

// Set MIME types explicitly
app.use((req, res, next) => {
    if (req.path.endsWith('.js')) {
        res.type('application/javascript');
    } else if (req.path.endsWith('.css')) {
        res.type('text/css');
    }
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// API Routes - must come before static file handling
app.get('/api', (req, res) => {
    res.json({
        message: 'Hello from PA Real Estate Support Services API!',
        timestamp: new Date().toISOString(),
        endpoints: {
            '/api': 'Basic test endpoint (GET)',
            '/api/test-email': 'Test email functionality (GET/POST)',
            '/api/test-pdf': 'Test PDF generation (GET/POST)',
            '/api/test-template': 'Test template-based PDF generation and email (GET/POST)',
            '/api/test-template/:role': 'Test specific template (Buyer, Seller, or DualAgent)'
        }
    });
});

// Helper function to read and process template
async function processTemplate(templateName, data) {
    const templatePath = path.join(__dirname, '..', 'public', 'templates', `${templateName}.html`);
    let templateContent = await fs.readFile(templatePath, 'utf-8');

    // Replace placeholders with actual data
    Object.entries(data).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        templateContent = templateContent.replace(regex, value || '');
    });

    return templateContent;
}

// Test template-based PDF generation and email endpoint
app.all('/api/test-template/:role?', async(req, res) => {
    try {
        // Get the role from params or query
        const role = (req.params.role || req.query.role || 'DualAgent').replace(/[^a-zA-Z]/g, '');

        // Validate role
        if (!['Buyer', 'Seller', 'DualAgent'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be Buyer, Seller, or DualAgent'
            });
        }

        // Sample data for template
        const testData = {
            propertyAddress: '123 Test Street, Pocono, PA 18334',
            mlsNumber: 'MLS123456',
            agentName: 'Test Agent',
            salePrice: '$300,000',
            closingDate: new Date().toLocaleDateString(),
            specialInstructions: 'Test special instructions',
            brokerFee: '$500',
            sellersAssist: '$5,000'
        };

        // Get template content
        const templateContent = await processTemplate(role, testData);

        // Generate PDF
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(templateContent);

        const pdfBuffer = await page.pdf({
            format: 'letter',
            printBackground: true,
            margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
        });

        await browser.close();

        // Send email with PDF attachment if email config is valid
        if (emailConfig.auth.user && emailConfig.auth.pass) {
            const transporter = nodemailer.createTransport(emailConfig);
            await transporter.verify();

            const info = await transporter.sendMail({
                from: process.env.EMAIL_FROM || 'noreply@parealestatesupport.com',
                to: process.env.EMAIL_RECIPIENT || 'debbie@parealestatesupport.com',
                subject: `Test ${role} Cover Sheet - ${new Date().toLocaleString()}`,
                html: `
                    <h2>Test Cover Sheet</h2>
                    <p>This is a test ${role} cover sheet generated at ${new Date().toLocaleString()}</p>
                    <h3>Test Data Used:</h3>
                    <pre>${JSON.stringify(testData, null, 2)}</pre>
                `,
                attachments: [{
                    filename: `${role}_CoverSheet_Test.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }]
            });

            // Send success response with both PDF and email confirmation
            res.json({
                success: true,
                message: 'PDF generated and email sent successfully',
                emailMessageId: info.messageId,
                pdfUrl: `/api/test-template/${role}/download`,
                testData
            });

            // Store the PDF buffer temporarily for download
            app.get(`/api/test-template/${role}/download`, (_, downloadRes) => {
                downloadRes.setHeader('Content-Type', 'application/pdf');
                downloadRes.setHeader('Content-Disposition', `attachment; filename=${role}_CoverSheet_Test.pdf`);
                downloadRes.send(pdfBuffer);
            });
        } else {
            // If no email config, just send the PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${role}_CoverSheet_Test.pdf`);
            res.send(pdfBuffer);
        }
    } catch (error) {
        console.error('Error in template test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process template and generate PDF',
            error: error.message
        });
    }
});

// Test email endpoint
app.all('/api/test-email', async(req, res) => {
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
        return res.status(500).json({
            success: false,
            message: 'Email configuration is incomplete',
            error: 'Missing email credentials'
        });
    }

    try {
        const transporter = nodemailer.createTransport(emailConfig);

        // Verify connection configuration
        await transporter.verify();

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'noreply@parealestatesupport.com',
            to: process.env.EMAIL_RECIPIENT || 'debbie@parealestatesupport.com',
            subject: 'Test Email - ' + new Date().toLocaleString(),
            html: `
                <h2>Test Email</h2>
                <p>This is a test email sent at ${new Date().toLocaleString()}</p>
                <p>If you're receiving this, the email system is working correctly.</p>
            `
        });

        res.json({
            success: true,
            message: 'Test email sent successfully',
            messageId: info.messageId,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error.message
        });
    }
});

// Test PDF endpoint
app.all('/api/test-pdf', async(req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        await page.setContent(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Test PDF</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    h1 { color: #2c3e50; }
                    .info { margin: 20px 0; }
                </style>
            </head>
            <body>
                <h1>Test PDF Generation</h1>
                <div class="info">
                    <p>Date: ${new Date().toLocaleString()}</p>
                    <p>This is a test PDF generated directly from the API.</p>
                </div>
            </body>
            </html>
        `);

        const pdfBuffer = await page.pdf({
            format: 'letter',
            printBackground: true,
            margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
        });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=test.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate PDF',
            error: error.message
        });
    }
});

// API routes must come before the catch-all static file handler
app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Serve static files
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        res.setHeader('X-Content-Type-Options', 'nosniff');
    }
}));

// Route all other requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Email configuration:', {
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        user: emailConfig.auth.user ? 'Set' : 'Not set',
        pass: emailConfig.auth.pass ? 'Set' : 'Not set'
    });
});