// Since this API route is used by Next.js, not by client-side Vite code,
// we can import server modules here without issues
import { NextApiRequest, NextApiResponse } from 'next';
import { CoverSheetOptions, CoverSheetResponse } from '@/types/clientTypes';

// Point this to the server-side implementation
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// This is a server-side API endpoint that will run on the server
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CoverSheetResponse>
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
    const options = req.body as CoverSheetOptions;
    console.log('Cover sheet request received:', JSON.stringify({
      tableId: options.tableId,
      recordId: options.recordId,
      agentRole: options.agentRole,
      sendEmail: options.sendEmail
    }, null, 2));
    
    // Validate required parameters
    if (!options.tableId || !options.recordId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: tableId and recordId',
      });
    }

    // In production on Vercel, we directly use the server api route
    // The server/api/generateCoverSheet.js handler is mapped to /api/generateCoverSheet
    // by our vercel.json config
    console.log('Using direct server endpoint for cover sheet generation');
    
    const response = await fetch('/api/generateCoverSheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();
    console.log('Server API response:', JSON.stringify({
      status: response.status,
      success: data.success,
      message: data.message,
      emailSent: data.emailSent,
      emailError: data.emailError,
    }, null, 2));

    if (!response.ok) {
      console.error('Error response from server API:', data);
      throw new Error(data.message || 'Failed to generate cover sheet');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in generateCoverSheet API:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      error: error instanceof Error ? error.stack : undefined
    });
  }
} 