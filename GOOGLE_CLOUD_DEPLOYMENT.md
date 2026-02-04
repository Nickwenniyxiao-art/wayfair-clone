# Google Cloud Deployment Guide - Wayfair Clone with Digital Ocean MySQL

This guide explains how to deploy the Wayfair Clone application to Google Cloud Run with a direct connection to your Digital Ocean MySQL database.

## Architecture

```
┌─────────────────────┐         ┌──────────────────────────┐
│  Google Cloud Run   │────────▶│  Digital Ocean MySQL     │
│  (Wayfair Clone)    │         │  165.232.54.128:3306     │
│  us-central1        │         │  wayfair_clone database  │
└─────────────────────┘         └──────────────────────────┘
```

## Prerequisites

1. **Google Cloud Project**
   - Project ID (e.g., `my-wayfair-project`)
   - Billing enabled
   - APIs enabled: Cloud Run, Cloud Build, Container Registry

2. **Digital Ocean MySQL Database**
   - Host: 165.232.54.128
   - Port: 3306
   - Database: wayfair_clone
   - User: wayfair
   - Password: Wayfair2024Secure!

3. **GitHub Repository** (optional, for automatic deployment)
   - Code pushed to GitHub
   - Cloud Build trigger configured

## Step 1: Configure Google Cloud Project

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Step 2: Build Docker Image

```bash
# Navigate to project directory
cd /path/to/wayfair-clone

# Build the Docker image
docker build -t gcr.io/$PROJECT_ID/wayfair-clone:latest .

# Test locally (optional)
docker run -p 3000:3000 \
  -e CUSTOM_DATABASE_URL="mysql://wayfair:Wayfair2024Secure!@165.232.54.128:3306/wayfair_clone" \
  -e NODE_ENV=production \
  gcr.io/$PROJECT_ID/wayfair-clone:latest

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/wayfair-clone:latest
```

## Step 3: Deploy to Cloud Run

### Option A: Deploy via gcloud CLI (Recommended)

```bash
gcloud run deploy wayfair-clone \
  --image=gcr.io/$PROJECT_ID/wayfair-clone:latest \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=2Gi \
  --cpu=2 \
  --timeout=300 \
  --max-instances=10 \
  --set-env-vars="CUSTOM_DATABASE_URL=mysql://wayfair:Wayfair2024Secure!@165.232.54.128:3306/wayfair_clone,NODE_ENV=production"
```

### Option B: Deploy via Cloud Console

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click "Create Service"
3. Select "Deploy one revision from an existing container image"
4. Choose your image: `gcr.io/$PROJECT_ID/wayfair-clone:latest`
5. Configure:
   - **Service name**: wayfair-clone
   - **Region**: us-central1
   - **Authentication**: Allow unauthenticated invocations
   - **Memory**: 2 GiB
   - **CPU**: 2
   - **Request timeout**: 300 seconds
6. Add environment variable:
   - **Name**: `CUSTOM_DATABASE_URL`
   - **Value**: `mysql://wayfair:Wayfair2024Secure!@165.232.54.128:3306/wayfair_clone`
7. Click "Create"

## Step 4: Get Cloud Run Outbound IP Ranges

Cloud Run uses dynamic IP addresses. You need to allow Google Cloud IP ranges in Digital Ocean firewall.

### Get Google Cloud IP Ranges

```bash
# Download Google Cloud IP ranges
curl -s https://www.gstatic.com/ipranges/cloud.json | jq -r '.prefixes[] | select(.scope=="us-central1") | .ipv4Prefix' | grep -v null

# This will output IP ranges like:
# 34.72.0.0/16
# 35.184.0.0/13
# 35.192.0.0/14
# etc.
```

### Alternative: Use Cloud NAT for Static IP

For a static outbound IP, configure Cloud NAT:

```bash
# Create VPC network
gcloud compute networks create wayfair-vpc --subnet-mode=custom

# Create subnet
gcloud compute networks subnets create wayfair-subnet \
  --network=wayfair-vpc \
  --region=us-central1 \
  --range=10.0.0.0/24

# Reserve static IP
gcloud compute addresses create wayfair-nat-ip \
  --region=us-central1

# Get the static IP
gcloud compute addresses describe wayfair-nat-ip \
  --region=us-central1 \
  --format="get(address)"

# Create Cloud Router
gcloud compute routers create wayfair-router \
  --network=wayfair-vpc \
  --region=us-central1

# Create Cloud NAT
gcloud compute routers nats create wayfair-nat \
  --router=wayfair-router \
  --region=us-central1 \
  --nat-external-ip-pool=wayfair-nat-ip \
  --nat-all-subnet-ip-ranges

# Deploy Cloud Run with VPC connector
gcloud run deploy wayfair-clone \
  --image=gcr.io/$PROJECT_ID/wayfair-clone:latest \
  --region=us-central1 \
  --vpc-connector=wayfair-connector \
  --vpc-egress=all-traffic \
  [other options...]
```

## Step 5: Configure Digital Ocean Firewall

### Option A: Allow Google Cloud IP Ranges (Simple)

1. Go to Digital Ocean Cloud Firewall settings
2. Add inbound rules for MySQL (port 3306):
   - **Type**: MySQL
   - **Protocol**: TCP
   - **Port**: 3306
   - **Sources**: Add Google Cloud IP ranges from Step 4
   
Example IP ranges to add:
```
34.72.0.0/16
35.184.0.0/13
35.192.0.0/14
35.196.0.0/14
35.200.0.0/13
```

