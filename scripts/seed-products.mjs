import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const products = [
  // 家具 - Furniture
  {
    name: "Minimalist White Sofa",
    description:
      "A sleek and modern white sofa perfect for contemporary living spaces. Features clean lines and comfortable seating.",
    category: "Furniture",
    price: "899.99",
    stock: 15,
    image_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
    rating: "4.8",
    reviews_count: 24,
  },
  {
    name: "Natural Oak Dining Table",
    description:
      "Elegant dining table crafted from sustainable oak wood. Perfect for family gatherings with its spacious surface.",
    category: "Furniture",
    price: "599.99",
    stock: 8,
    image_url:
      "https://images.unsplash.com/photo-1533090161392-a8255ba20aa8?w=500&h=500&fit=crop",
    rating: "4.7",
    reviews_count: 18,
  },
  {
    name: "Scandinavian Lounge Chair",
    description:
      "Comfortable and stylish lounge chair with wooden legs and soft upholstery. Ideal for reading corners.",
    category: "Furniture",
    price: "349.99",
    stock: 20,
    image_url:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=500&fit=crop",
    rating: "4.9",
    reviews_count: 32,
  },
  {
    name: "Minimalist Bookshelf",
    description:
      "Clean-lined bookshelf with floating shelves. Perfect for displaying books and decorative items.",
    category: "Furniture",
    price: "249.99",
    stock: 12,
    image_url:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop",
    rating: "4.6",
    reviews_count: 15,
  },
  {
    name: "White Marble Coffee Table",
    description:
      "Elegant coffee table with white marble top and metal frame. A statement piece for any living room.",
    category: "Furniture",
    price: "399.99",
    stock: 10,
    image_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
    rating: "4.8",
    reviews_count: 22,
  },

  // 装饰品 - Decor
  {
    name: "Abstract Wall Art Print",
    description:
      "Minimalist abstract art print in black and white. Perfect for adding a modern touch to any room.",
    category: "Decor",
    price: "79.99",
    stock: 50,
    image_url:
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    rating: "4.5",
    reviews_count: 12,
  },
  {
    name: "Ceramic Vase Set",
    description:
      "Set of three minimalist ceramic vases in neutral tones. Great for displaying fresh flowers.",
    category: "Decor",
    price: "89.99",
    stock: 25,
    image_url:
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    rating: "4.7",
    reviews_count: 14,
  },
  {
    name: "Wool Area Rug",
    description:
      "Handwoven wool rug with geometric pattern. Adds warmth and texture to any space.",
    category: "Decor",
    price: "199.99",
    stock: 8,
    image_url:
      "https://images.unsplash.com/photo-1584622281867-8a748c1b98f4?w=500&h=500&fit=crop",
    rating: "4.8",
    reviews_count: 19,
  },
  {
    name: "Minimalist Wall Clock",
    description:
      "Simple and elegant wall clock with clean design. Perfect for Scandinavian interiors.",
    category: "Decor",
    price: "59.99",
    stock: 30,
    image_url:
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    rating: "4.6",
    reviews_count: 11,
  },
  {
    name: "Wooden Decorative Boxes",
    description:
      "Set of nesting wooden boxes for storage and display. Natural finish with clean lines.",
    category: "Decor",
    price: "69.99",
    stock: 35,
    image_url:
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    rating: "4.5",
    reviews_count: 9,
  },
  {
    name: "Canvas Wall Tapestry",
    description:
      "Large canvas tapestry with minimalist design. Adds visual interest without overwhelming the space.",
    category: "Decor",
    price: "129.99",
    stock: 15,
    image_url:
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    rating: "4.7",
    reviews_count: 13,
  },

  // 照明 - Lighting
  {
    name: "Pendant Light Fixture",
    description:
      "Modern pendant light with minimalist design. Perfect for dining areas or kitchens.",
    category: "Lighting",
    price: "149.99",
    stock: 18,
    image_url:
      "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop",
    rating: "4.8",
    reviews_count: 20,
  },
  {
    name: "Minimalist Table Lamp",
    description:
      "Sleek table lamp with adjustable brightness. Ideal for reading or working.",
    category: "Lighting",
    price: "99.99",
    stock: 25,
    image_url:
      "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop",
    rating: "4.7",
    reviews_count: 17,
  },
  {
    name: "Floor Standing Lamp",
    description:
      "Tall floor lamp with clean lines and warm light. Perfect for creating ambient lighting.",
    category: "Lighting",
    price: "179.99",
    stock: 12,
    image_url:
      "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop",
    rating: "4.9",
    reviews_count: 25,
  },
  {
    name: "Wall Sconce Light",
    description:
      "Minimalist wall sconce with soft glow. Great for accent lighting in bedrooms or hallways.",
    category: "Lighting",
    price: "89.99",
    stock: 20,
    image_url:
      "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop",
    rating: "4.6",
    reviews_count: 14,
  },
  {
    name: "Ceiling Light Fixture",
    description:
      "Modern ceiling light with minimalist design. Provides bright, even lighting for any room.",
    category: "Lighting",
    price: "119.99",
    stock: 22,
    image_url:
      "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop",
    rating: "4.7",
    reviews_count: 16,
  },

  // 更多家具
  {
    name: "Minimalist Bed Frame",
    description:
      "Low-profile bed frame with clean lines. Perfect for creating a serene bedroom.",
    category: "Furniture",
    price: "449.99",
    stock: 10,
    image_url:
      "https://images.unsplash.com/photo-1540932239986-310128078ceb?w=500&h=500&fit=crop",
    rating: "4.8",
    reviews_count: 21,
  },
  {
    name: "Storage Cabinet",
    description:
      "Minimalist storage cabinet with ample space. Perfect for organizing living spaces.",
    category: "Furniture",
    price: "299.99",
    stock: 14,
    image_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    rating: "4.7",
    reviews_count: 18,
  },
  {
    name: "Nesting Side Tables",
    description:
      "Set of two minimalist side tables. Perfect for small spaces with their compact design.",
    category: "Furniture",
    price: "179.99",
    stock: 16,
    image_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
    rating: "4.6",
    reviews_count: 12,
  },

  // 更多装饰品
  {
    name: "Minimalist Plant Pot",
    description:
      "Simple ceramic plant pot in white. Perfect for displaying your favorite plants.",
    category: "Decor",
    price: "39.99",
    stock: 40,
    image_url:
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    rating: "4.5",
    reviews_count: 8,
  },
  {
    name: "Throw Pillow Set",
    description:
      "Set of four minimalist throw pillows. Adds comfort and style to any sofa.",
    category: "Decor",
    price: "99.99",
    stock: 30,
    image_url:
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    rating: "4.7",
    reviews_count: 16,
  },
  {
    name: "Wooden Wall Shelf",
    description:
      "Minimalist wooden shelf for displaying books and decorative items.",
    category: "Decor",
    price: "59.99",
    stock: 28,
    image_url:
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    rating: "4.6",
    reviews_count: 10,
  },
];

