'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutGrid,
  Users,
  Plus,
  Calendar,
  BarChart2,
  Settings,
  ChevronLeft,
} from 'lucide-react'
import { usePatients } from '@/features/patients/hooks/usePatients'

const PRINCIPAL = [
  { href: '/dashboard',    label: 'Dashboard',       icon: LayoutGrid },
  { href: '/patients',     label: 'Pacientes',       icon: Users,     badge: true },
  { href: '/patients/new', label: 'Nueva consulta',  icon: Plus },
]

const HERRAMIENTAS = [
  { href: '/appointments', label: 'Agenda',          icon: Calendar },
  { href: '/reports',      label: 'Reportes',        icon: BarChart2 },
  { href: '/settings',     label: 'Configuración',   icon: Settings },
]

function NavItem({ href, label, icon: Icon, badge, count, active }: {
  href: string; label: string; icon: any; badge?: boolean | undefined; count?: number | undefined; active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn('flex items-center gap-3 px-3 py-2.5 rounded-fb-sm text-sm transition-colors')}
      style={
        active
          ? { backgroundColor: 'var(--green-700)', color: 'white', fontWeight: 600 }
          : { color: 'rgba(255,255,255,0.65)', fontWeight: 400 }
      }
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)' }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
    >
      <Icon size={16} strokeWidth={2.25} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge && count !== undefined && count > 0 && (
        <span style={{
          fontSize: '11px', fontWeight: 700,
          backgroundColor: 'rgba(255,255,255,0.15)',
          color: 'white',
          padding: '2px 7px',
          borderRadius: 9999,
          minWidth: 20,
          textAlign: 'center',
        }}>
          {count}
        </span>
      )}
    </Link>
  )
}

export function SidebarNav() {
  const pathname = usePathname()
  const { data: patients } = usePatients()
  const patientCount = patients?.length ?? 0

  return (
    <aside style={{
      width: 200,
      flexShrink: 0,
      backgroundColor: 'var(--green-950)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Volver al inicio */}
      <Link
        href="/dashboard"
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '16px 16px 12px',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '13px', fontWeight: 500,
          textDecoration: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
      >
        <ChevronLeft size={14} strokeWidth={2.25} />
        Volver al inicio
      </Link>

      {/* Wordmark + subtítulo */}
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ fontSize: '16px', fontWeight: 700, color: 'white', letterSpacing: '-0.04em', marginBottom: 2 }}>
          Feel Better
        </p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          Portal nutricionista
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* PRINCIPAL */}
        <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 6px 4px', marginTop: 4 }}>
          Principal
        </p>
        {PRINCIPAL.map(({ href, label, icon, badge }) => (
          <NavItem
            key={href}
            href={href}
            label={label}
            icon={icon}
            badge={badge}
            count={badge ? patientCount : undefined}
            active={pathname === href || (href !== '/dashboard' && href !== '/patients/new' && pathname.startsWith(href) && !pathname.startsWith('/patients/new'))}
          />
        ))}

        {/* HERRAMIENTAS */}
        <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '16px 6px 4px' }}>
          Herramientas
        </p>
        {HERRAMIENTAS.map(({ href, label, icon }) => (
          <NavItem
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={pathname === href}
          />
        ))}
      </nav>

    </aside>
  )
}
