'use client'

import { StepperData } from './types'

const MAX_CHARS = 500

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--ink-700)',
  marginBottom: 6,
}

const errorMsgStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--error)',
  marginTop: 4,
  lineHeight: '18px',
}

interface Props {
  data: StepperData
  onChange: (data: Partial<StepperData>) => void
  errors?: Record<string, string>
  onValidate?: (errors: Record<string, string>) => void
}

export function Step2Antecedentes({ data, onChange, errors = {}, onValidate }: Props) {

  function handleChange(key: string, value: string) {
    if (value.length > MAX_CHARS) return
    onChange({ [key]: value })
    if (!onValidate) return
    const newErrors = { ...errors }
    if (!value.trim()) {
      newErrors[key] = 'Este campo es requerido'
    } else {
      delete newErrors[key]
    }
    onValidate(newErrors)
  }

  function textareaStyle(key: string): React.CSSProperties {
    return {
      width: '100%',
      padding: '10px 12px',
      borderRadius: 'var(--r-sm)',
      border: `1px solid ${errors[key] ? 'var(--error)' : 'var(--ink-100)'}`,
      fontSize: '14px',
      color: 'var(--ink-900)',
      backgroundColor: 'var(--white)',
      outline: 'none',
      resize: 'vertical',
      lineHeight: '22px',
      minHeight: 90,
    }
  }

  const fields = [
    { key: 'chronicDiseases',    label: '¿Ha padecido o padece alguna enfermedad crónica?', required: true },
    { key: 'nonChronicDiseases', label: '¿Padece alguna otra enfermedad no crónica?',        required: false },
    { key: 'medicalTreatments',  label: '¿Ha recibido o se encuentra recibiendo algún tratamiento médico?', required: false },
  ]

  return (
    <div className="space-y-5">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Antecedentes de enfermedades
        </span>
        <span style={{ fontSize: '11px', color: 'var(--ink-400)', marginLeft: 'auto' }}>
          <span style={{ color: 'var(--error)' }}>*</span> Campos requeridos
        </span>
      </div>

      {fields.map(({ key, label, required }) => {
        const value = (data as any)[key] as string
        const count = value?.length ?? 0
        return (
          <div key={key}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={labelStyle}>
                {label}
                {required && <span style={{ color: 'var(--error)', marginLeft: 4 }}>*</span>}
              </label>
              {/* Contador — mismo patrón que CreatePatientForm */}
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: count > MAX_CHARS * 0.9 ? 'var(--error)' : 'var(--ink-400)',
                tabularNums: true,
              } as React.CSSProperties}>
                {count} / {MAX_CHARS}
              </span>
            </div>
            <textarea
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              style={textareaStyle(key)}
              onFocus={(e) => { e.target.style.borderColor = errors[key] ? 'var(--error)' : 'var(--green-700)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,90,39,0.12)' }}
              onBlur={(e)  => { e.target.style.borderColor = errors[key] ? 'var(--error)' : 'var(--ink-100)'; e.target.style.boxShadow = 'none' }}
            />
            {errors[key] && <p style={errorMsgStyle}>{errors[key]}</p>}
          </div>
        )
      })}
    </div>
  )
}
