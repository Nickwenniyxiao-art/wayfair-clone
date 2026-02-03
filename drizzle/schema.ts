import {
  int,
  varchar,
  text,
  decimal,
  timestamp,
  mysqlEnum,
  mysqlTable,
  index,
  json,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * 用户表 - 核心用户信息和认证
 */
export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }).unique(),
    phone: varchar("phone", { length: 20 }),
    avatar: text("avatar"),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    status: mysqlEnum("status", ["active", "inactive", "banned"])
      .default("active")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    roleIdx: index("role_idx").on(table.role),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 用户地址表 - 配送和账单地址
 */
export const userAddresses = mysqlTable(
  "user_addresses",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    type: mysqlEnum("type", ["shipping", "billing", "both"])
      .default("both")
      .notNull(),
    recipientName: varchar("recipientName", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    street: text("street").notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }),
    zipCode: varchar("zipCode", { length: 20 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    isDefault: boolean("isDefault").default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
  })
);

export type UserAddress = typeof userAddresses.$inferSelect;
export type InsertUserAddress = typeof userAddresses.$inferInsert;

/**
 * 商品分类表
 */
export const categories = mysqlTable(
  "categories",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    icon: text("icon"),
    parentId: int("parentId"),
    displayOrder: int("displayOrder").default(0),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    slugIdx: index("slug_idx").on(table.slug),
    parentIdIdx: index("parent_id_idx").on(table.parentId),
  })
);

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * 商品表
 */
export const products = mysqlTable(
  "products",
  {
    id: int("id").autoincrement().primaryKey(),
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    categoryId: int("categoryId").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal("originalPrice", { precision: 10, scale: 2 }),
    cost: decimal("cost", { precision: 10, scale: 2 }),
    stock: int("stock").default(0).notNull(),
    images: json("images"), // Array of image URLs
    specifications: json("specifications"), // Product specifications
    rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
    reviewCount: int("reviewCount").default(0),
    weight: decimal("weight", { precision: 8, scale: 2 }), // kg
    dimensions: json("dimensions"), // { length, width, height }
    isActive: boolean("isActive").default(true),
    isFeatured: boolean("isFeatured").default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    categoryIdIdx: index("category_id_idx").on(table.categoryId),
    skuIdx: index("sku_idx").on(table.sku),
    slugIdx: index("slug_idx").on(table.slug),
    nameIdx: index("name_idx").on(table.name),
  })
);

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * 购物车表
 */
export const cartItems = mysqlTable(
  "cart_items",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    productId: int("productId").notNull(),
    quantity: int("quantity").default(1).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(), // 购物车中的价格快照
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    productIdIdx: index("product_id_idx").on(table.productId),
  })
);

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * 订单表
 */
export const orders = mysqlTable(
  "orders",
  {
    id: int("id").autoincrement().primaryKey(),
    orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
    userId: int("userId").notNull(),
    status: mysqlEnum("status", [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ])
      .default("pending")
      .notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    shippingCost: decimal("shippingCost", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    taxCost: decimal("taxCost", { precision: 10, scale: 2 }).default("0"),
    discountAmount: decimal("discountAmount", { precision: 10, scale: 2 })
      .default("0"),
    totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
    shippingAddressId: int("shippingAddressId"),
    billingAddressId: int("billingAddressId"),
    notes: text("notes"),
    trackingNumber: varchar("trackingNumber", { length: 100 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    deliveredAt: timestamp("deliveredAt"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    orderNumberIdx: index("order_number_idx").on(table.orderNumber),
    statusIdx: index("status_idx").on(table.status),
    createdAtIdx: index("created_at_idx").on(table.createdAt),
  })
);

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * 订单项目表 - 订单中的商品
 */
export const orderItems = mysqlTable(
  "order_items",
  {
    id: int("id").autoincrement().primaryKey(),
    orderId: int("orderId").notNull(),
    productId: int("productId").notNull(),
    productName: varchar("productName", { length: 255 }).notNull(),
    productSku: varchar("productSku", { length: 100 }).notNull(),
    quantity: int("quantity").notNull(),
    unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index("order_id_idx").on(table.orderId),
    productIdIdx: index("product_id_idx").on(table.productId),
  })
);

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * 支付表
 */
export const payments = mysqlTable(
  "payments",
  {
    id: int("id").autoincrement().primaryKey(),
    orderId: int("orderId").notNull().unique(),
    userId: int("userId").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    paymentMethod: mysqlEnum("paymentMethod", [
      "credit_card",
      "debit_card",
      "paypal",
      "stripe",
      "bank_transfer",
    ]).notNull(),
    stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 100 }),
    status: mysqlEnum("status", [
      "pending",
      "processing",
      "succeeded",
      "failed",
      "cancelled",
      "refunded",
    ])
      .default("pending")
      .notNull(),
    transactionId: varchar("transactionId", { length: 100 }),
    failureReason: text("failureReason"),
    refundAmount: decimal("refundAmount", { precision: 10, scale: 2 })
      .default("0"),
    refundedAt: timestamp("refundedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index("order_id_idx").on(table.orderId),
    userIdIdx: index("user_id_idx").on(table.userId),
    statusIdx: index("status_idx").on(table.status),
  })
);

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * 商品评价表
 */
