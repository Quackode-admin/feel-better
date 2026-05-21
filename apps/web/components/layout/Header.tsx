'use client'

import { UserButton } from '@clerk/nextjs'
import { Bell } from 'lucide-react'

interface HeaderProps {
  user: any
}

export function Header({ user }: HeaderProps) {
  const firstName = user?.firstName ?? ''
  const lastName  = user?.lastName  ?? ''
  const fullName  = [firstName, lastName].filter(Boolean).join(' ')

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #F5F5F5',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 24px',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Bell */}
      <button
        aria-label="Notificaciones"
        style={{
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--r-sm)',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          transition: 'background-color 150ms cubic-bezier(0.2, 0, 0, 1)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--green-50)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <Bell size={18} strokeWidth={2.25} style={{ color: 'var(--ink-500)' }} />
      </button>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {fullName && (
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink-700)', letterSpacing: '0.14px' }}>
            {fullName}
          </span>
        )}
        <UserButton />
      </div>
    </header>
  )
}
