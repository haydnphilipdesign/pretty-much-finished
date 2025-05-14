const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Execute the build command
console.log('🔨 Running build command...');
execSync('vite build', { stdio: 'inherit' });

// Create the api directory if it doesn't exist
const apiDir = path.join(__dirname, 'api');
if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
}

// Create the vercel.json file
const vercelConfig = {
    version: 2,
    routes: [{
        src: '/(.*)',
        dest: '/index.html'
    }]
};

// Write the configuration to the api directory
fs.writeFileSync(
    path.join(apiDir, 'vercel.json'),
    JSON.stringify(vercelConfig, null, 2)
);

console.log('✅ Build completed successfully!');
console.log('📁 API directory created with Vercel configuration.');