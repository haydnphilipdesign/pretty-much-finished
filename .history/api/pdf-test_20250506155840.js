// Simple test function to check serverless environment
module.exports = async(req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');

        // Check if we can access the process environment
        const nodeEnv = process.env.NODE_ENV || 'unknown';
        const vercelEnv = process.env.VERCEL_ENV || 'unknown';

        // Try to check if the PDF template exists
        const templatePath = path.join(process.cwd(), 'public', 'mergedTC.pdf');
        let templateExists = false;
        let templateSize = 0;

        try {
            const stats = fs.statSync(templatePath);
            templateExists = true;
            templateSize = stats.size;
        } catch (fileError) {
            // Template doesn't exist or can't be accessed
        }

        // Return diagnostic information
        res.status(200).json({
            success: true,
            environment: {
                nodeEnv,
                vercelEnv,
                platform: process.platform,
                nodeVersion: process.version,
                cwd: process.cwd(),
                memoryUsage: process.memoryUsage(),
            },
            template: {
                path: templatePath,
                exists: templateExists,
                size: templateSize
            }
        });
    } catch (error) {
        console.error('PDF Test Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
};