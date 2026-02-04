# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first
COPY package.json pnpm-lock.yaml ./

# Create patches directory and copy patch files
RUN mkdir -p patches
COPY patches/ patches/

# Debug: List files to verify patches folder
RUN echo "=== Listing /app contents ===" && ls -la /app && echo "=== Listing /app/patches contents ===" && ls -la /app/patches || echo "patches folder not found!"

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files first
COPY package.json pnpm-lock.yaml ./

# Create patches directory and copy patch files
RUN mkdir -p patches
COPY patches/ patches/

# Debug: List files to verify patches folder
RUN echo "=== Listing /app contents (production) ===" && ls -la /app && echo "=== Listing /app/patches contents (production) ===" && ls -la /app/patches || echo "patches folder not found!"

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# Remove vite.js to avoid loading dev dependencies in production
RUN rm -f ./dist/server/_core/vite.js

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]

# Start the application
CMD ["node", "dist/index.js"]
