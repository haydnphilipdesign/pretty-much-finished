import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting Vercel build process...');

// Run the build command
try {
    console.log('Building frontend with Vite...');
    execSync('vite build', { stdio: 'inherit' });
    console.log('Frontend build completed successfully.');
} catch (error) {
    console.error('Frontend build failed:', error);
    process.exit(1);
}

// Copy web.config to build directory
try {
    console.log('Copying web.config to build directory...');
    const webConfigSource = path.join(__dirname, 'public', 'web.config');
    const webConfigDest = path.join(__dirname, 'build', 'web.config');

    if (fs.existsSync(webConfigSource)) {
        fs.copyFileSync(webConfigSource, webConfigDest);
        console.log('web.config copied successfully.');
    } else {
        console.warn('web.config not found in public directory.');
    }
} catch (error) {
    console.error('Error copying web.config:', error);
}

// Create API directory for Vercel if it doesn't exist
const apiDir = path.join(__dirname, 'api');
if (!fs.existsSync(apiDir)) {
    console.log('Creating API directory for Vercel serverless functions...');
    fs.mkdirSync(apiDir, { recursive: true });
}

// Create serverless function for handling requests in Vercel
const serverlessFunctionContent = `
export default function handler(req, res) {
  // Set proper headers to avoid MIME type issues
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // This is a catch-all function that will be handled by our SPA
  res.status(200).json({ message: 'API route functioning' });
}
`;

// Write serverless function file
fs.writeFileSync(path.join(apiDir, 'index.js'), serverlessFunctionContent);
console.log('Created serverless function in api/index.js');

console.log('Vercel build process completed successfully.');