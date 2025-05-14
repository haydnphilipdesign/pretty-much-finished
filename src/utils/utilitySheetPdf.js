import puppeteer from 'puppeteer';
import path from 'path';
import { promises as fs } from 'fs';
import nodemailer from 'nodemailer';

/**
 * Generates a utility sheet PDF and optionally sends it via email
 * @param {Object} options - Configuration options
 * @param {boolean} options.sendEmail - Whether to send the PDF via email
 * @param {string} options.emailTo - Email recipient (default: debbie@parealestatesupport.com)
 * @param {string} options.emailSubject - Email subject
 * @param {string} options.emailBody - Email body HTML
 * @returns {Promise<Object>} - Result object with success status and file path
 */
export async function generateUtilitySheetPdf(options = {}) {
  const {
    sendEmail = true,
    emailTo = 'debbie@parealestatesupport.com',
    emailSubject = 'Utility Information Sheet',
    emailBody = '<p>Please find attached the utility information sheet.</p>'
  } = options;
  
  console.log('Generating utility sheet PDF...');
  
  try {
    // Define paths
    const utilitySheetPath = path.join(process.cwd(), 'public', 'connect', 'utility_sheet.html');
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFilename = `Utility_Sheet_${timestamp}.pdf`;
    const outputPath = path.join(outputDir, outputFilename);
    const publicPath = `/generated-pdfs/${outputFilename}`;
    
    console.log('Utility sheet path:', utilitySheetPath);
    console.log('Output path:', outputPath);
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Read the utility sheet HTML
    const html = await fs.readFile(utilitySheetPath, 'utf8');
    console.log('HTML file read successfully, length:', html.length);
    
    // Launch browser
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    try {
      // Create page
      const page = await browser.newPage();
      console.log('Browser page created');
      
      // Set content
      await page.setContent(html, { waitUntil: 'networkidle0' });
      console.log('Content set to page');
      
      // Generate PDF
      await page.pdf({
        path: outputPath,
        format: 'letter',
        landscape: true,
        printBackground: true,
        margin: { top: '0.25in', right: '0.25in', bottom: '0.25in', left: '0.25in' }
      });
      
      console.log('PDF generated successfully:', outputPath);
      
      // Check file size
      const stats = await fs.stat(outputPath);
      console.log('PDF file size:', stats.size, 'bytes');
      
      // Send email if requested
      let emailResult = { sent: false, error: null };
      
      if (sendEmail) {
        try {
          console.log('Sending email to:', emailTo);
          
          // Get environment variables
          const emailHost = import.meta.env.VITE_EMAIL_HOST || 'smtp.gmail.com';
          const emailPort = parseInt(import.meta.env.VITE_EMAIL_PORT || '587');
          const emailSecure = import.meta.env.VITE_EMAIL_SECURE === 'true';
          const emailUser = import.meta.env.VITE_EMAIL_USER;
          const emailPassword = import.meta.env.VITE_EMAIL_PASSWORD;
          const emailFrom = import.meta.env.VITE_EMAIL_FROM || emailUser;
          
          if (!emailUser || !emailPassword) {
            throw new Error('Email credentials not configured. Set VITE_EMAIL_USER and VITE_EMAIL_PASSWORD environment variables.');
          }
          
          // Configure email transport
          const transporter = nodemailer.createTransport({
            host: emailHost,
            port: emailPort,
            secure: emailSecure,
            auth: {
              user: emailUser,
              pass: emailPassword
            }
          });
          
          // Send email with PDF attachment
          const info = await transporter.sendMail({
            from: emailFrom,
            to: emailTo,
            subject: emailSubject,
            html: emailBody,
            attachments: [{
              filename: outputFilename,
              path: outputPath
            }]
          });
          
          console.log('Email sent successfully, ID:', info.messageId);
          emailResult = { sent: true, messageId: info.messageId };
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          emailResult = { sent: false, error: emailError.message };
        }
      }
      
      return { 
        success: true, 
        path: outputPath,
        publicPath,
        email: emailResult
      };
    } finally {
      await browser.close();
      console.log('Browser closed');
    }
  } catch (error) {
    console.error('Error generating utility sheet PDF:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}
