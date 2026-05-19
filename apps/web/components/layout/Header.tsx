import { UserButton } from '@clerk/nextjs'
import { Bell } from 'lucide-react'

interface HeaderProps {
  user: any
}

export function Header({ user }: HeaderProps) {
  return (
    <header
      className="h-16 border-b bg-white px-6 flex items-center justify-between"
      style={{ borderColor: 'var(--green-100)' }}
    >
      <div />
      <div className="flex items-center gap-4">
        <button
          className="w-9 h-9 flex items-center justify-center rounded-fb-sm transition-colors hover:bg-fb-green-25"
          aria-label="Notificaciones"
        >
          <Bell size={18} style={{ color: 'var(--ink-500)' }} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--ink-700)' }}>
            {user?.firstName} {user?.lastName}
          </span>
          <UserButton />
        </div>
      </div>
    </header>
  )
}
