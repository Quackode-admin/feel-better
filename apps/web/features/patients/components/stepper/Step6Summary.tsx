'use client'

import { StepperData } from './types'
import { Check } from 'lucide-react'

interface Props {
  data: StepperData
  caseNumber: string
}

export function Step6Summary({ data, caseNumber }: Props) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ')
  const today = new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })
  const time  = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })

  const currentWeight  = data.measures.weight.current  || data.measures.weight.previous
  const previousWeight = data.measures.weight.previous
  const goalWeight     = data.measures.weight.goal

  const diff = currentWeight && previousWeight
    ? parseFloat(currentWeight) - parseFloat(previousWeight)
    : null

  return (
    <div className="space-y-5">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Resumen de la consulta</span>
      </div>

      {/* Success banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 'var(--r-md)', backgroundColor: 'var(--green-50)', border: '1px solid var(--green-200)' }}>
        <Check size={16} strokeWidth={2.5} style={{ color: 'var(--green-700)', flexShrink: 0 }} />
        <p style={{ fontSize: '13px', color: 'var(--ink-700)' }}>
          La consulta está lista. Se enviará un resumen por correo a{' '}
          <strong style={{ color: 'var(--ink-900)' }}>{data.email || 'el paciente'}</strong>{' '}
          y al nutricionista.
        </p>
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Datos del caso */}
        <div style={{ padding: '20px 24px', borderRadius: 'var(--r-md)', backgroundColor: 'var(--green-25)', border: '1px solid var(--green-100)' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>
            Datos del caso
          </p>
          {[
            { label: 'CASO N°',      value: caseNumber },
            { label: 'FECHA',        value: `${today} · ${time}` },
            { label: 'PACIENTE',     value: fullName || '—' },
            { label: 'DUI',          value: data.dui || '—' },
            { label: 'CORREO',       value: data.email || '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ink-400)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink-900)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Feature card — Progreso */}
        <div
          style={{
            padding: '20px 24px',
            borderRadius: 'var(--r-md)',
            backgroundColor: 'var(--green-700)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Círculo decorativo */}
          <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', bottom: -20, right: -20 }} />

          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green-500)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>
            Progreso
          </p>

          {[
            { label: 'PESO ANTERIOR', value: previousWeight ? `${previousWeight} kg` : '—' },
            { label: 'PESO ACTUAL',   value: currentWeight
              ? `${currentWeight} kg ${diff !== null ? (diff < 0 ? `▼ ${Math.abs(diff)} kg` : diff > 0 ? `▲ ${diff} kg` : '') : ''}`
              : '—' },
            { label: 'META RESTANTE', value: goalWeight && currentWeight
              ? `${Math.abs(parseFloat(goalWeight) - parseFloat(currentWeight)).toFixed(1)} kg para ${goalWeight} kg`
              : '—' },
            { label: 'PRÓXIMA CITA',  value: data.nextAppointment
              ? new Date(data.nextAppointment).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })
              : '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--green-500)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
