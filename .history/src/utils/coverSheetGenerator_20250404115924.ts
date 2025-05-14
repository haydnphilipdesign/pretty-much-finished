// Import dotenv first to load environment variables
import dotenv from 'dotenv';
dotenv.config();

// import { generateCoverSheet } from './pdfGenerator';
import Airtable from 'airtable';
import path from 'path';
import { promises as fs } from 'fs';
import puppeteer from 'puppeteer';
import { sendCoverSheetEmail } from './emailUtils';
import fs_sync from 'fs'; // Import synchronous fs functions
import { generatePdfFromHtml, generatePdfFromTemplate } from './serverPdfGenerator';

// Define the missing types
interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
}

interface GeneratorConfig {
  sendEmail: boolean;
}

// Function to get field mappings for a role
const getFieldMappings = (agentRole: string): any[] => {
  // This is a simple placeholder - in a real implementation, 
  // this would return the actual field mappings
  return [];
};

// Configure Airtable - handle both Vite and Node.js environments
const configureAirtable = (): Airtable.Base => {
  // First try direct environment variables
  let apiKey = process.env.AIRTABLE_API_KEY;
  let baseId = process.env.AIRTABLE_BASE_ID;
  
  // Then try with VITE prefix if not found
  if (!apiKey) {
    apiKey = process.env.VITE_AIRTABLE_API_KEY;
  }
  
  if (!baseId) {
    baseId = process.env.VITE_AIRTABLE_BASE_ID;
  }
  
  // Log what we found for debugging
  console.log('Airtable API Key:', apiKey ? 'Found' : 'Not found');
  console.log('Airtable Base ID:', baseId ? 'Found' : 'Not found');
  console.log('Environment variables:', Object.keys(process.env).filter(key => 
    key.includes('AIRTABLE') || key.includes('VITE')
  ));
  
  if (!apiKey || !baseId) {
    throw new Error(`
    Missing Airtable configuration. Please check your .env file.
    API Key: ${apiKey ? 'Found' : 'Missing'}
    Base ID: ${baseId ? 'Found' : 'Missing'}
    `);
  }

  return new Airtable({
    apiKey,
  }).base(baseId);
};

// Initialize Airtable with your configuration
const airtableBase = configureAirtable();
const TRANSACTIONS_TABLE_ID = 'tblHyCJCpQSgjn0md';

// Constants for template paths
const TEMPLATE_PATHS = {
  'BUYERS AGENT': typeof window !== 'undefined' ? 'Buyer.html' : path.join(process.cwd(), 'public', 'templates', 'Buyer.html'),
  'LISTING AGENT': typeof window !== 'undefined' ? 'Seller.html' : path.join(process.cwd(), 'public', 'templates', 'Seller.html'),
  'DUAL AGENT': typeof window !== 'undefined' ? 'DualAgent.html' : path.join(process.cwd(), 'public', 'templates', 'DualAgent.html'),
};

// Original templates in the root directory
const ORIGINAL_TEMPLATE_PATHS = {
  'BUYERS AGENT': path.join(process.cwd(), 'Buyer.html'),
  'LISTING AGENT': path.join(process.cwd(), 'Seller.html'),
  'DUAL AGENT': path.join(process.cwd(), 'DualAgent.html'),
};

// Original PDFs in the root directory
const ORIGINAL_PDF_PATHS = {
  'BUYERS AGENT': path.join(process.cwd(), 'Buyers-Agent.pdf'),
  'LISTING AGENT': path.join(process.cwd(), 'Listing-Agent.pdf'),
  'DUAL AGENT': path.join(process.cwd(), 'Dual-Agent.pdf'),
};

