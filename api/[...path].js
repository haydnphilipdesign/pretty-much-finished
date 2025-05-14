// This is a catch-all handler for client-side routing
// It will redirect all non-API requests to the SPA

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Set proper headers to avoid MIME type issues
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Get the path from the request
  const requestPath = req.url || '/';
  
  // If this is an API request, don't handle it here
  if (requestPath.startsWith('/api/')) {
    return res.status(404).json({
      error: 'API endpoint not found',
      path: requestPath
    });
  }
  
  // Try to serve the index.html file from the build directory
  try {
    const indexPath = path.join(process.cwd(), 'build', 'index.html');
    
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(indexContent);
    } else {
      // If index.html doesn't exist, return a basic HTML response
      const htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>PA Real Estate Support Services</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
            }
            h1 {
              color: #333;
            }
            .message {
              color: #666;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <h1>PA Real Estate Support Services</h1>
          <p class="message">The application is loading...</p>
          <p>If the application doesn't load automatically, please try refreshing the page.</p>
          <p>Requested path: ${requestPath}</p>
        </body>
        </html>
      `;
      
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(htmlResponse);
    }
  } catch (error) {
    console.error('Error serving SPA:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
