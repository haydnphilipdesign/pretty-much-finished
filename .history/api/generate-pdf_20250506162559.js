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

        // Add property status
        if (formData.propertyData && formData.propertyData.status) {
            page.drawText(formData.propertyData.status, {
                x: 278.45,
                y: 644.28 + Y_OFFSET - 20,
                size: 10,
                font: fontBold
            });
            console.log("Added property status:", formData.propertyData.status);
        }

        // Add property type
        if (formData.propertyData && formData.propertyData.propertyType) {
            page.drawText(formData.propertyData.propertyType, {
                x: 278.45,
                y: 644.28 + Y_OFFSET - 40,
                size: 10,
                font: fontBold
            });
            console.log("Added property type:", formData.propertyData.propertyType);
        }

        // Add winterized status
        if (formData.propertyData && formData.propertyData.winterized) {
            page.drawText(formData.propertyData.winterized, {
                x: 278.45,
                y: 644.28 + Y_OFFSET - 60,
                size: 10,
                font: fontBold
            });
            console.log("Added winterized status:", formData.propertyData.winterized);
        }

        // Add property access type
        if (formData.propertyData && formData.propertyData.accessType) {
            page.drawText(formData.propertyData.accessType, {
                x: 278.45,
                y: 644.28 + Y_OFFSET - 80,
                size: 10,
                font: fontBold
            });
            console.log("Added property access type:", formData.propertyData.accessType);
        }

        // Add property access code
        if (formData.propertyData && formData.propertyData.accessCode) {
            page.drawText(formData.propertyData.accessCode, {
                x: 278.45,
                y: 644.28 + Y_OFFSET - 100,
                size: 10,
                font: fontBold
            });
            console.log("Added property access code:", formData.propertyData.accessCode);
        } else if (formData.propertyData && formData.propertyData.lockboxAccessCode) {
            page.drawText(formData.propertyData.lockboxAccessCode, {
                x: 278.45,
                y: 644.28 + Y_OFFSET - 100,
                size: 10,
                font: fontBold
            });
            console.log("Added lockbox access code:", formData.propertyData.lockboxAccessCode);
        }

        // Add built before 1978 status
        if (formData.propertyData && formData.propertyData.builtBefore1978) {
            page.drawText(formData.propertyData.builtBefore1978, {
                x: 278.45,
                y: 644.28 + Y_OFFSET - 120,
                size: 10,
                font: fontBold
            });
            console.log("Added built before 1978 status:", formData.propertyData.builtBefore1978);
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

        // Add commission information
        if (formData.commissionData) {
            const startY = 380;
            const spacing = 20;
            let currentY = startY;

            // Total commission percentage
            if (formData.commissionData.totalCommissionPercentage) {
                page.drawText(`Total Commission: ${formData.commissionData.totalCommissionPercentage}%`, {
                    x: 70.00,
                    y: currentY,
                    size: 10,
                    font
                });
                currentY -= spacing;
            }

            // Buyer's agent percentage
            if (formData.commissionData.buyersAgentPercentage) {
                page.drawText(`Buyer's Agent: ${formData.commissionData.buyersAgentPercentage}%`, {
                    x: 70.00,
                    y: currentY,
                    size: 10,
                    font
                });
                currentY -= spacing;
            }

            // Listing agent percentage
            if (formData.commissionData.listingAgentPercentage) {
                page.drawText(`Listing Agent: ${formData.commissionData.listingAgentPercentage}%`, {
                    x: 70.00,
                    y: currentY,
                    size: 10,
                    font
                });
                currentY -= spacing;
            }

            // Seller's assist
            if (formData.commissionData.sellersAssist) {
                page.drawText(`Seller's Assist: $${formData.commissionData.sellersAssist}`, {
                    x: 70.00,
                    y: currentY,
                    size: 10,
                    font
                });
                currentY -= spacing;
            }

            // Coordinator fee paid by
            if (formData.commissionData.coordinatorFeePaidBy) {
                page.drawText(`Coordinator Fee Paid By: ${formData.commissionData.coordinatorFeePaidBy}`, {
                    x: 70.00,
                    y: currentY,
                    size: 10,
                    font
                });
            }
        }

        // Add additional information (in a separate section if needed)
        if (formData.additionalInfo) {
            const startY = 280;
            let currentY = startY;

            // Section title
            page.drawText("ADDITIONAL INFORMATION", {
                x: 70.00,
                y: currentY,
                size: 11,
                font: fontBold
            });
            currentY -= 20;

            // Special instructions
            if (formData.additionalInfo.specialInstructions) {
                page.drawText("Special Instructions:", {
                    x: 70.00,
                    y: currentY,
                    size: 10,
                    font: fontBold
                });
                currentY -= 15;

                // Split long text into multiple lines
                const specialInstructions = formData.additionalInfo.specialInstructions;
                const words = specialInstructions.split(' ');
                let line = '';
                const maxWidth = 450; // Maximum width for text

                for (const word of words) {
                    const testLine = line + word + ' ';
                    const textWidth = font.widthOfTextAtSize(testLine, 10);

                    if (textWidth > maxWidth) {
                        page.drawText(line, {
                            x: 80.00,
                            y: currentY,
                            size: 10,
                            font
                        });
                        currentY -= 15;
                        line = word + ' ';
                    } else {
                        line = testLine;
                    }
                }

                if (line) {
                    page.drawText(line, {
                        x: 80.00,
                        y: currentY,
                        size: 10,
                        font
                    });
                    currentY -= 20;
                }
            }

            // Urgent issues
            if (formData.additionalInfo.urgentIssues) {
                page.drawText("Urgent Issues:", {
                    x: 70.00,
                    y: currentY,
                    size: 10,
                    font: fontBold
                });
                currentY -= 15;

                // Split long text into multiple lines
                const urgentIssues = formData.additionalInfo.urgentIssues;
                const words = urgentIssues.split(' ');
                let line = '';
                const maxWidth = 450; // Maximum width for text

                for (const word of words) {
                    const testLine = line + word + ' ';
                    const textWidth = font.widthOfTextAtSize(testLine, 10);

                    if (textWidth > maxWidth) {
                        page.drawText(line, {
                            x: 80.00,
                            y: currentY,
                            size: 10,
                            font
                        });
                        currentY -= 15;
                        line = word + ' ';
                    } else {
                        line = testLine;
                    }
                }

                if (line) {
                    page.drawText(line, {
                        x: 80.00,
                        y: currentY,
                        size: 10,
                        font
                    });
                    currentY -= 20;
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

        // Extract all relevant data from the form
        const propertyAddress = (formData.propertyData && formData.propertyData.address) || 'Unknown Property';
        const mlsNumber = (formData.propertyData && formData.propertyData.mlsNumber) || 'Unknown MLS';
        const salePrice = (formData.propertyData && formData.propertyData.salePrice) ? `$${formData.propertyData.salePrice}` : 'Not specified';
        const closingDate = (formData.propertyData && formData.propertyData.closingDate) || 'Not specified';
        const propertyStatus = (formData.propertyData && formData.propertyData.status) || 'Not specified';
        const propertyType = (formData.propertyData && formData.propertyData.type) || 'Residential';
        const propertyAccessType = (formData.propertyData && formData.propertyData.accessType) || 'Not specified';
        const accessCode = (formData.propertyData && formData.propertyData.accessCode) || 'Not provided';
        const winterized = (formData.propertyData && formData.propertyData.winterized) || 'Not specified';
        const updateMLS = (formData.propertyData && formData.propertyData.updateMLS) || 'No';

        // Agent information
        const agentName = (formData.agentData && formData.agentData.name) || 'Unknown Agent';
        const agentRole = (formData.agentData && formData.agentData.role) || 'Agent';

        // Client information
        let buyerInfo = '';
        let sellerInfo = '';

        if (formData.clients && formData.clients.length > 0) {
            // Normalize and group clients
            const normalizedClients = formData.clients.map(client => ({
                ...client,
                type: client.type ? client.type.toUpperCase() : ''
            }));

            // Get buyers and sellers
            const buyers = normalizedClients.filter(c => c.type && c.type.includes('BUYER'));
            const sellers = normalizedClients.filter(c => c.type && c.type.includes('SELLER'));

            // Format buyer information
            if (buyers.length > 0) {
                const buyer = buyers[0];
                const buyerPhone = buyer.phone || 'Not provided';
                const buyerEmail = buyer.email || 'Not provided';
                const buyerAddress = buyer.address || buyer.streetAddress || 'Not provided';

                buyerInfo = `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 200px;">Buyer Name:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${buyer.name || 'Not provided'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Buyer Phone:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${buyerPhone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Buyer Email:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${buyerEmail}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Buyer Address:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${buyerAddress}</td>
                    </tr>
                `;
            }

            // Format seller information
            if (sellers.length > 0) {
                const seller = sellers[0];
                const sellerPhone = seller.phone || 'Not provided';
                const sellerEmail = seller.email || 'Not provided';
                const sellerAddress = seller.address || seller.streetAddress || 'Not provided';

                sellerInfo = `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 200px;">Seller Name:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${seller.name || 'Not provided'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Seller Phone:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${sellerPhone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Seller Email:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${sellerEmail}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Seller Address:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${sellerAddress}</td>
                    </tr>
                `;
            }
        }

        // Commission and financial details
        const sellersPaid = (formData.commissionData && formData.commissionData.sellerPaid) || 'Not specified';
        const buyersPaid = (formData.commissionData && formData.commissionData.buyerPaid) || 'Not specified';
        const totalCommission = (formData.commissionData && formData.commissionData.totalPercentage) || 'Not specified';
        const buyerAgentPercentage = (formData.commissionData && formData.commissionData.buyerAgentPercentage) || 'Not specified';
        const listingAgentPercentage = (formData.commissionData && formData.commissionData.listingAgentPercentage) || 'Not specified';
        const sellersAssist = (formData.commissionData && formData.commissionData.sellersAssist) ? `$${formData.commissionData.sellersAssist}` : 'Not specified';

        // Additional property details
        const hoaName = (formData.propertyData && formData.propertyData.hoaName) || 'None specified';
        const municipality = (formData.propertyData && formData.propertyData.municipality) || 'Not specified';
        const titleCompany = (formData.propertyData && formData.propertyData.titleCompany) || 'Not specified';
        const builtBefore1978 = (formData.propertyData && formData.propertyData.builtBefore1978) || 'Not specified';

        // Special instructions or notes
        const specialInstructions = (formData.notes && formData.notes.special) || 'None';
        const urgentIssues = (formData.notes && formData.notes.urgent) || 'None';
        const additionalInfo = (formData.notes && formData.notes.additional) || 'None';

        // Create a date string for the email
        const currentDate = new Date().toLocaleDateString();

        // Set up email data with beautiful HTML
        const mailOptions = {
                from: `"PA Real Estate Support Services" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
                subject: `Transaction Form: ${propertyAddress} (MLS: ${mlsNumber})`,
                text: `
Transaction Form Submission - ${currentDate}

Property Information:
- Address: ${propertyAddress}
- MLS Number: ${mlsNumber}
- Sale Price: ${salePrice}
- Closing Date: ${closingDate}
- Property Status: ${propertyStatus}
- Property Type: ${propertyType}
- Access Type: ${propertyAccessType}
- Access Code: ${accessCode}
- Winterized: ${winterized}
- Update MLS: ${updateMLS}

Agent Information:
- Name: ${agentName}
- Role: ${agentRole}

Please see the attached PDF for complete transaction details.
            `,
                html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background-color: #1a5276;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: white;
            padding: 20px;
            border-radius: 0 0 5px 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .section {
            margin-bottom: 25px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1a5276;
            margin-bottom: 10px;
            border-bottom: 2px solid #1a5276;
            padding-bottom: 5px;
            display: inline-block;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
        .important {
            background-color: #fcf8e3;
            padding: 10px;
            border-left: 5px solid #faebcc;
            margin-bottom: 20px;
        }
        .important-title {
            color: #8a6d3b;
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Transaction Form Submission</h1>
            <p>${currentDate}</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h2 class="section-title">Property Information</h2>
                <table>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 200px;">Address:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${propertyAddress}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">MLS Number:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${mlsNumber}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Sale Price:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${salePrice}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Closing Date:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${closingDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Property Status:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${propertyStatus}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Property Type:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${propertyType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Access Type:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${propertyAccessType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Access Code:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${accessCode}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Winterized:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${winterized}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Update MLS:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${updateMLS}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Built Before 1978:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${builtBefore1978}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">HOA Name:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${hoaName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Municipality:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${municipality}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Title Company:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${titleCompany}</td>
                    </tr>
                </table>
            </div>
            
            <div class="section">
                <h2 class="section-title">Agent Information</h2>
                <table>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 200px;">Name:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${agentName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Role:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${agentRole}</td>
                    </tr>
                </table>
            </div>
            
            ${buyerInfo ? `
            <div class="section">
                <h2 class="section-title">Buyer Information</h2>
                <table>
                    ${buyerInfo}
                </table>
            </div>
            ` : ''}
            
            ${sellerInfo ? `
            <div class="section">
                <h2 class="section-title">Seller Information</h2>
                <table>
                    ${sellerInfo}
                </table>
            </div>
            ` : ''}
            
            <div class="section">
                <h2 class="section-title">Commission Details</h2>
                <table>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 200px;">Total Commission %:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${totalCommission}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Buyer's Agent %:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${buyerAgentPercentage}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Listing Agent %:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${listingAgentPercentage}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Seller Paid:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${sellersPaid}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Buyer Paid:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${buyersPaid}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Seller's Assist:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${sellersAssist}</td>
                    </tr>
                </table>
            </div>
            
            ${(specialInstructions !== 'None' || urgentIssues !== 'None' || additionalInfo !== 'None') ? `
            <div class="section">
                <h2 class="section-title">Notes and Instructions</h2>
                ${urgentIssues !== 'None' ? `
                <div class="important">
                    <span class="important-title">Urgent Issues:</span>
                    ${urgentIssues}
                </div>
                ` : ''}
                
                ${specialInstructions !== 'None' ? `
                <p><strong>Special Instructions:</strong> ${specialInstructions}</p>
                ` : ''}
                
                ${additionalInfo !== 'None' ? `
                <p><strong>Additional Information:</strong> ${additionalInfo}</p>
                ` : ''}
            </div>
            ` : ''}
            
            <p>Please see the attached PDF for complete transaction details.</p>
        </div>
        
        <div class="footer">
            <p>This is an automated message from PA Real Estate Support Services.</p>
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
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
 * Uploads PDF to Supabase and updates Airtable record with the URL
 * @param {string} transactionId - The ID of the transaction record in Airtable
 * @param {Buffer} pdfBuffer - The PDF buffer to upload
 * @param {string} filename - The filename to use
 * @returns {Promise<{success: boolean, url: string}>} - Result of the operation
 */
async function uploadToSupabaseAndUpdateAirtable(transactionId, pdfBuffer, filename) {
    try {
        console.log(`Uploading PDF to Supabase and updating Airtable record: ${transactionId}`);

        // Call the supabase-pdf-upload API endpoint
        console.log("Preparing PDF data for upload...");
        const pdfBase64 = pdfBuffer.toString('base64');

        // Determine the API endpoint URL
        const apiUrl = process.env.NEXT_PUBLIC_HOST_URL ?
            `${process.env.NEXT_PUBLIC_HOST_URL}/api/supabase-pdf-upload` :
            'https://www.parealestatesupport.com/api/supabase-pdf-upload';

        console.log(`Calling Supabase PDF upload API at: ${apiUrl}`);

        // Make the API call
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pdfData: `data:application/pdf;base64,${pdfBase64}`,
                filename,
                transactionId
            }),
        });

        // Handle the response
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Supabase upload failed: ${response.status}`, errorText);
            throw new Error(`Failed to upload PDF to Supabase: ${response.status} ${errorText}`);
        }

        // Parse the response
        const result = await response.json();

        // Check if the upload was successful
        if (!result.success) {
            throw new Error(`Supabase upload reported failure: ${result.error || 'Unknown error'}`);
        }

        console.log(`PDF successfully uploaded to Supabase. URL: ${result.url}`);

        // If the Supabase endpoint didn't update Airtable, do it manually
        if (!result.airtableUpdated && result.url) {
            console.log("Supabase upload succeeded but Airtable not updated. Updating Airtable directly...");

            // Call the update-airtable-attachment API
            const airtableUrl = process.env.NEXT_PUBLIC_HOST_URL ?
                `${process.env.NEXT_PUBLIC_HOST_URL}/api/update-airtable-attachment` :
                'https://www.parealestatesupport.com/api/update-airtable-attachment';

            const airtableResponse = await fetch(airtableUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pdfData: result.url,
                    filename,
                    transactionId,
                    fieldId: 'fldhrYdoFwtNfzdFY' // PDF Attachment field ID
                }),
            });

            if (!airtableResponse.ok) {
                const airtableErrorText = await airtableResponse.text();
                console.error(`Airtable update failed: ${airtableResponse.status}`, airtableErrorText);
                // Don't throw an error here - we at least have the Supabase URL
            } else {
                const airtableResult = await airtableResponse.json();
                console.log("Airtable update result:", airtableResult);
            }
        }

        return {
            success: true,
            url: result.url
        };
    } catch (error) {
        console.error("Error uploading to Supabase and updating Airtable:", error);
        return {
            success: false,
            error: error.message || 'Unknown error',
        };
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

        // If a transaction ID is provided, upload to Supabase and update Airtable
        let attachmentResult = { success: false };
        if (formData.transactionId) {
            console.log("Processing PDF storage for transaction ID:", formData.transactionId);
            const mlsNumber = (preparedData.propertyData && preparedData.propertyData.mlsNumber) || 'Unknown';
            const pdfFilename = `Transaction_${mlsNumber}.pdf`;

            // Use Supabase storage and update Airtable with the URL
            attachmentResult = await uploadToSupabaseAndUpdateAirtable(
                formData.transactionId,
                pdfBuffer,
                pdfFilename
            );

            // If Supabase upload fails, fall back to direct Airtable attachment
            if (!attachmentResult.success) {
                console.log("Falling back to direct Airtable attachment...");
                const directAttachmentSuccess = await attachPdfToAirtable(
                    formData.transactionId,
                    pdfBuffer,
                    pdfFilename
                );
                attachmentResult.fallbackSuccess = directAttachmentSuccess;
            }
        }

        // Return success response
        return res.status(200).json({
            success: true,
            emailSent,
            attachmentSuccess: attachmentResult.success || attachmentResult.fallbackSuccess || false,
            pdfUrl: attachmentResult.url || null,
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