export const reviews = mysqlTable(
  "reviews",
  {
    id: int("id").autoincrement().primaryKey(),
    productId: int("productId").notNull(),
    userId: int("userId").notNull(),
    orderId: int("orderId"),
    rating: int("rating").notNull(), // 1-5
    title: varchar("title", { length: 200 }),
    content: text("content"),
    images: json("images"), // Array of review image URLs
    isVerified: boolean("isVerified").default(false),
    helpful: int("helpful").default(0),
    unhelpful: int("unhelpful").default(0),
    status: mysqlEnum("status", ["pending", "approved", "rejected"])
      .default("pending")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    productIdIdx: index("product_id_idx").on(table.productId),
    userIdIdx: index("user_id_idx").on(table.userId),
    ratingIdx: index("rating_idx").on(table.rating),
  })
);

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * 优惠券表
 */
export const coupons = mysqlTable(
  "coupons",
  {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    type: mysqlEnum("type", ["percentage", "fixed_amount"]).notNull(),
    value: decimal("value", { precision: 10, scale: 2 }).notNull(),
    maxDiscount: decimal("maxDiscount", { precision: 10, scale: 2 }),
    minOrderAmount: decimal("minOrderAmount", { precision: 10, scale: 2 })
      .default("0"),
    usageLimit: int("usageLimit"),
    usageCount: int("usageCount").default(0),
    perUserLimit: int("perUserLimit").default(1),
    startDate: timestamp("startDate").notNull(),
    endDate: timestamp("endDate").notNull(),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    codeIdx: index("code_idx").on(table.code),
    startDateIdx: index("start_date_idx").on(table.startDate),
    endDateIdx: index("end_date_idx").on(table.endDate),
  })
);

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;

/**
 * 库存日志表 - 跟踪库存变化
 */
export const inventoryLogs = mysqlTable(
  "inventory_logs",
  {
    id: int("id").autoincrement().primaryKey(),
    productId: int("productId").notNull(),
    orderId: int("orderId"),
    changeType: mysqlEnum("changeType", [
      "purchase",
      "return",
      "restock",
      "adjustment",
    ]).notNull(),
    quantity: int("quantity").notNull(),
    previousStock: int("previousStock").notNull(),
    newStock: int("newStock").notNull(),
    reason: text("reason"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    productIdIdx: index("product_id_idx").on(table.productId),
    orderIdIdx: index("order_id_idx").on(table.orderId),
  })
);

export type InventoryLog = typeof inventoryLogs.$inferSelect;
export type InsertInventoryLog = typeof inventoryLogs.$inferInsert;

/**
 * 关系定义
 */
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(userAddresses),
  orders: many(orders),
  cartItems: many(cartItems),
  reviews: many(reviews),
  payments: many(payments),
}));

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  reviews: many(reviews),
  inventoryLogs: many(inventoryLogs),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  payment: one(payments, {
    fields: [orders.id],
    references: [payments.orderId],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const inventoryLogsRelations = relations(inventoryLogs, ({ one }) => ({
  product: one(products, {
    fields: [inventoryLogs.productId],
    references: [products.id],
  }),
}));
