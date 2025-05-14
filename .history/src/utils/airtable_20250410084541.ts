/**
 * Airtable utilities for the client side
 */
import { generateCoverSheetForTransaction } from './clientUtils';

// Airtable API key and base ID - for client side use only
const AIRTABLE_API_KEY = typeof import !== 'undefined' && import.meta && import.meta.env 
  ? import.meta.env.VITE_AIRTABLE_API_KEY as string 
  : '';
const AIRTABLE_BASE_ID = typeof import !== 'undefined' && import.meta && import.meta.env 
  ? import.meta.env.VITE_AIRTABLE_BASE_ID as string 
  : '';

/**
 * Submit transaction data to Airtable
 * @param data The transaction data to submit
 * @returns The created record ID
 */
export const submitToAirtable = async (data: any): Promise<string> => {
  try {
    console.log('Starting submission to Airtable...');
    
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

    console.log('Submitting data to Airtable...');
    
    // Submit to Airtable Transactions table
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Airtable submission failed:', errorResponse);
      throw new Error(errorResponse.error?.message || `Failed to submit to Airtable: ${response.status}`);
    }

    const result = await response.json();
    
    // Get the created record ID
    const recordId = result.id;
    console.log('Submitted to Airtable, record ID:', recordId);

    // Generate cover sheet with retries
    if (recordId) {
      console.log('Triggering cover sheet generation and email...');
      
      // Try up to 3 times with delay between attempts
      const maxRetries = 3;
      let attempts = 0;
      let success = false;
      
      while (attempts < maxRetries && !success) {
        attempts++;
        try {
          // Allow a small delay for Airtable record to be fully available
          if (attempts > 1) {
            console.log(`Retrying cover sheet generation (attempt ${attempts})...`);
            await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
          }
          
          success = await generateCoverSheetForTransaction(recordId, data.agentRole || 'DUAL AGENT');
          
          if (success) {
            console.log('Cover sheet generated and email sent successfully!');
          } else {
            console.warn('Cover sheet generation returned false');
          }
        } catch (error) {
          console.error(`Error generating cover sheet (attempt ${attempts}):`, error);
          // Continue to next attempt
        }
      }
      
      if (!success) {
        console.error('All attempts to generate cover sheet failed');
      }
    }

    return recordId;
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    throw error;
  }
};