async function seedProducts() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    console.log("Starting product seeding...");

    // First, ensure categories exist
    const categories = [
      { name: "Furniture", slug: "furniture" },
      { name: "Decor", slug: "decor" },
      { name: "Lighting", slug: "lighting" },
    ];

    const categoryMap = {};

    for (const cat of categories) {
      const [existingCat] = await connection.execute(
        "SELECT id FROM categories WHERE slug = ?",
        [cat.slug]
      );

      if (existingCat.length > 0) {
        categoryMap[cat.name] = existingCat[0].id;
        console.log(`✓ Category exists: ${cat.name} (ID: ${existingCat[0].id})`);
      } else {
        const [result] = await connection.execute(
          "INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)",
          [cat.name, cat.slug, `${cat.name} collection`]
        );
        categoryMap[cat.name] = result.insertId;
        console.log(`✓ Created category: ${cat.name} (ID: ${result.insertId})`);
      }
    }

    // Then insert products
    for (const product of products) {
      const sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const slug = product.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      const query = `
        INSERT INTO products (
          sku, name, slug, description, categoryId, price, stock, images, rating, reviewCount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        sku,
        product.name,
        slug,
        product.description,
        categoryMap[product.category],
        product.price,
        product.stock,
        JSON.stringify([product.image_url]),
        product.rating,
        product.reviews_count,
      ];

      await connection.execute(query, values);
      console.log(`✓ Added: ${product.name}`);
    }

    console.log(`\n✅ Successfully seeded ${products.length} products!`);
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await connection.end();
  }
}

seedProducts();
