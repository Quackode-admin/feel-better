'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreatePatient } from '../hooks/usePatients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const schema = z.object({
  firstName:      z.string().min(1, 'Requerido').max(50),
  middleName:     z.string().max(50).optional(),
  lastName:       z.string().min(1, 'Requerido').max(50),
  secondLastName: z.string().max(50).optional(),
  email:          z.string().min(1, 'Requerido').email('Correo inválido'),
  phone:          z.string().regex(/^\d{4}-\d{4}$/, 'Formato: XXXX-XXXX').optional().or(z.literal('')),
  birthDate:      z.string().optional(),
  heightCm:       z.string().optional(),
  initialWeightKg: z.string().optional(),
  targetWeightKg:  z.string().optional(),
  medicalNotes:   z.string().max(650, 'Máximo 650 caracteres').optional(),
})

type FormValues = z.infer<typeof schema>

const ALLERGIES_DB = [
  { id: 'milk',         label: 'Leche / Lácteos',        category: 'Alimentaria' },
  { id: 'eggs',         label: 'Huevo',                   category: 'Alimentaria' },
  { id: 'peanuts',      label: 'Maní / Cacahuate',        category: 'Alimentaria' },
  { id: 'tree_nuts',    label: 'Nueces y frutos secos',   category: 'Alimentaria' },
  { id: 'almonds',      label: 'Almendras',               category: 'Alimentaria' },
  { id: 'walnuts',      label: 'Nueces',                  category: 'Alimentaria' },
  { id: 'cashews',      label: 'Anacardos / Cashews',     category: 'Alimentaria' },
  { id: 'pistachios',   label: 'Pistachos',               category: 'Alimentaria' },
  { id: 'fish',         label: 'Pescado',                 category: 'Alimentaria' },
  { id: 'shellfish',    label: 'Mariscos / Crustáceos',   category: 'Alimentaria' },
  { id: 'shrimp',       label: 'Camarón',                 category: 'Alimentaria' },
  { id: 'wheat',        label: 'Trigo / Gluten',          category: 'Alimentaria' },
  { id: 'soy',          label: 'Soya',                    category: 'Alimentaria' },
  { id: 'sesame',       label: 'Ajonjolí / Sésamo',       category: 'Alimentaria' },
  { id: 'corn',         label: 'Maíz',                    category: 'Alimentaria' },
  { id: 'strawberry',   label: 'Fresa / Frutilla',        category: 'Alimentaria' },
  { id: 'tomato',       label: 'Tomate',                  category: 'Alimentaria' },
  { id: 'chocolate',    label: 'Chocolate / Cacao',       category: 'Alimentaria' },
  { id: 'citrus',       label: 'Cítricos (naranja, limón)', category: 'Alimentaria' },
  { id: 'avocado',      label: 'Aguacate / Palta',        category: 'Alimentaria' },
  { id: 'penicillin',   label: 'Penicilina',              category: 'Medicamento' },
  { id: 'aspirin',      label: 'Aspirina / AINEs',        category: 'Medicamento' },
  { id: 'sulfa',        label: 'Sulfonamidas',            category: 'Medicamento' },
  { id: 'ibuprofen',    label: 'Ibuprofeno',              category: 'Medicamento' },
  { id: 'latex',        label: 'Látex',                   category: 'Ambiental' },
  { id: 'pollen',       label: 'Polen',                   category: 'Ambiental' },
  { id: 'dust',         label: 'Polvo / Ácaros',          category: 'Ambiental' },
  { id: 'animal_dander',label: 'Pelo de animales',        category: 'Ambiental' },
  { id: 'bee_sting',    label: 'Picadura de abeja',       category: 'Ambiental' },
  { id: 'nickel',       label: 'Níquel',                  category: 'Ambiental' },
]

const CATEGORIES = ['Alimentaria', 'Medicamento', 'Ambiental']

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null
  return <p className="text-xs mt-1" style={{ color: 'var(--error)' }} role="alert">{message}</p>
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ink-500)', letterSpacing: '0.07em' }}>
      {children}
    </p>
  )
}

interface CreatePatientFormProps {
  onSuccess?: () => void
}

