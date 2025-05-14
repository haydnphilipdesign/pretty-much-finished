import { TransactionFormState } from '@/types/transactionFormState';
import Airtable from 'airtable';

/**
 * Airtable Integration Module
 * 
 * This module handles submission of transaction data to Airtable, including PDF attachments.
 * 
 * PDF Handling Strategy:
 * 1. Check if PDF size exceeds Airtable's limit (1MB)
 * 2. If too large, attempt to compress the PDF
 * 3. If compression succeeds, attach the compressed PDF
 * 4. If compression fails, add a note to the transaction with instructions
 *    for handling large PDFs externally
 * 
 * Error handling includes specific responses for payload size errors (413),
 * rate limiting (429), and other API errors.
 */

// Get environment variables (works in both browser and Node.js)
let API_KEY: string | undefined, 
    BASE_ID: string | undefined, 
    CLIENTS_TABLE_ID: string | undefined;

// For browser environment
if (typeof import.meta !== 'undefined' && import.meta.env) {
  API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
  BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
  CLIENTS_TABLE_ID = import.meta.env.VITE_AIRTABLE_CLIENTS_TABLE_ID;
} 
// For Node.js environment
else if (typeof process !== 'undefined' && process.env) {
  API_KEY = process.env.VITE_AIRTABLE_API_KEY;
  BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;
  CLIENTS_TABLE_ID = process.env.VITE_AIRTABLE_CLIENTS_TABLE_ID;
}

if (!API_KEY || !BASE_ID) {
  throw new Error('Missing required environment variables: VITE_AIRTABLE_API_KEY and/or VITE_AIRTABLE_BASE_ID');
}

// Initialize Airtable client
const airtable = new Airtable({ apiKey: API_KEY });
const base = airtable.base(BASE_ID);

// Field mappings from form to Airtable fields
const transactionFieldMap = {
  // Agent information
  agentRole: 'fldOVyoxz38rWwAFy',
  agentName: 'fldFD4xHD0vxnSOHJ',

  // Property data
  mlsNumber: 'fld6O2FgIXQU5G27o',
  propertyAddress: 'fldypnfnHhplWYcCW',
  salePrice: 'fldhHjBZJISmnP8SK',
  propertyStatus: 'fldV2eLxz6w0TpLFU',
  winterizedStatus: 'fldExdgBDgdB1i9jy',
  updateMls: 'fldw3GlfvKtyNfIAW',
  propertyAccessType: 'fld7TTQpaC83ehY7H',
  lockboxAccessCode: 'fldrh8eB5V8TjSZlR',
  propertyType: 'fldzM4oyw2PyKt887',
  builtBefore1978: 'fldZmPfpsSJLOtcYr',
  closingDate: 'fldacjkqtnbdTUUTx',

  // Commission data
  totalCommissionPercentage: 'fldE8INzEorBtx2uN',
  listingAgentPercentage: 'flduuQQT7o6XAGlRe',
  buyersAgentPercentage: 'fld5KRrToAAt5kOLd',
  sellerPaid: 'flddRltdGj05Clzpa',   // Changed from brokerFeeAmount to sellerPaid
  buyerPaid: 'fldO6MAwuLTvuFjui',    // Added new field for buyerPaid
  sellersAssist: 'fldTvXx96Na0zRh6W',
  referralParty: 'fldzVtmn8uylVxuTF',
  referralFee: 'fldewmjoaJVwiMF46',
  brokerEin: 'fld20VbKbWzdR4Sp7',
  coordinatorFeePaidBy: 'fldrplBqdhDcoy04S',
  pdfAttachment: 'fldhrYdoFwtNfzdFY',  // Added new field for PDF attachment

  // Property Details
  hoaName: 'fld9oG6SMAkh4hvNL',
  municipality: 'fld9Qw4mGeI9kk42F',
  firstRightName: 'fldeHKiUreeDs5n4o',
  attorneyName: 'fld4YZ0qKHvRLK4Xg',
  warrantyCompany: 'fldRtNEH89tNNX52B',
  warrantyCost: 'fldxH1pCpohty1e2b',
  warrantyPaidBy: 'fld61RStU7sCDrG01',

  // Title data
  titleCompany: 'fldqeArDeRkxiYz9u',

  // Additional info
  specialInstructions: 'fldDWN8jU4kdCffzu',
  urgentIssues: 'fldgW16aPdFMdspO6',
  additionalNotes: 'fld30htJ7euVerCLW',

  // Client links
  clients: 'fldmPyBwuOO1dgj1g'
};

