'use client'

import { usePatients } from '../hooks/usePatients'
import { Skeleton } from '@/components/ui/skeleton'
import { Users } from 'lucide-react'
import Link from 'next/link'

export function PatientList() {
  const { data: patients, isLoading, isError } = usePatients()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" style={{ borderRadius: 'var(--r-md)' }} />)}
      </div>
    )
  }

  if (isError) {
    return (
      <div
        className="p-4 text-sm text-center"
        style={{ backgroundColor: 'rgb(254 226 226)', color: 'var(--error)', borderRadius: 'var(--r-md)' }}
      >
        No se pudieron cargar los pacientes
      </div>
    )
  }

  if (!patients?.length) {
    return (
      <div
        className="p-8 text-center"
        style={{
          border: '1px dashed var(--green-200)',
          borderRadius: 'var(--r-md)',
          backgroundColor: 'var(--white)',
        }}
      >
        <Users size={32} className="mx-auto mb-3" style={{ color: 'var(--ink-400)' }} />
        <p style={{ fontSize: '14px', color: 'var(--ink-500)', fontWeight: 500 }}>
          Aún no tienes pacientes registrados
        </p>
        <p style={{ fontSize: '12px', color: 'var(--ink-400)', marginTop: 4 }}>
          Crea tu primer paciente usando el botón de arriba
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--r-md)',
        border: '1px solid #F5F5F5',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      {patients.map((patient: any, idx: number) => {
        const profile  = patient.user?.profile
        const fullName = profile?.fullName ?? patient.user?.email ?? 'Sin nombre'
        const initial  = fullName.charAt(0).toUpperCase()
        const isActive = patient.user?.isActive

        return (
          <Link
            key={patient.id}
            href={`/patients/${patient.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderTop: idx > 0 ? '1px solid #FAFAFA' : 'none',
              textDecoration: 'none',
              transition: 'background-color 150ms cubic-bezier(0.2, 0, 0, 1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--green-25)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Avatar */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '9999px',
                  backgroundColor: 'var(--green-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--green-800)',
                  flexShrink: 0,
                  border: '2px solid var(--green-200)',
                }}
              >
                {initial}
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink-900)', marginBottom: 2 }}>
                  {fullName}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--ink-500)', fontWeight: 500 }}>
                  {patient.user?.email}
                </p>
              </div>
            </div>

            {/* Badge estado */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? 'var(--green-400)' : 'var(--ink-100)',
                  color: isActive ? 'var(--green-800)' : 'var(--ink-500)',
                }}
              >
                {isActive ? 'Activo' : 'Inactivo'}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="var(--ink-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
