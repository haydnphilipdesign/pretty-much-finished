/**
 * This file contains the mapping of form fields to their positions on the PDF
 * The coordinates are based on the actual PDF template layout
 * Coordinates are already scaled to standard Letter size (8.5" × 11" or 612 × 792 pt)
 * 
 * Coordinates are measured from the bottom-left of the page
 * x increases from left to right
 * y increases from bottom to top
 */

// Global vertical adjustment - using a smaller offset for fine-tuning
const Y_OFFSET = -12; // Base offset

// Standard form field mapping based on precise coordinates scaled for Letter size paper
export const formFieldPositions = {
  // Page 1 - Transaction Coordinator form
  page1: {
    // Property information
    propertyAddress: { x: 75.68, y: 750.59 + Y_OFFSET, fontSize: 12, bold: true },
    mlsNumber: { x: 472.82, y: 750.59 + Y_OFFSET, fontSize: 12, bold: true },
    
    // Quick Reference section - Move UP by 7.6 points (half of 15.2)
    salePrice: { x: 278.45, y: 690.52 + Y_OFFSET + 7.6, fontSize: 11, bold: true },
    sellersAssist: { x: 396.44, y: 690.52 + Y_OFFSET + 7.6, fontSize: 11, bold: true },
    
    // Closing Information section - Move UP by 0.65 points (half of 1.3)
    closingDate: { x: 536.28, y: 644.28 + Y_OFFSET + 0.65, fontSize: 10, bold: true },
    
    // Agent Information section - Move DOWN by 7.4/7.05 points (half of 14.8/14.1)
    agentName: { x: 96.55, y: 546.91 + Y_OFFSET - 7.4, fontSize: 11, bold: true },
    agentRole: { x: 269.44, y: 546.91 + Y_OFFSET - 7.05, fontSize: 11, bold: true },
    
    // Buyer Information section - Move DOWN by half the specified amounts
    buyerName: { x: 143.17, y: 494.06 + Y_OFFSET - 14.9, fontSize: 11, bold: true },
    buyerPhone: { x: 135.43, y: 467.63 + Y_OFFSET - 10.9, fontSize: 11 },
    buyerAddress: { x: 81.46, y: 441.20 + Y_OFFSET - 7.4, fontSize: 11 },
    buyerEmail: { x: 125.10, y: 414.77 + Y_OFFSET - 4.9, fontSize: 11 },
    
    // Seller Information section - Move DOWN by half the specified amounts
    sellerName: { x: 423.75, y: 494.06 + Y_OFFSET - 2, fontSize: 11, bold: true },
    sellerPhone: { x: 420.21, y: 467.63 + Y_OFFSET - 10.9, fontSize: 11 },
    sellerAddress: { x: 370.00, y: 441.20 + Y_OFFSET - 7.4, fontSize: 11 }, // Shifted left from 420.00
    sellerEmail: { x: 408.98, y: 414.77 + Y_OFFSET - 0..., fontSize: 11 },
    
    // Legal Information section - Move DOWN by 13.9 points (half of 27.8)
    attorneyName: { x: 94.97, y: 361.92 + Y_OFFSET - 13.9, fontSize: 11 },
    
    // Financial Details section - Move DOWN by half the specified amounts
    listSidePercentage: { x: 113.13, y: 289.24 + Y_OFFSET - 15.9, fontSize: 11, bold: true },
    buyerSidePercentage: { x: 251.81, y: 289.24 + Y_OFFSET - 15.9, fontSize: 11, bold: true },
    totalPercentage: { x: 113.13, y: 262.81 + Y_OFFSET - 4.9, fontSize: 11, bold: true },
    
    // Title Information - Move DOWN by 14.9 points (half of 29.8)
    titleCompany: { x: 420.59, y: 163.71 + Y_OFFSET - 14.9, fontSize: 11, bold: true },
    
    // Referral Information section - Move DOWN by 14.9 points (half of 29.8)
    referralDueTo: { x: 108.12, y: 57.99 + Y_OFFSET - 14.9, fontSize: 11, bold: true },
    referralPercentage: { x: 264.81, y: 57.99 + Y_OFFSET - 14.9, fontSize: 11, bold: true },
  }
};

/**
 * Maps form data to PDF positions based on the formFieldPositions mapping
 * @param {Object} formData - The form data from the transaction form
 * @returns {Array} Array of text elements with coordinates
 */
