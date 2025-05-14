#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import fs from 'fs';
import { promises as fs_promises } from 'fs';
import puppeteer from 'puppeteer';

// Set up paths
const templatesDir = path.join(process.cwd(), 'public', 'templates');
const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');

// Create output directory if it doesn't exist
async function ensureDirectories() {
    try {
        // Only ensure the output directory exists, don't touch templates
        await fs_promises.mkdir(outputDir, { recursive: true });
        console.log('✅ Output directory created/verified successfully');
        return true;
    } catch (error) {
        console.error('❌ Error creating output directory:', error);
        return false;
    }
}

// Check if templates exist
async function checkTemplates() {
    const templates = ['Buyer.html', 'Seller.html', 'DualAgent.html'];

    for (const template of templates) {
        const templatePath = path.join(templatesDir, template);
        try {
            await fs_promises.access(templatePath);
            console.log(`✅ Found template: ${template}`);
        } catch (error) {
            console.error(`❌ Template not found: ${template}`);
            return false;
        }
    }

    return true;
}

/**
 * Generate a PDF from an HTML template
 */
async function generatePdfFromTemplate(templatePath, outputPath, replacements) {
    try {
        // Read the template file
        let templateContent = await fs_promises.readFile(templatePath, 'utf-8');

        // Process conditional placeholders first
        // Handle {{#if field}}content{{/if}} syntax
        templateContent = templateContent.replace(/\{\{#if\s+([^}]+)\}\}(.*?)\{\{\/if\}\}/gs, (match, field, content) => {
            // Check if the field exists and is truthy in replacements
            if (replacements[field]) {
                return content;
            }
            return '';
        });

        // Handle {{#unless field}}content{{/unless}} syntax
        templateContent = templateContent.replace(/\{\{#unless\s+([^}]+)\}\}(.*?)\{\{\/unless\}\}/gs, (match, field, content) => {
            // Check if the field doesn't exist or is falsy in replacements
            if (!replacements[field]) {
                return content;
            }
            return '';
        });

        // Handle {{#eq field "value"}}content{{/eq}} syntax
        templateContent = templateContent.replace(/\{\{#eq\s+([^\s]+)\s+"([^"]+)"\}\}(.*?)\{\{\/eq\}\}/gs, (match, field, value, content) => {
            // Check if the field equals the specified value
            if (replacements[field] === value) {
                return content;
            }
            return '';
        });

        // Replace regular placeholders
        for (const [key, value] of Object.entries(replacements)) {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            templateContent = templateContent.replace(regex, value);
        }

        // Launch a browser
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            // Create a new page
            const page = await browser.newPage();

            // Set content
            await page.setContent(templateContent, { waitUntil: 'networkidle0' });

            // Generate PDF
            await page.pdf({
                path: outputPath,
                format: 'letter',
                printBackground: true,
                margin: { top: '0.2in', right: '0.2in', bottom: '0.2in', left: '0.2in' },
            });

            console.log(`✅ Generated PDF: ${outputPath}`);
            return true;
        } finally {
            await browser.close();
        }
    } catch (error) {
        console.error(`❌ Error generating PDF from template ${templatePath}:`, error);
        return false;
    }
}

// Main function
async function main() {
    console.log('=== GENERATING PDFs FROM EXISTING TEMPLATES ===');

    // Ensure output directory exists
    const dirsOk = await ensureDirectories();
    if (!dirsOk) return;

    // Check if templates exist
    const templatesOk = await checkTemplates();
    if (!templatesOk) {
        console.error(`\n❌ One or more template files are missing from ${templatesDir}`);
        console.log('Please ensure all template files (Buyer.html, Seller.html, DualAgent.html) exist');
        return;
    }

    // Generate PDFs for each template
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const templates = [
        { name: 'Buyer', label: "Buyer's Agent" },
        { name: 'Seller', label: "Listing Agent" },
        { name: 'DualAgent', label: "Dual Agent" }
    ];

    // Sample data to populate the templates
    const templateData = {
        agentName: 'John Test Smith',
        propertyAddress: '123 Test Street, Philadelphia, PA 19123',
        clientNames: 'Test Client, Another Client',
        commissionAmount: '10,500',
        transactionDate: new Date().toLocaleDateString(),

        fldypnfnHhplWYcCW: '123 Test Street, Philadelphia, PA 19123',
        fld6O2FgIXQU5G27o: 'MLS12345',
        fldHnptIRXVXOTdA5: 'Buyer Test Client',
        fldSqxNOZ9B5PgSab: 'Seller Test Client',
        fldFD4xHD0vxnSOHJ: 'John Test Smith',
        flduuQQT7o6XAGlRe: '3',
        fld5KRrToAAt5kOLd: '3',
        fldE8INzEorBtx2uN: '6',
        fldhHjBZJISmnP8SK: '350,000',
        fldzVtmn8uylVxuTF: '5,000',
        fldrh8eB5V8TjSZlR: 'ABC123',
        fldV2eLxz6w0TpLFU_OCCUPIED: true,
        fldExdgBDgdB1i9jy: true,
        fld7TTQpaC83ehY7H: 'LOCKBOX',
        fldw3GlfvKtyNfIAW: true,
        fldtfGggmJH44kMeB: '100 Buyer Ave, Philadelphia, PA 19123',
        fldryOvt1GXiWRUGv: '215-555-6789',
        fldkAoLYoVQ1Pq6hO: 'buyer@example.com',
        fldz1IpeR1256LhuC: '200 Seller St, Philadelphia, PA 19123',
        fldBnh8W6iGW014yY: '215-555-4321',
        flddP6a8EG6qTJdIi: 'seller@example.com',
        fld4YZ0qKHvRLK4Xg: 'John Attorney',
        fldqeArDeRkxiYz9u: 'Test Title Company',
        fldeHKiUreeDs5n4o: true,
        fld9oG6SMAkh4hvNL: 'Test HOA',
        fld9Qw4mGeI9kk42F: 'Philadelphia',
        fldRtNEH89tNNX52B: 'Test Warranty Company',
        fldxH1pCpohty1e2b: '550',
        fld61RStU7sCDrG01: 'SELLER',
        fldewmjoaJVwiMF46: '25',
        fldDWN8jU4kdCffzu: 'Test special instructions',
        fld30htJ7euVerCLW: 'This is a test transaction',
        fldgW16aPdFMdspO6: 'Urgent issue note'
    };

    for (const template of templates) {
        const templatePath = path.join(templatesDir, `${template.name}.html`);
        const outputPath = path.join(outputDir, `Test_${template.name}_${timestamp}.pdf`);

        console.log(`\n🧪 Generating PDF for ${template.label}...`);
        await generatePdfFromTemplate(templatePath, outputPath, templateData);
    }

    // Display results
    console.log('\n=== PDF GENERATION COMPLETED ===');
    console.log(`✅ PDFs were generated in: ${outputDir}`);
    console.log(`📂 ${outputDir}`);
    console.log('📋 To view the PDFs, open them in your file explorer:');
    console.log(`   ${path.resolve(outputDir)}`);
}

// Run the main function
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});