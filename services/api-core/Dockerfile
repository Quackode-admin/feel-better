FROM node:20-alpine AS base
RUN npm install -g pnpm@9

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/logger/package.json ./packages/logger/
COPY packages/config/package.json ./packages/config/
COPY packages/validators/package.json ./packages/validators/
COPY services/api-core/package.json ./services/api-core/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter api-core db:generate
RUN cd services/api-core && npx nest build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/services/api-core/dist ./dist
COPY --from=builder /app/services/api-core/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/api-core/package.json ./
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
