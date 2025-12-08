# Build stage
FROM node:24-slim AS builder

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:24-slim AS runner

WORKDIR /app

# Create non-root user
RUN groupadd --system --gid 1001 nuxt && \
    useradd --system --uid 1001 --gid nuxt nuxt

# Copy built application
COPY --from=builder /app/.output ./.output

# Create data directory
RUN mkdir -p /data/uploads && chown -R nuxt:nuxt /data

USER nuxt

ENV NODE_ENV=production
ENV NUXT_DATA_DIR=/data
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
