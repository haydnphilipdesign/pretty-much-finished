import { TransactionFormData } from '@/types/transaction';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Type for the field mapping between Airtable and cover sheet elements
interface FieldMapping {
  airtableField: string;
  selector: string;
  type: 'text' | 'checkbox' | 'radio';
  transform?: (value: any) => any;
}

// Define mappings for each cover sheet type
const buyerAgentMapping: FieldMapping[] = [
  // Header Section
  { airtableField: 'fld6O2FgIXQU5G27o', selector: '#mls-number', type: 'text' },
  { airtableField: 'fldypnfnHhplWYcCW', selector: '#property-address', type: 'text' },
  { airtableField: 'fldFD4xHD0vxnSOHJ', selector: '#agent-name', type: 'text' },
  
  // Buyer Information
  { airtableField: 'fldSqxNOZ9B5PgSab', selector: '#buyer-name', type: 'text' },
  { airtableField: 'flddP6a8EG6qTJdIi', selector: '#buyer-email', type: 'text' },
  { airtableField: 'fldBnh8W6iGW014yY', selector: '#buyer-phone', type: 'text' },
  { airtableField: 'fldz1IpeR1256LhuC', selector: '#buyer-address', type: 'text' },
  
  // Commission Details
  { airtableField: 'fld5KRrToAAt5kOLd', selector: '#buyers-agent-percentage', type: 'text' },
  { airtableField: 'fldzVtmn8uylVxuTF', selector: '#referral-party', type: 'text' },
  { airtableField: 'fldewmjoaJVwiMF46', selector: '#referral-fee', type: 'text' },
  { airtableField: 'fldhHjBZJISmnP8SK', selector: '#sale-price', type: 'text' },
  { airtableField: 'fldTvXx96Na0zRh6W', selector: '#sellers-assist', type: 'text' },
  
  // Additional Fields
  { airtableField: 'fld9oG6SMAkh4hvNL', selector: '#hoa-name', type: 'text' },
  { airtableField: 'fld9Qw4mGeI9kk42F', selector: '#municipality', type: 'text' },
  { airtableField: 'fld4YZ0qKHvRLK4Xg', selector: '#attorney-name', type: 'text' },
  { airtableField: 'fldqeArDeRkxiYz9u', selector: '#title-company-name', type: 'text' },
  
  // Checkboxes
  { airtableField: 'fldeHKiUreeDs5n4o', selector: '#rofr', type: 'checkbox', transform: (value) => value === true },
  { airtableField: 'fldLVyXkhqppQ7WpC', selector: '#ref-yes', type: 'checkbox', transform: (value) => value === true },
];

const sellerAgentMapping: FieldMapping[] = [
  // Header Section
  { airtableField: 'fld6O2FgIXQU5G27o', selector: '#mls-number', type: 'text' },
  { airtableField: 'fldypnfnHhplWYcCW', selector: '#property-address', type: 'text' },
  { airtableField: 'fldFD4xHD0vxnSOHJ', selector: '#agent-name', type: 'text' },
  
  // Seller Information
  { airtableField: 'fldSqxNOZ9B5PgSab', selector: '#seller-name', type: 'text' },
  { airtableField: 'flddP6a8EG6qTJdIi', selector: '#seller-email', type: 'text' },
  { airtableField: 'fldBnh8W6iGW014yY', selector: '#seller-phone', type: 'text' },
  { airtableField: 'fldz1IpeR1256LhuC', selector: '#seller-address', type: 'text' },
  
  // Commission Details
  { airtableField: 'flduuQQT7o6XAGlRe', selector: '#listing-agent-percentage', type: 'text' },
  { airtableField: 'fld5KRrToAAt5kOLd', selector: '#buyers-agent-percentage', type: 'text' },
  { airtableField: 'fldE8INzEorBtx2uN', selector: '#total-commission-percentage', type: 'text' },
  { airtableField: 'fldhHjBZJISmnP8SK', selector: '#sale-price', type: 'text' },
  
  // Property Status
  { airtableField: 'fldV2eLxz6w0TpLFU', selector: '#occupied', type: 'radio', transform: (value) => value === 'OCCUPIED' },
  { airtableField: 'fldV2eLxz6w0TpLFU', selector: '#vacant', type: 'radio', transform: (value) => value === 'VACANT' },
  
  // Additional Fields
  { airtableField: 'fld9oG6SMAkh4hvNL', selector: '#hoa-name', type: 'text' },
  { airtableField: 'fld9Qw4mGeI9kk42F', selector: '#municipality', type: 'text' },
  { airtableField: 'fld4YZ0qKHvRLK4Xg', selector: '#attorney-name', type: 'text' },
  { airtableField: 'fldqeArDeRkxiYz9u', selector: '#title-company-name', type: 'text' },
  
  // Checkboxes
  { airtableField: 'fldw3GlfvKtyNfIAW', selector: '#update-mls', type: 'checkbox', transform: (value) => value === true },
  { airtableField: 'fldeHKiUreeDs5n4o', selector: '#rofr', type: 'checkbox', transform: (value) => value === true },
];

