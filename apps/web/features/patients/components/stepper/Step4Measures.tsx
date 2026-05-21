'use client'

import { StepperData } from './types'

const thStyle = { padding: '8px 16px', fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, backgroundColor: 'var(--green-25)', textAlign: 'left' as const }
const tdStyle = { padding: '8px 16px', borderTop: '1px solid var(--green-100)', fontSize: '14px', color: 'var(--ink-700)' }
const inputStyle = { width: '100%', height: 34, padding: '0 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--ink-100)', fontSize: '13px', color: 'var(--ink-900)', backgroundColor: 'var(--white)', outline: 'none' }
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--ink-700)', marginBottom: 6 }

const MEASURES = [
  { key: 'weight', label: 'Peso (kg)' },
  { key: 'height', label: 'Talla (m)' },
  { key: 'waist',  label: 'Cintura (cm)' },
  { key: 'hip',    label: 'Cadera (cm)' },
  { key: 'arm',    label: 'Brazo (cm)' },
  { key: 'chest',  label: 'Pecho (cm)' },
  { key: 'thigh',  label: 'Muslo (cm)' },
  { key: 'bmi',    label: 'IMC' },
]

const MOTIVATIONS = ['Bajar de peso', 'Ganar masa muscular', 'Mejorar energía', 'Control de enfermedad', 'Hábitos saludables', 'Otro']

interface Props {
  data: StepperData
  onChange: (data: Partial<StepperData>) => void
}

export function Step4Measures({ data, onChange }: Props) {
  function updateMeasure(key: string, field: 'goal' | 'previous' | 'current', value: string) {
    onChange({ measures: { ...data.measures, [key]: { ...data.measures[key as keyof typeof data.measures], [field]: value } } })
  }

  return (
    <div className="space-y-6">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Estado actual y metas</span>
        </div>

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
                  <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--ink-900)', backgroundColor: 'var(--green-25)' }}>{label}</td>
                  {(['goal', 'previous', 'current'] as const).map((field) => (
                    <td key={field} style={{ ...tdStyle, padding: '6px 12px' }}>
                      <input
                        type="text"
                        value={data.measures[key as keyof typeof data.measures][field]}
                        placeholder={field === 'current' ? 'Ingresar...' : '—'}
                        onChange={(e) => updateMeasure(key, field, e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)' }}
                        onBlur={(e)  => { e.target.style.borderColor = 'var(--ink-100)' }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Motivación principal</label>
          <select value={data.motivation} onChange={(e) => onChange({ motivation: e.target.value })}
            style={{ ...inputStyle, height: 40, cursor: 'pointer' }}>
            <option value="">Seleccionar...</option>
            {MOTIVATIONS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Fecha próxima consulta</label>
          <input type="date" value={data.nextAppointment} onChange={(e) => onChange({ nextAppointment: e.target.value })}
            style={{ ...inputStyle, height: 40 }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)' }}
            onBlur={(e)  => { e.target.style.borderColor = 'var(--ink-100)' }} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Asesoría personalizada</label>
        <textarea value={data.personalizedAdvice} onChange={(e) => onChange({ personalizedAdvice: e.target.value })}
          placeholder="Recomendaciones para el paciente..."
          style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--ink-100)', fontSize: '14px', color: 'var(--ink-900)', backgroundColor: 'var(--white)', outline: 'none', resize: 'vertical', minHeight: 80 }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)' }}
          onBlur={(e)  => { e.target.style.borderColor = 'var(--ink-100)' }} />
      </div>
    </div>
  )
}
