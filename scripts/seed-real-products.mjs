import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// 真实的北欧极简风格商品数据
const productsData = [
  // 家具类 (Furniture)
  {
    sku: "FURN-001",
    name: "Minimalist White Dining Table",
    slug: "minimalist-white-dining-table",
    description: "Clean lines and minimalist design. Perfect for modern homes.",
    categoryId: 1,
    price: 299.99,
    originalPrice: 399.99,
    cost: 150.00,
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5",
    ],
    specifications: {
      material: "Oak Wood",
      dimensions: "180cm x 90cm x 75cm",
      weight: "45kg",
      color: "White",
    },
    rating: 4.8,
    reviewCount: 156,
    weight: 45.0,
    dimensions: { length: 180, width: 90, height: 75 },
    isActive: true,
    isFeatured: true,
  },
  {
    sku: "FURN-002",
    name: "Nordic Wooden Bed Frame",
    slug: "nordic-wooden-bed-frame",
    description: "Solid wood bed frame with minimalist design. Queen size.",
    categoryId: 1,
    price: 449.99,
    originalPrice: 599.99,
    cost: 220.00,
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1540932239986-310128078ceb?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1540932239986-310128078ceb?w=400&h=400&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5",
    ],
    specifications: {
      material: "Birch Wood",
      dimensions: "160cm x 200cm x 40cm",
      weight: "80kg",
      color: "Natural",
    },
    rating: 4.7,
    reviewCount: 203,
    weight: 80.0,
    dimensions: { length: 160, width: 200, height: 40 },
    isActive: true,
    isFeatured: true,
  },
  {
    sku: "FURN-003",
    name: "Minimalist Gray Sofa",
    slug: "minimalist-gray-sofa",
    description: "3-seater sofa with clean lines and comfortable seating.",
    categoryId: 1,
    price: 799.99,
    originalPrice: 999.99,
    cost: 400.00,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    ],
    specifications: {
      material: "Linen Fabric",
      dimensions: "210cm x 90cm x 85cm",
      weight: "65kg",
      color: "Gray",
    },
    rating: 4.6,
    reviewCount: 89,
    weight: 65.0,
    dimensions: { length: 210, width: 90, height: 85 },
    isActive: true,
    isFeatured: true,
  },
  {
    sku: "FURN-004",
    name: "White Wooden Bookshelf",
    slug: "white-wooden-bookshelf",
    description: "5-tier bookshelf with minimalist design. Perfect for storage.",
    categoryId: 1,
    price: 199.99,
    originalPrice: 279.99,
    cost: 100.00,
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop",
    ],
    specifications: {
      material: "Pine Wood",
      dimensions: "80cm x 30cm x 180cm",
      weight: "25kg",
      color: "White",
    },
    rating: 4.5,
    reviewCount: 124,
    weight: 25.0,
    dimensions: { length: 80, width: 30, height: 180 },
    isActive: true,
    isFeatured: false,
  },
  {
    sku: "FURN-005",
    name: "Minimalist Office Chair",
    slug: "minimalist-office-chair",
    description: "Ergonomic office chair with minimalist Nordic design.",
    categoryId: 1,
    price: 349.99,
    originalPrice: 449.99,
    cost: 175.00,
    stock: 28,
    images: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop",
    ],
    specifications: {
      material: "Mesh + Wood",
      dimensions: "65cm x 65cm x 95cm",
      weight: "12kg",
      color: "Black",
    },
    rating: 4.7,
    reviewCount: 167,
    weight: 12.0,
    dimensions: { length: 65, width: 65, height: 95 },
    isActive: true,
    isFeatured: false,
  },
  // 装饰品类 (Decor)
  {
    sku: "DECOR-001",
    name: "Nordic Wall Art Print",
    slug: "nordic-wall-art-print",
    description: "Minimalist wall art print. Perfect for any room.",
    categoryId: 2,
    price: 49.99,
    originalPrice: 79.99,
    cost: 20.00,
    stock: 100,
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop",
    ],
    specifications: {
      material: "Paper",
      dimensions: "50cm x 70cm",
      weight: 0.2,
      color: "Black & White",
    },
    rating: 4.8,
    reviewCount: 245,
    weight: 0.2,
    dimensions: { length: 50, width: 70, height: 2 },
    isActive: true,
    isFeatured: true,
  },
  {
    sku: "DECOR-002",
    name: "Ceramic Vase Set",
    slug: "ceramic-vase-set",
    description: "Set of 3 minimalist ceramic vases. White color.",
    categoryId: 2,
    price: 89.99,
    originalPrice: 129.99,
    cost: 40.00,
    stock: 45,
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop",
    ],
    specifications: {
      material: "Ceramic",
      dimensions: "Various sizes",
      weight: 2.5,
      color: "White",
    },
    rating: 4.6,
    reviewCount: 98,
    weight: 2.5,
    dimensions: { length: 15, width: 15, height: 30 },
    isActive: true,
    isFeatured: true,
  },
  {
    sku: "DECOR-003",
    name: "Gray Area Rug",
    slug: "gray-area-rug",
    description: "Minimalist gray area rug. 200x300cm.",
    categoryId: 2,
    price: 199.99,
    originalPrice: 299.99,
    cost: 100.00,
    stock: 20,
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop",
    ],
    specifications: {
      material: "Wool",
      dimensions: "200cm x 300cm",
      weight: 8.0,
      color: "Gray",
    },
    rating: 4.7,
    reviewCount: 156,
    weight: 8.0,
    dimensions: { length: 200, width: 300, height: 1 },
    isActive: true,
    isFeatured: false,
  },
  {
    sku: "DECOR-004",
    name: "Minimalist Wall Mirror",
    slug: "minimalist-wall-mirror",
    description: "Round wall mirror with minimalist frame.",
    categoryId: 2,
    price: 79.99,
    originalPrice: 119.99,
    cost: 35.00,
    stock: 55,
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop",
    ],
    specifications: {
      material: "Glass + Wood",
      dimensions: "60cm diameter",
      weight: 2.0,
      color: "Natural Wood",
    },
    rating: 4.8,
    reviewCount: 189,
    weight: 2.0,
    dimensions: { length: 60, width: 60, height: 5 },
    isActive: true,
    isFeatured: true,
  },
  {
    sku: "DECOR-005",
    name: "White Ceramic Plant Pot",
    slug: "white-ceramic-plant-pot",
    description: "Minimalist white ceramic plant pot with drainage.",
    categoryId: 2,
    price: 29.99,
    originalPrice: 49.99,
    cost: 12.00,
    stock: 80,
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop",
    ],
    specifications: {
      material: "Ceramic",
      dimensions: "20cm diameter x 20cm height",
      weight: 0.8,
      color: "White",
    },
    rating: 4.5,
    reviewCount: 134,
    weight: 0.8,
    dimensions: { length: 20, width: 20, height: 20 },
    isActive: true,
    isFeatured: false,
  },
  // 照明类 (Lighting)
  {
    sku: "LIGHT-001",
    name: "Minimalist Table Lamp",
    slug: "minimalist-table-lamp",
    description: "Modern table lamp with minimalist design. Adjustable brightness.",
    categoryId: 3,
    price: 89.99,
    originalPrice: 129.99,
    cost: 40.00,
    stock: 42,
    images: [
      "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=400&h=400&fit=crop",
    ],
    specifications: {
      material: "Metal + Fabric",
      dimensions: "30cm x 30cm x 50cm",
      weight: 1.5,
      color: "Black",
    },
    rating: 4.7,
    reviewCount: 178,
    weight: 1.5,
    dimensions: { length: 30, width: 30, height: 50 },
    isActive: true,
    isFeatured: true,
  },
  {
    sku: "LIGHT-002",
    name: "Floor Standing Lamp",
    slug: "floor-standing-lamp",
    description: "Tall floor lamp with arc design. Perfect for reading.",
    categoryId: 3,
    price: 179.99,
    originalPrice: 249.99,
    cost: 85.00,
    stock: 28,
    images: [
      "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=400&h=400&fit=crop",
    ],
    specifications: {
      material: "Metal",
      dimensions: "30cm x 30cm x 180cm",
      weight: 3.5,
      color: "Black",
    },
    rating: 4.8,
    reviewCount: 201,
    weight: 3.5,
    dimensions: { length: 30, width: 30, height: 180 },
    isActive: true,
    isFeatured: true,
  },
  {
    sku: "LIGHT-003",
    name: "Pendant Light Fixture",
    slug: "pendant-light-fixture",
    description: "Modern pendant light for dining areas.",
    categoryId: 3,
    price: 129.99,
    originalPrice: 179.99,
    cost: 60.00,
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=400&h=400&fit=crop",
    ],
    specifications: {
      material: "Metal + Glass",
      dimensions: "25cm diameter x 30cm height",
      weight: 1.2,
      color: "Matte Black",
    },
    rating: 4.6,
    reviewCount: 145,
    weight: 1.2,
    dimensions: { length: 25, width: 25, height: 30 },
    isActive: true,
    isFeatured: false,
  },
  {
    sku: "LIGHT-004",
    name: "Wall Sconce Light",
    slug: "wall-sconce-light",
    description: "Minimalist wall-mounted light fixture.",
    categoryId: 3,
    price: 99.99,
    originalPrice: 149.99,
    cost: 45.00,
    stock: 50,
    images: [
      "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=400&h=400&fit=crop",
    ],
    specifications: {
      material: "Metal",
      dimensions: "20cm x 20cm x 15cm",
      weight: 0.8,
      color: "White",
    },
    rating: 4.7,
    reviewCount: 167,
    weight: 0.8,
    dimensions: { length: 20, width: 20, height: 15 },
    isActive: true,
    isFeatured: false,
  },
  {
    sku: "LIGHT-005",
    name: "Ceiling Light Fixture",
    slug: "ceiling-light-fixture",
    description: "Modern ceiling light with minimalist design.",
    categoryId: 3,
    price: 149.99,
    originalPrice: 219.99,
    cost: 70.00,
    stock: 32,
    images: [
      "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=400&h=400&fit=crop",
    ],
    specifications: {
      material: "Metal + Acrylic",
      dimensions: "40cm diameter x 10cm height",
      weight: 2.0,
      color: "Matte Black",
    },
    rating: 4.8,
    reviewCount: 189,
    weight: 2.0,
    dimensions: { length: 40, width: 40, height: 10 },
    isActive: true,
    isFeatured: true,
  },
];

