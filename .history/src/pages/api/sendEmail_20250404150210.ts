// API route for sending emails
import { NextApiRequest, NextApiResponse } from 'next';
import { EmailOptions } from '@/types/clientTypes';

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
    
    // Validate required parameters
    if (!options.to || !options.subject || !options.body) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: to, subject, and body are required',
      });
    }

    // Forward this request to our server API that handles the actual server-side operations
    // This keeps Node.js modules like nodemailer on the server
    const serverUrl = process.env.SERVER_API_URL || 'http://localhost:3001';
    
    const response = await fetch(`${serverUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in sendEmail API:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
} 