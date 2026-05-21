'use client'

import { Check } from 'lucide-react'

const STEPS = [
  'Datos personales',
  'Antecedentes',
  'Estilo de vida',
  'Medidas y metas',
  'Plan alimenticio',
  'Resumen',
]

interface StepperProgressProps {
  current: number
}

export function StepperProgress({ current }: StepperProgressProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--green-100)',
        borderRadius: 'var(--r-md)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
      }}
    >
      {STEPS.map((label, idx) => {
        const step     = idx + 1
        const done     = step < current
        const active   = step === current
        const isLast   = idx === STEPS.length - 1

        return (
          <div
            key={step}
            style={{ display: 'flex', alignItems: 'center', flex: isLast ? 0 : 1 }}
          >
            {/* Circle + label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  flexShrink: 0,
                  backgroundColor: done ? 'var(--green-950)' : active ? 'var(--green-950)' : 'var(--green-100)',
                  color: done || active ? 'white' : 'var(--ink-400)',
                  transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              >
                {done ? <Check size={14} strokeWidth={2.5} /> : step}
              </div>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--ink-900)' : done ? 'var(--ink-700)' : 'var(--ink-400)',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  margin: '0 12px',
                  backgroundColor: done ? 'var(--green-700)' : 'var(--green-100)',
                  transition: 'background-color 150ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
