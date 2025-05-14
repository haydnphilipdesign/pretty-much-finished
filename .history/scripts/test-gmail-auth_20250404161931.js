#!/usr/bin/env node

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

// Get Gmail credentials from environment
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true';
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';

/**
 * Test Gmail SMTP authentication
 */
async function testGmailAuth() {
    console.log(chalk.blue('\n=== TESTING GMAIL AUTHENTICATION ==='));

    if (!EMAIL_USER || !EMAIL_PASSWORD) {
        console.log(chalk.red('❌ ERROR: Missing Gmail credentials in .env file'));
        console.log('Please ensure EMAIL_USER and EMAIL_PASSWORD are set in your .env file');
        return false;
    }

    console.log(chalk.yellow('Connecting to Gmail SMTP server with these settings:'));
    console.log(`Host: ${EMAIL_HOST}`);
    console.log(`Port: ${EMAIL_PORT}`);
    console.log(`Secure: ${EMAIL_SECURE}`);
    console.log(`User: ${EMAIL_USER}`);
    console.log(`Password: ${'*'.repeat(Math.min(EMAIL_PASSWORD.length, 10))}`);

    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: EMAIL_HOST,
            port: EMAIL_PORT,
            secure: EMAIL_SECURE,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD
            },
            debug: true // Enable debug mode for detailed logs
        });

        console.log(chalk.yellow('\nVerifying connection...'));

        // Verify the connection
        await transporter.verify();

        console.log(chalk.green('✅ SUCCESS: Successfully authenticated with Gmail SMTP'));
        console.log('Your Gmail credentials are working correctly!');

        console.log(chalk.yellow('\nTesting sending capabilities...'));

        // Try to send a test email to the same account (just for testing connectivity)
        const info = await transporter.sendMail({
            from: EMAIL_USER,
            to: EMAIL_USER, // Send to self as a test
            subject: 'SMTP Connection Test',
            text: 'If you receive this email, your SMTP connection is working correctly!',
            html: `
        <h1>SMTP Test Successful</h1>
        <p>If you are seeing this email, your SMTP connection to Gmail is working correctly.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `
        });

        console.log(chalk.green(`✅ SUCCESS: Test email sent! Message ID: ${info.messageId}`));
        console.log(`The test email was sent to: ${EMAIL_USER}`);
        console.log('Please check your inbox (and spam folder) to confirm receipt.');
        return true;
    } catch (error) {
        console.log(chalk.red(`❌ ERROR: ${error.message}`));

        // Provide helpful troubleshooting tips based on the error
        if (error.message.includes('Invalid login')) {
            console.log('\nTROUBLESHOOTING TIPS:');
            console.log('1. Verify your Gmail password is correct');
            console.log('2. For Gmail, you need to use an "App Password" instead of your regular password:');
            console.log('   - Go to https://myaccount.google.com/apppasswords');
            console.log('   - Log in with your Google account');
            console.log('   - Generate a new app password for "Mail" and "Other"');
            console.log('   - Copy the generated password to your .env file');
            console.log('3. Make sure 2-factor authentication is enabled for your Google account');
        } else if (error.message.includes('certificate')) {
            console.log('\nTROUBLESHOOTING TIPS:');
            console.log('1. There appears to be an SSL/certificate issue');
            console.log('2. Try setting EMAIL_SECURE=false in your .env file');
        } else if (error.code === 'ETIMEDOUT' || error.code === 'ENETUNREACH') {
            console.log('\nTROUBLESHOOTING TIPS:');
            console.log('1. Check your internet connection');
            console.log('2. Your network might be blocking outgoing SMTP connections (common in corporate networks)');
            console.log('3. Try a different network or use a VPN');
        }

        return false;
    }
}

// Run the test
testGmailAuth()
    .then(success => {
        console.log('\n');
        if (success) {
            console.log(chalk.green('Gmail authentication test completed successfully!'));
        } else {
            console.log(chalk.red('Gmail authentication test failed. Please check the errors above.'));
        }
        process.exit(success ? 0 : 1);
    })
    .catch(err => {
        console.error('Unexpected error:', err);
        process.exit(1);
    });