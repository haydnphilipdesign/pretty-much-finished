/**
 * PDF generation service for transaction forms
 * This version uses the local API endpoint with pdf-lib instead of the external service
 */
import { TransactionFormData } from "@/types/transaction";
import { getTransactionEmailContent } from './emailTemplates';
import { formatPdfForAirtable } from '@/services/pdfService';

/**
 * Sends a transaction PDF via the local API endpoint
 * @param formData The transaction form data
 * @returns Promise resolving to a status message
 */
export const sendTransactionPdfViaApi = async (formData: TransactionFormData, transactionId?: string): Promise<string> => {
  console.log('Sending transaction PDF via local API...');
  try {
    // Use the new API endpoint for both local and Vercel environments
    const apiUrl = '/api/generate-pdf';
    console.log(`Calling PDF generation API at: ${apiUrl}`);
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    // Include the transactionId in the request if it's available
    const dataToSend = {
      ...formData,
      transactionId: transactionId || formData.transactionId
    };
    
    console.log('Sending data to PDF API with transactionId:', dataToSend.transactionId);
    
    // Generate a formatted email body using our template
    const emailBody = getTransactionEmailContent(formData);
    const propertyAddress = formData.propertyData?.address || 'Unknown Property';
    const mlsNumber = formData.propertyData?.mlsNumber || 'Unknown MLS';
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear the timeout if request completes

      if (!response.ok) {
        let errorMessage = `Failed to send PDF: HTTP ${response.status}`;
        try {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch (jsonError) {
            // Use the text response as the error message if it's not JSON
            if (errorText) errorMessage += ` - ${errorText}`;
          }
        } catch (textError) {
          console.error('Error reading response text:', textError);
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('API response data:', responseData);

      if (responseData.success) {
        // Just return success message - no PDF attachment to Airtable
        return responseData.message || 'PDF generated and emailed successfully';
      } else {
        throw new Error(responseData.error || 'Unknown error');
      }
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out after 30 seconds');
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId); // Ensure timeout is cleared
    }
  } catch (error) {
    console.error('Error sending transaction PDF via API:', error);
    throw error;
  }
};

/**
 * Updates an Airtable record with a PDF attachment
 * @param transactionId The ID of the transaction record in Airtable
 * @param attachment The formatted attachment object
 * @returns Promise resolving to a boolean indicating success
 */
async function updateAirtableAttachment(transactionId: string, attachment: any): Promise<boolean> {
  try {
    console.log(`Updating Airtable record ${transactionId} with attachment`);
    
    // This could be implemented as a separate API endpoint
    // For now, let's use a simple fetch request to a hypothetical endpoint
    const response = await fetch('/api/update-airtable-attachment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionId,
        attachment,
        fieldId: 'fldhrYdoFwtNfzdFY' // The field ID for PDF attachments
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update Airtable: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error updating Airtable attachment:', error);
    return false;
  }
}