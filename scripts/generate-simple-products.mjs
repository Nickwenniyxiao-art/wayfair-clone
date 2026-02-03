/**
 * Generate 200 Nordic Minimalist Products with Real Unsplash Images
 */

// Real Unsplash photo IDs for different categories
const furnitureImageIds = [
  '1555041469-a586c61ea9bc', '1540574163026-643ea20ade25', '1567538096630-e0c55bd6374c',
  '1493663284031-ba82ef38a7b6', '1555041469-a586c61ea9bc', '1556228453-efd6c1ff04f6',
  '1567016432779-094069294a9b', '1551298370-9d3d53740c6d', '1493663284031-ba82ef38a7b6',
  '1538688525198-9b88f6f53126', '1555041469-a586c61ea9bc', '1540574163026-643ea20ade25'
];

const decorImageIds = [
  '1513519107455-1c4e5d0e9c91', '1485955900006-10f4d324d411', '1519710164239-da299b84c5fc',
  '1493663284031-ba82ef38a7b6', '1618220179428-22790b461013', '1485955900006-10f4d324d411',
  '1513519107455-1c4e5d0e9c91', '1519710164239-da299b84c5fc', '1493663284031-ba82ef38a7b6'
];

const lightingImageIds = [
  '1513506003-0c140c3c5d8b', '1507473885765-e6ed83f1b6b0', '1540932239986-30128078f3c0',
  '1534349762230-e0cadf78f5da', '1565538810323-72f8c2f9b5b7', '1513506003-0c140c3c5d8b',
  '1507473885765-e6ed83f1b6b0', '1540932239986-30128078f3c0', '1534349762230-e0cadf78f5da'
];

function getImageUrl(category, index) {
  let imageIds;
  if (category === 1) imageIds = furnitureImageIds;
  else if (category === 2) imageIds = decorImageIds;
  else imageIds = lightingImageIds;
  
  const imageId = imageIds[index % imageIds.length];
  return `https://images.unsplash.com/photo-${imageId}?w=800&q=80`;
}

// Categories
export const categories = [
  {
    id: 1,
    name: 'Furniture',
    name_zh: '家具',
    slug: 'furniture',
    description: 'Nordic minimalist furniture for modern living',
    description_zh: '现代生活的北欧极简家具',
    icon: '🪑',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 2,
    name: 'Decor',
    name_zh: '装饰',
    slug: 'decor',
    description: 'Elegant decorative items to enhance your space',
    description_zh: '优雅的装饰品提升您的空间',
    icon: '🎨',
    displayOrder: 2,
    isActive: true
  },
  {
    id: 3,
    name: 'Lighting',
    name_zh: '照明',
    slug: 'lighting',
    description: 'Modern lighting solutions for every room',
    description_zh: '适合每个房间的现代照明解决方案',
    icon: '💡',
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
  
  products.push({
    sku: `FUR-${String(i + 1).padStart(4, '0')}`,
    name: `Nordic ${type} ${num}`,
    name_zh: `北欧${type === 'Sofa' ? '沙发' : type === 'Dining Table' ? '餐桌' : type === 'Chair' ? '椅子' : type === 'Bed' ? '床' : type === 'Bookshelf' ? '书架' : type === 'Cabinet' ? '柜子' : type === 'Desk' ? '书桌' : '床头柜'} ${num}`,
    slug: `nordic-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    description: `Elegant Nordic ${type} with clean lines and minimalist design. Perfect for modern living spaces. High-quality materials ensure durability and style.`,
    description_zh: `优雅的北欧${type === 'Sofa' ? '沙发' : type === 'Dining Table' ? '餐桌' : type === 'Chair' ? '椅子' : type === 'Bed' ? '床' : type === 'Bookshelf' ? '书架' : type === 'Cabinet' ? '柜子' : type === 'Desk' ? '书桌' : '床头柜'}，线条简洁，设计极简。非常适合现代生活空间。优质材料确保耐用性和风格。`,
    categoryId: 1,
    price: (299 + i * 15).toFixed(2),
    compareAtPrice: (399 + i * 15).toFixed(2),
    stock: 10 + (i % 40),
    imageUrl: getImageUrl(1, i),
    images: JSON.stringify([getImageUrl(1, i), getImageUrl(1, i + 1)]),
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
  
  products.push({
    sku: `DEC-${String(i + 1).padStart(4, '0')}`,
    name: `Minimalist ${type} ${num}`,
    name_zh: `极简${type === 'Wall Art' ? '墙艺' : type === 'Vase' ? '花瓶' : type === 'Rug' ? '地毯' : type === 'Mirror' ? '镜子' : type === 'Candle Holder' ? '烛台' : type === 'Cushion' ? '靠垫' : '时钟'} ${num}`,
    slug: `minimalist-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    description: `Beautiful Minimalist ${type} that adds elegance to any room. Scandinavian design principles create timeless appeal. Perfect for modern interiors.`,
    description_zh: `美丽的极简${type === 'Wall Art' ? '墙艺' : type === 'Vase' ? '花瓶' : type === 'Rug' ? '地毯' : type === 'Mirror' ? '镜子' : type === 'Candle Holder' ? '烛台' : type === 'Cushion' ? '靠垫' : '时钟'}，为任何房间增添优雅。斯堪的纳维亚设计原则创造永恒魅力。非常适合现代室内装饰。`,
    categoryId: 2,
    price: (49 + i * 8).toFixed(2),
    compareAtPrice: (79 + i * 8).toFixed(2),
    stock: 20 + (i % 50),
    imageUrl: getImageUrl(2, i),
    images: JSON.stringify([getImageUrl(2, i)]),
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
  
  products.push({
    sku: `LIT-${String(i + 1).padStart(4, '0')}`,
    name: `Modern ${type} ${num}`,
    name_zh: `现代${type === 'Pendant Light' ? '吊灯' : type === 'Table Lamp' ? '台灯' : type === 'Floor Lamp' ? '落地灯' : type === 'Wall Sconce' ? '壁灯' : '吸顶灯'} ${num}`,
    slug: `modern-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    description: `Stylish Modern ${type} with Nordic aesthetics. Energy-efficient LED compatible. Creates perfect ambiance for any space.`,
    description_zh: `时尚的现代${type === 'Pendant Light' ? '吊灯' : type === 'Table Lamp' ? '台灯' : type === 'Floor Lamp' ? '落地灯' : type === 'Wall Sconce' ? '壁灯' : '吸顶灯'}，具有北欧美学。兼容节能 LED。为任何空间营造完美氛围。`,
    categoryId: 3,
    price: (99 + i * 12).toFixed(2),
    compareAtPrice: (149 + i * 12).toFixed(2),
    stock: 15 + (i % 35),
    imageUrl: getImageUrl(3, i),
    images: JSON.stringify([getImageUrl(3, i), getImageUrl(3, i + 1)]),
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

console.log('✅ Generated product data:');
console.log(`   - Total: ${productData.summary.totalProducts} products`);
console.log(`   - Furniture: ${productData.summary.furniture} products`);
console.log(`   - Decor: ${productData.summary.decor} products`);
console.log(`   - Lighting: ${productData.summary.lighting} products`);
