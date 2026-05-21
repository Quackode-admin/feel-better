'use client'

import { usePatient } from '@/features/patients/hooks/usePatients'
import { Skeleton } from '@/components/ui/skeleton'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Phone, Calendar, Ruler, Weight, Target, AlertCircle } from 'lucide-react'

function toNum(v: any): number | null {
  const n = Number(v)
  return isNaN(n) ? null : n
}

function fmt(v: any, unit: string): string {
  const n = toNum(v)
  return n !== null ? `${n} ${unit}` : '—'
}

function fmtDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es', { day: '2-digit', month: 'long', year: 'numeric' })
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--white)',
        border: '1px solid #F5F5F5',
        borderRadius: 'var(--r-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ color: 'var(--ink-400)' }}>{icon}</span>
        <span className="t-overline" style={{ color: 'var(--ink-500)', fontSize: 11 }}>{label}</span>
      </div>
      <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink-900)' }}>{value}</p>
    </div>
  )
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const { data: patient, isLoading } = usePatient(id)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" style={{ borderRadius: 'var(--r-md)' }} />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-24" style={{ borderRadius: 'var(--r-md)' }} />)}
        </div>
      </div>
    )
  }

  if (!patient) {
    return <p style={{ color: 'var(--ink-500)' }}>Paciente no encontrado</p>
  }

  const profile  = patient.user?.profile
  const fullName = profile?.fullName ?? patient.user?.email ?? 'Sin nombre'
  const initial  = fullName.charAt(0).toUpperCase()
  const isActive = patient.user?.isActive

  return (
    <div className="space-y-6">

      {/* Back */}
      <button
        onClick={() => router.back()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--ink-500)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          transition: 'color 150ms',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-900)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-500)')}
      >
        <ArrowLeft size={16} strokeWidth={2.25} />
        Volver a pacientes
      </button>

      {/* Hero card */}
      <div
        style={{
          backgroundColor: 'var(--white)',
          border: '1px solid #F5F5F5',
          borderRadius: 'var(--r-md)',
          padding: '24px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '9999px',
            backgroundColor: 'var(--green-100)',
            border: '2px solid var(--green-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--green-800)',
            flexShrink: 0,
          }}
        >
          {initial}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink-900)', marginBottom: 4 }}>
            {fullName}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-500)', fontWeight: 500 }}>
            {patient.user?.email}
          </p>
        </div>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: isActive ? 'var(--green-400)' : 'var(--ink-100)',
            color: isActive ? 'var(--green-800)' : 'var(--ink-500)',
          }}
        >
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<Phone size={16} strokeWidth={2.25}/>} label="TELÉFONO"           value={profile?.phone ?? '—'} />
        <StatCard icon={<Calendar size={16} strokeWidth={2.25}/>} label="FECHA DE NACIMIENTO" value={fmtDate(profile?.birthDate)} />
        <StatCard icon={<Ruler size={16} strokeWidth={2.25}/>}    label="ALTURA"           value={fmt(patient.heightCm, 'cm')} />
        <StatCard icon={<Weight size={16} strokeWidth={2.25}/>}   label="PESO INICIAL"     value={fmt(patient.initialWeightKg, 'kg')} />
        <StatCard icon={<Target size={16} strokeWidth={2.25}/>}   label="PESO OBJETIVO"    value={fmt(patient.targetWeightKg, 'kg')} />
        <StatCard icon={<AlertCircle size={16} strokeWidth={2.25}/>} label="ALERGIAS"       value={patient.allergies ?? '—'} />
      </div>

      {/* Notas médicas */}
      {patient.medicalNotes && (
        <div
          style={{
            backgroundColor: 'var(--white)',
            border: '1px solid #F5F5F5',
            borderRadius: 'var(--r-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <p className="t-overline" style={{ color: 'var(--ink-500)', fontSize: 11, marginBottom: 8 }}>
            NOTAS MÉDICAS
          </p>
          <p style={{ fontSize: '14px', color: 'var(--ink-700)', lineHeight: '22px' }}>
            {patient.medicalNotes}
          </p>
        </div>
      )}

    </div>
  )
}
