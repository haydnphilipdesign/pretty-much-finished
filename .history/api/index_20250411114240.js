// This is a catch-all API handler for the root path
export default function handler(req, res) {
    // Set proper headers to avoid MIME type issues
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Return API status
    res.status(200).json({
        message: 'PA Real Estate Support Services API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        path: req.url || '/',
        method: req.method || 'GET'
    });
}