/**
 * Server-side logging API endpoint
 * This endpoint receives logs from the client and stores them
 */
const fs = require('fs');
const path = require('path');

/**
 * Ensure log directory exists
 * @param {string} dirPath Directory path
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
    } catch (err) {
      console.error(`Error creating directory ${dirPath}:`, err);
    }
  }
}

/**
 * Write log to file
 * @param {Object} log Log entry
 */
function writeLogToFile(log) {
  try {
    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs');
    ensureDirectoryExists(logsDir);

    // Create a dated log file
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `app-${today}.log`);

    // Format the log entry
    const formattedLog = `[${log.timestamp}] [${log.level}] [${log.context}] ${log.message}\n`;

    // Append to log file
    fs.appendFileSync(logFile, formattedLog, 'utf8');

    // If there's additional data, write it as JSON
    if (log.data) {
      try {
        const dataString = typeof log.data === 'string' 
          ? log.data 
          : JSON.stringify(log.data, null, 2);
        fs.appendFileSync(logFile, `${dataString}\n\n`, 'utf8');
      } catch (jsonError) {
        fs.appendFileSync(logFile, `[Error serializing data: ${jsonError.message}]\n\n`, 'utf8');
      }
    }
  } catch (error) {
    console.error('Error writing log to file:', error);
  }
}

/**
 * API handler for logging
 */
module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get log data from request
    const logEntry = req.body;

    // Validate log data
    if (!logEntry || !logEntry.level || !logEntry.message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid log data. Required fields: level, message' 
      });
    }

    // Add timestamp if missing
    if (!logEntry.timestamp) {
      logEntry.timestamp = new Date().toISOString();
    }

    // Add context if missing
    if (!logEntry.context) {
      logEntry.context = 'UNKNOWN';
    }

    // Write log to console
    const consoleMessage = `[${logEntry.timestamp}] [${logEntry.level}] [${logEntry.context}] ${logEntry.message}`;
    
    switch (logEntry.level) {
      case 'DEBUG':
        console.debug(consoleMessage, logEntry.data);
        break;
      case 'INFO':
        console.info(consoleMessage, logEntry.data);
        break;
      case 'WARN':
        console.warn(consoleMessage, logEntry.data);
        break;
      case 'ERROR':
      case 'FATAL':
        console.error(consoleMessage, logEntry.data);
        break;
      default:
        console.log(consoleMessage, logEntry.data);
    }

    // Write log to file
    writeLogToFile(logEntry);

    // Return success
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing log:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error processing log: ' + (error.message || 'Unknown error') 
    });
  }
};