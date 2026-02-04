import { describe, it, expect } from 'vitest';
import { getDb } from './db';
import { products, categories } from '../drizzle/schema';
import { count } from 'drizzle-orm';

describe('Public Database Connection', () => {
  it('should connect to Digital Ocean MySQL via public IP and query products', async () => {
    const db = await getDb();
    
    // Test products query
    const result = await db.select({ count: count() }).from(products);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    const productCount = result[0].count;
    expect(productCount).toBeGreaterThan(0);
    console.log(`✅ Found ${productCount} products in public database`);
  });

  it('should query categories from public database', async () => {
    const db = await getDb();
    
    // Test categories query
    const result = await db.select({ count: count() }).from(categories);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    const categoryCount = result[0].count;
    expect(categoryCount).toBe(3);
    console.log(`✅ Found ${categoryCount} categories in public database`);
  });

  it('should query all categories with names', async () => {
    const db = await getDb();
    
    // Test full categories query
    const result = await db.select().from(categories);
    expect(result).toBeDefined();
    expect(result.length).toBe(3);
    
    const categoryNames = result.map(c => c.name).sort();
    expect(categoryNames).toEqual(['Decor', 'Furniture', 'Lighting']);
    console.log(`✅ Categories: ${categoryNames.join(', ')}`);
  });
});
