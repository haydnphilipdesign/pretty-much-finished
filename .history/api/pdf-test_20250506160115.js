// Simple test function to check serverless environment
const fetch = require('node-fetch');

module.exports = async(req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');

        // Check if we can access the process environment
        const nodeEnv = process.env.NODE_ENV || 'unknown';
        const vercelEnv = process.env.VERCEL_ENV || 'unknown';

        // Supabase URL to test
        const supabaseUrl = 'https://rkqoexexgrmeevzffouq.supabase.co/storage/v1/object/public/transaction-documents//mergedTC.pdf';
        let supabaseSuccess = false;
        let supabaseData = null;

        // Try to fetch from Supabase
        try {
            console.log("Testing Supabase URL fetch from:", supabaseUrl);
            const response = await fetch(supabaseUrl);

            if (response.ok) {
                // Just get the size and status - don't download full file
                const contentLength = response.headers.get('content-length');
                supabaseSuccess = true;
                supabaseData = {
                    status: response.status,
                    contentType: response.headers.get('content-type'),
                    size: contentLength ? parseInt(contentLength) : 'unknown',
                };
            } else {
                supabaseData = {
                    status: response.status,
                    statusText: response.statusText,
                    error: await response.text().slice(0, 200) // Get first 200 chars of error
                };
            }
        } catch (fetchError) {
            supabaseData = {
                error: fetchError.message
            };
        }

        // Try to check if the PDF template exists locally too
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
            supabase: {
                url: supabaseUrl,
                success: supabaseSuccess,
                data: supabaseData
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