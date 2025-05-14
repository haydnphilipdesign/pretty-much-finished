/**
 * Airtable utilities for the client side
 */
import { generateCoverSheetForTransaction } from './clientUtils';

// Airtable API key and base ID - for client side use only
const AIRTABLE_API_KEY = typeof window !== 'undefined' && typeof import.meta !== 'undefined' 
  ? (import.meta.env.VITE_AIRTABLE_API_KEY as string) 
  : '';
const AIRTABLE_BASE_ID = typeof window !== 'undefined' && typeof import.meta !== 'undefined' 
  ? (import.meta.env.VITE_AIRTABLE_BASE_ID as string)
  : '';

/**
 * Submit transaction data to Airtable
 * @param data The transaction data to submit
 * @returns The created record ID
 */
export const submitToAirtable = async (data: any): Promise<string> => {
  try {
    console.log('Starting submission to Airtable...');
    
    // Format data for Airtable
    const formattedData = {
      fields: {
        // Property details
        'MLS#': data.propertyData?.mlsNumber || '',
        'PROPERTY STREET ADDRESS': data.propertyData?.address || '',
        'SALE PRICE': data.propertyData?.salePrice ? parseFloat(data.propertyData.salePrice) : 0,
        'SALE STATUS': data.propertyData?.status || 'Pending',
        'WINTERIZED': data.propertyData?.isWinterized ? 'YES' : 'NO',
        
        // Agent details
        'AGENT NAME': data.agentData?.name || '',
        'AGENT EMAIL': data.agentData?.email || '',
        'AGENT PHONE': data.agentData?.phone || '',
        'AGENT ROLE': data.agentData?.role || 'DUAL AGENT',
        
        // Commission details
        'COMMISSION %': data.commissionData?.totalCommissionPercentage ? parseFloat(data.commissionData.totalCommissionPercentage) : 0,
        'LISTING AGENT %': data.commissionData?.listingAgentPercentage ? parseFloat(data.commissionData.listingAgentPercentage) : 0,
        'BUYERS AGENT %': data.commissionData?.buyersAgentPercentage ? parseFloat(data.commissionData.buyersAgentPercentage) : 0,
        'BROKER COMMISSION': data.commissionData?.brokerFee ? parseFloat(data.commissionData.brokerFee) : 0,
        
        // Additional fields
        'SPECIAL INSTRUCTIONS': data.additionalInfo?.specialInstructions || '',
        'URGENT': data.additionalInfo?.urgentIssues ? true : false,
        'NOTES': data.additionalInfo?.notes || '',
      },
    };

    console.log('Submitting data to Airtable:', JSON.stringify(formattedData, null, 2));
    
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
    const recordId = result.id;
    console.log('Successfully submitted to Airtable, record ID:', recordId);

    // Generate cover sheet with retries
    if (recordId) {
      console.log('Triggering cover sheet generation...');
      
      const coverSheetOptions = {
        tableId: 'tblHyCJCpQSgjn0md', // Transactions table ID
        recordId: recordId,
        agentRole: data.agentData?.role || 'DUAL AGENT',
        sendEmail: true,
        data: formattedData.fields // Pass the formatted data
      };

      console.log('Cover sheet options:', JSON.stringify(coverSheetOptions, null, 2));

      const coverSheetResponse = await fetch('/api/generateCoverSheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coverSheetOptions),
      });

      const coverSheetResult = await coverSheetResponse.json();
      
      if (!coverSheetResponse.ok) {
        console.error('Cover sheet generation failed:', coverSheetResult);
        throw new Error(coverSheetResult.message || 'Failed to generate cover sheet');
      }

      console.log('Cover sheet generation result:', coverSheetResult);
    }

    return recordId;
  } catch (error) {
    console.error('Error in submitToAirtable:', error);
    throw error;
  }
};
