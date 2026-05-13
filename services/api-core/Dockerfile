FROM node:20-alpine AS builder
RUN apk add --no-cache openssl

WORKDIR /app/services/api-core
COPY services/api-core/package.json ./
RUN npm install

COPY services/api-core/ ./
COPY tsconfig.base.json /app/tsconfig.base.json

RUN npx prisma generate --schema=prisma/schema.prisma
RUN npx nest build

FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/services/api-core/dist ./dist
COPY --from=builder /app/services/api-core/prisma ./prisma
COPY --from=builder /app/services/api-core/node_modules ./node_modules
COPY --from=builder /app/services/api-core/package.json ./

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
