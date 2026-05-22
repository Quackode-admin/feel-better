'use client'

import { StepperData } from './types'

const MAX_CELL = 150

const thStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)',
  letterSpacing: '0.07em', textTransform: 'uppercase',
  backgroundColor: 'var(--green-25)', textAlign: 'left',
}
const tdDayStyle: React.CSSProperties = {
  padding: '8px 14px', borderTop: '1px solid var(--green-100)',
  fontSize: '13px', fontWeight: 700, color: 'var(--ink-700)',
  backgroundColor: 'var(--green-25)', width: 50, textAlign: 'center',
}
const tdInputStyle: React.CSSProperties = {
  padding: '6px 10px', borderTop: '1px solid var(--green-100)', verticalAlign: 'top',
}
const inputStyle: React.CSSProperties = {
  width: '100%', height: 32, padding: '0 8px',
  borderRadius: 'var(--r-sm)', border: '1px solid transparent',
  fontSize: '13px', color: 'var(--ink-900)', backgroundColor: 'transparent', outline: 'none',
}

const COLS = [
  { key: 'breakfast', label: 'Desayuno' },
  { key: 'lunch',     label: 'Almuerzo' },
  { key: 'dinner',    label: 'Cena' },
  { key: 'snacks',    label: 'Meriendas' },
]

function charCounterStyle(count: number, max: number): React.CSSProperties {
  return {
    fontSize: '10px', fontWeight: 500, display: 'block', textAlign: 'right', marginTop: 2,
    color: count >= max ? 'var(--error)' : count > max * 0.85 ? 'var(--warning)' : 'var(--ink-400)',
  }
}

interface Props {
  data: StepperData
  onChange: (data: Partial<StepperData>) => void
  errors?: Record<string, string>
  onValidate?: (errors: Record<string, string>) => void
}

export function Step5MealPlan({ data, onChange, errors = {}, onValidate }: Props) {

  function updateRow(idx: number, key: string, value: string) {
    if (value.length > MAX_CELL) return
    const updated = data.mealPlan.map((row, i) => i === idx ? { ...row, [key]: value } : row)
    onChange({ mealPlan: updated })
    // Limpiar error si hay al menos un campo con contenido
    if (onValidate) {
      const hasAny = updated.some((row) => Object.values(row).filter((v) => v !== row.day).some((v) => (v as string).trim()))
      const newErrors = { ...errors }
      if (hasAny) delete newErrors.mealPlan
      onValidate(newErrors)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Plan de alimentación semanal
        </span>
        <span style={{ fontSize: '11px', color: 'var(--ink-400)', marginLeft: 'auto' }}>
          <span style={{ color: 'var(--error)' }}>*</span> Al menos un campo requerido
        </span>
      </div>

      <div style={{ border: `1px solid ${errors.mealPlan ? 'var(--error)' : 'var(--green-100)'}`, borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: 50 }}></th>
              {COLS.map(({ key, label }) => <th key={key} style={thStyle}>{label}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.mealPlan.map((row, idx) => (
              <tr key={row.day}>
                <td style={tdDayStyle}>{row.day}</td>
                {COLS.map(({ key }) => {
                  const cellValue = row[key as keyof typeof row] as string ?? ''
                  const cellCount = cellValue.length
                  return (
                    <td key={key} style={tdInputStyle}>
                      <input
                        type="text"
                        value={cellValue}
                        maxLength={MAX_CELL}
                        onChange={(e) => updateRow(idx, key, e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid var(--green-700)'
                          e.target.style.backgroundColor = 'white'
                          e.target.style.boxShadow = '0 0 0 2px rgba(45,90,39,0.08)'
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '1px solid transparent'
                          e.target.style.backgroundColor = 'transparent'
                          e.target.style.boxShadow = 'none'
                        }}
                      />
                      <span style={charCounterStyle(cellCount, MAX_CELL)}>
                        {cellCount} / {MAX_CELL}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {errors.mealPlan && (
        <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--error)', marginTop: 6 }}>
          {errors.mealPlan}
        </p>
      )}
    </div>
  )
}
