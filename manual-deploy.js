/**
 * Manual Deployment Helper Script
 * 
 * This script creates a deployment-ready package that can be uploaded
 * directly to Vercel via the dashboard if CLI deployment fails.
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📦 Creating deployment package...');

// Step 1: Clean existing build artifacts
console.log('🧹 Cleaning old build artifacts...');
try {
  if (fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true });
  }
  if (fs.existsSync(path.join(__dirname, 'deployment-package'))) {
    fs.rmSync(path.join(__dirname, 'deployment-package'), { recursive: true, force: true });
  }
  console.log('✅ Cleaned up successfully');
} catch (error) {
  console.error('❌ Error during cleanup:', error);
}

// Step 2: Build the project
console.log('🔨 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

// Step 3: Create deployment package directory
console.log('📁 Creating deployment package...');
const deploymentDir = path.join(__dirname, 'deployment-package');
fs.mkdirSync(deploymentDir);

// Step 4: Copy necessary files to deployment package
try {
  // 1. Copy dist folder
  fs.cpSync(path.join(__dirname, 'dist'), path.join(deploymentDir, 'dist'), { recursive: true });
  
  // 2. Copy API folders and files
  if (fs.existsSync(path.join(__dirname, 'api'))) {
    fs.cpSync(path.join(__dirname, 'api'), path.join(deploymentDir, 'api'), { recursive: true });
  }
  
  // 3. Copy vercel.json
  if (fs.existsSync(path.join(__dirname, 'vercel.json'))) {
    fs.copyFileSync(
      path.join(__dirname, 'vercel.json'), 
      path.join(deploymentDir, 'vercel.json')
    );
  }
  
  // 4. Copy package.json (stripped down version)
  const pkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const simplifiedPkg = {
    name: pkgJson.name,
    version: pkgJson.version,
    dependencies: pkgJson.dependencies,
    scripts: {
      start: pkgJson.scripts.start,
      build: pkgJson.scripts.build,
      'vercel-build': pkgJson.scripts['vercel-build']
    }
  };
  fs.writeFileSync(
    path.join(deploymentDir, 'package.json'),
    JSON.stringify(simplifiedPkg, null, 2)
  );
  
  // 5. Copy public folder if it exists
  if (fs.existsSync(path.join(__dirname, 'public'))) {
    fs.cpSync(path.join(__dirname, 'public'), path.join(deploymentDir, 'public'), { recursive: true });
  }
  
  console.log('✅ Deployment package created successfully');
} catch (error) {
  console.error('❌ Error creating deployment package:', error);
  process.exit(1);
}

// Step 5: Create README with instructions
const readmeContent = `# Manual Deployment Package

This package was created with the manual-deploy.js script and contains all necessary files for a Vercel deployment.

## How to use

1. Zip this entire folder
2. Go to the Vercel dashboard
3. Create a new project or select your existing project
4. Choose "Upload" deployment option
5. Upload the zipped folder
6. Wait for deployment to complete

## Checking the deployment

After deployment, verify that your changes appear correctly on the live site.
For the Reset Form button specifically, check that it appears with red styling.

## Troubleshooting

If the deployment fails or doesn't show your changes:
1. Check Vercel build logs for errors
2. Make sure all files were included in the upload
3. Clear browser cache or use incognito mode to verify
`;
fs.writeFileSync(path.join(deploymentDir, 'README.md'), readmeContent);

console.log('✨ Deployment package is ready!');
console.log(`📁 Location: ${deploymentDir}`);
console.log('');
console.log('To deploy:');
console.log('1. Zip the "deployment-package" folder');
console.log('2. Upload it to Vercel via the dashboard');
console.log('3. Verify your changes on the live site');
