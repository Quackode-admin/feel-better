import { auth, currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function Home() {
  const { userId } = await auth()
  const user = userId ? await currentUser() : null

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-green-600">Feel Better</h1>
      <p className="text-gray-500">Plataforma de gestión nutricional</p>

      {!userId ? (
        <Link
          href="/sign-in"
          className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          Iniciar sesión
        </Link>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600">
            Bienvenido, {user?.firstName ?? 'usuario'}
          </p>
          <Link
            href="/dashboard"
            className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
          >
            Ir al dashboard
          </Link>
        </div>
      )}
    </main>
  )
}
