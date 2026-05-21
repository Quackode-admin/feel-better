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
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--cream-50)' }}>
      <SidebarNav />
      <div className="flex flex-1 flex-col">
        <Header
          firstName={user?.firstName ?? ''}
          lastName={user?.lastName ?? ''}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
