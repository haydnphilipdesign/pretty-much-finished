import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
import nodemailer from 'nodemailer';

// Define response type
interface PdfResponse {
  success: boolean;
  message: string;
  pdfPath?: string;
  emailSent?: boolean;
  error?: string;
}

// Helper to get environment variables
const getEnvVar = (name: string, defaultValue: string = ''): string => {
  const value = process.env[name];
  if (!value && defaultValue === '') {
    console.warn(`Warning: Environment variable ${name} is not set and no default provided`);
  }
  return value || defaultValue;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PdfResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const {
      templatePath,
      templateData,
      filename,
      sendEmail = true,
      emailTo = 'debbie@parealestatesupport.com',
      emailSubject,
      emailBody
    } = req.body;

    // Validate required parameters
    if (!templatePath || !templateData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: templatePath and templateData'
      });
    }

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');
    await fs.mkdir(outputDir, { recursive: true });

    // Generate unique filename if not provided
    const outputFilename = filename || `transaction_${Date.now()}.pdf`;
    const outputPath = path.join(outputDir, outputFilename);
    const publicPath = `/generated-pdfs/${outputFilename}`;

    // Get the full path to the template
    const fullTemplatePath = path.join(process.cwd(), 'public', templatePath);

    // Read the template file
    let templateHtml;
    try {
      templateHtml = await fs.readFile(fullTemplatePath, 'utf-8');
    } catch (error) {
      console.error('Error reading template file:', error);
      return res.status(500).json({
        success: false,
        message: `Failed to read template file: ${fullTemplatePath}`,
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Replace placeholders in the template
    let populatedHtml = templateHtml;
    Object.entries(templateData).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      populatedHtml = populatedHtml.replace(placeholder, value as string);
      
      // Also handle Handlebars-style conditionals
      const conditionalPlaceholder = new RegExp(`{{#if ${key}}}${value}{{/if}}`, 'g');
      populatedHtml = populatedHtml.replace(conditionalPlaceholder, value as string);
    });

    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Set content to the populated HTML
      await page.setContent(populatedHtml, { waitUntil: 'networkidle0' });
      
      // Generate PDF
      await page.pdf({
        path: outputPath,
        format: 'letter',
        printBackground: true,
        margin: { top: '0.25in', right: '0.25in', bottom: '0.25in', left: '0.25in' },
      });
      
      // Send email if requested
      let emailSent = false;
      let emailError = null;
      
      if (sendEmail) {
        try {
          // Configure email transport
          const transporter = nodemailer.createTransport({
            host: getEnvVar('EMAIL_HOST', 'smtp.gmail.com'),
            port: parseInt(getEnvVar('EMAIL_PORT', '587')),
            secure: getEnvVar('EMAIL_SECURE', 'false') === 'true',
            auth: {
              user: getEnvVar('EMAIL_USER'),
              pass: getEnvVar('EMAIL_PASSWORD')
            }
          });
          
          // Send email with PDF attachment
          await transporter.sendMail({
            from: getEnvVar('EMAIL_FROM', getEnvVar('EMAIL_USER')),
            to: emailTo,
            subject: emailSubject || 'Transaction Form Submission',
            html: emailBody || '<p>Please find attached the transaction form submission.</p>',
            attachments: [{
              filename: outputFilename,
              path: outputPath
            }]
          });
          
          emailSent = true;
        } catch (error) {
          console.error('Error sending email:', error);
          emailError = error instanceof Error ? error.message : String(error);
        }
      }
      
      return res.status(200).json({
        success: true,
        message: 'PDF generated successfully',
        pdfPath: publicPath,
        emailSent,
        error: emailError
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
