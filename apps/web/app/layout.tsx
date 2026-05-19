import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryProvider } from '@/providers/QueryProvider'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Feel Better',
  description: 'Plataforma de gestión nutricional',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
