# ---- 1. Install dependencies ----
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts: skips the husky git hook setup, which needs a .git folder
RUN npm ci --no-audit --no-fund --ignore-scripts

# ---- 2. Build ----
# NEXT_PUBLIC_* values are baked in at build time, so .env.production must
# exist next to this Dockerfile before building (see .env.example).
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- 3. Runtime ----
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    MEDIA_DIR=/app/data/media
RUN addgroup -S app && adduser -S app -G app && mkdir -p /app/data/media && chown -R app:app /app/data
COPY --from=builder --chown=app:app /app/package.json ./package.json
COPY --from=builder --chown=app:app /app/next.config.js ./next.config.js
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/.next ./.next
COPY --from=builder --chown=app:app /app/public ./public
USER app
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
