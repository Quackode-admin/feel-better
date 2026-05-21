'use client'

import { useState } from 'react'
import { StepperData } from './types'
import { X } from 'lucide-react'

const MAX_CHARS = 300

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--ink-700)', marginBottom: 6,
}
const errorMsgStyle: React.CSSProperties = {
  fontSize: '12px', fontWeight: 500, color: 'var(--error)', marginTop: 4, lineHeight: '18px',
}
const inputStyle: React.CSSProperties = {
  width: '100%', height: 36, padding: '0 10px', borderRadius: 'var(--r-sm)',
  border: '1px solid var(--ink-100)', fontSize: '13px', color: 'var(--ink-900)',
  backgroundColor: 'var(--white)', outline: 'none',
}
const textareaStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 'var(--r-sm)',
  border: '1px solid var(--ink-100)', fontSize: '14px', color: 'var(--ink-900)',
  backgroundColor: 'var(--white)', outline: 'none', resize: 'vertical', minHeight: 80,
}
const thStyle: React.CSSProperties = {
  padding: '8px 12px', fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)',
  letterSpacing: '0.07em', textTransform: 'uppercase', backgroundColor: 'var(--green-25)', textAlign: 'left',
}
const tdLabelStyle: React.CSSProperties = {
  padding: '10px 12px', fontSize: '13px', fontWeight: 500, color: 'var(--ink-700)',
  backgroundColor: 'var(--green-25)', borderTop: '1px solid var(--green-100)',
}
const tdInputStyle: React.CSSProperties = { padding: '6px 12px', borderTop: '1px solid var(--green-100)' }

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
  errors?: Record<string, string>
  onValidate?: (errors: Record<string, string>) => void
}

function RadioGroup({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: 36 }}>
        {['Sí', 'No'].map((opt) => (
          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px', color: 'var(--ink-700)', cursor: 'pointer' }}>
            <input type="radio" checked={value === opt.toLowerCase()} onChange={() => onChange(opt.toLowerCase())}
              style={{ accentColor: 'var(--green-700)' }} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}

// Chip reutilizando el patrón visual del DS (mismo que alergias en CreatePatientForm)
function ChipInput({
  label, items, onAdd, onRemove, placeholder, error,
}: {
  label: string; items: string[]; onAdd: (v: string) => void
  onRemove: (v: string) => void; placeholder?: string; error?: string
}) {
  const [input, setInput] = useState('')

  function add() {
    const trimmed = input.trim()
    if (!trimmed || items.includes(trimmed)) return
    onAdd(trimmed)
    setInput('')
  }

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {/* Chips — mismo estilo DS que alergias */}
      {items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
          {items.map((item) => (
            <span
              key={item}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: '12px', fontWeight: 500,
                padding: '3px 10px',
                borderRadius: 'var(--r-pill)',
                backgroundColor: 'var(--green-100)',
                color: 'var(--green-800)',
                border: '1px solid var(--green-200)',
              }}
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--green-700)' }}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          style={{ ...inputStyle, borderColor: error ? 'var(--error)' : 'var(--ink-100)' }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,90,39,0.12)' }}
          onBlur={(e)  => { e.target.style.borderColor = error ? 'var(--error)' : 'var(--ink-100)'; e.target.style.boxShadow = 'none' }}
        />
        <button
          type="button"
          onClick={add}
          style={{
            padding: '0 14px', height: 36, borderRadius: 'var(--r-sm)',
            border: '1px solid var(--green-200)', backgroundColor: 'var(--white)',
            color: 'var(--green-800)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', flexShrink: 0,
          }}
        >
          Agregar
        </button>
      </div>
      {error && <p style={errorMsgStyle}>{error}</p>}
    </div>
  )
}

