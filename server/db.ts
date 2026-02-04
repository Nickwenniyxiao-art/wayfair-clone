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
