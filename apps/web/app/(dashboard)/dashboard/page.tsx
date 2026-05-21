import { auth, currentUser } from '@clerk/nextjs/server'
import { Users, Calendar, Salad, TrendingUp } from 'lucide-react'

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--white)',
        border: '1px solid #F5F5F5',
        borderRadius: 'var(--r-md)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="t-overline" style={{ color: 'var(--ink-500)', fontSize: 11 }}>{label}</span>
        <span style={{ color: 'var(--ink-400)' }}>{icon}</span>
      </div>
      <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--green-950)', letterSpacing: '-0.32px' }}>
        {value}
      </p>
    </div>
  )
}

export default async function DashboardPage() {
  const user = await currentUser()
  const firstName = user?.firstName ?? 'usuario'

  return (
    <div className="space-y-8">

      {/* Saludo */}
      <div>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--green-950)',
            letterSpacing: '-0.32px',
            marginBottom: 4,
          }}
        >
          ¡Hola, {firstName}!
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--ink-500)' }}>
          Aquí tienes un resumen de tu actividad de hoy.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          icon={<Users size={18} strokeWidth={2.25} />}
          label="PACIENTES ACTIVOS"
          value="—"
        />
        <MetricCard
          icon={<Calendar size={18} strokeWidth={2.25} />}
          label="CITAS HOY"
          value="—"
        />
        <MetricCard
          icon={<Salad size={18} strokeWidth={2.25} />}
          label="PLANES ACTIVOS"
          value="—"
        />
        <MetricCard
          icon={<TrendingUp size={18} strokeWidth={2.25} />}
          label="REGISTROS HOY"
          value="—"
        />
      </div>

    </div>
  )
}
