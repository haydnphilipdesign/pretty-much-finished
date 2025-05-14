export default function handler(req, res) {
    res.status(200).json({
        message: 'Hello from PA Real Estate Support Services API!',
        timestamp: new Date().toISOString()
    });
}