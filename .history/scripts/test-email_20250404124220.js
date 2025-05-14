#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

// Get environment variable helper
const getEnvVar = (name, defaultValue = '') => {
    // Try process.env first (Node.js environment)
    if (process.env[name]) {
        return process.env[name] || defaultValue;
    }

    // Try with VITE prefix
    if (process.env[`VITE_${name}`]) {
        return process.env[`VITE_${name}`] || defaultValue;
    }

    // Return default if nothing found
    return defaultValue;
};

// Function to display email configuration
function displayEmailConfig() {
    console.log('\n=== EMAIL CONFIGURATION ===');
    console.log(`Host: ${getEnvVar('EMAIL_HOST', 'Not Set')}`);
    console.log(`Port: ${getEnvVar('EMAIL_PORT', 'Not Set')}`);
    console.log(`Secure: ${getEnvVar('EMAIL_SECURE', 'Not Set')}`);
    console.log(`User: ${getEnvVar('EMAIL_USER', 'Not Set')}`);
    console.log(`Password: ${getEnvVar('EMAIL_PASSWORD') ? '******** (Set)' : 'Not Set'}`);
    console.log(`From: ${getEnvVar('EMAIL_FROM', 'Not Set')}`);
    console.log(`Recipient: ${getEnvVar('EMAIL_RECIPIENT', 'Not Set')}`);
    console.log('===========================\n');
}

// Function to test if PDF files exist
async function checkPdfFiles() {
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');

    console.log('\n=== CHECKING PDF FILES ===');
    try {
        // Check if directory exists
        if (!fs.existsSync(outputDir)) {
            console.error(`❌ Directory does not exist: ${outputDir}`);
            return false;
        }

        // List files in directory
        const files = fs.readdirSync(outputDir);
        const pdfFiles = files.filter(file => file.endsWith('.pdf'));

        if (pdfFiles.length === 0) {
            console.error('❌ No PDF files found in the directory');
            return false;
        }

        // Filter for Test_ PDFs
        const testPdfFiles = pdfFiles.filter(file => file.startsWith('Test_'));

        if (testPdfFiles.length === 0) {
            console.log('⚠️ No Test_ prefixed PDFs found, using first available PDF');
            console.log(`✅ Found ${pdfFiles.length} PDF files:`);
            pdfFiles.forEach(file => {
                console.log(`   - ${file}`);
            });
            return path.join(outputDir, pdfFiles[0]);
        }

        // Sort by creation time (most recent first)
        const sortedTestPdfs = testPdfFiles.map(file => {
            const filePath = path.join(outputDir, file);
            const stats = fs.statSync(filePath);
            return { file, filePath, mtime: stats.mtime };
        }).sort((a, b) => b.mtime - a.mtime);

        console.log(`✅ Found ${testPdfFiles.length} Test PDFs (showing most recent):`);
        sortedTestPdfs.slice(0, 3).forEach(entry => {
            console.log(`   - ${entry.file} (${entry.mtime.toLocaleTimeString()})`);
        });

        // Return the most recent Test_ PDF file
        return sortedTestPdfs[0].filePath;
    } catch (error) {
        console.error('❌ Error checking PDF files:', error);
        return false;
    }
}

// Function to send a test email
async function sendTestEmail(pdfPath) {
    console.log('\n=== SENDING TEST EMAIL ===');

    const host = getEnvVar('EMAIL_HOST');
    const port = parseInt(getEnvVar('EMAIL_PORT', '587'));
    const secure = getEnvVar('EMAIL_SECURE') === 'true';
    const user = getEnvVar('EMAIL_USER');
    const password = getEnvVar('EMAIL_PASSWORD');
    const from = getEnvVar('EMAIL_FROM', user);
    const recipient = getEnvVar('EMAIL_RECIPIENT', 'admin@example.com');

    if (!host || !user || !password) {
        console.error('❌ Missing required email configuration. Please check your .env file');
        return false;
    }

    console.log(`Creating transporter with:\n- Host: ${host}\n- Port: ${port}\n- Secure: ${secure}`);

    try {
        // Create a test account if needed (for testing only)
        let testAccount = null;
        let transporterConfig = {
            host,
            port,
            secure,
            auth: {
                user,
                pass: password
            },
            debug: true, // Enable debug logs
            logger: true // Log to console
        };

        // Create transporter
        const transporter = nodemailer.createTransport(transporterConfig);

        // Verify connection
        console.log('Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully');

        // Create email data
        const mailOptions = {
            from: from,
            to: recipient,
            subject: 'Test Email from PDF Generator',
            text: 'This is a test email to verify email functionality is working correctly.',
            html: '<p>This is a test email to verify email functionality is working correctly.</p>',
            attachments: []
        };

        // Add PDF attachment if available
        if (pdfPath) {
            mailOptions.attachments.push({
                filename: path.basename(pdfPath),
                path: pdfPath,
                contentType: 'application/pdf'
            });
            console.log(`📎 Attaching PDF: ${path.basename(pdfPath)}`);
        }

        // Send email
        console.log(`📧 Sending email to: ${recipient}`);
        const info = await transporter.sendMail(mailOptions);

        // Display result
        console.log('✅ Email sent successfully!');
        console.log(`📫 Message ID: ${info.messageId}`);

        if (testAccount) {
            console.log(`📝 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }

        return true;
    } catch (error) {
        console.error('❌ Error sending test email:', error);
        console.log('\nPossible solutions:');
        console.log('1. Check your email credentials in the .env file');
        console.log('2. Make sure your email provider allows SMTP access');
        console.log('3. For Gmail, make sure you\'re using an App Password if 2FA is enabled');
        console.log('4. Check your firewall or antivirus isn\'t blocking the connection');
        console.log('5. Try using a different email service for testing (like Mailtrap.io)');

        return false;
    }
}

// Main function
async function main() {
    console.log('=== EMAIL TEST UTILITY ===');

    // Display current email configuration
    displayEmailConfig();

    // Check if PDF files exist
    const pdfPath = await checkPdfFiles();

    // Send test email
    const success = await sendTestEmail(pdfPath);

    if (success) {
        console.log('\n✅ Email test completed successfully!');
    } else {
        console.error('\n❌ Email test failed. Please check the logs above for details.');
    }
}

// Run the main function
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});