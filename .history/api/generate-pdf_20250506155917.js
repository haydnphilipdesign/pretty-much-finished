// CommonJS version for Vercel serverless functions
// Add try-catch for module loading
try {
    const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
    const fs = require('fs');
    const path = require('path');
    const nodemailer = require('nodemailer');
    const Airtable = require('airtable');

    // Helper function to extract data from form data for PDF
    function prepareDataForPDF(formData) {
        console.log("Preparing form data for PDF generation");

        // Remove any cyclic references
        return JSON.parse(JSON.stringify(formData));
    }

    /**
     * Creates a PDF with data from the transaction form using the mergedTC.pdf template
     * @param {Object} formData - The form data submitted
     * @returns {Promise<Buffer>} - The filled PDF as a buffer
     */
    async function fillPdfForm(formData) {
        try {
            console.log("Starting PDF generation process with template");

            // In Vercel serverless functions, we need to use their specific path resolution
            const pdfPath = path.join(process.cwd(), 'public', 'mergedTC.pdf');
            console.log("Looking for PDF template at:", pdfPath);

            let pdfBytes;

            try {
                // Try to read the file from the filesystem
                pdfBytes = fs.readFileSync(pdfPath);
                console.log("Successfully loaded PDF template from filesystem, size:", pdfBytes.length, "bytes");
            } catch (fileError) {
                console.error("Could not read PDF template from primary location:", fileError.message);

                // If that fails, try an alternate location (for Vercel)
                try {
                    const alternatePath = path.join(__dirname, '..', 'public', 'mergedTC.pdf');
                    console.log("Trying alternate path:", alternatePath);
                    pdfBytes = fs.readFileSync(alternatePath);
                    console.log("Successfully loaded PDF template from alternate path, size:", pdfBytes.length, "bytes");
                } catch (altError) {
                    console.error("Could not read PDF template from alternate location:", altError.message);

                    // Add a third attempt with a different path structure for Vercel
                    try {
                        const vercelPath = path.join('/var/task', 'public', 'mergedTC.pdf');
                        console.log("Trying Vercel-specific path:", vercelPath);
                        pdfBytes = fs.readFileSync(vercelPath);
                        console.log("Successfully loaded PDF template from Vercel path, size:", pdfBytes.length, "bytes");
                    } catch (vercelError) {
                        console.error("Could not read PDF template from Vercel location:", vercelError.message);

                        throw new Error("PDF template not found. Please ensure mergedTC.pdf exists in the public directory.");
                    }
                }
            }

            // Load the PDF document
            console.log("Loading PDF document from template...");
            const pdfDoc = await PDFDocument.load(pdfBytes);

            // Set the page size to standard Letter size (8.5" × 11" or 612 × 792 pt)
            const pages = pdfDoc.getPages();
            console.log("Template PDF has", pages.length, "pages");

            // Ensure we have at least one page
            if (pages.length === 0) {
                console.warn("Template has no pages, adding a new page");
                pdfDoc.addPage([612, 792]);
            }

            // Embed the fonts
            console.log("Embedding fonts...");
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            // Get the first page
            const page = pages[0];

            // Y-offset to adjust vertical positioning
            const Y_OFFSET = -12;

            // Add property address
            if (formData.propertyData && formData.propertyData.address) {
                page.drawText(formData.propertyData.address, {
                    x: 75.68,
                    y: 750.59 + Y_OFFSET,
                    size: 12,
                    font: fontBold
                });
                console.log("Added property address:", formData.propertyData.address);
            }

            // Add MLS number
            if (formData.propertyData && formData.propertyData.mlsNumber) {
                page.drawText(formData.propertyData.mlsNumber, {
                    x: 452.82,
                    y: 750.59 + Y_OFFSET,
                    size: 12,
                    font: fontBold
                });
                console.log("Added MLS number:", formData.propertyData.mlsNumber);
            }

            // Add sale price
            if (formData.propertyData && formData.propertyData.salePrice) {
                page.drawText(`$${formData.propertyData.salePrice}`, {
                    x: 278.45,
                    y: 690.52 + Y_OFFSET + 2,
                    size: 11,
                    font: fontBold
                });
                console.log("Added sale price:", formData.propertyData.salePrice);
            }

            // Add closing date
            if (formData.propertyData && formData.propertyData.closingDate) {
                page.drawText(formData.propertyData.closingDate, {
                    x: 440,
                    y: 644.28 + Y_OFFSET + 2,
                    size: 10,
                    font: fontBold
                });
                console.log("Added closing date:", formData.propertyData.closingDate);
            }

            // Add agent information
            if (formData.agentData) {
                // Try multiple possible fields for agent name
                const agentName = formData.agentData.name ||
                    formData.agentData.agentName ||
                    formData.signatureData ? .agentName ||
                    formData.signatureData ? .signature ||
                    'Unknown Agent';

                page.drawText(agentName, {
                            x: 70,
                            y: 546.91 + Y_OFFSET - 2,
                            size: 11,
                            const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
                            const fs = require('fs');
                            const path = require('path');
                            const nodemailer = require('nodemailer');
                            const Airtable = require('airtable');

                            // Helper function to extract data from form data for PDF
                            function prepareDataForPDF(formData) {
                                console.log("Preparing form data for PDF generation");

                                // Remove any cyclic references
                                return JSON.parse(JSON.stringify(formData));
                            }

                            /**
                             * Creates a PDF with data from the transaction form using the mergedTC.pdf template
                             * @param {Object} formData - The form data submitted
                             * @returns {Promise<Buffer>} - The filled PDF as a buffer
                             */
                            async function fillPdfForm(formData) {
                                try {
                                    console.log("Starting PDF generation process with template");

                                    // In Vercel serverless functions, we need to use their specific path resolution
                                    const pdfPath = path.join(process.cwd(), 'public', 'mergedTC.pdf');
                                    console.log("Looking for PDF template at:", pdfPath);

                                    let pdfBytes;

                                    try {
                                        // Try to read the file from the filesystem
                                        pdfBytes = fs.readFileSync(pdfPath);
                                        console.log("Successfully loaded PDF template from filesystem, size:", pdfBytes.length, "bytes");
                                    } catch (fileError) {
                                        console.error("Could not read PDF template from primary location:", fileError.message);

                                        // If that fails, try an alternate location (for Vercel)
                                        try {
                                            const alternatePath = path.join(__dirname, '..', 'public', 'mergedTC.pdf');
                                            console.log("Trying alternate path:", alternatePath);
                                            pdfBytes = fs.readFileSync(alternatePath);
                                            console.log("Successfully loaded PDF template from alternate path, size:", pdfBytes.length, "bytes");
                                        } catch (altError) {
                                            console.error("Could not read PDF template from alternate location:", altError.message);

                                            throw new Error("PDF template not found. Please ensure mergedTC.pdf exists in the public directory.");
                                        }
                                    }

                                    // Load the PDF document
                                    console.log("Loading PDF document from template...");
                                    const pdfDoc = await PDFDocument.load(pdfBytes);

                                    // Set the page size to standard Letter size (8.5" × 11" or 612 × 792 pt)
                                    const pages = pdfDoc.getPages();
                                    console.log("Template PDF has", pages.length, "pages");

                                    // Ensure we have at least one page
                                    if (pages.length === 0) {
                                        console.warn("Template has no pages, adding a new page");
                                        pdfDoc.addPage([612, 792]);
                                    }

                                    // Embed the fonts
                                    console.log("Embedding fonts...");
                                    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
                                    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

                                    // Get the first page
                                    const page = pages[0];

                                    // Y-offset to adjust vertical positioning
                                    const Y_OFFSET = -12;

                                    // Add property address
                                    if (formData.propertyData && formData.propertyData.address) {
                                        page.drawText(formData.propertyData.address, {
                                            x: 75.68,
                                            y: 750.59 + Y_OFFSET,
                                            size: 12,
                                            font: fontBold
                                        });
                                        console.log("Added property address:", formData.propertyData.address);
                                    }

                                    // Add MLS number
                                    if (formData.propertyData && formData.propertyData.mlsNumber) {
                                        page.drawText(formData.propertyData.mlsNumber, {
                                            x: 452.82,
                                            y: 750.59 + Y_OFFSET,
                                            size: 12,
                                            font: fontBold
                                        });
                                        console.log("Added MLS number:", formData.propertyData.mlsNumber);
                                    }

                                    // Add sale price
                                    if (formData.propertyData && formData.propertyData.salePrice) {
                                        page.drawText(`$${formData.propertyData.salePrice}`, {
                                            x: 278.45,
                                            y: 690.52 + Y_OFFSET + 2,
                                            size: 11,
                                            font: fontBold
                                        });
                                        console.log("Added sale price:", formData.propertyData.salePrice);
                                    }

                                    // Add closing date
                                    if (formData.propertyData && formData.propertyData.closingDate) {
                                        page.drawText(formData.propertyData.closingDate, {
                                            x: 440,
                                            y: 644.28 + Y_OFFSET + 2,
                                            size: 10,
                                            font: fontBold
                                        });
                                        console.log("Added closing date:", formData.propertyData.closingDate);
                                    }

                                    // Add agent information
                                    if (formData.agentData) {
                                        // Try multiple possible fields for agent name
                                        const agentName = formData.agentData.name ||
                                            formData.agentData.agentName ||
                                            formData.signatureData ? .agentName ||
                                            formData.signatureData ? .signature ||
                                            'Unknown Agent';

                                        page.drawText(agentName, {
                                            x: 70,
                                            y: 546.91 + Y_OFFSET - 2,
                                            size: 11,
                                            font: fontBold
                                        });
                                        console.log("Added agent name:", agentName);

                                        // Format the role consistently
                                        let role = formData.agentData.role || 'AGENT';
                                        // Convert to uppercase and standardize
                                        role = role.toUpperCase();
                                        if (role === 'LISTINGAGENT' || role === 'LISTING_AGENT') role = 'LISTING AGENT';
                                        if (role === 'BUYERSAGENT' || role === 'BUYERS_AGENT') role = 'BUYERS AGENT';
                                        if (role === 'DUALAGENT' || role === 'DUAL_AGENT') role = 'DUAL AGENT';

                                        page.drawText(role, {
                                            x: 259.44,
                                            y: 546.91 + Y_OFFSET - 2,
                                            size: 11,
                                            font: fontBold
                                        });
                                        console.log("Added agent role:", role);
                                    }

                                    // Add clients information
                                    if (formData.clients && formData.clients.length > 0) {
                                        console.log("Processing clients:", formData.clients.length);

                                        // Make sure client types are normalized to uppercase
                                        const normalizedClients = formData.clients.map(client => ({
                                            ...client,
                                            type: client.type ? client.type.toUpperCase() : ''
                                        }));

                                        // Sort clients by type (buyer/seller)
                                        const buyers = normalizedClients.filter(c =>
                                            c.type ? .includes('BUYER'));

                                        const sellers = normalizedClients.filter(c =>
                                            c.type ? .includes('SELLER'));

                                        console.log(`Found ${buyers.length} buyers and ${sellers.length} sellers`);

                                        // Add buyer information
                                        if (buyers.length > 0) {
                                            if (buyers[0].name) {
                                                page.drawText(buyers[0].name, {
                                                    x: 70.00,
                                                    y: 494.06 + Y_OFFSET - 2,
                                                    size: 11,
                                                    font: fontBold
                                                });
                                                console.log("Added buyer name:", buyers[0].name);
                                            }

                                            if (buyers[0].phone) {
                                                page.drawText(buyers[0].phone, {
                                                    x: 70.00,
                                                    y: 467.63 + Y_OFFSET - 2,
                                                    size: 11,
                                                    font
                                                });
                                            }

                                            // Try both address fields
                                            const buyerAddress = buyers[0].address || buyers[0].streetAddress;
                                            if (buyerAddress) {
                                                page.drawText(buyerAddress, {
                                                    x: 70.00,
                                                    y: 441.20 + Y_OFFSET - 2,
                                                    size: 11,
                                                    font
                                                });
                                            }

                                            if (buyers[0].email) {
                                                page.drawText(buyers[0].email, {
                                                    x: 70.00,
                                                    y: 414.77 + Y_OFFSET - 0,
                                                    size: 11,
                                                    font
                                                });
                                            }
                                        }

                                        // Add seller information
                                        if (sellers.length > 0) {
                                            if (sellers[0].name) {
                                                page.drawText(sellers[0].name, {
                                                    x: 340.00,
                                                    y: 494.06 + Y_OFFSET - 2,
                                                    size: 11,
                                                    font: fontBold
                                                });
                                                console.log("Added seller name:", sellers[0].name);
                                            }

                                            if (sellers[0].phone) {
                                                page.drawText(sellers[0].phone, {
                                                    x: 340.00,
                                                    y: 467.63 + Y_OFFSET - 2,
                                                    size: 11,
                                                    font
                                                });
                                            }

                                            // Try both address fields
                                            const sellerAddress = sellers[0].address || sellers[0].streetAddress;
                                            if (sellerAddress) {
                                                page.drawText(sellerAddress, {
                                                    x: 340.00,
                                                    y: 441.20 + Y_OFFSET - 2,
                                                    size: 11,
                                                    font
                                                });
                                            }

                                            if (sellers[0].email) {
                                                page.drawText(sellers[0].email, {
                                                    x: 340.00,
                                                    y: 414.77 + Y_OFFSET - 0,
                                                    size: 11,
                                                    font
                                                });
                                            }
                                        }
                                    }

                                    // Add commission data
                                    if (formData.commissionData) {
                                        console.log("Processing commission data");

                                        // Try multiple possible field names for commissions
                                        const totalCommission = formData.commissionData.totalCommission ||
                                            formData.commissionData.totalCommissionPercentage || '';

                                        const listingCommission = formData.commissionData.listingAgentCommission ||
                                            formData.commissionData.listingAgentPercentage || '';

                                        const buyersCommission = formData.commissionData.buyersAgentCommission ||
                                            formData.commissionData.buyersAgentPercentage || '';

                                        // Listing agent commission
                                        if (listingCommission) {
                                            page.drawText(`${listingCommission}%`, {
                                                x: 75,
                                                y: 289.24 + Y_OFFSET + 2,
                                                size: 11,
                                                font: fontBold
                                            });
                                            console.log("Added listing commission:", listingCommission);
                                        }

                                        // Buyer's agent commission
                                        if (buyersCommission) {
                                            page.drawText(`${buyersCommission}%`, {
                                                x: 75,
                                                y: 262.81 + Y_OFFSET + 2,
                                                size: 11,
                                                font: fontBold
                                            });
                                            console.log("Added buyer's commission:", buyersCommission);
                                        }

                                        // Total commission
                                        if (totalCommission) {
                                            page.drawText(`${totalCommission}%`, {
                                                x: 75,
                                                y: 236.38 + Y_OFFSET + 2,
                                                size: 11,
                                                font: fontBold
                                            });
                                            console.log("Added total commission:", totalCommission);
                                        }

                                        // Seller Paid Amount (from brokerFeeAmount)
                                        if (formData.commissionData.brokerFeeAmount) {
                                            page.drawText(`${formData.commissionData.brokerFeeAmount}%`, {
                                                x: 200,
                                                y: 289.24 + Y_OFFSET + 2,
                                                size: 11,
                                                font: fontBold
                                            });
                                            console.log("Added Seller Paid Amount:", formData.commissionData.brokerFeeAmount);
                                        }

                                        // Buyer Paid Amount
                                        if (formData.commissionData.buyerPaidAmount) {
                                            page.drawText(`${formData.commissionData.buyerPaidAmount}%`, {
                                                x: 200,
                                                y: 262.81 + Y_OFFSET + 2,
                                                size: 11,
                                                font: fontBold
                                            });
                                            console.log("Added Buyer Paid Amount:", formData.commissionData.buyerPaidAmount);
                                        } else if (formData.commissionData.buyerPaidCommission) {
                                            // Fallback to buyerPaidCommission if buyerPaidAmount isn't available
                                            page.drawText(`${formData.commissionData.buyerPaidCommission}%`, {
                                                x: 200,
                                                y: 262.81 + Y_OFFSET + 2,
                                                size: 11,
                                                font: fontBold
                                            });
                                            console.log("Added Buyer Paid Commission as fallback:", formData.commissionData.buyerPaidCommission);
                                        }

                                        // Seller's assist - try multiple field names
                                        const sellersAssist = formData.commissionData.sellersAssist ||
                                            (formData.commissionData.hasSellersAssist ? formData.commissionData.sellersAssistAmount : '');

                                        if (sellersAssist) {
                                            page.drawText(`$${sellersAssist}`, {
                                                x: 396.44,
                                                y: 690.52 + Y_OFFSET + 2,
                                                size: 11,
                                                font: fontBold
                                            });
                                            console.log("Added Seller's Assist:", sellersAssist);
                                        }
                                    }

                                    // Add title company if available
                                    if (formData.titleData && formData.titleData.titleCompany) {
                                        page.drawText(formData.titleData.titleCompany, {
                                            x: 340,
                                            y: 163.71 + Y_OFFSET + 2,
                                            size: 11,
                                            font: fontBold
                                        });
                                        console.log("Added title company:", formData.titleData.titleCompany);
                                    }

                                    // Add attorney information if available
                                    if (formData.propertyDetails && formData.propertyDetails.attorneyName) {
                                        page.drawText(formData.propertyDetails.attorneyName, {
                                            x: 70,
                                            y: 361.92 + Y_OFFSET - 2,
                                            size: 11,
                                            font
                                        });
                                        console.log("Added attorney name:", formData.propertyDetails.attorneyName);
                                    }

                                    // If there's a second page in the template, add any municipality and HOA info
                                    if (pages.length > 1) {
                                        // Add municipality information to page 2 if available
                                        if (formData.propertyDetails && formData.propertyDetails.municipality) {
                                            pages[1].drawText(formData.propertyDetails.municipality, {
                                                x: 60,
                                                y: 245 + Y_OFFSET,
                                                size: 9,
                                                font: fontBold
                                            });
                                        }

                                        // Add HOA name to page 2 if available
                                        if (formData.propertyDetails && formData.propertyDetails.hoaName) {
                                            pages[1].drawText(formData.propertyDetails.hoaName, {
                                                x: 45,
                                                y: 350 + Y_OFFSET,
                                                size: 9,
                                                font: fontBold
                                            });
                                        }
                                    }

                                    // Save the filled PDF
                                    console.log("Saving filled PDF...");
                                    const filledPdfBytes = await pdfDoc.save();
                                    console.log("PDF saved, size:", filledPdfBytes.length, "bytes");

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
                                    const addressSlug = formData.propertyData ? .address ?
                                        formData.propertyData.address
                                        .replace(/[^a-zA-Z0-9]/g, '_')
                                        .replace(/_+/g, '_')
                                        .substring(0, 30) :
                                        'unknown_address';

                                    // Get formatted date
                                    const formattedDate = new Date().toISOString().split('T')[0];

                                    // Generate a descriptive filename
                                    const pdfFilename = `Transaction_${addressSlug}_${formattedDate}.pdf`;

                                    // Get agent name
                                    const agentName = formData.agentData ? .name ||
                                        formData.signatureData ? .agentName ||
                                        'Unknown Agent';

                                    // Create email transporter
                                    const transporter = nodemailer.createTransport({
                                        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                                        port: parseInt(process.env.EMAIL_PORT || '587'),
                                        secure: process.env.EMAIL_SECURE === 'true',
                                        auth: {
                                            user: process.env.EMAIL_USER,
                                            pass: process.env.EMAIL_PASSWORD
                                        }
                                    });

                                    // Create HTML email content
                                    const htmlEmail = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Transaction Form Submission</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-bottom: 20px; }
            h1 { color: #2c3e50; }
            .property-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .property-address { font-weight: bold; font-size: 18px; }
            h2 { color: #3498db; margin-top: 25px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .footer { margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-size: 12px; color: #777; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>New Transaction Submission</h1>
        </div>
        
        <div class="property-info">
            <div class="property-address">${formData.propertyData?.address || 'Unknown Address'}</div>
            <p><strong>MLS Number:</strong> ${formData.propertyData?.mlsNumber || 'Not provided'}</p>
            <p><strong>Sale Price:</strong> $${formData.propertyData?.salePrice || 'Not provided'}</p>
            <p><strong>Closing Date:</strong> ${formData.propertyData?.closingDate || 'Not provided'}</p>
        </div>
        
        <h2>Agent Information</h2>
        <p><strong>Name:</strong> ${agentName}</p>
        <p><strong>Role:</strong> ${formData.agentData?.role || 'Not specified'}</p>
        
        <h2>Client Information</h2>
        ${formData.clients?.map(client => `
            <p><strong>${client.type}:</strong> ${client.name}</p>
        `).join('') || '<p>No client information provided</p>'}
        
        <h2>Transaction Details</h2>
        <p><strong>Total Commission:</strong> ${formData.commissionData?.totalCommissionPercentage || 'Not provided'}%</p>
        
        <div class="footer">
            <p>This email was automatically generated. A complete PDF is attached.</p>
            <p>&copy; ${new Date().getFullYear()} PA Real Estate Support Services</p>
        </div>
    </body>
    </html>`;
    
    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@parealestatesupport.com',
      to: process.env.EMAIL_RECIPIENT || 'debbie@parealestatesupport.com',
      subject: `New Transaction - ${formData.propertyData?.address || 'Property'} - ${agentName}`,
      html: htmlEmail,
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
    return false;
  }
}

// Removed integration webhook functionality as requested

/**
 * Updates Airtable record with PDF attachment using integration webhook
 * @param {string} transactionId - Airtable record ID
 * @param {Buffer} pdfBuffer - The PDF buffer
 * @param {string} filename - PDF filename
 * @returns {Promise<boolean>} - Success status
 */
async function attachPdfToAirtable(transactionId, pdfBuffer, filename) {
  // This function is now a no-op since we're not attaching PDFs to Airtable
  console.log('PDF attachment to Airtable is disabled');
  return false;
}

/**
 * API handler for generating and handling PDFs
 */
module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    // Get form data
    const formData = req.body;
    const returnPdf = req.query.returnPdf === 'true';
    
    if (!formData) {
      return res.status(400).json({ success: false, error: 'No form data provided' });
    }
    
    // Extract transaction ID if available
    const transactionId = formData.transactionId;
    console.log('Transaction ID:', transactionId);
    
    // Prepare data for PDF
    const cleanData = prepareDataForPDF(formData);
    
    // Generate PDF
    console.log('Generating PDF...');
    const pdfBuffer = await fillPdfForm(cleanData);
    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    
    // Generate filename
    const addressSlug = formData.propertyData?.address 
      ? formData.propertyData.address.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').substring(0, 30) 
      : 'unknown_address';
    const formattedDate = new Date().toISOString().split('T')[0];
    const pdfFilename = `Transaction_${addressSlug}_${formattedDate}.pdf`;
    
    // If returnPdf is true, return the PDF as base64 for Supabase upload
    if (returnPdf) {
      return res.status(200).json({
        success: true,
        pdfBase64: pdfBuffer.toString('base64'),
        message: 'PDF generated successfully'
      });
    }
    
    // Send email with PDF
    let emailSent = false;
    try {
      console.log('Sending email with PDF...');
      emailSent = await sendPdfEmail(pdfBuffer, cleanData);
      console.log('Email sent:', emailSent ? 'success' : 'failed');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }
    
    // Return success response with PDF data
    return res.status(200).json({
      success: true,
      message: 'PDF generated successfully',
      pdfData: pdfBuffer.toString('base64'),
      emailSent,
      filename: pdfFilename
    });
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error occurred'
    });
  }
};    filename: pdfFilename
    });
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error occurred'
    });
  }
};