'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { invitationsApi } from '@/lib/api'

const schema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres'),
  lastName:  z.string().min(2, 'Mínimo 2 caracteres'),
  email:     z.string().email('Correo inválido'),
  specialty: z.string().min(2, 'Ingresa una especialidad'),
  phone:     z.string().optional(),
  country:   z.string().optional(),
  note:      z.string().max(200, 'Máximo 200 caracteres').optional(),
})

type FormValues = z.infer<typeof schema>

const LATAM_COUNTRIES = [
  'México','Guatemala','El Salvador','Honduras','Nicaragua',
  'Costa Rica','Panamá','Colombia','Venezuela','Ecuador',
  'Perú','Bolivia','Chile','Argentina','Uruguay','Paraguay',
  'República Dominicana','Cuba','Puerto Rico',
]

const SPECIALTIES = [
  'Nutrición Clínica','Deportiva','Pediátrica','Oncológica','Diabetes',
  'Cardiovascular','Renal','Bariátrica','TCA','Gerontológica',
  'Materno-Infantil','Vegana','Funcional','Fitoterapia','Alergias',
  'Estética','Salud Mental',
]

interface InviteModalProps {
  open: boolean
  onClose: () => void
}

export function InviteModal({ open, onClose }: InviteModalProps) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const token = await getToken()
      if (!token) throw new Error('No autorizado')
      return invitationsApi.create(token, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
      reset()
      onClose()
    },
  })

  if (!open) return null

  const ic = (err: boolean) =>
    'w-full rounded-lg border bg-white px-3 py-2 text-[14px] text-[#191C18] outline-none transition-colors placeholder:text-[#9CA3AF] ' +
    (err ? 'border-[#F44336] focus:ring-2 focus:ring-[#F44336]/10' : 'border-[#F3F4F6] focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="invite-modal-title" className="text-[16px] font-bold text-[#154212]">
            Invitar Nutricionista
          </h2>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#F3F4F6] text-[#72796E] hover:bg-[#FAFAFA]" aria-label="Cerrar">
            <X size={14} />
          </button>
        </div>

        {mutation.isError && (
          <div className="mb-4 rounded-lg bg-[#FEE2E2] px-3 py-2 text-[13px] text-[#991B1B]">
            {mutation.error instanceof Error ? mutation.error.message : 'Error al enviar.'}
          </div>
        )}

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#42493E]">Nombre *</label>
              <input {...register('firstName')} placeholder="Ana" className={ic(!!errors.firstName)} />
              {errors.firstName && <p className="mt-1 text-[12px] text-[#F44336]">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#42493E]">Apellidos *</label>
              <input {...register('lastName')} placeholder="García" className={ic(!!errors.lastName)} />
              {errors.lastName && <p className="mt-1 text-[12px] text-[#F44336]">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block text-[13px] font-medium text-[#42493E]">Correo electrónico *</label>
            <input {...register('email')} type="email" placeholder="nutricionista@correo.com" className={ic(!!errors.email)} />
            {errors.email && <p className="mt-1 text-[12px] text-[#F44336]">{errors.email.message}</p>}
            <p className="mt-1 text-[12px] text-[#72796E]">Link válido por 72 horas.</p>
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block text-[13px] font-medium text-[#42493E]">Especialidad *</label>
            <select {...register('specialty')} className={ic(!!errors.specialty)}>
              <option value="">Selecciona una especialidad</option>
              {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.specialty && <p className="mt-1 text-[12px] text-[#F44336]">{errors.specialty.message}</p>}
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#42493E]">País</label>
              <select {...register('country')} className={ic(false)}>
                <option value="">Selecciona</option>
                {LATAM_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#42493E]">Teléfono</label>
              <input {...register('phone')} placeholder="+52 55..." className={ic(false)} />
            </div>
          </div>
          <div className="mb-5">
            <label className="mb-1.5 block text-[13px] font-medium text-[#42493E]">Nota <span className="text-[#9CA3AF] font-normal">(opcional)</span></label>
            <textarea {...register('note')} rows={2} placeholder="Mensaje opcional..." className={ic(!!errors.note) + ' resize-none'} />
            {errors.note && <p className="mt-1 text-[12px] text-[#F44336]">{errors.note.message}</p>}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-[#F3F4F6] bg-white py-2.5 text-[13px] font-medium text-[#42493E] hover:bg-[#FAFAFA]">
              Cancelar
            </button>
            <button type="submit" disabled={mutation.isPending} className="flex flex-[2] items-center justify-center gap-2 rounded-lg bg-[#154212] py-2.5 text-[13px] font-bold text-white hover:bg-[#2D5A27] disabled:opacity-60">
              {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
              Enviar invitación
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
