/**
 * This file contains the mapping of form fields to their positions on the PDF
 * The coordinates are based on the actual PDF template layout
 * Coordinates are already scaled to standard Letter size (8.5" × 11" or 612 × 792 pt)
 * 
 * Coordinates are measured from the bottom-left of the page
 * x increases from left to right
 * y increases from bottom to top
 */

// Global vertical adjustment - using a smaller offset for fine-tuning
const Y_OFFSET = -12; // Base offset

// Standard form field mapping based on precise coordinates scaled for Letter size paper
export const formFieldPositions = {
    // Page 1 - Transaction Coordinator form
    page1: {
        // Property information
        propertyAddress: { x: 75.68, y: 750.59 + Y_OFFSET, fontSize: 12, bold: true },
        mlsNumber: { x: 452.82, y: 750.59 + Y_OFFSET, fontSize: 12, bold: true },

        // Quick Reference section - Move UP by 7.6 points (half of 15.2)
        salePrice: { x: 278.45, y: 690.52 + Y_OFFSET + 2, fontSize: 11, bold: true },
        sellersAssist: { x: 396.44, y: 690.52 + Y_OFFSET + 2, fontSize: 11, bold: true },

        // Closing Information section - Move UP by 0.65 points (half of 1.3)
        closingDate: { x: 440, y: 644.28 + Y_OFFSET + 2, fontSize: 10, bold: true },

        // Agent Information section - Move DOWN by 7.4/7.05 points (half of 14.8/14.1)
        agentName: { x: 70, y: 546.91 + Y_OFFSET - 2, fontSize: 11, bold: true },
        agentRole: { x: 259.44, y: 546.91 + Y_OFFSET - 2, fontSize: 11, bold: true },

        // Buyer Information section - Move DOWN by half the specified amounts and shifted left
        buyerName: { x: 70.00, y: 494.06 + Y_OFFSET - 2, fontSize: 11, bold: true },
        buyerPhone: { x: 70.00, y: 467.63 + Y_OFFSET - 2, fontSize: 11 },
        buyerAddress: { x: 70.00, y: 441.20 + Y_OFFSET - 2, fontSize: 11 },
        buyerEmail: { x: 70.00, y: 414.77 + Y_OFFSET - 0, fontSize: 11 },

        // Seller Information section - Move DOWN by half the specified amounts and shifted left
        sellerName: { x: 340.00, y: 494.06 + Y_OFFSET - 2, fontSize: 11, bold: true },
        sellerPhone: { x: 340.00, y: 467.63 + Y_OFFSET - 2, fontSize: 11 },
        sellerAddress: { x: 340.00, y: 441.20 + Y_OFFSET - 2, fontSize: 11 }, // Shifted left from original
        sellerEmail: { x: 340.00, y: 414.77 + Y_OFFSET - 0, fontSize: 11 },

        // Legal Information section - Move DOWN by 13.9 points (half of 27.8)
        attorneyName: { x: 70, y: 361.92 + Y_OFFSET - 2, fontSize: 11 },

        // Financial Details section - Move DOWN by half the specified amounts
        listSidePercentage: { x: 75, y: 289.24 + Y_OFFSET + 2, fontSize: 11, bold: true },
        buyerSidePercentage: { x: 75, y: 262.81 + Y_OFFSET + 2, fontSize: 11, bold: true },
        totalPercentage: { x: 75, y: 236.38 + Y_OFFSET + 2, fontSize: 11, bold: true },
        sellerPaidAmount: { x: 200, y: 289.24 + Y_OFFSET + 2, fontSize: 11, bold: true },
        buyerPaidAmount: { x: 200, y: 262.81 + Y_OFFSET + 2, fontSize: 11, bold: true },

        // Title Information - Move DOWN by 14.9 points (half of 29.8)
        titleCompany: { x: 340, y: 163.71 + Y_OFFSET + 2, fontSize: 11, bold: true },

        // Referral Information section - Move DOWN by 14.9 points (half of 29.8)
        referralDueTo: { x: 108.12, y: 57.99 + Y_OFFSET - 2, fontSize: 11, bold: true },
        referralPercentage: { x: 264.81, y: 57.99 + Y_OFFSET - 2, fontSize: 11, bold: true },
    },

    // Page 2 - Additional Information
    page2: {
        // C/O Additional Information - Positioned to align with form fields
        municipality: { x: 60, y: 245 + Y_OFFSET, fontSize: 9, bold: true },

        // Resale Additional Information - Positioned to align with form fields
        hoaName: { x: 45, y: 350 + Y_OFFSET, fontSize: 9, bold: true },
    }
};

