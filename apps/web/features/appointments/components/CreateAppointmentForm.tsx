'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateAppointment } from '../hooks/useAppointments'
import { usePatients } from '@/features/patients/hooks/usePatients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  patientId:   z.string().min(1, 'Selecciona un paciente'),
  scheduledAt: z.string().min(1, 'La fecha y hora es requerida'),
  durationMin: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs mt-1" style={{ color: 'var(--error)' }} role="alert">{message}</p>
}

interface CreateAppointmentFormProps {
  onSuccess?: () => void
}

export function CreateAppointmentForm({ onSuccess }: CreateAppointmentFormProps) {
  const { mutate: createAppointment, isPending } = useCreateAppointment()
  const { data: patients } = usePatients()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { durationMin: '60' },
  })

  function onSubmit(values: FormValues) {
    createAppointment(
      {
        patientId: values.patientId,
        scheduledAt: new Date(values.scheduledAt).toISOString(),
        durationMin: parseInt(values.durationMin ?? '60'),
      },
      { onSuccess: () => onSuccess?.() },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <p className="text-xs" style={{ color: 'var(--ink-400)' }}>
        Los campos con <span style={{ color: 'var(--error)', fontWeight: 600 }}>*</span> son requeridos
      </p>

      <div className="space-y-1">
        <Label htmlFor="patientId" className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
          Paciente <span style={{ color: 'var(--error)' }}>*</span>
        </Label>
        <select
          id="patientId"
          {...register('patientId')}
          className="w-full h-10 px-3 rounded-fb-sm text-sm border"
          style={{
            borderColor: errors.patientId ? 'var(--error)' : 'var(--ink-100)',
            backgroundColor: 'white',
            color: 'var(--ink-900)',
          }}
        >
          <option value="">Seleccionar paciente...</option>
          {patients?.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.user?.profile?.fullName ?? p.user?.email}
            </option>
          ))}
        </select>
        <FieldError message={errors.patientId?.message} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="scheduledAt" className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
            Fecha y hora <span style={{ color: 'var(--error)' }}>*</span>
          </Label>
          <Input
            id="scheduledAt"
            type="datetime-local"
            {...register('scheduledAt')}
            style={errors.scheduledAt ? { borderColor: 'var(--error)' } : {}}
          />
          <FieldError message={errors.scheduledAt?.message} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="durationMin" className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
            Duración (minutos)
          </Label>
          <select
            id="durationMin"
            {...register('durationMin')}
            className="w-full h-10 px-3 rounded-fb-sm text-sm border"
            style={{ borderColor: 'var(--ink-100)', backgroundColor: 'white', color: 'var(--ink-900)' }}
          >
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
            <option value="90">90 min</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs" style={{ color: 'var(--ink-400)' }}>
          <span style={{ color: 'var(--error)', fontWeight: 600 }}>*</span> Campos requeridos
        </p>
        <Button
          type="submit"
          disabled={isPending}
          style={{ backgroundColor: 'var(--green-950)', color: 'white' }}
        >
          {isPending ? 'Agendando...' : 'Agendar cita'}
        </Button>
      </div>
    </form>
  )
}
