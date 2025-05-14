import puppeteer from 'puppeteer';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateUtilityPdf() {
  console.log('Starting utility PDF generation...');
  
  try {
    // Define paths
    const utilitySheetPath = path.join(__dirname, 'public', 'connect', 'utility_sheet.html');
    const outputDir = path.join(__dirname, 'public', 'generated-pdfs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = path.join(outputDir, `Utility_Sheet_${timestamp}.pdf`);
    
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
      
      return { success: true, path: outputPath };
    } finally {
      await browser.close();
      console.log('Browser closed');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error.message };
  }
}

// Run the function
generateUtilityPdf()
  .then(result => {
    console.log('Result:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
