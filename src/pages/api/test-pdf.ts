// Test API for PDF generation
import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import http from 'http';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Test PDF generation request received');
    
    // Get the host from the request
    const host = req.headers.host || '';
    const protocol = host.includes('localhost') ? 'http:' : 'https:';
    
    // Create test options for generating a PDF
    const testOptions = {
      tableId: 'tblHyCJCpQSgjn0md', // Transactions table ID
      recordId: req.query.recordId || 'recMPGaC2BfFToCHr', // Use provided ID or fallback to a test ID
      agentRole: 'DUAL AGENT',
      sendEmail: true
    };
    
    console.log(`Making direct server request to ${protocol}//${host}/api/server-cover-sheet`);
    console.log('Test options:', JSON.stringify(testOptions, null, 2));

    // Create a promise to handle the HTTP request
    const serverResponse = await new Promise<{ statusCode: number; data: any }>((resolve, reject) => {
      // Prepare the request options
      const requestOptions = {
        hostname: host.split(':')[0],
        port: host.includes('localhost') ? host.split(':')[1] || '3000' : (protocol === 'https:' ? 443 : 80),
        path: '/api/server-cover-sheet',
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
      serverReq.write(JSON.stringify(testOptions));
      serverReq.end();
    });

    // Return detailed debugging information
    return res.status(200).json({
      success: true,
      message: 'Test PDF generation request processed',
      serverResponse: {
        statusCode: serverResponse.statusCode,
        responseData: serverResponse.data
      },
      requestDetails: {
        host,
        protocol,
        endpoint: '/api/server-cover-sheet'
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasAirtableConfig: Boolean(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID),
        hasEmailConfig: Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD)
      }
    });
  } catch (error) {
    console.error('Error in test-pdf API:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
} 