import type { InvitationStatus } from '@/types'

const statusConfig: Record<InvitationStatus, { label: string; className: string }> = {
  pending:   { label: 'Pendiente',  className: 'bg-[#FEF3C7] text-[#92400E]' },
  accepted:  { label: 'Completada', className: 'bg-[#BCF0AE] text-[#154212]' },
  expired:   { label: 'Expirada',   className: 'bg-[#FEE2E2] text-[#991B1B]' },
  cancelled: { label: 'Cancelada',  className: 'bg-[#F3F4F6] text-[#72796E]' },
}

export function StatusBadge({ status }: { status: InvitationStatus }) {
  const { label, className } = statusConfig[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${className}`}>
      {label}
    </span>
  )
}