### Option B: Use Static IP with Cloud NAT (Recommended)

1. Complete Cloud NAT setup from Step 4
2. Get your static IP address
3. Add only this single IP to Digital Ocean firewall:
   - **Type**: MySQL
   - **Protocol**: TCP
   - **Port**: 3306
   - **Sources**: Your static IP (e.g., `34.72.123.45/32`)

## Step 6: Test Database Connection

### Test from Cloud Run

```bash
# Get Cloud Run service URL
export SERVICE_URL=$(gcloud run services describe wayfair-clone \
  --region=us-central1 \
  --format="value(status.url)")

# Test API endpoint
curl $SERVICE_URL/api/trpc/product.list?input=%7B%22json%22%3A%7B%22limit%22%3A5%7D%7D

# Should return 5 products from database
```

### Check Cloud Run Logs

```bash
# View logs
gcloud run services logs read wayfair-clone \
  --region=us-central1 \
  --limit=50

# Look for database connection messages:
# [Database] Connecting to: mysql://wayfair:****@165.232.54.128:3306/wayfair_clone
# [Database] Connected successfully
```

## Step 7: Configure Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service=wayfair-clone \
  --domain=www.yourwayfair.com \
  --region=us-central1

# Follow instructions to update DNS records
```

## Step 8: Set Up Automatic Deployment with Cloud Build

### Create Cloud Build Trigger

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Click "Create Trigger"
3. Configure:
   - **Name**: deploy-wayfair-clone
   - **Event**: Push to branch
   - **Source**: Connect your GitHub repository
   - **Branch**: `^main$`
   - **Configuration**: Cloud Build configuration file
   - **Location**: `cloudbuild.yaml`
4. Add substitution variables:
   - `_DATABASE_URL`: `mysql://wayfair:Wayfair2024Secure!@165.232.54.128:3306/wayfair_clone`
5. Click "Create"

### Update cloudbuild.yaml

The existing `cloudbuild.yaml` needs to be updated to use `CUSTOM_DATABASE_URL`:

```yaml
--set-env-vars=CUSTOM_DATABASE_URL=$_DATABASE_URL,NODE_ENV=production
```

## Troubleshooting

### Issue 1: Connection Refused

**Symptom**: `ECONNREFUSED 165.232.54.128:3306`

**Solution**:
- Verify Digital Ocean firewall allows Cloud Run IP ranges
- Check MySQL is listening on 0.0.0.0:3306
- Verify user 'wayfair' has access from '%' or specific IP

### Issue 2: Lost Connection at 'reading initial communication packet'

**Symptom**: Same error we had before

**Solution**:
- This indicates application-layer blocking
- Use Cloud NAT with static IP (Step 4, Option B)
- Contact Digital Ocean support to verify no DDoS protection is blocking MySQL

### Issue 3: Authentication Failed

**Symptom**: `Access denied for user 'wayfair'@'<ip>'`

**Solution**:
```sql
-- On Digital Ocean MySQL
GRANT ALL PRIVILEGES ON wayfair_clone.* TO 'wayfair'@'%';
FLUSH PRIVILEGES;
```

### Issue 4: Timeout Errors

**Symptom**: Connection timeout after 30 seconds

**Solution**:
- Increase Cloud Run timeout: `--timeout=300`
- Check network latency between us-central1 and Digital Ocean
- Consider using Google Cloud SQL instead for lower latency

## Environment Variables Reference

Required environment variables for Cloud Run:

| Variable | Value | Description |
|----------|-------|-------------|
| `CUSTOM_DATABASE_URL` | `mysql://wayfair:Wayfair2024Secure!@165.232.54.128:3306/wayfair_clone` | Digital Ocean MySQL connection string |
| `NODE_ENV` | `production` | Node.js environment |
| `JWT_SECRET` | (generate random string) | Session cookie signing secret |
| `VITE_APP_ID` | (optional) | Manus OAuth app ID (if using Manus auth) |

## Cost Estimation

**Cloud Run Pricing** (us-central1):
- 2 vCPU, 2 GiB memory
- ~$0.00002400 per second
- Estimated: $50-100/month for moderate traffic

**Cloud NAT Pricing** (if using static IP):
- NAT Gateway: $0.045 per hour = ~$32/month
- Data processing: $0.045 per GB
- Estimated: $40-60/month

**Total**: ~$90-160/month

## Security Best Practices

1. **Use Secret Manager** for database credentials:
   ```bash
   echo -n "mysql://wayfair:Wayfair2024Secure!@165.232.54.128:3306/wayfair_clone" | \
     gcloud secrets create database-url --data-file=-
   ```

2. **Enable Cloud Armor** for DDoS protection

3. **Set up Cloud Monitoring** for alerts

4. **Use SSL/TLS** for MySQL connection (add `?ssl=true` to connection string)

5. **Rotate database passwords** regularly

## Next Steps

1. ✅ Deploy to Cloud Run
2. ✅ Configure Digital Ocean firewall
3. ✅ Test database connectivity
4. ✅ Verify all 200 products load
5. ⬜ Set up Cloud CDN for static assets
6. ⬜ Configure custom domain
7. ⬜ Set up monitoring and alerts
8. ⬜ Implement CI/CD pipeline

## Support

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Digital Ocean Firewall Guide](https://docs.digitalocean.com/products/networking/firewalls/)

---

**Note**: This deployment uses Cloud Run (serverless) for simplicity. For a full microservices architecture with Kubernetes (GKE), see `DEPLOYMENT_SUMMARY.md`.
