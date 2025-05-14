import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting template copy process...');

// Define source and destination directories
const sourceDir = path.join(__dirname, '..', 'public', 'templates');
const destDir = path.join(__dirname, '..', 'build', 'templates');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
    console.log(`Creating destination directory: ${destDir}`);
    fs.mkdirSync(destDir, { recursive: true });
}

// Read all files from source directory
try {
    const files = fs.readdirSync(sourceDir);
    console.log(`Found ${files.length} files in source directory: ${sourceDir}`);
    
    // Copy each file to destination directory
    files.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(destDir, file);
        
        // Check if it's a file (not a directory)
        if (fs.statSync(sourcePath).isFile()) {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`Copied: ${file}`);
        }
    });
    
    console.log('Template copy process completed successfully.');
} catch (error) {
    console.error('Error copying templates:', error);
    process.exit(1);
}
