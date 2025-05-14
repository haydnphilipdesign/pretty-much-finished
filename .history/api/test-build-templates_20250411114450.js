const path = require('path');
const fs = require('fs');

module.exports = async (req, res) => {
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
      let fileContent = null;
      let fileSize = null;
      
      if (exists) {
        const stats = fs.statSync(possiblePath);
        fileSize = stats.size;
        // Only read the first 100 characters to avoid large responses
        if (fileSize > 0) {
          const buffer = Buffer.alloc(Math.min(100, fileSize));
          const fd = fs.openSync(possiblePath, 'r');
          fs.readSync(fd, buffer, 0, buffer.length, 0);
          fs.closeSync(fd);
          fileContent = buffer.toString('utf8') + (fileSize > 100 ? '...' : '');
        }
      }
      
      results.push({
        path: possiblePath,
        exists,
        size: fileSize,
        preview: fileContent
      });
    }

    // List all files in the current directory and build directory
    const currentDirFiles = fs.readdirSync(process.cwd());
    let buildDirFiles = [];
    const buildPath = path.join(process.cwd(), 'build');
    if (fs.existsSync(buildPath)) {
      buildDirFiles = fs.readdirSync(buildPath);
    }

    // Check if templates directory exists in build
    let templatesDir = [];
    const templatesPath = path.join(process.cwd(), 'build', 'templates');
    if (fs.existsSync(templatesPath)) {
      templatesDir = fs.readdirSync(templatesPath);
    }

    return res.status(200).json({
      cwd: process.cwd(),
      templateResults: results,
      currentDirFiles,
      buildDirFiles,
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