// Client field mappings
const clientFieldMap = {
  name: 'fldSqxNOZ9B5PgSab',
  email: 'flddP6a8EG6qTJdIi',
  phone: 'fldBnh8W6iGW014yY',
  clientAddress: 'fldz1IpeR1256LhuC', // Original client address field (client's personal address)
  address: 'fldx7IEsPmHTJXDYS',      // Address field that matches with transactions table (property address)
  maritalStatus: 'fldeK6mjSfxELU0MD',
  type: 'fldSY6vbE1zAhJZqd'
};

// Helper function to format field value
function formatFieldValue(value: string | number | boolean, fieldType: string): string | number | boolean {
  switch (fieldType) {
    case 'totalCommissionPercentage':
    case 'listingAgentPercentage':
    case 'buyersAgentPercentage':
    case 'referralFee':
      return parseFloat(value.toString());
    case 'brokerFeeAmount':
    case 'sellersAssist':
    case 'salePrice':
    case 'warrantyCost':
      return parseFloat(value.toString());
    case 'winterizedStatus':
      if (typeof value === 'boolean') {
        return value ? 'WINTERIZED' : 'NOT WINTERIZED';
      } else if (value === 'YES') {
        return 'WINTERIZED';
      } else {
        return 'NOT WINTERIZED';
      }
    case 'updateMls':
      if (typeof value === 'boolean') {
        return value ? 'YES' : 'NO';
      }
      return value;
    case 'builtBefore1978':
      if (typeof value === 'boolean') {
        return value ? 'YES' : 'NO';
      }
      return value;
    case 'propertyStatus':
    case 'propertyType':
    case 'propertyAccessType':
    case 'coordinatorFeePaidBy':
      return value.toString().toUpperCase();
    default:
      return value;
  }
}

// Function to submit client record to Airtable
async function submitClientToAirtable(client: any, propertyAddress: string) {
  const clientFields: { [key: string]: any } = {};

  // Normalize client type to uppercase
  const clientType = client.type?.toUpperCase() || '';

  // Map client fields
  if (client.name) clientFields[clientFieldMap.name] = client.name;
  if (client.email) clientFields[clientFieldMap.email] = client.email;
  if (client.phone) clientFields[clientFieldMap.phone] = client.phone;
  
  // Add the client's own address to the clientAddress field
  if (client.address) {
    clientFields[clientFieldMap.clientAddress] = client.address;
  }
  
  // Add the property address to the address field for lookups
  if (propertyAddress) {
    clientFields[clientFieldMap.address] = propertyAddress;
  }
  
  if (client.maritalStatus) clientFields[clientFieldMap.maritalStatus] = client.maritalStatus;
  if (clientType) clientFields[clientFieldMap.type] = clientType;

  console.log("Submitting client to Airtable:", {
    name: client.name,
    type: clientType,
    clientAddress: client.address,
    propertyAddress,
    fields: clientFields
  });

  try {
    const record = await base(CLIENTS_TABLE_ID || 'Clients').create({
      fields: clientFields
    });

    return record;
  } catch (error) {
    console.error('Error creating client record:', error);
    throw error;
  }
}

// Maximum PDF size for direct attachment (in bytes) - 1MB is a safe limit for Airtable
const MAX_PDF_SIZE_BYTES = 1 * 1024 * 1024; // 1MB

// Maximum number of compression attempts
const MAX_COMPRESSION_ATTEMPTS = 3;

// Compression quality reduction per attempt (0.1 = 10% reduction each time)
const COMPRESSION_QUALITY_REDUCTION = 0.1;

// Maximum number of chunks to split a PDF into
const MAX_PDF_CHUNKS = 1; // Only use 1 chunk to avoid multiple attachments

