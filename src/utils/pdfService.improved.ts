/**
 * PDF generation service for transaction forms
 * This version uses the local API endpoint with pdf-lib instead of the external service
 */
import { TransactionFormData } from "@/types/transaction";
import { getTransactionEmailContent } from './emailTemplates';
import { formatPdfForAirtable } from '@/services/pdfService';
import logger from '@/utils/logger';

// Create dedicated logger for PDF service
const log = logger.createLogger('PDF_SERVICE');

// Get the Vercel bypass secret from environment if available
const BYPASS_SECRET = process.env.NEXT_PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET;

/**
 * Sends a transaction PDF via the local API endpoint
 * @param formData The transaction form data
 * @param transactionId Optional transaction ID 
 * @param retryCount Number of retries attempted (for internal use)
 * @returns Promise resolving to a status message
 */
export const sendTransactionPdfViaApi = async (
  formData: TransactionFormData, 
  transactionId?: string, 
  retryCount: number = 0
): Promise<string> => {
  const MAX_RETRIES = 2; // Maximum number of retry attempts
  
  log.info(`Sending transaction PDF via local API... (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
  try {
    // Use the correct API endpoint for both local and production environments
    // First try the relative path which should work in both environments
    const apiUrl = '/api/generate-pdf';
    log.info(`Calling PDF generation API at: ${apiUrl}`);
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    // Include the transactionId in the request if it's available
    const dataToSend = {
      ...formData,
      transactionId: transactionId || (formData as any).transactionId
    };
    
    log.info('Sending data to PDF API with transactionId:', dataToSend.transactionId);
    
    // Log the size of the data being sent
    const dataSize = JSON.stringify(dataToSend).length;
    log.info(`Request data size: ${dataSize} bytes`);
    
    // Check if data size is reasonable
    if (dataSize > 5 * 1024 * 1024) { // 5MB
      log.warn('Warning: Large request data size may cause issues with serverless functions');
    }
    
    // Get the bypass secret from environment
    const bypassSecret = process.env.NEXT_PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET || BYPASS_SECRET;
    
    log.debug('Using bypass secret for authentication:', bypassSecret ? 'Secret available' : 'Secret missing');
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header as Bearer token for better compatibility
          'Authorization': `Bearer ${bypassSecret}`,
          // Also keep the bypass_secret header for backward compatibility
          'bypass_secret': bypassSecret
        },
        body: JSON.stringify(dataToSend),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear the timeout
      
      if (!response.ok) {
        let errorMessage = `Failed to send PDF: HTTP ${response.status}`;
        try {
          const errorText = await response.text();
          log.error('Error response text:', errorText);
          
          // Log full response details for debugging
          log.debug('Response status:', response.status);
          log.debug('Response headers:', JSON.stringify(Array.from(response.headers.entries())));
          
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
            
            // Log more detailed error information if available
            if (errorData.details) {
              log.error('Detailed error information:', errorData.details);
            }
            
            // Check for specific error conditions
            if (response.status === 401) {
              log.error('Authentication failed. Check VERCEL_AUTOMATION_BYPASS_SECRET configuration.');
            } else if (response.status === 500) {
              log.error('Server error occurred. Check server logs for more details.');
            }
          } catch (jsonError) {
            // Use the text response as the error message if it's not JSON
            if (errorText) {
              errorMessage += ` - ${errorText}`;
              log.error('Non-JSON error response:', errorText);
            }
          }
        } catch (textError) {
          log.error('Error reading response text:', textError);
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      log.info('API response data:', responseData);

      if (responseData.success) {
        // Just return success message - no PDF attachment to Airtable
        return responseData.message || 'PDF generated and emailed successfully';
      } else {
        throw new Error(responseData.error || 'Unknown error');
      }
    } catch (fetchError: any) {
      if (fetchError.name === 'AbortError') {
        log.error('API request timed out after 30 seconds');
        throw new Error('Request timed out after 30 seconds');
      }
      
      // Implement retry logic for certain error types
      if (retryCount < MAX_RETRIES) {
        log.warn(`API request failed, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
        
        // Exponential backoff: wait longer between each retry
        const backoffTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s, etc.
        log.info(`Waiting ${backoffTime}ms before retry...`);
        
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        // Try fallback URL if we're on the first retry
        if (retryCount === 0) {
          // Clear the timeout
          clearTimeout(timeoutId);
          
          // Try with absolute URL on first retry
          const absoluteUrl = 'https://www.parealestatesupport.com/api/generate-pdf';
          log.info(`Trying fallback URL: ${absoluteUrl}`);
          
          const altResponse = await fetch(absoluteUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${bypassSecret}`,
              'bypass_secret': bypassSecret
            },
            body: JSON.stringify(dataToSend)
          });
          
          if (!altResponse.ok) {
            log.warn(`Fallback URL failed with status ${altResponse.status}, continuing with normal retry`);
          } else {
            log.info('Fallback URL successful');
            const altData = await altResponse.json();
            return altData.message || 'PDF generated via fallback URL';
          }
          
          // If fallback didn't work, continue with regular retry
          return await sendTransactionPdfViaApi(formData, transactionId, retryCount + 1);
        } else {
          // Increment retry counter
          return await sendTransactionPdfViaApi(formData, transactionId, retryCount + 1);
        }
      }
      
      throw fetchError;
    } finally {
      clearTimeout(timeoutId); // Ensure timeout is cleared
    }
  } catch (error) {
    log.error('Error sending transaction PDF via API:', error);
    
    // Add more context to the error
    const enhancedError = new Error(
      `PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
      `Check the network tab for more details and ensure the API endpoint is accessible.`
    );
    
    // Preserve original stack trace if possible
    if (error instanceof Error) {
      enhancedError.stack = error.stack;
    }
    
    throw enhancedError;
  }
};

/**
 * Updates an Airtable record with a PDF attachment
 * @param transactionId The ID of the transaction record in Airtable
 * @param attachment The formatted attachment object
 * @returns Promise resolving to a boolean indicating success
 */
export async function updateAirtableAttachment(transactionId: string, attachment: any): Promise<boolean> {
  try {
    log.info(`Updating Airtable record ${transactionId} with attachment`);
    
    // This could be implemented as a separate API endpoint
    // For now, let's use a simple fetch request to a hypothetical endpoint
    const response = await fetch('/api/update-airtable-attachment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add Vercel bypass secret if available
        ...(BYPASS_SECRET && { 
          'Authorization': `Bearer ${BYPASS_SECRET}`,
          'bypass_secret': BYPASS_SECRET 
        })
      },
      body: JSON.stringify({
        transactionId,
        attachment,
        fieldId: 'fldhrYdoFwtNfzdFY' // The field ID for PDF attachments
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      log.error(`Failed to update Airtable: ${response.status}`, errorText);
      throw new Error(`Failed to update Airtable: ${response.statusText}`);
    }
    
    const result = await response.json();
    log.info('Airtable attachment update successful:', result);
    return result.success;
  } catch (error) {
    log.error('Error updating Airtable attachment:', error);
    return false;
  }
}

/**
 * Diagnostic function to check PDF generation API
 * Performs a quick test of the API endpoint without sending actual data
 */
export async function checkPdfGenerationApi(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    log.info('Checking PDF generation API...');
    
    // Try health check endpoint first if available
    try {
      const healthResponse = await fetch('/api/health-check', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        log.info('Health check successful:', healthData);
        
        // Check if PDF generation is reported as working
        if (healthData.pdfGeneration === false) {
          return {
            success: false,
            message: 'PDF generation service is currently unavailable according to health check',
            details: healthData
          };
        }
      } else {
        log.warn('Health check endpoint not available or returned error');
      }
    } catch (healthError) {
      log.warn('Health check failed, will test API directly:', healthError);
    }
    
    // Do a simple test call to the API
    const testResponse = await fetch('/api/generate-pdf?test=true', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BYPASS_SECRET}`,
        'bypass_secret': BYPASS_SECRET
      }
    });
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      log.error('API test failed:', errorText);
      
      return {
        success: false,
        message: `API test failed with status ${testResponse.status}`,
        details: errorText
      };
    }
    
    const testResult = await testResponse.json();
    log.info('API test successful:', testResult);
    
    return {
      success: true,
      message: 'PDF generation API is working correctly',
      details: testResult
    };
  } catch (error) {
    log.error('Error checking PDF generation API:', error);
    
    return {
      success: false,
      message: `Error checking API: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    };
  }
}

/**
 * Get the current status of the PDF generation system
 * Checks all components and returns their status
 */
export async function getPdfSystemStatus(): Promise<{
  apiAccessible: boolean;
  templateAccessible: boolean;
  emailWorking: boolean;
  details: any;
}> {
  try {
    log.info('Checking PDF system status...');
    
    const statusResponse = await fetch('/api/check-pdf-template', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BYPASS_SECRET}`,
        'bypass_secret': BYPASS_SECRET
      }
    });
    
    if (!statusResponse.ok) {
      log.error(`Template check failed with status ${statusResponse.status}`);
      return {
        apiAccessible: true,
        templateAccessible: false,
        emailWorking: false,
        details: {
          error: `Template check failed with status ${statusResponse.status}`
        }
      };
    }
    
    const statusResult = await statusResponse.json();
    log.info('PDF system status check complete:', statusResult);
    
    return {
      apiAccessible: true,
      templateAccessible: statusResult.success,
      emailWorking: statusResult.emailConfigured || false,
      details: statusResult
    };
  } catch (error) {
    log.error('Error checking PDF system status:', error);
    
    return {
      apiAccessible: false,
      templateAccessible: false,
      emailWorking: false,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}