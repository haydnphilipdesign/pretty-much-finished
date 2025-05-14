// CommonJS version for Vercel serverless functions
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

// Helper function to map form data to positions on PDF
function mapFormDataToPositions(formData) {
    const textElements = [];
    const Y_OFFSET = -12;

    console.log("Mapping form data to PDF positions");

    // Add formatted property address if available
    if (formData.propertyData && formData.propertyData.address) {
        textElements.push({
            page: 0,
            x: 75.68,
            y: 750.59 + Y_OFFSET,
            text: formData.propertyData.address,
            fontSize: 12,
            isBold: true
        });
    }

    // Add MLS number if available
    if (formData.propertyData && formData.propertyData.mlsNumber) {
        textElements.push({
            page: 0,
            x: 452.82,
            y: 750.59 + Y_OFFSET,
            text: formData.propertyData.mlsNumber,
            fontSize: 12,
            isBold: true
        });
    }

    // Add sale price if available
    if (formData.propertyData && formData.propertyData.salePrice) {
        textElements.push({
            page: 0,
            x: 278.45,
            y: 690.52 + Y_OFFSET + 2,
            text: `$${formData.propertyData.salePrice}`,
            fontSize: 11,
            isBold: true
        });
    }

    // Add closing date if available
    if (formData.propertyData && formData.propertyData.closingDate) {
        textElements.push({
            page: 0,
            x: 440,
            y: 644.28 + Y_OFFSET + 2,
            text: formData.propertyData.closingDate,
            fontSize: 10,
            isBold: true
        });
    }

    // Add agent information if available
    if (formData.agentData) {
        // Try multiple possible fields for agent name
        const agentName = formData.agentData.name ||
            formData.agentData.agentName ||
            (formData.signatureData && formData.signatureData.agentName) ||
            (formData.signatureData && formData.signatureData.signature) ||
            'Unknown Agent';

        console.log("Using agent name:", agentName);

        textElements.push({
            page: 0,
            x: 70,
            y: 546.91 + Y_OFFSET - 2,
            text: agentName,
            fontSize: 11,
            isBold: true
        });

        // Format the role consistently
        let role = formData.agentData.role || 'AGENT';
        // Convert to uppercase and standardize
        role = role.toUpperCase();
        if (role === 'LISTINGAGENT' || role === 'LISTING_AGENT') role = 'LISTING AGENT';
        if (role === 'BUYERSAGENT' || role === 'BUYERS_AGENT') role = 'BUYERS AGENT';
        if (role === 'DUALAGENT' || role === 'DUAL_AGENT') role = 'DUAL AGENT';

        textElements.push({
            page: 0,
            x: 259.44,
            y: 546.91 + Y_OFFSET - 2,
            text: role,
            fontSize: 11,
            isBold: true
        });
    }

    // Add clients information if available
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
                textElements.push({
                    page: 0,
                    x: 70.00,
                    y: 494.06 + Y_OFFSET - 2,
                    text: buyers[0].name,
                    fontSize: 11,
                    isBold: true
                });
            }

            if (buyers[0].phone) {
                textElements.push({
                    page: 0,
                    x: 70.00,
                    y: 467.63 + Y_OFFSET - 2,
                    text: buyers[0].phone,
                    fontSize: 11
                });
            }

            // Try both address fields
            const buyerAddress = buyers[0].address || buyers[0].streetAddress;
            if (buyerAddress) {
                textElements.push({
                    page: 0,
                    x: 70.00,
                    y: 441.20 + Y_OFFSET - 2,
                    text: buyerAddress,
                    fontSize: 11
                });
            }

            if (buyers[0].email) {
                textElements.push({
                    page: 0,
                    x: 70.00,
                    y: 414.77 + Y_OFFSET - 0,
                    text: buyers[0].email,
                    fontSize: 11
                });
            }
        }

        // Add seller information
        if (sellers.length > 0) {
            if (sellers[0].name) {
                textElements.push({
                    page: 0,
                    x: 340.00,
                    y: 494.06 + Y_OFFSET - 2,
                    text: sellers[0].name,
                    fontSize: 11,
                    isBold: true
                });
            }

            if (sellers[0].phone) {
                textElements.push({
                    page: 0,
                    x: 340.00,
                    y: 467.63 + Y_OFFSET - 2,
                    text: sellers[0].phone,
                    fontSize: 11
                });
            }

            // Try both address fields
            const sellerAddress = sellers[0].address || sellers[0].streetAddress;
            if (sellerAddress) {
                textElements.push({
                    page: 0,
                    x: 340.00,
                    y: 441.20 + Y_OFFSET - 2,
                    text: sellerAddress,
                    fontSize: 11
                });
            }

            if (sellers[0].email) {
                textElements.push({
                    page: 0,
                    x: 340.00,
                    y: 414.77 + Y_OFFSET - 0,
                    text: sellers[0].email,
                    fontSize: 11
                });
            }
        }
    }

    // Add commission data if available
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
            textElements.push({
                page: 0,
                x: 75,
                y: 289.24 + Y_OFFSET + 2,
                text: `${listingCommission}%`,
                fontSize: 11,
                isBold: true
            });
        }

        // Buyer's agent commission
        if (buyersCommission) {
            textElements.push({
                page: 0,
                x: 75,
                y: 262.81 + Y_OFFSET + 2,
                text: `${buyersCommission}%`,
                fontSize: 11,
                isBold: true
            });
        }

        // Total commission
        if (totalCommission) {
            textElements.push({
                page: 0,
                x: 75,
                y: 236.38 + Y_OFFSET + 2,
                text: `${totalCommission}%`,
                fontSize: 11,
                isBold: true
            });
        }

        // Seller Paid Amount
        if (formData.commissionData.sellerPaidAmount) {
            textElements.push({
                page: 0,
                x: 200,
                y: 289.24 + Y_OFFSET + 2,
                text: `$${formData.commissionData.sellerPaidAmount}`,
                fontSize: 11,
                isBold: true
            });
        }

        // Buyer Paid Amount
        if (formData.commissionData.buyerPaidAmount) {
            textElements.push({
                page: 0,
                x: 200,
                y: 262.81 + Y_OFFSET + 2,
                text: `$${formData.commissionData.buyerPaidAmount}`,
                fontSize: 11,
                isBold: true
            });
        } else if (formData.commissionData.buyerPaidCommission) {
            // Fallback to buyerPaidCommission if buyerPaidAmount isn't available
            textElements.push({
                page: 0,
                x: 200,
                y: 262.81 + Y_OFFSET + 2,
                text: `${formData.commissionData.buyerPaidCommission}%`,
                fontSize: 11,
                isBold: true
            });
        }

        // Seller's assist - try multiple field names
        const sellersAssist = formData.commissionData.sellersAssist ||
            (formData.commissionData.hasSellersAssist ? formData.commissionData.sellersAssistAmount : '');

        if (sellersAssist) {
            textElements.push({
                page: 0,
                x: 396.44,
                y: 690.52 + Y_OFFSET + 2,
                text: `$${sellersAssist}`,
                fontSize: 11,
                isBold: true
            });
        }

        // Add referral information if this is a referral
        if (formData.commissionData.isReferral === 'YES' || formData.commissionData.isReferral === true) {
            if (formData.commissionData.referralParty) {
                textElements.push({
                    page: 0,
                    x: 108.12,
                    y: 57.99 + Y_OFFSET - 2,
                    text: formData.commissionData.referralParty,
                    fontSize: 11,
                    isBold: true
                });
            }

            if (formData.commissionData.referralFee) {
                textElements.push({
                    page: 0,
                    x: 264.81,
                    y: 57.99 + Y_OFFSET - 2,
                    text: formData.commissionData.referralFee,
                    fontSize: 11,
                    isBold: true
                });
            }
        }

        // Add commission information
        if (formData.commissionData) {
            // Total Commission
            if (formData.commissionData.totalCommissionPercentage) {
                textElements.push({
                    page: 1,
                    x: 220,
                    y: 545 + Y_OFFSET,
                    text: `${formData.commissionData.totalCommissionPercentage}%`,
                    fontSize: 9,
                    isBold: true
                });
            }

            // Listing Agent Commission
            if (formData.commissionData.listingAgentPercentage) {
                textElements.push({
                    page: 1,
                    x: 220,
                    y: 525 + Y_OFFSET,
                    text: `${formData.commissionData.listingAgentPercentage}%`,
                    fontSize: 9,
                    isBold: true
                });
            }

            // Buyer's Agent Commission
            if (formData.commissionData.buyersAgentPercentage) {
                textElements.push({
                    page: 1,
                    x: 220,
                    y: 505 + Y_OFFSET,
                    text: `${formData.commissionData.buyersAgentPercentage}%`,
                    fontSize: 9,
                    isBold: true
                });
            }

            // Seller Paid Amount
            if (formData.commissionData.sellerPaidAmount) {
                textElements.push({
                    page: 1,
                    x: 320,
                    y: 525 + Y_OFFSET,
                    text: `$${formData.commissionData.sellerPaidAmount}`,
                    fontSize: 9,
                    isBold: true
                });
            }

            // Buyer Paid Amount
            if (formData.commissionData.buyerPaidAmount) {
                textElements.push({
                    page: 1,
                    x: 320,
                    y: 505 + Y_OFFSET,
                    text: `$${formData.commissionData.buyerPaidAmount}`,
                    fontSize: 9,
                    isBold: true
                });
            }

            // Seller's Assist
            if (formData.commissionData.hasSellersAssist && formData.commissionData.sellersAssist) {
                textElements.push({
                    page: 1,
                    x: 220,
                    y: 485 + Y_OFFSET,
                    text: `$${formData.commissionData.sellersAssist}`,
                    fontSize: 9,
                    isBold: true
                });
            }
        }
    }

    // Add attorney information if available
    if (formData.propertyDetails && formData.propertyDetails.attorneyName) {
        textElements.push({
            page: 0,
            x: 70,
            y: 361.92 + Y_OFFSET - 2,
            text: formData.propertyDetails.attorneyName,
            fontSize: 11
        });
    }

    // Add title company if available
    if (formData.titleData && formData.titleData.titleCompany) {
        textElements.push({
            page: 0,
            x: 340,
            y: 163.71 + Y_OFFSET + 2,
            text: formData.titleData.titleCompany,
            fontSize: 11,
            isBold: true
        });
    }

    // Add municipality information to page 2 if available
    // We'll check for municipality data regardless of coRequired value
    if (formData.propertyDetails && formData.propertyDetails.municipality) {
        textElements.push({
            page: 1,
            x: 60,
            y: 245 + Y_OFFSET,
            text: formData.propertyDetails.municipality,
            fontSize: 9,
            isBold: true
        });
    }

    // Add HOA name to page 2 if available
    if (formData.propertyDetails && formData.propertyDetails.hoaName) {
        textElements.push({
            page: 1,
            x: 45,
            y: 350 + Y_OFFSET,
            text: formData.propertyDetails.hoaName,
            fontSize: 9,
            isBold: true
        });
    }

    console.log(`Generated ${textElements.length} text elements for PDF`);
    return textElements;
}

