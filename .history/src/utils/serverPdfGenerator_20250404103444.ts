import Airtable from 'airtable';
import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';
import { AgentRole } from '@/types/transaction';

// Get environment variable helper
const getEnvVar = (name: string, defaultValue: string = ''): string => {
  // Try process.env first (Node.js environment)
  if (process.env[name]) {
    return process.env[name] || defaultValue;
  }
  
  // Then try import.meta.env (Vite environment)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[name] || defaultValue;
  }
  
  // Try with NEXT_PUBLIC prefix
  if (process.env[`NEXT_PUBLIC_${name}`]) {
    return process.env[`NEXT_PUBLIC_${name}`] || defaultValue;
  }
  
  // Try with VITE prefix
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[`VITE_${name}`] || defaultValue;
  }
  
  return defaultValue;
};

// Configure Airtable
const configureAirtable = (): Airtable.Base => {
  const apiKey = getEnvVar('AIRTABLE_API_KEY') || getEnvVar('VITE_AIRTABLE_API_KEY') || '';
  const baseId = getEnvVar('AIRTABLE_BASE_ID') || getEnvVar('VITE_AIRTABLE_BASE_ID') || '';
  
  return new Airtable({ apiKey }).base(baseId);
};

// Initialize Airtable with your configuration
const airtableBase = configureAirtable();

// Constants for template paths
const TEMPLATE_PATHS = {
  'BUYERS AGENT': path.resolve(process.cwd(), 'Buyer.html'),
  'LISTING AGENT': path.resolve(process.cwd(), 'Seller.html'),
  'DUAL AGENT': path.resolve(process.cwd(), 'DualAgent.html'),
};

interface AirtableFieldMapping {
  fieldId: string;
  cssSelector: string;
  valueType: 'text' | 'checkbox' | 'radio';
  transform?: (value: any) => any;
}

