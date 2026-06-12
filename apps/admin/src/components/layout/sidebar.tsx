'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Mail,
  Users,
  ClipboardList,
  BarChart2,
  Settings,
} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

const navItems = [
  {
    section: 'Principal',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Gestión',
    items: [
      { label: 'Invitaciones', href: '/invitations', icon: Mail },
      { label: 'Nutricionistas', href: '/nutritionists', icon: Users },
      { label: 'Solicitudes', href: '/requests', icon: ClipboardList },
    ],
  },
  {
    section: 'Sistema',
    items: [
      { label: 'Reportes', href: '/reports', icon: BarChart2 },
      { label: 'Configuración', href: '/settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-56 min-w-56 flex-col bg-[#154212]">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-[16px] font-bold tracking-[-0.05em] text-white">Feel Better</p>
        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-white/40">Admin Console</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Navegación principal">
        {navItems.map((group) => (
          <div key={group.section} className="mb-1">
            <p className="mb-1 px-2 pt-2 text-[10px] font-medium uppercase tracking-widest text-white/30">
              {group.section}
            </p>
            {group.items.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                    active
                      ? 'bg-white/15 font-medium text-white'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon size={16} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-white/10 px-4 py-3">
        <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
        <div className="min-w-0">
          <p className="truncate text-[12px] font-medium text-white">Administrador</p>
          <p className="text-[10px] text-white/40">Feel Better</p>
        </div>
      </div>
    </aside>
  )
}
