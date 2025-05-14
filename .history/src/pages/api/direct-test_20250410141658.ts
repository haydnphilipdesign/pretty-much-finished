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
    console.log('Starting direct PDF test...');
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');
    await fs.mkdir(outputDir, { recursive: true });
    
    const filename = `direct-test-${Date.now()}.pdf`;
    const outputPath = path.join(outputDir, filename);
    
    // Create a simple HTML template
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Direct Test PDF</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px; 
              max-width: 800px; 
              margin: 0 auto; 
            }
            h1 { color: #2c3e50; margin-bottom: 20px; }
            .info { margin: 20px 0; }
            .timestamp { color: #7f8c8d; }
            .section { 
              border: 1px solid #bdc3c7;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <h1>PA Real Estate Support Services</h1>
          <div class="section">
            <h2>Test PDF Generation</h2>
            <p class="timestamp">Generated on: ${new Date().toLocaleString()}</p>
            <p>This is a test PDF to verify the PDF generation functionality.</p>
          </div>
          <div class="section">
            <h2>System Information</h2>
            <ul>
              <li>Environment: ${process.env.NODE_ENV}</li>
              <li>Server Time: ${new Date().toISOString()}</li>
              <li>File Path: ${outputPath}</li>
            </ul>
          </div>
        </body>
      </html>
    `;

    // Launch browser and generate PDF
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      console.log('Creating PDF...');
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
      
      console.log('PDF generated successfully:', outputPath);
      
      return res.status(200).json({
        success: true,
        message: 'Test PDF generated successfully',
        file: {
          name: filename,
          path: `/generated-pdfs/${filename}`,
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