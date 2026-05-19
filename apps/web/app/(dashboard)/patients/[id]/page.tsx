'use client'

import { usePatient } from '@/features/patients/hooks/usePatients'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useParams } from 'next/navigation'

function formatDecimal(value: any): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'object' && value !== null) {
    return parseFloat(value.toString()).toString()
  }
  return value.toString()
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: patient, isLoading } = usePatient(id)

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />
  }

  if (!patient) {
    return <p className="text-muted-foreground">Paciente no encontrado</p>
  }

  const profile = patient.user?.profile

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
          {profile?.fullName?.charAt(0) ?? '?'}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{profile?.fullName}</h2>
          <p className="text-muted-foreground">{patient.user?.email}</p>
        </div>
        <Badge className="ml-auto">
          {patient.user?.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Teléfono', value: profile?.phone ?? '—' },
          { label: 'Fecha de nacimiento', value: formatDate(profile?.birthDate) },
          { label: 'Altura', value: patient.heightCm ? `${formatDecimal(patient.heightCm)} cm` : '—' },
          { label: 'Peso inicial', value: patient.initialWeightKg ? `${formatDecimal(patient.initialWeightKg)} kg` : '—' },
          { label: 'Peso objetivo', value: patient.targetWeightKg ? `${formatDecimal(patient.targetWeightKg)} kg` : '—' },
          { label: 'Alergias', value: patient.allergies ?? '—' },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</p>
            <p className="mt-1 font-medium">{item.value}</p>
          </div>
        ))}
      </div>

      {patient.medicalNotes && (
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Notas médicas</p>
          <p className="text-sm">{patient.medicalNotes}</p>
        </div>
      )}
    </div>
  )
}
