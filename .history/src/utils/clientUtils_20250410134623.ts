/**
 * Client-side utilities for PDF generation and emails
 * This file provides browser-compatible alternatives to server-side functions
 */
import { CoverSheetOptions, CoverSheetResponse, EmailOptions } from '@/types/clientTypes';
import { toast } from 'react-toastify';

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
    console.log(`Generating cover sheet for transaction ${transactionId} with role ${agentRole}`);
    
    const options: CoverSheetOptions = {
      tableId: 'tblHyCJCpQSgjn0md', // Transactions table ID
      recordId: transactionId,
      agentRole: agentRole as any,
      sendEmail: true
    };

    console.log('Cover sheet options:', JSON.stringify(options, null, 2));

    // Use absolute URL to avoid client-side routing issues
    const response = await fetch(`${window.location.origin}/api/generateCoverSheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data: CoverSheetResponse = await response.json();
    console.log('Cover sheet API response:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error('Cover sheet generation failed with status:', response.status);
      throw new Error(data.message || 'Failed to generate cover sheet');
    }

    // Explicitly check if email was sent
    if (data.emailSent === false) {
      console.warn('Cover sheet was generated but email was not sent');
      if (data.emailError) {
        console.error('Email error:', data.emailError);
      }
    }
    
    return data.emailSent === true;
  } catch (error) {
    console.error('Error generating cover sheet:', error);
    // Send an error notification email so we know there's an issue
    try {
      await sendErrorEmail(
        'Cover sheet generation failed', 
        `Failed to generate cover sheet for transaction ${transactionId}. Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } catch (emailError) {
      console.error('Failed to send error notification email:', emailError);
    }
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
    const options: EmailOptions = {
      to,
      subject,
      body,
      attachments: [
        {
          filename: pdfPath.split('/').pop() || 'document.pdf',
          path: pdfPath
        }
      ]
    };

    // Use absolute URL to avoid client-side routing issues
    const response = await fetch(`${window.location.origin}/api/sendEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
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

/**
 * Send an error notification email
 * Used to alert about system issues
 */
export const sendErrorEmail = async (
  subject: string,
  errorMessage: string
): Promise<boolean> => {
  try {
    const options: EmailOptions = {
      to: 'debbie@parealestatesupport.com',
      subject: `System Alert: ${subject}`,
      body: `
        <h2>System Error Alert</h2>
        <p><strong>Error:</strong> ${subject}</p>
        <p><strong>Details:</strong> ${errorMessage}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p>Please check the server logs for more details.</p>
      `,
      attachments: []
    };

    // Use absolute URL to avoid client-side routing issues
    const response = await fetch(`${window.location.origin}/api/sendEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Failed to send error notification email:', data.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error sending error notification email:', error);
    return false;
  }
};

/**
 * Generate and send a cover sheet
 */
export const generateAndSendCoverSheet = async (data: any, role: string): Promise<boolean> => {
  try {
    console.log('Generating cover sheet with data:', { data, role });

    const options = {
      tableId: 'tblHyCJCpQSgjn0md', // Transactions table ID
      recordId: data.recordId,
      agentRole: role,
      sendEmail: true,
      data: {
        // Property Information
        propertyAddress: data.propertyData?.address || '',
        mlsNumber: data.propertyData?.mlsNumber || '',
        salePrice: data.propertyData?.salePrice || '',
        propertyStatus: data.propertyData?.status || 'Pending',
        isWinterized: data.propertyData?.isWinterized || false,

        // Agent Information
        agentName: data.agentData?.name || '',
        agentEmail: data.agentData?.email || '',
        agentPhone: data.agentData?.phone || '',
        agentRole: role,

        // Commission Details
        totalCommissionPercent: data.commissionData?.totalCommissionPercentage || '',
        listingAgentPercent: data.commissionData?.listingAgentPercentage || '',
        buyersAgentPercent: data.commissionData?.buyersAgentPercentage || '',
        brokerFee: data.commissionData?.brokerFee || '',

        // Additional Information
        specialInstructions: data.additionalInfo?.specialInstructions || '',
        urgentIssues: data.additionalInfo?.urgentIssues || false,
        notes: data.additionalInfo?.notes || ''
      }
    };

    console.log('Cover sheet options:', JSON.stringify(options, null, 2));

    const response = await fetch('/api/generateCoverSheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const result = await response.json();

    if (!response.ok) {
      // Check if the error is due to validation
      if (response.status === 400 && result.validationErrors) {
        // Display validation errors
        result.validationErrors.forEach((error: any) => {
          const severity = error.severity || 'error';
          toast[severity === 'warning' ? 'warn' : 'error'](
            `${error.field}: ${error.message}`,
            {
              position: "top-right",
              autoClose: severity === 'warning' ? 5000 : false,
              closeOnClick: true,
              pauseOnHover: true,
            }
          );
        });
        throw new Error('Validation failed. Please check the form for errors.');
      }
      throw new Error(result.message || 'Failed to generate cover sheet');
    }

    // Show success message
    toast.success('Cover sheet generated and sent successfully!', {
      position: "top-right",
      autoClose: 3000,
    });

    return true;
  } catch (error) {
    console.error('Error generating cover sheet:', error);
    // Show error message if not already shown by validation
    if (!error.message.includes('Validation failed')) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: false,
      });
    }
    return false;
  }
}; 