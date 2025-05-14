const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run the regular build process
console.log('Running regular build process...');
execSync('npm run build', { stdio: 'inherit' });

// Create api directory in the root for Vercel
console.log('Setting up API routes for Vercel...');
const apiDir = path.join(__dirname, 'api');
if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
}

// Copy server API files to the api directory
const sourceDirectories = [
    { src: path.join(__dirname, 'src', 'pages', 'api'), pattern: /\.jsx?$/ },
    { src: path.join(__dirname, 'server', 'api'), pattern: /\.jsx?$/ }
];

sourceDirectories.forEach(({ src, pattern }) => {
    if (fs.existsSync(src)) {
        const files = fs.readdirSync(src);

        files.forEach(file => {
            if (pattern.test(file)) {
                const sourcePath = path.join(src, file);
                const destPath = path.join(apiDir, file);

                console.log(`Copying ${sourcePath} to ${destPath}`);
                fs.copyFileSync(sourcePath, destPath);
            }
        });
    }
});

console.log('API routes setup complete!');