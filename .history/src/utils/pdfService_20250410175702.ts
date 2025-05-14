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

    // Create HTML content for the PDF
    const pdfHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #4a6da7; text-align: center;">Transaction Submission</h1>
        <h2 style="color: #4a6da7; text-align: center;">${address} (MLS# ${mlsNumber})</h2>

        <div style="margin-top: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
          <h3 style="color: #4a6da7; margin-top: 0;">Transaction Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd; width: 30%;">Property Address:</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${address}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">MLS Number:</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${mlsNumber}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Sale Price:</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${templateData.salePrice || 'N/A'}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Closing Date:</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${templateData.closingDate || 'N/A'}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Agent:</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${agentName} (${agentRole})</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Clients:</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${clientNames}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Submission Date:</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
        </div>
      </div>
    `;

    // Generate the PDF
    console.log('Generating PDF from HTML...');
    const { base64: pdfBase64, blob: pdfBlob } = await generatePdfFromHtml(pdfHtml);
    console.log('PDF generated successfully');

    // Create a download link for the PDF (Trigger download)
    createDownloadLink(pdfBlob, fileName);
    console.log('PDF download link created and triggered.');

    // Return the PDF data and filename
    return { pdfBase64, fileName };
  } catch (error) {
    console.error('Error generating transaction PDF:', error);
    // Re-throw the error so the calling function knows something went wrong
    throw new Error('Failed to generate PDF.');
  }
};