// Function to get template path based on agent role
const getTemplatePathForRole = (agentRole: string, useOriginalTemplates: boolean = false): string => {
  const role = agentRole.toUpperCase();
  
  // Determine which template set to use
  const templatePaths = useOriginalTemplates ? ORIGINAL_TEMPLATE_PATHS : TEMPLATE_PATHS;
  const templatePath = templatePaths[role as keyof typeof templatePaths] || templatePaths['DUAL AGENT'];
  
  // In Node.js environment, ensure template directory exists
  if (typeof window === 'undefined') {
    try {
      // If using standard templates, ensure the templates directory exists
      if (!useOriginalTemplates) {
        const templatesDir = path.join(process.cwd(), 'public', 'templates');
        fs.mkdir(templatesDir, { recursive: true }).catch(() => {
          // Ignore errors as they'll be caught in the main function
        });
      }
      
      // Check if template exists
      if (!fs_sync.existsSync(templatePath)) {
        console.warn(`⚠️ Template file not found: ${templatePath}`);
        if (useOriginalTemplates) {
          console.warn('You need to create the HTML templates in the root directory.');
        } else {
          console.warn('You need to create the HTML templates in the public/templates directory.');
        }
      }
    } catch (error) {
      // Log the error but continue - let the main function handle any actual errors
      console.error('Error checking template path:', error);
    }
  }
  
  return templatePath;
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

// Generate cover sheet from an Airtable transaction record
export const generateCoverSheetForTransaction = async (
  transactionId: string,
  agentRole: string = 'DUAL AGENT'
): Promise<boolean> => {
  try {
    // Create output directory in public folder if it doesn't exist
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Fetch the transaction record
    const record = await fetchAirtableRecord(TRANSACTIONS_TABLE_ID, transactionId);
    
    // Get the template file path based on agent role
    const templateName = getTemplatePathForRole(agentRole);
    
    // Create output filename with MLS number if available
    const mlsNumber = record.fields.fld6O2FgIXQU5G27o || 'unknown';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFilename = `${agentRole.replace(/\s+/g, '-')}_${mlsNumber}_${timestamp}.pdf`;
    const outputPath = path.join(outputDir, outputFilename);
    
    // Generate PDF - for simplicity, we'll use the browser-side approach from pdfGenerator
    // but in a real implementation, you might want to use a server-side approach with puppeteer
    // if running in a Node.js environment
    if (typeof window !== 'undefined') {
      // Browser environment - use client-side generation
      await generateCoverSheet(record, { sendEmail: true });
      
      // Since this is client-side, we can't send email directly,
      // so we'll return true and handle the email sending server-side
      console.log('PDF generated on client-side. Email sending will be handled separately.');
      return true;
    } else {
      // Node.js environment - use server-side generation
      const templatePath = path.join(process.cwd(), templateName);
      const htmlTemplate = await fs.readFile(templatePath, 'utf-8');
      
      // Launch browser
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      
      try {
        // Create a new page
        const page = await browser.newPage();
        
        // Load HTML template
        await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
        
        // Generate PDF
        await page.pdf({
          path: outputPath,
          format: 'letter',
          printBackground: true,
          margin: { top: '0.2in', right: '0.2in', bottom: '0.2in', left: '0.2in' },
        });
        
        // Get property address and agent name from record for email
        const address = record.fields.fldypnfnHhplWYcCW || 'Unknown Address';
        const agentName = record.fields.fldFD4xHD0vxnSOHJ || 'Unknown Agent';
        
        // Send the PDF as an email attachment
        const emailSent = await sendCoverSheetEmail(outputPath, {
          address,
          mlsNumber,
          agentRole,
          agentName
        });
        
        console.log(emailSent 
          ? 'Cover sheet generated and emailed successfully' 
          : 'Cover sheet generated but email failed to send');
          
        return emailSent;
      } finally {
        await browser.close();
      }
    }
  } catch (error) {
    console.error('Error generating cover sheet:', error);
    throw error;
  }
};

// Add a listener to the DOM to handle the "Generate Cover Sheet" button
export const setupCoverSheetGeneratorListeners = (): void => {
  document.addEventListener('DOMContentLoaded', () => {
    const generateButtons = document.querySelectorAll('[data-generate-cover-sheet]');
    
    generateButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        
        const button = event.currentTarget as HTMLElement;
        const tableId = button.getAttribute('data-table-id');
        const recordId = button.getAttribute('data-record-id');
        
        if (tableId && recordId) {
          try {
            // Show loading state
            button.setAttribute('disabled', 'true');
            button.textContent = 'Generating...';
            
            // Generate the cover sheet
            await generateCoverSheetForTransaction(recordId);
            
            // Reset button state
            button.removeAttribute('disabled');
            button.textContent = 'Generate Cover Sheet';
            
            // Show success message
            alert('Cover sheet generated and sent to administration.');
          } catch (error) {
            console.error('Error generating cover sheet:', error);
            
            // Reset button state
            button.removeAttribute('disabled');
            button.textContent = 'Generate Cover Sheet';
            
            // Show error message
            alert('Error generating cover sheet. Please try again.');
          }
        }
      });
    });
  });
};

