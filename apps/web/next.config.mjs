/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@feel-better/ui',
    '@feel-better/types',
    '@feel-better/validators',
  ],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
}

export default nextConfig
