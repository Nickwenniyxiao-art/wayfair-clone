# Digital Ocean MySQL Setup for Wayfair Clone

## 🎉 Setup Complete!

This document describes the complete setup of Digital Ocean MySQL database for the Wayfair Clone project.

---

## 📋 Infrastructure Overview

### Digital Ocean Server
- **IP Address**: 165.232.54.128
- **Operating System**: Ubuntu 24.04 LTS
- **CPU**: 2 vCPU
- **RAM**: 8GB
- **Storage**: 120GB SSD
- **Region**: SFO2 (San Francisco)

### MySQL Database
- **Version**: MySQL 8.0.45
- **Database Name**: wayfair_clone
- **Username**: wayfair
- **Password**: Wayfair2024Secure
- **Bind Address**: 127.0.0.1 (localhost only, for security)

---

## 🔐 Security Configuration

### SSH Key Authentication
- **Private Key Location**: `/home/ubuntu/do_mysql_key`
- **Key Type**: ED25519
- **Authentication Method**: SSH key-based (no password)

### MySQL Security
- MySQL is configured to **only listen on localhost** (127.0.0.1)
- External connections are **blocked** at the MySQL level
- All database traffic is **encrypted** through SSH tunnel
- User `wayfair` has access only to `wayfair_clone` database

---

## 🔌 Connection Setup

### SSH Tunnel
The project connects to Digital Ocean MySQL through an SSH tunnel:

```bash
ssh -i /home/ubuntu/do_mysql_key \
    -L 3306:127.0.0.1:3306 \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    -o ServerAliveInterval=60 \
    -o ServerAliveCountMax=3 \
    root@165.232.54.128 \
    -N -f
```

**What this does:**
- Creates a tunnel from local port 3306 to remote MySQL port 3306
- Keeps the connection alive with heartbeat every 60 seconds
- Runs in background (`-f` flag)

### Connection String
```
mysql://wayfair:Wayfair2024Secure@127.0.0.1:3306/wayfair_clone
```

---

## 🗄️ Database Schema

The following 11 tables have been successfully created:

1. **users** - User accounts and authentication
2. **categories** - Product categories
3. **products** - Product catalog
4. **cart_items** - Shopping cart items
5. **orders** - Customer orders
6. **order_items** - Items in each order
7. **payments** - Payment transactions
8. **reviews** - Product reviews
9. **user_addresses** - Shipping/billing addresses
10. **coupons** - Discount coupons
11. **inventory_logs** - Stock movement tracking

---

## ⚙️ Project Configuration

### Environment Variables
The project uses `CUSTOM_DATABASE_URL` environment variable:

```bash
CUSTOM_DATABASE_URL=mysql://wayfair:Wayfair2024Secure@127.0.0.1:3306/wayfair_clone
```

This variable is configured in:
- Manus platform secrets (for production)
- Local environment (for development)

### Modified Files

#### 1. `server/_core/env.ts`
```typescript
export const ENV = {
  // ...
  databaseUrl: process.env.CUSTOM_DATABASE_URL ?? process.env.DATABASE_URL ?? "",
  // ...
};
```

#### 2. `server/db.ts`
```typescript
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
```

#### 3. `drizzle.config.ts`
```typescript
const connectionString = process.env.CUSTOM_DATABASE_URL || process.env.DATABASE_URL;
```

---

## 🚀 Usage Instructions

### Starting the SSH Tunnel

The SSH tunnel should be running before starting the application. Check if it's running:

```bash
ps aux | grep "ssh.*165.232.54.128.*3306" | grep -v grep
```

If not running, start it:

```bash
ssh -i /home/ubuntu/do_mysql_key \
    -L 3306:127.0.0.1:3306 \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    -o ServerAliveInterval=60 \
    -o ServerAliveCountMax=3 \
    root@165.232.54.128 \
    -N -f
```

### Testing the Connection

```bash
mysql -h 127.0.0.1 -P 3306 -u wayfair -pWayfair2024Secure \
    -e "SELECT 'Connection OK' as status, VERSION() as version, DATABASE() as current_db;"
```

Expected output:
```
status          version                     current_db
Connection OK   8.0.45-0ubuntu0.24.04.1    NULL
```

### Running Database Migrations

```bash
cd /home/ubuntu/wayfair-clone
CUSTOM_DATABASE_URL="mysql://wayfair:Wayfair2024Secure@127.0.0.1:3306/wayfair_clone" pnpm drizzle-kit push
```

### Starting the Application

The application will automatically use the `CUSTOM_DATABASE_URL` environment variable:

```bash
cd /home/ubuntu/wayfair-clone
pnpm run dev
```

---

## 🧪 Testing

### Database Connection Test

Run the automated test suite:

```bash
cd /home/ubuntu/wayfair-clone
CUSTOM_DATABASE_URL="mysql://wayfair:Wayfair2024Secure@127.0.0.1:3306/wayfair_clone" pnpm test database.connection.test.ts
```

**Test Coverage:**
- ✅ Connection to Digital Ocean MySQL
- ✅ MySQL version verification (8.0.45)
- ✅ Database name verification (wayfair_clone)
- ✅ Table creation, insertion, query, and deletion

---

