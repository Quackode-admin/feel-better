'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useCreateAppointment } from '../hooks/useAppointments'
import { usePatients } from '@/features/patients/hooks/usePatients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Search } from 'lucide-react'

const APPOINTMENT_TYPES = [
  'Primera visita',
  'Seguimiento',
  'Ajuste de dieta',
  'Control de peso',
  'Evaluación nutricional',
  'Revisión de análisis',
  'Consulta de urgencia',
]

const schema = z.object({
  patientId:       z.string().min(1, 'Selecciona un paciente'),
  appointmentDate: z.string().min(1, 'La fecha es requerida'),
  appointmentTime: z.string().min(1, 'La hora es requerida'),
  appointmentType: z.string().min(1, 'Selecciona el tipo de consulta'),
  durationMin:     z.string().optional(),
  notes:           z.string().max(500).optional(),
})

type FormValues = z.infer<typeof schema>

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null
  return <p className="text-xs mt-1" style={{ color: 'var(--error)' }} role="alert">{message}</p>
}

interface CreateAppointmentFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateAppointmentForm({ onSuccess, onCancel }: CreateAppointmentFormProps) {
  const { mutate: createAppointment, isPending } = useCreateAppointment()
  const { data: patients } = usePatients()
  const [search, setSearch] = useState('')

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { durationMin: '60', appointmentType: 'Primera visita' },
  })

  const selectedPatientId = watch('patientId')

  const filteredPatients = patients?.filter((p: any) =>
    p.user?.profile?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    p.user?.email?.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  function onSubmit(values: FormValues) {
    const scheduledAt = new Date(`${values.appointmentDate}T${values.appointmentTime}`).toISOString()
    createAppointment(
      {
        patientId:   values.patientId,
        scheduledAt,
        durationMin: parseInt(values.durationMin ?? '60'),
        notes:       values.notes,
        type:        values.appointmentType,
      },
      { onSuccess: () => onSuccess?.() },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

      <p className="text-xs" style={{ color: 'var(--ink-400)' }}>
        Los campos con <span style={{ color: 'var(--error)', fontWeight: 600 }}>*</span> son requeridos
      </p>

      {/* Buscar paciente */}
      <div className="space-y-1">
        <Label className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
          Paciente <span style={{ color: 'var(--error)' }}>*</span>
        </Label>

        {/* Search input */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-400)' }} />
          <input
            type="text"
            placeholder="Nombre del paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-sm rounded-fb-sm border outline-none transition-colors"
            style={{ borderColor: errors.patientId ? 'var(--error)' : 'var(--ink-100)', backgroundColor: 'white', color: 'var(--ink-900)' }}
          />
        </div>

        {/* Lista de pacientes filtrados */}
        {search && filteredPatients.length > 0 && (
          <div
            className="rounded-fb-sm border mt-1 max-h-40 overflow-y-auto"
            style={{ borderColor: 'var(--green-200)', backgroundColor: 'white', boxShadow: 'var(--shadow-pop)' }}
          >
            {filteredPatients.map((p: any) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setValue('patientId', p.id, { shouldValidate: true })
                  setSearch(p.user?.profile?.fullName ?? p.user?.email ?? '')
                }}
                className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-fb-green-25"
                style={
                  selectedPatientId === p.id
                    ? { backgroundColor: 'var(--green-50)', color: 'var(--green-950)', fontWeight: 500 }
                    : { color: 'var(--ink-700)' }
                }
              >
                <p className="font-medium" style={{ color: 'var(--ink-900)' }}>{p.user?.profile?.fullName}</p>
                <p className="text-xs" style={{ color: 'var(--ink-400)' }}>{p.user?.email}</p>
              </button>
            ))}
          </div>
        )}

        {search && filteredPatients.length === 0 && (
          <p className="text-xs mt-1" style={{ color: 'var(--ink-400)' }}>No se encontraron pacientes</p>
        )}

        <input type="hidden" {...register('patientId')} />
        <FieldError message={errors.patientId?.message} />
      </div>

      {/* Fecha y hora */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="appointmentDate" className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
            Fecha <span style={{ color: 'var(--error)' }}>*</span>
          </Label>
          <Input
            id="appointmentDate"
            type="date"
            {...register('appointmentDate')}
            style={errors.appointmentDate ? { borderColor: 'var(--error)' } : {}}
          />
          <FieldError message={errors.appointmentDate?.message} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="appointmentTime" className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
            Hora <span style={{ color: 'var(--error)' }}>*</span>
          </Label>
          <Input
            id="appointmentTime"
            type="time"
            {...register('appointmentTime')}
            style={errors.appointmentTime ? { borderColor: 'var(--error)' } : {}}
          />
          <FieldError message={errors.appointmentTime?.message} />
        </div>
      </div>

      {/* Tipo de consulta y duración */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="appointmentType" className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
            Tipo de consulta <span style={{ color: 'var(--error)' }}>*</span>
          </Label>
          <select
            id="appointmentType"
            {...register('appointmentType')}
            className="w-full h-10 px-3 rounded-fb-sm text-sm border outline-none"
            style={{
              borderColor: errors.appointmentType ? 'var(--error)' : 'var(--ink-100)',
              backgroundColor: 'white',
              color: 'var(--ink-900)',
            }}
          >
            {APPOINTMENT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <FieldError message={errors.appointmentType?.message} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="durationMin" className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
            Duración
          </Label>
          <select
            id="durationMin"
            {...register('durationMin')}
            className="w-full h-10 px-3 rounded-fb-sm text-sm border outline-none"
            style={{ borderColor: 'var(--ink-100)', backgroundColor: 'white', color: 'var(--ink-900)' }}
          >
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
            <option value="90">90 min</option>
            <option value="120">120 min</option>
          </select>
        </div>
      </div>

      {/* Notas */}
      <div className="space-y-1">
        <Label htmlFor="notes" className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
          Notas adicionales
        </Label>
        <Textarea
          id="notes"
          placeholder="Detalles adicionales..."
          rows={3}
          {...register('notes')}
        />
      </div>

      {/* Footer */}
      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            style={{ borderColor: 'var(--green-200)', color: 'var(--ink-700)' }}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          style={{ backgroundColor: 'var(--green-950)', color: 'white' }}
        >
          {isPending ? 'Confirmando...' : 'Confirmar cita'}
        </Button>
      </div>

    </form>
  )
}
