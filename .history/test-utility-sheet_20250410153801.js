import puppeteer from 'puppeteer';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

async function testUtilitySheetPdf() {
    try {
        console.log('Starting utility sheet PDF generation test...');
        console.log('Current directory:', process.cwd());

        // Template path
        const templatePath = path.join(__dirname, 'public', 'connect', 'utility_sheet.html');
        console.log(`Template path: ${templatePath}`);

        // Read the template file
        let templateHtml;
        try {
            templateHtml = await fs.readFile(templatePath, 'utf-8');
            console.log('Template file read successfully');
        } catch (error) {
            console.error('Error reading template file:', error);
            throw error;
        }

        // Create output directory if it doesn't exist
        const outputDir = path.join(__dirname, 'public', 'generated-pdfs');
        await fs.mkdir(outputDir, { recursive: true });

        // Generate unique filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const outputFilename = `Utility_Sheet_Test_${timestamp}.pdf`;
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
            await page.setContent(templateHtml, { waitUntil: 'networkidle0' });

            // Generate PDF
            console.log('Generating PDF...');
            await page.pdf({
                path: outputPath,
                format: 'letter',
                printBackground: true,
                margin: { top: '0.25in', right: '0.25in', bottom: '0.25in', left: '0.25in' },
                landscape: true
            });

            console.log(`PDF generated successfully: ${outputPath}`);

            // Verify the file was created
            const stats = await fs.stat(outputPath);
            console.log(`File size: ${stats.size} bytes`);

            return {
                success: true,
                message: 'Utility sheet PDF generated successfully',
                path: outputPath,
                size: stats.size
            };
        } finally {
            await browser.close();
            console.log('Browser closed');
        }
    } catch (error) {
        console.error('Error generating utility sheet PDF:', error);
        return {
            success: false,
            message: 'Failed to generate utility sheet PDF',
            error: error.message
        };
    }
}

// Run the test
testUtilitySheetPdf()
    .then(result => {
        console.log('Test result:', result);
        process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
        console.error('Test failed:', error);
        process.exit(1);
    });