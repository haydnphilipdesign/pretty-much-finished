// Since this API route is used by Next.js, not by client-side Vite code,
// we can import server modules here without issues
import { NextApiRequest, NextApiResponse } from 'next';
import { CoverSheetOptions, CoverSheetResponse } from '@/types/clientTypes';
import { validateCoverSheetData } from '@/utils/validationUtils';
import { processCoverSheetData } from '@/utils/templateUtils';
import puppeteer from 'puppeteer';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs/promises';

// Point this to the server-side implementation
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// This is a server-side API endpoint that will run on the server
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CoverSheetResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { data, role } = req.body;
    console.log('Processing cover sheet request:', { role, data });

    // Validate the data
    const validationResult = validateCoverSheetData(data, role);
    if (!validationResult.isValid) {
      console.log('Validation failed:', validationResult.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        validationErrors: validationResult.errors
      });
    }

    // Process the data for the template
    const processedData = processCoverSheetData(data, role);

    // Map role to template name
    const getTemplateName = (role: string) => {
      const normalizedRole = role.toUpperCase().replace(/[^A-Z]/g, '');
      console.log(`Normalized role: ${normalizedRole}`);
      
      if (normalizedRole.includes('BUYER')) {
        console.log('Mapped to Buyer template');
        return 'Buyer';
      }
      if (normalizedRole.includes('LISTING') || normalizedRole.includes('SELLER')) {
        console.log('Mapped to Seller template');
        return 'Seller';
      }
      if (normalizedRole.includes('DUAL')) {
        console.log('Mapped to DualAgent template');
        return 'DualAgent';
      }
      
      console.error(`Invalid role provided: ${role} (normalized: ${normalizedRole})`);
      throw new Error(`Invalid role: ${role}. Must be one of: Buyer's Agent, Listing/Seller Agent, or Dual Agent`);
    };

    // Get template content
    const templateName = getTemplateName(role);
    const templatePath = path.join(process.cwd(), 'public', 'templates', `${templateName}.html`);
    console.log('Loading template from:', templatePath);
    
    let templateContent: string;
    try {
      // Check if template exists first
      await fs.access(templatePath);
      templateContent = await fs.readFile(templatePath, 'utf-8');
      console.log(`Template '${templateName}' loaded successfully`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error loading template:', {
        templateName,
        templatePath,
        error: errorMessage
      });
      
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new Error(`Template file not found for role ${role}. Please ensure template '${templateName}.html' exists in the templates directory.`);
      }
      
      throw new Error(`Failed to load template for role ${role}: ${errorMessage}`);
    }

    // Replace placeholders with actual data
    console.log('Processing template with data:', processedData);
    Object.entries(processedData).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      templateContent = templateContent.replace(regex, value?.toString() || '');
    });

    // Generate PDF
    console.log('Generating PDF...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(templateContent);

    const pdfBuffer = await page.pdf({
      format: 'letter',
      printBackground: true,
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
    });

    await browser.close();
    console.log('PDF generated successfully');

    // Configure email
    const emailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    };

    console.log('Email configuration:', {
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      hasUser: !!emailConfig.auth.user,
      hasPass: !!emailConfig.auth.pass
    });

    // Send email if configuration is valid
    if (emailConfig.auth.user && emailConfig.auth.pass) {
      const transporter = nodemailer.createTransport(emailConfig);
      
      // Verify connection
      await transporter.verify();

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@parealestatesupport.com',
        to: data.clientEmail || process.env.EMAIL_RECIPIENT,
        subject: `Real Estate Transaction Cover Sheet - ${new Date().toLocaleString()}`,
        html: `
          <h2>Real Estate Transaction Cover Sheet</h2>
          <p>Please find attached the cover sheet for your real estate transaction.</p>
          <h3>Transaction Details:</h3>
          <ul>
            <li>Property: ${data.propertyAddress || 'N/A'}</li>
            <li>Role: ${role}</li>
            <li>Client: ${data.clientName || 'N/A'}</li>
            <li>Date: ${new Date().toLocaleDateString()}</li>
          </ul>
        `,
        attachments: [{
          filename: `${role}_CoverSheet_${Date.now()}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }]
      });

      console.log('Email sent successfully:', info.messageId);

      return res.status(200).json({
        success: true,
        message: 'Cover sheet generated and email sent successfully',
        emailSent: true,
        emailMessageId: info.messageId
      });
    } else {
      console.warn('Email configuration missing - skipping email send');
      return res.status(200).json({
        success: true,
        message: 'Cover sheet generated successfully but email configuration is missing',
        emailSent: false
      });
    }
  } catch (error) {
    console.error('Error in generateCoverSheet:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      error: error instanceof Error ? error.stack : undefined
    });
  }
} 