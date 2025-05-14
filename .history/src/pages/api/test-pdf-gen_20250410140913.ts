import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Starting test PDF generation...');
    
    // Create a simple HTML template
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test PDF</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>Test PDF Generation</h1>
          <p>Generated at: ${new Date().toLocaleString()}</p>
          <p>This is a test PDF to verify the PDF generation functionality.</p>
        </body>
      </html>
    `;

    // Set up the output path
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');
    await fs.mkdir(outputDir, { recursive: true });
    
    const filename = `test-pdf-${Date.now()}.pdf`;
    const outputPath = path.join(outputDir, filename);
    
    console.log('Output path:', outputPath);

    // Launch browser and generate PDF
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      await page.pdf({
        path: outputPath,
        format: 'letter',
        printBackground: true,
        margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
      });

      // Verify the file was created
      const stats = await fs.stat(outputPath);
      
      return res.status(200).json({
        success: true,
        message: 'Test PDF generated successfully',
        file: {
          path: outputPath,
          size: stats.size,
          created: stats.birthtime
        }
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error generating test PDF:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate test PDF',
      error: error instanceof Error ? error.message : String(error)
    });
  }
} 