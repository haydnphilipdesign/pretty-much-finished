// Simple health check API endpoint
module.exports = async(req, res) => {
    try {
        // Return a simple success response
        return res.status(200).json({
            status: 'ok',
            message: 'API is running',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health check error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'API health check failed',
            error: error.message
        });
    }
};