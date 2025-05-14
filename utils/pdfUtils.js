import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { mapFormDataToPositions } from './pdfPositions.js';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates a PDF with data from the transaction form overlaid on the template
 * @param {Object} formData - The form data submitted via the TransactionForm
 * @returns {Promise<Buffer>} - The filled PDF as a buffer
 */
async function fillPdfForm(formData) {
  try {
    // Path to the PDF template
    const pdfPath = path.resolve(__dirname, '..', 'public', 'mergedTC.pdf');
    
    // Read the PDF template
    const pdfBytes = fs.readFileSync(pdfPath);
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Set the page size to standard Letter size (8.5" × 11" or 612 × 792 pt)
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      page.setSize(612, 792);
    }
    
    // Map the form data to positions on the PDF using our detailed mapping
    const textElements = mapFormDataToPositions(formData);
    
    // Find the highest page index needed
    const maxPageIndex = textElements.reduce((max, elem) => Math.max(max, elem.page), 0);
    
    // Check if we need to add more pages
    while (pages.length <= maxPageIndex) {
      console.log(`Adding page ${pages.length} to PDF`);
      pdfDoc.addPage([612, 792]); // Add a new page with Letter size
    }
    
    // Get updated pages array after potentially adding pages
    const updatedPages = pdfDoc.getPages();
    
    // Embed the fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Add text to the appropriate pages
    for (const element of textElements) {
      const { page, x, y, text, fontSize = 11, maxWidth, isBold = false } = element;
      
      // Make sure the page exists
      if (page < updatedPages.length) {
        const textOptions = {
          x,
          y,
          size: fontSize,
          font: isBold ? fontBold : font,
          color: rgb(0, 0, 0) // black text
        };
        
        // If maxWidth is provided, handle text wrapping
        if (maxWidth && text.length > 40) {
          const words = text.split(' ');
          let line = '';
          let yPosition = y;
          const selectedFont = isBold ? fontBold : font;
          
          for (const word of words) {
            const testLine = line + (line ? ' ' : '') + word;
            const testWidth = selectedFont.widthOfTextAtSize(testLine, fontSize);
            
            if (testWidth > maxWidth && line) {
              // Draw the current line
              updatedPages[page].drawText(line, {
                ...textOptions,
                y: yPosition
              });
              
              // Move to the next line
              line = word;
              yPosition -= fontSize * 1.2; // Line spacing
            } else {
              line = testLine;
            }
          }
          
          // Draw the last line
          if (line) {
            updatedPages[page].drawText(line, {
              ...textOptions,
              y: yPosition
            });
          }
        } else {
          // Draw the text normally
          updatedPages[page].drawText(text, textOptions);
        }
      } else {
        console.warn(`Tried to add text to page ${page} but PDF only has ${updatedPages.length} pages`);
      }
    }
    
    // Save the modified PDF
    const filledPdfBytes = await pdfDoc.save();
    
    return Buffer.from(filledPdfBytes);
  } catch (error) {
    console.error('Error creating PDF:', error);
    throw new Error(`Failed to create PDF: ${error.message}`);
  }
}

/**
 * Sends an email with the filled PDF as an attachment
 * @param {Buffer} pdfBuffer - The filled PDF as a buffer
 * @param {Object} formData - The form data for email context
 * @returns {Promise<boolean>} - Success status
 */
async function sendPdfEmail(pdfBuffer, formData) {
  try {
    // Create address slug for filename
    const addressSlug = formData.propertyData?.address 
      ? formData.propertyData.address
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_+/g, '_')
          .substring(0, 30) 
      : 'unknown_address';
    
    // Get formatted date
    const formattedDate = new Date().toISOString().split('T')[0];
    
    // Generate a descriptive filename
    const pdfFilename = `Transaction_${addressSlug}_${formattedDate}.pdf`;
    
    // Determine client type based on agent role
    let clientType = 'Client';
    let clientName = 'N/A';
    
    if (formData.agentData?.role === 'listingAgent') {
      clientType = 'Seller';
      // Try to find a seller client
      const seller = formData.clients?.find(c => 
        c.type?.toLowerCase() === 'seller' || c.type?.toLowerCase() === 'sellers');
      if (seller) {
        clientName = seller.name;
      }
    } else if (formData.agentData?.role === 'buyersAgent') {
      clientType = 'Buyer';
      // Try to find a buyer client
      const buyer = formData.clients?.find(c => 
        c.type?.toLowerCase() === 'buyer' || c.type?.toLowerCase() === 'buyers');
      if (buyer) {
        clientName = buyer.name;
      }
    } else if (formData.clients?.[0]) {
      // Default to first client if role doesn't indicate type
      clientName = formData.clients[0].name;
    }
    
    // Create transporter with SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Prepare email content with more details
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_RECIPIENT,
      subject: `New Transaction - ${formData.propertyData?.address || 'Property'} - ${formData.agentData?.name || 'Agent'}`,
      text: `
A new transaction form has been submitted with the following details:

PROPERTY INFORMATION
-------------------
Address: ${formData.propertyData?.address || 'Not provided'}
MLS Number: ${formData.propertyData?.mlsNumber || 'Not provided'}
Sale Price: $${formData.propertyData?.salePrice || 'Not provided'}
Closing Date: ${formData.propertyData?.closingDate || 'Not provided'}
Property Status: ${formData.propertyData?.status || 'Not provided'}

AGENT INFORMATION
----------------
Name: ${formData.agentData?.name || 'Not provided'}
Role: ${formData.agentData?.role || 'Not provided'}

CLIENT INFORMATION
----------------
${clientType}: ${clientName || 'Not provided'}

TRANSACTION DETAILS
-----------------
Total Commission: ${formData.commissionData?.totalCommission || 'Not provided'}%
${formData.additionalInfo?.urgentIssues ? `
URGENT ISSUES: ${formData.additionalInfo.urgentIssues}
` : ''}

The completed transaction form is attached to this email.
This email was automatically generated from a transaction form submission.
      `,
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer
        }
      ]
    };
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return true;
  } catch (error) {
    console.error('Error sending email with PDF:', error);
    // Return false but don't throw, as we want to fail gracefully
    return false;
  }
}

export {
  fillPdfForm,
  sendPdfEmail
};
