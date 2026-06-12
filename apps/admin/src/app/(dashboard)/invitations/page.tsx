'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { UserPlus } from 'lucide-react'
import { StatsCards } from '@/components/invitations/stats-cards'
import { InvitationTable } from '@/components/invitations/invitation-table'
import { InviteModal } from '@/components/invitations/invite-modal'
import { invitationsApi } from '@/lib/api'

const STATUS_FILTERS = [
  { label: 'Todas',      value: '' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Expiradas',  value: 'expired' },
  { label: 'Canceladas', value: 'cancelled' },
]

export default function InvitationsPage() {
  const { getToken } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['invitations', { page, status: statusFilter }],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('No autorizado')
      return invitationsApi.list(token, { page, limit: 10, status: statusFilter })
    },
  })

  const total    = data?.total ?? 0
  const pending  = data?.data.filter((i) => i.status === 'pending').length ?? 0
  const accepted = data?.data.filter((i) => i.status === 'accepted').length ?? 0
  const expired  = data?.data.filter((i) => i.status === 'expired').length ?? 0

  return (
    <>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-[#191C18]">
              Gestión de Invitaciones
            </h1>
            <p className="mt-1 text-[13px] text-[#72796E]">
              Administra y realiza el seguimiento de las invitaciones enviadas a nutricionistas.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#154212] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-[#2D5A27] transition-colors"
            aria-haspopup="dialog"
          >
            <UserPlus size={15} aria-hidden="true" />
            Invitar Nutricionista
          </button>
        </div>

        <div className="mb-5">
          <StatsCards total={total} pending={pending} accepted={accepted} expired={expired} />
        </div>

        <div className="overflow-hidden rounded-xl border border-[#F3F4F6] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center gap-2 border-b border-[#FAFAFA] px-4 py-3">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => { setStatusFilter(f.value); setPage(1) }}
                aria-pressed={statusFilter === f.value}
                className={`rounded-full px-3.5 py-1 text-[12px] font-medium border transition-colors ${
                  statusFilter === f.value
                    ? 'bg-[#154212] text-white border-[#154212]'
                    : 'border-[#E2E3DC] text-[#72796E] bg-white hover:bg-[#FAFAFA]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-16 text-[14px] text-[#9CA3AF]">
              Cargando invitaciones...
            </div>
          )}
          {isError && (
            <div className="flex items-center justify-center py-16 text-[14px] text-[#F44336]">
              Error al cargar. Intenta de nuevo.
            </div>
          )}
          {data && (
            <InvitationTable
              invitations={data.data}
              total={data.total}
              page={page}
              limit={10}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <InviteModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
