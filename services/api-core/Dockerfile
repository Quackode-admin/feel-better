FROM node:20-alpine AS base
RUN apk add --no-cache openssl
RUN npm install -g pnpm@9

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/logger/package.json ./packages/logger/
COPY packages/config/package.json ./packages/config/
COPY packages/validators/package.json ./packages/validators/
COPY services/api-core/package.json ./services/api-core/
RUN pnpm install --frozen-lockfile --dev

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
WORKDIR /app/services/api-core
RUN ../../node_modules/.bin/prisma generate
RUN ../../node_modules/.bin/nest build

FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/services/api-core/dist ./dist
COPY --from=builder /app/services/api-core/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/api-core/package.json ./
EXPOSE 3000
CMD ["sh", "-c", "../../node_modules/.bin/prisma migrate deploy && node dist/main"]
