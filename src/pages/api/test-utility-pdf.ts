import { NextApiRequest, NextApiResponse } from 'next';
import { selectTemplate, mapFormDataToTemplate } from '@/utils/templateSelector';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
import nodemailer from 'nodemailer';

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
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Sample transaction data for testing
    const sampleData = {
      agentData: {
        role: req.body.role || 'LISTING AGENT',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567'
      },
      propertyData: {
        mlsNumber: 'MLS12345',
        address: '123 Main St, Anytown, PA 12345',
        salePrice: '350000',
        status: 'OCCUPIED'
      },
      clients: [
        {
          id: '1',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '555-987-6543',
          address: '456 Oak Ave, Othertown, PA 54321',
          maritalStatus: 'SINGLE',
          type: 'BUYER'
        }
      ],
      commissionData: {
        totalCommission: '10500',
        totalCommissionPercentage: '3'
      },
      additionalInfo: {
        notes: 'This is a test transaction for utility sheet PDF generation.'
      }
    };

    // Select template based on agent role
    const templateName = selectTemplate(sampleData.agentData.role);
    const templatePath = path.join(process.cwd(), 'public', 'templates', templateName);
    
    // Map data to template placeholders
    const templateData = mapFormDataToTemplate(sampleData);
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFilename = `Test_Utility_${timestamp}.pdf`;
    const outputPath = path.join(outputDir, outputFilename);
    const publicPath = `/generated-pdfs/${outputFilename}`;
    
    // Read the template file
    let templateHtml;
    try {
      templateHtml = await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
      console.error('Error reading template file:', error);
      return res.status(500).json({
        success: false,
        message: `Failed to read template file: ${templatePath}`,
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
        landscape: true
      });
      
      // Send email if requested
      let emailSent = false;
      let emailError = null;
      
      if (req.body.sendEmail) {
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
            to: 'debbie@parealestatesupport.com',
            subject: 'Test Utility Sheet PDF',
            html: `
              <h2>Test Utility Sheet PDF</h2>
              <p>This is a test email with a utility sheet PDF attachment.</p>
              <p><strong>Property:</strong> ${sampleData.propertyData.address}</p>
              <p><strong>MLS#:</strong> ${sampleData.propertyData.mlsNumber}</p>
              <p><strong>Agent:</strong> ${sampleData.agentData.name} (${sampleData.agentData.role})</p>
              <p><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
            `,
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
        message: 'Utility sheet PDF generated successfully',
        pdfPath: publicPath,
        emailSent,
        emailError,
        templateData
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error generating utility sheet PDF:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate utility sheet PDF',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
