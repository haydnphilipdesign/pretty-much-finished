import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Email configuration
const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || ''
    }
};

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

// API Routes
app.get('/api', (req, res) => {
    res.json({
        message: 'Hello from PA Real Estate Support Services API!',
        timestamp: new Date().toISOString(),
        endpoints: {
            '/api': 'Basic test endpoint (GET)',
            '/api/test-email': 'Test email functionality (GET/POST)',
            '/api/test-pdf': 'Test PDF generation (GET/POST)',
            '/api/direct-email-test': 'Direct email test (GET/POST)',
            '/api/direct-pdf-test': 'Direct PDF test (GET/POST)'
        }
    });
});

// Test email endpoint
app.all('/api/test-email', async(req, res) => {
    try {
        const transporter = nodemailer.createTransport(emailConfig);

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'noreply@parealestatesupport.com',
            to: 'debbie@parealestatesupport.com',
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

        // Simple HTML content for the PDF
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

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'letter',
            printBackground: true,
            margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
        });

        await browser.close();

        // Send PDF as response
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

// Direct email test
app.all('/api/direct-email-test', async(req, res) => {
    try {
        const transporter = nodemailer.createTransport(emailConfig);

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'noreply@parealestatesupport.com',
            to: 'debbie@parealestatesupport.com',
            subject: 'Direct Email Test - ' + new Date().toLocaleString(),
            html: `
                <h2>Direct Test Email</h2>
                <p>Time: ${new Date().toLocaleString()}</p>
                <p>This is a direct test of the email system.</p>
                <p>Server Info: ${req.headers.host}</p>
            `
        });

        res.json({
            success: true,
            message: 'Direct test email sent successfully',
            messageId: info.messageId,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error sending direct test email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send direct test email',
            error: error.message
        });
    }
});

// Direct PDF test
app.all('/api/direct-pdf-test', async(req, res) => {
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
                <title>Direct Test PDF</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    h1 { color: #2c3e50; }
                    .info { margin: 20px 0; }
                </style>
            </head>
            <body>
                <h1>Direct Test PDF Generation</h1>
                <div class="info">
                    <p>Date: ${new Date().toLocaleString()}</p>
                    <p>Server: ${req.headers.host}</p>
                    <p>This is a direct test of the PDF generation system.</p>
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
        res.setHeader('Content-Disposition', 'attachment; filename=direct-test.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating direct test PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate direct test PDF',
            error: error.message
        });
    }
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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});