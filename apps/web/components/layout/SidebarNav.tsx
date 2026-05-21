'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutGrid, Users, Calendar, Salad, TrendingUp } from 'lucide-react'

const navItems = [
  { href: '/dashboard',    label: 'Inicio',       icon: LayoutGrid },
  { href: '/patients',     label: 'Pacientes',    icon: Users },
  { href: '/appointments', label: 'Citas',        icon: Calendar },
  { href: '/nutrition',    label: 'Nutrición',    icon: Salad },
  { href: '/tracking',     label: 'Seguimiento',  icon: TrendingUp },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside
      className="w-64 flex flex-col shrink-0"
      style={{
        backgroundColor: 'var(--white)',
        borderRight: '1px solid var(--green-100)',
        minHeight: '100vh',
      }}
    >
      {/* Wordmark */}
      <div
        className="px-6 flex items-center"
        style={{
          height: '64px',
          borderBottom: '1px solid var(--green-100)',
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
            color: 'var(--green-900)',
            letterSpacing: '-0.05em',
          }}
        >
          Feel Better
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-fb-sm text-sm transition-colors fb-press',
                !isActive && 'hover:bg-fb-green-25',
              )}
              style={
                isActive
                  ? { backgroundColor: 'var(--green-950)', color: 'var(--white)', fontWeight: 600 }
                  : { color: 'var(--ink-700)', fontWeight: 400 }
              }
            >
              <Icon
                size={18}
                strokeWidth={2.25}
                style={{ color: isActive ? 'var(--white)' : 'var(--ink-500)', flexShrink: 0 }}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-6 py-4"
        style={{
          borderTop: '1px solid var(--green-100)',
          fontSize: '12px',
          color: 'var(--ink-400)',
        }}
      >
        Feel Better © 2026
      </div>
    </aside>
  )
}
