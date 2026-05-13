import winston from 'winston'

const { combine, timestamp, errors, json, colorize, simple } = winston.format

// ─── Formato por ambiente ─────────────────────────────────────────────────────
// En producción: JSON estructurado (fácil de indexar en Sentry/Railway logs)
// En desarrollo: colorizado y legible para humanos

const productionFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
)

const developmentFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  simple(),
)

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createLogger(service: string): winston.Logger {
  const isProduction = process.env['NODE_ENV'] === 'production'

  return winston.createLogger({
    level: isProduction ? 'info' : 'debug',
    defaultMeta: { service },
    format: isProduction ? productionFormat : developmentFormat,
    transports: [
      new winston.transports.Console(),
    ],
    // En producción, los errores también van a Sentry vía el SDK de NestJS.
    // No se añade el transport de Sentry aquí para evitar dependencias circulares.
    exceptionHandlers: [
      new winston.transports.Console(),
    ],
  })
}

export type { Logger } from 'winston'
