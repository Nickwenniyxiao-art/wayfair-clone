import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD || "Ds(?{4{fQ[jC\qE=",
  database: "wayfair_clone",
  socketPath: "/cloudsql/cohesive-poetry-486213-q3:us-central1:wayfair-mysql",
});

try {
  console.log("Seeding database...");

  // Insert categories
  const categories = [
    {
      name: "Furniture",
      slug: "furniture",
      description: "Home furniture and pieces",
      displayOrder: 1,
    },
    {
      name: "Decor",
      slug: "decor",
      description: "Home decoration items",
      displayOrder: 2,
    },
    {
      name: "Lighting",
      slug: "lighting",
      description: "Lighting fixtures and lamps",
      displayOrder: 3,
    },
  ];

  for (const cat of categories) {
    await connection.execute(
      "INSERT INTO categories (name, slug, description, displayOrder, isActive) VALUES (?, ?, ?, ?, true)",
      [cat.name, cat.slug, cat.description, cat.displayOrder]
    );
  }
  console.log("✓ Categories inserted");

  // Get category IDs
  const [categories_result] = await connection.execute(
    "SELECT id, slug FROM categories"
  );
  const categoryMap = {};
  categories_result.forEach((cat) => {
    categoryMap[cat.slug] = cat.id;
  });

  // Insert products
  const products = [
    {
      sku: "SOFA-001",
      name: "Modern Grey Sofa",
      slug: "modern-grey-sofa",
      description: "Comfortable 3-seater modern grey sofa perfect for any living room",
      categoryId: categoryMap["furniture"],
      price: 599.99,
      originalPrice: 799.99,
      stock: 15,
      rating: 4.5,
      reviewCount: 42,
      isFeatured: true,
      images: JSON.stringify([
        "https://via.placeholder.com/400x300?text=Grey+Sofa",
      ]),
    },
    {
      sku: "CHAIR-001",
      name: "Leather Accent Chair",
      slug: "leather-accent-chair",
      description: "Premium leather accent chair with wooden legs",
      categoryId: categoryMap["furniture"],
      price: 349.99,
      originalPrice: 449.99,
      stock: 20,
      rating: 4.8,
      reviewCount: 28,
      isFeatured: true,
      images: JSON.stringify([
        "https://via.placeholder.com/400x300?text=Leather+Chair",
      ]),
    },
    {
      sku: "TABLE-001",
      name: "Wooden Coffee Table",
      slug: "wooden-coffee-table",
      description: "Beautiful wooden coffee table with storage",
      categoryId: categoryMap["furniture"],
      price: 199.99,
      originalPrice: 299.99,
      stock: 25,
      rating: 4.3,
      reviewCount: 15,
      isFeatured: false,
      images: JSON.stringify([
        "https://via.placeholder.com/400x300?text=Coffee+Table",
      ]),
    },
    {
      sku: "LAMP-001",
      name: "Modern Floor Lamp",
      slug: "modern-floor-lamp",
      description: "Sleek modern floor lamp with adjustable brightness",
      categoryId: categoryMap["lighting"],
      price: 89.99,
      originalPrice: 129.99,
      stock: 30,
      rating: 4.6,
      reviewCount: 52,
      isFeatured: true,
      images: JSON.stringify([
        "https://via.placeholder.com/400x300?text=Floor+Lamp",
      ]),
    },
    {
      sku: "LAMP-002",
      name: "Pendant Light Fixture",
      slug: "pendant-light-fixture",
      description: "Contemporary pendant light with warm glow",
      categoryId: categoryMap["lighting"],
      price: 129.99,
      originalPrice: 179.99,
      stock: 18,
      rating: 4.7,
      reviewCount: 33,
      isFeatured: false,
      images: JSON.stringify([
        "https://via.placeholder.com/400x300?text=Pendant+Light",
      ]),
    },
    {
      sku: "DECOR-001",
      name: "Wall Art Canvas",
      slug: "wall-art-canvas",
      description: "Abstract wall art canvas print for modern homes",
      categoryId: categoryMap["decor"],
      price: 79.99,
      originalPrice: 119.99,
      stock: 40,
      rating: 4.4,
      reviewCount: 21,
      isFeatured: true,
      images: JSON.stringify([
        "https://via.placeholder.com/400x300?text=Wall+Art",
      ]),
    },
    {
      sku: "DECOR-002",
      name: "Decorative Throw Pillow",
      slug: "decorative-throw-pillow",
      description: "Soft and comfortable throw pillow with modern design",
      categoryId: categoryMap["decor"],
      price: 34.99,
      originalPrice: 49.99,
      stock: 50,
      rating: 4.5,
      reviewCount: 67,
      isFeatured: false,
      images: JSON.stringify([
        "https://via.placeholder.com/400x300?text=Throw+Pillow",
      ]),
    },
    {
      sku: "DECOR-003",
      name: "Ceramic Vase",
      slug: "ceramic-vase",
      description: "Elegant ceramic vase for flowers and decoration",
      categoryId: categoryMap["decor"],
      price: 59.99,
      originalPrice: 89.99,
      stock: 35,
      rating: 4.2,
      reviewCount: 18,
      isFeatured: false,
      images: JSON.stringify([
        "https://via.placeholder.com/400x300?text=Ceramic+Vase",
      ]),
    },
  ];

  for (const product of products) {
    await connection.execute(
      `INSERT INTO products 
       (sku, name, slug, description, categoryId, price, originalPrice, stock, rating, reviewCount, isFeatured, images, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true)`,
      [
        product.sku,
        product.name,
        product.slug,
        product.description,
        product.categoryId,
        product.price,
        product.originalPrice,
        product.stock,
        product.rating,
        product.reviewCount,
        product.isFeatured,
        product.images,
      ]
    );
  }
  console.log("✓ Products inserted");

  console.log("✅ Database seeding completed successfully!");
} catch (error) {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
} finally {
  await connection.end();
}
