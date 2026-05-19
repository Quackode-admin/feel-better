import { auth, currentUser } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  const user = await currentUser()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">
          Bienvenido, {user?.firstName ?? 'usuario'} 👋
        </h2>
        <p className="text-muted-foreground mt-1">
          Aquí tienes un resumen de tu actividad
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Pacientes activos', value: '—', icon: '👥' },
          { label: 'Citas hoy', value: '—', icon: '📅' },
          { label: 'Planes activos', value: '—', icon: '🥗' },
          { label: 'Registros hoy', value: '—', icon: '📊' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border bg-card p-4 space-y-2"
          >
            <div className="text-2xl">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
