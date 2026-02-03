/**
 * Generate 200 Products with S3 Image URLs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load image URLs from JSON
const imageUrlsFile = path.join(__dirname, 'image-urls.json');
const imageUrls = JSON.parse(fs.readFileSync(imageUrlsFile, 'utf-8'));

// Group images by category
const furnitureImages = imageUrls.filter(img => img.category === 'furniture');
const decorImages = imageUrls.filter(img => img.category === 'decor');
const lightingImages = imageUrls.filter(img => img.category === 'lighting');

// Categories
export const categories = [
  {
    id: 1,
    name: 'Furniture',
    slug: 'furniture',
    description: 'Nordic minimalist furniture for modern living',
    icon: '🪑',
    parentId: null,
    displayOrder: 1,
    isActive: true
  },
  {
    id: 2,
    name: 'Decor',
    slug: 'decor',
    description: 'Elegant decorative items to enhance your space',
    icon: '🎨',
    parentId: null,
    displayOrder: 2,
    isActive: true
  },
  {
    id: 3,
    name: 'Lighting',
    slug: 'lighting',
    description: 'Modern lighting solutions for every room',
    icon: '💡',
    parentId: null,
    displayOrder: 3,
    isActive: true
  }
];

// Generate products
const products = [];

// Furniture (80 products)
const furnitureTypes = ['Sofa', 'Dining Table', 'Chair', 'Bed', 'Bookshelf', 'Cabinet', 'Desk', 'Nightstand'];
for (let i = 0; i < 80; i++) {
  const type = furnitureTypes[i % furnitureTypes.length];
  const num = Math.floor(i / furnitureTypes.length) + 1;
  const imageUrl = furnitureImages[i]?.s3Url || '';
  
  products.push({
    sku: `FUR-${String(i + 1).padStart(4, '0')}`,
    name: `Nordic ${type} ${num}`,
    slug: `nordic-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    description: `Elegant Nordic ${type} with clean lines and minimalist design. Perfect for modern living spaces. High-quality materials ensure durability and style.`,
    categoryId: 1,
    price: (299 + i * 15).toFixed(2),
    compareAtPrice: (399 + i * 15).toFixed(2),
    stock: 10 + (i % 40),
    imageUrl: imageUrl,
    images: JSON.stringify([imageUrl]),
    rating: (4.5 + Math.random() * 0.4).toFixed(1),
    reviewCount: 10 + (i % 30),
    isFeatured: i < 8,
    isActive: true
  });
}

// Decor (70 products)
const decorTypes = ['Wall Art', 'Vase', 'Rug', 'Mirror', 'Candle Holder', 'Cushion', 'Clock'];
for (let i = 0; i < 70; i++) {
  const type = decorTypes[i % decorTypes.length];
  const num = Math.floor(i / decorTypes.length) + 1;
  const imageUrl = decorImages[i]?.s3Url || '';
  
  products.push({
    sku: `DEC-${String(i + 1).padStart(4, '0')}`,
    name: `Minimalist ${type} ${num}`,
    slug: `minimalist-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    description: `Beautiful Minimalist ${type} that adds elegance to any room. Scandinavian design principles create timeless appeal. Perfect for modern interiors.`,
    categoryId: 2,
    price: (49 + i * 8).toFixed(2),
    compareAtPrice: (79 + i * 8).toFixed(2),
    stock: 20 + (i % 50),
    imageUrl: imageUrl,
    images: JSON.stringify([imageUrl]),
    rating: (4.5 + Math.random() * 0.4).toFixed(1),
    reviewCount: 8 + (i % 25),
    isFeatured: i < 7,
    isActive: true
  });
}

// Lighting (50 products)
const lightingTypes = ['Pendant Light', 'Table Lamp', 'Floor Lamp', 'Wall Sconce', 'Ceiling Light'];
for (let i = 0; i < 50; i++) {
  const type = lightingTypes[i % lightingTypes.length];
  const num = Math.floor(i / lightingTypes.length) + 1;
  const imageUrl = lightingImages[i]?.s3Url || '';
  
  products.push({
    sku: `LIT-${String(i + 1).padStart(4, '0')}`,
    name: `Modern ${type} ${num}`,
    slug: `modern-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    description: `Stylish Modern ${type} with Nordic aesthetics. Energy-efficient LED compatible. Creates perfect ambiance for any space.`,
    categoryId: 3,
    price: (99 + i * 12).toFixed(2),
    compareAtPrice: (149 + i * 12).toFixed(2),
    stock: 15 + (i % 35),
    imageUrl: imageUrl,
    images: JSON.stringify([imageUrl]),
    rating: (4.6 + Math.random() * 0.3).toFixed(1),
    reviewCount: 12 + (i % 28),
    isFeatured: i < 5,
    isActive: true
  });
}

export const productData = {
  categories,
  products,
  summary: {
    totalProducts: products.length,
    furniture: 80,
    decor: 70,
    lighting: 50
  }
};

console.log('✅ Generated product data with S3 images:');
console.log(`   - Total: ${productData.summary.totalProducts} products`);
console.log(`   - Furniture: ${productData.summary.furniture} products`);
console.log(`   - Decor: ${productData.summary.decor} products`);
console.log(`   - Lighting: ${productData.summary.lighting} products`);
