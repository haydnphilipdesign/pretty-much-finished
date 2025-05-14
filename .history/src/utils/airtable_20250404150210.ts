/**
 * Airtable utilities for the client side
 */
import { generateCoverSheetForTransaction } from './clientUtils';

// Airtable API key and base ID
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY as string;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID as string;

/**
 * Submit transaction data to Airtable
 * @param data The transaction data to submit
 * @returns The created record ID
 */
export const submitToAirtable = async (data: any): Promise<string> => {
  try {
    // Address fields from data
    const addressFields = {
      'PROPERTY STREET ADDRESS': data.propertyStreetAddress || '',
      'PROPERTY CITY': data.propertyCity || '',
      'PROPERTY STATE': data.propertyState || '',
      'PROPERTY ZIP': data.propertyZip || '',
    };

    // Format data for Airtable
    const formattedData = {
      fields: {
        // Property details
        ...addressFields,
        'MLS#': data.mlsNumber || '',
        'SALE PRICE': data.salePrice ? parseFloat(data.salePrice) : 0,
        'SALE STATUS': data.saleStatus || 'Pending',
        
        // Client details
        'CLIENT TYPE': data.clientType || 'Buyer',
        'CLIENT FIRST NAME': data.clientFirstName || '',
        'CLIENT LAST NAME': data.clientLastName || '',
        'CLIENT EMAIL': data.clientEmail || '',
        'CLIENT PHONE': data.clientPhone || '',
        
        // Agent details
        'AGENT NAME': data.agentName || '',
        'AGENT EMAIL': data.agentEmail || '',
        'AGENT PHONE': data.agentPhone || '',
        'AGENT ROLE': data.agentRole || 'DUAL AGENT',
        
        // Commission details
        'COMMISSION %': data.commissionPercent ? parseFloat(data.commissionPercent) : 3,
        'BROKER COMMISSION': data.brokerCommission ? parseFloat(data.brokerCommission) : 0,
        
        // Additional fields
        'SPECIAL INSTRUCTIONS': data.specialInstructions || '',
        'URGENT': data.urgent || false,
        'NOTES': data.notes || '',
      },
    };

    // Submit to Airtable Transactions table
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to submit to Airtable');
    }

    // Get the created record ID
    const recordId = result.id;
    console.log('Submitted to Airtable, record ID:', recordId);

    // Generate cover sheet
    if (recordId) {
      try {
        await generateCoverSheetForTransaction(recordId, data.agentRole || 'DUAL AGENT');
      } catch (error) {
        console.error('Error generating cover sheet:', error);
        // Continue even if cover sheet generation fails
      }
    }

    return recordId;
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    throw error;
  }
};
