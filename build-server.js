const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if server directory exists
const serverDir = path.join(__dirname, 'server');
if (fs.existsSync(serverDir)) {
  console.log('Installing server dependencies...');
  
  try {
    // Change to server directory and install dependencies
    process.chdir(serverDir);
    execSync('npm install', { stdio: 'inherit' });
    console.log('Server dependencies installed successfully.');
    
    // Change back to root directory
    process.chdir(__dirname);
  } catch (error) {
    console.error('Error installing server dependencies:', error);
    process.exit(1);
  }
} else {
  console.log('Server directory not found, skipping server build.');
}
