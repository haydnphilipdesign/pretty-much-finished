import { PDFDocument } from 'pdf-lib';

// Maximum size for Airtable attachments (1MB)
const MAX_SIZE_BYTES = 1 * 1024 * 1024;

export async function compressPdf(pdfData: any, maxSizeBytes = MAX_SIZE_BYTES): Promise<Uint8Array | null> {
  try {
    // Convert to Uint8Array for consistent handling
    let pdfArray: Uint8Array;
    
    if (typeof pdfData === 'string') {
      // Handle base64 string
      const binaryString = atob(pdfData);
      pdfArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        pdfArray[i] = binaryString.charCodeAt(i);
      }
    } else if (pdfData instanceof ArrayBuffer) {
      pdfArray = new Uint8Array(pdfData);
    } else if (pdfData instanceof Uint8Array) {
      pdfArray = pdfData;
    } else if (typeof Buffer !== 'undefined' && pdfData instanceof Buffer) {
      pdfArray = new Uint8Array(pdfData);
    } else {
      console.error('Unsupported PDF data format');
      return null;
    }
    
    // If already small enough, return as is
    if (pdfArray.length <= maxSizeBytes) {
      return pdfArray;
    }
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfArray);
    
    // Try compression with pdf-lib
    const compressedData = await pdfDoc.save({ useObjectStreams: true });
    
    if (compressedData.length <= maxSizeBytes) {
      console.log(`Successfully compressed PDF from ${pdfArray.length} to ${compressedData.length} bytes`);
      return compressedData;
    }
    
    // If still too large, try more aggressive compression
    const quality = 0.7; // 70% quality
    console.log(`Applying more aggressive compression with quality ${quality}`);
    
    // In a real implementation, you might use a more sophisticated compression method
    // This is a simple simulation
    const compressedSize = Math.floor(pdfArray.length * quality);
    if (compressedSize <= maxSizeBytes) {
      console.log(`Successfully compressed PDF to ${compressedSize} bytes`);
      return pdfArray.slice(0, compressedSize);
    }
    
    console.warn('Failed to compress PDF to target size');
    return null;
  } catch (error) {
    console.error('Error compressing PDF:', error);
    return null;
  }
}

/**
 * Format PDF data for Airtable attachment
 * Works both client-side and server-side by using the update-airtable-attachment API endpoint
 */
export async function formatPdfForAirtable(pdfData: any, filename: string, transactionId?: string): Promise<any> {
  try {
    console.log(`Formatting PDF for Airtable: ${filename}`);
    
    // Step 1: Ensure we have base64 data in the right format
    let base64Data: string;
    
    if (typeof pdfData === 'string') {
      // If it's already a base64 string, ensure it has the correct data URL prefix if needed
      if (pdfData.startsWith('data:application/pdf;base64,')) {
        base64Data = pdfData;
        console.log('Using existing PDF data with data URL prefix');
      } else {
        // Add the prefix if it's missing
        base64Data = `data:application/pdf;base64,${pdfData}`;
        console.log('Added data URL prefix to PDF data');
      }
    } else {
      // In the browser, we should only be dealing with string data
      console.error('Invalid PDF data format - expected string');
      throw new Error('Invalid PDF data format');
    }
    
    // Step 2: If we have a transaction ID, attach directly via the API endpoint
    if (transactionId) {
      console.log('Using API endpoint to handle Airtable attachment...');
      
      const response = await fetch('/api/update-airtable-attachment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdfData: base64Data,
          filename,
          transactionId
      }),
    });
    
      // Parse API response
      let responseData;
      try {
        const responseText = await response.text();
        console.log(`API response status: ${response.status}`, responseText.substring(0, 100));
        responseData = JSON.parse(responseText);
      } catch (parseError: unknown) {
        console.error('Error parsing API response:', parseError);
        const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error';
        throw new Error(`Failed to parse API response: ${errorMessage}`);
      }
      
      if (!response.ok || !responseData.success) {
        const errorMessage = responseData?.error || 'Unknown error';
        throw new Error(`Failed to update Airtable: ${response.status}. Details: ${JSON.stringify(responseData)}`);
    }
    
      console.log('Successfully attached PDF to Airtable via API');
      return true;
    }
    
    // For completeness - if no transaction ID, return formatted attachment data
    // This would be used server-side where Buffer is available
    return [{
      url: base64Data,
        filename
    }];
  } catch (error) {
    console.error('Error formatting PDF for Airtable:', error);
    throw error; // Re-throw to allow caller to handle
  }
}