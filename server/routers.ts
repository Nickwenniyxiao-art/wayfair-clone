import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { authRouter } from "./auth-routes";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

/**
 * Product Router
 */
const productRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        categoryId: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (input.search) {
        return await db.searchProducts(input.search, input.limit);
      }
      if (input.categoryId) {
        return await db.getProductsByCategory(input.categoryId, input.limit, input.offset);
      }
      return await db.getProducts(input.limit, input.offset);
    }),

  detail: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const product = await db.getProductById(input.id);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      return product;
    }),

  featured: publicProcedure.query(async () => {
    return await db.getFeaturedProducts(10);
  }),

  categories: publicProcedure.query(async () => {
    return await db.getCategories();
  }),
});

/**
 * Cart Router
 */
const cartRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.getCartItems(ctx.user.id);
  }),

  add: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await db.getProductById(input.productId);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      if (product.stock < input.quantity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient stock",
        });
      }

      await db.addCartItem(
        ctx.user.id,
        input.productId,
        input.quantity,
        product.price
      );

      return { success: true };
    }),

  update: protectedProcedure
    .input(
      z.object({
        cartItemId: z.number(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      await db.updateCartItem(input.cartItemId, input.quantity);
      return { success: true };
    }),

  remove: protectedProcedure
    .input(z.object({ cartItemId: z.number() }))
    .mutation(async ({ input }) => {
      await db.removeCartItem(input.cartItemId);
      return { success: true };
    }),

  clear: protectedProcedure.mutation(async ({ ctx }) => {
    await db.clearCart(ctx.user.id);
    return { success: true };
  }),
});

/**
 * Order Router
 */
const orderRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      return await db.getUserOrders(ctx.user.id, input.limit, input.offset);
    }),

  detail: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const order = await db.getOrderById(input.id);
      if (!order || order.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }
      const items = await db.getOrderItems(order.id);
      return { ...order, items };
    }),

  create: protectedProcedure
    .input(
      z.object({
        shippingAddressId: z.number(),
        billingAddressId: z.number().optional(),
        couponCode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get cart items
      const cartItems = await db.getCartItems(ctx.user.id);
      if (cartItems.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cart is empty",
        });
      }

      // Calculate totals
      let subtotal = 0;
      for (const item of cartItems) {
        subtotal += Number(item.price) * item.quantity;
      }

      let discountAmount = 0;
      if (input.couponCode) {
        const coupon = await db.getCouponByCode(input.couponCode);
        if (!coupon) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Coupon not found",
          });
        }

        if (coupon.type === "percentage") {
          discountAmount = (subtotal * Number(coupon.value)) / 100;
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
          }
        } else {
          discountAmount = Number(coupon.value);
        }
      }

      const shippingCost = 10; // TODO: Calculate based on address
      const taxCost = (subtotal - discountAmount) * 0.08; // 8% tax
      const totalAmount = subtotal - discountAmount + shippingCost + taxCost;

      // Create order
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const order = await db.createOrder({
        orderNumber,
        userId: ctx.user.id,
        status: "pending",
        subtotal: subtotal.toString(),
        shippingCost: shippingCost.toString(),
        taxCost: taxCost.toString(),
        discountAmount: discountAmount.toString(),
        totalAmount: totalAmount.toString(),
        shippingAddressId: input.shippingAddressId,
        billingAddressId: input.billingAddressId || input.shippingAddressId,
      });

      // Create order items
      const orderItemsData = cartItems.map((item) => ({
        orderId: (order as any).insertId,
        productId: item.productId,
        productName: "", // TODO: Get from product
        productSku: "", // TODO: Get from product
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: (Number(item.price) * item.quantity).toString(),
      }));

      await db.createOrderItems(orderItemsData);

      // Clear cart
      await db.clearCart(ctx.user.id);

      return {
        orderId: (order as any).insertId,
        orderNumber,
        totalAmount,
      };
    }),
});

/**
 * Payment Router
 */
const paymentRouter = router({
  createIntent: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await db.getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      // TODO: Create Stripe payment intent
      return {
        clientSecret: "test_secret",
        amount: Number(order.totalAmount),
      };
    }),

  confirm: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        paymentIntentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await db.getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      // TODO: Verify payment with Stripe
      // Update order status
      await db.updateOrderStatus(input.orderId, "confirmed");

      // Create payment record
      await db.createPayment({
        orderId: input.orderId,
        userId: ctx.user.id,
        amount: order.totalAmount,
        currency: "USD",
        paymentMethod: "stripe",
        stripePaymentIntentId: input.paymentIntentId,
        status: "succeeded",
        transactionId: input.paymentIntentId,
      });

      return { success: true };
    }),
});

/**
 * User Router
 */
const userRouter = router({
  profile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  addresses: protectedProcedure.query(async ({ ctx }) => {
    return await db.getUserAddresses(ctx.user.id);
  }),

  addAddress: protectedProcedure
    .input(
      z.object({
        type: z.enum(["shipping", "billing", "both"]),
        recipientName: z.string(),
        phone: z.string(),
        street: z.string(),
        city: z.string(),
        state: z.string().optional(),
        zipCode: z.string(),
        country: z.string(),
        isDefault: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.createUserAddress({
        userId: ctx.user.id,
        ...input,
      });
      return { success: true };
    }),

  updateAddress: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        ...z.object({
          type: z.enum(["shipping", "billing", "both"]),
          recipientName: z.string(),
          phone: z.string(),
          street: z.string(),
          city: z.string(),
          state: z.string().optional(),
          zipCode: z.string(),
          country: z.string(),
          isDefault: z.boolean().optional(),
        }).shape,
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateUserAddress(id, data);
      return { success: true };
    }),

  deleteAddress: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteUserAddress(input.id);
      return { success: true };
    }),
});

/**
 * Review Router
 */
const reviewRouter = router({
  list: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return await db.getProductReviews(input.productId, input.limit, input.offset);
    }),

  create: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string().optional(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.createReview({
        productId: input.productId,
        userId: ctx.user.id,
        rating: input.rating,
        title: input.title,
        content: input.content,
        status: "pending",
      });
      return { success: true };
    }),
});

/**
 * Main App Router
 */
export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  product: productRouter,
  cart: cartRouter,
  order: orderRouter,
  payment: paymentRouter,
  user: userRouter,
  review: reviewRouter,
});

export type AppRouter = typeof appRouter;
