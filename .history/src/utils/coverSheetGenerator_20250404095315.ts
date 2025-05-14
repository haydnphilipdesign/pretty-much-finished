import { generateCoverSheet } from './pdfGenerator';
import Airtable from 'airtable';

// Configure Airtable
const configureAirtable = (): Airtable.Base => {
  return new Airtable({
    apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
  }).base(import.meta.env.VITE_AIRTABLE_BASE_ID);
};

// Initialize Airtable with your configuration
const airtableBase = configureAirtable();

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

// Function to generate a cover sheet from an Airtable record ID
export const generateCoverSheetFromAirtable = async (
  tableId: string,
  recordId: string
): Promise<void> => {
  try {
    // Fetch the record from Airtable
    const record = await fetchAirtableRecord(tableId, recordId);
    
    // Extract the agent role from the record
    const agentRole = record.fields.fldOVyoxz38rWwAFy || 'DUAL AGENT';
    
    // Generate the cover sheet
    await generateCoverSheet(record, agentRole);
    
    return Promise.resolve();
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
            await generateCoverSheetFromAirtable(tableId, recordId);
            
            // Reset button state
            button.removeAttribute('disabled');
            button.textContent = 'Generate Cover Sheet';
            
            // Show success message
            alert('Cover sheet generated successfully!');
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