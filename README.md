# Feel Better — Monorepo

Plataforma enterprise de gestión nutricional y seguimiento de pacientes.

## Estructura

```
feel-better/
├── apps/
│   ├── web/          # Next.js — pacientes y nutricionistas
│   ├── admin/        # Next.js — panel administrativo
│   └── mobile/       # Expo React Native
├── services/
│   ├── api-core/     # NestJS — API principal (puerto 3000)
│   ├── chat-service/ # NestJS — GetStream integration (puerto 3001)
│   ├── notification-service/ # NestJS (puerto 3002)
│   └── files-service/        # NestJS — Cloudflare R2 (puerto 3003)
└── packages/
    ├── types/        # @feel-better/types
    ├── validators/   # @feel-better/validators
    ├── ui/           # @feel-better/ui
    ├── auth/         # @feel-better/auth
    ├── api-client/   # @feel-better/api-client
    ├── logger/       # @feel-better/logger
    └── config/       # @feel-better/config
```

## Inicio rápido

### 1. Requisitos previos

- Node.js 20+
- pnpm 9+
- Docker Desktop

### 2. Configuración inicial

```bash
# Clonar el repositorio
git clone https://github.com/feel-better-app/monorepo.git
cd monorepo

# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp .env.example .env.local

# Editar .env.local con tus credenciales locales
```

### 3. Levantar infraestructura local

```bash
# Inicia PostgreSQL, Redis, MinIO y Mailhog
docker compose up -d

# Verificar que todo corre
docker compose ps
```

### 4. Base de datos

```bash
# Generar cliente Prisma
pnpm db:generate

# Crear tablas (primera vez)
pnpm --filter api-core db:migrate:dev --name init

# Ver datos en el browser
pnpm db:studio
```

### 5. Desarrollar

```bash
# Correr todo en paralelo (apps + servicios)
pnpm dev

# O solo lo que necesites
pnpm --filter web dev          # solo la app web
pnpm --filter api-core dev     # solo el backend principal
```

### 6. URLs locales

| Servicio | URL |
|---|---|
| Web app | http://localhost:3002 |
| Admin panel | http://localhost:3003 |
| API Core | http://localhost:3000 |
| Swagger docs | http://localhost:3000/docs |
| Prisma Studio | http://localhost:5555 |
| MinIO Dashboard | http://localhost:9001 |
| Mailhog | http://localhost:8025 |

## Comandos útiles

```bash
pnpm build          # Compilar todo
pnpm lint           # Lint en todos los workspaces
pnpm typecheck      # TypeScript en todos los workspaces
pnpm test           # Tests en todos los workspaces
pnpm clean          # Limpiar builds y node_modules
```

## Branches

| Rama | Ambiente | Deploy |
|---|---|---|
| feature/* | local | manual |
| develop | development | automático |
| staging | staging | automático |
| main | production | aprobación requerida |
