/**
 * Client-side utilities for PDF generation and emails
 * This file provides browser-compatible alternatives to server-side functions
 */

/**
 * Generate a cover sheet by calling the API instead of using server-side code directly
 * @param transactionId The transaction ID in Airtable
 * @param agentRole The agent's role (Buyer's Agent, Listing Agent, or Dual Agent)
 * @returns Promise<boolean> indicating success
 */
export const generateCoverSheetForTransaction = async (
  transactionId: string,
  agentRole: string = 'DUAL AGENT'
): Promise<boolean> => {
  try {
    const response = await fetch('/api/generateCoverSheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableId: 'tblHyCJCpQSgjn0md', // Transactions table ID
        recordId: transactionId,
        agentRole,
        sendEmail: true
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate cover sheet');
    }
    
    return true;
  } catch (error) {
    console.error('Error generating cover sheet:', error);
    return false;
  }
};

/**
 * Send an email with a PDF attachment
 * This is a client-side version that calls the API
 */
export const sendEmailWithPdf = async (
  to: string,
  subject: string,
  body: string,
  pdfPath: string
): Promise<boolean> => {
  try {
    // In a real implementation, you would call an API endpoint
    // This is a placeholder showing the pattern
    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        body,
        pdfPath
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}; 