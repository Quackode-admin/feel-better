'use client'

import { Send, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { StatusBadge } from './status-badge'
import { invitationsApi, type Invitation } from '@/lib/api'

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

const avatarColors: Record<string, string> = {
  pending:   'bg-[#FEF3C7] text-[#92400E]',
  accepted:  'bg-[#BCF0AE] text-[#154212]',
  expired:   'bg-[#FEE2E2] text-[#991B1B]',
  cancelled: 'bg-[#F3F4F6] text-[#72796E]',
}

interface InvitationTableProps {
  invitations: Invitation[]
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
}

export function InvitationTable({ invitations, total, page, limit, onPageChange }: InvitationTableProps) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const resendMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      if (!token) throw new Error('No autorizado')
      return invitationsApi.resend(token, id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invitations'] }),
  })

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      if (!token) throw new Error('No autorizado')
      return invitationsApi.cancel(token, id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invitations'] }),
  })

  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div>
      <table className="w-full border-collapse" aria-label="Lista de invitaciones">
        <thead>
          <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
            {['Email del Nutricionista','Estado','Fecha de Envío','Acciones'].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-widest text-[#72796E]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invitations.length === 0 && (
            <tr>
              <td colSpan={4} className="py-12 text-center text-[14px] text-[#9CA3AF]">
                No hay invitaciones en esta categoría.
              </td>
            </tr>
          )}
          {invitations.map((inv) => (
            <tr key={inv.id} className="border-b border-[#FAFAFA] last:border-none hover:bg-[#FAFAFA] transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${avatarColors[inv.status]}`} aria-hidden="true">
                    {getInitials(inv.firstName, inv.lastName)}
                  </div>
                  <span className="text-[13px] font-medium text-[#191C18]">{inv.email}</span>
                </div>
              </td>
              <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
              <td className="px-4 py-3"><span className="text-[13px] text-[#42493E]">{formatDate(inv.createdAt)}</span></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {inv.status === 'accepted' && (
                    <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#F3F4F6] bg-white text-[#72796E] hover:bg-[#FAFAFA] transition-colors" title="Ver perfil" aria-label={`Ver perfil de ${inv.email}`}>
                      <Eye size={13} />
                    </button>
                  )}
                  {inv.status === 'pending' && (
                    <>
                      <button onClick={() => resendMutation.mutate(inv.id)} disabled={resendMutation.isPending} className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#F3F4F6] bg-white text-[#72796E] hover:bg-[#FAFAFA] disabled:opacity-50 transition-colors" title="Reenviar" aria-label={`Reenviar a ${inv.email}`}>
                        <Send size={12} />
                      </button>
                      <button onClick={() => { if (confirm('¿Cancelar esta invitación?')) cancelMutation.mutate(inv.id) }} disabled={cancelMutation.isPending} className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#FEE2E2] bg-white text-[#DC2626] hover:bg-[#FEF2F2] disabled:opacity-50 transition-colors" title="Cancelar" aria-label={`Cancelar invitación a ${inv.email}`}>
                        <X size={13} />
                      </button>
                    </>
                  )}
                  {inv.status === 'expired' && (
                    <button onClick={() => resendMutation.mutate(inv.id)} disabled={resendMutation.isPending} className="text-[12px] font-medium text-[#2D5A27] hover:underline disabled:opacity-50">
                      Reenviar
                    </button>
                  )}
                  {inv.status === 'cancelled' && (
                    <span className="text-[12px] italic text-[#9CA3AF]">Sin acciones</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-[#FAFAFA] px-4 py-3">
        <span className="text-[12px] text-[#72796E]">Mostrando {start}–{end} de {total} invitaciones</span>
        <nav className="flex items-center gap-1" aria-label="Paginación">
          <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E2E3DC] bg-white text-[#42493E] hover:bg-[#FAFAFA] disabled:opacity-40 transition-colors" aria-label="Página anterior">
            <ChevronLeft size={13} />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => onPageChange(p)} aria-label={`Página ${p}`} aria-current={p === page ? 'page' : undefined}
              className={`flex h-7 w-7 items-center justify-center rounded-lg border text-[12px] transition-colors ${p === page ? 'border-[#154212] bg-[#154212] font-bold text-white' : 'border-[#E2E3DC] bg-white text-[#42493E] hover:bg-[#FAFAFA]'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E2E3DC] bg-white text-[#42493E] hover:bg-[#FAFAFA] disabled:opacity-40 transition-colors" aria-label="Página siguiente">
            <ChevronRight size={13} />
          </button>
        </nav>
      </div>
    </div>
  )
}