/**
 * Maps form data to PDF positions based on the formFieldPositions mapping
 * @param {Object} formData - The form data from the transaction form
 * @returns {Array} Array of text elements with coordinates
 */
export function mapFormDataToPositions(formData) {
    const textElements = [];

    // Property information - Top of form
    if (formData.propertyData) {
        addTextElement(textElements, 0, formFieldPositions.page1.propertyAddress,
            formData.propertyData.address || '');

        addTextElement(textElements, 0, formFieldPositions.page1.mlsNumber,
            formData.propertyData.mlsNumber || '');

        // Sale Price
        if (formData.propertyData.salePrice) {
            addTextElement(textElements, 0, formFieldPositions.page1.salePrice,
                `$${formData.propertyData.salePrice}`, true);
        }

        // Closing Date
        if (formData.propertyData.closingDate) {
            addTextElement(textElements, 0, formFieldPositions.page1.closingDate,
                formData.propertyData.closingDate);
        }
    }

    // Agent information
    if (formData.agentData) {
        addTextElement(textElements, 0, formFieldPositions.page1.agentName,
            formData.agentData.name || '');

        addTextElement(textElements, 0, formFieldPositions.page1.agentRole,
            formData.agentData.role ? formData.agentData.role.toUpperCase() : '');
    }

    // Commission/Financial data
    if (formData.commissionData) {
        // Total commission - check both field naming conventions
        const totalCommission = formData.commissionData.totalCommission || formData.commissionData.totalCommissionPercentage;
        if (totalCommission) {
            addTextElement(textElements, 0, formFieldPositions.page1.totalPercentage,
                `${totalCommission}`);
        }

        // Listing agent commission - check both field naming conventions
        const listingAgentCommission = formData.commissionData.listingAgentCommission || formData.commissionData.listingAgentPercentage;
        if (listingAgentCommission) {
            addTextElement(textElements, 0, formFieldPositions.page1.listSidePercentage,
                `${listingAgentCommission}`);
        }

        // Buyer's agent commission - check both field naming conventions
        const buyersAgentCommission = formData.commissionData.buyersAgentCommission || formData.commissionData.buyersAgentPercentage;
        if (buyersAgentCommission) {
            addTextElement(textElements, 0, formFieldPositions.page1.buyerSidePercentage,
                `${buyersAgentCommission}`);
        }

        // Seller Paid Amount - check both field naming conventions
        const brokerFeeAmount = formData.commissionData.brokerFeeAmount || formData.commissionData.brokerFee;
        if (brokerFeeAmount) {
            addTextElement(textElements, 0, formFieldPositions.page1.sellerPaidAmount,
                `$${brokerFeeAmount}`, true);
        }

        // Buyer Paid Amount - check both field naming conventions
        const buyerPaidAmount = formData.commissionData.buyerPaidAmount || formData.commissionData.buyerPaidCommission;
        if (buyerPaidAmount) {
            addTextElement(textElements, 0, formFieldPositions.page1.buyerPaidAmount,
                `$${buyerPaidAmount}`, true);
        }

        // Seller's assist - check both field naming conventions
        const sellersAssist = formData.commissionData.sellersAssist ||
            (formData.commissionData.hasSellersAssist ? formData.commissionData.sellersAssistAmount : '');
        if (sellersAssist) {
            addTextElement(textElements, 0, formFieldPositions.page1.sellersAssist,
                `$${sellersAssist}`, true);
        }

        // Referral information - check for string or boolean isReferral
        const isReferral = formData.commissionData.isReferral === 'YES' || formData.commissionData.isReferral === true;
        if (isReferral && formData.commissionData.referralParty) {
            addTextElement(textElements, 0, formFieldPositions.page1.referralDueTo,
                formData.commissionData.referralParty);

            if (formData.commissionData.referralFee) {
                addTextElement(textElements, 0, formFieldPositions.page1.referralPercentage,
                    `${formData.commissionData.referralFee}`);
            }
        }
    }

    // Client information - Buyers and Sellers
    if (formData.clients && formData.clients.length > 0) {
        // Sort clients by type (buyer/seller)
        const buyers = formData.clients.filter(c =>
            c.type ? c.type.toLowerCase() === 'buyer' || c.type.toLowerCase() === 'buyers' : false);

        const sellers = formData.clients.filter(c =>
            c.type ? c.type.toLowerCase() === 'seller' || c.type.toLowerCase() === 'sellers' : false);

        // Add buyer information
        if (buyers.length > 0) {
            addTextElement(textElements, 0, formFieldPositions.page1.buyerName,
                buyers[0].name || '');

            addTextElement(textElements, 0, formFieldPositions.page1.buyerPhone,
                buyers[0].phone || '');

            addTextElement(textElements, 0, formFieldPositions.page1.buyerAddress,
                buyers[0].address || '');

            addTextElement(textElements, 0, formFieldPositions.page1.buyerEmail,
                buyers[0].email || '');
        }

        // Add seller information
        if (sellers.length > 0) {
            addTextElement(textElements, 0, formFieldPositions.page1.sellerName,
                sellers[0].name || '');

            addTextElement(textElements, 0, formFieldPositions.page1.sellerPhone,
                sellers[0].phone || '');

            addTextElement(textElements, 0, formFieldPositions.page1.sellerAddress,
                sellers[0].address || '');

            addTextElement(textElements, 0, formFieldPositions.page1.sellerEmail,
                sellers[0].email || '');
        }
    }

    // Legal information - Attorney
    if (formData.propertyDetails && formData.propertyDetails.attorneyName) {
        addTextElement(textElements, 0, formFieldPositions.page1.attorneyName,
            formData.propertyDetails.attorneyName);
    }

    // Title company information
    if (formData.titleData && formData.titleData.titleCompany) {
        addTextElement(textElements, 0, formFieldPositions.page1.titleCompany,
            formData.titleData.titleCompany);
    }

    // Page 2 - Additional Information
    if (formData.propertyDetails) {
        // Municipality (Township)
        if (formData.propertyDetails.municipality) {
            addTextElement(textElements, 1, formFieldPositions.page2.municipality,
                formData.propertyDetails.municipality);
        }

        // HOA Name
        if (formData.propertyDetails.hoaName) {
            addTextElement(textElements, 1, formFieldPositions.page2.hoaName,
                formData.propertyDetails.hoaName);
        }
    }

    return textElements;
}

/**
 * Helper function to add a text element to the elements array
 * @param {Array} elements - Array of text elements
 * @param {number} page - Page number (0-based)
 * @param {Object} position - Position information (x, y, fontSize, maxWidth)
 * @param {string} text - Text to add
 * @param {boolean} isCurrency - Whether this is a currency value
 */
function addTextElement(elements, page, position, text, isCurrency = false) {
    if (text) {
        elements.push({
            page,
            x: position.x,
            y: position.y,
            text: String(text),
            fontSize: position.fontSize || 11,
            maxWidth: position.maxWidth,
            isBold: position.bold || isCurrency
        });
    }
}