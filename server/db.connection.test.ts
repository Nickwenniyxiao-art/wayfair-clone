import { describe, it, expect } from 'vitest';
import { getDb } from './db';
import { products } from '../drizzle/schema';
import { sql } from 'drizzle-orm';

describe('Database Connection via SSH Tunnel', () => {
  it('should connect to MySQL database successfully', async () => {
    // Test basic database connectivity
    const db = await getDb();
    expect(db).toBeDefined();
    const [rows]: any = await db!.execute(sql`SELECT 1 as test`);
    expect(rows).toBeDefined();
    expect(rows.length).toBeGreaterThan(0);
  });

  it('should verify database name is wayfair_clone', async () => {
    const db = await getDb();
    const [rows]: any = await db!.execute(sql`SELECT DATABASE() as db_name`);
    expect(rows[0].db_name).toBe('wayfair_clone');
  });

  it('should have 200 products in the database', async () => {
    const db = await getDb();
    const [rows]: any = await db!.execute(sql`SELECT COUNT(*) as count FROM products`);
    expect(rows[0].count).toBe(200);
  });

  it('should be able to query products table', async () => {
    const db = await getDb();
    const productList = await db!.select().from(products).limit(5);
    expect(productList).toBeDefined();
    expect(productList.length).toBeGreaterThan(0);
    expect(productList[0]).toHaveProperty('id');
    expect(productList[0]).toHaveProperty('name');
    expect(productList[0]).toHaveProperty('price');
  });

  it('should verify MySQL version is 8.x', async () => {
    const db = await getDb();
    const [rows]: any = await db!.execute(sql`SELECT VERSION() as version`);
    const version = rows[0].version as string;
    expect(version).toMatch(/^8\./);
  });
});