## 🔧 Troubleshooting

### SSH Tunnel Not Working

**Problem**: Cannot connect to MySQL through tunnel

**Solution**:
1. Check if tunnel is running: `ps aux | grep ssh | grep 165.232.54.128`
2. Check if port 3306 is in use: `sudo netstat -tlnp | grep 3306`
3. Kill existing tunnel: `pkill -f "ssh.*165.232.54.128.*3306"`
4. Restart tunnel using the command above

### Database Connection Failed

**Problem**: Application cannot connect to database

**Solution**:
1. Verify SSH tunnel is running
2. Test MySQL connection: `mysql -h 127.0.0.1 -P 3306 -u wayfair -pWayfair2024Secure`
3. Check environment variable: `echo $CUSTOM_DATABASE_URL`
4. Review application logs for connection errors

### Schema Migration Issues

**Problem**: Tables not created or schema out of sync

**Solution**:
```bash
# Drop all tables (CAUTION: This deletes all data!)
mysql -h 127.0.0.1 -P 3306 -u wayfair -pWayfair2024Secure wayfair_clone \
    -e "DROP DATABASE wayfair_clone; CREATE DATABASE wayfair_clone;"

# Push schema again
CUSTOM_DATABASE_URL="mysql://wayfair:Wayfair2024Secure@127.0.0.1:3306/wayfair_clone" \
    pnpm drizzle-kit push
```

---

## 📊 Monitoring

### Check Database Status

```bash
# Show all tables
mysql -h 127.0.0.1 -P 3306 -u wayfair -pWayfair2024Secure wayfair_clone -e "SHOW TABLES;"

# Show table structure
mysql -h 127.0.0.1 -P 3306 -u wayfair -pWayfair2024Secure wayfair_clone -e "DESCRIBE products;"

# Count records in tables
mysql -h 127.0.0.1 -P 3306 -u wayfair -pWayfair2024Secure wayfair_clone -e "
    SELECT 'users' as table_name, COUNT(*) as count FROM users
    UNION ALL SELECT 'products', COUNT(*) FROM products
    UNION ALL SELECT 'orders', COUNT(*) FROM orders;
"
```

### SSH Tunnel Health

```bash
# Check if tunnel is alive
ps aux | grep "ssh.*165.232.54.128" | grep -v grep

# Check port binding
sudo netstat -tlnp | grep 3306

# Test connection through tunnel
mysql -h 127.0.0.1 -P 3306 -u wayfair -pWayfair2024Secure -e "SELECT 1;"
```

---

## 🔄 Maintenance

### Backup Database

```bash
# Create backup
mysqldump -h 127.0.0.1 -P 3306 -u wayfair -pWayfair2024Secure wayfair_clone \
    > /home/ubuntu/wayfair_clone_backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
mysql -h 127.0.0.1 -P 3306 -u wayfair -pWayfair2024Secure wayfair_clone \
    < /home/ubuntu/wayfair_clone_backup_20260203_123456.sql
```

### Update SSH Key

If you need to regenerate the SSH key:

```bash
# On Digital Ocean server
ssh root@165.232.54.128
cat ~/.ssh/authorized_keys  # Copy the public key

# On Manus sandbox
# Replace the private key in /home/ubuntu/do_mysql_key
chmod 600 /home/ubuntu/do_mysql_key
```

---

## 📝 Important Notes

1. **SSH Tunnel Must Be Running**: The application cannot connect to the database without the SSH tunnel. Always ensure it's running before starting the app.

2. **Port 3306 Conflict**: If you have another MySQL instance running locally, it may conflict with the tunnel. Stop the local MySQL or use a different port.

3. **Environment Variables**: The `CUSTOM_DATABASE_URL` takes precedence over `DATABASE_URL`. This allows the project to use Digital Ocean MySQL instead of Manus built-in database.

4. **Security**: Never commit the SSH private key or database credentials to version control. They are stored securely in:
   - `/home/ubuntu/do_mysql_key` (SSH key)
   - Manus platform secrets (database URL)

5. **Production Deployment**: When deploying to production, ensure:
   - SSH tunnel is configured to start automatically
   - Environment variables are properly set
   - Firewall rules allow SSH connections from your deployment server

---

## 📚 Related Documentation

- [Digital Ocean MySQL Configuration](/home/ubuntu/digitalocean_mysql_config.md)
- [Startup Script](/home/ubuntu/wayfair-clone/start-with-do-mysql.sh)
- [Database Connection Test](/home/ubuntu/wayfair-clone/server/database.connection.test.ts)

---

## ✅ Setup Checklist

- [x] Digital Ocean server provisioned
- [x] MySQL 8.0.45 installed
- [x] Database `wayfair_clone` created
- [x] User `wayfair` created with proper permissions
- [x] MySQL configured to listen on localhost only
- [x] SSH key generated and configured
- [x] SSH tunnel tested and working
- [x] `CUSTOM_DATABASE_URL` environment variable set
- [x] Project code updated to use custom database
- [x] Database schema pushed (11 tables created)
- [x] Connection tests passing
- [x] Development server running with Digital Ocean MySQL

---

**Setup Date**: February 3, 2026  
**Status**: ✅ Complete and Operational
