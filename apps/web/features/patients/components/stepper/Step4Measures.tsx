'use client'

import { useState } from 'react'
import { StepperData } from './types'

const MAX_ADVICE = 800
const MAX_OTHER  = 150

const thStyle: React.CSSProperties = {
  padding: '8px 16px', fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)',
  letterSpacing: '0.07em', textTransform: 'uppercase',
  backgroundColor: 'var(--green-25)', textAlign: 'left',
}
const tdStyle: React.CSSProperties = {
  padding: '8px 16px', borderTop: '1px solid var(--green-100)',
  fontSize: '14px', color: 'var(--ink-700)',
}
const numInputStyle: React.CSSProperties = {
  width: '100%', height: 34, padding: '0 10px',
  borderRadius: 'var(--r-sm)', border: '1px solid var(--ink-100)',
  fontSize: '13px', color: 'var(--ink-900)', backgroundColor: 'var(--white)', outline: 'none',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--ink-700)', marginBottom: 6,
}
const errorMsgStyle: React.CSSProperties = {
  fontSize: '12px', fontWeight: 500, color: 'var(--error)', marginTop: 4, lineHeight: '18px',
}

const MEASURES = [
  { key: 'weight', label: 'Peso' },
  { key: 'height', label: 'Talla' },
  { key: 'waist',  label: 'Cintura' },
  { key: 'hip',    label: 'Cadera' },
  { key: 'arm',    label: 'Brazo' },
  { key: 'chest',  label: 'Pecho' },
  { key: 'thigh',  label: 'Muslo' },
  { key: 'bmi',    label: 'Meseta' },
]

const MOTIVATIONS = [
  'Bajar de peso',
  'Ganar masa muscular',
  'Mejorar energía',
  'Control de enfermedad',
  'Hábitos saludables',
  'Otro',
]

// Solo permite números decimales válidos — HU4
function sanitizeNumeric(value: string): string {
  return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
}

function charCounterStyle(count: number, max: number): React.CSSProperties {
  return {
    fontSize: '12px', fontWeight: 500,
    color: count >= max ? 'var(--error)' : count > max * 0.85 ? 'var(--warning)' : 'var(--ink-400)',
  }
}

interface Props {
  data: StepperData
  onChange: (data: Partial<StepperData>) => void
  errors?: Record<string, string>
  onValidate?: (errors: Record<string, string>) => void
}

