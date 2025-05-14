const path = require('path');
const fs = require('fs');

module.exports = async(req, res) => {
    try {
        // Try multiple possible paths for the templates
        const templateFileName = 'Seller.html';
        const possiblePaths = [
            // Build directory (for production)
            path.resolve(process.cwd(), 'build', 'templates', templateFileName),
            // Standard path for local development
            path.resolve(process.cwd(), 'public', 'templates', templateFileName),
            // Path for Vercel deployment
            path.resolve(process.cwd(), 'templates', templateFileName),
            // Absolute path from project root
            path.join(process.cwd(), 'public', 'templates', templateFileName),
            // Relative path
            path.join('./public/templates', templateFileName),
            // Direct path
            `./public/templates/${templateFileName}`,
            // Build directory relative path
            path.join('./build/templates', templateFileName)
        ];

        // Try each path and report results
        const results = [];
        for (const possiblePath of possiblePaths) {
            const exists = fs.existsSync(possiblePath);
            results.push({
                path: possiblePath,
                exists,
                size: exists ? fs.statSync(possiblePath).size : null
            });
        }

        // List all files in the current directory and public directory
        const currentDirFiles = fs.readdirSync(process.cwd());
        let publicDirFiles = [];
        const publicPath = path.join(process.cwd(), 'public');
        if (fs.existsSync(publicPath)) {
            publicDirFiles = fs.readdirSync(publicPath);
        }

        // Check if templates directory exists in public
        let templatesDir = [];
        const templatesPath = path.join(process.cwd(), 'public', 'templates');
        if (fs.existsSync(templatesPath)) {
            templatesDir = fs.readdirSync(templatesPath);
        }

        return res.status(200).json({
            cwd: process.cwd(),
            templateResults: results,
            currentDirFiles,
            publicDirFiles,
            templatesDir
        });
    } catch (error) {
        console.error('Error testing templates:', error);
        return res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
};