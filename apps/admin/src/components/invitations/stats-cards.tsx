interface StatsCardsProps {
  total: number
  pending: number
  accepted: number
  expired: number
}

export function StatsCards({ total, pending, accepted, expired }: StatsCardsProps) {
  const cards = [
    { label: 'Total Enviadas', value: total, valueClass: 'text-[#191C18]' },
    { label: 'Pendientes',     value: pending,  valueClass: 'text-[#92400E]' },
    { label: 'Completadas',    value: accepted, valueClass: 'text-[#154212]' },
    { label: 'Expiradas',      value: expired,  valueClass: 'text-[#991B1B]' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="region" aria-label="Métricas de invitaciones">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl bg-white p-4 border border-[#F3F4F6] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[#72796E]">
            {card.label}
          </p>
          <p className={`text-[30px] font-bold leading-none ${card.valueClass}`}>
            {card.value.toLocaleString('es')}
          </p>
        </div>
      ))}
    </div>
  )
}
