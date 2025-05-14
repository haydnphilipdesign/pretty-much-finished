import { TransactionFormData } from '@/types/transaction';

/**
 * Generate formatted email content for a transaction submission
 * @param formData The transaction form data
 * @returns HTML content for the email
 */
export function getTransactionEmailContent(formData: TransactionFormData): string {
  // Extract property address and format it nicely
  const address = formData.propertyData?.address || 'N/A';
  const mlsNumber = formData.propertyData?.mlsNumber || 'N/A';
  const salePrice = formData.propertyData?.salePrice 
    ? `$${formData.propertyData.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` 
    : 'N/A';
  const closingDate = formData.propertyData?.closingDate || 'N/A';
  const propertyStatus = formData.propertyData?.status || 'N/A';
  
  // Extract agent information
  const agentName = formData.agentData?.name || 'N/A';
  const agentRole = formData.agentData?.role || 'N/A';
  
  // Extract client information
  const sellerInfo = formData.clients.filter(client => 
    client.type.toLowerCase() === 'seller');
  const buyerInfo = formData.clients.filter(client => 
    client.type.toLowerCase() === 'buyer');
    
  const sellerName = sellerInfo.length > 0 
    ? sellerInfo.map(seller => seller.name).join(', ') 
    : 'N/A';
  const buyerName = buyerInfo.length > 0 
    ? buyerInfo.map(buyer => buyer.name).join(', ') 
    : 'N/A';
  
  // Extract transaction details
  const totalCommission = formData.commissionData?.totalCommissionPercentage || 'N/A';
  const titleCompany = formData.titleData?.titleCompany || 'N/A';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Transaction Form Submission</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 2px solid #5c9dca;
                margin-bottom: 20px;
            }
            .logo {
                max-width: 200px;
                margin-bottom: 10px;
            }
            h1 {
                color: #2a5f86;
                margin: 0 0 10px 0;
                font-size: 24px;
            }
            h2 {
                color: #2a5f86;
                font-size: 18px;
                margin: 20px 0 10px 0;
                padding-bottom: 5px;
                border-bottom: 1px solid #ddd;
            }
            .property-info {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
            }
            .property-address {
                font-weight: bold;
                font-size: 16px;
            }
            .info-row {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 5px;
            }
            .info-label {
                flex: 0 0 150px;
                font-weight: bold;
            }
            .info-value {
                flex: 1;
            }
            .footer {
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #ddd;
                font-size: 12px;
                color: #777;
                text-align: center;
            }
            .attachment-note {
                background-color: #f0f7ff;
                border-left: 4px solid #5c9dca;
                padding: 10px 15px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Transaction Form Submission</h1>
        </div>
        
        <div class="property-info">
            <div class="property-address">${address}</div>
            <div class="info-row">
                <div class="info-label">MLS Number:</div>
                <div class="info-value">${mlsNumber}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Sale Price:</div>
                <div class="info-value">${salePrice}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Closing Date:</div>
                <div class="info-value">${closingDate}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Property Status:</div>
                <div class="info-value">${propertyStatus}</div>
            </div>
        </div>
        
        <h2>Agent Information</h2>
        <div class="info-row">
            <div class="info-label">Name:</div>
            <div class="info-value">${agentName}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Role:</div>
            <div class="info-value">${agentRole}</div>
        </div>
        
        <h2>Client Information</h2>
        <div class="info-row">
            <div class="info-label">Seller:</div>
            <div class="info-value">${sellerName}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Buyer:</div>
            <div class="info-value">${buyerName}</div>
        </div>
        
        <h2>Transaction Details</h2>
        <div class="info-row">
            <div class="info-label">Total Commission:</div>
            <div class="info-value">${totalCommission}%</div>
        </div>
        <div class="info-row">
            <div class="info-label">Title Company:</div>
            <div class="info-value">${titleCompany}</div>
        </div>
        
        <div class="attachment-note">
            <strong>📎 Attachment:</strong> The complete transaction form is attached to this email as a PDF document.
        </div>
        
        <div class="footer">
            <p>This email was automatically generated from a transaction form submission.</p>
            <p>© ${new Date().getFullYear()} PA Real Estate Support Services | <a href="https://parealestatesupport.com">parealestatesupport.com</a></p>
        </div>
    </body>
    </html>
  `;
}
