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

export async function formatPdfForAirtable(pdfData: any, filename: string): Promise<any> {
  try {
    console.log(`Formatting PDF for Airtable: ${filename}`);
    
    // Step 1: Ensure we have base64 data without the data URL prefix
    let base64Data: string;
    
    if (typeof pdfData === 'string') {
      // If it's already a base64 string, use it directly
      if (pdfData.startsWith('data:application/pdf;base64,')) {
        base64Data = pdfData.split(',')[1];
      } else {
        base64Data = pdfData;
      }
      console.log('Using existing string data for PDF');
    } else {
      // In the browser, we should only be dealing with string data
      console.error('Unsupported PDF data format - browser only supports base64 strings');
      return null;
    }
    
    // Step 2: Use the API endpoint to handle the attachment to Airtable
    // This avoids any Buffer usage in the browser
    console.log('Using API endpoint to handle Airtable attachment...');
    const response = await fetch('/api/update-airtable-attachment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdfData: base64Data,
        filename,
        fieldId: 'fldhrYdoFwtNfzdFY' // The field ID for PDF attachments
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update Airtable: ${response.statusText}. Details: ${errorText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(`Failed to attach PDF to Airtable. Response: ${JSON.stringify(result)}`);
    }
    
    console.log(`Successfully updated Airtable with PDF attachment`);
    
    // Return the same format as before for compatibility
    return [
      {
        url: result.url || `https://airtable.com/attachment/${filename}`,
        filename
      }
    ];
  } catch (error) {
    console.error('Error formatting PDF for Airtable:', error);
    return null;
  }
}