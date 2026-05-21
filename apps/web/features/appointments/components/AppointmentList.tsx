'use client'

import { useAppointments } from '../hooks/useAppointments'
import { useUpdateAppointment } from '../hooks/useAppointments'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Clock, User } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  scheduled:  'Agendada',
  confirmed:  'Confirmada',
  cancelled:  'Cancelada',
  completed:  'Completada',
  no_show:    'No asistió',
}

const STATUS_STYLES: Record<string, React.CSSProperties> = {
  scheduled:  { backgroundColor: 'var(--green-50)',  color: 'var(--green-800)' },
  confirmed:  { backgroundColor: 'rgb(220 252 231)', color: 'rgb(22 101 52)'   },
  cancelled:  { backgroundColor: 'rgb(254 226 226)', color: 'var(--error)'     },
  completed:  { backgroundColor: 'var(--green-100)', color: 'var(--green-950)' },
  no_show:    { backgroundColor: 'rgb(254 249 195)', color: 'rgb(133 77 14)'   },
}

export function AppointmentList() {
  const { data: appointments, isLoading, isError } = useAppointments()
  const { mutate: updateAppointment } = useUpdateAppointment()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-fb-md" />)}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-fb-md p-4 text-sm text-center" style={{ backgroundColor: 'rgb(254 226 226)', color: 'var(--error)' }}>
        No se pudieron cargar las citas
      </div>
    )
  }

  if (!appointments?.length) {
    return (
      <div className="rounded-fb-md border p-8 text-center" style={{ borderColor: 'var(--green-100)', borderStyle: 'dashed' }}>
        <Calendar size={32} className="mx-auto mb-2" style={{ color: 'var(--ink-400)' }} />
        <p className="text-sm" style={{ color: 'var(--ink-500)' }}>No hay citas agendadas</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {appointments.map((apt: any) => (
        <div
          key={apt.id}
          className="rounded-fb-md p-5 flex items-center justify-between"
          style={{ backgroundColor: 'white', border: '1px solid var(--green-100)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-fb-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--green-50)' }}
            >
              <Calendar size={20} style={{ color: 'var(--green-700)' }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--ink-900)' }}>
                {apt.patient?.user?.profile?.fullName ?? 'Paciente'}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-500)' }}>
                  <Calendar size={12} />
                  {new Date(apt.scheduledAt).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-500)' }}>
                  <Clock size={12} />
                  {new Date(apt.scheduledAt).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-500)' }}>
                  <User size={12} />
                  {apt.nutritionist?.user?.profile?.fullName ?? 'Nutricionista'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="text-xs font-medium px-3 py-1 rounded-fb-pill"
              style={STATUS_STYLES[apt.status] ?? STATUS_STYLES.scheduled}
            >
              {STATUS_LABELS[apt.status] ?? apt.status}
            </span>

            {apt.status === 'scheduled' && (
              <div className="flex gap-2">
                <button
                  onClick={() => updateAppointment({ id: apt.id, data: { status: 'confirmed' } })}
                  className="text-xs px-3 py-1 rounded-fb-pill transition-colors"
                  style={{ backgroundColor: 'var(--green-50)', color: 'var(--green-800)', border: '1px solid var(--green-200)' }}
                >
                  Confirmar
                </button>
                <button
                  onClick={() => updateAppointment({ id: apt.id, data: { status: 'cancelled' } })}
                  className="text-xs px-3 py-1 rounded-fb-pill transition-colors"
                  style={{ backgroundColor: 'rgb(254 226 226)', color: 'var(--error)', border: '1px solid rgb(252 165 165)' }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
