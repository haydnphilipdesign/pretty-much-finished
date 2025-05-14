import { NextApiRequest, NextApiResponse } from 'next';
import { generateCoverSheetPdf } from '@/utils/serverPdfGenerator';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { tableId, recordId } = req.body;

    // Validate required parameters
    if (!tableId || !recordId) {
      return res.status(400).json({ 
        message: 'Missing required parameters: tableId and recordId are required'
      });
    }

    // Define the output directory for generated PDFs
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');

    // Generate the cover sheet PDF
    const pdfPath = await generateCoverSheetPdf(tableId, recordId, outputDir);

    // Get the filename from the path
    const filename = path.basename(pdfPath);

    // Return the path to the generated PDF
    return res.status(200).json({
      success: true,
      message: 'Cover sheet generated successfully',
      filename,
      path: `/generated-pdfs/${filename}`, // Path relative to the public directory
    });
  } catch (error) {
    console.error('Error generating cover sheet:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating cover sheet',
      error: error instanceof Error ? error.message : String(error),
    });
  }
} 