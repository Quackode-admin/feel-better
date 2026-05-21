'use client'

import { StepperData } from './types'

const inputStyle = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  borderRadius: 'var(--r-sm)',
  border: '1px solid var(--ink-100)',
  fontSize: '14px',
  color: 'var(--ink-900)',
  backgroundColor: 'var(--white)',
  outline: 'none',
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--ink-500)',
  marginBottom: 4,
  letterSpacing: '0.02em',
}

interface Props {
  data: StepperData
  onChange: (data: Partial<StepperData>) => void
}

export function Step1Personal({ data, onChange }: Props) {
  return (
    <div>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Datos personales del paciente
        </span>
      </div>

      {/* Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 12, marginBottom: 12 }}>
        {[
          { key: 'dui',           label: 'DUI',                 type: 'text',   value: data.dui },
          { key: 'firstName',     label: 'Primer nombre',       type: 'text',   value: data.firstName },
          { key: 'middleName',    label: 'Segundo nombre',      type: 'text',   value: data.middleName },
          { key: 'lastName',      label: 'Primer apellido',     type: 'text',   value: data.lastName },
          { key: 'secondLastName',label: 'Segundo apellido',    type: 'text',   value: data.secondLastName },
          { key: 'birthDate',     label: 'Fecha de nacimiento', type: 'date',   value: data.birthDate },
          { key: 'phone',         label: 'Número de contacto',  type: 'text',   value: data.phone, placeholder: '0000-0000' },
        ].map(({ key, label, type, value, placeholder }) => (
          <div key={key}>
            <label style={labelStyle}>{label}</label>
            <input
              type={type}
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange({ [key]: e.target.value })}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,90,39,0.12)' }}
              onBlur={(e)  => { e.target.style.borderColor = 'var(--ink-100)';   e.target.style.boxShadow = 'none' }}
            />
          </div>
        ))}

        {/* Sexo */}
        <div>
          <label style={labelStyle}>Sexo</label>
          <select
            value={data.sex}
            onChange={(e) => onChange({ sex: e.target.value })}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Seleccionar</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Correo electrónico</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = 'var(--green-700)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,90,39,0.12)' }}
            onBlur={(e)  => { e.target.style.borderColor = 'var(--ink-100)';   e.target.style.boxShadow = 'none' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Estado civil</label>
          <select
            value={data.maritalStatus}
            onChange={(e) => onChange({ maritalStatus: e.target.value })}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Seleccionar</option>
            <option value="soltero">Soltero</option>
            <option value="casado">Casado</option>
            <option value="divorciado">Divorciado</option>
            <option value="viudo">Viudo</option>
            <option value="union_libre">Unión libre</option>
          </select>
        </div>
      </div>
    </div>
  )
}
