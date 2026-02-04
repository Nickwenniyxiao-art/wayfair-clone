#!/bin/bash

# Quick Deploy Script for Google Cloud Run
# This script deploys Wayfair Clone to Cloud Run with Digital Ocean MySQL

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Wayfair Clone - Google Cloud Run Deployment ===${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}No project set. Please enter your Google Cloud Project ID:${NC}"
    read -r PROJECT_ID
    gcloud config set project "$PROJECT_ID"
fi

echo -e "${GREEN}Using project: $PROJECT_ID${NC}"
echo ""

# Configuration
REGION="us-central1"
SERVICE_NAME="wayfair-clone"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"
DATABASE_URL="mysql://wayfair:Wayfair2024Secure!@165.232.54.128:3306/wayfair_clone"

# Generate JWT secret if not provided
JWT_SECRET=$(openssl rand -base64 32)

echo -e "${YELLOW}Step 1/5: Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com --quiet
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable containerregistry.googleapis.com --quiet
echo -e "${GREEN}✓ APIs enabled${NC}"
echo ""

echo -e "${YELLOW}Step 2/5: Building Docker image...${NC}"
docker build -t "$IMAGE_NAME:latest" .
echo -e "${GREEN}✓ Image built${NC}"
echo ""

echo -e "${YELLOW}Step 3/5: Pushing image to Container Registry...${NC}"
docker push "$IMAGE_NAME:latest"
echo -e "${GREEN}✓ Image pushed${NC}"
echo ""

echo -e "${YELLOW}Step 4/5: Deploying to Cloud Run...${NC}"
gcloud run deploy "$SERVICE_NAME" \
  --image="$IMAGE_NAME:latest" \
  --region="$REGION" \
  --platform=managed \
  --allow-unauthenticated \
  --memory=2Gi \
  --cpu=2 \
  --timeout=300 \
  --max-instances=10 \
  --set-env-vars="CUSTOM_DATABASE_URL=$DATABASE_URL,NODE_ENV=production,JWT_SECRET=$JWT_SECRET" \
  --quiet

echo -e "${GREEN}✓ Deployed to Cloud Run${NC}"
echo ""

# Get service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
  --region="$REGION" \
  --format="value(status.url)")

echo -e "${YELLOW}Step 5/5: Testing deployment...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Service is responding${NC}"
else
    echo -e "${RED}⚠ Service returned HTTP $HTTP_CODE${NC}"
fi
echo ""

echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo -e "Service URL: ${GREEN}$SERVICE_URL${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Configure Digital Ocean firewall to allow Google Cloud IP ranges"
echo "2. Test the website: $SERVICE_URL"
echo "3. Check logs: gcloud run services logs read $SERVICE_NAME --region=$REGION"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo "Your JWT secret has been generated: $JWT_SECRET"
echo "Save this securely if you need to redeploy with the same secret."
echo ""
echo -e "${YELLOW}Digital Ocean Firewall Configuration:${NC}"
echo "Add these IP ranges to allow MySQL (port 3306) access:"
echo "  - 34.72.0.0/16"
echo "  - 35.184.0.0/13"
echo "  - 35.192.0.0/14"
echo "  - 35.196.0.0/14"
echo "  - 35.200.0.0/13"
echo ""
echo "Or use Cloud NAT for a static IP (see GOOGLE_CLOUD_DEPLOYMENT.md)"
