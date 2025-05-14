import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Set MIME types explicitly
app.use((req, res, next) => {
    if (req.path.endsWith('.js')) {
        res.type('application/javascript');
    } else if (req.path.endsWith('.css')) {
        res.type('text/css');
    }
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// API Routes
app.get('/api', (req, res) => {
    res.json({
        message: 'Hello from PA Real Estate Support Services API!',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/test-email', (req, res) => {
    res.json({
        success: true,
        message: 'Test email endpoint',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/test-pdf', (req, res) => {
    res.json({
        success: true,
        message: 'Test PDF endpoint',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/direct-email-test', (req, res) => {
    res.json({
        success: true,
        message: 'Direct email test endpoint',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/direct-pdf-test', (req, res) => {
    res.json({
        success: true,
        message: 'Direct PDF test endpoint',
        timestamp: new Date().toISOString()
    });
});

// Serve static files
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        res.setHeader('X-Content-Type-Options', 'nosniff');
    }
}));

// Route all other requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});