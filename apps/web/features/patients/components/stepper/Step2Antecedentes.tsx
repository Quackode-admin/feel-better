'use client'

import { StepperData } from './types'

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--ink-700)',
  marginBottom: 6,
}

const textareaStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--r-sm)',
  border: '1px solid var(--ink-100)',
  fontSize: '14px',
  color: 'var(--ink-900)',
  backgroundColor: 'var(--white)',
  outline: 'none',
  resize: 'vertical' as const,
  lineHeight: '22px',
  minHeight: 90,
}

interface Props {
  data: StepperData
  onChange: (data: Partial<StepperData>) => void
}

export function Step2Antecedentes({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Antecedentes de enfermedades
        </span>
      </div>

      {[
        { key: 'chronicDiseases',    label: '¿Ha padecido o padece alguna enfermedad crónica?' },
        { key: 'nonChronicDiseases', label: '¿Padece alguna otra enfermedad no crónica?' },
        { key: 'medicalTreatments',  label: '¿Ha recibido o se encuentra recibiendo algún tratamiento médico?' },
      ].map(({ key, label }) => (
        <div key={key}>
          <label style={labelStyle}>{label}</label>
          <textarea
            value={(data as any)[key]}
            onChange={(e) => onChange({ [key]: e.target.value })}
            style={textareaStyle}
            onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,90,39,0.12)' }}
            onBlur={(e)  => { e.target.style.borderColor = 'var(--ink-100)';   e.target.style.boxShadow = 'none' }}
          />
        </div>
      ))}
    </div>
  )
}
