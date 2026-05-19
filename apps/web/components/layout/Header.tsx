import { UserButton } from '@clerk/nextjs'

interface HeaderProps {
  user: any
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="border-b bg-background px-6 py-4 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {user?.firstName} {user?.lastName}
        </span>
        <UserButton />
      </div>
    </header>
  )
}
