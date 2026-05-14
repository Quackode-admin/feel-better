import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-600">Feel Better</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {user?.firstName} {user?.lastName}
          </span>
          <UserButton />
        </div>
      </nav>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Bienvenido, {user?.firstName ?? 'usuario'} 👋
        </h2>
        <p className="mt-2 text-gray-500">
          Tu plataforma de gestión nutricional está lista.
        </p>
      </div>
    </main>
  )
}
