import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// 使用 placeholder.com 的图片 URL，这是一个可靠的占位符图片服务
const placeholderImages = {
  furniture: [
    "https://via.placeholder.com/400x400?text=Minimalist+Table+Lamp",
    "https://via.placeholder.com/400x400?text=Floor+Standing+Lamp",
    "https://via.placeholder.com/400x400?text=Wall+Sconce+Light",
    "https://via.placeholder.com/400x400?text=Pendant+Light+Fixture",
    "https://via.placeholder.com/400x400?text=Ceiling+Light+Fixture",
    "https://via.placeholder.com/400x400?text=Minimalist+Bed+Frame",
    "https://via.placeholder.com/400x400?text=Nordic+Sofa",
    "https://via.placeholder.com/400x400?text=Wooden+Dining+Table",
    "https://via.placeholder.com/400x400?text=Office+Chair",
    "https://via.placeholder.com/400x400?text=Bookshelf+Unit",
  ],
  decor: [
    "https://via.placeholder.com/400x400?text=Wall+Art+Print",
    "https://via.placeholder.com/400x400?text=Ceramic+Vase",
    "https://via.placeholder.com/400x400?text=Area+Rug",
    "https://via.placeholder.com/400x400?text=Throw+Pillow",
    "https://via.placeholder.com/400x400?text=Wall+Mirror",
    "https://via.placeholder.com/400x400?text=Plant+Pot",
    "https://via.placeholder.com/400x400?text=Decorative+Bowl",
    "https://via.placeholder.com/400x400?text=Wall+Clock",
    "https://via.placeholder.com/400x400?text=Canvas+Painting",
    "https://via.placeholder.com/400x400?text=Decorative+Shelf",
  ],
  lighting: [
    "https://via.placeholder.com/400x400?text=Table+Lamp",
    "https://via.placeholder.com/400x400?text=Floor+Lamp",
    "https://via.placeholder.com/400x400?text=Pendant+Lamp",
    "https://via.placeholder.com/400x400?text=Wall+Lamp",
    "https://via.placeholder.com/400x400?text=Ceiling+Lamp",
    "https://via.placeholder.com/400x400?text=Desk+Lamp",
    "https://via.placeholder.com/400x400?text=String+Lights",
    "https://via.placeholder.com/400x400?text=Chandelier",
    "https://via.placeholder.com/400x400?text=Sconce+Light",
    "https://via.placeholder.com/400x400?text=LED+Strip+Light",
  ],
};

async function fixProductImages() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    console.log("Fetching all products...");
    const [products] = await connection.query("SELECT id, category FROM products");

    console.log(`Found ${products.length} products. Updating images...`);

    for (const product of products) {
      const categoryImages =
        placeholderImages[product.category] || placeholderImages.furniture;
      const randomImage =
        categoryImages[Math.floor(Math.random() * categoryImages.length)];

      const imageArray = JSON.stringify([randomImage]);

      await connection.query("UPDATE products SET images = ? WHERE id = ?", [
        imageArray,
        product.id,
      ]);
    }

    console.log(`✅ Successfully updated ${products.length} products with placeholder images`);
  } catch (error) {
    console.error("Error updating product images:", error);
  } finally {
    await connection.end();
  }
}

fixProductImages();
