import { eq, and, gte, lte, like, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  products,
  categories,
  cartItems,
  orders,
  orderItems,
  payments,
  reviews,
  userAddresses,
  coupons,
  inventoryLogs,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && ENV.databaseUrl) {
    try {
      console.log("[Database] Connecting to:", ENV.databaseUrl.replace(/:[^:@]+@/, ':****@'));
      _db = drizzle(ENV.databaseUrl);
      console.log("[Database] Connected successfully");
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * User Management
 */
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
      email: user.email || `${user.openId}@temp.local`,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone", "avatar"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      // email 不允许 null
      if (field === "email") {
        values[field] = value as string;
        updateSet[field] = value;
        return;
      }
      const normalized = value ?? null;
      values[field] = normalized as any;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Product Management
 */
export async function getProducts(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .limit(limit)
    .offset(offset);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductBySku(sku: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(products)
    .where(eq(products.sku, sku))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchProducts(query: string, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        like(products.name, `%${query}%`)
      )
    )
    .limit(limit);
}

export async function getProductsByCategory(categoryId: number, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.categoryId, categoryId),
        eq(products.isActive, true)
      )
    )
    .limit(limit)
    .offset(offset);
}

export async function getFeaturedProducts(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isFeatured, true),
        eq(products.isActive, true)
      )
    )
    .limit(limit);
}

/**
 * Category Management
 */
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.displayOrder));
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Shopping Cart
 */
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.userId, userId));
}

export async function addCartItem(userId: number, productId: number, quantity: number, price: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(cartItems).values({
    userId,
    productId,
    quantity,
    price,
  });
  return result;
}

export async function updateCartItem(id: number, quantity: number) {
  const db = await getDb();
  if (!db) return null;

  return await db
    .update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, id));
}

export async function removeCartItem(id: number) {
  const db = await getDb();
  if (!db) return null;

  return await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) return null;

  return await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

/**
 * Order Management
 */
export async function createOrder(orderData: any) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(orders).values(orderData);
  return result;
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserOrders(userId: number, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function updateOrderStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) return null;

  return await db
    .update(orders)
    .set({ status: status as any })
    .where(eq(orders.id, id));
}

/**
 * Order Items
 */
export async function createOrderItems(items: any[]) {
  const db = await getDb();
  if (!db) return null;

  return await db.insert(orderItems).values(items);
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));
}

/**
 * Payment Management
 */
export async function createPayment(paymentData: any) {
  const db = await getDb();
  if (!db) return null;

  return await db.insert(payments).values(paymentData);
}

export async function getPaymentByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(payments)
    .where(eq(payments.orderId, orderId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePaymentStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) return null;

  return await db
    .update(payments)
    .set({ status: status as any })
    .where(eq(payments.id, id));
}

/**
 * Review Management
 */
export async function createReview(reviewData: any) {
  const db = await getDb();
  if (!db) return null;

  return await db.insert(reviews).values(reviewData);
}

export async function getProductReviews(productId: number, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(reviews)
    .where(
      and(
        eq(reviews.productId, productId),
        eq(reviews.status, "approved")
      )
    )
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset);
}

/**
 * Address Management
 */
export async function getUserAddresses(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(userAddresses)
    .where(eq(userAddresses.userId, userId));
}

export async function createUserAddress(addressData: any) {
  const db = await getDb();
  if (!db) return null;

  return await db.insert(userAddresses).values(addressData);
}

export async function updateUserAddress(id: number, addressData: any) {
  const db = await getDb();
  if (!db) return null;

  return await db
    .update(userAddresses)
    .set(addressData)
    .where(eq(userAddresses.id, id));
}

export async function deleteUserAddress(id: number) {
  const db = await getDb();
  if (!db) return null;

  return await db.delete(userAddresses).where(eq(userAddresses.id, id));
}

/**
 * Coupon Management
 */
export async function getCouponByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(coupons)
    .where(
      and(
        eq(coupons.code, code),
        eq(coupons.isActive, true)
      )
    )
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Inventory Management
 */
export async function createInventoryLog(logData: any) {
  const db = await getDb();
  if (!db) return null;

  return await db.insert(inventoryLogs).values(logData);
}

export async function updateProductStock(productId: number, newStock: number) {
  const db = await getDb();
  if (!db) return null;

  return await db
    .update(products)
    .set({ stock: newStock })
    .where(eq(products.id, productId));
}


/**
 * Database Initialization
 */
