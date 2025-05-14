import puppeteer from 'puppeteer';
import path from 'path';
import { promises as fs } from 'fs';

async function testPdfGeneration() {
    try {
        console.log('Starting PDF generation test...');

        // Sample HTML content
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test PDF</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #2c3e50; text-align: center; }
          .info { margin-bottom: 20px; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Test PDF Generation</h1>
        <div class="info">
          <div class="field"><span class="label">Date:</span> ${new Date().toLocaleString()}</div>
          <div class="field"><span class="label">Test:</span> Puppeteer PDF Generation</div>
        </div>
        <p>This is a test PDF generated using Puppeteer.</p>
      </body>
      </html>
    `;

        // Create output directory if it doesn't exist
        const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');
        await fs.mkdir(outputDir, { recursive: true });

        // Generate unique filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const outputFilename = `Simple_Test_${timestamp}.pdf`;
        const outputPath = path.join(outputDir, outputFilename);

        console.log(`Output path: ${outputPath}`);

        // Launch a headless browser
        console.log('Launching browser...');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            // Create a new page
            console.log('Creating page...');
            const page = await browser.newPage();

            // Set content to the HTML
            console.log('Setting content...');
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

            // Generate PDF
            console.log('Generating PDF...');
            await page.pdf({
                path: outputPath,
                format: 'letter',
                printBackground: true,
                margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
            });

            console.log(`PDF generated successfully: ${outputPath}`);

            // Verify the file was created
            const stats = await fs.stat(outputPath);
            console.log(`File size: ${stats.size} bytes`);

            return {
                success: true,
                message: 'PDF generated successfully',
                path: outputPath,
                size: stats.size
            };
        } finally {
            await browser.close();
            console.log('Browser closed');
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        return {
            success: false,
            message: 'Failed to generate PDF',
            error: error.message
        };
    }
}

// Run the test
testPdfGeneration()
    .then(result => {
        console.log('Test result:', result);
        process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
        console.error('Test failed:', error);
        process.exit(1);
    });