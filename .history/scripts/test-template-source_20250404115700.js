#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import fs from 'fs';
import { promises as fs_promises } from 'fs';
import puppeteer from 'puppeteer';

// Script constants
const TEMPLATE_SOURCES = {
    standard: 'Using standard templates from public/templates',
    original: 'Using original templates from root directory',
    pdf: 'Using original PDFs from root directory'
};

// Get command line arguments
const args = process.argv.slice(2);
const source = args[0] ? .toLowerCase() || 'standard';

// Set up paths based on template source
const rootDir = process.cwd();
const outputDir = path.join(rootDir, 'public', 'generated-pdfs');

// Template mapping based on source
let templatePaths;
let useMethod;
let prefix;

if (source === 'original') {
    templatePaths = {
        'Buyer': path.join(rootDir, 'Buyer.html'),
        'Seller': path.join(rootDir, 'Seller.html'),
        'DualAgent': path.join(rootDir, 'DualAgent.html')
    };
    useMethod = 'generate';
    prefix = 'Original';
} else if (source === 'pdf') {
    templatePaths = {
        'Buyer': path.join(rootDir, 'Buyers-Agent.pdf'),
        'Seller': path.join(rootDir, 'Listing-Agent.pdf'),
        'DualAgent': path.join(rootDir, 'Dual-Agent.pdf')
    };
    useMethod = 'copy';
    prefix = 'PDF';
} else {
    templatePaths = {
        'Buyer': path.join(rootDir, 'public', 'templates', 'Buyer.html'),
        'Seller': path.join(rootDir, 'public', 'templates', 'Seller.html'),
        'DualAgent': path.join(rootDir, 'public', 'templates', 'DualAgent.html')
    };
    useMethod = 'generate';
    prefix = 'Standard';
}

// Create output directory if it doesn't exist
async function ensureDirectories() {
    try {
        // Ensure the output directory exists
        await fs_promises.mkdir(outputDir, { recursive: true });
        console.log('✅ Output directory created/verified successfully');

        // If using standard templates, also ensure templates directory exists
        if (source === 'standard') {
            const templatesDir = path.join(rootDir, 'public', 'templates');
            await fs_promises.mkdir(templatesDir, { recursive: true });
            console.log('✅ Templates directory created/verified successfully');
        }

        return true;
    } catch (error) {
        console.error('❌ Error creating directories:', error);
        return false;
    }
}

// Check if templates exist
async function checkTemplates() {
    for (const [templateKey, templatePath] of Object.entries(templatePaths)) {
        try {
            await fs_promises.access(templatePath);
            console.log(`✅ Found ${source} template: ${path.basename(templatePath)}`);
        } catch (error) {
            console.error(`❌ Template not found: ${templatePath}`);
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

/**
 * Copy an existing PDF file
 */
async function copyPdf(sourcePath, outputPath) {
    try {
        await fs_promises.copyFile(sourcePath, outputPath);
        console.log(`✅ Copied PDF: ${outputPath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error copying PDF from ${sourcePath} to ${outputPath}:`, error);
        return false;
    }
}

// Main function
async function main() {
    console.log(`=== ${TEMPLATE_SOURCES[source]} ===`);

    // Ensure directories exist
    const dirsOk = await ensureDirectories();
    if (!dirsOk) return;

    // Check if templates exist
    const templatesOk = await checkTemplates();
    if (!templatesOk) {
        console.error(`\n❌ One or more templates are missing for source: ${source}`);
        return;
    }

    // Generate/copy PDFs for each template
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const templates = [
        { name: 'Buyer', label: "Buyer's Agent" },
        { name: 'Seller', label: "Listing Agent" },
        { name: 'DualAgent', label: "Dual Agent" }
    ];

    // Sample data to populate the templates (only used for HTML templates)
    const templateData = {
        agentName: 'John Test Smith',
        propertyAddress: '123 Test Street, Philadelphia, PA 19123',
        clientNames: 'Test Client, Another Client',
        commissionAmount: '10,500',
        transactionDate: new Date().toLocaleDateString()
    };

    for (const template of templates) {
        const templatePath = templatePaths[template.name];
        const outputPath = path.join(outputDir, `${prefix}_${template.name}_${timestamp}.pdf`);

        console.log(`\n🧪 Processing ${template.label}...`);

        if (useMethod === 'generate') {
            await generatePdfFromTemplate(templatePath, outputPath, templateData);
        } else if (useMethod === 'copy') {
            await copyPdf(templatePath, outputPath);
        }
    }

    // Display results
    console.log('\n=== PDF PROCESSING COMPLETED ===');
    console.log(`✅ PDFs were generated/copied to: ${outputDir}`);
    console.log(`📂 ${outputDir}`);
    console.log('📋 To view the PDFs, open them in your file explorer:');
    console.log(`   ${path.resolve(outputDir)}`);
}

// Run the main function
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});