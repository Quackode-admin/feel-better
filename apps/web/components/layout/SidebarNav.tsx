'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutGrid,
  Users,
  Calendar,
  Salad,
  TrendingUp,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutGrid },
  { href: '/patients', label: 'Pacientes', icon: Users },
  { href: '/appointments', label: 'Citas', icon: Calendar },
  { href: '/nutrition', label: 'Nutrición', icon: Salad },
  { href: '/tracking', label: 'Seguimiento', icon: TrendingUp },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-white flex flex-col" style={{ borderColor: 'var(--green-200)' }}>
      {/* Wordmark */}
      <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--green-100)' }}>
        <span
          className="text-xl font-bold tracking-tight"
          style={{ color: 'var(--green-900)', letterSpacing: '-0.05em' }}
        >
          Feel Better
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-fb-sm text-sm font-medium transition-colors',
                isActive
                  ? 'text-white'
                  : 'hover:bg-fb-green-25',
              )}
              style={
                isActive
                  ? { backgroundColor: 'var(--green-950)', color: 'white' }
                  : { color: 'var(--ink-700)' }
              }
            >
              <Icon
                size={18}
                style={{ color: isActive ? 'white' : 'var(--ink-500)' }}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-xs" style={{ borderColor: 'var(--green-100)', color: 'var(--ink-400)' }}>
        Feel Better © 2026
      </div>
    </aside>
  )
}
