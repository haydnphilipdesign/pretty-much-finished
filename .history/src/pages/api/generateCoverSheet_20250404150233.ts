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
    
    // Validate required parameters
    if (!options.tableId || !options.recordId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: tableId and recordId',
      });
    }

    // Forward this request to our server API that handles the actual server-side operations
    // This keeps Node.js modules like fs, crypto, etc. on the server
    const serverUrl = process.env.SERVER_API_URL || 'http://localhost:3001';
    
    const response = await fetch(`${serverUrl}/api/generate-cover-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate cover sheet');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in generateCoverSheet API:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
} 