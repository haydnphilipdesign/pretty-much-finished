/**
 * Enhanced build script that includes MIME type fixes
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const buildDir = path.join(rootDir, 'build');

console.log('Starting enhanced build process...');

// Run the Vite build
try {
    console.log('Building the application with Vite...');
    execSync('vite build', { stdio: 'inherit', cwd: rootDir });
    console.log('✅ Vite build completed successfully');
} catch (error) {
    console.error('❌ Vite build failed:', error);
    process.exit(1);
}

// Copy server configuration files
const configFiles = [
    { source: 'public/web.config', dest: 'build/web.config' },
    { source: 'public/.htaccess', dest: 'build/.htaccess' },
    { source: 'public/_redirects', dest: 'build/_redirects' }
];

console.log('Copying server configuration files...');
for (const file of configFiles) {
    const sourcePath = path.join(rootDir, file.source);
    const destPath = path.join(rootDir, file.dest);

    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied ${file.source} to ${file.dest}`);
    } else {
        console.warn(`⚠️ ${file.source} not found, skipping`);
    }
}

// Create a server.js file in the build directory for easy serving
const serverJsContent = `
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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
  console.log(\`Server running at http://localhost:\${PORT}\`);
});
`;

// Write the server.js file
fs.writeFileSync(path.join(buildDir, 'server.js'), serverJsContent);
console.log('✅ Created server.js in build directory');

console.log('📦 Build process completed successfully!');
console.log('To serve the build locally, run: node build/server.js');