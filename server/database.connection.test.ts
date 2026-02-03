import { describe, it, expect } from "vitest";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

describe("Database Connection Test", () => {
  it("should connect to Digital Ocean MySQL successfully", async () => {
    const db = await getDb();
    expect(db).toBeDefined();
    
    if (!db) {
      throw new Error("Database connection failed");
    }
    
    // Test basic connection
    const result: any = await db.execute(sql`SELECT 1 as test`);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    // Drizzle mysql2 returns [rows, fields]
    const [rows] = result;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveProperty("test");
    expect(rows[0].test).toBe(1);
  });

  it("should verify MySQL version", async () => {
    const db = await getDb();
    expect(db).toBeDefined();
    
    if (!db) {
      throw new Error("Database connection failed");
    }
    
    const result: any = await db.execute(sql`SELECT VERSION() as version`);
    expect(result).toBeDefined();
    
    const [rows] = result;
    expect(rows[0]).toHaveProperty("version");
    const version = rows[0].version as string;
    // Verify it's MySQL 8.0
    expect(version).toContain("8.0");
  });

  it("should verify database name", async () => {
    const db = await getDb();
    expect(db).toBeDefined();
    
    if (!db) {
      throw new Error("Database connection failed");
    }
    
    const result: any = await db.execute(sql`SELECT DATABASE() as db_name`);
    expect(result).toBeDefined();
    
    const [rows] = result;
    expect(rows[0]).toHaveProperty("db_name");
    const dbName = rows[0].db_name as string;
    // Verify it's the wayfair_clone database
    expect(dbName).toBe("wayfair_clone");
  });

  it("should be able to create and drop a test table", async () => {
    const db = await getDb();
    expect(db).toBeDefined();
    
    if (!db) {
      throw new Error("Database connection failed");
    }
    
    // Drop table first to ensure clean state
    await db.execute(sql`DROP TABLE IF EXISTS test_connection`);
    
    // Create test table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS test_connection (
        id INT PRIMARY KEY AUTO_INCREMENT,
        test_value VARCHAR(255)
      )
    `);

    // Insert test data
    await db.execute(sql`
      INSERT INTO test_connection (test_value) VALUES ('test')
    `);

    // Query test data
    const result: any = await db.execute(sql`
      SELECT * FROM test_connection WHERE test_value = 'test'
    `);
    
    const [rows] = result;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveProperty("test_value");
    expect(rows[0].test_value).toBe("test");

    // Clean up
    await db.execute(sql`DROP TABLE test_connection`);
  });
});
