import fs from 'fs';
import path from 'path';
import util from 'util';
import { v4 as uuidv4 } from 'uuid';

const writeFileAsync = util.promisify(fs.writeFile);

// Store references to uploaded files for cleanup
const uploadedFiles = new Map();

// Cleanup old files every hour
setInterval(() => {
  const now = Date.now();
  const expiryTime = 24 * 60 * 60 * 1000; // 24 hours
  
  for (const [key, fileInfo] of uploadedFiles.entries()) {
    if (now - fileInfo.timestamp > expiryTime) {
      try {
        fs.unlinkSync(fileInfo.path);
      } catch (error) {
        console.error('Error deleting expired file:', error);
      }
      uploadedFiles.delete(key);
    }
  }
}, 60 * 60 * 1000);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pdfData, filename } = req.body;
    
    if (!pdfData || !filename) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const fileId = uuidv4();
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Save the file locally
    const filePath = path.join(uploadsDir, `${fileId}_${safeFilename}`);
    const pdfBuffer = Buffer.from(pdfData, 'base64');
    
    await writeFileAsync(filePath, pdfBuffer);
    
    // Keep track of the file for later cleanup
    uploadedFiles.set(fileId, {
      path: filePath,
      timestamp: Date.now()
    });
    
    // Return the URL to access the file
    const fileUrl = `${req.headers.origin}/uploads/${fileId}_${safeFilename}`;
    
    return res.status(200).json({
      success: true,
      url: fileUrl
    });
  } catch (error) {
    console.error('Error handling PDF upload:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process PDF upload'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};