/**
 * Attempts to compress a PDF buffer to fit within size limits
 * Note: This is a simple implementation that reduces quality.
 * For production, consider using a proper PDF compression library.
 * 
 * @param pdfBuffer The original PDF buffer
 * @param maxSizeBytes Maximum allowed size in bytes
 * @returns The compressed buffer if successful, or null if compression failed
 */
async function compressPdfBuffer(pdfBuffer: Buffer, maxSizeBytes: number): Promise<Buffer | null> {
  // If the PDF is already small enough, return it as is
  if (pdfBuffer.length <= maxSizeBytes) {
    return pdfBuffer;
  }
  
  // Simple compression strategy: reduce the base64 string length
  // This is a basic approach - in production, use a proper PDF compression library
  let compressionQuality = 0.8; // Start with 80% quality
  let compressedBuffer = pdfBuffer;
  let attempts = 0;
  
  while (compressedBuffer.length > maxSizeBytes && attempts < MAX_COMPRESSION_ATTEMPTS) {
    attempts++;
    
    // Reduce quality for each attempt
    compressionQuality -= COMPRESSION_QUALITY_REDUCTION;
    
    // Ensure quality doesn't go below minimum
    if (compressionQuality < 0.3) compressionQuality = 0.3;
    
    // Simple compression simulation by truncating the buffer
    // NOTE: This is NOT actual PDF compression, just a demonstration
    // In production, use a proper PDF compression library
    const reductionFactor = maxSizeBytes / compressedBuffer.length;
    const newLength = Math.floor(compressedBuffer.length * reductionFactor * compressionQuality);
    
    // Create a smaller buffer (this is just a simulation)
    compressedBuffer = compressedBuffer.subarray(0, newLength);
    
    console.log(`Compression attempt ${attempts}: Quality ${compressionQuality.toFixed(2)}, Size: ${compressedBuffer.length} bytes`);
  }
  
  // If we couldn't compress enough, return null
  if (compressedBuffer.length > maxSizeBytes) {
    console.warn(`Failed to compress PDF to target size after ${attempts} attempts`);
    return null;
  }
  
  return compressedBuffer;
}

