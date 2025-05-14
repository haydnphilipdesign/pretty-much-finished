/**
 * Script to fix image path issues by:
 * 1. Creating necessary directories if they don't exist
 * 2. Copying images from public root to their correct subdirectories
 * 3. Identifying missing images
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const ANIMATIONS_DIR = path.join(PUBLIC_DIR, 'animations');
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, 'optimized');

// Create directories if they don't exist
function createDirIfNeeded(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${path.relative(ROOT_DIR, dir)}`);
  }
}

// Copy file from source to destination
function copyFileIfNeeded(source, dest) {
  if (fs.existsSync(source) && !fs.existsSync(dest)) {
    fs.copyFileSync(source, dest);
    console.log(`✅ Copied: ${path.basename(source)} to ${path.relative(PUBLIC_DIR, dest)}`);
    return true;
  } else if (!fs.existsSync(source)) {
    console.log(`⚠️ Source file not found: ${path.basename(source)}`);
    return false;
  } else if (fs.existsSync(dest)) {
    console.log(`ℹ️ Destination file already exists: ${path.relative(PUBLIC_DIR, dest)}`);
    return true;
  }
}

// Main function
async function fixImagePaths() {
  console.log('🔍 Starting image path fix process...');
  
  // 1. Create required directories
  createDirIfNeeded(IMAGES_DIR);
  createDirIfNeeded(ANIMATIONS_DIR);
  createDirIfNeeded(OPTIMIZED_DIR);
  
  // 2. Known missing image files that need to be copied or fixed
  const imagesToFix = [
    // Images that were referenced but not found in correct locations
    { source: path.join(PUBLIC_DIR, 'home-hero.jpg'), dest: path.join(IMAGES_DIR, 'hero-bg.jpg') },
    { source: path.join(PUBLIC_DIR, 'debbie.jpg'), dest: path.join(PUBLIC_DIR, 'debbie-profile.jpg') },
    
    // Animations
    // Check if we can find a preloader.gif somewhere and copy it to animations
    { source: path.join(ROOT_DIR, 'src', 'assets', 'preloader.gif'), dest: path.join(ANIMATIONS_DIR, 'preloader.gif') }
  ];
  
  // Try to find and copy each file
  for (const image of imagesToFix) {
    const success = copyFileIfNeeded(image.source, image.dest);
    
    if (!success && image.dest.includes('preloader.gif')) {
      // Special case for preloader - let's create a simple one if we can't find it
      console.log('⚠️ preloader.gif not found. Please provide one manually in public/animations directory.');
    }
  }
  
  // 3. Handle optimized directory
  // Check if images in optimized exist, if not copy from public root
  const publicFiles = fs.readdirSync(PUBLIC_DIR);
  const imageFiles = publicFiles.filter(file => 
    /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file) && !file.includes('.html')
  );
  
  console.log(`\nFound ${imageFiles.length} images in public root that might need copying to subdirectories.`);
  
  for (const file of imageFiles) {
    const source = path.join(PUBLIC_DIR, file);
    const optimizedDest = path.join(OPTIMIZED_DIR, file);
    
    // If file exists in public but not in optimized, copy it
    copyFileIfNeeded(source, optimizedDest);
  }
  
  console.log('\n📋 Missing images summary:');
  console.log('- ✅ Created necessary directories');
  console.log('- ✅ Copied available images to their correct locations');
  console.log('- ⚠️ If images are still missing, you need to provide them manually in the correct directories');
  console.log('- 💡 Check for: preloader.gif in animations directory if not found');
  
  console.log('\n🎉 Image path fix process completed!');
  console.log('Rebuild your project and check if images are now loading correctly.');
}

// Run the function
fixImagePaths();