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

// Function to get the most recent PDFs for all three types
async function getMostRecentPdfs() {
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

        // Filter for Test_ PDFs for each type
        const buyerPdfs = pdfFiles.filter(file => file.startsWith('Test_Buyer_'));
        const sellerPdfs = pdfFiles.filter(file => file.startsWith('Test_Seller_'));
        const dualAgentPdfs = pdfFiles.filter(file => file.startsWith('Test_DualAgent_'));

        console.log(`Found: ${buyerPdfs.length} Buyer PDFs, ${sellerPdfs.length} Seller PDFs, ${dualAgentPdfs.length} DualAgent PDFs`);

        const result = {};

        // Get most recent Buyer PDF
        if (buyerPdfs.length > 0) {
            const sortedBuyerPdfs = buyerPdfs.map(file => {
                const filePath = path.join(outputDir, file);
                const stats = fs.statSync(filePath);
                return { file, filePath, mtime: stats.mtime };
            }).sort((a, b) => b.mtime - a.mtime);

            result.buyer = sortedBuyerPdfs[0].filePath;
            console.log(`✅ Most recent Buyer PDF: ${sortedBuyerPdfs[0].file}`);
        }

        // Get most recent Seller PDF
        if (sellerPdfs.length > 0) {
            const sortedSellerPdfs = sellerPdfs.map(file => {
                const filePath = path.join(outputDir, file);
                const stats = fs.statSync(filePath);
                return { file, filePath, mtime: stats.mtime };
            }).sort((a, b) => b.mtime - a.mtime);

            result.seller = sortedSellerPdfs[0].filePath;
            console.log(`✅ Most recent Seller PDF: ${sortedSellerPdfs[0].file}`);
        }

        // Get most recent DualAgent PDF
        if (dualAgentPdfs.length > 0) {
            const sortedDualAgentPdfs = dualAgentPdfs.map(file => {
                const filePath = path.join(outputDir, file);
                const stats = fs.statSync(filePath);
                return { file, filePath, mtime: stats.mtime };
            }).sort((a, b) => b.mtime - a.mtime);

            result.dualAgent = sortedDualAgentPdfs[0].filePath;
            console.log(`✅ Most recent DualAgent PDF: ${sortedDualAgentPdfs[0].file}`);
        }

        if (Object.keys(result).length === 0) {
            console.error('❌ No Test_ prefixed PDFs found');
            return false;
        }

        return result;
    } catch (error) {
        console.error('❌ Error checking PDF files:', error);
        return false;
    }
}

// Function to send a test email with all three PDFs
async function sendTestEmail(pdfPaths) {
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
            subject: 'PA Real Estate Support Services - Cover Sheet PDFs',
            text: 'This email contains the most recent test cover sheet PDFs for Buyer, Seller, and Dual Agent roles.',
            html: `
                <h2>PA Real Estate Support Services - Cover Sheet PDFs</h2>
                <p>This email contains the most recent test cover sheet PDFs for all agent roles:</p>
                <ul>
                    ${pdfPaths.buyer ? '<li>Buyer\'s Agent Cover Sheet</li>' : ''}
                    ${pdfPaths.seller ? '<li>Listing Agent Cover Sheet</li>' : ''}
                    ${pdfPaths.dualAgent ? '<li>Dual Agent Cover Sheet</li>' : ''}
                </ul>
                <p>Please review the attached PDFs to ensure they contain the correct information.</p>
            `,
            attachments: []
        };

        // Add PDF attachments
        if (pdfPaths.buyer) {
            mailOptions.attachments.push({
                filename: path.basename(pdfPaths.buyer),
                path: pdfPaths.buyer,
                contentType: 'application/pdf'
            });
            console.log(`📎 Attaching Buyer PDF: ${path.basename(pdfPaths.buyer)}`);
        }

        if (pdfPaths.seller) {
            mailOptions.attachments.push({
                filename: path.basename(pdfPaths.seller),
                path: pdfPaths.seller,
                contentType: 'application/pdf'
            });
            console.log(`📎 Attaching Seller PDF: ${path.basename(pdfPaths.seller)}`);
        }

        if (pdfPaths.dualAgent) {
            mailOptions.attachments.push({
                filename: path.basename(pdfPaths.dualAgent),
                path: pdfPaths.dualAgent,
                contentType: 'application/pdf'
            });
            console.log(`📎 Attaching DualAgent PDF: ${path.basename(pdfPaths.dualAgent)}`);
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

    // Get the most recent PDFs for all three types
    const pdfPaths = await getMostRecentPdfs();

    // Send test email
    const success = await sendTestEmail(pdfPaths);

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