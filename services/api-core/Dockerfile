# =============================================================================
# Feel Better — api-core Dockerfile
# Multi-stage build: mantiene la imagen de producción pequeña y sin devDeps
# =============================================================================

FROM node:20-alpine AS base
RUN npm install -g pnpm@9

# ── Instalación de dependencias ────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/logger/package.json ./packages/logger/
COPY packages/config/package.json ./packages/config/
COPY services/api-core/package.json ./services/api-core/
RUN pnpm install --frozen-lockfile

# ── Build ──────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter api-core build
RUN pnpm --filter api-core db:generate

# ── Imagen de producción ───────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Solo copiamos lo necesario — sin devDependencies
COPY --from=builder /app/services/api-core/dist ./dist
COPY --from=builder /app/services/api-core/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/api-core/package.json ./

EXPOSE 3000

# Ejecuta migraciones y arranca el servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
