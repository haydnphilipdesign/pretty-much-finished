/**
 * Utility script to generate a base64-encoded version of the PDF template
 * This can be used to set the PDF_TEMPLATE_BASE64 environment variable
 */
const fs = require('fs');
const path = require('path');

// Path to the PDF template
const templatePath = path.join(__dirname, '..', 'public', 'mergedTC.pdf');
const outputPath = path.join(__dirname, '..', 'pdf-template-base64.txt');

// Check if the template exists
if (!fs.existsSync(templatePath)) {
    console.error(`Error: Template file not found at ${templatePath}`);
    process.exit(1);
}

try {
    // Read the template file
    const templateData = fs.readFileSync(templatePath);
    console.log(`Read template file: ${templatePath} (${templateData.length} bytes)`);

    // Convert to base64
    const base64Data = templateData.toString('base64');
    console.log(`Converted to base64 (${base64Data.length} characters)`);

    // Write to output file
    fs.writeFileSync(outputPath, base64Data);
    console.log(`Base64 template written to: ${outputPath}`);

    // Instructions
    console.log('\nInstructions:');
    console.log('1. Copy the contents of the output file');
    console.log('2. Add it to your Vercel environment variables as PDF_TEMPLATE_BASE64');
    console.log('3. Deploy your application');

    // Display size considerations
    const kbSize = Math.round(base64Data.length / 1024);
    console.log(`\nNote: The base64 template is ${kbSize} KB in size.`);
    if (kbSize > 50) {
        console.log('Warning: This is quite large for an environment variable.');
        console.log('Consider using a smaller template or using the URL method instead.');
    }
} catch (error) {
    console.error('Error generating base64 template:', error);
    process.exit(1);
}