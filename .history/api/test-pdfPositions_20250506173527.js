// CommonJS test file for Vercel serverless functions
const fs = require('fs');
const path = require('path');

module.exports = async(req, res) => {
    try {
        console.log("Testing PDF positions module import");

        // First check if the file exists
        const cjsPath = path.join(process.cwd(), 'utils', 'pdfPositions.cjs');
        const jsPath = path.join(process.cwd(), 'utils', 'pdfPositions.js');

        const cjsExists = fs.existsSync(cjsPath);
        const jsExists = fs.existsSync(jsPath);

        console.log(`CJS file exists: ${cjsExists}, path: ${cjsPath}`);
        console.log(`JS file exists: ${jsExists}, path: ${jsPath}`);

        // Try to import the module
        let pdfPositions;
        let importError = null;

        try {
            pdfPositions = require('../utils/pdfPositions.cjs');
            console.log("Successfully imported pdfPositions.cjs");
        } catch (error) {
            console.error("Error importing pdfPositions.cjs:", error.message);
            importError = error.message;

            // Try the .js file as fallback
            try {
                pdfPositions = require('../utils/pdfPositions.js');
                console.log("Successfully imported pdfPositions.js as fallback");
                importError = null;
            } catch (jsError) {
                console.error("Error importing pdfPositions.js:", jsError.message);
                importError = `CJS Error: ${importError}, JS Error: ${jsError.message}`;
            }
        }

        return res.status(200).json({
            success: !!pdfPositions,
            cjsExists,
            jsExists,
            importError,
            moduleKeys: pdfPositions ? Object.keys(pdfPositions) : [],
            cwd: process.cwd(),
            dirname: __dirname
        });
    } catch (error) {
        console.error('Error in test API handler:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Unknown error occurred'
        });
    }
};