async function seedProducts() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    console.log("Starting product seeding...");

    // 确保分类存在
    const categories = [
      { name: "Furniture", slug: "furniture" },
      { name: "Decor", slug: "decor" },
      { name: "Lighting", slug: "lighting" },
    ];

    for (const cat of categories) {
      await connection.query(
        "INSERT IGNORE INTO categories (name, slug, isActive) VALUES (?, ?, true)",
        [cat.name, cat.slug]
      );
    }

    console.log("Categories ensured.");

    // 获取分类 ID
    const [categoryRows] = await connection.query(
      "SELECT id, slug FROM categories WHERE slug IN ('furniture', 'decor', 'lighting')"
    );

    const categoryMap = {};
    categoryRows.forEach((row) => {
      if (row.slug === "furniture") categoryMap[1] = row.id;
      if (row.slug === "decor") categoryMap[2] = row.id;
      if (row.slug === "lighting") categoryMap[3] = row.id;
    });

    console.log("Category mapping:", categoryMap);

    // 插入商品
    let insertedCount = 0;
    for (const product of productsData) {
      const categoryId = categoryMap[product.categoryId];
      if (!categoryId) {
        console.warn(`Category not found for product ${product.name}`);
        continue;
      }

      const imagesJson = JSON.stringify(product.images);
      const specificationsJson = JSON.stringify(product.specifications);
      const dimensionsJson = JSON.stringify(product.dimensions);

      try {
        await connection.query(
          `INSERT INTO products (
            sku, name, slug, description, categoryId, price, originalPrice, cost, stock,
            images, specifications, rating, reviewCount, weight, dimensions, isActive, isFeatured
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product.sku,
            product.name,
            product.slug,
            product.description,
            categoryId,
            product.price,
            product.originalPrice,
            product.cost,
            product.stock,
            imagesJson,
            specificationsJson,
            product.rating,
            product.reviewCount,
            product.weight,
            dimensionsJson,
            product.isActive,
            product.isFeatured,
          ]
        );
        insertedCount++;
        console.log(`✓ Inserted: ${product.name}`);
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          console.log(`⊘ Skipped (duplicate): ${product.name}`);
        } else {
          console.error(`✗ Error inserting ${product.name}:`, error.message);
        }
      }
    }

    console.log(`\n✅ Successfully inserted ${insertedCount} products`);
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await connection.end();
  }
}

seedProducts();
