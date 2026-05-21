'use client'

import { StepperData } from './types'

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--ink-700)', marginBottom: 6 }
const inputStyle = { width: '100%', height: 36, padding: '0 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--ink-100)', fontSize: '13px', color: 'var(--ink-900)', backgroundColor: 'var(--white)', outline: 'none' }
const textareaStyle = { width: '100%', padding: '10px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--ink-100)', fontSize: '14px', color: 'var(--ink-900)', backgroundColor: 'var(--white)', outline: 'none', resize: 'vertical' as const, minHeight: 80 }
const thStyle = { padding: '8px 12px', fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, backgroundColor: 'var(--green-25)', textAlign: 'left' as const }
const tdLabelStyle = { padding: '10px 12px', fontSize: '13px', fontWeight: 500, color: 'var(--ink-700)', backgroundColor: 'var(--green-25)', borderTop: '1px solid var(--green-100)' }
const tdInputStyle = { padding: '6px 12px', borderTop: '1px solid var(--green-100)' }

const ROWS = [
  { key: 'breakfast', label: 'Desayuno' },
  { key: 'lunch',     label: 'Almuerzo' },
  { key: 'dinner',    label: 'Cena' },
  { key: 'snacks',    label: 'Refrigerios' },
  { key: 'liquids',   label: 'Líquidos' },
]

interface Props {
  data: StepperData
  onChange: (data: Partial<StepperData>) => void
}

function RadioGroup({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {['Sí', 'No'].map((opt) => (
          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px', color: 'var(--ink-700)', cursor: 'pointer' }}>
            <input
              type="radio"
              checked={value === opt.toLowerCase()}
              onChange={() => onChange(opt.toLowerCase())}
              style={{ accentColor: 'var(--green-700)' }}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}

export function Step3Lifestyle({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Section 1 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Estilo de vida</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Rutina de sueño</label>
            <textarea value={data.sleepRoutine} onChange={(e) => onChange({ sleepRoutine: e.target.value })} style={textareaStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)' }} onBlur={(e) => { e.target.style.borderColor = 'var(--ink-100)' }} />
          </div>
          <div>
            <label style={labelStyle}>Actividad física</label>
            <textarea value={data.physicalActivity} onChange={(e) => onChange({ physicalActivity: e.target.value })} style={textareaStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)' }} onBlur={(e) => { e.target.style.borderColor = 'var(--ink-100)' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Intolerancias alimentarias</label>
            <input type="text" value={data.foodIntolerances} onChange={(e) => onChange({ foodIntolerances: e.target.value })} style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)' }} onBlur={(e) => { e.target.style.borderColor = 'var(--ink-100)' }} />
          </div>
          <div>
            <label style={labelStyle}>Alimentos que no le gustan</label>
            <input type="text" value={data.dislikedFoods} onChange={(e) => onChange({ dislikedFoods: e.target.value })} style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)' }} onBlur={(e) => { e.target.style.borderColor = 'var(--ink-100)' }} />
          </div>
          <RadioGroup label="¿Fuma?" value={data.smokes} onChange={(v) => onChange({ smokes: v })} />
          <RadioGroup label="¿Consume alcohol?" value={data.drinksAlcohol} onChange={(v) => onChange({ drinksAlcohol: v })} />
        </div>
      </div>

      {/* Section 2 — Dieta actual */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Dieta actual</span>
        </div>

        <div style={{ border: '1px solid var(--green-100)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '20%' }}></th>
                <th style={thStyle}>Días de semana</th>
                <th style={thStyle}>Fines de semana</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(({ key, label }) => (
                <tr key={key}>
                  <td style={tdLabelStyle}>{label}</td>
                  {(['dietWeekdays', 'dietWeekends'] as const).map((period) => (
                    <td key={period} style={tdInputStyle}>
                      <input
                        type="text"
                        value={data[period][key as keyof typeof data.dietWeekdays]}
                        placeholder="Descripción..."
                        onChange={(e) => onChange({ [period]: { ...data[period], [key]: e.target.value } })}
                        style={{ ...inputStyle, height: 32 }}
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
    </div>
  )
}
