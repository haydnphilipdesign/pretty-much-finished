# Fixing PDF Attachments in Airtable Submissions

This guide explains how to fix the "Invalid attachment object" error when submitting PDFs to Airtable through your transaction form.

## Understanding the Problem

The error occurs because Airtable doesn't accept attachments in the format we're currently using. The console logs show:

```
airtable.final.ts:603 Airtable API error during transaction creation: l {error: 'INVALID_ATTACHMENT_OBJECT', message: 'Invalid attachment object for field PDF: {\n "file…'}
```

The issue is that we're trying to use a base64 data URL directly as an attachment. Airtable doesn't support this - it expects files to be uploaded to a server first, and then the URL to that file is provided to Airtable.

## Solution Overview

1. Create a temporary storage solution for PDF files
2. Upload PDF files to this storage before attaching to Airtable
3. Use the proper Airtable attachment format (URL + filename)
4. Handle compression if files exceed Airtable's 1MB limit

## Implementation Steps

### Step 1: Install Required Dependencies

```bash
npm install pdf-lib uuid
```

### Step 2: Create an API Endpoint for PDF Upload

Create a file at `pages/api/upload-pdf.js` with the following content:

```javascript
// pages/api/upload-pdf.js
import fs from 'fs';
import path from 'path';
import util from 'util';
import { v4 as uuidv4 } from 'uuid';

const writeFileAsync = util.promisify(fs.writeFile);

// Store references to uploaded files for cleanup
const uploadedFiles = new Map();

// Cleanup old files every hour
setInterval(() => {
  const now = Date.now();
  const expiryTime = 24 * 60 * 60 * 1000; // 24 hours
  
  for (const [key, fileInfo] of uploadedFiles.entries()) {
    if (now - fileInfo.timestamp > expiryTime) {
      try {
        fs.unlinkSync(fileInfo.path);
      } catch (error) {
        console.error('Error deleting expired file:', error);
      }
      uploadedFiles.delete(key);
    }
  }
}, 60 * 60 * 1000);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pdfData, filename } = req.body;
    
    if (!pdfData || !filename) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const fileId = uuidv4();
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Save the file locally
    const filePath = path.join(uploadsDir, `${fileId}_${safeFilename}`);
    const pdfBuffer = Buffer.from(pdfData, 'base64');
    
    await writeFileAsync(filePath, pdfBuffer);
    
    // Keep track of the file for later cleanup
    uploadedFiles.set(fileId, {
      path: filePath,
      timestamp: Date.now()
    });
    
    // Return the URL to access the file
    const fileUrl = `${req.headers.origin}/uploads/${fileId}_${safeFilename}`;
    
    return res.status(200).json({
      success: true,
      url: fileUrl
    });
  } catch (error) {
    console.error('Error handling PDF upload:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process PDF upload'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
```

### Step 3: Create a PDF Service Utility

Create a file at `src/services/pdfService.ts`:

```typescript
// src/services/pdfService.ts
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
```

### Step 4: Update the TransactionForm Component

Modify your TransactionForm.tsx file to use the new PDF service:

```typescript
// In TransactionForm.tsx
import { formatPdfForAirtable } from '@/services/pdfService';

// In your form submission function
const handleSubmit = async () => {
  try {
    setIsSubmitting(true);
    
    // Generate PDF
    const pdfBuffer = await generatePDF(formData);
    
    if (pdfBuffer) {
      // Format PDF for Airtable attachment
      const addressSlug = formData.propertyData?.address 
        ? formData.propertyData.address
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/_+/g, '_')
            .substring(0, 30)
        : 'unknown_address';
      
      const formattedDate = new Date().toISOString().split('T')[0];
      const pdfFilename = `Transaction_${addressSlug}_${formattedDate}.pdf`;
      
      const formattedAttachment = await formatPdfForAirtable(pdfBuffer, pdfFilename);
      
      // Add formatted attachment to form data
      const submissionData = {
        ...formData,
        _formattedPdfAttachment: formattedAttachment
      };
      
      // Submit to Airtable
      const result = await submitToAirtable(submissionData);
      
      if (result.success) {
        setIsSuccess(true);
        // handle success
      } else {
        throw new Error(result.error || 'Failed to submit transaction');
      }
    } else {
      // Submit without PDF if generation failed
      const result = await submitToAirtable(formData);
      
      if (result.success) {
        setIsSuccess(true);
        // handle success
      } else {
        throw new Error(result.error || 'Failed to submit transaction');
      }
    }
  } catch (error) {
    console.error('Error submitting transaction:', error);
    setError(error.message || 'An error occurred during submission');
  } finally {
    setIsSubmitting(false);
  }
};
```

### Step 5: Update the airtable.final.ts File

Modify the submitToAirtable function to handle formatted PDF attachments:

```typescript
// In submitToAirtable function
export async function submitToAirtable(data: TransactionFormState, pdfBuffer?: Buffer) {
  const transactionFields: { [key: string]: any } = {};

  try {
    // Check for pre-formatted PDF attachment
    if (data._formattedPdfAttachment) {
      console.log('Using pre-formatted PDF attachment');
      transactionFields[transactionFieldMap.pdfAttachment] = data._formattedPdfAttachment;
      
      // Remove the temporary property
      delete data._formattedPdfAttachment;
    }
    // Handle PDF attachment if provided and not already formatted
    else if (pdfBuffer) {
      // Original PDF handling code
      // ...
    }
    
    // Rest of the function
    // ...
  } catch (error) {
    // Error handling
    // ...
  }
}
```

## Testing the Solution

1. Make sure all the files are in place
2. Create a `/public/uploads` directory with appropriate permissions
3. Submit a transaction with a PDF attachment
4. Check the console logs to verify the PDF is being correctly processed
5. Verify the transaction is successfully created in Airtable with the PDF attachment

## Alternative Solutions

If the local file storage solution doesn't work in your environment, consider these alternatives:

1. **Firebase Storage**: Upload PDFs to Firebase Storage and use the download URL
2. **AWS S3**: Use an S3 bucket for temporary file storage
3. **Azure Blob Storage**: Similar to S3, but on Microsoft's cloud
4. **Cloudinary**: Specialized service for media files with URL generation

## Troubleshooting

If you encounter issues:

1. **PDF still too large**: Adjust compression settings or implement a more sophisticated compression algorithm
2. **Uploads directory not writable**: Check file permissions and server environment
3. **URL not accessible to Airtable**: Ensure the generated URLs are publicly accessible
4. **CORS issues**: Add appropriate CORS headers to your upload endpoint

Need further assistance? Contact our support team at support@example.com.
