# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package files for production dependencies
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from build stage
COPY --from=builder /app/.vinxi ./vinxi
COPY --from=builder /app/dist ./dist

# Expose port 3000 (TanStack Start default)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
