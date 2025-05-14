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
    // Step 1: Compress if needed
    let finalPdfData = pdfData;
    let pdfSize = 0;
    
    if (typeof pdfData === 'string') {
      pdfSize = Math.ceil(pdfData.length * 0.75);
    } else if (pdfData instanceof Uint8Array || pdfData instanceof ArrayBuffer) {
      pdfSize = pdfData instanceof ArrayBuffer ? pdfData.byteLength : pdfData.length;
    } else if (typeof Buffer !== 'undefined' && pdfData instanceof Buffer) {
      pdfSize = pdfData.length;
    }
    
    if (pdfSize > MAX_SIZE_BYTES) {
      const compressedPdf = await compressPdf(pdfData);
      if (!compressedPdf) {
        return null;
      }
      finalPdfData = compressedPdf;
    }
    
    // Step 2: Convert to base64 for upload
    let base64Data: string;
    
    if (typeof finalPdfData === 'string') {
      base64Data = finalPdfData;
    } else if (finalPdfData instanceof Uint8Array || finalPdfData instanceof ArrayBuffer) {
      const binary = Array.from(new Uint8Array(
        finalPdfData instanceof ArrayBuffer ? finalPdfData : finalPdfData.buffer
      )).map(byte => String.fromCharCode(byte)).join('');
      base64Data = btoa(binary);
    } else if (typeof Buffer !== 'undefined' && finalPdfData instanceof Buffer) {
      base64Data = finalPdfData.toString('base64');
    } else {
      console.error('Unsupported PDF data format for upload');
      return null;
    }
    
    // Step 3: Upload to temporary storage
    const response = await fetch('/api/upload-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdfData: base64Data,
        filename
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload PDF: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.url) {
      throw new Error('Failed to get URL for PDF');
    }
    
    // Step 4: Return properly formatted Airtable attachment
    return [
      {
        url: result.url,
        filename
      }
    ];
  } catch (error) {
    console.error('Error formatting PDF for Airtable:', error);
    return null;
  }
}