export function Step3Lifestyle({ data, onChange, errors = {}, onValidate }: Props) {
  const [intolerances, setIntolerances] = useState<string[]>(
    data.foodIntolerances ? data.foodIntolerances.split(',').map((s) => s.trim()).filter(Boolean) : []
  )
  const [disliked, setDisliked] = useState<string[]>(
    data.dislikedFoods ? data.dislikedFoods.split(',').map((s) => s.trim()).filter(Boolean) : []
  )

  function handleTextarea(key: string, value: string) {
    if (value.length > MAX_CHARS) return
    onChange({ [key]: value })
    if (!onValidate) return
    const newErrors = { ...errors }
    if (!value.trim()) newErrors[key] = 'Este campo es requerido'
    else delete newErrors[key]
    onValidate(newErrors)
  }

  function addIntolerance(v: string) {
    const updated = [...intolerances, v]
    setIntolerances(updated)
    onChange({ foodIntolerances: updated.join(', ') })
  }
  function removeIntolerance(v: string) {
    const updated = intolerances.filter((i) => i !== v)
    setIntolerances(updated)
    onChange({ foodIntolerances: updated.join(', ') })
  }
  function addDisliked(v: string) {
    const updated = [...disliked, v]
    setDisliked(updated)
    onChange({ dislikedFoods: updated.join(', ') })
  }
  function removeDisliked(v: string) {
    const updated = disliked.filter((i) => i !== v)
    setDisliked(updated)
    onChange({ dislikedFoods: updated.join(', ') })
  }

  function charCounter(value: string) {
    const count = value?.length ?? 0
    return (
      <span style={{
        fontSize: '12px', fontWeight: 500,
        color: count > MAX_CHARS * 0.9 ? 'var(--error)' : 'var(--ink-400)',
      }}>
        {count} / {MAX_CHARS}
      </span>
    )
  }

  return (
    <div className="space-y-6">

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Estilo de vida
        </span>
        <span style={{ fontSize: '11px', color: 'var(--ink-400)', marginLeft: 'auto' }}>
          <span style={{ color: 'var(--error)' }}>*</span> Campos requeridos
        </span>
      </div>

      {/* Sueño y actividad */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { key: 'sleepRoutine',    label: 'Rutina de sueño',  required: true },
          { key: 'physicalActivity', label: 'Actividad física', required: true },
        ].map(({ key, label, required }) => {
          const value = (data as any)[key] as string
          return (
            <div key={key}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={labelStyle}>
                  {label}{required && <span style={{ color: 'var(--error)', marginLeft: 4 }}>*</span>}
                </label>
                {charCounter(value)}
              </div>
              <textarea
                value={value}
                onChange={(e) => handleTextarea(key, e.target.value)}
                style={{ ...textareaStyle, borderColor: errors[key] ? 'var(--error)' : 'var(--ink-100)' }}
                onFocus={(e) => { e.target.style.borderColor = errors[key] ? 'var(--error)' : 'var(--green-700)' }}
                onBlur={(e)  => { e.target.style.borderColor = errors[key] ? 'var(--error)' : 'var(--ink-100)' }}
              />
              {errors[key] && <p style={errorMsgStyle}>{errors[key]}</p>}
            </div>
          )
        })}
      </div>

      {/* Chips + Radio */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
        <ChipInput
          label="Intolerancias alimentarias"
          items={intolerances}
          onAdd={addIntolerance}
          onRemove={removeIntolerance}
          placeholder="Ej: Lactosa"
          error={errors.foodIntolerances}
        />
        <ChipInput
          label="Alimentos que no le gustan"
          items={disliked}
          onAdd={addDisliked}
          onRemove={removeDisliked}
          placeholder="Ej: Brócoli"
          error={errors.dislikedFoods}
        />
        <RadioGroup label="¿Fuma?" value={data.smokes} onChange={(v) => onChange({ smokes: v })} />
        <RadioGroup label="¿Consume alcohol?" value={data.drinksAlcohol} onChange={(v) => onChange({ drinksAlcohol: v })} />
      </div>

      {/* Dieta actual */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11l19-9-9 19-2-8-8-2z"/>
          </svg>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            Dieta actual
          </span>
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
