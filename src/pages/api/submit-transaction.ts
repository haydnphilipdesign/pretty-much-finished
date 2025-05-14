import type { NextApiRequest, NextApiResponse } from 'next';
import Airtable from 'airtable';
import { AgentRole } from '@/src/types/transaction';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { baseId, tableId, formData } = req.body;

    // Configure Airtable
    const base = new Airtable({
      apiKey: process.env.VITE_AIRTABLE_API_KEY
    }).base(baseId);

    // Format data for Airtable
    const airtableData = {
      "Role": formData.agentData.agentRole,
      "Property Address": formData.propertyData.address,
      "MLS Number": formData.propertyData.mlsNumber,
      "Sale Price": formData.propertyData.salePrice,
      "Clients": formData.clients.map((client: any) => client.name).join(", "),
      "Commission Total": formData.commissionData.totalCommission,
      "Submission Date": new Date().toISOString(),
      // Add more fields as needed
    };

    // Create record in Airtable
    const record = await base(tableId).create([
      { fields: airtableData }
    ]);
    
    console.log('Created Airtable record with ID:', record[0].id);

    return res.status(200).json({ 
      success: true, 
      message: 'Transaction submitted successfully',
      recordId: record[0].id
    });
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to submit transaction',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
