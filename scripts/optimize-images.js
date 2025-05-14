const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const OPTIMIZED_DIR = path.join(__dirname, '../public/optimized');

async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(2000, 2000, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 80,
        progressive: true 
      })
      .toFile(outputPath);
    
    console.log(`✅ Optimized: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`❌ Failed to optimize ${path.basename(inputPath)}:`, error);
  }
}

async function processImages() {
  try {
    // Create optimized directory if it doesn't exist
    await fs.mkdir(OPTIMIZED_DIR, { recursive: true });

    // Get all files in public directory
    const files = await fs.readdir(PUBLIC_DIR);
    
    // Filter for image files
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png)$/i.test(file)
    );

    console.log(`Found ${imageFiles.length} images to optimize...`);

    // Process each image
    const promises = imageFiles.map(file => {
      const inputPath = path.join(PUBLIC_DIR, file);
      const outputPath = path.join(OPTIMIZED_DIR, file);
      return optimizeImage(inputPath, outputPath);
    });

    await Promise.all(promises);
    console.log('\n✨ Image optimization complete!');

  } catch (error) {
    console.error('Failed to process images:', error);
  }
}

processImages(); 