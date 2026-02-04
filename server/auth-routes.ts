/**
 * 自建邮箱注册登录系统
 * 不依赖第三方 OAuth 服务
 */

import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { ENV } from "./_core/env";

// JWT secret
const JWT_SECRET = ENV.jwtSecret || "your-secret-key-change-this";

// 注册输入验证
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").optional(),
});

// 登录输入验证
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const authRouter = router({
  /**
   * 用户注册
   */
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }: { input: any }) => {
      const { email, password, name } = input;

      // 检查邮箱是否已存在
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建用户
      const [newUser] = await db.insert(users).values({
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
        loginMethod: "email",
        role: "user",
        status: "active",
      });

      // 生成 JWT token
      const token = jwt.sign(
        {
          userId: newUser.insertId,
          email,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return {
        success: true,
        token,
        user: {
          id: newUser.insertId,
          email,
          name: name || email.split("@")[0],
        },
      };
    }),

  /**
   * 用户登录
   */
  login: publicProcedure.input(loginSchema).mutation(async ({ input }: { input: any }) => {
    const { email, password } = input;

    // 查找用户
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    // 验证密码
    if (!user.password) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    // 检查账号状态
    if (user.status !== "active") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Account is inactive or banned",
      });
    }

    // 生成 JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 更新最后登录时间
    await db
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, user.id));

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }),

  /**
   * 获取当前用户信息
   */
  me: publicProcedure.query(async ({ ctx }: { ctx: any }) => {
    // 从 cookie 或 header 中获取 token
    const token =
      ctx.req.cookies?.token || ctx.req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return null;
    }

    try {
      // 验证 token
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
      };

      // 查询用户信息
      const db = await getDb();
      if (!db) return null;
      
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1);

      if (!user || user.status !== "active") {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      };
    } catch (error) {
      return null;
    }
  }),

  /**
   * 登出
   */
  logout: publicProcedure.mutation(async ({ ctx }: { ctx: any }) => {
    // 清除 cookie
    ctx.res.clearCookie("token");
    return { success: true };
  }),
});
