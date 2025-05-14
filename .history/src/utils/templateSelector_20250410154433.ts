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
  // Extract client names for display
  const clientNames = formData.clients
    ? formData.clients.map((client: any) => client.name).join(', ')
    : '';

  // Extract buyer and seller names based on client types
  const buyers = formData.clients
    ? formData.clients.filter((client: any) => client.type === 'BUYER').map((client: any) => client.name).join(', ')
    : '';

  const sellers = formData.clients
    ? formData.clients.filter((client: any) => client.type === 'SELLER').map((client: any) => client.name).join(', ')
    : '';

  // Get buyer and seller contact information
  const buyerClient = formData.clients?.find((client: any) => client.type === 'BUYER');
  const sellerClient = formData.clients?.find((client: any) => client.type === 'SELLER');

  // Format date strings
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US');
    } catch (e) {
      return dateString;
    }
  };

  // Format currency values
  const formatCurrency = (value?: string) => {
    if (!value) return '';
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(numValue)) return value;
    return numValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '');
  };

  // Create a mapping of template placeholders to form data
  return {
    // Property information
    propertyAddress: formData.propertyData?.address || '',
    mlsNumber: formData.propertyData?.mlsNumber || '',
    salePrice: formatCurrency(formData.propertyData?.salePrice),
    propertyStatus: formData.propertyData?.status || '',
    propertyType: formData.propertyData?.propertyType || '',
    county: formData.propertyData?.county || '',
    closingDate: formatDate(formData.propertyData?.closingDate),

    // Agent information
    agentName: formData.agentData?.name || '',
    agentEmail: formData.agentData?.email || '',
    agentPhone: formData.agentData?.phone || '',
    agentRole: formData.agentData?.role || '',

    // Client information (general)
    clientNames,

    // Buyer information (for Buyer and Dual Agent templates)
    buyerName: buyers || clientNames,
    buyerAddress: buyerClient?.address || '',
    buyerPhone: buyerClient?.phone || (formData.clients && formData.clients[0]?.phone) || '',
    buyerEmail: buyerClient?.email || (formData.clients && formData.clients[0]?.email) || '',

    // Seller information (for Seller and Dual Agent templates)
    sellerName: sellers || clientNames,
    sellerAddress: sellerClient?.address || formData.propertyData?.address || '',
    sellerPhone: sellerClient?.phone || (formData.clients && formData.clients[0]?.phone) || '',
    sellerEmail: sellerClient?.email || (formData.clients && formData.clients[0]?.email) || '',

    // Commission information
    commissionAmount: formatCurrency(formData.commissionData?.totalCommission),
    commissionPercentage: formData.commissionData?.totalCommissionPercentage || '',

    // Title information
    titleCompany: formData.titleData?.titleCompany || '',

    // Additional information
    specialInstructions: formData.additionalInfo?.specialInstructions || formData.additionalInfo?.notes || '',
    urgentIssues: formData.additionalInfo?.urgentIssues || '',
    notes: formData.additionalInfo?.notes || '',

    // Transaction date
    transactionDate: new Date().toLocaleDateString('en-US'),
    submissionDate: new Date().toLocaleDateString('en-US'),
  };
};
