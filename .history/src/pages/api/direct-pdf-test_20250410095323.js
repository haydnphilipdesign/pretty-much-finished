// Direct PDF Generation Test
import puppeteer from 'puppeteer';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import os from 'os';

export default async function handler(req, res) {
    console.log('Direct PDF test initiated');

    try {
        // Create temp directory for PDF
        const tmpDir = os.tmpdir();
        const outputPath = path.join(tmpDir, `test-pdf-${Date.now()}.pdf`);

        console.log('Will generate PDF at:', outputPath);

        // Simple HTML content for the PDF
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test PDF</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #2c3e50; }
          .info { margin: 20px 0; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Test PDF Generation</h1>
        <div class="info">
          <p><span class="label">Date:</span> ${new Date().toLocaleString()}</p>
          <p><span class="label">Host:</span> ${req.headers.host}</p>
          <p><span class="label">Environment:</span> ${process.env.NODE_ENV || 'development'}</p>
        </div>
        <p>This is a test PDF generated directly from the API.</p>
        <p>If you're seeing this PDF, the PDF generation system is working correctly.</p>
      </body>
      </html>
    `;

        // Launch a browser
        console.log('Launching headless browser...');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            // Create a new page
            const page = await browser.newPage();

            // Set content
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

            // Generate PDF
            console.log('Generating PDF...');
            await page.pdf({
                path: outputPath,
                format: 'letter',
                printBackground: true,
                margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
            });

            console.log('PDF generated successfully');
        } finally {
            await browser.close();
        }

        // Now try to send the PDF via email
        const emailConfig = {
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER || '',
                pass: process.env.EMAIL_PASSWORD || ''
            }
        };

        console.log('Email configuration:', {
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            user: emailConfig.auth.user ? 'Set (hidden)' : 'Not set'
        });

        // Check if email configuration is valid
        let emailSent = false;
        let emailError = null;

        if (emailConfig.auth.user && emailConfig.auth.pass) {
            try {
                // Create transporter
                const transporter = nodemailer.createTransport(emailConfig);

                // Email data
                const mailOptions = {
                    from: process.env.EMAIL_FROM || 'noreply@parealestatesupport.com',
                    to: 'debbie@parealestatesupport.com',
                    subject: 'Test PDF Generation - ' + new Date().toLocaleString(),
                    html: `
            <h2>Test PDF Generation</h2>
            <p>Time: ${new Date().toLocaleString()}</p>
            <p>This email contains a test-generated PDF attachment.</p>
          `,
                    attachments: [{
                        filename: 'test-document.pdf',
                        path: outputPath
                    }]
                };

                // Send the email
                console.log('Sending email with PDF attachment...');
                const info = await transporter.sendMail(mailOptions);
                emailSent = true;
                console.log('Email sent:', info.messageId);
            } catch (err) {
                console.error('Failed to send email:', err);
                emailError = err.message;
            }
        } else {
            console.warn('Email configuration incomplete - not sending email');
            emailError = 'Email configuration incomplete (missing user or password)';
        }

        // Return the results
        return res.status(200).json({
            success: true,
            message: 'PDF generation test completed',
            pdfGenerated: true,
            pdfPath: outputPath,
            emailSent,
            emailError,
            emailConfig: {
                host: emailConfig.host,
                port: emailConfig.port,
                secure: emailConfig.secure,
                user: emailConfig.auth.user ? 'Set (hidden)' : 'Not set',
                pass: emailConfig.auth.pass ? 'Set (hidden)' : 'Not set'
            },
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        console.error('Error in PDF generation test:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to generate PDF',
            error: error.message,
            stack: error.stack,
            envVars: {
                NODE_ENV: process.env.NODE_ENV || 'Not set',
                EMAIL_HOST: process.env.EMAIL_HOST ? 'Set' : 'Not set',
                EMAIL_PORT: process.env.EMAIL_PORT ? 'Set' : 'Not set',
                EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
                EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set' : 'Not set',
                EMAIL_FROM: process.env.EMAIL_FROM ? 'Set' : 'Not set',
                TMP_DIR: os.tmpdir()
            }
        });
    }
}