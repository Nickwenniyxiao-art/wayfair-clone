/**
 * Download Unsplash Images and Upload to S3
 * 
 * This script:
 * 1. Downloads 200 high-quality product images from Unsplash
 * 2. Uploads them to S3 storage
 * 3. Generates a JSON file with S3 URLs for product import
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create images directory
const IMAGES_DIR = path.join(__dirname, '../temp-images');
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Unsplash image IDs for different categories
const FURNITURE_IMAGE_IDS = [
  '1555041469-a586c61ea9bc', '1540574163026-643ea20ade25', '1567538096630-e0c55bd6374c',
  '1493663284031-ba82ef38a7b6', '1556228453-efd6c1ff04f6', '1567016432779-094069294a9b',
  '1551298370-9d3d53740c6d', '1538688525198-9b88f6f53126', '1555041469-a586c61ea9bc',
  '1540574163026-643ea20ade25', '1567538096630-e0c55bd6374c', '1493663284031-ba82ef38a7b6'
];

const DECOR_IMAGE_IDS = [
  '1513519107455-1c4e5d0e9c91', '1485955900006-10f4d324d411', '1519710164239-da299b84c5fc',
  '1493663284031-ba82ef38a7b6', '1618220179428-22790b461013', '1485955900006-10f4d324d411',
  '1513519107455-1c4e5d0e9c91', '1519710164239-da299b84c5fc', '1493663284031-ba82ef38a7b6'
];

const LIGHTING_IMAGE_IDS = [
  '1513506003-0c140c3c5d8b', '1507473885765-e6ed83f1b6b0', '1540932239986-30128078f3c0',
  '1534349762230-e0cadf78f5da', '1565538810323-72f8c2f9b5b7', '1513506003-0c140c3c5d8b',
  '1507473885765-e6ed83f1b6b0', '1540932239986-30128078f3c0', '1534349762230-e0cadf78f5da'
];

/**
 * Download image from Unsplash
 */
function downloadImage(imageId, filename) {
  return new Promise((resolve, reject) => {
    const url = `https://images.unsplash.com/photo-${imageId}?w=800&q=80`;
    const filepath = path.join(IMAGES_DIR, filename);
    
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Upload image to S3 using manus-upload-file
 */
function uploadToS3(filepath) {
  try {
    const output = execSync(`manus-upload-file "${filepath}"`, { encoding: 'utf-8' });
    const match = output.match(/https:\/\/[^\s]+/);
    if (match) {
      return match[0];
    }
    throw new Error('Failed to extract S3 URL from output');
  } catch (error) {
    console.error(`Failed to upload ${filepath}:`, error.message);
    return null;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting image download and upload process...\n');
  
  const imageUrls = [];
  let downloaded = 0;
  let uploaded = 0;
  
  // Furniture images (80)
  console.log('📦 Processing Furniture images (80)...');
  for (let i = 0; i < 80; i++) {
    const imageId = FURNITURE_IMAGE_IDS[i % FURNITURE_IMAGE_IDS.length];
    const filename = `furniture-${String(i + 1).padStart(3, '0')}.jpg`;
    
    try {
      // Download
      const filepath = await downloadImage(imageId, filename);
      downloaded++;
      
      // Upload to S3
      const s3Url = uploadToS3(filepath);
      if (s3Url) {
        uploaded++;
        imageUrls.push({
          category: 'furniture',
          index: i,
          localPath: filepath,
          s3Url: s3Url
        });
      }
      
      // Progress
      if ((i + 1) % 10 === 0) {
        console.log(`   ✓ Processed ${i + 1}/80 furniture images`);
      }
      
      // Clean up local file
      fs.unlinkSync(filepath);
      
    } catch (error) {
      console.error(`   ✗ Failed to process ${filename}:`, error.message);
    }
  }
  console.log(`✅ Furniture: ${uploaded}/80 images uploaded\n`);
  
  // Decor images (70)
  console.log('🎨 Processing Decor images (70)...');
  const decorStart = uploaded;
  for (let i = 0; i < 70; i++) {
    const imageId = DECOR_IMAGE_IDS[i % DECOR_IMAGE_IDS.length];
    const filename = `decor-${String(i + 1).padStart(3, '0')}.jpg`;
    
    try {
      const filepath = await downloadImage(imageId, filename);
      downloaded++;
      
      const s3Url = uploadToS3(filepath);
      if (s3Url) {
        uploaded++;
        imageUrls.push({
          category: 'decor',
          index: i,
          localPath: filepath,
          s3Url: s3Url
        });
      }
      
      if ((i + 1) % 10 === 0) {
        console.log(`   ✓ Processed ${i + 1}/70 decor images`);
      }
      
      fs.unlinkSync(filepath);
      
    } catch (error) {
      console.error(`   ✗ Failed to process ${filename}:`, error.message);
    }
  }
  console.log(`✅ Decor: ${uploaded - decorStart}/70 images uploaded\n`);
  
  // Lighting images (50)
  console.log('💡 Processing Lighting images (50)...');
  const lightingStart = uploaded;
  for (let i = 0; i < 50; i++) {
    const imageId = LIGHTING_IMAGE_IDS[i % LIGHTING_IMAGE_IDS.length];
    const filename = `lighting-${String(i + 1).padStart(3, '0')}.jpg`;
    
    try {
      const filepath = await downloadImage(imageId, filename);
      downloaded++;
      
      const s3Url = uploadToS3(filepath);
      if (s3Url) {
        uploaded++;
        imageUrls.push({
          category: 'lighting',
          index: i,
          localPath: filepath,
          s3Url: s3Url
        });
      }
      
      if ((i + 1) % 10 === 0) {
        console.log(`   ✓ Processed ${i + 1}/50 lighting images`);
      }
      
      fs.unlinkSync(filepath);
      
    } catch (error) {
      console.error(`   ✗ Failed to process ${filename}:`, error.message);
    }
  }
  console.log(`✅ Lighting: ${uploaded - lightingStart}/50 images uploaded\n`);
  
  // Save URLs to JSON file
  const outputFile = path.join(__dirname, 'image-urls.json');
  fs.writeFileSync(outputFile, JSON.stringify(imageUrls, null, 2));
  
  console.log('═══════════════════════════════════════');
  console.log('📊 Summary:');
  console.log(`   Downloaded: ${downloaded}/200`);
  console.log(`   Uploaded to S3: ${uploaded}/200`);
  console.log(`   URLs saved to: ${outputFile}`);
  console.log('═══════════════════════════════════════\n');
  
  console.log('🎉 Process completed!');
  
  // Clean up temp directory
  if (fs.existsSync(IMAGES_DIR)) {
    fs.rmdirSync(IMAGES_DIR, { recursive: true });
  }
}

main().catch(console.error);
