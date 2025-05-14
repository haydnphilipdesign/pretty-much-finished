#!/usr/bin/env node

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function testEmailApi() {
    console.log('=== TESTING EMAIL API ===');

    // Get the recipient from environment or from user input
    const defaultRecipient = process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER || '';

    const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

    const recipient = await askQuestion(`Recipient email (default: ${defaultRecipient}): `) || defaultRecipient;

    if (!recipient) {
        console.error('Error: No recipient email provided. Please provide a recipient email or set EMAIL_RECIPIENT in .env');
        process.exit(1);
    }

    console.log(`\nSending test email to: ${recipient}`);

    try {
        const serverUrl = process.env.SERVER_API_URL || 'http://localhost:3001';

        const response = await fetch(`${serverUrl}/api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: recipient,
                subject: 'Test Email from PA Real Estate Support Services',
                body: `
          <h1>Test Email</h1>
          <p>This is a test email from the PA Real Estate Support Services application.</p>
          <p>If you received this email, the email sending functionality is working correctly.</p>
          <p>Time sent: ${new Date().toLocaleString()}</p>
        `
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send email');
        }

        console.log('\n✅ Email sent successfully!');
        console.log(`Message ID: ${data.messageId}`);
        console.log('Please check your inbox (or spam folder) for the test email.');
    } catch (error) {
        console.error('\n❌ Error sending email:', error.message);
        console.error('Make sure the server is running and accessible at http://localhost:3001');
    } finally {
        rl.close();
    }
}

testEmailApi();