export function Step4Measures({ data, onChange, errors = {}, onValidate }: Props) {
  const [showOther, setShowOther] = useState(data.motivation === 'Otro')

  function updateMeasure(key: string, field: 'goal' | 'previous' | 'current', value: string) {
    const sanitized = sanitizeNumeric(value)
    onChange({
      measures: {
        ...data.measures,
        [key]: { ...data.measures[key as keyof typeof data.measures], [field]: sanitized },
      },
    })
  }

  function handleMotivation(value: string) {
    setShowOther(value === 'Otro')
    onChange({ motivation: value })
    if (onValidate) {
      const newErrors = { ...errors }
      delete newErrors.motivation
      onValidate(newErrors)
    }
  }

  function handleDate(value: string) {
    onChange({ nextAppointment: value })
    if (onValidate) {
      const newErrors = { ...errors }
      if (!value) newErrors.nextAppointment = 'Este campo es requerido'
      else delete newErrors.nextAppointment
      onValidate(newErrors)
    }
  }

  function handleAdvice(value: string) {
    if (value.length > MAX_ADVICE) return
    onChange({ personalizedAdvice: value })
  }

  function handleOtherMotivation(value: string) {
    if (value.length > MAX_OTHER) return
    onChange({ motivationOther: value } as any)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Estado actual y metas
        </span>
        <span style={{ fontSize: '11px', color: 'var(--ink-400)', marginLeft: 'auto' }}>
          <span style={{ color: 'var(--error)' }}>*</span> Campos requeridos
        </span>
      </div>

      {/* Cuadrícula de medidas */}
      <div style={{ border: '1px solid var(--green-100)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: '20%' }}>Medida</th>
              <th style={thStyle}>Meta</th>
              <th style={thStyle}>Anterior</th>
              <th style={thStyle}>Actual (hoy)</th>
            </tr>
          </thead>
          <tbody>
            {MEASURES.map(({ key, label }) => (
              <tr key={key}>
                <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--ink-900)', backgroundColor: 'var(--green-25)' }}>
                  {label}
                </td>
                {(['goal', 'previous', 'current'] as const).map((field) => (
                  <td key={field} style={{ ...tdStyle, padding: '6px 12px' }}>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={data.measures[key as keyof typeof data.measures][field]}
                      placeholder={field === 'current' ? 'Ingresar...' : '—'}
                      onChange={(e) => updateMeasure(key, field, e.target.value)}
                      style={numInputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,90,39,0.12)' }}
                      onBlur={(e)  => { e.target.style.borderColor = 'var(--ink-100)';   e.target.style.boxShadow = 'none' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Motivación + Fecha */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Motivación principal</label>
          <select
            value={data.motivation}
            onChange={(e) => handleMotivation(e.target.value)}
            style={{ width: '100%', height: 40, padding: '0 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--ink-100)', fontSize: '14px', color: 'var(--ink-900)', backgroundColor: 'var(--white)', outline: 'none', cursor: 'pointer' }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)' }}
            onBlur={(e)  => { e.target.style.borderColor = 'var(--ink-100)' }}
          >
            <option value="">Seleccionar...</option>
            {MOTIVATIONS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          {/* Campo adicional si selecciona "Otro" — HU4 */}
          {showOther && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Especificar motivación</label>
                <span style={charCounterStyle((data as any).motivationOther?.length ?? 0, MAX_OTHER)}>
                  {(data as any).motivationOther?.length ?? 0} / {MAX_OTHER}
                </span>
              </div>
              <input
                type="text"
                value={(data as any).motivationOther ?? ''}
                placeholder="Describe la motivación..."
                maxLength={MAX_OTHER}
                onChange={(e) => handleOtherMotivation(e.target.value)}
                style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--ink-100)', fontSize: '14px', color: 'var(--ink-900)', backgroundColor: 'var(--white)', outline: 'none' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,90,39,0.12)' }}
                onBlur={(e)  => { e.target.style.borderColor = 'var(--ink-100)';   e.target.style.boxShadow = 'none' }}
              />
            </div>
          )}
        </div>

        {/* Fecha próxima consulta — obligatoria HU4 */}
        <div>
          <label style={labelStyle}>
            Fecha próxima consulta <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <input
            type="date"
            value={data.nextAppointment}
            onChange={(e) => handleDate(e.target.value)}
            style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 'var(--r-sm)', border: `1px solid ${errors.nextAppointment ? 'var(--error)' : 'var(--ink-100)'}`, fontSize: '14px', color: 'var(--ink-900)', backgroundColor: 'var(--white)', outline: 'none' }}
            onFocus={(e) => { e.target.style.borderColor = errors.nextAppointment ? 'var(--error)' : 'var(--green-700)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,90,39,0.12)' }}
            onBlur={(e)  => { e.target.style.borderColor = errors.nextAppointment ? 'var(--error)' : 'var(--ink-100)';   e.target.style.boxShadow = 'none' }}
          />
          {errors.nextAppointment && <p style={errorMsgStyle}>{errors.nextAppointment}</p>}
        </div>
      </div>

      {/* Recomendaciones — 800 chars HU4 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={labelStyle}>Recomendaciones del paciente</label>
          <span style={charCounterStyle(data.personalizedAdvice?.length ?? 0, MAX_ADVICE)}>
            {data.personalizedAdvice?.length ?? 0} / {MAX_ADVICE} caracteres
          </span>
        </div>
        <textarea
          value={data.personalizedAdvice ?? ''}
          onChange={(e) => handleAdvice(e.target.value)}
          maxLength={MAX_ADVICE}
          placeholder="Recomendaciones para el paciente..."
          style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--ink-100)', fontSize: '14px', color: 'var(--ink-900)', backgroundColor: 'var(--white)', outline: 'none', resize: 'vertical', minHeight: 80 }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)' }}
          onBlur={(e)  => { e.target.style.borderColor = 'var(--ink-100)' }}
        />
      </div>
    </div>
  )
}