// Field mappings for Buyer Agent Cover Sheet
const buyerAgentMappings: AirtableFieldMapping[] = [
  // Header section
  { fieldId: 'fld6O2FgIXQU5G27o', cssSelector: '.info-field:nth-child(2) .line', valueType: 'text' }, // MLS Number
  { fieldId: 'fldypnfnHhplWYcCW', cssSelector: '.info-field:first-child .line', valueType: 'text' }, // Property Address
  { fieldId: 'fldFD4xHD0vxnSOHJ', cssSelector: '.info-row:nth-child(2) .info-field:nth-child(4) .line', valueType: 'text' }, // Agent
  
  // Buyer information
  { fieldId: 'fldSqxNOZ9B5PgSab', cssSelector: '.right-column .section-container:first-child .detail-line:nth-child(1) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'BUYER')?.name }, // Buyer Name
  { fieldId: 'flddP6a8EG6qTJdIi', cssSelector: '.right-column .section-container:first-child .detail-line:nth-child(4) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'BUYER')?.email }, // Buyer Email
  { fieldId: 'fldBnh8W6iGW014yY', cssSelector: '.right-column .section-container:first-child .detail-line:nth-child(3) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'BUYER')?.phone }, // Buyer Phone
  { fieldId: 'fldz1IpeR1256LhuC', cssSelector: '.right-column .section-container:first-child .detail-line:nth-child(2) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'BUYER')?.address }, // Buyer Address
  
  // Commission details
  { fieldId: 'fld5KRrToAAt5kOLd', cssSelector: '.commission-details-section .commission-grid-item:first-child .underline', valueType: 'text' }, // Buyer's Agent %
  { fieldId: 'fldzVtmn8uylVxuTF', cssSelector: '.referral-section .single-field-line .line', valueType: 'text' }, // Referral Party
  { fieldId: 'fldewmjoaJVwiMF46', cssSelector: '.referral-section .single-field-line .percentage', valueType: 'text' }, // Referral Fee
  { fieldId: 'fldhHjBZJISmnP8SK', cssSelector: '.quick-reference-box .single-field-line:nth-child(3) .line', valueType: 'text' }, // Sale Price
  { fieldId: 'fldTvXx96Na0zRh6W', cssSelector: '.quick-reference-box .single-field-line:nth-child(4) .line', valueType: 'text' }, // Seller's Assist
  
  // Checkboxes and additional fields
  { fieldId: 'fldLVyXkhqppQ7WpC', cssSelector: '#ref-yes', valueType: 'checkbox', transform: (value) => value === true }, // Is Referral
  { fieldId: 'fldeHKiUreeDs5n4o', cssSelector: '#rofr', valueType: 'checkbox', transform: (value) => value === true }, // First Right of Refusal
  { fieldId: 'fld9oG6SMAkh4hvNL', cssSelector: '.hoa-information .field-pair-item:first-child .line', valueType: 'text' }, // HOA
  { fieldId: 'fld9Qw4mGeI9kk42F', cssSelector: '.certificate-of-occupancy .single-field-line .line', valueType: 'text' }, // Municipality
  { fieldId: 'fld4YZ0qKHvRLK4Xg', cssSelector: '.attorney .detail-line:first-child .line', valueType: 'text' }, // Attorney
  { fieldId: 'fldqeArDeRkxiYz9u', cssSelector: '.title-agent-information .detail-line:first-child .line', valueType: 'text' }, // Title Company
];

// Field mappings for Seller Agent Cover Sheet
const sellerAgentMappings: AirtableFieldMapping[] = [
  // Header section
  { fieldId: 'fld6O2FgIXQU5G27o', cssSelector: '.info-field:nth-child(2) .line', valueType: 'text' }, // MLS Number
  { fieldId: 'fldypnfnHhplWYcCW', cssSelector: '.info-field:first-child .line', valueType: 'text' }, // Property Address
  { fieldId: 'fldFD4xHD0vxnSOHJ', cssSelector: '.info-row:nth-child(2) .info-field:nth-child(4) .line', valueType: 'text' }, // Agent
  
  // Seller information
  { fieldId: 'fldSqxNOZ9B5PgSab', cssSelector: '.right-column .section-container:first-child .detail-line:nth-child(1) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'SELLER')?.name }, // Seller Name
  { fieldId: 'flddP6a8EG6qTJdIi', cssSelector: '.right-column .section-container:first-child .detail-line:nth-child(4) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'SELLER')?.email }, // Seller Email
  { fieldId: 'fldBnh8W6iGW014yY', cssSelector: '.right-column .section-container:first-child .detail-line:nth-child(3) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'SELLER')?.phone }, // Seller Phone
  { fieldId: 'fldz1IpeR1256LhuC', cssSelector: '.right-column .section-container:first-child .detail-line:nth-child(2) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'SELLER')?.address }, // Seller Address
  
  // Commission details
  { fieldId: 'flduuQQT7o6XAGlRe', cssSelector: '.commission-details-section .commission-grid-item:first-child .underline', valueType: 'text' }, // Listing Agent %
  { fieldId: 'fld5KRrToAAt5kOLd', cssSelector: '.commission-details-section .commission-grid-item:nth-child(2) .underline', valueType: 'text' }, // Buyer's Agent %
  { fieldId: 'fldE8INzEorBtx2uN', cssSelector: '.commission-details-section .commission-grid-item:nth-child(3) .underline', valueType: 'text' }, // Total Commission %
  { fieldId: 'fldhHjBZJISmnP8SK', cssSelector: '.quick-reference-box .single-field-line:nth-child(3) .line', valueType: 'text' }, // Sale Price
  
  // Property status
  { fieldId: 'fldV2eLxz6w0TpLFU', cssSelector: '#occupied', valueType: 'radio', transform: (value) => value === 'OCCUPIED' }, // Occupied
  { fieldId: 'fldV2eLxz6w0TpLFU', cssSelector: '#vacant', valueType: 'radio', transform: (value) => value === 'VACANT' }, // Vacant
  
  // Additional fields
  { fieldId: 'fld9oG6SMAkh4hvNL', cssSelector: '.hoa-information .field-pair-item:first-child .line', valueType: 'text' }, // HOA
  { fieldId: 'fld9Qw4mGeI9kk42F', cssSelector: '.certificate-of-occupancy .single-field-line .line', valueType: 'text' }, // Municipality
  { fieldId: 'fld4YZ0qKHvRLK4Xg', cssSelector: '.attorney .detail-line:first-child .line', valueType: 'text' }, // Attorney
  { fieldId: 'fldqeArDeRkxiYz9u', cssSelector: '.title-agent-information .detail-line:first-child .line', valueType: 'text' }, // Title Company
  
  // Checkboxes
  { fieldId: 'fldw3GlfvKtyNfIAW', cssSelector: '#update-mls', valueType: 'checkbox', transform: (value) => value === true }, // Update MLS
  { fieldId: 'fldeHKiUreeDs5n4o', cssSelector: '#rofr', valueType: 'checkbox', transform: (value) => value === true }, // First Right of Refusal
];

// Field mappings for Dual Agent Cover Sheet
const dualAgentMappings: AirtableFieldMapping[] = [
  // Header section
  { fieldId: 'fld6O2FgIXQU5G27o', cssSelector: '.info-field:nth-child(2) .line', valueType: 'text' }, // MLS Number
  { fieldId: 'fldypnfnHhplWYcCW', cssSelector: '.info-field:first-child .line', valueType: 'text' }, // Property Address
  { fieldId: 'fldFD4xHD0vxnSOHJ', cssSelector: '.info-row:nth-child(2) .info-field:nth-child(4) .line', valueType: 'text' }, // Agent
  
  // Buyer information
  { fieldId: 'fldSqxNOZ9B5PgSab', cssSelector: '.right-column .section-container:first-child .detail-line:nth-child(1) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'BUYER')?.name }, // Buyer Name
  { fieldId: 'flddP6a8EG6qTJdIi', cssSelector: '.right-column .section-container:first-child .detail-line:nth-child(4) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'BUYER')?.email }, // Buyer Email
  { fieldId: 'fldBnh8W6iGW014yY', cssSelector: '.right-column .section-container:first-child .detail-line:nth-child(3) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'BUYER')?.phone }, // Buyer Phone
  { fieldId: 'fldz1IpeR1256LhuC', cssSelector: '.right-column .section-container:first-child .detail-line:nth-child(2) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'BUYER')?.address }, // Buyer Address
  
  // Seller information
  { fieldId: 'fldSqxNOZ9B5PgSab', cssSelector: '.right-column .section-container:nth-child(2) .detail-line:nth-child(1) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'SELLER')?.name }, // Seller Name
  { fieldId: 'flddP6a8EG6qTJdIi', cssSelector: '.right-column .section-container:nth-child(2) .detail-line:nth-child(4) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'SELLER')?.email }, // Seller Email
  { fieldId: 'fldBnh8W6iGW014yY', cssSelector: '.right-column .section-container:nth-child(2) .detail-line:nth-child(3) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'SELLER')?.phone }, // Seller Phone
  { fieldId: 'fldz1IpeR1256LhuC', cssSelector: '.right-column .section-container:nth-child(2) .detail-line:nth-child(2) .line', valueType: 'text', transform: (clients) => getClientByType(clients, 'SELLER')?.address }, // Seller Address
  
  // Commission details
  { fieldId: 'flduuQQT7o6XAGlRe', cssSelector: '.left-column .commission-details-section .commission-grid-item:nth-child(2) .underline', valueType: 'text' }, // Listing Agent %
  { fieldId: 'fld5KRrToAAt5kOLd', cssSelector: '.left-column .commission-details-section .commission-grid-item:first-child .underline', valueType: 'text' }, // Buyer's Agent %
  { fieldId: 'fldE8INzEorBtx2uN', cssSelector: '.left-column .commission-details-section .commission-grid-item:nth-child(3) .underline', valueType: 'text' }, // Total Commission %
  { fieldId: 'fldhHjBZJISmnP8SK', cssSelector: '.quick-reference-box .single-field-line:nth-child(3) .line', valueType: 'text' }, // Sale Price
  
  // Additional fields
  { fieldId: 'fldLVyXkhqppQ7WpC', cssSelector: '#da-ref-yes', valueType: 'checkbox', transform: (value) => value === true }, // Is Referral
  { fieldId: 'fldzVtmn8uylVxuTF', cssSelector: '.referral-section .single-field-line .line', valueType: 'text' }, // Referral Party
  { fieldId: 'fldewmjoaJVwiMF46', cssSelector: '.referral-section .single-field-line .percentage', valueType: 'text' }, // Referral Fee
  { fieldId: 'fld9oG6SMAkh4hvNL', cssSelector: '.hoa-information .field-pair-item:first-child .line', valueType: 'text' }, // HOA
];

// Helper function to get client by type
const getClientByType = (clients: any[], type: 'BUYER' | 'SELLER') => {
  if (!Array.isArray(clients)) return null;
  return clients.find(client => client.type === type);
};

// Function to fetch an Airtable record by ID
export const fetchAirtableRecord = async (
  tableId: string,
  recordId: string
): Promise<Record<string, any>> => {
  try {
    const table = airtableBase(tableId);
    const record = await table.find(recordId);
    return record;
  } catch (error) {
    console.error('Error fetching record from Airtable:', error);
    throw error;
  }
};

// Ensure the PDF output directory exists
const ensureOutputDirectory = async (outputDir: string): Promise<boolean> => {
  try {
    await fs.mkdir(outputDir, { recursive: true });
    return true;
  } catch (error) {
    console.error('Error creating output directory:', error);
    return false;
  }
};

/**
 * Generate a PDF from HTML content
 * @param htmlContent The HTML content to convert to PDF
 * @param outputPath The path where the PDF will be saved
 * @returns The path to the generated PDF
 */
export const generatePdfFromHtml = async (
  htmlContent: string,
  outputPath: string
): Promise<string> => {
  // Create the directory structure if it doesn't exist
  const outputDir = path.dirname(outputPath);
  const dirExists = await ensureOutputDirectory(outputDir);
  
  if (!dirExists) {
    throw new Error(`Could not create output directory: ${outputDir}`);
  }
  
  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  
  try {
    const page = await browser.newPage();
    
    // Set the HTML content
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
    });
    
    // Generate PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });
    
    console.log(`PDF generated successfully: ${outputPath}`);
    return outputPath;
  } finally {
    await browser.close();
  }
};

/**
 * Generate a PDF from an HTML template file
 * @param templatePath Path to the HTML template file
 * @param replacements Object with template variables and their values
 * @param outputPath Path where the PDF will be saved
 * @returns The path to the generated PDF
 */
export const generatePdfFromTemplate = async (
  templatePath: string,
  replacements: Record<string, string>,
  outputPath: string
): Promise<string> => {
  try {
    // Load the template
    let template = await fs.readFile(templatePath, 'utf-8');
    
    // Replace placeholders
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      template = template.replace(regex, value);
    }
    
    // Generate PDF
    return await generatePdfFromHtml(template, outputPath);
  } catch (error) {
    console.error(`Error generating PDF from template ${templatePath}:`, error);
    throw error;
  }
};

// Main function to generate cover sheet based on agent role
export const generateCoverSheetPdf = async (
  tableId: string,
  recordId: string,
  outputDir: string = './generated'
): Promise<string> => {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });
    
    // Fetch the record from Airtable
    const record = await fetchAirtableRecord(tableId, recordId);
    
    // Extract agent role
    const agentRole = record.fields.fldOVyoxz38rWwAFy || 'DUAL AGENT';
    
    // Determine which template and mappings to use
    let templatePath: string;
    let mappings: AirtableFieldMapping[];
    
    switch (agentRole) {
      case 'BUYERS AGENT':
        templatePath = TEMPLATE_PATHS['BUYERS AGENT'];
        mappings = buyerAgentMappings;
        break;
        
      case 'LISTING AGENT':
        templatePath = TEMPLATE_PATHS['LISTING AGENT'];
        mappings = sellerAgentMappings;
        break;
        
      case 'DUAL AGENT':
      default:
        templatePath = TEMPLATE_PATHS['DUAL AGENT'];
        mappings = dualAgentMappings;
        break;
    }
    
    // Read the template file
    const htmlTemplate = await fs.readFile(templatePath, 'utf-8');
    
    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const mlsNumber = record.fields.fld6O2FgIXQU5G27o || 'unknown';
    const outputFilename = `${agentRole.replace(/\s+/g, '-')}_${mlsNumber}_${timestamp}.pdf`;
    const outputPath = path.join(outputDir, outputFilename);
    
    // Generate PDF
    const pdfPath = await generatePdfFromHtml(
      htmlTemplate,
      outputPath
    );
    
    return pdfPath;
  } catch (error) {
    console.error('Error generating cover sheet PDF:', error);
    throw error;
  }
};

// Export mapping constants for potential reuse or testing
export const MAPPINGS = {
  'BUYERS AGENT': buyerAgentMappings,
  'LISTING AGENT': sellerAgentMappings,
  'DUAL AGENT': dualAgentMappings,
}; 