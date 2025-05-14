// CommonJS version for Vercel serverless functions
const fs = require('fs');
const path = require('path');

/**
 * Checks if the PDF template is accessible via various methods
 * Helper endpoint to diagnose template loading issues
 */
module.exports = async (req, res) => {
  // Verify Vercel authentication bypass secret
  const { authorization, bypass_secret } = req.headers;
  const secretFromHeader = authorization ? authorization.replace('Bearer ', '') : bypass_secret;
  const allowedSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

  if (!secretFromHeader || secretFromHeader !== allowedSecret) {
    console.error("Authorization failed: Invalid or missing secret");
    return res.status(401).json({ success: false, error: "Unauthorized access" });
  }

  try {
    console.log("Checking PDF template accessibility");
    const results = {
      success: false,
      paths: [],
      embeddedTemplate: false,
      templateUrl: false,
      accessibleMethods: []
    };

    // All possible paths to try
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'mergedTC.pdf'),
      path.join(__dirname, '..', 'public', 'mergedTC.pdf'),
      path.join(process.cwd(), 'api', 'public', 'mergedTC.pdf'),
      path.join(__dirname, 'public', 'mergedTC.pdf'),
      path.join(process.cwd(), '.next', 'server', 'pages', 'public', 'mergedTC.pdf'),
      path.join(process.cwd(), '.next', 'public', 'mergedTC.pdf')
    ];

    // Check each path
    for (const pathToCheck of possiblePaths) {
      try {
        if (fs.existsSync(pathToCheck)) {
          const stats = fs.statSync(pathToCheck);
          results.paths.push({
            path: pathToCheck,
            exists: true,
            size: stats.size,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory(),
            lastModified: stats.mtime
          });
          
          if (stats.isFile() && stats.size > 0) {
            results.accessibleMethods.push(`Filesystem: ${pathToCheck}`);
          }
        } else {
          results.paths.push({
            path: pathToCheck,
            exists: false
          });
        }
      } catch (error) {
        results.paths.push({
          path: pathToCheck,
          exists: false,
          error: error.message
        });
      }
    }

    // Check if embedded template is available
    if (process.env.PDF_TEMPLATE_BASE64) {
      const base64Length = process.env.PDF_TEMPLATE_BASE64.length;
      results.embeddedTemplate = {
        available: true,
        size: base64Length,
        sizeInBytes: Math.floor(base64Length * 0.75) // Approximate base64 to binary conversion
      };
      results.accessibleMethods.push('Embedded base64 template');
    } else {
      results.embeddedTemplate = {
        available: false
      };
    }

    // Check if template URL is available
    if (process.env.PDF_TEMPLATE_URL) {
      results.templateUrl = {
        available: true,
        url: process.env.PDF_TEMPLATE_URL
      };
      
      // Try to fetch the URL to verify it's accessible
      try {
        const fetch = require('node-fetch');
        const response = await fetch(process.env.PDF_TEMPLATE_URL, {
          method: 'HEAD', // Just check headers, don't download the full content
          timeout: 5000   // 5 second timeout
        });
        
        if (response.ok) {
          results.templateUrl.accessible = true;
          results.templateUrl.contentLength = response.headers.get('content-length');
          results.templateUrl.contentType = response.headers.get('content-type');
          results.accessibleMethods.push('URL template download');
        } else {
          results.templateUrl.accessible = false;
          results.templateUrl.statusCode = response.status;
          results.templateUrl.statusText = response.statusText;
        }
      } catch (fetchError) {
        results.templateUrl.accessible = false;
        results.templateUrl.error = fetchError.message;
      }
    } else {
      results.templateUrl = {
        available: false
      };
    }

    // Check if we have at least one accessible method
    results.success = results.accessibleMethods.length > 0;

    // Add environment context
    results.environment = {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      isVercel: !!process.env.VERCEL,
      cwd: process.cwd(),
      dirname: __dirname
    };

    return res.status(200).json(results);
  } catch (error) {
    console.error('Error checking PDF template:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error occurred'
    });
  }
};