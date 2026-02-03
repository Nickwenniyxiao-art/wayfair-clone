# Wayfair Clone - Google Cloud Deployment Guide

This guide explains how to deploy the Wayfair Clone e-commerce platform to Google Cloud.

## Prerequisites

- Google Cloud Project (cohesive-poetry-486213-q3)
- Cloud SQL MySQL instance (wayfair-clone-db)
- gcloud CLI installed and configured
- Docker installed locally (for testing)

## Deployment Steps

### 1. Set Up Google Cloud Project

```bash
# Set your project ID
export PROJECT_ID="cohesive-poetry-486213-q3"
export REGION="us-central1"

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  sql.googleapis.com \
  compute.googleapis.com
```

### 2. Configure Cloud SQL Connection

```bash
# Get the Cloud SQL instance connection name
gcloud sql instances describe wayfair-clone-db --format='value(connectionName)'

# Create a Cloud SQL Proxy service account
gcloud iam service-accounts create cloud-sql-proxy \
  --display-name="Cloud SQL Proxy"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:cloud-sql-proxy@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

### 3. Build and Push Docker Image

```bash
# Build the Docker image
docker build -t gcr.io/$PROJECT_ID/wayfair-clone:latest .

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/wayfair-clone:latest
```

### 4. Deploy to Cloud Run

```bash
# Deploy the application
gcloud run deploy wayfair-clone \
  --image gcr.io/$PROJECT_ID/wayfair-clone:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 3600 \
  --set-env-vars DATABASE_URL="mysql://user:password@/dbname?unix_socket=/cloudsql/INSTANCE_CONNECTION_NAME" \
  --set-env-vars JWT_SECRET="your-jwt-secret" \
  --set-env-vars VITE_APP_ID="your-app-id" \
  --set-env-vars OAUTH_SERVER_URL="your-oauth-url" \
  --add-cloudsql-instances $PROJECT_ID:$REGION:wayfair-clone-db
```

### 5. Set Up Cloud CDN

```bash
# Create a Cloud Storage bucket for static assets
gsutil mb gs://$PROJECT_ID-wayfair-assets

# Enable public access
gsutil iam ch allUsers:objectViewer gs://$PROJECT_ID-wayfair-assets

# Create a Cloud CDN backend
gcloud compute backend-buckets create wayfair-cdn \
  --gcs-bucket-name=$PROJECT_ID-wayfair-assets \
  --enable-cdn
```

### 6. Configure CI/CD with Cloud Build

```bash
# Create a Cloud Build trigger
gcloud builds triggers create github \
  --repo-name=wayfair-clone \
  --repo-owner=your-github-username \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### 7. Monitor Deployment

```bash
# View Cloud Run service
gcloud run services describe wayfair-clone --region $REGION

# View logs
gcloud run services logs read wayfair-clone --region $REGION --limit 50

# View Cloud Build history
gcloud builds list
```

## Environment Variables

The following environment variables need to be set in Cloud Run:

- `DATABASE_URL`: MySQL connection string for Cloud SQL
- `JWT_SECRET`: Secret key for JWT token signing
- `VITE_APP_ID`: OAuth application ID
- `OAUTH_SERVER_URL`: OAuth server base URL
- `VITE_OAUTH_PORTAL_URL`: OAuth portal URL
- `OWNER_OPEN_ID`: Owner's OpenID
- `OWNER_NAME`: Owner's name

## Troubleshooting

### Cloud SQL Connection Issues

If you encounter connection issues, ensure:
1. Cloud SQL Proxy service account has the `cloudsql.client` role
2. The Cloud Run service is configured with the correct Cloud SQL instance connection name
3. Database user and password are correct

### Build Failures

If the build fails:
1. Check Cloud Build logs: `gcloud builds log <BUILD_ID>`
2. Ensure all dependencies are correctly specified in `package.json`
3. Verify the Dockerfile is correct

### Performance Issues

To improve performance:
1. Enable Cloud CDN for static assets
2. Use Cloud SQL High Availability (HA) configuration
3. Configure Cloud Run autoscaling appropriately
4. Use Cloud Memorystore (Redis) for caching

## Rollback

To rollback to a previous version:

```bash
# List previous revisions
gcloud run revisions list --service=wayfair-clone --region=$REGION

# Deploy a specific revision
gcloud run deploy wayfair-clone \
  --image gcr.io/$PROJECT_ID/wayfair-clone:PREVIOUS_TAG \
  --region $REGION
```

## Cost Optimization

- Use Cloud Run's pay-per-use pricing model
- Configure appropriate memory and CPU limits
- Use Cloud SQL's shared-core instances for development
- Enable Cloud CDN to reduce bandwidth costs
- Use Cloud Storage lifecycle policies for old assets

## Security Best Practices

1. Use Cloud IAM roles for access control
2. Enable VPC Service Controls for network security
3. Use Cloud Secret Manager for sensitive data
4. Enable Cloud Armor for DDoS protection
5. Use HTTPS only (enforced by Cloud Run)
6. Regularly update dependencies and security patches
