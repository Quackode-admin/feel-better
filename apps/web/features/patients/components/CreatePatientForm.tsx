'use client'

import { useState } from 'react'
import { useCreatePatient } from '../hooks/usePatients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface CreatePatientFormProps {
  onSuccess?: () => void
}

export function CreatePatientForm({ onSuccess }: CreatePatientFormProps) {
  const { mutate: createPatient, isPending } = useCreatePatient()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    heightCm: '',
    initialWeightKg: '',
    targetWeightKg: '',
    allergies: '',
    medicalNotes: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createPatient(
      {
        ...form,
        heightCm: form.heightCm ? parseFloat(form.heightCm) : undefined,
        initialWeightKg: form.initialWeightKg ? parseFloat(form.initialWeightKg) : undefined,
        targetWeightKg: form.targetWeightKg ? parseFloat(form.targetWeightKg) : undefined,
      },
      { onSuccess },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo *</Label>
          <Input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">Fecha de nacimiento</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heightCm">Altura (cm)</Label>
          <Input
            id="heightCm"
            name="heightCm"
            type="number"
            value={form.heightCm}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="initialWeightKg">Peso inicial (kg)</Label>
          <Input
            id="initialWeightKg"
            name="initialWeightKg"
            type="number"
            value={form.initialWeightKg}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetWeightKg">Peso objetivo (kg)</Label>
          <Input
            id="targetWeightKg"
            name="targetWeightKg"
            type="number"
            value={form.targetWeightKg}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="allergies">Alergias</Label>
          <Input
            id="allergies"
            name="allergies"
            value={form.allergies}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="medicalNotes">Notas médicas</Label>
        <Textarea
          id="medicalNotes"
          name="medicalNotes"
          value={form.medicalNotes}
          onChange={handleChange}
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Crear paciente'}
        </Button>
      </div>
    </form>
  )
}
