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
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { tableId, recordId, agentRole = 'DUAL AGENT', sendEmail = true, data } = req.body;
    console.log('Processing cover sheet request:', { tableId, recordId, agentRole, sendEmail });

    // Validate required parameters
    if (!tableId || !recordId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: tableId and recordId'
      });
    }

    // Process the data for template
    const templateData = data ? processCoverSheetData(data, agentRole) : null;
    
    // If we don't have direct data, fetch from Airtable
    if (!templateData) {
      console.log('No direct data provided, fetching from Airtable...');
      const record = await fetch(
        `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${tableId}/${recordId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      ).then(response => response.json());

      if (!record || record.error) {
        throw new Error(`Failed to fetch Airtable record: ${record.error?.message || 'Unknown error'}`);
      }
    }

    // Validate the data
    const validationResult = validateCoverSheetData(templateData, agentRole);
    if (!validationResult.isValid) {
      console.log('Validation failed:', validationResult.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        validationErrors: validationResult.errors
      });
    }

    // Map role to template name
    const getTemplateName = (role: string) => {
      const normalizedRole = role.toUpperCase().replace(/[^A-Z]/g, '');
      if (normalizedRole.includes('BUYER')) return 'Buyer';
      if (normalizedRole.includes('LISTING') || normalizedRole.includes('SELLER')) return 'Seller';
      if (normalizedRole.includes('DUAL')) return 'DualAgent';
      throw new Error(`Invalid role: ${role}`);
    };

    // Get template content
    const templateName = getTemplateName(agentRole);
    const templatePath = path.join(process.cwd(), 'public', 'templates', `${templateName}.html`);
    console.log('Loading template from:', templatePath);
    
    let templateContent: string;
    try {
      templateContent = await fs.readFile(templatePath, 'utf-8');
      console.log('Template loaded successfully');
    } catch (error) {
      console.error('Error loading template:', error);
      throw new Error(`Failed to load template for role ${agentRole}`);
    }

    // Replace placeholders with actual data
    console.log('Processing template with data:', templateData);
    Object.entries(templateData).forEach(([key, value]) => {
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

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${templateName}_${recordId}_${timestamp}.pdf`;
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');
    await fs.mkdir(outputDir, { recursive: true });
    const pdfPath = path.join(outputDir, filename);

    await page.pdf({
      path: pdfPath,
      format: 'letter',
      printBackground: true,
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
    });

    await browser.close();
    console.log('PDF generated successfully at:', pdfPath);

    // Send email if requested
    let emailResult = { sent: false, error: null };
    if (sendEmail) {
      try {
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

        if (!emailConfig.auth.user || !emailConfig.auth.pass) {
          throw new Error('Email configuration is incomplete');
        }

        const transporter = nodemailer.createTransport(emailConfig);
        await transporter.verify();

        const info = await transporter.sendMail({
          from: process.env.EMAIL_FROM || 'noreply@parealestatesupport.com',
          to: process.env.EMAIL_RECIPIENT || 'debbie@parealestatesupport.com',
          subject: `Cover Sheet - ${templateData.propertyAddress} (${agentRole})`,
          html: `
            <h2>Cover Sheet Generated</h2>
            <p>A new cover sheet has been generated for:</p>
            <ul>
              <li><strong>Property:</strong> ${templateData.propertyAddress}</li>
              <li><strong>MLS#:</strong> ${templateData.mlsNumber}</li>
              <li><strong>Agent:</strong> ${templateData.agentName}</li>
              <li><strong>Role:</strong> ${agentRole}</li>
              <li><strong>Generated:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            ${templateData.urgentIssues ? '<p><strong>⚠️ URGENT ISSUES NOTED</strong></p>' : ''}
            ${templateData.specialInstructions ? `<p><strong>Special Instructions:</strong> ${templateData.specialInstructions}</p>` : ''}
          `,
          attachments: [{
            filename: filename,
            path: pdfPath
          }]
        });

        emailResult = { sent: true, messageId: info.messageId };
        console.log('Email sent successfully:', info.messageId);
      } catch (error) {
        console.error('Error sending email:', error);
        emailResult.error = error instanceof Error ? error.message : String(error);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Cover sheet generated successfully',
      filename,
      path: pdfPath,
      emailSent: emailResult.sent,
      emailError: emailResult.error
    });
  } catch (error) {
    console.error('Error in generateCoverSheet:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      error: error instanceof Error ? error.stack : undefined
    });
  }
} 