export function CreatePatientForm({ onSuccess }: CreatePatientFormProps) {
  const { mutate: createPatient, isPending } = useCreatePatient()
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
  const [customAllergy, setCustomAllergy] = useState('')
  const [customAllergies, setCustomAllergies] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('Alimentaria')

  const { register, handleSubmit, watch, setValue, setError, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  const medicalNotes = watch('medicalNotes') ?? ''
  const phone = watch('phone') ?? ''

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
    const formatted = digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits
    setValue('phone', formatted, { shouldValidate: true })
  }

  function toggleAllergy(id: string) {
    setSelectedAllergies((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id])
  }

  function addCustomAllergy() {
    const trimmed = customAllergy.trim()
    if (!trimmed || customAllergies.includes(trimmed)) return
    setCustomAllergies((prev) => [...prev, trimmed])
    setCustomAllergy('')
  }

  function onSubmit(values: FormValues) {
    const fullName = [values.firstName, values.middleName, values.lastName, values.secondLastName]
      .filter(Boolean).join(' ')

    const allergyLabels = [
      ...selectedAllergies.map((id) => ALLERGIES_DB.find((a) => a.id === id)?.label ?? id),
      ...customAllergies,
    ]

    createPatient(
      {
        fullName,
        email: values.email,
        phone: values.phone || undefined,
        birthDate: values.birthDate || undefined,
        heightCm: values.heightCm ? parseFloat(values.heightCm) : undefined,
        initialWeightKg: values.initialWeightKg ? parseFloat(values.initialWeightKg) : undefined,
        targetWeightKg: values.targetWeightKg ? parseFloat(values.targetWeightKg) : undefined,
        allergies: allergyLabels.join(', ') || undefined,
        medicalNotes: values.medicalNotes || undefined,
      },
      {
        onSuccess: () => onSuccess?.(),
        onError: (error: any) => {
          if (error.message?.toLowerCase().includes('correo')) {
            setError('email', { type: 'manual', message: 'Este correo ya está registrado' })
            document.getElementById('email')?.focus()
          } else {
            toast.error(error.message ?? 'Error al crear el paciente')
          }
        },
      },
    )
  }

  const filteredAllergies = ALLERGIES_DB.filter((a) => a.category === activeCategory)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

      {/* Leyenda */}
      <p className="text-xs" style={{ color: 'var(--ink-400)' }}>
        Los campos con <span style={{ color: 'var(--error)', fontWeight: 600 }}>*</span> son requeridos
      </p>

      {/* ── Nombre ─────────────────────────────────────── */}
      <div>
        <SectionTitle>Nombre completo</SectionTitle>
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'firstName', label: 'Primer nombre', required: true, reg: register('firstName'), err: errors.firstName },
            { id: 'middleName', label: 'Segundo nombre', required: false, reg: register('middleName'), err: errors.middleName },
            { id: 'lastName', label: 'Primer apellido', required: true, reg: register('lastName'), err: errors.lastName },
            { id: 'secondLastName', label: 'Segundo apellido', required: false, reg: register('secondLastName'), err: errors.secondLastName },
          ].map(({ id, label, required, reg, err }) => (
            <div key={id} className="space-y-1">
              <Label htmlFor={id} className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
                {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
              </Label>
              <Input
                id={id}
                {...reg}
                style={err ? { borderColor: 'var(--error)' } : {}}
              />
              <FieldError message={err?.message} />
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: 'var(--green-100)' }} />

      {/* ── Contacto ───────────────────────────────────── */}
      <div>
        <SectionTitle>Contacto</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
              Correo electrónico <span style={{ color: 'var(--error)' }}>*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              style={errors.email ? { borderColor: 'var(--error)' } : {}}
            />
            <FieldError message={errors.email?.message} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone" className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
              Teléfono
            </Label>
            <Input
              id="phone"
              placeholder="0000-0000"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={9}
              style={errors.phone ? { borderColor: 'var(--error)' } : {}}
            />
            <FieldError message={errors.phone?.message} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="birthDate" className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
              Fecha de nacimiento
            </Label>
            <Input id="birthDate" type="date" {...register('birthDate')} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: 'var(--green-100)' }} />

      {/* ── Datos clínicos ─────────────────────────────── */}
      <div>
        <SectionTitle>Datos clínicos</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'heightCm', label: 'Altura (cm)', placeholder: '165' },
            { id: 'initialWeightKg', label: 'Peso inicial (kg)', placeholder: '70' },
            { id: 'targetWeightKg', label: 'Peso objetivo (kg)', placeholder: '65' },
          ].map(({ id, label, placeholder }) => (
            <div key={id} className="space-y-1">
              <Label htmlFor={id} className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
                {label}
              </Label>
              <Input id={id} type="number" placeholder={placeholder} {...register(id as any)} />
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: 'var(--green-100)' }} />

      {/* ── Alergias ───────────────────────────────────── */}
      <div>
        <SectionTitle>Alergias</SectionTitle>

        {/* Categorías */}
        <div className="flex gap-2 mb-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="text-xs px-3 py-1.5 rounded-fb-pill transition-colors"
              style={
                activeCategory === cat
                  ? { backgroundColor: 'var(--green-950)', color: 'white' }
                  : { backgroundColor: 'var(--green-50)', color: 'var(--ink-700)', border: '1px solid var(--green-200)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div
          className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-3 rounded-fb-md mb-3"
          style={{ backgroundColor: 'var(--green-25)', border: '1px solid var(--green-100)' }}
        >
          {filteredAllergies.map((allergy) => {
            const active = selectedAllergies.includes(allergy.id)
            return (
              <button
                key={allergy.id}
                type="button"
                onClick={() => toggleAllergy(allergy.id)}
                className="text-xs px-2.5 py-1 rounded-fb-pill transition-colors"
                style={
                  active
                    ? { backgroundColor: 'rgb(254 226 226)', color: 'var(--error)', fontWeight: 500, border: '1px solid rgb(252 165 165)' }
                    : { backgroundColor: 'white', color: 'var(--ink-700)', border: '1px solid var(--green-200)' }
                }
              >
                {allergy.label}
              </button>
            )
          })}
        </div>

        {/* Seleccionadas */}
        {(selectedAllergies.length > 0 || customAllergies.length > 0) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {selectedAllergies.map((id) => {
              const label = ALLERGIES_DB.find((a) => a.id === id)?.label ?? id
              return (
                <span
                  key={id}
                  onClick={() => toggleAllergy(id)}
                  className="text-xs px-2.5 py-1 rounded-fb-pill cursor-pointer"
                  style={{ backgroundColor: 'rgb(254 226 226)', color: 'var(--error)', border: '1px solid rgb(252 165 165)' }}
                >
                  {label} ×
                </span>
              )
            })}
            {customAllergies.map((allergy) => (
              <span
                key={allergy}
                onClick={() => setCustomAllergies((prev) => prev.filter((a) => a !== allergy))}
                className="text-xs px-2.5 py-1 rounded-fb-pill cursor-pointer"
                style={{ backgroundColor: 'var(--green-50)', color: 'var(--ink-700)', border: '1px solid var(--green-200)' }}
              >
                {allergy} ×
              </span>
            ))}
          </div>
        )}

        {/* Agregar otra */}
        <div className="flex gap-2">
          <Input
            value={customAllergy}
            onChange={(e) => setCustomAllergy(e.target.value)}
            placeholder="Agregar otra alergia..."
            className="text-sm"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomAllergy() } }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCustomAllergy}
            style={{ borderColor: 'var(--green-200)', color: 'var(--green-800)' }}
          >
            Agregar
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: 'var(--green-100)' }} />

      {/* ── Notas médicas ──────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="medicalNotes" className="text-xs font-medium" style={{ color: 'var(--ink-700)' }}>
            Notas médicas
          </Label>
          <span
            className="text-xs tabular-nums"
            style={{ color: medicalNotes.length > 600 ? 'var(--error)' : 'var(--ink-400)' }}
          >
            {medicalNotes.length} / 650
          </span>
        </div>
        <Textarea
          id="medicalNotes"
          placeholder="Información clínica relevante..."
          rows={3}
          {...register('medicalNotes')}
          style={errors.medicalNotes ? { borderColor: 'var(--error)' } : {}}
        />
        <FieldError message={errors.medicalNotes?.message} />
      </div>

      {/* ── Footer ─────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs" style={{ color: 'var(--ink-400)' }}>
          <span style={{ color: 'var(--error)', fontWeight: 600 }}>*</span> Campos requeridos
        </p>
        <Button
          type="submit"
          disabled={isPending}
          className="min-w-[140px]"
          style={{ backgroundColor: 'var(--green-950)', color: 'white' }}
        >
          {isPending ? 'Guardando...' : 'Crear paciente'}
        </Button>
      </div>

    </form>
  )
}