// Function to modify HTML templates with appropriate IDs for mapping
export const prepareHTMLTemplates = (): void => {
  if (typeof document === 'undefined') return;
  
  document.addEventListener('DOMContentLoaded', () => {
    // Get the template elements
    const buyerTemplate = document.querySelector('.buyer-template') as HTMLElement;
    const sellerTemplate = document.querySelector('.seller-template') as HTMLElement;
    const dualAgentTemplate = document.querySelector('.dual-agent-template') as HTMLElement;
    
    if (buyerTemplate) {
      buyerTemplate.id = 'buyer-template';
      
      // Map key elements in the buyer template
      mapElementById(buyerTemplate, '.info-field:first-child .line', 'property-address');
      mapElementById(buyerTemplate, '.info-field:nth-child(2) .line', 'mls-number');
      
      // Buyer information
      mapElementById(buyerTemplate, '.contact-field .detail-line:nth-child(1) .line', 'buyer-name');
      mapElementById(buyerTemplate, '.contact-field .detail-line:nth-child(2) .line', 'buyer-address');
      mapElementById(buyerTemplate, '.contact-field .detail-line:nth-child(3) .line', 'buyer-phone');
      mapElementById(buyerTemplate, '.contact-field .detail-line:nth-child(4) .line', 'buyer-email');
      
      // Commission details
      mapElementById(buyerTemplate, '.commission-grid-item:nth-child(1) .underline', 'buyers-agent-percentage');
      
      // Referral information
      mapElementById(buyerTemplate, '.referral-section .line', 'referral-party');
      mapElementById(buyerTemplate, '#ref-yes', 'ref-yes');
      
      // Quick reference section
      mapElementById(buyerTemplate, '.quick-reference-box .single-field-line:nth-child(3) .line', 'sale-price');
      mapElementById(buyerTemplate, '.quick-reference-box .single-field-line:nth-child(4) .line', 'sellers-assist');
    }
    
    if (sellerTemplate) {
      sellerTemplate.id = 'seller-template';
      
      // Map key elements in the seller template
      mapElementById(sellerTemplate, '.info-field:first-child .line', 'property-address');
      mapElementById(sellerTemplate, '.info-field:nth-child(2) .line', 'mls-number');
      
      // Seller information
      mapElementById(sellerTemplate, '.contact-field .detail-line:nth-child(1) .line', 'seller-name');
      mapElementById(sellerTemplate, '.contact-field .detail-line:nth-child(2) .line', 'seller-address');
      mapElementById(sellerTemplate, '.contact-field .detail-line:nth-child(3) .line', 'seller-phone');
      mapElementById(sellerTemplate, '.contact-field .detail-line:nth-child(4) .line', 'seller-email');
      
      // Commission details
      mapElementById(sellerTemplate, '.commission-grid-item:nth-child(1) .underline', 'listing-agent-percentage');
      mapElementById(sellerTemplate, '.commission-grid-item:nth-child(2) .underline', 'buyers-agent-percentage');
      mapElementById(sellerTemplate, '.commission-grid-item:nth-child(3) .underline', 'total-commission-percentage');
      
      // Property status
      mapElementById(sellerTemplate, '#occupied', 'occupied');
      mapElementById(sellerTemplate, '#vacant', 'vacant');
      
      // Quick reference section
      mapElementById(sellerTemplate, '.quick-reference-box .single-field-line:nth-child(3) .line', 'sale-price');
    }
    
    if (dualAgentTemplate) {
      dualAgentTemplate.id = 'dual-agent-template';
      
      // Map key elements in the dual agent template
      mapElementById(dualAgentTemplate, '.info-field:first-child .line', 'property-address');
      mapElementById(dualAgentTemplate, '.info-field:nth-child(2) .line', 'mls-number');
      
      // Buyer information
      mapElementById(dualAgentTemplate, '.right-column .section-container:nth-child(1) .detail-line:nth-child(1) .line', 'buyer-name');
      mapElementById(dualAgentTemplate, '.right-column .section-container:nth-child(1) .detail-line:nth-child(2) .line', 'buyer-address');
      mapElementById(dualAgentTemplate, '.right-column .section-container:nth-child(1) .detail-line:nth-child(3) .line', 'buyer-phone');
      mapElementById(dualAgentTemplate, '.right-column .section-container:nth-child(1) .detail-line:nth-child(4) .line', 'buyer-email');
      
      // Seller information
      mapElementById(dualAgentTemplate, '.right-column .section-container:nth-child(2) .detail-line:nth-child(1) .line', 'seller-name');
      mapElementById(dualAgentTemplate, '.right-column .section-container:nth-child(2) .detail-line:nth-child(2) .line', 'seller-address');
      mapElementById(dualAgentTemplate, '.right-column .section-container:nth-child(2) .detail-line:nth-child(3) .line', 'seller-phone');
      mapElementById(dualAgentTemplate, '.right-column .section-container:nth-child(2) .detail-line:nth-child(4) .line', 'seller-email');
      
      // Commission details
      mapElementById(dualAgentTemplate, '.commission-grid-item:nth-child(1) .underline', 'agent-percent');
      mapElementById(dualAgentTemplate, '.commission-grid-item:nth-child(2) .underline', 'listing-agent');
      mapElementById(dualAgentTemplate, '.commission-grid-item:nth-child(3) .underline', 'total-commission');
      
      // Referral information
      mapElementById(dualAgentTemplate, '#da-ref-yes', 'da-ref-yes');
      mapElementById(dualAgentTemplate, '.referral-section .line', 'referral-party');
      
      // Quick reference section
      mapElementById(dualAgentTemplate, '.quick-reference-box .single-field-line:nth-child(3) .line', 'sale-price');
    }
  });
};

