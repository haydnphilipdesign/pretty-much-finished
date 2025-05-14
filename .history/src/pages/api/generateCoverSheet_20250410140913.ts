// Since this API route is used by Next.js, not by client-side Vite code,
// we can import server modules here without issues
import { NextApiRequest, NextApiResponse } from 'next';
import { CoverSheetOptions, CoverSheetResponse } from '@/types/clientTypes';
import { validateCoverSheetData } from '@/utils/validationUtils';
import { processCoverSheetData } from '@/utils/templateUtils';
import puppeteer, { Browser } from 'puppeteer';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs/promises';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry wrapper for async functions
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        await sleep(delay * Math.pow(2, i)); // Exponential backoff
      }
    }
  }
  
  throw lastError;
}

/**
 * Generate PDF from template
 */
async function generatePdf(
  templateContent: string,
  outputPath: string
): Promise<void> {
  let browser: Browser | null = null;
  
  console.log('Starting PDF generation...');
  console.log('Output path:', outputPath);
  
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('Browser launched successfully');

    console.log('Creating new page...');
    const page = await browser.newPage();
    console.log('Page created successfully');

    console.log('Setting page content...');
    await page.setContent(templateContent, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    console.log('Page content set successfully');

    console.log('Generating PDF...');
    await page.pdf({
      path: outputPath,
      format: 'letter',
      printBackground: true,
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
    });
    console.log('PDF generated successfully');

    // Verify the file was created
    try {
      await fs.access(outputPath);
      const stats = await fs.stat(outputPath);
      console.log('PDF file created successfully:', {
        path: outputPath,
        size: stats.size + ' bytes',
        created: stats.birthtime
      });
    } catch (error) {
      console.error('Failed to verify PDF file:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw error;
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
      console.log('Browser closed successfully');
    }
  }
}

/**
 * Send email with PDF attachment
 */
async function sendEmail(
  emailConfig: any,
  templateData: any,
  agentRole: string,
  pdfPath: string,
  filename: string
): Promise<{ sent: boolean; error?: string; messageId?: string }> {
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
      filename,
      path: pdfPath
    }]
  });

  return { sent: true, messageId: info.messageId };
}

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
    let templateData = data ? processCoverSheetData(data, agentRole) : null;
    
    // If we don't have direct data, fetch from Airtable
    if (!templateData) {
      console.log('No direct data provided, fetching from Airtable...');
      const record = await withRetry(async () => {
        const response = await fetch(
          `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${tableId}/${recordId}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`Airtable API error: ${response.status}`);
        }
        
        return response.json();
      });

      if (!record || record.error) {
        throw new Error(`Failed to fetch Airtable record: ${record.error?.message || 'Unknown error'}`);
      }

      templateData = processCoverSheetData(record, agentRole);
    }

    if (!templateData) {
      throw new Error('Failed to process template data');
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
    Object.entries(templateData as unknown as Record<string, unknown>).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      templateContent = templateContent.replace(regex, value?.toString() || '');
    });

    // Generate PDF with retry
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${templateName}_${recordId}_${timestamp}.pdf`;
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');
    
    // Ensure the output directory exists with proper permissions
    try {
      await fs.access(outputDir).catch(async () => {
        console.log('Creating PDF output directory:', outputDir);
        await fs.mkdir(outputDir, { recursive: true, mode: 0o755 });
      });
      
      // Verify we can write to the directory
      const testFile = path.join(outputDir, '.test-write');
      await fs.writeFile(testFile, 'test').catch(error => {
        console.error('Cannot write to PDF directory:', error);
        throw new Error(`Cannot write to PDF directory: ${error.message}`);
      });
      await fs.unlink(testFile);
      
      console.log('PDF directory is ready:', outputDir);
    } catch (error) {
      console.error('Error preparing PDF directory:', error);
      throw error;
    }
    
    const pdfPath = path.join(outputDir, filename);
    console.log('Will generate PDF at:', pdfPath);

    await withRetry(() => generatePdf(templateContent, pdfPath));
    console.log('PDF generated successfully at:', pdfPath);

    // Send email if requested
    let emailResult = { sent: false, error: undefined as string | undefined };
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

        console.log('Attempting to send email with config:', {
          host: emailConfig.host,
          port: emailConfig.port,
          secure: emailConfig.secure,
          hasUser: !!emailConfig.auth.user,
          hasPass: !!emailConfig.auth.pass,
          pdfPath,
          filename
        });

        // Verify the PDF file exists before trying to send
        try {
          await fs.access(pdfPath);
          console.log('PDF file exists at:', pdfPath);
        } catch (error) {
          console.error('PDF file not found at:', pdfPath);
          throw new Error(`PDF file not found at: ${pdfPath}`);
        }

        // Verify email configuration
        if (!emailConfig.auth.user || !emailConfig.auth.pass) {
          throw new Error('Email configuration is incomplete - missing credentials');
        }

        emailResult = await withRetry(() => 
          sendEmail(emailConfig, templateData, agentRole, pdfPath, filename)
        );

        console.log('Email sent successfully:', emailResult);
      } catch (error) {
        console.error('Error sending email:', error);
        emailResult.error = error instanceof Error ? error.message : String(error);
        // Add the error to the response for better debugging
        return res.status(500).json({
          success: false,
          message: 'Failed to send email',
          error: emailResult.error,
          pdfGenerated: true,
          pdfPath
        });
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