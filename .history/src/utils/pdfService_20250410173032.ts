/**
 * PDF generation service for transaction forms
 */
import { selectTemplate, mapFormDataToTemplate } from './templateSelector';
import emailjs from '@emailjs/browser';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Initialize EmailJS
const initEmailJS = () => {
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('EmailJS initialized');
  } else {
    console.warn('EmailJS public key not found. Email functionality will not work.');
  }
};

// Initialize EmailJS when the module loads
initEmailJS();

/**
 * Creates a download link for a blob
 * @param blob The blob to create a download link for
 * @param fileName The name of the file
 * @returns The URL for the download link
 */
const createDownloadLink = (blob: Blob, fileName: string): string => {
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
  return url;
};

/**
 * Generates a PDF from HTML content
 * @param htmlContent The HTML content to convert to PDF
 * @returns Promise resolving to the PDF as a base64 string and blob
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

      // Convert the PDF to a base64 string and blob
      const pdfBase64 = pdf.output('datauristring');
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
 * Generates a PDF from a transaction form submission
 * @param formData The transaction form data
 * @returns Promise resolving to the path of the generated PDF
 */
export const generateTransactionPdf = async (formData: any): Promise<string> => {
  console.log('Preparing transaction PDF and notification...');
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

    // Create a detailed email notification
    const emailSubject = `Transaction Form: ${address} (MLS# ${mlsNumber})`;

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
    const pdfResult = await generatePdfFromHtml(pdfHtml);
    const pdfBase64 = pdfResult.base64;
    const pdfBlob = pdfResult.blob;
    console.log('PDF generated successfully');

    // Format the message to fit the existing contact form template
    let emailBody = `
      <h2>New Transaction Submission</h2>
      <p><strong>Transaction Details:</strong></p>
      <ul>
        <li><strong>Property:</strong> ${address}</li>
        <li><strong>MLS#:</strong> ${mlsNumber}</li>
        <li><strong>Agent:</strong> ${agentName} (${agentRole})</li>
        <li><strong>Clients:</strong> ${clientNames}</li>
        <li><strong>Sale Price:</strong> ${templateData.salePrice || 'N/A'}</li>
        <li><strong>Closing Date:</strong> ${templateData.closingDate || 'N/A'}</li>
        <li><strong>Template Used:</strong> ${templateName}</li>
        <li><strong>Submission Date:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p>Please see the attached PDF for the complete transaction details.</p>
    `;

    // Add special instructions if available
    if (specialInstructions) {
      emailBody += `
        <h3>Special Instructions</h3>
        <p>${specialInstructions}</p>
      `;
    }

    // Add urgent issues if available
    if (urgentIssues) {
      emailBody += `
        <h3 style="color: red;">⚠️ URGENT ISSUES</h3>
        <p>${urgentIssues}</p>
      `;
    }

    // Add notes if available
    if (notes) {
      emailBody += `
        <h3>Additional Notes</h3>
        <p>${notes}</p>
      `;
    }

    // Add a note about the transaction data being saved to Airtable
    emailBody += `
      <p><em>Note: This transaction has been saved to Airtable. The PDF template that would have been used is ${templateName}.</em></p>
    `;

    // Log the email details for debugging
    console.log('Email notification prepared with subject:', emailSubject);

    // Get EmailJS configuration
    const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    // Check if EmailJS is configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.warn('EmailJS not fully configured. Email will not be sent.');
      return '/email-configuration-missing';
    }

    console.log('Using EmailJS service:', EMAILJS_SERVICE_ID, 'and template:', EMAILJS_TEMPLATE_ID);

    try {
      // Create a custom EmailJS template for sending PDFs
      // This requires a premium EmailJS account that supports attachments
      // For now, we'll just send the email without the PDF attachment

      // Prepare the email parameters to match your contact form structure
      const emailParams = {
        // These are the fields from your contact form
        name: `Transaction: ${mlsNumber}`,
        email: 'transactions@parealestatesupport.com',
        phone: formData.agentData?.phone || 'N/A',
        message: emailBody,
        // Include the PDF base64 string for reference
        pdf_data: pdfBase64,
        // You may need to add or remove fields based on your actual template
      };

      console.log('Sending email with EmailJS...');

      // Send the email using EmailJS
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailParams
      );

      console.log('Email sent successfully!', result.status, result.text);
      return '/email-sent-successfully';
    } catch (emailError) {
      console.error('Failed to send email:', emailError);

      // Even if the email fails, we'll return a success message since the transaction was saved
      return '/transaction-saved-email-failed';
    }
  } catch (error) {
    console.error('Error preparing transaction notification:', error);
    throw error;
  }
};
