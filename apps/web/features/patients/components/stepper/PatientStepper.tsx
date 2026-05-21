'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepperProgress } from './StepperProgress'
import { Step1Personal }    from './Step1Personal'
import { Step2Antecedentes } from './Step2Antecedentes'
import { Step3Lifestyle }   from './Step3Lifestyle'
import { Step4Measures }    from './Step4Measures'
import { Step5MealPlan }    from './Step5MealPlan'
import { Step6Summary }     from './Step6Summary'
import { INITIAL_DATA, StepperData } from './types'
import { useCreatePatient } from '../../hooks/usePatients'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

const TOTAL = 6

export function PatientStepper() {
  const [step, setStep]   = useState(1)
  const [data, setData]   = useState<StepperData>(INITIAL_DATA)
  const { mutate, isPending } = useCreatePatient()
  const router = useRouter()

  function update(partial: Partial<StepperData>) {
    setData((prev) => ({ ...prev, ...partial }))
  }

  function next() { if (step < TOTAL) setStep((s) => s + 1) }
  function prev() { if (step > 1)     setStep((s) => s - 1) }

  function handleFinish() {
    const fullName = [data.firstName, data.middleName, data.lastName, data.secondLastName]
      .filter(Boolean).join(' ')

    mutate(
      {
        fullName,
        email:           data.email,
        phone:           data.phone || undefined,
        birthDate:       data.birthDate || undefined,
        heightCm:        data.measures.height.current ? parseFloat(data.measures.height.current) * 100 : undefined,
        initialWeightKg: data.measures.weight.previous ? parseFloat(data.measures.weight.previous) : undefined,
        targetWeightKg:  data.measures.weight.goal     ? parseFloat(data.measures.weight.goal)     : undefined,
        medicalNotes:    [data.chronicDiseases, data.nonChronicDiseases, data.medicalTreatments].filter(Boolean).join(' | ') || undefined,
      },
      { onSuccess: () => router.push('/patients') },
    )
  }

  const caseNumber = String(Date.now()).slice(-8).padStart(8, '0')

  const steps: Record<number, React.ReactNode> = {
    1: <Step1Personal      data={data} onChange={update} />,
    2: <Step2Antecedentes  data={data} onChange={update} />,
    3: <Step3Lifestyle     data={data} onChange={update} />,
    4: <Step4Measures      data={data} onChange={update} />,
    5: <Step5MealPlan      data={data} onChange={update} />,
    6: <Step6Summary       data={data} caseNumber={caseNumber} />,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--ink-900)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
          Nueva consulta
        </h1>
        <button
          onClick={() => router.back()}
          style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Cancelar
        </button>
      </div>

      {/* Progress */}
      <div style={{ padding: '0 24px 16px' }}>
        <StepperProgress current={step} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '0 24px', overflowY: 'auto' }}>
        <div
          style={{
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--r-md)',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {steps[step]}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {step > 1 ? (
          <button
            onClick={prev}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 'var(--r-sm)',
              border: '1px solid rgba(255,255,255,0.2)',
              backgroundColor: 'transparent', color: 'white',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} strokeWidth={2.25} />
            Anterior
          </button>
        ) : <div />}

        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          Paso {step} de {TOTAL}
        </span>

        {step < TOTAL ? (
          <button
            onClick={next}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', borderRadius: 'var(--r-sm)',
              border: 'none', backgroundColor: 'var(--green-950)', color: 'white',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            Continuar
            <ArrowRight size={16} strokeWidth={2.25} />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={isPending}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', borderRadius: 'var(--r-sm)',
              border: 'none', backgroundColor: 'var(--green-700)', color: 'white',
              fontSize: '14px', fontWeight: 700, cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.7 : 1,
            }}
          >
            <Check size={16} strokeWidth={2.5} />
            {isPending ? 'Guardando...' : 'Finalizar y enviar'}
          </button>
        )}
      </div>
    </div>
  )
}
