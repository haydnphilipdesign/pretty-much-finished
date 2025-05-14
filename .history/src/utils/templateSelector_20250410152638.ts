/**
 * Utility for selecting and populating templates
 */

/**
 * Determines which template to use based on agent role
 * @param agentRole The role of the agent (e.g., "LISTING AGENT", "BUYER'S AGENT", "DUAL AGENT")
 * @returns The template filename
 */
export const selectTemplate = (agentRole: string): string => {
  const normalizedRole = agentRole.trim().toUpperCase();
  
  if (normalizedRole.includes('LISTING') || normalizedRole.includes('SELLER')) {
    return 'Seller.html';
  } else if (normalizedRole.includes('BUYER')) {
    return 'Buyer.html';
  } else if (normalizedRole.includes('DUAL')) {
    return 'DualAgent.html';
  }
  
  // Default to Buyer template if role is unknown
  return 'Buyer.html';
};

/**
 * Maps transaction form data to template placeholders
 * @param formData The transaction form data
 * @returns Object with mapped placeholder values
 */
export const mapFormDataToTemplate = (formData: any): Record<string, string> => {
  // Extract client names
  const clientNames = formData.clients
    ? formData.clients.map((client: any) => client.name).join(', ')
    : '';
  
  // Create a mapping of template placeholders to form data
  return {
    // Property information
    propertyAddress: formData.propertyData?.address || '',
    mlsNumber: formData.propertyData?.mlsNumber || '',
    
    // Agent information
    agentName: formData.agentData?.name || '',
    agentEmail: formData.agentData?.email || '',
    agentPhone: formData.agentData?.phone || '',
    
    // Client information (general)
    clientNames,
    
    // Buyer information (for Buyer and Dual Agent templates)
    buyerName: clientNames,
    buyerAddress: '',
    buyerPhone: formData.clients && formData.clients[0]?.phone || '',
    buyerEmail: formData.clients && formData.clients[0]?.email || '',
    
    // Seller information (for Seller and Dual Agent templates)
    sellerName: clientNames,
    sellerAddress: formData.propertyData?.address || '',
    sellerPhone: formData.clients && formData.clients[0]?.phone || '',
    sellerEmail: formData.clients && formData.clients[0]?.email || '',
    
    // Commission information
    commissionAmount: formData.commissionData?.totalCommission || '',
    
    // Additional information
    specialInstructions: formData.additionalInfo?.notes || '',
    
    // Transaction date
    transactionDate: new Date().toLocaleDateString(),
  };
};