export async function initializeDatabase() {
  const db = await getDb();
  if (!db) {
    console.log("[Init] Database not available, skipping initialization");
    return;
  }

  try {
    // Check if categories already exist
    const existingCategories = await db.select().from(categories).limit(1);
    if (existingCategories.length > 0) {
      console.log("[Init] Database already initialized with data");
      return;
    }

    console.log("[Init] Seeding database with sample data...");

    // Insert categories
    const categoryInserts = [
      {
        name: "Furniture",
        slug: "furniture",
        description: "Home furniture and pieces",
        displayOrder: 1,
        isActive: true,
      },
      {
        name: "Decor",
        slug: "decor",
        description: "Home decoration items",
        displayOrder: 2,
        isActive: true,
      },
      {
        name: "Lighting",
        slug: "lighting",
        description: "Lighting fixtures and lamps",
        displayOrder: 3,
        isActive: true,
      },
    ];

    const insertedCategories = await db.insert(categories).values(categoryInserts);
    console.log("[Init] Categories inserted");

    // Get category IDs
    const allCategories = await db.select().from(categories);
    const categoryMap: Record<string, number> = {};
    allCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat.id;
    });

    // Insert products
    const productInserts = [
      {
        sku: "SOFA-001",
        name: "Modern Grey Sofa",
        slug: "modern-grey-sofa",
        description: "Comfortable 3-seater modern grey sofa perfect for any living room",
        categoryId: categoryMap["furniture"],
        price: "599.99",
        originalPrice: "799.99",
        stock: 15,
        rating: "4.5",
        reviewCount: 42,
        isFeatured: true,
        isActive: true,
        images: JSON.stringify(["https://via.placeholder.com/400x300?text=Grey+Sofa"]),
      },
      {
        sku: "CHAIR-001",
        name: "Leather Accent Chair",
        slug: "leather-accent-chair",
        description: "Premium leather accent chair with wooden legs",
        categoryId: categoryMap["furniture"],
        price: "349.99",
        originalPrice: "449.99",
        stock: 20,
        rating: "4.8",
        reviewCount: 28,
        isFeatured: true,
        isActive: true,
        images: JSON.stringify(["https://via.placeholder.com/400x300?text=Leather+Chair"]),
      },
      {
        sku: "TABLE-001",
        name: "Wooden Coffee Table",
        slug: "wooden-coffee-table",
        description: "Beautiful wooden coffee table with storage",
        categoryId: categoryMap["furniture"],
        price: "199.99",
        originalPrice: "299.99",
        stock: 25,
        rating: "4.3",
        reviewCount: 15,
        isFeatured: false,
        isActive: true,
        images: JSON.stringify(["https://via.placeholder.com/400x300?text=Coffee+Table"]),
      },
      {
        sku: "LAMP-001",
        name: "Modern Floor Lamp",
        slug: "modern-floor-lamp",
        description: "Sleek modern floor lamp with adjustable brightness",
        categoryId: categoryMap["lighting"],
        price: "89.99",
        originalPrice: "129.99",
        stock: 30,
        rating: "4.6",
        reviewCount: 52,
        isFeatured: true,
        isActive: true,
        images: JSON.stringify(["https://via.placeholder.com/400x300?text=Floor+Lamp"]),
      },
      {
        sku: "LAMP-002",
        name: "Pendant Light Fixture",
        slug: "pendant-light-fixture",
        description: "Contemporary pendant light with warm glow",
        categoryId: categoryMap["lighting"],
        price: "129.99",
        originalPrice: "179.99",
        stock: 18,
        rating: "4.7",
        reviewCount: 33,
        isFeatured: false,
        isActive: true,
        images: JSON.stringify(["https://via.placeholder.com/400x300?text=Pendant+Light"]),
      },
      {
        sku: "DECOR-001",
        name: "Wall Art Canvas",
        slug: "wall-art-canvas",
        description: "Abstract wall art canvas print for modern homes",
        categoryId: categoryMap["decor"],
        price: "79.99",
        originalPrice: "119.99",
        stock: 40,
        rating: "4.4",
        reviewCount: 21,
        isFeatured: true,
        isActive: true,
        images: JSON.stringify(["https://via.placeholder.com/400x300?text=Wall+Art"]),
      },
      {
        sku: "DECOR-002",
        name: "Decorative Throw Pillow",
        slug: "decorative-throw-pillow",
        description: "Soft and comfortable throw pillow with modern design",
        categoryId: categoryMap["decor"],
        price: "34.99",
        originalPrice: "49.99",
        stock: 50,
        rating: "4.5",
        reviewCount: 67,
        isFeatured: false,
        isActive: true,
        images: JSON.stringify(["https://via.placeholder.com/400x300?text=Throw+Pillow"]),
      },
      {
        sku: "DECOR-003",
        name: "Ceramic Vase",
        slug: "ceramic-vase",
        description: "Elegant ceramic vase for flowers and decoration",
        categoryId: categoryMap["decor"],
        price: "59.99",
        originalPrice: "89.99",
        stock: 35,
        rating: "4.2",
        reviewCount: 18,
        isFeatured: false,
        isActive: true,
        images: JSON.stringify(["https://via.placeholder.com/400x300?text=Ceramic+Vase"]),
      },
    ];

    await db.insert(products).values(productInserts as any);
    console.log("[Init] Products inserted successfully");
  } catch (error) {
    console.error("[Init] Error initializing database:", error);
    // Don't throw - allow app to continue even if initialization fails
    // This is useful for local development without a database
  }
}
