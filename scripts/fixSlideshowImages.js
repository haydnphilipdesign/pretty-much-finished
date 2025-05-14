/**
 * Script to fix slideshow image issues by:
 * 1. Creating a symlink from /optimized to public/optimized in the build output
 * 2. Adding a base path configuration to vite.config.ts
 * 3. Verifying all images in the slideshow exist
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, 'optimized');
const CONTEXT_FILE = path.join(ROOT_DIR, 'src', 'context', 'GlobalSlideshowContext.tsx');

// Color console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Check if all slideshow images exist
function checkSlideshowImages() {
  console.log(`${colors.bright}${colors.blue}Checking slideshow images...${colors.reset}`);
  
  // Read the slideshow context file
  const contextFileContent = fs.readFileSync(CONTEXT_FILE, 'utf8');
  
  // Extract image paths using regex
  const imagePathRegex = /'(\/optimized\/[^']+)'/g;
  const matches = [...contextFileContent.matchAll(imagePathRegex)];
  const imagePaths = matches.map(match => match[1].replace(/^\/optimized\//, ''));
  
  console.log(`${colors.cyan}Found ${imagePaths.length} image references in GlobalSlideshowContext.tsx${colors.reset}`);
  
  // Check if each image exists
  const missingImages = [];
  const existingImages = [];
  
  for (const imageName of imagePaths) {
    const imagePath = path.join(OPTIMIZED_DIR, imageName);
    
    if (fs.existsSync(imagePath)) {
      existingImages.push(imageName);
    } else {
      missingImages.push(imageName);
    }
  }
  
  // Report results
  console.log(`${colors.green}✓ ${existingImages.length} images found correctly${colors.reset}`);
  
  if (missingImages.length > 0) {
    console.log(`${colors.red}✗ ${missingImages.length} images are missing:${colors.reset}`);
    missingImages.forEach(img => console.log(`  ${colors.red}- ${img}${colors.reset}`));
  }
  
  return { existingImages, missingImages };
}

// Update vite.config.ts to handle image paths correctly
function updateViteConfig() {
  console.log(`${colors.bright}${colors.blue}Updating Vite configuration...${colors.reset}`);
  
  const viteConfigPath = path.join(ROOT_DIR, 'vite.config.ts');
  
  if (!fs.existsSync(viteConfigPath)) {
    console.log(`${colors.red}✗ vite.config.ts not found!${colors.reset}`);
    return false;
  }
  
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  // Check if publicDir is already explicitly set
  if (!viteConfig.includes('publicDir: ')) {
    // Add publicDir configuration
    const insertPoint = viteConfig.indexOf('resolve: {');
    if (insertPoint !== -1) {
      viteConfig = viteConfig.slice(0, insertPoint) + 
        '  publicDir: \'public\',\n  ' + 
        viteConfig.slice(insertPoint);
      
      // Write changes back
      fs.writeFileSync(viteConfigPath, viteConfig, 'utf8');
      console.log(`${colors.green}✓ Updated vite.config.ts with explicit publicDir config${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠ Could not find insertion point in vite.config.ts${colors.reset}`);
    }
  } else {
    console.log(`${colors.cyan}ℹ publicDir already configured in vite.config.ts${colors.reset}`);
  }
  
  return true;
}

// Create a script to ensure optimized folder is properly linked in build output
function createBuildScript() {
  console.log(`${colors.bright}${colors.blue}Creating build enhancement script...${colors.reset}`);
  
  const scriptPath = path.join(ROOT_DIR, 'scripts', 'ensure-optimized-folder.js');
  const scriptContent = `/**
 * Script to ensure the optimized folder is correctly available in the build output
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, 'optimized');
const BUILD_DIR = path.join(ROOT_DIR, 'dist');
const BUILD_OPTIMIZED_DIR = path.join(BUILD_DIR, 'optimized');

// Copy the optimized folder to the build output
function copyOptimizedFolder() {
  console.log('Ensuring optimized folder is available in build output...');
  
  if (!fs.existsSync(BUILD_DIR)) {
    console.log('Build directory does not exist! Run build first.');
    return false;
  }
  
  // Create optimized directory in build output if it doesn't exist
  if (!fs.existsSync(BUILD_OPTIMIZED_DIR)) {
    fs.mkdirSync(BUILD_OPTIMIZED_DIR, { recursive: true });
    console.log('Created optimized directory in build output');
  }
  
  // Copy all files from public/optimized to build/optimized
  const files = fs.readdirSync(OPTIMIZED_DIR);
  let copiedCount = 0;
  
  for (const file of files) {
    const sourcePath = path.join(OPTIMIZED_DIR, file);
    const destPath = path.join(BUILD_OPTIMIZED_DIR, file);
    
    // Only copy if the source is a file
    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, destPath);
      copiedCount++;
    }
  }
  
  console.log(\`Copied \${copiedCount} files to build output\`);
  return true;
}

// Run the function
copyOptimizedFolder();
`;

  fs.writeFileSync(scriptPath, scriptContent, 'utf8');
  console.log(`${colors.green}✓ Created ensure-optimized-folder.js script${colors.reset}`);
  
  // Update package.json to include the new script
  const packageJsonPath = path.join(ROOT_DIR, 'package.json');
  let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add the new script command
  if (!packageJson.scripts['build:with-images']) {
    packageJson.scripts['build:with-images'] = 'npm run build && node scripts/ensure-optimized-folder.js';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4), 'utf8');
    console.log(`${colors.green}✓ Added build:with-images script to package.json${colors.reset}`);
  } else {
    console.log(`${colors.cyan}ℹ build:with-images script already exists in package.json${colors.reset}`);
  }
  
  return true;
}

// Fix image issues via development server
function fixDevServerIssues() {
  console.log(`${colors.bright}${colors.blue}Creating dev server fix...${colors.reset}`);
  
  // Create a new vite configuration file that sets a base path
  const viteDevConfigPath = path.join(ROOT_DIR, 'vite.dev.config.ts');
  const viteConfigPath = path.join(ROOT_DIR, 'vite.config.ts');
  
  // Copy existing vite.config.ts
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  // Insert static file handling for dev server
  viteConfig = viteConfig.replace(
    'server: {',
    `server: {
    historyApiFallback: true,
    port: 3000,
    host: true,
    middlewareMode: false,
    fs: {
      strict: false,
      allow: ['..'],
    },
    `
  );
  
  fs.writeFileSync(viteDevConfigPath, viteConfig, 'utf8');
  console.log(`${colors.green}✓ Created vite.dev.config.ts with improved dev server configuration${colors.reset}`);
  
  // Add dev server script to package.json
  const packageJsonPath = path.join(ROOT_DIR, 'package.json');
  let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add the new script command
  if (!packageJson.scripts['dev:fixed']) {
    packageJson.scripts['dev:fixed'] = 'vite --config vite.dev.config.ts';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4), 'utf8');
    console.log(`${colors.green}✓ Added dev:fixed script to package.json${colors.reset}`);
  } else {
    console.log(`${colors.cyan}ℹ dev:fixed script already exists in package.json${colors.reset}`);
  }
  
  return true;
}

// Create a direct fix to copy all optimized images to the root
function fixImmediateIssue() {
  console.log(`${colors.bright}${colors.blue}Creating immediate fix for optimized image loading...${colors.reset}`);
  
  // Create a symlink or copy the optimized folder to the project root
  const linkSource = path.join(PUBLIC_DIR, 'optimized');
  const linkTarget = path.join(ROOT_DIR, 'optimized');
  
  if (!fs.existsSync(linkTarget)) {
    try {
      // First try to create a directory junction (Windows) or symlink (Unix)
      if (process.platform === 'win32') {
        // On Windows, use directory junction
        require('child_process').execSync(`mklink /J "${linkTarget}" "${linkSource}"`);
        console.log(`${colors.green}✓ Created directory junction from ${linkSource} to ${linkTarget}${colors.reset}`);
      } else {
        // On Unix, use symlink
        fs.symlinkSync(linkSource, linkTarget, 'dir');
        console.log(`${colors.green}✓ Created symlink from ${linkSource} to ${linkTarget}${colors.reset}`);
      }
    } catch (error) {
      console.log(`${colors.yellow}⚠ Could not create link, falling back to copying files${colors.reset}`);
      
      // Create the directory
      fs.mkdirSync(linkTarget, { recursive: true });
      
      // Copy all files from public/optimized to /optimized
      const files = fs.readdirSync(linkSource);
      let copiedCount = 0;
      
      for (const file of files) {
        const sourcePath = path.join(linkSource, file);
        const destPath = path.join(linkTarget, file);
        
        // Only copy if the source is a file
        if (fs.statSync(sourcePath).isFile()) {
          fs.copyFileSync(sourcePath, destPath);
          copiedCount++;
        }
      }
      
      console.log(`${colors.green}✓ Copied ${copiedCount} files from public/optimized to /optimized${colors.reset}`);
    }
  } else {
    console.log(`${colors.cyan}ℹ Target directory already exists: ${linkTarget}${colors.reset}`);
  }
  
  return true;
}

// Create an HTML file with instructions
function createInstructionsFile() {
  console.log(`${colors.bright}${colors.blue}Creating instructions file...${colors.reset}`);
  
  const instructionsPath = path.join(PUBLIC_DIR, 'fix-slideshow.html');
  const instructionsContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slideshow Image Fix Instructions</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            color: #0066cc;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        h2 {
            color: #0066cc;
            margin-top: 25px;
        }
        pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
        code {
            font-family: Consolas, Monaco, 'Andale Mono', monospace;
            color: #d63384;
        }
        .warning {
            background-color: #fff3cd;
            color: #856404;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
            border-left: 5px solid #ffc107;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
            border-left: 5px solid #28a745;
        }
        ol, ul {
            padding-left: 25px;
        }
        li {
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <h1>Slideshow Image Fix Instructions</h1>
    
    <div class="warning">
        <strong>Issue:</strong> Slideshow images are not loading correctly, showing a black background instead.
    </div>
    
    <h2>Solution Options</h2>
    
    <h3>Option 1: Quick Development Fix</h3>
    <p>For immediate development testing, run:</p>
    <pre><code>npm run fix:slideshow</code></pre>
    <p>This will:</p>
    <ul>
        <li>Create a copy of the <code>optimized</code> folder at the project root</li>
        <li>Allow images to load with the current paths in the code</li>
    </ul>
    <p>Then restart your development server with:</p>
    <pre><code>npm run dev</code></pre>
    
    <h3>Option 2: Enhanced Development Server</h3>
    <p>Use the enhanced development server configuration:</p>
    <pre><code>npm run dev:fixed</code></pre>
    <p>This uses a custom Vite configuration that improves file system access.</p>
    
    <h3>Option 3: Proper Build with Image Support</h3>
    <p>For production builds, use:</p>
    <pre><code>npm run build:with-images</code></pre>
    <p>This will:</p>
    <ul>
        <li>Build the project normally</li>
        <li>Ensure the optimized images are copied to the build output</li>
    </ul>
    
    <div class="warning">
        <strong>Important:</strong> For production deployments:
        <ul>
            <li>Always use <code>npm run build:with-images</code> to ensure images are included</li>
            <li>If deploying to a subdirectory (not root domain), update the <code>base</code> path in <code>vite.config.ts</code></li>
        </ul>
    </div>
    
    <h2>Long-term Solution</h2>
    <p>For a more robust solution, consider:</p>
    <ol>
        <li>Updating image paths in <code>GlobalSlideshowContext.tsx</code> to use relative paths instead of absolute paths</li>
        <li>Importing images directly in the component using ES module imports</li>
        <li>Using a proper asset management approach with Vite's built-in features</li>
    </ol>
    
    <div class="success">
        <strong>Example fix:</strong> Change from <code>'/optimized/image.jpg'</code> to <code>'./optimized/image.jpg'</code> or import with <code>import imageUrl from './optimized/image.jpg'</code>
    </div>
</body>
</html>`;

  fs.writeFileSync(instructionsPath, instructionsContent, 'utf8');
  console.log(`${colors.green}✓ Created fix-slideshow.html with instructions${colors.reset}`);
  
  return true;
}

// Main function
function fixSlideshowImages() {
  console.log(`${colors.bright}${colors.cyan}Starting slideshow image fix process...${colors.reset}\n`);
  
  // Check slideshow images
  const { existingImages, missingImages } = checkSlideshowImages();
  console.log();
  
  // Update vite config
  updateViteConfig();
  console.log();
  
  // Create build script
  createBuildScript();
  console.log();
  
  // Fix dev server issues
  fixDevServerIssues();
  console.log();
  
  // Create immediate fix
  fixImmediateIssue();
  console.log();
  
  // Create instructions file
  createInstructionsFile();
  console.log();
  
  // Report summary
  console.log(`${colors.bright}${colors.cyan}Slideshow Image Fix Summary:${colors.reset}`);
  console.log(`${colors.green}✓ ${existingImages.length} images found correctly${colors.reset}`);
  if (missingImages.length > 0) {
    console.log(`${colors.red}✗ ${missingImages.length} images are missing${colors.reset}`);
  }
  console.log(`${colors.green}✓ Created build enhancement script${colors.reset}`);
  console.log(`${colors.green}✓ Created development server fix${colors.reset}`);
  console.log(`${colors.green}✓ Applied immediate fix for optimized folder${colors.reset}`);
  console.log(`${colors.green}✓ Created instructions${colors.reset}`);
  
  console.log(`\n${colors.bright}${colors.green}✨ Slideshow image fix process completed!${colors.reset}`);
  console.log(`${colors.cyan}Try running your site with 'npm run dev' or 'npm run dev:fixed'${colors.reset}`);
  console.log(`${colors.cyan}For production builds use 'npm run build:with-images'${colors.reset}`);
}

// Run the function
fixSlideshowImages();