const dualAgentMapping: FieldMapping[] = [
  // Header Section
  { airtableField: 'fld6O2FgIXQU5G27o', selector: '#mls-number', type: 'text' },
  { airtableField: 'fldypnfnHhplWYcCW', selector: '#property-address', type: 'text' },
  { airtableField: 'fldFD4xHD0vxnSOHJ', selector: '#agent-name', type: 'text' },
  
  // Buyer Information
  { airtableField: 'fldSqxNOZ9B5PgSab', selector: '#buyer-name', type: 'text' },
  { airtableField: 'flddP6a8EG6qTJdIi', selector: '#buyer-email', type: 'text' },
  { airtableField: 'fldBnh8W6iGW014yY', selector: '#buyer-phone', type: 'text' },
  { airtableField: 'fldz1IpeR1256LhuC', selector: '#buyer-address', type: 'text' },
  
  // Seller Information
  { airtableField: 'fldSqxNOZ9B5PgSab', selector: '#seller-name', type: 'text' },
  { airtableField: 'flddP6a8EG6qTJdIi', selector: '#seller-email', type: 'text' },
  { airtableField: 'fldBnh8W6iGW014yY', selector: '#seller-phone', type: 'text' },
  { airtableField: 'fldz1IpeR1256LhuC', selector: '#seller-address', type: 'text' },
  
  // Commission Details
  { airtableField: 'flduuQQT7o6XAGlRe', selector: '#listing-agent', type: 'text' },
  { airtableField: 'fld5KRrToAAt5kOLd', selector: '#agent-percent', type: 'text' },
  { airtableField: 'fldE8INzEorBtx2uN', selector: '#total-commission', type: 'text' },
  { airtableField: 'fldhHjBZJISmnP8SK', selector: '#sale-price', type: 'text' },
  
  // Additional Fields
  { airtableField: 'fld9oG6SMAkh4hvNL', selector: '#hoa-name', type: 'text' },
  { airtableField: 'fldLVyXkhqppQ7WpC', selector: '#da-ref-yes', type: 'checkbox', transform: (value) => value === true },
  { airtableField: 'fldzVtmn8uylVxuTF', selector: '#referral-party', type: 'text' },
  { airtableField: 'fldewmjoaJVwiMF46', selector: '#referral-percentage', type: 'text' },
];

// Function to populate the HTML template with Airtable data
export const populateTemplate = (
  templateId: string, 
  airtableData: Record<string, any>, 
  mappings: FieldMapping[]
): HTMLElement => {
  // Clone the template to avoid modifying the original
  const template = document.getElementById(templateId) as HTMLElement;
  const clone = template.cloneNode(true) as HTMLElement;
  
  // Apply each mapping
  mappings.forEach(mapping => {
    const value = airtableData[mapping.airtableField];
    if (value !== undefined && value !== null) {
      const element = clone.querySelector(mapping.selector);
      
      if (element) {
        const transformedValue = mapping.transform ? mapping.transform(value) : value;
        
        switch (mapping.type) {
          case 'text':
            if (element instanceof HTMLInputElement || 
                element instanceof HTMLTextAreaElement) {
              element.value = transformedValue;
            } else {
              element.textContent = transformedValue;
            }
            break;
            
          case 'checkbox':
            if (element instanceof HTMLInputElement) {
              element.checked = Boolean(transformedValue);
            }
            break;
            
          case 'radio':
            if (element instanceof HTMLInputElement) {
              element.checked = Boolean(transformedValue);
            }
            break;
        }
      }
    }
  });
  
  return clone;
};

// Function to generate PDF from the populated template
export const generatePdf = async (
  templateId: string,
  airtableData: Record<string, any>,
  mappings: FieldMapping[],
  filename: string
): Promise<void> => {
  // Populate the template
  const populatedTemplate = populateTemplate(templateId, airtableData, mappings);
  
  // Temporarily append the populated template to the document
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.appendChild(populatedTemplate);
  document.body.appendChild(container);
  
  try {
    // Convert to canvas
    const canvas = await html2canvas(populatedTemplate, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
    });
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter',
    });
    
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
    
    // Save PDF
    pdf.save(filename);
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
};

// Helper function to convert Airtable record to the format expected by the template
export const formatAirtableRecord = (record: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  // Map each field from the record
  Object.entries(record.fields).forEach(([key, value]) => {
    result[key] = value;
  });
  
  return result;
};

// Main function to generate cover sheet based on agent role
export const generateCoverSheet = async (
  airtableRecord: Record<string, any>,
  agentRole: string = 'DUAL AGENT'
): Promise<void> => {
  const formattedData = formatAirtableRecord(airtableRecord);
  
  let templateId: string;
  let mappings: FieldMapping[];
  let filename: string;
  
  // Determine which template to use based on agent role
  switch (agentRole.toUpperCase()) {
    case 'BUYERS AGENT':
      templateId = 'buyer-template';
      mappings = buyerAgentMapping;
      filename = `Buyer_${formattedData.fld6O2FgIXQU5G27o || 'Cover'}.pdf`;
      break;
      
    case 'LISTING AGENT':
      templateId = 'seller-template';
      mappings = sellerAgentMapping;
      filename = `Seller_${formattedData.fld6O2FgIXQU5G27o || 'Cover'}.pdf`;
      break;
      
    case 'DUAL AGENT':
    default:
      templateId = 'dual-agent-template';
      mappings = dualAgentMapping;
      filename = `DualAgent_${formattedData.fld6O2FgIXQU5G27o || 'Cover'}.pdf`;
      break;
  }
  
  // Generate the PDF
  await generatePdf(templateId, formattedData, mappings, filename);
};

// Export mapping constants for potential reuse or testing
export const MAPPINGS = {
  BUYER: buyerAgentMapping,
  SELLER: sellerAgentMapping,
  DUAL: dualAgentMapping,
}; 