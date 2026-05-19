'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: '🏠' },
  { href: '/patients', label: 'Pacientes', icon: '👥' },
  { href: '/appointments', label: 'Citas', icon: '📅' },
  { href: '/nutrition', label: 'Nutrición', icon: '🥗' },
  { href: '/tracking', label: 'Seguimiento', icon: '📊' },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-green-600">Feel Better</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === item.href
                ? 'bg-green-50 text-green-700 font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
