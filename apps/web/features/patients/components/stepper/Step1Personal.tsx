'use client'

import { useState } from 'react'
import { StepperData } from './types'

const inputStyle: React.CSSProperties = {
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

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: 'var(--error)',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--ink-500)',
  marginBottom: 4,
  letterSpacing: '0.02em',
}

const errorMsgStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--error)',
  marginTop: 4,
  lineHeight: '18px',
}

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email']

interface Props {
  data: StepperData
  onChange: (data: Partial<StepperData>) => void
  errors?: Record<string, string>
  onValidate?: (errors: Record<string, string>) => void
}

export function Step1Personal({ data, onChange, errors = {}, onValidate }: Props) {

  function validate(key: string, value: string) {
    if (!onValidate) return
    const newErrors = { ...errors }
    if (key === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newErrors[key] = 'Correo electrónico inválido'
    } else if (REQUIRED_FIELDS.includes(key) && !value.trim()) {
      newErrors[key] = 'Este campo es requerido'
    } else {
      delete newErrors[key]
    }
    onValidate(newErrors)
  }

  function handleChange(key: string, value: string) {
    onChange({ [key]: value })
    validate(key, value)
  }

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    const formatted = digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits
    onChange({ phone: formatted })
  }

  function focusStyle(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.target.style.borderColor = 'var(--green-700)'
    e.target.style.boxShadow = '0 0 0 3px rgba(45,90,39,0.12)'
  }

  function blurStyle(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>, key: string) {
    const hasError = REQUIRED_FIELDS.includes(key) && !e.target.value.trim()
    e.target.style.borderColor = hasError ? 'var(--error)' : 'var(--ink-100)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Datos personales del paciente
        </span>
        <span style={{ fontSize: '11px', color: 'var(--ink-400)', marginLeft: 'auto' }}>
          <span style={{ color: 'var(--error)' }}>*</span> Campos requeridos
        </span>
      </div>

      {/* Row 1 — 8 columnas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 12, marginBottom: 12 }}>
        {/* DUI */}
        <div>
          <label style={labelStyle}>DUI</label>
          <input
            type="text"
            value={data.dui}
            onChange={(e) => handleChange('dui', e.target.value)}
            style={inputStyle}
            onFocus={focusStyle}
            onBlur={(e) => blurStyle(e, 'dui')}
          />
        </div>

        {/* Primer nombre * */}
        <div>
          <label style={labelStyle}>Primer nombre <span style={{ color: 'var(--error)' }}>*</span></label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            style={errors.firstName ? inputErrorStyle : inputStyle}
            onFocus={focusStyle}
            onBlur={(e) => blurStyle(e, 'firstName')}
          />
          {errors.firstName && <p style={errorMsgStyle}>{errors.firstName}</p>}
        </div>

        {/* Segundo nombre */}
        <div>
          <label style={labelStyle}>Segundo nombre</label>
          <input type="text" value={data.middleName} onChange={(e) => handleChange('middleName', e.target.value)}
            style={inputStyle} onFocus={focusStyle} onBlur={(e) => blurStyle(e, 'middleName')} />
        </div>

        {/* Primer apellido * */}
        <div>
          <label style={labelStyle}>Primer apellido <span style={{ color: 'var(--error)' }}>*</span></label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            style={errors.lastName ? inputErrorStyle : inputStyle}
            onFocus={focusStyle}
            onBlur={(e) => blurStyle(e, 'lastName')}
          />
          {errors.lastName && <p style={errorMsgStyle}>{errors.lastName}</p>}
        </div>

        {/* Segundo apellido */}
        <div>
          <label style={labelStyle}>Segundo apellido</label>
          <input type="text" value={data.secondLastName} onChange={(e) => handleChange('secondLastName', e.target.value)}
            style={inputStyle} onFocus={focusStyle} onBlur={(e) => blurStyle(e, 'secondLastName')} />
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label style={labelStyle}>Fecha de nacimiento</label>
          <input type="date" value={data.birthDate} onChange={(e) => handleChange('birthDate', e.target.value)}
            style={inputStyle} onFocus={focusStyle} onBlur={(e) => blurStyle(e, 'birthDate')} />
        </div>

        {/* Teléfono */}
        <div>
          <label style={labelStyle}>Número de contacto</label>
          <input
            type="text"
            value={data.phone}
            placeholder="0000-0000"
            maxLength={9}
            onChange={(e) => handlePhoneChange(e.target.value)}
            style={errors.phone ? inputErrorStyle : inputStyle}
            onFocus={focusStyle}
            onBlur={(e) => blurStyle(e, 'phone')}
          />
          {errors.phone && <p style={errorMsgStyle}>{errors.phone}</p>}
        </div>

        {/* Sexo */}
        <div>
          <label style={labelStyle}>Sexo</label>
          <select value={data.sex} onChange={(e) => handleChange('sex', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusStyle} onBlur={(e) => blurStyle(e, 'sex')}>
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
          <label style={labelStyle}>Correo electrónico <span style={{ color: 'var(--error)' }}>*</span></label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            style={errors.email ? inputErrorStyle : inputStyle}
            onFocus={focusStyle}
            onBlur={(e) => blurStyle(e, 'email')}
          />
          {errors.email && <p style={errorMsgStyle}>{errors.email}</p>}
        </div>
        <div>
          <label style={labelStyle}>Estado civil</label>
          <select value={data.maritalStatus} onChange={(e) => handleChange('maritalStatus', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusStyle} onBlur={(e) => blurStyle(e, 'maritalStatus')}>
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