// Helper function to map element by ID
const mapElementById = (parent: HTMLElement, selector: string, id: string): void => {
  const element = parent.querySelector(selector);
  if (element) {
    element.id = id;
  }
};

// Export a function that initializes everything
export const initCoverSheetGenerator = (): void => {
  prepareHTMLTemplates();
  setupCoverSheetGeneratorListeners();
};

export const generateCoverSheet = async (
  record: AirtableRecord,
  config: GeneratorConfig = { sendEmail: true }
): Promise<string> => {
  try {
    // Get the agent role
    const agentRole = record.fields.AgentRole;
    if (!agentRole) {
      throw new Error('Agent role is missing from the record');
    }
    
    // Get the template path for the role
    const templatePath = getTemplatePathForRole(agentRole);
    
    // Set up output path
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `cover-sheet-${timestamp}-${record.id}.pdf`;
    const outputPath = path.join(outputDir, fileName);
    
    // For testing, if we have simple fields with test data, use the simpler template approach
    if (
      record.fields.isTestData && 
      record.fields.agentName && 
      record.fields.propertyAddress && 
      record.fields.clientNames
    ) {
      console.log('Using test data template with simple replacements');
      
      // Set up the replacements
      const replacements: Record<string, string> = {
        agentName: record.fields.agentName || '',
        propertyAddress: record.fields.propertyAddress || '',
        clientNames: record.fields.clientNames || '',
        commissionAmount: record.fields.commissionAmount?.toString() || '',
        transactionDate: record.fields.transactionDate || new Date().toLocaleDateString()
      };
      
      // Generate the PDF using template replacements
      const pdfPath = await generatePdfFromTemplate(templatePath, replacements, outputPath);
      
      // Send email if configured
      if (config.sendEmail) {
        await sendCoverSheetEmail(record, pdfPath);
      }
      
      return pdfPath;
    }
    
    // For regular processing, use the existing approach with field mappings
    console.log(`Generating cover sheet for ${agentRole}`);
    
    // Get mappings for the template
    const mappings = getFieldMappings(agentRole);
    
    // Read the template file
    let htmlTemplate;
    try {
      htmlTemplate = await fs.readFile(templatePath, 'utf-8');
    } catch (error: any) {
      console.error(`Error reading template file ${templatePath}:`, error);
      throw new Error(`Failed to read template file: ${error.message}`);
    }
    
    // Generate the PDF
    const pdfPath = await generatePdfFromHtml(
      htmlTemplate,
      outputPath,
      record.fields,
      mappings
    );
    
    // Send email if configured
    if (config.sendEmail) {
      await sendCoverSheetEmail(record, pdfPath);
    }
    
    return pdfPath;
  } catch (error) {
    console.error('Error generating cover sheet:', error);
    throw error;
  }
}; 