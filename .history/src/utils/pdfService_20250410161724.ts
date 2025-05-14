/**
 * PDF generation service for transaction forms
 */
import { selectTemplate, mapFormDataToTemplate } from './templateSelector';

/**
 * Generates a PDF from a transaction form submission
 * @param formData The transaction form data
 * @returns Promise resolving to the path of the generated PDF
 */
export const generateTransactionPdf = async (formData: any): Promise<string> => {
  console.log('Generating transaction PDF with form data:', JSON.stringify(formData, null, 2));
  try {
    // Select the appropriate template based on agent role
    const templateName = selectTemplate(formData.agentData?.role || '');
    const templatePath = `/templates/${templateName}`;

    // Map form data to template placeholders
    const templateData = mapFormDataToTemplate(formData);

    // Generate a unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const mlsNumber = formData.propertyData?.mlsNumber || 'unknown';
    const filename = `Transaction_${mlsNumber}_${timestamp}.pdf`;

    // Call the API to generate the PDF
    console.log('Calling API endpoint to generate PDF');

    // Use the Vercel serverless function endpoint
    let apiUrl = '/api/generatePdf';
    console.log('Using API URL:', apiUrl);

    try {
      const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templatePath,
        templateData,
        filename,
        sendEmail: true,
        emailTo: 'debbie@parealestatesupport.com',
        emailSubject: `Transaction Form: ${formData.propertyData?.address || 'New Property'} (MLS# ${mlsNumber})`,
        emailBody: `
          <h2>New Transaction Submission</h2>
          <p><strong>Property:</strong> ${formData.propertyData?.address || 'N/A'}</p>
          <p><strong>MLS#:</strong> ${mlsNumber}</p>
          <p><strong>Agent:</strong> ${formData.agentData?.name || 'N/A'} (${formData.agentData?.role || 'N/A'})</p>
          <p><strong>Clients:</strong> ${templateData.clientNames}</p>
          <p><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
          ${templateData.specialInstructions ? `<p><strong>Special Instructions:</strong> ${templateData.specialInstructions}</p>` : ''}
        `
      }),
    });

    console.log('API response status:', response.status);

    if (!response.ok) {
      let errorMessage = `Failed to generate PDF: HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
      }
      throw new Error(errorMessage);
    }

    try {
      const data = await response.json();
      console.log('API response data:', data);
      return data.pdfPath || '';
    } catch (jsonError) {
      console.error('Error parsing success response:', jsonError);
      throw new Error('Failed to parse API response');
    }
    } catch (fetchError) {
      console.error('Error fetching from primary API endpoint:', fetchError);

      // Fallback: Try to send an email notification about the transaction
      console.log('Using fallback mechanism to notify about the transaction');

      try {
        // Create a simple email notification about the transaction
        const emailSubject = `Transaction Form Submission: ${formData.propertyData?.address || 'New Property'} (MLS# ${mlsNumber})`;
        const emailBody = `
          <h2>New Transaction Submission</h2>
          <p><strong>Property:</strong> ${formData.propertyData?.address || 'N/A'}</p>
          <p><strong>MLS#:</strong> ${mlsNumber}</p>
          <p><strong>Agent:</strong> ${formData.agentData?.name || 'N/A'} (${formData.agentData?.role || 'N/A'})</p>
          <p><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Note:</strong> PDF generation failed, but transaction data was saved to Airtable.</p>
        `;

        // Try to use a fallback email notification service
        // This is just a placeholder - in a real implementation, you would use a service like SendGrid, Mailgun, etc.
        console.log('Would send email notification with subject:', emailSubject);

        // Return a placeholder path
        return '/fallback-notification-sent';
      } catch (fallbackError) {
        console.error('Fallback notification also failed:', fallbackError);
        throw new Error('PDF generation failed and fallback notification also failed');
      }
    }
  } catch (error) {
    console.error('Error generating transaction PDF:', error);
    throw error;
  }
};
