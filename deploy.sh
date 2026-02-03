#!/bin/bash

# Wayfair Clone - Google Cloud Deployment Script
# This script automates the deployment process to Google Cloud Run

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="cohesive-poetry-486213-q3"
REGION="us-central1"
SERVICE_NAME="wayfair-clone"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Wayfair Clone - Google Cloud Deployment${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Step 1: Check if gcloud is installed
echo -e "${YELLOW}Step 1: Checking gcloud CLI...${NC}"
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ gcloud CLI found${NC}"
echo ""

# Step 2: Set project
echo -e "${YELLOW}Step 2: Setting Google Cloud project...${NC}"
gcloud config set project $PROJECT_ID
echo -e "${GREEN}✓ Project set to $PROJECT_ID${NC}"
echo ""

# Step 3: Enable required APIs
echo -e "${YELLOW}Step 3: Enabling required Google Cloud APIs...${NC}"
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  sql.googleapis.com \
  compute.googleapis.com \
  --quiet
echo -e "${GREEN}✓ APIs enabled${NC}"
echo ""

# Step 4: Build the application
echo -e "${YELLOW}Step 4: Building the application...${NC}"
pnpm build
echo -e "${GREEN}✓ Application built successfully${NC}"
echo ""

# Step 5: Build Docker image
echo -e "${YELLOW}Step 5: Building Docker image...${NC}"
docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:$(date +%s) .
echo -e "${GREEN}✓ Docker image built${NC}"
echo ""

# Step 6: Push to Container Registry
echo -e "${YELLOW}Step 6: Pushing image to Container Registry...${NC}"
docker push ${IMAGE_NAME}:latest
echo -e "${GREEN}✓ Image pushed to Container Registry${NC}"
echo ""

# Step 7: Deploy to Cloud Run
echo -e "${YELLOW}Step 7: Deploying to Cloud Run...${NC}"

# Get Cloud SQL instance connection name
INSTANCE_CONNECTION_NAME=$(gcloud sql instances describe wayfair-clone-db --format='value(connectionName)' 2>/dev/null || echo "")

if [ -z "$INSTANCE_CONNECTION_NAME" ]; then
    echo -e "${RED}Warning: Could not find Cloud SQL instance. Please ensure wayfair-clone-db exists.${NC}"
    echo -e "${YELLOW}Deploying without Cloud SQL connection...${NC}"
    
    gcloud run deploy $SERVICE_NAME \
      --image ${IMAGE_NAME}:latest \
      --region $REGION \
      --platform managed \
      --allow-unauthenticated \
      --memory 2Gi \
      --cpu 2 \
      --timeout 3600 \
      --quiet
else
    echo -e "${GREEN}Found Cloud SQL instance: $INSTANCE_CONNECTION_NAME${NC}"
    
    gcloud run deploy $SERVICE_NAME \
      --image ${IMAGE_NAME}:latest \
      --region $REGION \
      --platform managed \
      --allow-unauthenticated \
      --memory 2Gi \
      --cpu 2 \
      --timeout 3600 \
      --add-cloudsql-instances $INSTANCE_CONNECTION_NAME \
      --quiet
fi

echo -e "${GREEN}✓ Application deployed to Cloud Run${NC}"
echo ""

# Step 8: Get service URL
echo -e "${YELLOW}Step 8: Getting service URL...${NC}"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)')
echo -e "${GREEN}✓ Service URL: $SERVICE_URL${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Visit your application: $SERVICE_URL"
echo "2. Configure custom domain (optional)"
echo "3. Set up Cloud CDN for static assets"
echo "4. Configure monitoring and logging"
echo ""
