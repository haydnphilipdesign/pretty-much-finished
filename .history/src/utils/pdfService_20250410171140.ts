/**
 * PDF generation service for transaction forms
 */
import { selectTemplate, mapFormDataToTemplate } from './templateSelector';
import emailjs from '@emailjs/browser';

// Initialize EmailJS
const initEmailJS = () => {
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_USER_ID;
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
 * Generates a PDF from a transaction form submission
 * @param formData The transaction form data
 * @returns Promise resolving to the path of the generated PDF
 */
export const generateTransactionPdf = async (formData: any): Promise<string> => {
  console.log('Preparing transaction notification...');
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

    // Create a detailed email notification
    const emailSubject = `Transaction Form: ${address} (MLS# ${mlsNumber})`;

    // Build a comprehensive email body with all relevant transaction details
    let emailBody = `
      <h2>New Transaction Submission</h2>
      <h3>Transaction Details</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Property</th>
          <td style="border: 1px solid #ddd; padding: 8px;">${address}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">MLS#</th>
          <td style="border: 1px solid #ddd; padding: 8px;">${mlsNumber}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Agent</th>
          <td style="border: 1px solid #ddd; padding: 8px;">${agentName} (${agentRole})</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Clients</th>
          <td style="border: 1px solid #ddd; padding: 8px;">${clientNames}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Sale Price</th>
          <td style="border: 1px solid #ddd; padding: 8px;">${templateData.salePrice || 'N/A'}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Closing Date</th>
          <td style="border: 1px solid #ddd; padding: 8px;">${templateData.closingDate || 'N/A'}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Template Used</th>
          <td style="border: 1px solid #ddd; padding: 8px;">${templateName}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Submission Date</th>
          <td style="border: 1px solid #ddd; padding: 8px;">${new Date().toLocaleString()}</td>
        </tr>
      </table>
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

    try {
      // Prepare the email parameters
      const emailParams = {
        to_email: 'debbie@parealestatesupport.com',
        to_name: 'Debbie',
        subject: emailSubject,
        message: emailBody,
        property_address: address,
        mls_number: mlsNumber,
        agent_name: agentName,
        agent_role: agentRole,
        client_names: clientNames,
        template_used: templateName,
        submission_date: new Date().toLocaleString(),
      };

      console.log('Sending email with EmailJS...');

      // Send the email using EmailJS
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailParams,
        EMAILJS_USER_ID
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
