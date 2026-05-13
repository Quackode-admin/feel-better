import { NestFactory, Reflector } from '@nestjs/core'
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  // ── Seguridad ────────────────────────────────────────────────────────────────
  app.use(helmet())
  app.enableCors({
    origin: process.env['ALLOWED_ORIGINS']?.split(',') ?? ['http://localhost:3002'],
    credentials: true,
  })

  // ── Prefijo global de API ─────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1')

  // ── Validación global de DTOs ─────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // elimina campos no declarados en el DTO
      forbidNonWhitelisted: true,
      transform: true,        // transforma strings a tipos correctos
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  // ── Serialización global (respeta @Exclude en DTOs) ───────────────────────────
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  // ── Swagger (solo en desarrollo) ──────────────────────────────────────────────
  if (process.env['NODE_ENV'] !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Feel Better API')
      .setDescription('API de la plataforma de gestión nutricional Feel Better')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)
    console.warn('Swagger disponible en http://localhost:3000/docs')
  }

  const port = process.env['PORT'] ?? 3000
  await app.listen(port)
  console.warn(`api-core corriendo en http://localhost:${port}`)
}

bootstrap()