export function mapFormDataToPositions(formData) {
  const textElements = [];
  
  // Property information - Top of form
  if (formData.propertyData) {
    addTextElement(textElements, 0, formFieldPositions.page1.propertyAddress, 
      formData.propertyData.address || '');
    
    addTextElement(textElements, 0, formFieldPositions.page1.mlsNumber, 
      formData.propertyData.mlsNumber || '');
      
    // Sale Price
    if (formData.propertyData.salePrice) {
      addTextElement(textElements, 0, formFieldPositions.page1.salePrice, 
        `$${formData.propertyData.salePrice}`, true);
    }
    
    // Closing Date
    if (formData.propertyData.closingDate) {
      addTextElement(textElements, 0, formFieldPositions.page1.closingDate, 
        formData.propertyData.closingDate);
    }
  }
  
  // Agent information
  if (formData.agentData) {
    addTextElement(textElements, 0, formFieldPositions.page1.agentName, 
      formData.agentData.name || '');
    
    addTextElement(textElements, 0, formFieldPositions.page1.agentRole, 
      formData.agentData.role?.toUpperCase() || '');
  }
  
  // Commission/Financial data
  if (formData.commissionData) {
    // Total commission
    if (formData.commissionData.totalCommission) {
      addTextElement(textElements, 0, formFieldPositions.page1.totalPercentage, 
        `${formData.commissionData.totalCommission}`);
    }
    
    // Listing agent commission
    if (formData.commissionData.listingAgentCommission) {
      addTextElement(textElements, 0, formFieldPositions.page1.listSidePercentage, 
        `${formData.commissionData.listingAgentCommission}`);
    }
    
    // Buyer's agent commission
    if (formData.commissionData.buyersAgentCommission) {
      addTextElement(textElements, 0, formFieldPositions.page1.buyerSidePercentage, 
        `${formData.commissionData.buyersAgentCommission}`);
    }
    
    // Seller's assist
    if (formData.commissionData.sellersAssist) {
      addTextElement(textElements, 0, formFieldPositions.page1.sellersAssist, 
        `$${formData.commissionData.sellersAssist}`, true);
    }
    
    // Referral information
    if (formData.commissionData.isReferral === 'YES' && formData.commissionData.referralParty) {
      addTextElement(textElements, 0, formFieldPositions.page1.referralDueTo, 
        formData.commissionData.referralParty);
        
      if (formData.commissionData.referralFee) {
        addTextElement(textElements, 0, formFieldPositions.page1.referralPercentage, 
          `${formData.commissionData.referralFee}`);
      }
    }
  }
  
  // Client information - Buyers and Sellers
  if (formData.clients && formData.clients.length > 0) {
    // Sort clients by type (buyer/seller)
    const buyers = formData.clients.filter(c => 
      c.type?.toLowerCase() === 'buyer' || c.type?.toLowerCase() === 'buyers');
    
    const sellers = formData.clients.filter(c => 
      c.type?.toLowerCase() === 'seller' || c.type?.toLowerCase() === 'sellers');
    
    // Add buyer information
    if (buyers.length > 0) {
      addTextElement(textElements, 0, formFieldPositions.page1.buyerName, 
        buyers[0].name || '');
      
      addTextElement(textElements, 0, formFieldPositions.page1.buyerPhone, 
        buyers[0].phone || '');
      
      addTextElement(textElements, 0, formFieldPositions.page1.buyerAddress, 
        buyers[0].address || '');
      
      addTextElement(textElements, 0, formFieldPositions.page1.buyerEmail, 
        buyers[0].email || '');
    }
    
    // Add seller information
    if (sellers.length > 0) {
      addTextElement(textElements, 0, formFieldPositions.page1.sellerName, 
        sellers[0].name || '');
      
      addTextElement(textElements, 0, formFieldPositions.page1.sellerPhone, 
        sellers[0].phone || '');
      
      addTextElement(textElements, 0, formFieldPositions.page1.sellerAddress, 
        sellers[0].address || '');
      
      addTextElement(textElements, 0, formFieldPositions.page1.sellerEmail,
        sellers[0].email || '');
    }
  }
  
  // Legal information - Attorney
  if (formData.propertyDetails && formData.propertyDetails.attorneyName) {
    addTextElement(textElements, 0, formFieldPositions.page1.attorneyName, 
      formData.propertyDetails.attorneyName);
  }
  
  // Title company information
  if (formData.titleData && formData.titleData.titleCompany) {
    addTextElement(textElements, 0, formFieldPositions.page1.titleCompany, 
      formData.titleData.titleCompany);
  }
  
  return textElements;
}

/**
 * Helper function to add a text element to the elements array
 * @param {Array} elements - Array of text elements
 * @param {number} page - Page number (0-based)
 * @param {Object} position - Position information (x, y, fontSize, maxWidth)
 * @param {string} text - Text to add
 * @param {boolean} isCurrency - Whether this is a currency value
 */
function addTextElement(elements, page, position, text, isCurrency = false) {
  if (text) {
    elements.push({
      page,
      x: position.x,
      y: position.y,
      text: String(text),
      fontSize: position.fontSize || 11,
      maxWidth: position.maxWidth,
      isBold: position.bold || isCurrency
    });
  }
}