/**
 * Creates a PDF with data from the transaction form
 * @param {Object} formData - The form data submitted
 * @returns {Promise<Buffer>} - The filled PDF as a buffer
 */
async function fillPdfForm(formData) {
    try {
        console.log("Starting PDF generation process");

        // Path to the PDF template
        const pdfPath = path.resolve(process.cwd(), 'public', 'mergedTC.pdf');
        console.log("PDF template path:", pdfPath);

        // Verify the template exists
        if (!fs.existsSync(pdfPath)) {
            console.error("PDF template not found at path:", pdfPath);
            throw new Error("PDF template not found");
        }

        // Read the PDF template
        const pdfBytes = fs.readFileSync(pdfPath);
        console.log("PDF template loaded, size:", pdfBytes.length, "bytes");

        // Load the PDF document
        console.log("Loading PDF document...");
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Set the page size to standard Letter size (8.5" × 11" or 612 × 792 pt)
        const pages = pdfDoc.getPages();
        console.log("PDF has", pages.length, "pages");

        for (const page of pages) {
            page.setSize(612, 792);
        }

        // Map the form data to positions on the PDF
        console.log("Mapping form data to PDF positions...");
        const textElements = mapFormDataToPositions(formData);
        console.log(`Generated ${textElements.length} text elements to add to PDF`);

        // Find the highest page index needed
        const maxPageIndex = textElements.reduce((max, elem) => Math.max(max, elem.page), 0);
        console.log("Maximum page index needed:", maxPageIndex);

        // Check if we need to add more pages
        while (pages.length <= maxPageIndex) {
            console.log(`Adding page ${pages.length} to PDF`);
            pdfDoc.addPage([612, 792]); // Add a new page with Letter size
        }

        // Get updated pages array after potentially adding pages
        const updatedPages = pdfDoc.getPages();
        console.log("PDF now has", updatedPages.length, "pages");

        // Embed the fonts
        console.log("Embedding fonts...");
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Add text to the appropriate pages
        console.log("Adding text elements to PDF...");
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
        console.log("Saving PDF document...");
        const filledPdfBytes = await pdfDoc.save();
        console.log("PDF saved, size:", filledPdfBytes.length, "bytes");

        return Buffer.from(filledPdfBytes);
    } catch (error) {
        console.error('Error creating PDF:', error);
        throw new Error(`Failed to create PDF: ${error.message}`);
    }
}

/**
 * API handler for generating PDFs from transaction form data and returning the buffer
 */
module.exports = async(req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        // Get form data from request body
        const formData = req.body;

        if (!formData) {
            return res.status(400).json({
                success: false,
                error: 'No form data provided'
            });
        }

        console.log('Processing transaction form data for PDF generation');

        // Generate the filled PDF
        const pdfBuffer = await fillPdfForm(formData);

        // Create address slug for filename
        const addressSlug = formData.propertyData && formData.propertyData.address ?
            formData.propertyData.address
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/_+/g, '_')
            .substring(0, 30) :
            'unknown_address';

        // Get formatted date
        const formattedDate = new Date().toISOString().split('T')[0];

        // Generate a descriptive filename
        const pdfFilename = `Transaction_${addressSlug}_${formattedDate}.pdf`;

        // Convert to base64 for transport
        const pdfBase64 = pdfBuffer.toString('base64');

        return res.status(200).json({
            success: true,
            message: 'PDF generated successfully',
            pdfFilename,
            pdfBase64
        });
    } catch (error) {
        console.error('Error in PDF generation API:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'An unknown error occurred generating the PDF'
        });
    }
};