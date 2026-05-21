import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SidebarNav } from '@/components/layout/SidebarNav'
import { Header } from '@/components/layout/Header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarNav />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--cream-50)' }}>
        <Header
          firstName={user?.firstName ?? ''}
          lastName={user?.lastName ?? ''}
        />
        <main style={{ flex: 1, padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