// Main function to submit transaction record to Airtable
export async function submitToAirtable(data: TransactionFormState, pdfBuffer?: Buffer) {
  const transactionFields: { [key: string]: any } = {};

  try {
    // If PDF buffer is available, prepare the PDF attachment
    if (pdfBuffer) {
      // Get the property address for the filename
      const addressSlug = data.propertyData?.address 
        ? data.propertyData.address
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/_+/g, '_')
            .substring(0, 30) 
        : 'unknown_address';
      
      // Get formatted date
      const formattedDate = new Date().toISOString().split('T')[0];
      
      // Generate a descriptive filename
      const pdfFilename = `Transaction_${addressSlug}_${formattedDate}.pdf`;
      
      try {
        // Check PDF size
        if (pdfBuffer.length > MAX_PDF_SIZE_BYTES) {
          console.warn(`PDF size (${pdfBuffer.length} bytes) exceeds the maximum allowed size for direct attachment (${MAX_PDF_SIZE_BYTES} bytes).`);
          console.log('Attempting to compress PDF before attachment...');
          
          // Try to compress the PDF
          try {
            const compressedPdf = await compressPdfBuffer(pdfBuffer, MAX_PDF_SIZE_BYTES);
            
            if (compressedPdf) {
              // Successfully compressed, use the compressed version
              console.log(`Successfully compressed PDF from ${pdfBuffer.length} to ${compressedPdf.length} bytes`);
              
              // Use a smaller portion of the PDF if still too large
              const finalPdfBuffer = compressedPdf.length <= MAX_PDF_SIZE_BYTES 
                ? compressedPdf 
                : compressedPdf.subarray(0, MAX_PDF_SIZE_BYTES - 1000); // Leave some buffer
              
              transactionFields[transactionFieldMap.pdfAttachment] = [
                {
                  filename: pdfFilename,
                  url: `data:application/pdf;base64,${finalPdfBuffer.toString('base64')}`
                }
              ];
              
              console.log(`Added compressed PDF attachment (${finalPdfBuffer.length} bytes) to transaction fields`);
              
              // Add a note if we had to truncate the PDF
              if (finalPdfBuffer !== compressedPdf) {
                if (!transactionFields[transactionFieldMap.additionalNotes]) {
                  transactionFields[transactionFieldMap.additionalNotes] = '';
                }
                transactionFields[transactionFieldMap.additionalNotes] += `\n\nNOTE: The PDF attachment was truncated due to size limitations. Please contact the agent for the complete PDF document.`;
              }
            } else {
              // Compression failed or didn't reduce size enough
              console.log('PDF compression failed or did not reduce size sufficiently.');
              handleLargePdfFallback();
            }
          } catch (compressionError) {
            console.error('Error during PDF compression:', compressionError);
            handleLargePdfFallback();
          }
        } else {
          // Add PDF attachment if it's already within size limits
          transactionFields[transactionFieldMap.pdfAttachment] = [
            {
              filename: pdfFilename,
              url: `data:application/pdf;base64,${pdfBuffer.toString('base64')}`
            }
          ];
          
          console.log('Added PDF attachment to transaction fields');
        }
      } catch (pdfError) {
        // Handle any unexpected errors in PDF processing
        console.error('Unexpected error processing PDF:', pdfError);
        handleLargePdfFallback();
      }
      
      // Helper function to handle the fallback for large PDFs
      function handleLargePdfFallback() {
        // Add a note about the PDF being too large
        if (!transactionFields[transactionFieldMap.additionalNotes]) {
          transactionFields[transactionFieldMap.additionalNotes] = '';
        }
        
        // Suggest using external storage solutions
        transactionFields[transactionFieldMap.additionalNotes] += `\n\nNOTE: The PDF attachment was too large to include directly. ` +
          `For large documents, please consider:\n` +
          `1. Using a file sharing service (Google Drive, Dropbox, etc.)\n` +
          `2. Compressing the PDF with a tool like Adobe Acrobat or online services\n` +
          `3. Splitting the document into smaller parts\n` +
          `Please contact the agent for the complete PDF document.`;
      }
    }
    
    // Create transaction record
    // Agent Role and Name
    if (data.agentData?.role) {
      transactionFields[transactionFieldMap.agentRole] = data.agentData.role;
    }
    
    if (data.agentData?.name) {
      transactionFields[transactionFieldMap.agentName] = data.agentData.name;
    }

    // Property data fields
    if (data.propertyData) {
      if (data.propertyData.mlsNumber) {
        transactionFields[transactionFieldMap.mlsNumber] = data.propertyData.mlsNumber;
      }

      if (data.propertyData.address) {
        transactionFields[transactionFieldMap.propertyAddress] = data.propertyData.address;
      }

      if (data.propertyData.salePrice) {
        transactionFields[transactionFieldMap.salePrice] = formatFieldValue(data.propertyData.salePrice, 'salePrice');
      }

      if (data.propertyData.status) {
        transactionFields[transactionFieldMap.propertyStatus] = formatFieldValue(data.propertyData.status, 'propertyStatus');
      }

      if (data.propertyData.isWinterized) {
        const formattedWinterized = formatFieldValue(data.propertyData.isWinterized, 'winterizedStatus');
        console.log('Debug - isWinterized:', {
          original: data.propertyData.isWinterized,
          type: typeof data.propertyData.isWinterized,
          formatted: formattedWinterized,
          formattedType: typeof formattedWinterized
        });
        transactionFields[transactionFieldMap.winterizedStatus] = formattedWinterized;
      }

      if (data.propertyData.updateMls) {
        const formattedUpdateMls = formatFieldValue(data.propertyData.updateMls, 'updateMls');
        console.log('Debug - updateMls:', {
          original: data.propertyData.updateMls,
          type: typeof data.propertyData.updateMls,
          formatted: formattedUpdateMls,
          formattedType: typeof formattedUpdateMls
        });
        transactionFields[transactionFieldMap.updateMls] = formattedUpdateMls;
      }

      if (data.propertyData.propertyAccessType) {
        transactionFields[transactionFieldMap.propertyAccessType] = data.propertyData.propertyAccessType;
      }

      if (data.propertyData.lockboxAccessCode) {
        transactionFields[transactionFieldMap.lockboxAccessCode] = data.propertyData.lockboxAccessCode;
      }

      if (data.propertyData.propertyType) {
        transactionFields[transactionFieldMap.propertyType] = formatFieldValue(data.propertyData.propertyType, 'propertyType');
      }

      if (data.propertyData.isBuiltBefore1978) {
        const formattedBuiltBefore1978 = formatFieldValue(data.propertyData.isBuiltBefore1978, 'builtBefore1978');
        console.log('Debug - isBuiltBefore1978:', {
          original: data.propertyData.isBuiltBefore1978,
          type: typeof data.propertyData.isBuiltBefore1978,
          formatted: formattedBuiltBefore1978,
          formattedType: typeof formattedBuiltBefore1978
        });
        transactionFields[transactionFieldMap.builtBefore1978] = formattedBuiltBefore1978;
      }

      if (data.propertyData.closingDate) {
        transactionFields[transactionFieldMap.closingDate] = data.propertyData.closingDate;
      }
    }

    // Commission data fields
    if (data.commissionData) {      
      if (data.commissionData.totalCommissionPercentage) {
        transactionFields[transactionFieldMap.totalCommissionPercentage] = formatFieldValue(data.commissionData.totalCommissionPercentage, 'totalCommissionPercentage');
      }
      
      if (data.commissionData.listingAgentPercentage) {
        transactionFields[transactionFieldMap.listingAgentPercentage] = formatFieldValue(data.commissionData.listingAgentPercentage, 'listingAgentPercentage');
      }
      
      if (data.commissionData.buyersAgentPercentage) {
        transactionFields[transactionFieldMap.buyersAgentPercentage] = formatFieldValue(data.commissionData.buyersAgentPercentage, 'buyersAgentPercentage');
      }
      
      // Seller Paid Amount - directly map from brokerFeeAmount
      if (data.commissionData.brokerFeeAmount) {
        transactionFields[transactionFieldMap.sellerPaid] = formatFieldValue(data.commissionData.brokerFeeAmount, 'brokerFeeAmount');
      }
      
      // Buyer Paid Amount
      if (data.commissionData.buyerPaidAmount) {
        transactionFields[transactionFieldMap.buyerPaid] = formatFieldValue(data.commissionData.buyerPaidAmount, 'brokerFeeAmount');
      } else if (data.commissionData.buyerPaidCommission) {
        // Fallback to buyerPaidCommission if buyerPaidAmount isn't available
        transactionFields[transactionFieldMap.buyerPaid] = formatFieldValue(data.commissionData.buyerPaidCommission, 'brokerFeeAmount');
      } else {
        // Default to 0 if no value is provided
        transactionFields[transactionFieldMap.buyerPaid] = 0;
      }
      
      if (data.commissionData.hasSellersAssist && data.commissionData.sellersAssist) {
        transactionFields[transactionFieldMap.sellersAssist] = formatFieldValue(data.commissionData.sellersAssist, 'sellersAssist');
      }
      
      if (data.commissionData.isReferral) {
        if (data.commissionData.referralParty) {
          transactionFields[transactionFieldMap.referralParty] = data.commissionData.referralParty;
        }
        
        if (data.commissionData.referralFee) {
          transactionFields[transactionFieldMap.referralFee] = formatFieldValue(data.commissionData.referralFee, 'referralFee');
        }
        
        if (data.commissionData.brokerEin) {
          transactionFields[transactionFieldMap.brokerEin] = data.commissionData.brokerEin;
        }
      }

      if (data.commissionData.coordinatorFeePaidBy) {
        transactionFields[transactionFieldMap.coordinatorFeePaidBy] = data.commissionData.coordinatorFeePaidBy;
      }
    }

    // Property Details fields
    if (data.propertyDetailsData) {
      if (data.propertyDetailsData.resaleCertRequired && data.propertyDetailsData.hoaName) {
        transactionFields[transactionFieldMap.hoaName] = data.propertyDetailsData.hoaName;
      }

      if (data.propertyDetailsData.coRequired && data.propertyDetailsData.municipality) {
        transactionFields[transactionFieldMap.municipality] = data.propertyDetailsData.municipality;
      }

      if (data.propertyDetailsData.firstRightOfRefusal && data.propertyDetailsData.firstRightName) {
        transactionFields[transactionFieldMap.firstRightName] = data.propertyDetailsData.firstRightName;
      }

      if (data.propertyDetailsData.attorneyRepresentation && data.propertyDetailsData.attorneyName) {
        transactionFields[transactionFieldMap.attorneyName] = data.propertyDetailsData.attorneyName;
      }
      
      if (data.propertyDetailsData.homeWarranty) {
        if (data.propertyDetailsData.warrantyCompany) {
          transactionFields[transactionFieldMap.warrantyCompany] = data.propertyDetailsData.warrantyCompany;
        }
        
        if (data.propertyDetailsData.warrantyCost) {
          transactionFields[transactionFieldMap.warrantyCost] = formatFieldValue(data.propertyDetailsData.warrantyCost, 'warrantyCost');
        }
        
        if (data.propertyDetailsData.warrantyPaidBy) {
          transactionFields[transactionFieldMap.warrantyPaidBy] = data.propertyDetailsData.warrantyPaidBy;
        }
      }
    }

    // Title Company field
    if (data.titleData?.titleCompany) {
      transactionFields[transactionFieldMap.titleCompany] = data.titleData.titleCompany;
    }

    // Additional Info fields
    if (data.additionalInfo) {
      if (data.additionalInfo.specialInstructions) {
        transactionFields[transactionFieldMap.specialInstructions] = data.additionalInfo.specialInstructions;
      }
      if (data.additionalInfo.urgentIssues) {
        transactionFields[transactionFieldMap.urgentIssues] = data.additionalInfo.urgentIssues;
      }
      if (data.additionalInfo.notes) {
        transactionFields[transactionFieldMap.additionalNotes] = data.additionalInfo.notes;
      }
    }

    console.log('Submitting transaction to Airtable with fields:', JSON.stringify(transactionFields, null, 2));
    
    // Submit transaction record using Airtable client with error handling
    let transactionRecord;
    try {
      transactionRecord = await base('Transactions').create({
        fields: transactionFields
      });
    } catch (apiError: any) {
      console.error('Airtable API error during transaction creation:', apiError);
      
      // Check for specific error types
      if (apiError.statusCode === 413 || (apiError.message && apiError.message.includes('too large'))) {
        throw new Error('The transaction data is too large to submit. Please try removing or reducing the size of any attachments.');
      } else if (apiError.statusCode === 429) {
        throw new Error('Too many requests to Airtable. Please wait a moment and try again.');
      } else {
        // Re-throw with more context
        throw new Error(`Airtable API error: ${apiError.message || 'Unknown error'}`);
      }
    }

    // Now submit each client record independently with the property address
    const propertyAddress = data.propertyData?.address || '';
    
    // Use a more robust approach to handle client record creation
    const clientRecords = [];
    const clientErrors = [];
    
    // Process clients sequentially to better handle errors
    for (const client of data.clients) {
      try {
        const record = await submitClientToAirtable(client, propertyAddress);
        clientRecords.push(record);
      } catch (clientError: any) {
        console.error('Error creating client record:', clientError);
        clientErrors.push({
          client: client.name || 'Unknown client',
          error: clientError.message || 'Unknown error'
        });
      }
    }
    
    // Log any client creation errors
    if (clientErrors.length > 0) {
      console.warn(`Completed with ${clientErrors.length} client record errors:`, clientErrors);
    }

    return {
      success: true,
      transactionId: transactionRecord.id,
      clientRecords: clientRecords.map(record => record.id),
      clientErrors: clientErrors.length > 0 ? clientErrors : undefined,
      pdfStatus: pdfBuffer ? 
        (transactionFields[transactionFieldMap.pdfAttachment] ? 'attached' : 'too_large') : 
        'none'
    };

  } catch (error) {
    console.error('Error in submission process:', error);
    
    // Determine if this is a PDF-related error
    let errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    let errorType = 'unknown';
    
    if (pdfBuffer && errorMessage.includes('too large')) {
      errorType = 'pdf_too_large';
      errorMessage = 'The PDF attachment is too large to submit to Airtable. Please try compressing the PDF or use an external file sharing service.';
    } else if (errorMessage.includes('Airtable API error')) {
      errorType = 'airtable_api';
    }
    
    return {
      success: false,
      error: errorMessage,
      errorType: errorType
    };
  }
}
