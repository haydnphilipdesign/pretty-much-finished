// CommonJS version for Vercel serverless functions
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const Airtable = require('airtable');
const fetch = require('node-fetch');

// Helper function to extract data from form data for PDF
function prepareDataForPDF(formData) {
    console.log("Preparing form data for PDF generation");

    // Remove any cyclic references
    return JSON.parse(JSON.stringify(formData));
}

/**
 * Creates a PDF with data from the transaction form using the PDF template
 * @param {Object} formData - The form data submitted
 * @returns {Promise<Buffer>} - The filled PDF as a buffer
 */
async function fillPdfForm(formData) {
    try {
        console.log("Starting PDF generation process with template");

        // Fetch the PDF template from Supabase instead of looking for local file
        const supabaseUrl = 'https://rkqoexexgrmeevzffouq.supabase.co/storage/v1/object/public/transaction-documents//mergedTC.pdf';
        console.log("Fetching PDF template from Supabase URL:", supabaseUrl);

        let pdfBytes;

        try {
            // Fetch the template from Supabase
            const response = await fetch(supabaseUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch template from Supabase: ${response.status} ${response.statusText}`);
            }

            // Get the PDF bytes as an ArrayBuffer
            pdfBytes = await response.arrayBuffer();
            console.log("Successfully fetched PDF template from Supabase, size:", pdfBytes.byteLength, "bytes");

        } catch (fetchError) {
            console.error("Error fetching PDF template from Supabase:", fetchError.message);

            // Fallback to local file if Supabase fetch fails
            try {
                const pdfPath = path.join(process.cwd(), 'public', 'mergedTC.pdf');
                console.log("Falling back to local template at:", pdfPath);
                pdfBytes = fs.readFileSync(pdfPath);
                console.log("Successfully loaded PDF template from filesystem, size:", pdfBytes.length, "bytes");
            } catch (fileError) {
                console.error("Could not read PDF template from local filesystem:", fileError.message);
                throw new Error("PDF template could not be loaded from Supabase or local filesystem.");
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
                (formData.signatureData && formData.signatureData.agentName) ||
                (formData.signatureData && formData.signatureData.signature) ||
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
                c.type && c.type.includes('BUYER'));

            const sellers = normalizedClients.filter(c =>
                c.type && c.type.includes('SELLER'));

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

        // Save the PDF
        console.log("Saving PDF...");
        const finalPdfBytes = await pdfDoc.save();
        console.log("PDF saved, size:", finalPdfBytes.length, "bytes");

        // Return the PDF buffer
        return Buffer.from(finalPdfBytes);
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
}

/**
 * Sends a PDF via email
 * @param {Buffer} pdfBuffer - The PDF buffer to attach
 * @param {Object} formData - The form data for the email
 * @returns {Promise<boolean>} - Whether the email was sent successfully
 */
async function sendPdfEmail(pdfBuffer, formData) {
    try {
        console.log("Sending PDF via email...");

        // Create email transport
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Get property and agent information for the email
        const propertyAddress = formData.propertyData ? .address || 'Unknown Property';
        const mlsNumber = formData.propertyData ? .mlsNumber || 'Unknown MLS';
        const agentName = formData.agentData ? .name || 'Real Estate Agent';

        // Set up email data
        const mailOptions = {
            from: `"Transaction Services" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
            subject: `Transaction Form: ${propertyAddress} (MLS: ${mlsNumber})`,
            text: `
                Transaction form for property: ${propertyAddress}
                MLS Number: ${mlsNumber}
                Agent: ${agentName}
                
                Please see the attached PDF for transaction details.
            `,
            html: `
                <h2>Transaction Form</h2>
                <p><strong>Property:</strong> ${propertyAddress}</p>
                <p><strong>MLS Number:</strong> ${mlsNumber}</p>
                <p><strong>Agent:</strong> ${agentName}</p>
                <p>Please see the attached PDF for transaction details.</p>
            `,
            attachments: [{
                filename: `Transaction_${mlsNumber}.pdf`,
                content: pdfBuffer
            }]
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}

/**
 * Attaches a PDF to an Airtable record
 * @param {string} transactionId - The ID of the transaction record in Airtable
 * @param {Buffer} pdfBuffer - The PDF buffer to attach
 * @param {string} filename - The filename to use
 * @returns {Promise<boolean>} - Whether the attachment was successful
 */
async function attachPdfToAirtable(transactionId, pdfBuffer, filename) {
    try {
        console.log(`Attaching PDF to Airtable record: ${transactionId}`);

        // Set up Airtable client
        Airtable.configure({
            apiKey: process.env.AIRTABLE_API_KEY
        });

        const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

        // Convert buffer to base64 string for Airtable
        const pdfBase64 = pdfBuffer.toString('base64');

        // Update the Airtable record with the attachment
        const result = await base('Transactions').update(transactionId, {
            'PDF Attachment': [{
                url: `data:application/pdf;base64,${pdfBase64}`,
                filename: filename
            }]
        });

        console.log("Airtable record updated with PDF attachment");
        return true;
    } catch (error) {
        console.error("Error attaching PDF to Airtable:", error);
        return false;
    }
}

// API endpoint handler
module.exports = async(req, res) => {
    try {
        console.log("PDF generation API endpoint called");

        // Check request method
        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                error: 'Method not allowed. Use POST.'
            });
        }

        // Get the form data from the request body
        const formData = req.body;
        if (!formData) {
            return res.status(400).json({
                success: false,
                error: 'No form data provided'
            });
        }

        // Prepare the data for PDF generation
        const preparedData = prepareDataForPDF(formData);

        // Generate the PDF
        console.log("Generating PDF from form data...");
        const pdfBuffer = await fillPdfForm(preparedData);

        // Check if we should return the PDF directly
        const returnPdf = req.query.returnPdf === 'true';

        // If requested, return the PDF data
        if (returnPdf) {
            console.log("Returning PDF data in response...");
            return res.status(200).json({
                success: true,
                pdfBase64: pdfBuffer.toString('base64')
            });
        }

        // Otherwise, send the PDF via email
        const emailSent = await sendPdfEmail(pdfBuffer, preparedData);

        // If a transaction ID is provided, attach the PDF to the Airtable record
        let attachmentSuccess = false;
        if (formData.transactionId) {
            console.log("Attaching PDF to Airtable record:", formData.transactionId);
            const pdfFilename = `Transaction_${preparedData.propertyData?.mlsNumber || 'Unknown'}.pdf`;
            attachmentSuccess = await attachPdfToAirtable(formData.transactionId, pdfBuffer, pdfFilename);
        }

        // Return success response
        return res.status(200).json({
            success: true,
            emailSent,
            attachmentSuccess,
            message: 'PDF generated and processed successfully'
        });
    } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Unknown error occurred'
        });
    }
};