import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-green-600">Feel Better</h1>
      <p className="text-gray-500">Plataforma de gestión nutricional</p>

      <SignedOut>
        <SignInButton mode="modal">
          <button className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700">
            Iniciar sesión
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-4">
          <p className="text-gray-600">Bienvenido a Feel Better</p>
          <UserButton />
        </div>
      </SignedIn>
    </main>
  )
}
