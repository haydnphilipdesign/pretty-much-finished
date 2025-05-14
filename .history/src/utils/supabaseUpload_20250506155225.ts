/**
 * Supabase PDF upload utility for transaction forms
 * Integrates with the form submission process to upload PDFs to Supabase storage
 */
import { TransactionFormData } from "@/types/transaction";

/**
 * Uploads a PDF to Supabase storage and returns the public URL
 * @param pdfData Base64 encoded PDF data
 * @param filename Name of the file to be stored
 * @param transactionId ID of the transaction in Airtable (used for naming)
 * @returns Promise resolving to the upload result
 */
export const uploadPdfToSupabase = async (
  pdfData: string,
  filename: string,
  transactionId?: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    console.log(`Preparing to upload PDF to Supabase: ${filename}`);
    
    // Ensure we have base64 data without the data URL prefix
    const base64Data = pdfData.includes('base64,') 
      ? pdfData.split('base64,')[1] 
      : pdfData;
    
    // Create a unique filename using the transaction ID if available
    const uniqueFilename = transactionId 
      ? `${transactionId}-${filename}` 
      : `transaction-${new Date().getTime()}-${filename}`;
    
    // Call the Supabase PDF upload API endpoint
    const response = await fetch('/api/supabase-pdf-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdfData: base64Data,
        transactionId,
        filename: uniqueFilename
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error uploading PDF to Supabase:', errorText);
      return { 
        success: false, 
        error: `Upload failed: ${response.status} ${response.statusText}` 
      };
    }
    
    const result = await response.json();
    
    if (!result.success) {
      return { 
        success: false, 
        error: result.error || 'Unknown error during upload' 
      };
    }
    
    console.log('PDF successfully uploaded to Supabase');
    return {
      success: true,
      url: result.url
    };
  } catch (error) {
    console.error('Error in uploadPdfToSupabase:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during upload'
    };
  }
};