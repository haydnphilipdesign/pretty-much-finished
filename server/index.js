import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import generateCoverSheet from './api/generateCoverSheet.js';
import { sendEmail } from './api/sendEmail.js';
import generatePdf from './api/generatePdf.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Get directory name equivalent to __dirname in CommonJS
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Determine the static directory (build for production, dist for development)
const staticDir = process.env.NODE_ENV === 'production' ? 'build' : 'dist';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', staticDir)));

// API routes
app.post('/api/generateCoverSheet', generateCoverSheet);
app.post('/api/send-email', sendEmail);
app.post('/api/generatePdf', generatePdf); // Use the correct endpoint path

// Catch-all route to serve the frontend for client-side routing
app.get('*', (req, res) => {
    // For API endpoints that don't exist
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }

    // For all other routes, serve the SPA's index.html
    res.sendFile(path.join(__dirname, '..', staticDir, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});