// API route for sending emails
import { NextApiRequest, NextApiResponse } from 'next';
import { EmailOptions } from '@/types/clientTypes';
import https from 'https';
import http from 'http';

// This is a server-side API endpoint that will run on the server
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    // Get the options from the request body
    const options = req.body as EmailOptions;
    console.log('Email request received:', JSON.stringify({
      to: options.to,
      subject: options.subject,
      attachmentsCount: options.attachments?.length || 0
    }, null, 2));
    
    // Validate required parameters
    if (!options.to || !options.subject || !options.body) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: to, subject, and body are required',
      });
    }

    // Get the host from the request
    const host = req.headers.host || '';
    const protocol = host.includes('localhost') ? 'http:' : 'https:';
    
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
      serverReq.write(JSON.stringify(options));
      serverReq.end();
    });

    // Process the server response
    console.log('Server API response:', JSON.stringify({
      status: serverResponse.statusCode,
      success: serverResponse.data.success,
      message: serverResponse.data.message
    }, null, 2));

    if (serverResponse.statusCode !== 200) {
      console.error('Error response from server API:', serverResponse.data);
      throw new Error(serverResponse.data.message || 'Failed to send email');
    }

    return res.status(200).json(serverResponse.data);
  } catch (error) {
    console.error('Error in sendEmail API:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
} 