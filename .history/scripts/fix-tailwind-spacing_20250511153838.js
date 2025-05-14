import fs from 'fs/promises';
import path from 'path';

/**
 * A script to automatically fix spacing issues in Tailwind CSS files
 * Specifically, it fixes issues where there are spaces between the colon and the class name
 * For example: `hover: bg-blue-500` becomes `hover:bg-blue-500`
 */

async function fixTailwindSpacing(filePath) {
  console.log(`Processing file: ${filePath}`);
  
  try {
    // Read the file content
    const content = await fs.readFile(filePath, 'utf8');
    
    // Fix spacing in utility classes (e.g., hover: bg-blue-500 -> hover:bg-blue-500)
    // This regex looks for Tailwind modifiers followed by a space and then a class
    const fixedContent = content.replace(/(\w+): ([a-zA-Z0-9_-]+)/g, '$1:$2');
    
    // Write the fixed content back to the file
    await fs.writeFile(filePath, fixedContent, 'utf8');
    
    console.log(`✅ Fixed spacing issues in ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
  }
}

async function processDirectory(directory) {
  try {
    const items = await fs.readdir(directory, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(directory, item.name);
      
      if (item.isDirectory()) {
        // Skip node_modules and other common directories to avoid
        if (!['node_modules', 'dist', 'build', '.git'].includes(item.name)) {
          await processDirectory(itemPath);
        }
      } else if (item.isFile() && ['.css', '.scss'].includes(path.extname(item.name).toLowerCase())) {
        await fixTailwindSpacing(itemPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
  }
}

// The main function that starts the process
async function main() {
  const rootDir = path.resolve('src');
  console.log(`Starting to fix Tailwind spacing issues in ${rootDir}`);
  
  await processDirectory(rootDir);
  
  // Also fix the main index.css file if it exists in the root
  const indexCssPath = path.resolve('src/index.css');
  try {
    await fs.access(indexCssPath);
    await fixTailwindSpacing(indexCssPath);
  } catch (error) {
    // File doesn't exist, that's okay
  }
  
  console.log('Done! 🎉');
}

main().catch(console.error);
