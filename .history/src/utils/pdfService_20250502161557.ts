/**
 * PDF generation service for transaction forms
 */
import { selectTemplate, mapFormDataToTemplate } from './templateSelector';
// import emailjs from '@emailjs/browser'; // Removed EmailJS
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TransactionFormData } from "@/types/transaction"; // Ensure type import

// Removed EmailJS Initialization

/**
 * Creates a download link for a blob
 * @param blob The blob to create a download link for
 * @param fileName The name of the file
 */
const createDownloadLink = (blob: Blob, fileName: string): void => { // Return type changed to void
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
  // Removed return url;
};

/**
 * Generates a PDF from HTML content
 * @param htmlContent The HTML content to convert to PDF
 * @returns Promise resolving to the PDF as a base64 string (without data URI prefix) and blob
 */
const generatePdfFromHtml = async (htmlContent: string): Promise<{ base64: string, blob: Blob }> => {
  try {
    // Create a temporary div to render the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.width = '8.5in';
    tempDiv.style.padding = '0.5in';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    try {
      // Convert the HTML to a canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Create a PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
      });

      // Add the canvas to the PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);

      // Get base64 string WITHOUT the data URI prefix for Nodemailer
      const pdfBase64DataUri = pdf.output('datauristring');
      const pdfBase64 = pdfBase64DataUri.split(',')[1]; // Extract only the base64 part

      const pdfBlob = pdf.output('blob');
      return { base64: pdfBase64, blob: pdfBlob };
    } finally {
      // Clean up the temporary div
      document.body.removeChild(tempDiv);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Generates a PDF from transaction form data, triggers download, and returns PDF info
 * @param formData The transaction form data
 * @returns Promise resolving to an object containing the base64 PDF data and filename
 */
export const generateTransactionPdf = async (
  formData: TransactionFormData
): Promise<{ pdfBase64: string; fileName: string }> => {
  console.log('Generating transaction PDF...');
  try {
    // Select the appropriate template based on agent role
    const templateName = selectTemplate(formData.agentData?.role || '');

    // Map form data to template placeholders
    const templateData = mapFormDataToTemplate(formData);

    // Get transaction details
    const mlsNumber = formData.propertyData?.mlsNumber || 'unknown';
    const address = formData.propertyData?.address || 'New Property';
    const agentName = formData.agentData?.name || 'N/A';
    const agentRole = formData.agentData?.role || 'N/A';
    const clientNames = templateData.clientNames || '';
    const specialInstructions = templateData.specialInstructions || '';
    const urgentIssues = templateData.urgentIssues || '';
    const notes = templateData.notes || '';

    // Create a filename for the PDF
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `Transaction_${mlsNumber}_${timestamp}.pdf`;

    // Instead of generating a custom HTML template, we'll just create a simple placeholder
    // that will be replaced by the server with the proper template
    const pdfHtml = `<div id="pdf-placeholder" data-template="${templateName}"></div>`;

    // Generate the PDF
    console.log('Generating PDF from HTML...');
    const { base64: pdfBase64, blob: pdfBlob } = await generatePdfFromHtml(pdfHtml);
    console.log('PDF generated successfully');

    // Return the PDF data and filename without creating a download link
    return { pdfBase64, fileName };
  } catch (error) {
    console.error('Error generating transaction PDF:', error);
    // Re-throw the error so the calling function knows something went wrong
    throw new Error('Failed to generate PDF.');
  }
};

/**
 * Sends a transaction PDF via the server API
 * @param formData The transaction form data
 * @returns Promise resolving to a status message
 */
export const sendTransactionPdfViaApi = async (formData: TransactionFormData): Promise<string> => {
  console.log('Sending transaction PDF via API...');
  try {
    // Call the simple email API endpoint instead - it doesn't need templates or PDF generation
    const apiUrl = `${window.location.origin}/api/send-transaction-email-fixed`;
    console.log(`Calling simplified API at: ${apiUrl}`);
    console.log('Form data being sent:', JSON.stringify(formData, null, 2));
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear the timeout if request completes

      console.log('Response status:', response.status);
      console.log('Response headers:', JSON.stringify(Object.fromEntries([...response.headers]), null, 2));

      if (!response.ok) {
        let errorMessage = `Failed to send PDF: HTTP ${response.status}`;
        try {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            console.error('Error parsing error response as JSON:', jsonError);
            // Use the text response as the error message if it's not JSON
            if (errorText) errorMessage += ` - ${errorText}`;
          }
        } catch (textError) {
          console.error('Error reading response text:', textError);
        }
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Error parsing response as JSON:', jsonError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      console.log('API response data:', data);

      if (data.success) {
        return data.message || 'Email sent successfully';
      } else {
        throw new Error(data.message || 'Unknown error');
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