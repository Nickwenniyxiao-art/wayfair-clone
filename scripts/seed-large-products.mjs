import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// 生成大量商品数据
function generateProducts() {
  const furnitureNames = [
    "Minimalist White Sofa",
    "Natural Oak Dining Table",
    "Scandinavian Lounge Chair",
    "Minimalist Bookshelf",
    "White Marble Coffee Table",
    "Minimalist Bed Frame",
    "Storage Cabinet",
    "Nesting Side Tables",
    "Beige Fabric Armchair",
    "Walnut Wood Desk",
    "Light Gray Sectional Sofa",
    "Bamboo Shelving Unit",
    "Minimalist Console Table",
    "White Leather Ottoman",
    "Oak Wood Bench",
    "Minimalist TV Stand",
    "White Dining Chairs Set",
    "Minimalist Bar Stools",
    "Natural Linen Sofa",
    "Minimalist Shoe Rack",
    "White Pendant Shelves",
    "Scandinavian Coffee Table",
    "Minimalist Wardrobe",
    "Natural Wood Nightstand",
    "Minimalist Desk Chair",
  ];

  const decorNames = [
    "Abstract Wall Art Print",
    "Ceramic Vase Set",
    "Wool Area Rug",
    "Minimalist Wall Clock",
    "Wooden Decorative Boxes",
    "Canvas Wall Tapestry",
    "Minimalist Plant Pot",
    "Throw Pillow Set",
    "Wooden Wall Shelf",
    "Scandinavian Wall Mirror",
    "Geometric Wall Decal",
    "Minimalist Picture Frame",
    "White Ceramic Planter",
    "Natural Fiber Basket",
    "Minimalist Wall Hanging",
    "Linen Curtains",
    "Minimalist Bookends",
    "Scandinavian Pendant",
    "White Marble Coasters",
    "Minimalist Wall Hooks",
    "Woven Wall Hanging",
    "Minimalist Table Runner",
    "Natural Wood Cutting Board",
    "Scandinavian Throw Blanket",
    "Minimalist Desk Organizer",
    "White Ceramic Bowls",
    "Natural Stone Vase",
    "Minimalist Wall Art Collection",
    "Scandinavian Candle Holder",
    "Minimalist Plant Stand",
  ];

  const lightingNames = [
    "Pendant Light Fixture",
    "Minimalist Table Lamp",
    "Floor Standing Lamp",
    "Wall Sconce Light",
    "Ceiling Light Fixture",
    "Minimalist Desk Lamp",
    "Scandinavian Floor Lamp",
    "Minimalist Wall Light",
    "Pendant Light Cluster",
    "Minimalist String Lights",
    "Scandinavian Table Lamp",
    "Minimalist Bedside Lamp",
    "Ceiling Pendant Light",
    "Minimalist Reading Lamp",
    "Scandinavian Wall Sconce",
    "Minimalist Track Lighting",
    "Pendant Light Set",
    "Minimalist Lamp Base",
    "Scandinavian Pendant Lights",
    "Minimalist Accent Light",
  ];

  const descriptions = [
    "A sleek and modern design perfect for contemporary living spaces. Features clean lines and comfortable seating.",
    "Elegant piece crafted from sustainable materials. Perfect for family gatherings with its spacious surface.",
    "Comfortable and stylish with wooden legs and soft upholstery. Ideal for reading corners.",
    "Clean-lined design with floating shelves. Perfect for displaying books and decorative items.",
    "Statement piece with elegant proportions. Adds sophistication to any room.",
    "Low-profile design with clean lines. Perfect for creating a serene bedroom.",
    "Ample storage space with minimalist aesthetic. Perfect for organizing living spaces.",
    "Set of two pieces. Perfect for small spaces with their compact design.",
    "Soft and inviting with premium upholstery. Great for relaxation areas.",
    "Functional workspace with natural finish. Perfect for home offices.",
    "Spacious and comfortable seating solution. Great for family rooms.",
    "Eco-friendly storage with natural materials. Perfect for modern homes.",
    "Sleek design with minimal footprint. Great for entryways.",
    "Premium leather with minimalist design. Perfect for contemporary spaces.",
    "Sturdy construction with natural wood finish. Great for seating.",
    "Modern entertainment center with clean lines. Perfect for living rooms.",
    "Set of comfortable seating. Great for dining areas.",
    "Compact and stylish seating solution. Perfect for kitchens.",
    "Soft and durable with natural fibers. Great for living spaces.",
    "Organized storage with minimalist design. Perfect for entryways.",
  ];

  const prices = [
    "39.99",
    "49.99",
    "59.99",
    "69.99",
    "79.99",
    "89.99",
    "99.99",
    "119.99",
    "129.99",
    "149.99",
    "179.99",
    "199.99",
    "249.99",
    "299.99",
    "349.99",
    "399.99",
    "449.99",
    "499.99",
    "599.99",
    "699.99",
    "799.99",
    "899.99",
  ];

  const images = [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1533090161392-a8255ba20aa8?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1584622281867-8a748c1b98f4?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1540932239986-310128078ceb?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1567538096051-b6643b1c9b0c?w=500&h=500&fit=crop",
  ];

  const products = [];

  // 生成家具
  for (let i = 0; i < furnitureNames.length; i++) {
    for (let j = 0; j < 2; j++) {
      products.push({
        name: j === 0 ? furnitureNames[i] : `${furnitureNames[i]} - Variant ${j}`,
        description: descriptions[i % descriptions.length],
        category: "Furniture",
        price: prices[(i + j) % prices.length],
        stock: Math.floor(Math.random() * 50) + 5,
        image_url: images[i % images.length],
        rating: (Math.random() * 0.4 + 4.5).toFixed(1),
        reviews_count: Math.floor(Math.random() * 50) + 5,
      });
    }
  }

  // 生成装饰品
  for (let i = 0; i < decorNames.length; i++) {
    for (let j = 0; j < 2; j++) {
      products.push({
        name: j === 0 ? decorNames[i] : `${decorNames[i]} - Variant ${j}`,
        description: descriptions[i % descriptions.length],
        category: "Decor",
        price: prices[(i + j) % prices.length],
        stock: Math.floor(Math.random() * 60) + 10,
        image_url: images[i % images.length],
        rating: (Math.random() * 0.4 + 4.5).toFixed(1),
        reviews_count: Math.floor(Math.random() * 40) + 5,
      });
    }
  }

  // 生成照明
  for (let i = 0; i < lightingNames.length; i++) {
    for (let j = 0; j < 2; j++) {
      products.push({
        name: j === 0 ? lightingNames[i] : `${lightingNames[i]} - Variant ${j}`,
        description: descriptions[i % descriptions.length],
        category: "Lighting",
        price: prices[(i + j) % prices.length],
        stock: Math.floor(Math.random() * 40) + 8,
        image_url: images[i % images.length],
        rating: (Math.random() * 0.4 + 4.5).toFixed(1),
        reviews_count: Math.floor(Math.random() * 35) + 5,
      });
    }
  }

  return products;
}

async function seedProducts() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    console.log("Starting large-scale product seeding...");

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
      } else {
        const [result] = await connection.execute(
          "INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)",
          [cat.name, cat.slug, `${cat.name} collection`]
        );
        categoryMap[cat.name] = result.insertId;
      }
    }

    // Generate and insert products
    const products = generateProducts();
    console.log(`Generated ${products.length} products...`);

    let addedCount = 0;
    for (const product of products) {
      const sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const slug = `${product.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")}-${Math.random().toString(36).substr(2, 5)}`;

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
      addedCount++;

      if (addedCount % 10 === 0) {
        console.log(`✓ Added ${addedCount}/${products.length} products...`);
      }
    }

    console.log(`\n✅ Successfully seeded ${addedCount} products!`);
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await connection.end();
  }
}

seedProducts();
