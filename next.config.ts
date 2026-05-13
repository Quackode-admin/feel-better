import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Turborepo compila los paquetes del workspace en caliente
  transpilePackages: [
    '@feel-better/ui',
    '@feel-better/types',
    '@feel-better/validators',
  ],

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },

  // Variables públicas (se exponen al browser — NUNCA secretos aquí)
  env: {
    NEXT_PUBLIC_API_URL: process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000',
  },
}

export default nextConfig
