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
    <div className="flex min-h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1 p-6 bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  )
}
