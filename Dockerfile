# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first
COPY package.json pnpm-lock.yaml ./

# Create patches directory and copy patch files
RUN mkdir -p patches
COPY patches/ patches/

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

# Install all dependencies (some devDependencies like @builder.io/vite-plugin-jsx-loc
# are referenced in the built dist/index.js and required at runtime)
RUN pnpm install --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# Expose port (Cloud Run uses PORT env var, defaults to 8080)
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]
