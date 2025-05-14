export const formatters = {
  formatPhoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
  },

  formatPercentage: (value: string | number): string => {
    return Number(value).toFixed(2);
  },

  formatCurrency: (value: string | number): string => {
    return Number(value).toFixed(2);
  },

  formatSingleSelect: (value: string): string => {
    return value;
  },

  // Mapping for single select fields
  singleSelectOptions: {
    propertyStatus: ['OCCUPIED', 'VACANT'],
    winterized: ['YES', 'NO'],
    updateMls: ['YES', 'NO'],
    commissionBase: ['SALE PRICE', 'NET PRICE'],
    referral: ['YES', 'NO'],
    requiresFollowUp: ['YES', 'NO'],
    agentRole: ['BUYERS AGENT', 'LISTING AGENT', 'DUAL AGENT'],
    clientType: ['BUYER', 'SELLER'],
    maritalStatus: ['SINGLE', 'MARRIED', 'DIVORCED', 'DIVORCE IN PROGRESS', 'WIDOWED'],
    paidBy: ['SELLER', 'BUYER', 'AGENT']
  },

  // Display versions (lowercase) for the UI
  displayOptions: {
    propertyStatus: ['Occupied', 'Vacant'],
    winterized: ['Yes', 'No'],
    updateMls: ['Yes', 'No'],
    commissionBase: ['Sale Price', 'Net Price'],
    referral: ['Yes', 'No'],
    requiresFollowUp: ['Yes', 'No'],
    agentRole: ['Buyer\'s Agent', 'Listing Agent', 'Dual Agent'],
    clientType: ['Buyer', 'Seller'],
    maritalStatus: ['Single', 'Married', 'Divorced', 'Divorce in Progress', 'Widowed']
  }
};