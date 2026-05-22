'use client'

import { StepperData } from './types'
import { Check, TrendingDown, TrendingUp, Minus, Download } from 'lucide-react'

interface Props {
  data: StepperData
  caseNumber: string
  onDownloadPDF?: () => void
  isPDFGenerating?: boolean
}

export function Step6Summary({ data, caseNumber, onDownloadPDF, isPDFGenerating }: Props) {
  const fullName = [data.firstName, data.middleName, data.lastName, data.secondLastName]
    .filter(Boolean).join(' ')
  const today = new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })
  const time  = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })

  const currentWeight  = data.measures.weight.current  || data.measures.weight.previous
  const previousWeight = data.measures.weight.previous
  const goalWeight     = data.measures.weight.goal

  const diff = currentWeight && previousWeight
    ? parseFloat(currentWeight) - parseFloat(previousWeight)
    : null

  const weightTrend = diff === null ? null : diff < 0 ? 'down' : diff > 0 ? 'up' : 'same'

  const nextApptFormatted = data.nextAppointment
    ? new Date(data.nextAppointment).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="space-y-5">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Resumen de la consulta
        </span>
      </div>

      {/* Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 'var(--r-md)', backgroundColor: 'var(--green-50)', border: '1px solid var(--green-200)' }}>
        <Check size={16} strokeWidth={2.5} style={{ color: 'var(--green-700)', flexShrink: 0 }} />
        <p style={{ fontSize: '13px', color: 'var(--ink-700)', flex: 1 }}>
          La consulta está lista. Se enviará un resumen por correo a{' '}
          <strong style={{ color: 'var(--ink-900)' }}>{data.email || 'el paciente'}</strong>.
        </p>
        {onDownloadPDF && (
          <button
            onClick={onDownloadPDF}
            disabled={isPDFGenerating}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 'var(--r-sm)',
              border: '1px solid var(--green-200)',
              backgroundColor: 'var(--white)', color: 'var(--green-800)',
              fontSize: '12px', fontWeight: 600, cursor: isPDFGenerating ? 'not-allowed' : 'pointer',
              opacity: isPDFGenerating ? 0.6 : 1, flexShrink: 0,
            }}
          >
            <Download size={14} strokeWidth={2.25} />
            {isPDFGenerating ? 'Generando...' : 'Descargar PDF'}
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Datos del caso */}
        <div style={{ padding: '20px 24px', borderRadius: 'var(--r-md)', backgroundColor: 'var(--green-25)', border: '1px solid var(--green-100)' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>
            Datos del caso
          </p>
          {[
            { label: 'CASO N°',                  value: caseNumber },
            { label: 'FECHA',                    value: `${today} · ${time}` },
            { label: 'NOMBRE COMPLETO',          value: fullName || '—' },
            { label: 'DOCUMENTO DE IDENTIDAD',   value: data.dui || '—' },
            { label: 'CORREO ELECTRÓNICO',       value: data.email || '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ink-400)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink-900)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Feature card */}
        <div style={{ padding: '20px 24px', borderRadius: 'var(--r-md)', backgroundColor: 'var(--green-700)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', bottom: -20, right: -20 }} />
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green-500)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>Progreso</p>

          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--green-500)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2 }}>PESO ANTERIOR</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{previousWeight ? `${previousWeight} kg` : '—'}</p>
          </div>

          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--green-500)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2 }}>PESO ACTUAL</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{currentWeight ? `${currentWeight} kg` : '—'}</p>
              {weightTrend === 'down' && <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '12px', fontWeight: 600, color: 'var(--green-400)' }}><TrendingDown size={14} /> {Math.abs(diff!).toFixed(1)} kg</span>}
              {weightTrend === 'up'   && <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '12px', fontWeight: 600, color: 'var(--warm-100)' }}><TrendingUp size={14} /> +{Math.abs(diff!).toFixed(1)} kg</span>}
              {weightTrend === 'same' && <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}><Minus size={14} /> Sin cambio</span>}
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--green-500)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2 }}>META RESTANTE</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
              {goalWeight && currentWeight ? `${Math.abs(parseFloat(goalWeight) - parseFloat(currentWeight)).toFixed(1)} kg para ${goalWeight} kg` : '—'}
            </p>
          </div>

          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--green-500)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2 }}>PRÓXIMA CITA</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{nextApptFormatted}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
