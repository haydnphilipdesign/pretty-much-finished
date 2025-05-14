/**
 * Script to verify MIME type configurations
 */
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple HTTP server to test MIME types
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, '..', 'build', req.url.split('?')[0]);

    // Only handle files that exist
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();

        // Set appropriate MIME type based on file extension
        let contentType = 'text/html';
        switch (ext) {
            case '.js':
                contentType = 'application/javascript';
                break;
            case '.mjs':
                contentType = 'application/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.svg':
                contentType = 'image/svg+xml';
                break;
            case '.ico':
                contentType = 'image/x-icon';
                break;
        }

        // Set Content-Type header with the correct MIME type
        res.setHeader('Content-Type', contentType);

        // Add nosniff header to prevent MIME type sniffing
        res.setHeader('X-Content-Type-Options', 'nosniff');

        // Return the file content
        fs.createReadStream(filePath).pipe(res);
    } else {
        // Return 404 for files that don't exist
        res.statusCode = 404;
        res.end('File not found');
    }
});

// Start the server on port 8000
const PORT = 8000;
server.listen(PORT, () => {
    console.log(`MIME type verification server running at http://localhost:${PORT}`);
    console.log(`To test, build your app and then navigate to http://localhost:${PORT}/index.html`);
    console.log(`You can inspect the Network tab in your browser's dev tools to verify MIME types.`);
});