// Since this API route is used by Next.js, not by client-side Vite code,
// we can import server modules here without issues
import { NextApiRequest, NextApiResponse } from 'next';

// Point this to the server-side implementation
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// This is a Next.js API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { tableId, recordId } = req.body;
    // Extract agent role for logging purposes, even if not used directly here
    const agentRole = req.body.agentRole || 'DUAL AGENT';
    console.log(`Processing ${agentRole} cover sheet for record ${recordId}`);

    // Validate required parameters
    if (!tableId || !recordId) {
      return res.status(400).json({ 
        message: 'Missing required parameters: tableId and recordId are required'
      });
    }

    // Instead of calling server modules directly, redirect to the server
    // In production, forward the request to our Express API
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? '/api/generateCoverSheet' 
      : 'http://localhost:3001/api/generateCoverSheet';

    // Forward the request to the server
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error generating cover sheet:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating cover sheet',
      error: error instanceof Error ? error.message : String(error),
    });
  }
} 