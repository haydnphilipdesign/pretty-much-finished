// Test API for email sending
import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import http from 'http';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Test email request received');
    
    // Get the host from the request
    const host = req.headers.host || '';
    const protocol = host.includes('localhost') ? 'http:' : 'https:';
    
    // Send a test email through the server API
    const testEmailData = {
      to: 'debbie@parealestatesupport.com',
      subject: 'Test Email from PA Real Estate Support Services',
      body: `
        <h2>Test Email</h2>
        <p>This is a test email sent at ${new Date().toLocaleString()}</p>
        <p>If you're receiving this, the email system is working correctly.</p>
      `,
      attachments: []
    };
    
    console.log(`Making direct server request to ${protocol}//${host}/api/server-send-email`);

    // Create a promise to handle the HTTP request
    const serverResponse = await new Promise<{ statusCode: number; data: any }>((resolve, reject) => {
      // Prepare the request options
      const requestOptions = {
        hostname: host.split(':')[0],
        port: host.includes('localhost') ? host.split(':')[1] || '3000' : (protocol === 'https:' ? 443 : 80),
        path: '/api/server-send-email',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      // Choose the appropriate module based on protocol
      const requester = protocol === 'https:' ? https : http;
      
      // Make the request
      const serverReq = requester.request(requestOptions, (response) => {
        let data = '';
        
        // Collect response data
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        // Process complete response
        response.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            resolve({ 
              statusCode: response.statusCode || 500,
              data: parsedData 
            });
          } catch (error) {
            reject(new Error(`Failed to parse server response: ${error}`));
          }
        });
      });
      
      // Handle request errors
      serverReq.on('error', (error) => {
        console.error('Error making server request:', error);
        reject(error);
      });
      
      // Send the request with data
      serverReq.write(JSON.stringify(testEmailData));
      serverReq.end();
    });

    // Return detailed debugging information
    return res.status(200).json({
      success: true,
      message: 'Test email request processed',
      serverResponse: {
        statusCode: serverResponse.statusCode,
        responseData: serverResponse.data
      },
      requestDetails: {
        host,
        protocol,
        endpoint: '/api/server-send-email'
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasEmailConfig: Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD)
      }
    });
  } catch (error) {
    console.error('Error in test-email API:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
} 