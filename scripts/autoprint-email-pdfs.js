#!/usr/bin/env node

/**
 * Email PDF Auto-Printer
 * 
 * This script monitors an email inbox (debbie@parealestatesupport.com)
 * and automatically prints any PDF attachments that arrive.
 * 
 * It uses IMAP to connect to the email server and monitor for new messages,
 * then extracts and prints the PDF attachments using a local printer.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { execSync } from 'child_process';
import { createInterface } from 'readline';

// Load environment variables
dotenv.config();

// Get the directory name using ES modules compatible approach
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_DIR = path.join(__dirname, '..', 'temp-pdf-attachments');

// Ensure the temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Command to check which printers are available (platform specific)
const getPrinterListCommand = process.platform === 'win32' ?
    'powershell -command "Get-Printer | Select-Object Name"' :
    'lpstat -p | cut -d" " -f2';

// Function to get default printer name
function getDefaultPrinter() {
    try {
        if (process.platform === 'win32') {
            const output = execSync('powershell -command "Get-WmiObject -Query \\"SELECT * FROM Win32_Printer WHERE Default = TRUE\\" | Select-Object -expand Name"').toString().trim();
            return output;
        } else {
            // For macOS/Linux
            const output = execSync('lpstat -d').toString().trim();
            const match = output.match(/system default destination: (.+)/);
            return match ? match[1] : null;
        }
    } catch (error) {
        console.error('Error getting default printer:', error.message);
        return null;
    }
}

// Function to get all available printers
function getAvailablePrinters() {
    try {
        const output = execSync(getPrinterListCommand).toString();
        const printers = output.split('\n')
            .filter(line => line.trim())
            .map(line => line.trim())
            .filter(line => !line.startsWith('Name') && !line.startsWith('----')); // Remove headers from PowerShell output

        return printers;
    } catch (error) {
        console.error('Error listing printers:', error.message);
        return [];
    }
}

// Function to print a PDF file
function printPDF(filePath, printerName) {
    try {
        let command;

        if (process.platform === 'win32') {
            // For Windows, use PowerShell's PrintOut method
            command = `powershell -command "(New-Object -ComObject WScript.Shell).Run('rundll32 printui.dll,PrintUIEntry /y /n \\"${printerName}\\" /f \\"${filePath}\\"', 0, $true)"`;
        } else {
            // For macOS/Linux
            command = `lp -d "${printerName}" "${filePath}"`;
        }

        console.log(`Printing ${path.basename(filePath)} to ${printerName}...`);
        execSync(command);
        console.log(`✅ Successfully sent ${path.basename(filePath)} to printer!`);
        return true;
    } catch (error) {
        console.error(`❌ Error printing file: ${error.message}`);
        return false;
    }
}

// Configure email monitoring
function configureEmailMonitor(printerName) {
    // Email configuration
    const imapConfig = {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        host: process.env.EMAIL_HOST === 'smtp.gmail.com' ? 'imap.gmail.com' : process.env.EMAIL_HOST,
        port: 993, // Standard IMAP SSL port
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    };

    // Create IMAP connection
    const imap = new Imap(imapConfig);

    // On connection ready
    imap.once('ready', () => {
        console.log('✅ Connected to email server!');
        console.log(`📧 Monitoring ${imapConfig.user} for new emails with PDF attachments...`);
        console.log(`🖨️ Will print to: ${printerName}`);

        // Open the INBOX
        imap.openBox('INBOX', false, (err, box) => {
            if (err) {
                console.error('Error opening inbox:', err);
                return;
            }

            // Listen for new emails
            imap.on('mail', (numNewMsgs) => {
                console.log(`📥 Detected ${numNewMsgs} new message(s)!`);

                // Search for unread messages
                imap.search(['UNSEEN'], (err, results) => {
                    if (err || !results || !results.length) {
                        console.log('No new unread messages found');
                        return;
                    }

                    console.log(`Processing ${results.length} unread message(s)...`);

                    // Create a message fetch stream
                    const f = imap.fetch(results, { bodies: '', markSeen: true });

                    f.on('message', (msg, seqno) => {
                        console.log(`📩 Processing email #${seqno}...`);

                        msg.on('body', (stream, info) => {
                            // Parse the message
                            simpleParser(stream, async(err, parsed) => {
                                if (err) {
                                    console.error('Error parsing message:', err);
                                    return;
                                }

                                const from = parsed.from ? parsed.from.text : 'Unknown';
                                const subject = parsed.subject || 'No Subject';

                                console.log(`Email from: ${from}`);
                                console.log(`Subject: ${subject}`);

                                // Check if there are attachments
                                if (parsed.attachments && parsed.attachments.length > 0) {
                                    console.log(`Found ${parsed.attachments.length} attachment(s)`);

                                    // Process each attachment
                                    for (const attachment of parsed.attachments) {
                                        // Check if it's a PDF
                                        if (attachment.contentType === 'application/pdf' ||
                                            (attachment.filename && attachment.filename.toLowerCase().endsWith('.pdf'))) {

                                            console.log(`🔍 Found PDF attachment: ${attachment.filename}`);

                                            // Save the attachment temporarily
                                            const filePath = path.join(TEMP_DIR, attachment.filename || `attachment-${Date.now()}.pdf`);
                                            fs.writeFileSync(filePath, attachment.content);

                                            console.log(`💾 Saved to: ${filePath}`);

                                            // Print the PDF
                                            const success = printPDF(filePath, printerName);

                                            if (success) {
                                                console.log(`✅ Successfully printed: ${attachment.filename}`);
                                            } else {
                                                console.error(`❌ Failed to print: ${attachment.filename}`);
                                            }
                                        }
                                    }
                                } else {
                                    console.log('No attachments found in this email');
                                }
                            });
                        });
                    });

                    f.once('error', (err) => {
                        console.error('Error fetching messages:', err);
                    });

                    f.once('end', () => {
                        console.log('Finished processing new messages');
                    });
                });
            });
        });
    });

    // Handle connection errors
    imap.once('error', (err) => {
        console.error('IMAP connection error:', err);
    });

    // When connection ends
    imap.once('end', () => {
        console.log('IMAP connection ended');

        // Try to reconnect after 30 seconds
        console.log('Will attempt to reconnect in 30 seconds...');
        setTimeout(() => {
            console.log('Attempting to reconnect...');
            try {
                imap.connect();
            } catch (error) {
                console.error('Error reconnecting:', error);
            }
        }, 30000);
    });

    // Connect to the IMAP server
    try {
        imap.connect();
    } catch (error) {
        console.error('Error connecting to IMAP server:', error);
        process.exit(1);
    }
}

// Main function to run the email monitoring
async function main() {
    console.log('\n=== EMAIL PDF AUTO-PRINTER ===\n');

    // Check if email credentials are available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.EMAIL_HOST) {
        console.error('❌ Error: Email credentials not found in .env file');
        console.error('Please make sure EMAIL_USER, EMAIL_PASSWORD, and EMAIL_HOST are set');
        process.exit(1);
    }

    console.log(`Monitoring inbox for: ${process.env.EMAIL_USER}`);

    // Get default printer
    const defaultPrinter = getDefaultPrinter();
    console.log(`Default printer: ${defaultPrinter || 'None detected'}`);

    // Get all available printers
    const printers = getAvailablePrinters();
    console.log('\nAvailable printers:');
    printers.forEach((printer, index) => {
        console.log(`${index + 1}. ${printer}${printer === defaultPrinter ? ' (default)' : ''}`);
    });

    // If no printers are available, exit
    if (printers.length === 0) {
        console.error('❌ Error: No printers found on the system');
        console.error('Please install and configure a printer before running this script');
        process.exit(1);
    }

    // Create readline interface for user input
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Ask user to select a printer
    rl.question(`\nSelect printer number to use (1-${printers.length}) or press Enter for default: `, (answer) => {
        let selectedPrinter;

        if (!answer.trim() && defaultPrinter) {
            selectedPrinter = defaultPrinter;
            console.log(`Using default printer: ${selectedPrinter}`);
        } else {
            const printerIndex = parseInt(answer) - 1;
            if (isNaN(printerIndex) || printerIndex < 0 || printerIndex >= printers.length) {
                console.error('❌ Invalid selection. Using default printer instead.');
                selectedPrinter = defaultPrinter || printers[0];
            } else {
                selectedPrinter = printers[printerIndex];
            }
        }

        console.log(`Selected printer: ${selectedPrinter}`);
        rl.close();

        // Start monitoring emails
        configureEmailMonitor(selectedPrinter);
    });
}

// Run the main function
main();