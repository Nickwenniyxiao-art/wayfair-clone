# Google Cloud SQL Credentials

## Instance Information
- **Instance ID**: wayfair-mysql
- **Connection Name**: cohesive-poetry-486213-q3:us-central1:wayfair-mysql
- **Region**: us-central1 (Iowa)
- **Database Version**: MySQL 8.4
- **Machine Type**: db-custom-2-8192 (2 vCPU, 8 GB RAM)
- **Storage**: 10 GB SSD
- **Port**: 3306

## Root User Credentials
- **Username**: root
- **Password**: `hm|A}ve#"J-P?9Z7`

## Connection Details
- **Public IP**: Will be available after instance creation completes
- **Public IP Connection**: Enabled
- **Private IP Connection**: Disabled

## Next Steps
1. Wait for instance creation to complete (takes a few minutes)
2. Get the public IP address from the Cloud SQL console
3. Create `wayfair_clone` database
4. Export data from Digital Ocean MySQL
5. Import data to Cloud SQL
6. Update Cloud Run environment variable `CUSTOM_DATABASE_URL`
7. Redeploy Cloud Run service

## Connection String Format
```
mysql://root:hm|A}ve#"J-P?9Z7@<PUBLIC_IP>:3306/wayfair_clone
```

**Note**: Replace `<PUBLIC_IP>` with the actual public IP address once instance is ready.
