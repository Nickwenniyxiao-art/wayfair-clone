import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// 生成 200 个真实的北欧极简风格商品数据
function generateProducts() {
  const products = [];
  
  // 家具类商品 (70 个)
  const furnitureNames = [
    "Minimalist White Dining Table",
    "Nordic Wooden Bed Frame",
    "Minimalist Gray Sofa",
    "White Wooden Bookshelf",
    "Minimalist Office Chair",
    "Scandinavian Coffee Table",
    "Modern Side Table",
    "Minimalist Desk",
    "Nordic Wardrobe",
    "Wooden Nightstand",
    "Minimalist Bench",
    "Scandinavian Cabinet",
    "Modern Shelving Unit",
    "Minimalist Dining Chair",
    "Nordic Console Table",
    "Minimalist TV Stand",
    "Wooden Storage Rack",
    "Scandinavian Dresser",
    "Minimalist Sofa Bed",
    "Nordic Accent Chair",
    "Minimalist Armchair",
    "Scandinavian Lounge Chair",
    "Minimalist Ottoman",
    "Nordic Footstool",
    "Minimalist Credenza",
    "Scandinavian Sideboard",
    "Minimalist Bar Stool",
    "Nordic Counter Stool",
    "Minimalist Dining Bench",
    "Scandinavian Bookcase",
    "Minimalist Wall Shelf",
    "Nordic Floating Shelf",
    "Minimalist Coat Rack",
    "Scandinavian Shoe Rack",
    "Minimalist Entryway Table",
    "Nordic Mirror Cabinet",
    "Minimalist Bathroom Vanity",
    "Scandinavian Bathroom Cabinet",
    "Minimalist Bedroom Set",
    "Nordic Bunk Bed",
    "Minimalist Loft Bed",
    "Scandinavian Platform Bed",
    "Minimalist Daybed",
    "Nordic Trundle Bed",
    "Minimalist Murphy Bed",
    "Scandinavian Sofa Set",
    "Minimalist Sectional",
    "Nordic Chaise Lounge",
    "Minimalist Recliner",
    "Scandinavian Sleeper Sofa",
    "Minimalist Futon",
    "Nordic Bed Frame",
    "Minimalist Headboard",
    "Scandinavian Footboard",
    "Minimalist Mattress",
    "Nordic Pillow",
    "Minimalist Bedding Set",
    "Scandinavian Duvet Cover",
    "Minimalist Throw Blanket",
    "Nordic Bed Skirt",
    "Minimalist Cushion",
    "Scandinavian Throw Pillow",
    "Minimalist Desk Lamp",
    "Nordic Task Chair",
    "Minimalist Filing Cabinet",
    "Scandinavian Desk Organizer",
    "Minimalist Bookend",
    "Nordic Magazine Rack",
    "Minimalist Umbrella Stand",
    "Scandinavian Shoe Cabinet",
    "Minimalist Coat Hanger",
  ];

  // 装饰品类商品 (70 个)
  const decorNames = [
    "Nordic Wall Art Print",
    "Ceramic Vase Set",
    "Gray Area Rug",
    "Minimalist Wall Mirror",
    "White Ceramic Plant Pot",
    "Scandinavian Wall Clock",
    "Minimalist Canvas Print",
    "Nordic Wooden Frame",
    "Minimalist Throw Pillow",
    "Scandinavian Cushion Cover",
    "Minimalist Wall Decal",
    "Nordic Tapestry",
    "Minimalist Macrame Wall Hanging",
    "Scandinavian Wreath",
    "Minimalist Wall Sconce",
    "Nordic Pendant Light",
    "Minimalist Ceiling Light",
    "Scandinavian Chandelier",
    "Minimalist Desk Organizer",
    "Nordic Storage Box",
    "Minimalist Woven Basket",
    "Scandinavian Rattan Basket",
    "Minimalist Wooden Box",
    "Nordic Decorative Tray",
    "Minimalist Candle Holder",
    "Scandinavian Candle",
    "Minimalist Diffuser",
    "Nordic Air Freshener",
    "Minimalist Room Spray",
    "Scandinavian Essential Oil",
    "Minimalist Incense Holder",
    "Nordic Incense Sticks",
    "Minimalist Coaster Set",
    "Scandinavian Placemat",
    "Minimalist Table Runner",
    "Nordic Tablecloth",
    "Minimalist Napkin",
    "Scandinavian Dish Towel",
    "Minimalist Hand Towel",
    "Nordic Bath Towel",
    "Minimalist Shower Curtain",
    "Scandinavian Bath Mat",
    "Minimalist Toilet Brush",
    "Nordic Trash Bin",
    "Minimalist Soap Dispenser",
    "Scandinavian Toothbrush Holder",
    "Minimalist Tissue Box",
    "Nordic Paper Towel Holder",
    "Minimalist Picture Ledge",
    "Scandinavian Wall Shelf",
    "Minimalist Floating Shelf",
    "Nordic Corner Shelf",
    "Minimalist Ladder Shelf",
    "Scandinavian Wall Cabinet",
    "Minimalist Glass Vase",
    "Nordic Flower Pot",
    "Minimalist Terrarium",
    "Scandinavian Succulent Planter",
    "Minimalist Hanging Planter",
    "Nordic Wall Planter",
    "Minimalist Plant Stand",
    "Scandinavian Plant Hanger",
    "Minimalist Faux Plant",
    "Nordic Artificial Flower",
    "Minimalist Dried Flower",
    "Scandinavian Flower Arrangement",
    "Minimalist Decorative Ball",
    "Nordic Wooden Sphere",
    "Minimalist Marble Sculpture",
    "Scandinavian Stone Figurine",
    "Minimalist Metal Art",
  ];

  // 照明类商品 (60 个)
  const lightingNames = [
    "Minimalist Table Lamp",
    "Floor Standing Lamp",
    "Pendant Light Fixture",
    "Wall Sconce Light",
    "Ceiling Light Fixture",
    "Desk Lamp",
    "Reading Lamp",
    "Bedside Lamp",
    "Accent Lamp",
    "Ambient Light",
    "Task Lighting",
    "Track Light",
    "Spotlight",
    "Recessed Light",
    "Flush Mount Light",
    "Semi-Flush Light",
    "Chandelier",
    "Crystal Chandelier",
    "Modern Chandelier",
    "Minimalist Chandelier",
    "Nordic Pendant",
    "Hanging Light",
    "Suspended Light",
    "Drop Light",
    "Island Light",
    "Kitchen Light",
    "Dining Light",
    "Living Room Light",
    "Bedroom Light",
    "Bathroom Light",
    "Hallway Light",
    "Entryway Light",
    "Outdoor Light",
    "Garden Light",
    "Patio Light",
    "Wall Lamp",
    "Wall Light",
    "Bracket Light",
    "Swing Arm Lamp",
    "Arc Lamp",
    "Floor Lamp",
    "Tripod Lamp",
    "Torchiere Lamp",
    "Uplighter",
    "Downlighter",
    "Spotlight",
    "Floodlight",
    "String Light",
    "Fairy Light",
    "LED Light",
    "Smart Light",
    "Dimmable Light",
    "Color Changing Light",
    "Warm White Light",
    "Cool White Light",
    "Daylight Light",
    "Solar Light",
    "Battery Light",
    "Rechargeable Light",
    "USB Light",
  ];

  let id = 1;
  
  // 生成家具类商品
  for (let i = 0; i < furnitureNames.length; i++) {
    const name = furnitureNames[i];
    const basePrice = 99 + Math.random() * 700;
    const price = Math.round(basePrice * 100) / 100;
    const originalPrice = Math.round(price * 1.3 * 100) / 100;
    
    products.push({
      sku: `FURN-${String(i + 1).padStart(3, "0")}`,
      name: name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description: `High-quality ${name.toLowerCase()} with minimalist Nordic design. Perfect for modern homes and contemporary spaces.`,
      categoryId: 1, // Furniture
      price: price,
      originalPrice: originalPrice,
      cost: Math.round(price * 0.5 * 100) / 100,
      stock: Math.floor(Math.random() * 50) + 10,
      images: [
        `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&q=80`,
        `https://images.unsplash.com/photo-1540932239986-310128078ceb?w=400&h=400&fit=crop&q=80`,
      ],
      specifications: {
        material: ["Oak Wood", "Birch Wood", "Pine Wood", "Walnut Wood"][Math.floor(Math.random() * 4)],
        color: ["Natural", "White", "Black", "Gray"][Math.floor(Math.random() * 4)],
        style: "Minimalist Nordic",
      },
      rating: (Math.random() * 0.4 + 4.5).toFixed(1),
      reviewCount: Math.floor(Math.random() * 300) + 50,
      weight: Math.round((Math.random() * 80 + 10) * 100) / 100,
      dimensions: {
        length: Math.floor(Math.random() * 200) + 50,
        width: Math.floor(Math.random() * 100) + 30,
        height: Math.floor(Math.random() * 150) + 30,
      },
      isActive: true,
      isFeatured: Math.random() > 0.7,
    });
  }

  // 生成装饰品类商品
  for (let i = 0; i < decorNames.length; i++) {
    const name = decorNames[i];
    const basePrice = 19 + Math.random() * 200;
    const price = Math.round(basePrice * 100) / 100;
    const originalPrice = Math.round(price * 1.4 * 100) / 100;
    
    products.push({
      sku: `DECOR-${String(i + 1).padStart(3, "0")}`,
      name: name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description: `Beautiful ${name.toLowerCase()} with Scandinavian design. Add Nordic minimalism to your home.`,
      categoryId: 2, // Decor
      price: price,
      originalPrice: originalPrice,
      cost: Math.round(price * 0.4 * 100) / 100,
      stock: Math.floor(Math.random() * 100) + 20,
      images: [
        `https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop&q=80`,
        `https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&q=80`,
      ],
      specifications: {
        material: ["Ceramic", "Wood", "Metal", "Glass", "Fabric"][Math.floor(Math.random() * 5)],
        color: ["White", "Gray", "Black", "Natural", "Beige"][Math.floor(Math.random() * 5)],
        style: "Scandinavian",
      },
      rating: (Math.random() * 0.4 + 4.4).toFixed(1),
      reviewCount: Math.floor(Math.random() * 250) + 30,
      weight: Math.round((Math.random() * 5 + 0.5) * 100) / 100,
      dimensions: {
        length: Math.floor(Math.random() * 50) + 10,
        width: Math.floor(Math.random() * 50) + 10,
        height: Math.floor(Math.random() * 50) + 10,
      },
      isActive: true,
      isFeatured: Math.random() > 0.8,
    });
  }

  // 生成照明类商品
  for (let i = 0; i < lightingNames.length; i++) {
    const name = lightingNames[i];
    const basePrice = 39 + Math.random() * 300;
    const price = Math.round(basePrice * 100) / 100;
    const originalPrice = Math.round(price * 1.35 * 100) / 100;
    
    products.push({
      sku: `LIGHT-${String(i + 1).padStart(3, "0")}`,
      name: name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description: `Modern ${name.toLowerCase()} with minimalist design. Perfect lighting solution for any space.`,
      categoryId: 3, // Lighting
      price: price,
      originalPrice: originalPrice,
      cost: Math.round(price * 0.45 * 100) / 100,
      stock: Math.floor(Math.random() * 60) + 15,
      images: [
        `https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=400&h=400&fit=crop&q=80`,
        `https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=400&h=400&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&q=80`,
      ],
      specifications: {
        material: ["Metal", "Glass", "Ceramic", "Wood"][Math.floor(Math.random() * 4)],
        color: ["Black", "White", "Gray", "Natural"][Math.floor(Math.random() * 4)],
        wattage: [40, 60, 75, 100][Math.floor(Math.random() * 4)],
      },
      rating: (Math.random() * 0.4 + 4.6).toFixed(1),
      reviewCount: Math.floor(Math.random() * 280) + 40,
      weight: Math.round((Math.random() * 5 + 0.8) * 100) / 100,
      dimensions: {
        length: Math.floor(Math.random() * 40) + 15,
        width: Math.floor(Math.random() * 40) + 15,
        height: Math.floor(Math.random() * 100) + 30,
      },
      isActive: true,
      isFeatured: Math.random() > 0.75,
    });
  }

  return products;
}

async function seedProducts() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    console.log("Generating 200 products...");
    const products = generateProducts();
    console.log(`Generated ${products.length} products`);

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
    let skippedCount = 0;
    
    for (const product of products) {
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
        if (insertedCount % 20 === 0) {
          console.log(`✓ Inserted ${insertedCount} products...`);
        }
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          skippedCount++;
        } else {
          console.error(`✗ Error inserting ${product.name}:`, error.message);
        }
      }
    }

    console.log(`\n✅ Successfully inserted ${insertedCount} products`);
    if (skippedCount > 0) {
      console.log(`⊘ Skipped ${skippedCount} duplicate products`);
    }
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await connection.end();
  }
}

seedProducts();
