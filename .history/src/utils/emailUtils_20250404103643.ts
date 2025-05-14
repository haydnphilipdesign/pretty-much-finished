import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';

// Define the AirtableRecord interface
interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
}

interface EmailAttachment {
  filename: string;
  path: string;
  contentType?: string;
}

/**
 * Helper to get environment variables from either source
 */
const getEnvVar = (name: string, defaultValue: string = ''): string => {
  // Try process.env first (direct Node.js environment)
  if (process.env[name]) {
    return process.env[name] || defaultValue;
  }
  
  // Then try import.meta.env (Vite environment)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[name] || defaultValue;
  }
  
  // Try with NEXT_PUBLIC prefix
  if (process.env[`NEXT_PUBLIC_${name}`]) {
    return process.env[`NEXT_PUBLIC_${name}`] || defaultValue;
  }
  
  // Try with VITE prefix
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[`VITE_${name}`] || defaultValue;
  }
  
  // Return default if nothing found
  return defaultValue;
};

// Function to configure email options
const configureEmailOptions = () => {
  // Get options from environment variables
  const host = process.env.EMAIL_HOST || '';
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const secure = process.env.EMAIL_SECURE === 'true';
  const user = process.env.EMAIL_USER || '';
  const password = process.env.EMAIL_PASSWORD || '';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const from = process.env.EMAIL_FROM || user;
  
  return {
    host,
    port,
    secure,
    user,
    password,
    adminEmail,
    from
  };
};

/**
 * Sends an email with optional attachments
 * @param to Recipient email address
 * @param subject Email subject
 * @param body Email body content (HTML supported)
 * @param attachments Optional array of file paths to attach
 */
export const sendEmail = async (
  to: string,
  subject: string,
  body: string,
  attachments: EmailAttachment[] = []
): Promise<boolean> => {
  try {
    // Create a transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: getEnvVar('EMAIL_HOST'),
      port: parseInt(getEnvVar('EMAIL_PORT', '587')),
      secure: getEnvVar('EMAIL_SECURE') === 'true',
      auth: {
        user: getEnvVar('EMAIL_USER'),
        pass: getEnvVar('EMAIL_PASSWORD')
      }
    });

    // Send the email
    const info = await transporter.sendMail({
      from: getEnvVar('EMAIL_FROM', 'noreply@parealestatesupport.com'),
      to,
      subject,
      html: body,
      attachments
    });

    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

/**
 * Send cover sheet email with PDF attachment
 * @param recordOrPath Airtable record or path to PDF file
 * @param options Additional options when using path directly
 * @returns Promise resolving to boolean indicating success
 */
export const sendCoverSheetEmail = async (
  recordOrPath: AirtableRecord | string,
  options?: { address?: string; mlsNumber?: string; agentRole?: string; agentName?: string } | string
): Promise<boolean> => {
  try {
    // Determine if first parameter is a record or a path
    const isRecord = typeof recordOrPath !== 'string';
    
    // Get path and record data
    let pdfPath: string;
    let record: any = null;
    
    if (isRecord) {
      record = recordOrPath;
      pdfPath = typeof options === 'string' ? options : '';
    } else {
      pdfPath = recordOrPath;
    }
    
    // Configure email options based on the parameters
    const emailConfig = configureEmailOptions();
    
    // Set up transporter
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
      },
    });
    
    // Prepare email content
    let emailContent: nodemailer.SendMailOptions;
    
    if (isRecord) {
      // Using Airtable record for data
      const address = record.fields.propertyAddress || record.fields.fldypnfnHhplWYcCW || 'Unknown Address';
      const mlsNumber = record.fields.mlsNumber || record.fields.fld6O2FgIXQU5G27o || 'Unknown MLS';
      const agentName = record.fields.agentName || record.fields.fldFD4xHD0vxnSOHJ || 'Unknown Agent';
      const agentRole = record.fields.AgentRole || 'Agent';
      
      emailContent = {
        from: emailConfig.from,
        to: emailConfig.adminEmail,
        subject: `Cover Sheet for ${address} (MLS# ${mlsNumber})`,
        text: `
          Please find attached the cover sheet for property ${address} (MLS# ${mlsNumber}).
          
          Agent: ${agentName}
          Role: ${agentRole}
          
          This cover sheet was generated automatically by the PA Real Estate Support Services system.
          
          ---
          ${new Date().toLocaleString()}
        `,
        attachments: [
          {
            filename: `Cover-Sheet-${mlsNumber}.pdf`,
            path: pdfPath
          }
        ]
      };
    } else {
      // Using direct path and options
      const opts = typeof options === 'object' ? options : {};
      const address = opts.address || 'Unknown Address';
      const mlsNumber = opts.mlsNumber || 'Unknown MLS';
      const agentName = opts.agentName || 'Unknown Agent';
      const agentRole = opts.agentRole || 'Agent';
      
      emailContent = {
        from: emailConfig.from,
        to: emailConfig.adminEmail,
        subject: `Cover Sheet for ${address} (MLS# ${mlsNumber})`,
        text: `
          Please find attached the cover sheet for property ${address} (MLS# ${mlsNumber}).
          
          Agent: ${agentName}
          Role: ${agentRole}
          
          This cover sheet was generated automatically by the PA Real Estate Support Services system.
          
          ---
          ${new Date().toLocaleString()}
        `,
        attachments: [
          {
            filename: `Cover-Sheet-${mlsNumber}.pdf`,
            path: pdfPath
          }
        ]
      };
    }
    
    // Send the email
    const info = await transporter.sendMail(emailContent);
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending cover sheet email:', error);
    return false;
  }
}; 