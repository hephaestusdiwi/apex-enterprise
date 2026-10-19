# syntax=docker/dockerfile:1

# Base image
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
FROM base AS deps

COPY package.json package-lock.json .npmrc ./
RUN npm ci

# Build Next.js application
FROM base AS builder

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create public directory if it does not exist
RUN mkdir -p public

# Generate Payload's component map before Next.js bundles the admin panel.
RUN npm run generate:importmap

# Keep Payload types synchronized with registered collections and globals.
RUN npm run generate:types

# Build optimized Next.js standalone output
RUN npm run build

# Production runtime
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder --chown=nextjs:nodejs \
    /app/public ./public

# Copy standalone server
COPY --from=builder --chown=nextjs:nodejs \
    /app/.next/standalone ./

# Copy static assets
COPY --from=builder --chown=nextjs:nodejs \
    /app/.next/static ./.next/static

# Prepare writable Next.js cache
RUN mkdir -p .next/cache media \
    && chown -R nextjs:nodejs .next media

# Run as non-root user
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
