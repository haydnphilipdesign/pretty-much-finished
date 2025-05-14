/**
 * Health check API endpoint
 * Returns the status of various system components
 */
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

/**
 * Check if the PDF template is accessible
 * @returns {Promise<{success: boolean, paths: Array<Object>, error?: string}>}
 */
async function checkPdfTemplate() {
  try {
    // All possible paths to try
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'mergedTC.pdf'),
      path.join(__dirname, '..', 'public', 'mergedTC.pdf'),
      path.join(process.cwd(), 'api', 'public', 'mergedTC.pdf'),
      path.join(__dirname, 'public', 'mergedTC.pdf'),
      path.join(process.cwd(), '.next', 'server', 'pages', 'public', 'mergedTC.pdf'),
      path.join(process.cwd(), '.next', 'public', 'mergedTC.pdf')
    ];

    // Results for each path
    const pathResults = [];
    let foundTemplate = false;

    // Check each path
    for (const pathToCheck of possiblePaths) {
      try {
        if (fs.existsSync(pathToCheck)) {
          const stats = fs.statSync(pathToCheck);
          pathResults.push({
            path: pathToCheck,
            exists: true,
            size: stats.size,
            isFile: stats.isFile(),
            lastModified: stats.mtime
          });
          
          if (stats.isFile() && stats.size > 0) {
            foundTemplate = true;
          }
        } else {
          pathResults.push({
            path: pathToCheck,
            exists: false
          });
        }
      } catch (error) {
        pathResults.push({
          path: pathToCheck,
          exists: false,
          error: error.message
        });
      }
    }

    // Check environment variables for alternative sources
    const hasUrlTemplate = !!process.env.PDF_TEMPLATE_URL;
    const hasBase64Template = !!process.env.PDF_TEMPLATE_BASE64;

    return {
      success: foundTemplate || hasUrlTemplate || hasBase64Template,
      paths: pathResults,
      hasUrlTemplate,
      hasBase64Template
    };
  } catch (error) {
    console.error('Error checking PDF template:', error);
    return {
      success: false,
      paths: [],
      error: error.message
    };
  }
}

/**
 * Check if email service is configured properly
 * @returns {Promise<{success: boolean, providers: Array<Object>, error?: string}>}
 */
async function checkEmailConfiguration() {
  try {
    // Check for required environment variables for nodemailer
    const requiredNodemailerVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD'];
    const missingNodemailerVars = requiredNodemailerVars.filter(name => !process.env[name]);
    const nodemailerConfigured = missingNodemailerVars.length === 0;
    
    // Check for Resend API key
    const resendConfigured = !!process.env.RESEND_API_KEY;
    
    // Results for each provider
    const providers = [
      {
        name: 'nodemailer',
        configured: nodemailerConfigured,
        details: nodemailerConfigured ? {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER ? '[PROVIDED]' : '[MISSING]',
            pass: process.env.EMAIL_PASSWORD ? '[PROVIDED]' : '[MISSING]'
          }
        } : {
          missingVariables: missingNodemailerVars
        }
      },
      {
        name: 'resend',
        configured: resendConfigured,
        details: {
          apiKey: resendConfigured ? '[PROVIDED]' : '[MISSING]'
        }
      }
    ];
    
    // Overall email configuration status
    return {
      success: nodemailerConfigured || resendConfigured,
      providers: providers,
      primaryProvider: nodemailerConfigured ? 'nodemailer' : (resendConfigured ? 'resend' : 'none')
    };
  } catch (error) {
    console.error('Error checking email configuration:', error);
    return {
      success: false,
      providers: [],
      error: error.message
    };
  }
}

/**
 * Check if API authentication is configured
 * @returns {{success: boolean, details: Object, error?: string}}
 */
function checkApiAuthentication() {
  try {
    const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    return {
      success: !!bypassSecret,
      details: {
        hasSecret: !!bypassSecret
      }
    };
  } catch (error) {
    console.error('Error checking API authentication:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check all system components
 * @returns {Promise<Object>} Status of all components
 */
async function checkAllComponents() {
  const templateStatus = await checkPdfTemplate();
  const emailStatus = await checkEmailConfiguration();
  const authStatus = checkApiAuthentication();
  
  return {
    success: templateStatus.success && emailStatus.success && authStatus.success,
    components: {
      pdfTemplate: templateStatus,
      emailService: emailStatus,
      apiAuthentication: authStatus
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    }
  };
}

/**
 * API handler for health check
 */
module.exports = async (req, res) => {
  try {
    // Get health status
    const status = await checkAllComponents();
    
    // Return health status
    return res.status(status.success ? 200 : 503).json({
      ...status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in health check:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error occurred'
    });
  }
};